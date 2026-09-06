export type Language = 'fr' | 'en';

export interface Translations {
  nav: {
    home: string;
    services: string;
    destinations: string;
    tracking: string;
    simulator: string;
    agencies: string;
    faq: string;
    contact: string;
    trackButton: string;
    sendButton: string;
    assistance: string;
  };
  announcement: {
    badge: string;
    bookColis: string;
    next: string;
    prev: string;
  };
  hero: {
    tagline: string;
    titleStart: string;
    destinations: string;
    titleEnd: string;
    description: string;
    trackingTitle: string;
    trackingRealtime: string;
    trackingPlaceholder: string;
    searchButton: string;
    sampleCodesLabel: string;
    trust1: string;
    trust2: string;
    trust3: string;
    networkTitle: string;
    directHub: string;
    originLabel: string;
    originCity: string;
    nextFlightTitle: string;
    reserveButton: string;
    contactsTitle: string;
    directWhatsApp: string;
  };
  tracking: {
    badge: string;
    title: string;
    subtitle: string;
    searchAnother: string;
    searchButton: string;
    clear: string;
    statusRegistered: string;
    statusInTransit: string;
    statusCustoms: string;
    statusReady: string;
    statusDelivered: string;
    statusPending: string;
    sender: string;
    receiver: string;
    origin: string;
    destination: string;
    weight: string;
    estimatedDelivery: string;
    historyTitle: string;
    pickupPoint: string;
    pickupIdRequired: string;
    whatsAppHelp: string;
    printReceipt: string;
    emptyTitle: string;
    emptySubtitle: string;
    quickTestPrompt: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    popularPill: string;
    estimatedTransit: string;
    capacity: string;
    featuresIncluded: string;
    calculateRate: string;
    qualityTitle: string;
    qualityHeading: string;
    qualityIntro: string;
    qualityList: string[];
    packagingInquiry: string;
  };
  calculator: {
    badge: string;
    title: string;
    subtitle: string;
    stepFormat: string;
    envelopeOption: string;
    parcelOption: string;
    stepMode: string;
    airModeTitle: string;
    airModeDesc: string;
    seaModeTitle: string;
    seaModeDesc: string;
    originLabel: string;
    destLabel: string;
    weightLabel: string;
    instantEstimate: string;
    indicativeQuote: string;
    estimatedAmount: string;
    indicativeTransit: string;
    nextFlight: string;
    localPickup: string;
    bookWhatsApp: string;
    guaranteeNote: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    helpPrompt: string;
    contactSupport: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      destinations: 'Destinations',
      tracking: 'Suivi de colis',
      simulator: 'Simulateur',
      agencies: 'Nos Agences',
      faq: 'FAQ',
      contact: 'Contact',
      trackButton: 'Suivre un colis',
      sendButton: 'Envoyer un colis',
      assistance: 'Assistance',
    },
    announcement: {
      badge: 'DÉPART SPÉCIAL',
      bookColis: 'Réserver mon colis',
      next: 'Suivant',
      prev: 'Précédent',
    },
    hero: {
      tagline: 'TRANSITAIRE & FRET INTERNATIONAL • GUINÉE ➔ AMÉRIQUE & EUROPE',
      titleStart: 'Expédiez vos colis vers',
      destinations: 'New York, Montréal',
      titleEnd: "et l'international en toute confiance.",
      description:
        'Vols réguliers et fret maritime programmés depuis Conakry, Coyah et Kindia. Chaque colis est enregistré, vérifié et préparé avec méthode avant son départ pour garantir une livraison irréprochable.',
      trackingTitle: 'Suivi instantané de colis',
      trackingRealtime: 'Mise à jour en temps réel',
      trackingPlaceholder: 'Entrez votre numéro (ex: THG-NY-8910)...',
      searchButton: 'Rechercher',
      sampleCodesLabel: 'Exemples à tester :',
      trust1: 'Scellement & Pesée certifiée',
      trust2: 'Départs Aériens Réguliers',
      trust3: 'Retrait direct au Bronx & Montréal',
      networkTitle: 'Liaisons Internationales',
      directHub: 'Direct Hub',
      originLabel: 'Hub Départ',
      originCity: 'Conakry (CKY)',
      nextFlightTitle: 'PROCHAIN DÉPART CONFIRMÉ',
      reserveButton: 'Réserver',
      contactsTitle: 'Siège Central & Contacts Express',
      directWhatsApp: 'WhatsApp direct',
    },
    tracking: {
      badge: 'Traçabilité & Statut en Direct',
      title: 'Panneau de traçabilité et statut de vos envois',
      subtitle:
        'Consultez en direct l’acheminement de votre colis enregistré en agence (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé).',
      searchAnother: 'Rechercher un autre bordereau...',
      searchButton: 'Rechercher',
      clear: 'Effacer',
      statusRegistered: 'ENREGISTRÉ EN AGENCE',
      statusInTransit: 'EN TRANSIT INTERNATIONAL (EN VOL)',
      statusCustoms: 'EN COURS DE DÉDOUANEMENT',
      statusReady: 'DISPONIBLE POUR RETRAIT AU BUREAU',
      statusDelivered: 'LIVRÉ AU DESTINATAIRE',
      statusPending: 'TRAITEMENT EN COURS',
      sender: 'Expéditeur',
      receiver: 'Destinataire',
      origin: 'Origine',
      destination: 'Destination',
      weight: 'Poids Certifié',
      estimatedDelivery: 'Livraison Estimée',
      historyTitle: 'Historique des étapes logistiques',
      pickupPoint: 'Point de retrait assigné :',
      pickupIdRequired: "Veuillez vous munir d'une pièce d'identité valide lors du retrait.",
      whatsAppHelp: 'Aide WhatsApp',
      printReceipt: 'Imprimer la fiche',
      emptyTitle: 'Aucun colis recherché pour le moment',
      emptySubtitle:
        'Utilisez le champ de recherche dans le haut de page ou cliquez sur un de nos colis tests ci-dessous pour voir le suivi en direct :',
      quickTestPrompt: 'Colis pilotes à tester en un clic :',
    },
    services: {
      badge: "Offres & Typologies d'Envois",
      title: "Des solutions adaptées de l'enveloppe au conteneur complet",
      subtitle:
        'Que vous envoyiez un document officiel urgent ou plusieurs m³ de fret, Thiaguil garantit une préparation méthodique et un conditionnement renforcé pour chaque colis.',
      popularPill: 'Le plus populaire',
      estimatedTransit: 'Délai estimé',
      capacity: 'Capacité :',
      featuresIncluded: 'Avantages inclus :',
      calculateRate: 'Calculer le tarif pour ce format',
      qualityTitle: 'La Charte Rigueur Thiaguil',
      qualityHeading: "L'organisation fait la différence",
      qualityIntro:
        "Chaque colis qui entre dans nos agences de Hamdallaye, Bentouraya, Kindia, Coyah ou Kipé fait l'objet d'une vérification stricte :",
      qualityList: [
        'Pesée digitale certifiée en présence du client',
        'Scotchage et cerclage renforcé inviolable',
        'Bordereau numéroté et suivi SMS / WhatsApp',
      ],
      packagingInquiry: "Question sur l'emballage ? Contactez-nous",
    },
    calculator: {
      badge: 'Transparence Tarifaire',
      title: "Simulateur de tarif d'expédition",
      subtitle:
        "Obtenez une estimation immédiate de votre envoi vers l'international selon le poids, l'agence de dépôt et le mode d'acheminement.",
      stepFormat: "1. Format de l'envoi",
      envelopeOption: '✉️ Enveloppe / Documents (< 1 kg)',
      parcelOption: '📦 Colis / Bagages (kg)',
      stepMode: "2. Mode d'acheminement",
      airModeTitle: 'Fret Aérien Express',
      airModeDesc: 'Rapide • 3 à 5 jours ouvrés',
      seaModeTitle: 'Fret Maritime Éco',
      seaModeDesc: 'Économique • 25 à 35 jours',
      originLabel: 'Agence de dépôt (Guinée)',
      destLabel: 'Ville de destination',
      weightLabel: 'Poids estimé du colis :',
      instantEstimate: 'Estimation Instantanée',
      indicativeQuote: 'Devis indicatif',
      estimatedAmount: "Montant estimé de l'envoi",
      indicativeTransit: 'Délai indicatif :',
      nextFlight: 'Prochain vol prévu :',
      localPickup: 'Retrait sur place :',
      bookWhatsApp: 'Réserver ce tarif sur WhatsApp',
      guaranteeNote: 'Tarif final pesé et certifié en agence avant scellement. Pas de frais cachés.',
    },
    faq: {
      badge: 'Foire Aux Questions',
      title: 'Tout ce que vous devez savoir avant d’expédier',
      subtitle:
        'Délais, formalités, emballage, retraits et paiements : retrouvez les réponses claires à vos questions les plus fréquentes.',
      helpPrompt: 'Vous avez une question spécifique ou un colis volumineux ?',
      contactSupport: 'Écrivez à notre équipe sur WhatsApp',
    },
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      destinations: 'Destinations',
      tracking: 'Track Parcel',
      simulator: 'Rate Calculator',
      agencies: 'Our Branches',
      faq: 'FAQ',
      contact: 'Contact',
      trackButton: 'Track a Parcel',
      sendButton: 'Ship a Parcel',
      assistance: 'Support',
    },
    announcement: {
      badge: 'SPECIAL FLIGHT',
      bookColis: 'Book your shipment',
      next: 'Next',
      prev: 'Previous',
    },
    hero: {
      tagline: 'INTERNATIONAL FREIGHT FORWARDING • GUINEA ➔ NORTH AMERICA & EUROPE',
      titleStart: 'Ship your parcels to',
      destinations: 'New York, Montreal',
      titleEnd: 'and worldwide with total confidence.',
      description:
        'Scheduled regular flights and maritime cargo from Conakry, Coyah and Kindia. Every parcel is logged, inspected and securely packed before departure to ensure seamless delivery.',
      trackingTitle: 'Instant Parcel Tracking',
      trackingRealtime: 'Real-time live updates',
      trackingPlaceholder: 'Enter your tracking number (e.g. THG-NY-8910)...',
      searchButton: 'Track Now',
      sampleCodesLabel: 'Demo tracking numbers:',
      trust1: 'Certified Weighing & Tamper-Proof Seal',
      trust2: 'Regular Air Cargo Departures',
      trust3: 'Direct Pick-up in the Bronx & Montreal',
      networkTitle: 'International Flight Routes',
      directHub: 'Direct Hub',
      originLabel: 'Origin Hub',
      originCity: 'Conakry (CKY)',
      nextFlightTitle: 'NEXT CONFIRMED FLIGHT',
      reserveButton: 'Book Slot',
      contactsTitle: 'Central HQ & Express Contacts',
      directWhatsApp: 'Direct WhatsApp',
    },
    tracking: {
      badge: 'Live Traceability & Status',
      title: 'Live Tracking & Status Dashboard',
      subtitle:
        'Track the exact real-time journey of your parcel registered at our branches (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé).',
      searchAnother: 'Search another tracking code...',
      searchButton: 'Search',
      clear: 'Clear',
      statusRegistered: 'REGISTERED AT BRANCH',
      statusInTransit: 'IN INTERNATIONAL TRANSIT (FLIGHT)',
      statusCustoms: 'CUSTOMS CLEARANCE IN PROGRESS',
      statusReady: 'READY FOR PICKUP AT OFFICE',
      statusDelivered: 'DELIVERED TO RECIPIENT',
      statusPending: 'PROCESSING',
      sender: 'Sender',
      receiver: 'Recipient',
      origin: 'Origin',
      destination: 'Destination',
      weight: 'Certified Weight',
      estimatedDelivery: 'Estimated Delivery',
      historyTitle: 'Logistics Milestones & Journey',
      pickupPoint: 'Assigned Pickup Office:',
      pickupIdRequired: 'Please present a valid ID card or passport when collecting your parcel.',
      whatsAppHelp: 'WhatsApp Support',
      printReceipt: 'Print Receipt',
      emptyTitle: 'No shipment selected yet',
      emptySubtitle:
        'Use the quick search bar in the hero section or click on one of our live pilot shipments below to see live tracking:',
      quickTestPrompt: 'One-click pilot shipments to test:',
    },
    services: {
      badge: 'Shipping Solutions & Formats',
      title: 'Tailored solutions from express envelopes to full containers',
      subtitle:
        'Whether sending an urgent official document or multiple cubic meters of cargo, Thiaguil guarantees rigorous preparation and heavy-duty reinforcement.',
      popularPill: 'Most Popular',
      estimatedTransit: 'Estimated Transit',
      capacity: 'Capacity:',
      featuresIncluded: 'Included Benefits:',
      calculateRate: 'Calculate rate for this format',
      qualityTitle: 'The Thiaguil Quality Charter',
      qualityHeading: 'Methodical organization makes the difference',
      qualityIntro:
        'Every package arriving at our branches in Hamdallaye, Bentouraya, Kindia, Coyah, or Kipé undergoes rigorous inspection:',
      qualityList: [
        'Certified digital weighing in front of customer',
        'Tamper-proof heavy-duty strapping and sealing',
        'Numbered tracking receipt and automatic WhatsApp/SMS alerts',
      ],
      packagingInquiry: 'Questions about packaging? Contact us',
    },
    calculator: {
      badge: 'Transparent Pricing',
      title: 'Shipping Rate Calculator',
      subtitle:
        'Get an immediate instant cost estimate for international shipments based on weight, drop-off branch and transport mode.',
      stepFormat: '1. Shipment Format',
      envelopeOption: '✉️ Document Envelope (< 1 kg)',
      parcelOption: '📦 Parcel / Baggage (kg)',
      stepMode: '2. Transit Mode',
      airModeTitle: 'Express Air Freight',
      airModeDesc: 'Fast • 3 to 5 business days',
      seaModeTitle: 'Economy Ocean Freight',
      seaModeDesc: 'Cost-effective • 25 to 35 days',
      originLabel: 'Drop-off Branch (Guinea)',
      destLabel: 'Destination City',
      weightLabel: 'Estimated parcel weight:',
      instantEstimate: 'Instant Quote',
      indicativeQuote: 'Indicative estimate',
      estimatedAmount: 'Estimated shipping cost',
      indicativeTransit: 'Estimated transit:',
      nextFlight: 'Next scheduled flight:',
      localPickup: 'On-site pickup:',
      bookWhatsApp: 'Lock this rate on WhatsApp',
      guaranteeNote: 'Final weight is certified at branch before tamper-proof sealing. No hidden fees.',
    },
    faq: {
      badge: 'Frequently Asked Questions',
      title: 'Everything you need to know before shipping',
      subtitle:
        'Delivery times, customs rules, packaging, pickup locations, and payment methods: clear answers to all your questions.',
      helpPrompt: 'Have a custom inquiry or large commercial cargo?',
      contactSupport: 'Chat with our support team on WhatsApp',
    },
  },
};
