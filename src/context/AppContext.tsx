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

interface AppContextType {
  announcements: DepartureAnnouncement[];
  agencies: Agency[];
  destinations: Destination[];
  pricingRules: PricingRule[];
  testimonials: Testimonial[];
  trackingItems: Record<string, TrackingItem>;
  currentView: 'public' | 'admin';
  isAdminAuthenticated: boolean;
  activeTrackedItem: TrackingItem | null;
  activeSearchCode: string;
  trackingError: string | null;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;

  // Navigation & Auth
  setCurrentView: (view: 'public' | 'admin') => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Tracking actions
  searchPackage: (trackingNumber: string) => TrackingItem | null;
  clearTracking: () => void;

  // CRUD Announcements
  addAnnouncement: (announcement: Omit<DepartureAnnouncement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<DepartureAnnouncement>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementActive: (id: string) => void;

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
  // LocalStorage state initialization
  const [announcements, setAnnouncements] = useState<DepartureAnnouncement[]>(() => {
    const saved = localStorage.getItem('thg_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

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

  const [trackingItems, setTrackingItems] = useState<Record<string, TrackingItem>>(() => {
    const saved = localStorage.getItem('thg_tracking_items');
    return saved ? JSON.parse(saved) : INITIAL_TRACKING_ITEMS;
  });

  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('thg_admin_auth') === 'true';
  });

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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('thg_announcements', JSON.stringify(announcements));
  }, [announcements]);

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
    localStorage.setItem('thg_tracking_items', JSON.stringify(trackingItems));
  }, [trackingItems]);

  const loginAdmin = (password: string): boolean => {
    // Default demo password is admin123 or thiaguil2026
    if (password === 'admin123' || password === 'thiaguil2026' || password === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('thg_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('thg_admin_auth');
    setCurrentView('public');
  };

  // Search package
  const searchPackage = (trackingNumber: string): TrackingItem | null => {
    const cleanCode = trackingNumber.trim().toUpperCase();
    setActiveSearchCode(cleanCode);

    if (!cleanCode) {
      setActiveTrackedItem(null);
      setTrackingError('Veuillez renseigner un numéro de suivi valide (ex: THG-NY-8910).');
      return null;
    }

    if (trackingItems[cleanCode]) {
      const item = trackingItems[cleanCode];
      setActiveTrackedItem(item);
      setTrackingError(null);
      return item;
    }

    // Dynamic fallback generation if code follows pattern THG-XXX-XXXX
    if (cleanCode.startsWith('THG-') || cleanCode.length >= 6) {
      const simulatedItem: TrackingItem = {
        trackingNumber: cleanCode,
        senderName: 'Client Enregistré',
        receiverName: 'Destinataire Vérifié',
        senderCity: 'Conakry (Hamdallaye)',
        destinationCity: 'International Hub',
        weightKg: 4.2,
        shipmentType: 'small_box',
        departureDate: '2026-09-02',
        estimatedDeliveryDate: '2026-09-06',
        status: 'in_transit',
        pickupAgency: 'Bureau Central Destination',
        steps: [
          {
            title: 'Colis enregistré au comptoir',
            location: 'Agence Hamdallaye Conakry',
            date: 'Hier à 15h30',
            completed: true,
            current: false,
            description: 'Inspection réglementaire du colis, emballage et étiquetage sécurisé.',
          },
          {
            title: 'Préparation et scellage fret',
            location: 'Hub Cargo Conakry',
            date: 'Aujourd\'hui à 08h00',
            completed: true,
            current: true,
            description: 'Numéro de bordereau vérifié, prêt pour embarquement sur le prochain vol programmé.',
          },
          {
            title: 'Arrivée et distribution',
            location: 'Bureau International',
            date: 'Délai estimé 3-5 jours',
            completed: false,
            current: false,
            description: 'Notification automatique par WhatsApp et SMS lors de la mise à disposition.',
          },
        ],
      };

      // Store in memory for seamless interaction
      setTrackingItems((prev) => ({ ...prev, [cleanCode]: simulatedItem }));
      setActiveTrackedItem(simulatedItem);
      setTrackingError(null);
      return simulatedItem;
    }

    setActiveTrackedItem(null);
    setTrackingError(`Aucun colis trouvé pour la référence "${cleanCode}". Essayez un exemple : THG-NY-8910, THG-MTL-2708 ou THG-KND-0109.`);
    return null;
  };

  const clearTracking = () => {
    setActiveTrackedItem(null);
    setActiveSearchCode('');
    setTrackingError(null);
  };

  // Announcements CRUD
  const addAnnouncement = (item: Omit<DepartureAnnouncement, 'id' | 'createdAt'>) => {
    const newAnnouncement: DepartureAnnouncement = {
      ...item,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const updateAnnouncement = (id: string, changes: Partial<DepartureAnnouncement>) => {
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleAnnouncementActive = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
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

  const resetAllData = () => {
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAgencies(INITIAL_AGENCIES);
    setDestinations(INITIAL_DESTINATIONS);
    setPricingRules(INITIAL_PRICING_RULES);
    setTestimonials(INITIAL_TESTIMONIALS);
    setTrackingItems(INITIAL_TRACKING_ITEMS);
    localStorage.removeItem('thg_announcements');
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
