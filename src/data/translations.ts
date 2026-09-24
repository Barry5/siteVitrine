export type Language = 'fr' | 'en';

export interface Translations {
  nav: {
    home: string;
    departures: string;
    rates: string;
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
  trustStats: {
    badge: string;
    localAgencies: string;
    internationalOffices: string;
    destinationsServed: string;
    qualityCharter: string;
  };
  hero: {
    introLabel: string;
    introTitle: string;
    introBody: string;
    introServices: string[];
    eyebrow: string;
    routeLead: string;
    routeFrom: string;
    routeTo: string;
    countdownToday: string;
    countdownTomorrow: string;
    countdownDays: string;
    agenciesLabel: string;
    reserveButton: string;
    reserveMessage: string;
    facebookLink: string;
    upcomingLabel: string;
    posterAlt: string;
    featuredNext: string;
    featuredOther: string;
    pauseMotion: string;
    playMotion: string;
    loading: string;
    emptyEyebrow: string;
    emptyTitle: string;
    emptyBody: string;
    emptyButton: string;
    emptyMessage: string;
    trackTitle: string;
    trackLabel: string;
    trackPlaceholder: string;
    trackButton: string;
    ratesTitle: string;
    ratesBody: string;
    ratesLink: string;
    agenciesTitle: string;
    agenciesBody: string;
    agenciesLink: string;
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
    notFound: string;
    notFoundHelp: string;
    contactAgency: string;
    contactMessage: string;
    inputPlaceholder: string;
    inputButton: string;
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
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Subtitle: string;
    step1Desc: string;
    step1Badge: string;
    step2Title: string;
    step2Subtitle: string;
    step2Desc: string;
    step2Badge: string;
    step3Title: string;
    step3Subtitle: string;
    step3Desc: string;
    step3Badge: string;
    step4Title: string;
    step4Subtitle: string;
    step4Desc: string;
    step4Badge: string;
    commitmentLabel: string;
    commitmentQuote: string;
    commitmentCta: string;
  };
  agencies: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterGuinea: string;
    filterIntl: string;
    badgeIntl: string;
    badgeMain: string;
    badgeLocal: string;
    landmarkLabel: string;
    phonesLabel: string;
    copyLabel: string;
    copiedLabel: string;
    copyTitle: string;
    callAction: string;
    whatsappAction: string;
    photoPlaceholder: string;
  };
  destinations: {
    badge: string;
    title: string;
    subtitle: string;
    airShortLabel: string;
    selectLabel: string;
    lineLabel: string;
    nextFlightLabel: string;
    airFreightLabel: string;
    airFreightNote: string;
    seaFreightLabel: string;
    seaFreightNote: string;
    localOfficeLabel: string;
    localOfficeTag: string;
    addressFallback: string;
    officeFallback: string;
    localPhoneLabel: string;
    simulateCta: string;
    planCta: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    hqTitle: string;
    hqLandmark: string;
    whatsappTitle: string;
    facebookTitle: string;
    facebookSubtitle: string;
    visitPage: string;
    formTitle: string;
    formSubtitle: string;
    successTitle: string;
    successDesc: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    agencyLabel: string;
    destLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submitting: string;
    errorGeneric: string;
  };
  footer: {
    tagline: string;
    mottoLabel: string;
    mottoText: string;
    navTitle: string;
    linkHome: string;
    linkServices: string;
    linkDestinations: string;
    linkTracking: string;
    linkSimulator: string;
    linkAgencies: string;
    linkFaq: string;
    linkContact: string;
    localAgenciesTitle: string;
    intlOfficesTitle: string;
    centralAssistance: string;
    copyright: string;
    facebookLink: string;
    backToTop: string;
    adminAccess: string;
  };
  paymentMethods: {
    title: string;
    localTitle: string;
    internationalTitle: string;
    orangeMoney: string;
    mtnMoney: string;
    bankTransferLocal: string;
    cash: string;
    zelle: string;
    interac: string;
    bankTransferIntl: string;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    verifiedLabel: string;
    verifiedTitle: string;
    emptyTitle: string;
    emptyBody: string;
    emptyCta: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      home: 'Accueil',
      departures: 'Départs',
      rates: 'Tarifs',
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
    trustStats: {
      badge: 'En quelques chiffres',
      localAgencies: 'Agences en Guinée',
      internationalOffices: 'Bureaux internationaux',
      destinationsServed: 'Destinations desservies',
      qualityCharter: 'Charte qualité à chaque dépôt',
    },
    hero: {
      introLabel: 'Thiaguil Multi-services · Transitaire & fret international',
      introTitle: "Envoi de colis de la Guinée vers New York, Montréal, l'Europe et l'Afrique",
      introBody:
        "Déposez vos colis dans nos agences de Conakry, Coyah et Kindia : nous les pesons, les sécurisons et les expédions par avion ou par bateau, jusqu'à nos bureaux de New York et de Montréal.",
      introServices: [
        'Documents & enveloppes',
        'Petits colis (1 à 10 kg)',
        'Grands colis & bagages',
        'Fret aérien',
        'Fret maritime & conteneurs',
      ],
      eyebrow: 'PROCHAIN DÉPART DE COLIS',
      routeLead: 'Vos colis partent de',
      routeFrom: 'Conakry',
      routeTo: 'vers',
      countdownToday: "Départ aujourd'hui",
      countdownTomorrow: 'Départ demain',
      countdownDays: 'Départ dans {n} jours',
      agenciesLabel: 'Agences de dépôt :',
      reserveButton: "Réserver l'envoi de mon colis",
      reserveMessage: 'Bonjour Thiaguil Multi-services, je souhaite réserver une place pour le départ du {date} vers {city}.',
      facebookLink: 'Voir nos annonces sur Facebook',
      upcomingLabel: 'Départs à venir :',
      posterAlt: 'Affiche du départ vers {city} le {date}',
      featuredNext: 'À la une · Prochain départ',
      featuredOther: 'Départ du {date}',
      pauseMotion: 'Mettre en pause le défilement',
      playMotion: 'Relancer le défilement',
      loading: 'Chargement des prochains départs…',
      emptyEyebrow: 'PROCHAINS DÉPARTS',
      emptyTitle: 'Prochain départ bientôt annoncé',
      emptyBody:
        "Contactez-nous pour connaître la date du prochain vol vers New York, Montréal ou l'Europe, et réserver votre place dès son ouverture.",
      emptyButton: 'Demander la prochaine date',
      emptyMessage: 'Bonjour Thiaguil Multi-services, quelle est la date du prochain départ ?',
      trackTitle: 'Suivre un colis',
      trackLabel: 'Numéro inscrit sur votre reçu',
      trackPlaceholder: 'Votre numéro de suivi',
      trackButton: 'Suivre',
      ratesTitle: 'Estimer mon tarif',
      ratesBody: 'Poids, destination, aérien ou maritime : une estimation immédiate avant de déposer votre colis.',
      ratesLink: 'Ouvrir le simulateur',
      agenciesTitle: 'Trouver une agence',
      agenciesBody: "Adresses, horaires et contacts de nos agences en Guinée et de nos bureaux à l'international.",
      agenciesLink: 'Voir les adresses',
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
      emptyTitle: 'Suivez votre colis',
      emptySubtitle:
        'Entrez le numéro de suivi inscrit sur votre reçu de dépôt.',
      notFound: 'Aucun colis trouvé pour le numéro « {code} ».',
      notFoundHelp: "Vérifiez le numéro inscrit sur votre reçu. Si votre colis n'apparaît pas encore en ligne, notre équipe vous répond directement.",
      contactAgency: "Demander le suivi sur WhatsApp",
      contactMessage: 'Bonjour Thiaguil Multi-services, je souhaite suivre mon colis n° {code}.',
      inputPlaceholder: 'Numéro de suivi',
      inputButton: 'Suivre',
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
    howItWorks: {
      badge: 'Processus Opérationnel',
      title: 'Comment se déroule votre expédition ?',
      subtitle:
        "Un processus clair et rigoureux, conçu pour vous offrir une tranquillité d'esprit absolue du départ de Guinée jusqu'à la réception.",
      step1Title: 'Dépôt & Enregistrement',
      step1Subtitle: 'En agence ou enlèvement',
      step1Desc:
        "Déposez votre colis dans l'une de nos agences (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé). Nous vérifions la nature des articles pour garantir la conformité douanière.",
      step1Badge: 'Contrôle minutieux',
      step2Title: 'Pesée & Cerclage Sécurisé',
      step2Subtitle: 'Préparation avec méthode',
      step2Desc:
        "Pesée certifiée devant vous. Application d'un film étanche et scellement au scotch de sécurité haute résistance Thiaguil avec bordereau de traçabilité.",
      step2Badge: 'Scellé inviolable',
      step3Title: 'Acheminement & Suivi Direct',
      step3Subtitle: 'Vols réguliers & Fret maritime',
      step3Desc:
        "Votre colis est embarqué sur le vol programmé. Suivez son avancement en direct sur le site grâce à votre numéro de suivi unique.",
      step3Badge: 'Traçabilité 24/7',
      step4Title: 'Mise à disposition & Retrait',
      step4Subtitle: 'Au bureau de New York ou Montréal',
      step4Desc:
        "Alerte SMS et WhatsApp envoyée au destinataire dès l'arrivée. Retrait simple et sécurisé en main propre au bureau local avec pièce d'identité.",
      step4Badge: 'Remise garantie',
      commitmentLabel: 'Engagement Qualité Thiaguil',
      commitmentQuote:
        '« Chaque colis est enregistré, vérifié et préparé avec méthode avant son départ. Votre confiance mérite le meilleur. »',
      commitmentCta: 'Poser une question à un agent',
    },
    agencies: {
      badge: 'Proximité & Dépôts Locaux',
      title: "Notre réseau d'agences et bureaux internationaux",
      subtitle:
        'Déposez vos colis au plus près de chez vous dans nos agences de Conakry, Coyah ou Kindia, et vos proches les récupèrent directement à nos bureaux de New York ou Montréal.',
      filterAll: 'Toutes nos agences',
      filterGuinea: 'Agences Guinée',
      filterIntl: 'Bureaux Internationaux',
      badgeIntl: 'Bureau International',
      badgeMain: 'Siège Central',
      badgeLocal: 'Agence Locale',
      landmarkLabel: 'Repère :',
      phonesLabel: 'Téléphone(s) direct(s) :',
      copyLabel: 'Copier',
      copiedLabel: 'Copié',
      copyTitle: "Copier les coordonnées de l'agence",
      callAction: 'Appeler',
      whatsappAction: 'WhatsApp',
      photoPlaceholder: 'Photo à venir',
    },
    destinations: {
      badge: 'Réseau & Lignes Internationales',
      title: 'Des connexions directes vers vos métropoles clés',
      subtitle:
        'Thiaguil dispose de bureaux dédiés et de points de distribution établis en Amérique du Nord et en Europe pour garantir un retrait fluide à vos proches.',
      airShortLabel: 'Aérien',
      selectLabel: 'Sélectionnez une destination :',
      lineLabel: 'Ligne régulière Conakry (CKY) ➔',
      nextFlightLabel: 'Prochain vol',
      airFreightLabel: 'Fret Aérien Express',
      airFreightNote: 'Prise en charge prioritaire pour denrées fraîches, documents & colis urgents.',
      seaFreightLabel: 'Fret Maritime Groupage',
      seaFreightNote: 'Recommandé pour les fûts, gros cartons, mobilier et effets volumineux.',
      localOfficeLabel: 'Point de retrait & contact local',
      localOfficeTag: 'Équipe Thiaguil sur place',
      addressFallback: "Adresse communiquée lors de la confirmation d'envoi",
      officeFallback: 'Bureau Thiaguil',
      localPhoneLabel: 'Ligne directe sur place :',
      simulateCta: 'Simuler le prix vers',
      planCta: 'Planifier un envoi',
    },
    contact: {
      badge: 'Contact & Assistance',
      title: 'À votre écoute 7 jours sur 7',
      subtitle:
        "Une question sur un départ en cours, un colis en transit ou un devis spécial pour du fret maritime lourd ? Nos équipes en Guinée et à l'international vous répondent rapidement.",
      hqTitle: 'Siège Principal Guinée',
      hqLandmark: 'Repère : En face de la station-service',
      whatsappTitle: 'WhatsApp & Appels Directs',
      facebookTitle: 'Page Officielle Facebook',
      facebookSubtitle: 'Thiaguil multi-services (Annonces de départs)',
      visitPage: 'Visiter la page',
      formTitle: 'Envoyez-nous une demande d\'information',
      formSubtitle:
        "Remplissez ce formulaire pour recevoir un devis personnalisé ou convenir d'un enlèvement à domicile.",
      successTitle: 'Message transmis avec succès !',
      successDesc:
        'Un agent Thiaguil vous contactera très rapidement par téléphone ou WhatsApp pour finaliser votre expédition.',
      fullNameLabel: 'Nom complet *',
      fullNamePlaceholder: 'Ex: Amadou Barry',
      phoneLabel: 'Téléphone / WhatsApp *',
      phonePlaceholder: '+224 6XX XX XX XX',
      agencyLabel: 'Agence de dépôt souhaitée',
      destLabel: 'Destination de réception',
      messageLabel: "Détails de l'envoi (nature du colis, poids estimé, date souhaitée)",
      messagePlaceholder:
        "Précisez le type de colis (habits, denrées alimentaires, documents, fret commercial...)",
      submitButton: "Envoyer ma demande d'expédition",
      submitting: 'Envoi en cours...',
      errorGeneric: 'Une erreur est survenue. Merci de réessayer ou de nous contacter par WhatsApp.',
    },
    footer: {
      tagline:
        "Votre partenaire de confiance pour le fret aérien, maritime et l'envoi de colis express entre la République de Guinée, l'Amérique du Nord (New York, Montréal) et l'Europe.",
      mottoLabel: "Devise d'Entreprise",
      mottoText:
        "« L'organisation fait la différence : chaque colis est enregistré, vérifié et préparé avec méthode avant son départ. »",
      navTitle: 'Navigation',
      linkHome: 'Accueil',
      linkServices: 'Nos Services Fret',
      linkDestinations: 'Destinations & Vols',
      linkTracking: 'Suivre un colis',
      linkSimulator: 'Simulateur de tarifs',
      linkAgencies: 'Toutes les Agences',
      linkFaq: 'Questions fréquentes (FAQ)',
      linkContact: 'Contactez-nous',
      localAgenciesTitle: 'Agences Locales Guinée',
      intlOfficesTitle: 'Bureaux Internationaux',
      centralAssistance: 'Assistance Centrale :',
      copyright: '© {year} Thiaguil Multi-services. Tous droits réservés. Agrément transitaire & fret international.',
      facebookLink: 'Facebook Officiel',
      backToTop: 'Haut de page',
      adminAccess: 'Accès Espace Interne',
    },
    paymentMethods: {
      title: 'Moyens de paiement acceptés',
      localTitle: 'En Guinée',
      internationalTitle: "À l'international",
      orangeMoney: 'Orange Money',
      mtnMoney: 'MTN Mobile Money',
      bankTransferLocal: 'Virement bancaire',
      cash: 'Espèces (au guichet)',
      zelle: 'Zelle (USA)',
      interac: 'Interac (Canada)',
      bankTransferIntl: 'Virement bancaire direct',
    },
    testimonials: {
      badge: "Retours d'Expérience",
      title: 'La voix de notre diaspora et de nos clients',
      subtitle:
        'De Conakry à Montréal et New York, découvrez pourquoi les familles et commerçants confient leurs colis précieux à Thiaguil.',
      verifiedLabel: 'Vérifié',
      verifiedTitle: 'Envoi tracé et validé',
      emptyTitle: 'Soyez parmi les premiers à partager votre avis',
      emptyBody:
        'Nous affichons ici les avis authentiques de nos clients, dès qu\'ils nous parviennent. Vous avez expédié un colis avec Thiaguil ? Faites-le nous savoir.',
      emptyCta: 'Laisser un avis sur WhatsApp',
    },
  },
  en: {
    nav: {
      home: 'Home',
      departures: 'Departures',
      rates: 'Rates',
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
    trustStats: {
      badge: 'At a glance',
      localAgencies: 'Branches in Guinea',
      internationalOffices: 'International offices',
      destinationsServed: 'Destinations served',
      qualityCharter: 'Quality checks on every drop-off',
    },
    hero: {
      introLabel: 'Thiaguil Multi-services · Freight forwarding & international cargo',
      introTitle: 'Parcel shipping from Guinea to New York, Montreal, Europe and Africa',
      introBody:
        'Drop off your parcels at our branches in Conakry, Coyah and Kindia: we weigh them, secure them and ship them by air or by sea, all the way to our offices in New York and Montreal.',
      introServices: [
        'Documents & envelopes',
        'Small parcels (1 to 10 kg)',
        'Large parcels & luggage',
        'Air freight',
        'Sea freight & containers',
      ],
      eyebrow: 'NEXT PARCEL DEPARTURE',
      routeLead: 'Your parcels leave',
      routeFrom: 'Conakry',
      routeTo: 'to',
      countdownToday: 'Departs today',
      countdownTomorrow: 'Departs tomorrow',
      countdownDays: 'Departs in {n} days',
      agenciesLabel: 'Drop-off branches:',
      reserveButton: 'Book my parcel shipment',
      reserveMessage: 'Hello Thiaguil Multi-services, I would like to book a spot on the {date} departure to {city}.',
      facebookLink: 'See our announcements on Facebook',
      upcomingLabel: 'Upcoming departures:',
      posterAlt: 'Poster for the departure to {city} on {date}',
      featuredNext: 'Featured · Next departure',
      featuredOther: 'Departure on {date}',
      pauseMotion: 'Pause the slideshow',
      playMotion: 'Resume the slideshow',
      loading: 'Loading upcoming departures…',
      emptyEyebrow: 'UPCOMING DEPARTURES',
      emptyTitle: 'Next departure coming soon',
      emptyBody:
        'Contact us to find out the date of the next flight to New York, Montreal or Europe, and book your spot as soon as it opens.',
      emptyButton: 'Ask for the next date',
      emptyMessage: 'Hello Thiaguil Multi-services, when is the next departure?',
      trackTitle: 'Track a parcel',
      trackLabel: 'Number printed on your receipt',
      trackPlaceholder: 'Your tracking number',
      trackButton: 'Track',
      ratesTitle: 'Estimate my rate',
      ratesBody: 'Weight, destination, air or sea: an instant estimate before you drop off your parcel.',
      ratesLink: 'Open the calculator',
      agenciesTitle: 'Find a branch',
      agenciesBody: 'Addresses, opening hours and contacts for our branches in Guinea and our offices abroad.',
      agenciesLink: 'See addresses',
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
      emptyTitle: 'Track your parcel',
      emptySubtitle:
        'Enter the tracking number printed on your drop-off receipt.',
      notFound: 'No parcel found for number "{code}".',
      notFoundHelp: 'Please check the number printed on your receipt. If your parcel is not online yet, our team will answer you directly.',
      contactAgency: 'Ask for tracking on WhatsApp',
      contactMessage: 'Hello Thiaguil Multi-services, I would like to track my parcel no. {code}.',
      inputPlaceholder: 'Tracking number',
      inputButton: 'Track',
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
    howItWorks: {
      badge: 'Operational Process',
      title: 'How does your shipment work?',
      subtitle:
        'A clear, rigorous process designed to give you complete peace of mind from departure in Guinea through to delivery.',
      step1Title: 'Drop-off & Registration',
      step1Subtitle: 'At a branch or pickup',
      step1Desc:
        'Drop off your parcel at one of our branches (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé). We check the contents to ensure customs compliance.',
      step1Badge: 'Careful inspection',
      step2Title: 'Weighing & Secure Strapping',
      step2Subtitle: 'Methodical preparation',
      step2Desc:
        'Certified weighing in front of you. Application of a tamper-proof wrap and heavy-duty Thiaguil security tape with a traceable receipt.',
      step2Badge: 'Tamper-proof seal',
      step3Title: 'Transit & Live Tracking',
      step3Subtitle: 'Regular flights & sea freight',
      step3Desc:
        'Your parcel is loaded onto the scheduled flight. Track its progress live on the site with your unique tracking number.',
      step3Badge: '24/7 tracking',
      step4Title: 'Availability & Pickup',
      step4Subtitle: 'At our New York or Montreal office',
      step4Desc:
        'SMS and WhatsApp alert sent to the recipient upon arrival. Simple, secure hand-to-hand pickup at the local office with valid ID.',
      step4Badge: 'Guaranteed handover',
      commitmentLabel: 'Thiaguil Quality Commitment',
      commitmentQuote:
        '"Every parcel is logged, checked and methodically prepared before departure. Your trust deserves the best."',
      commitmentCta: 'Ask an agent a question',
    },
    agencies: {
      badge: 'Local Reach & Drop-off Points',
      title: 'Our network of branches and international offices',
      subtitle:
        'Drop off your parcels close to home at our branches in Conakry, Coyah or Kindia, and your loved ones collect them directly at our New York or Montreal offices.',
      filterAll: 'All our branches',
      filterGuinea: 'Guinea Branches',
      filterIntl: 'International Offices',
      badgeIntl: 'International Office',
      badgeMain: 'Head Office',
      badgeLocal: 'Local Branch',
      landmarkLabel: 'Landmark:',
      phonesLabel: 'Direct phone number(s):',
      copyLabel: 'Copy',
      copiedLabel: 'Copied',
      copyTitle: 'Copy branch contact details',
      callAction: 'Call',
      whatsappAction: 'WhatsApp',
      photoPlaceholder: 'Photo coming soon',
    },
    destinations: {
      badge: 'Network & International Routes',
      title: 'Direct connections to your key destination cities',
      subtitle:
        'Thiaguil operates dedicated offices and established distribution points across North America and Europe to ensure smooth pickup for your loved ones.',
      airShortLabel: 'Air',
      selectLabel: 'Select a destination:',
      lineLabel: 'Regular route Conakry (CKY) ➔',
      nextFlightLabel: 'Next flight',
      airFreightLabel: 'Express Air Freight',
      airFreightNote: 'Priority handling for perishables, documents & urgent parcels.',
      seaFreightLabel: 'Consolidated Sea Freight',
      seaFreightNote: 'Recommended for drums, large boxes, furniture and bulky items.',
      localOfficeLabel: 'Local pickup point & contact',
      localOfficeTag: 'Thiaguil team on-site',
      addressFallback: 'Address provided upon shipment confirmation',
      officeFallback: 'Thiaguil Office',
      localPhoneLabel: 'Direct local line:',
      simulateCta: 'Estimate the price to',
      planCta: 'Schedule a shipment',
    },
    contact: {
      badge: 'Contact & Support',
      title: 'Here for you, 7 days a week',
      subtitle:
        'A question about an upcoming departure, a parcel in transit, or a special quote for heavy sea freight? Our teams in Guinea and abroad respond quickly.',
      hqTitle: 'Guinea Head Office',
      hqLandmark: 'Landmark: Across from the gas station',
      whatsappTitle: 'WhatsApp & Direct Calls',
      facebookTitle: 'Official Facebook Page',
      facebookSubtitle: 'Thiaguil multi-services (Departure announcements)',
      visitPage: 'Visit the page',
      formTitle: 'Send us an inquiry',
      formSubtitle: 'Fill out this form to receive a custom quote or arrange a home pickup.',
      successTitle: 'Message sent successfully!',
      successDesc: 'A Thiaguil agent will contact you shortly by phone or WhatsApp to finalize your shipment.',
      fullNameLabel: 'Full name *',
      fullNamePlaceholder: 'e.g. Amadou Barry',
      phoneLabel: 'Phone / WhatsApp *',
      phonePlaceholder: '+224 6XX XX XX XX',
      agencyLabel: 'Preferred drop-off branch',
      destLabel: 'Receiving destination',
      messageLabel: 'Shipment details (type of parcel, estimated weight, desired date)',
      messagePlaceholder: 'Specify the type of parcel (clothing, food, documents, commercial freight...)',
      submitButton: 'Send my shipping request',
      submitting: 'Sending...',
      errorGeneric: 'Something went wrong. Please try again or contact us on WhatsApp.',
    },
    footer: {
      tagline:
        'Your trusted partner for air freight, sea freight and express parcel shipping between the Republic of Guinea, North America (New York, Montreal) and Europe.',
      mottoLabel: 'Company Motto',
      mottoText:
        '"Organization makes the difference: every parcel is logged, checked and methodically prepared before departure."',
      navTitle: 'Navigation',
      linkHome: 'Home',
      linkServices: 'Our Freight Services',
      linkDestinations: 'Destinations & Flights',
      linkTracking: 'Track a Parcel',
      linkSimulator: 'Rate Calculator',
      linkAgencies: 'All Branches',
      linkFaq: 'Frequently Asked Questions',
      linkContact: 'Contact Us',
      localAgenciesTitle: 'Local Branches in Guinea',
      intlOfficesTitle: 'International Offices',
      centralAssistance: 'Central Support:',
      copyright: '© {year} Thiaguil Multi-services. All rights reserved. Licensed freight forwarder & international cargo agent.',
      facebookLink: 'Official Facebook',
      backToTop: 'Back to top',
      adminAccess: 'Staff Portal Access',
    },
    paymentMethods: {
      title: 'Accepted payment methods',
      localTitle: 'In Guinea',
      internationalTitle: 'Internationally',
      orangeMoney: 'Orange Money',
      mtnMoney: 'MTN Mobile Money',
      bankTransferLocal: 'Bank transfer',
      cash: 'Cash (in branch)',
      zelle: 'Zelle (USA)',
      interac: 'Interac e-Transfer (Canada)',
      bankTransferIntl: 'Direct wire transfer',
    },
    testimonials: {
      badge: 'Customer Feedback',
      title: 'The voice of our diaspora and our customers',
      subtitle:
        'From Conakry to Montreal and New York, discover why families and merchants trust Thiaguil with their valuable parcels.',
      verifiedLabel: 'Verified',
      verifiedTitle: 'Tracked and verified shipment',
      emptyTitle: 'Be among the first to share your experience',
      emptyBody:
        'We only display authentic customer reviews, as they come in. Shipped a parcel with Thiaguil? Let us know.',
      emptyCta: 'Leave a review on WhatsApp',
    },
  },
};
