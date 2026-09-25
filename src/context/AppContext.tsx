import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  INITIAL_AGENCIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DESTINATIONS,
  INITIAL_EXCHANGE_RATES,
  INITIAL_PRICING_RULES,
  INITIAL_TESTIMONIALS,
} from '../data/initialData';
import {
  Agency,
  DepartureAnnouncement,
  Destination,
  ExchangeRates,
  PricingRule,
  PricingSettings,
  Testimonial,
  TrackedParcel,
  TrackingErrorKind,
} from '../types';
import {
  adminLogin,
  adminLogout,
  checkAdminSession,
  fetchAdminAnnouncements,
  fetchPublicAnnouncements,
  fetchPublicPricing,
  savePricing as savePricingApi,
  saveAnnouncements,
  fetchTracking,
  TrackingLookupError,
} from '../lib/api';

interface AppContextType {
  announcements: DepartureAnnouncement[];
  agencies: Agency[];
  destinations: Destination[];
  pricingRules: PricingRule[];
  exchangeRates: ExchangeRates;
  testimonials: Testimonial[];
  currentView: 'public' | 'admin' | 'mentions-legales' | 'confidentialite' | 'cgv';
  isAdminAuthenticated: boolean;
  isAdminAuthChecking: boolean;
  activeTrackedItem: TrackedParcel | null;
  activeSearchCode: string;
  // Recherche de suivi qui n'a pas abouti (null si pas d'erreur) : numéro
  // recherché et raison ; le message traduit est construit par TrackingSection.
  trackingError: { code: string; kind: TrackingErrorKind } | null;
  // Vrai pendant l'interrogation de ColisBox.
  trackingLoading: boolean;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;

  // Navigation & Auth
  setCurrentView: (view: 'public' | 'admin' | 'mentions-legales' | 'confidentialite' | 'cgv') => void;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;

  // Tracking actions
  searchPackage: (trackingNumber: string) => Promise<void>;
  clearTracking: () => void;

