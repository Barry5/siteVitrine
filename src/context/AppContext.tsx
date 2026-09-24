import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_AGENCIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DESTINATIONS,
  INITIAL_PRICING_RULES,
  INITIAL_TESTIMONIALS,
  INITIAL_TRACKING_ITEMS,
} from '../data/initialData';
import {
  Agency,
  DepartureAnnouncement,
  Destination,
  PricingRule,
  Testimonial,
  TrackingItem,
} from '../types';
import {
  adminLogin,
  adminLogout,
  checkAdminSession,
  fetchAdminAnnouncements,
  fetchPublicAnnouncements,
  saveAnnouncements,
} from '../lib/api';

interface AppContextType {
  announcements: DepartureAnnouncement[];
  agencies: Agency[];
  destinations: Destination[];
  pricingRules: PricingRule[];
  testimonials: Testimonial[];
  trackingItems: Record<string, TrackingItem>;
  currentView: 'public' | 'admin' | 'mentions-legales' | 'confidentialite' | 'cgv';
  isAdminAuthenticated: boolean;
  isAdminAuthChecking: boolean;
  activeTrackedItem: TrackingItem | null;
  activeSearchCode: string;
  // Numéro recherché introuvable (null si pas d'erreur) ; le message traduit
  // est construit par TrackingSection.
  trackingError: string | null;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;

  // Navigation & Auth
  setCurrentView: (view: 'public' | 'admin' | 'mentions-legales' | 'confidentialite' | 'cgv') => void;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;

  // Tracking actions
  searchPackage: (trackingNumber: string) => TrackingItem | null;
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

  // CRUD Pricing
  updatePricingRule: (id: string, rule: Partial<PricingRule>) => void;

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

  const [pricingRules, setPricingRules] = useState<PricingRule[]>(() => {
    const saved = localStorage.getItem('thg_pricing');
    return saved ? JSON.parse(saved) : INITIAL_PRICING_RULES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('thg_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  // Suivi de colis : aucune source de données réelle n'est encore branchée
  // (INITIAL_TRACKING_ITEMS est vide). Plus de copie dans le navigateur :
  // l'ancienne version y enregistrait des colis de démonstration et des
  // suivis inventés.
  const [trackingItems, setTrackingItems] = useState<Record<string, TrackingItem>>(INITIAL_TRACKING_ITEMS);

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

  const [activeTrackedItem, setActiveTrackedItem] = useState<TrackingItem | null>(null);
  const [activeSearchCode, setActiveSearchCode] = useState<string>('');
  const [trackingError, setTrackingError] = useState<string | null>(null);
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

  useEffect(() => {
    localStorage.setItem('thg_pricing', JSON.stringify(pricingRules));
  }, [pricingRules]);

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

  // Search package — ne renvoie QUE des colis réellement connus. Un numéro
  // inconnu affiche « aucun colis trouvé » (plus de faux suivi généré).
  const searchPackage = (trackingNumber: string): TrackingItem | null => {
    const cleanCode = trackingNumber.trim().toUpperCase();
    setActiveSearchCode(cleanCode);

    if (!cleanCode) {
      setActiveTrackedItem(null);
      setTrackingError(null);
      return null;
    }

    const item = trackingItems[cleanCode];
    if (item) {
      setActiveTrackedItem(item);
      setTrackingError(null);
      return item;
    }

    setActiveTrackedItem(null);
    setTrackingError(cleanCode);
    return null;
  };

  const clearTracking = () => {
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
  const updatePricingRule = (id: string, changes: Partial<PricingRule>) => {
    setPricingRules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
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
  // annonces de départ, publiées sur le serveur, ne sont pas touchées ici
  // (sinon un clic effacerait les départs visibles par tous les visiteurs).
  const resetAllData = () => {
    setAgencies(INITIAL_AGENCIES);
    setDestinations(INITIAL_DESTINATIONS);
    setPricingRules(INITIAL_PRICING_RULES);
    setTestimonials(INITIAL_TESTIMONIALS);
    setTrackingItems(INITIAL_TRACKING_ITEMS);
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
        testimonials,
        trackingItems,
        currentView,
        isAdminAuthenticated,
        isAdminAuthChecking,
        activeTrackedItem,
        activeSearchCode,
        trackingError,
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
        updatePricingRule,
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
