export type ShipmentType = 'envelope' | 'small_box' | 'large_box' | 'air_freight' | 'sea_freight';

export type TrackingStatus = 'registered' | 'in_transit' | 'customs' | 'ready_for_pickup' | 'delivered';

export interface TrackingStep {
  title: string;
  location: string;
  date: string;
  completed: boolean;
  current: boolean;
  description: string;
}

export interface TrackingItem {
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  senderCity: string;
  destinationCity: string;
  weightKg: number;
  shipmentType: ShipmentType;
  departureDate: string;
  estimatedDeliveryDate: string;
  status: TrackingStatus;
  pickupAgency?: string;
  steps: TrackingStep[];
}

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