  // CRUD Announcements — enregistrées sur le serveur (lèvent une erreur si
  // l'enregistrement échoue, pour que l'admin puisse l'afficher).
  addAnnouncement: (announcement: Omit<DepartureAnnouncement, 'id' | 'createdAt'>) => Promise<void>;
  updateAnnouncement: (id: string, announcement: Partial<DepartureAnnouncement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  toggleAnnouncementActive: (id: string) => Promise<void>;
  // Message renseigné quand les annonces n'ont pas pu être chargées depuis
  // le serveur (le site affiche alors les données initiales).
  announcementsSyncError: string | null;
  // Vrai tant que la première lecture des annonces depuis le serveur n'est pas terminée.
  announcementsLoading: boolean;
  // Vrai seulement si la liste affichée vient du serveur (départs réellement
  // publiés depuis l'admin), faux pour les données de repli INITIAL_ANNOUNCEMENTS.
  announcementsFromServer: boolean;

  // CRUD Agencies
  addAgency: (agency: Omit<Agency, 'id'>) => void;
  updateAgency: (id: string, agency: Partial<Agency>) => void;
  deleteAgency: (id: string) => void;

  // CRUD Destinations
  addDestination: (destination: Omit<Destination, 'id'>) => void;
  updateDestination: (id: string, destination: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;

  // Tarifs du simulateur — enregistrés sur le serveur (lève une erreur si
  // l'enregistrement échoue, pour que l'admin puisse l'afficher).
  savePricing: (pricing: PricingSettings) => Promise<void>;

  // CRUD Testimonials
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'date'>) => void;
  deleteTestimonial: (id: string) => void;

  // Reset demo
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Annonces de départ : source de vérité = serveur (GET /api/announcements).
  // INITIAL_ANNOUNCEMENTS n'est qu'un affichage de repli tant que rien n'a été
  // publié depuis l'admin, ou si l'API est injoignable.
  const [announcements, setAnnouncements] = useState<DepartureAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [announcementsSyncError, setAnnouncementsSyncError] = useState<string | null>(null);
  const [announcementsLoading, setAnnouncementsLoading] = useState<boolean>(true);
  const [announcementsFromServer, setAnnouncementsFromServer] = useState<boolean>(false);

  // LocalStorage state initialization (données encore locales au navigateur)

  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem('thg_agencies');
    return saved ? JSON.parse(saved) : INITIAL_AGENCIES;
  });

  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem('thg_destinations');
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  // Tarifs du simulateur : source de vérité = serveur (GET /api/pricing).
  // INITIAL_PRICING_RULES n'est qu'un affichage de repli tant qu'aucune grille
  // n'a été enregistrée depuis l'admin, ou si l'API est injoignable.
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(INITIAL_EXCHANGE_RATES);

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('thg_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [currentView, setCurrentView] = useState<
    'public' | 'admin' | 'mentions-legales' | 'confidentialite' | 'cgv'
  >('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminAuthChecking, setIsAdminAuthChecking] = useState<boolean>(true);

  // Vérifie auprès du backend si une session admin valide existe déjà
  // (cookie de session httpOnly signé côté serveur — plus de mot de
  // passe stocké ou comparé côté client).
  useEffect(() => {
    checkAdminSession()
      .then((authenticated) => setIsAdminAuthenticated(authenticated))
      .finally(() => setIsAdminAuthChecking(false));
  }, []);

  // Suivi de colis : données réelles de ColisBox, via le serveur du site
  // (GET /api/tracking/:numero). Aucun colis n'est stocké dans le navigateur.
  const [activeTrackedItem, setActiveTrackedItem] = useState<TrackedParcel | null>(null);
  const [activeSearchCode, setActiveSearchCode] = useState<string>('');
  const [trackingError, setTrackingError] = useState<{ code: string; kind: TrackingErrorKind } | null>(null);
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false);
  // Numéro de la dernière recherche lancée : une réponse plus ancienne,
  // arrivée après, est ignorée.
  const latestTrackingSearch = useRef(0);
  const [language, setLanguage] = useState<'fr' | 'en'>(() => {
    return (localStorage.getItem('thg_language') as 'fr' | 'en') || 'fr';
  });

  const handleSetLanguage = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('thg_language', lang);
  };

  // Ancienne copie locale des annonces (avant l'enregistrement serveur) :
  // supprimée pour ne jamais être confondue avec les données publiées.
  useEffect(() => {
    localStorage.removeItem('thg_announcements');
  }, []);

  // Chargement des annonces : liste publique (départs actifs) pour les
  // visiteurs, liste complète (actifs + masqués) pour l'admin connecté.
  useEffect(() => {
    let cancelled = false;
    const load = isAdminAuthenticated ? fetchAdminAnnouncements : fetchPublicAnnouncements;
    load()
      .then((list) => {
        if (cancelled) return;
        if (list) {
          setAnnouncements(list);
          setAnnouncementsFromServer(true);
        }
        setAnnouncementsSyncError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setAnnouncementsSyncError(err.message || 'Serveur injoignable.');
      })
      .finally(() => {
        if (!cancelled) setAnnouncementsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAdminAuthenticated]);

  // Sync to localStorage

  useEffect(() => {
    localStorage.setItem('thg_agencies', JSON.stringify(agencies));
  }, [agencies]);

  useEffect(() => {
    localStorage.setItem('thg_destinations', JSON.stringify(destinations));
  }, [destinations]);

  // Ancienne copie locale des tarifs (visible seulement dans le navigateur de
  // l'admin) : supprimée, les tarifs viennent du serveur.
  useEffect(() => {
    localStorage.removeItem('thg_pricing');
    let cancelled = false;
    fetchPublicPricing()
      .then((pricing) => {
        if (cancelled || !pricing) return;
        setPricingRules(pricing.rules);
        setExchangeRates(pricing.exchangeRates);
      })
      .catch((err: Error) => console.warn('[pricing]', err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('thg_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.removeItem('thg_tracking_items');
  }, []);

  const loginAdmin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await adminLogin(password);
      setIsAdminAuthenticated(true);
      return { success: true };
    } catch (err) {
      setIsAdminAuthenticated(false);
      return { success: false, error: (err as Error).message };
    }
  };

  const logoutAdmin = () => {
    adminLogout().catch(() => {
      /* la déconnexion locale prime même si l'appel réseau échoue */
    });
    setIsAdminAuthenticated(false);
    setCurrentView('public');
  };

  // Suivi de colis — interroge ColisBox via le serveur du site. N'affiche que
  // des colis réellement enregistrés ; sinon un message honnête (introuvable,
  // numéro invalide, service indisponible) et le contact WhatsApp.
  const searchPackage = async (trackingNumber: string): Promise<void> => {
    const cleanCode = trackingNumber.trim().toUpperCase().replace(/\s+/g, '');
    const searchId = ++latestTrackingSearch.current;
    setActiveSearchCode(cleanCode);
    setActiveTrackedItem(null);
    setTrackingError(null);

    if (!cleanCode) {
      setTrackingLoading(false);
      return;
    }

    setTrackingLoading(true);
    try {
      const parcel = await fetchTracking(cleanCode);
      if (searchId !== latestTrackingSearch.current) return;
      setActiveTrackedItem(parcel);
    } catch (err) {
      if (searchId !== latestTrackingSearch.current) return;
      const kind = err instanceof TrackingLookupError ? err.kind : 'unavailable';
      setTrackingError({ code: cleanCode, kind });
    } finally {
      if (searchId === latestTrackingSearch.current) setTrackingLoading(false);
    }
  };

  const clearTracking = () => {
    latestTrackingSearch.current++;
    setTrackingLoading(false);
    setActiveTrackedItem(null);
    setActiveSearchCode('');
    setTrackingError(null);
  };

  // Announcements CRUD — chaque modification enregistre la liste complète sur
  // le serveur ; l'état local n'est mis à jour qu'après confirmation du
  // serveur, pour que l'admin voie exactement ce que voient les visiteurs.
  const persistAnnouncements = async (next: DepartureAnnouncement[]) => {
    const saved = await saveAnnouncements(next);
    setAnnouncements(saved);
    setAnnouncementsFromServer(true);
    setAnnouncementsSyncError(null);
  };

  const addAnnouncement = (item: Omit<DepartureAnnouncement, 'id' | 'createdAt'>) => {
    const newAnnouncement: DepartureAnnouncement = {
      ...item,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    return persistAnnouncements([newAnnouncement, ...announcements]);
  };

  const updateAnnouncement = (id: string, changes: Partial<DepartureAnnouncement>) => {
    return persistAnnouncements(
      announcements.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const deleteAnnouncement = (id: string) => {
    return persistAnnouncements(announcements.filter((item) => item.id !== id));
  };

  const toggleAnnouncementActive = (id: string) => {
    return persistAnnouncements(
      announcements.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  // Agencies CRUD
  const addAgency = (item: Omit<Agency, 'id'>) => {
    const newAgency: Agency = {
      ...item,
      id: `ag-${Date.now()}`,
    };
    setAgencies((prev) => [...prev, newAgency]);
  };

  const updateAgency = (id: string, changes: Partial<Agency>) => {
    setAgencies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const deleteAgency = (id: string) => {
    setAgencies((prev) => prev.filter((item) => item.id !== id));
  };

  // Destinations CRUD
  const addDestination = (item: Omit<Destination, 'id'>) => {
    const newDest: Destination = {
      ...item,
      id: `dest-${Date.now()}`,
    };
    setDestinations((prev) => [...prev, newDest]);
  };

  const updateDestination = (id: string, changes: Partial<Destination>) => {
    setDestinations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const deleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((item) => item.id !== id));
  };

  // Pricing
  const savePricing = async (pricing: PricingSettings) => {
    const saved = await savePricingApi(pricing);
    setPricingRules(saved.rules);
    setExchangeRates(saved.exchangeRates);
  };

  // Testimonials
  const addTestimonial = (item: Omit<Testimonial, 'id' | 'date'>) => {
    const newTest: Testimonial = {
      ...item,
      id: `test-${Date.now()}`,
      date: 'Récemment',
    };
    setTestimonials((prev) => [newTest, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
  };

  // Réinitialise uniquement les données encore locales au navigateur. Les
  // annonces de départ et les tarifs, enregistrés sur le serveur, ne sont pas
  // touchés ici (sinon un clic effacerait ce que voient tous les visiteurs).
  const resetAllData = () => {
    setAgencies(INITIAL_AGENCIES);
    setDestinations(INITIAL_DESTINATIONS);
    setTestimonials(INITIAL_TESTIMONIALS);
    localStorage.removeItem('thg_agencies');
    localStorage.removeItem('thg_destinations');
    localStorage.removeItem('thg_pricing');
    localStorage.removeItem('thg_testimonials');
    localStorage.removeItem('thg_tracking_items');
  };

  return (
    <AppContext.Provider
      value={{
        announcements,
        agencies,
        destinations,
        pricingRules,
        exchangeRates,
        testimonials,
        currentView,
        isAdminAuthenticated,
        isAdminAuthChecking,
        activeTrackedItem,
        activeSearchCode,
        trackingError,
        trackingLoading,
        language,
        setLanguage: handleSetLanguage,
        setCurrentView,
        loginAdmin,
        logoutAdmin,
        searchPackage,
        clearTracking,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementActive,
        announcementsSyncError,
        announcementsLoading,
        announcementsFromServer,
        addAgency,
        updateAgency,
        deleteAgency,
        addDestination,
        updateDestination,
        deleteDestination,
        savePricing,
        addTestimonial,
        deleteTestimonial,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
