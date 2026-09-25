/**
 * Colis suivi, tel que renvoyé par GET /api/tracking/:numero (serveur du site,
 * server/routes/tracking.ts), à partir des données de ColisBox. Les noms sont
 * déjà masqués par ColisBox (« Mamadou D. »).
 */
export interface TrackingEvent {
  status: string;
  location: string;
  /** Date ISO 8601. */
  timestamp: string;
}

export interface TrackedParcel {
  trackingNumber: string;
  /** Statut ColisBox (registered, in_transit, ready_for_pickup, delivered…). */
  status: string;
  parcelType: string;
  transportMode: string;
  originCountry: string;
  originBranchName: string;
  destinationCountry: string;
  destinationCity: string;
  destinationBranchName: string;
  estimatedDeliveryDate: string | null;
  weightKg: number | null;
  createdAt: string | null;
  senderName: string;
  recipientName: string;
  /** Du plus récent au plus ancien. */
  history: TrackingEvent[];
}

/** Raison pour laquelle une recherche de suivi n'a pas abouti. */
export type TrackingErrorKind = 'not_found' | 'invalid_number' | 'too_many_requests' | 'unavailable';

export interface Agency {
  id: string;
  name: string;
  city: string;
  address: string;
  landmark?: string;
  phones: string[];
  whatsapp: string;
  isInternational: boolean;
  hours: string;
  isMainAgency?: boolean;
  /**
   * Chemin ou URL d'une vraie photo de l'agence (ex: '/photos/agences/ag-hamdallaye.jpg').
   * Optionnel : tant qu'aucune photo n'est fournie, ou si le fichier référencé est
   * introuvable, l'interface affiche un emplacement réservé (PlaceholderImage) à la place.
   */
  photoUrl?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  estimatedAirDays: string;
  estimatedSeaDays: string;
  localContactName?: string;
  localAddress?: string;
  localPhone?: string;
  nextScheduledFlight?: string;
  active: boolean;
}

export interface DepartureAnnouncement {
  id: string;
  title: string;
  destination: string;
  departureDate: string;
  departureDayLabel: string; // e.g. "JEUDI 27 AOÛT", "MARDI 01 SEPTEMBRE"
  badge: string; // e.g. "VOL CONFIRMÉ", "DÉPÔT EN COURS"
  destinationCity: string;
  urgencyNote: string;
  localOffices: string[];
  isActive: boolean;
  createdAt: string;
  // Affiche Facebook du départ, téléversée depuis l'admin. Chemin renvoyé par
  // l'API (ex: "/uploads/posters/<uuid>.jpg"), à résoudre avec resolveApiAsset().
  posterUrl?: string;
}

/** Nombre de GNF pour 1 USD / 1 CAD (conversion indicative du simulateur). */
export interface ExchangeRates {
  usdGnf: number;
  cadGnf: number;
}

/** Tarifs du simulateur, enregistrés sur le serveur (GET /api/pricing). */
export interface PricingSettings {
  rules: PricingRule[];
  exchangeRates: ExchangeRates;
}

export interface PricingRule {
  id: string;
  destinationId: string;
  destinationName: string;
  envelopePriceGnf: number;
  pricePerKgAirGnf: number;
  pricePerKgSeaGnf: number;
  minWeightKgAir: number;
  minWeightKgSea: number;
  delaiAir: string;
  delaiSea: string;
}

export interface Testimonial {
  id: string;
  author: string;
  city: string;
  destination: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export type ShipmentType = 'envelope' | 'small_box' | 'large_box' | 'air_freight' | 'sea_freight';

export interface ShipmentService {
  id: ShipmentType;
  name: string;
  tagline: string;
  description: string;
  weightLimit: string;
  transitTime: string;
  features: string[];
  icon: string;
  highlighted?: boolean;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  originAgency: string;
  destinationCity: string;
  message: string;
  createdAt: string;
}
