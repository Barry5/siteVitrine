import type { Language } from '../data/translations';

/**
 * Statuts ColisBox (colisBox2/backend/src/lib/parcel-status.ts l.44-50)
 * regroupés en 5 étapes lisibles pour le client :
 * 0 Enregistré · 1 Expédié · 2 Arrivé à destination · 3 Disponible au retrait · 4 Livré.
 */
const STAGE_BY_STATUS: Record<string, number> = {
  draft: 0,
  registered: 0,
  accepted: 0,
  preparing: 0,
  in_collection: 0,
  collected: 0,
  pending_information: 0,
  at_hub: 1,
  shipped: 1,
  in_transit: 1,
  arrived_destination_country: 2,
  arrived_at_branch: 2,
  ready_for_pickup: 3,
  out_for_delivery: 3,
  delivered: 4,
};

/** Statuts qui demandent de contacter l'entreprise plutôt que d'attendre. */
const PROBLEM_STATUSES = new Set([
  'cancelled',
  'blocked',
  'lost',
  'damaged',
  'returned_to_sender',
  'pending_information',
]);

export const TRACKING_STAGE_COUNT = 5;

/** Étape atteinte (0 à 4), ou null si le statut est inconnu ou hors parcours. */
export function trackingStage(status: string): number | null {
  const stage = STAGE_BY_STATUS[status];
  return typeof stage === 'number' ? stage : null;
}

export function isProblemStatus(status: string): boolean {
  return PROBLEM_STATUSES.has(status);
}

/** Le colis attend le client à l'agence de destination. */
export function isAwaitingPickup(status: string): boolean {
  return status === 'ready_for_pickup' || status === 'arrived_at_branch';
}

const LOCALES: Record<Language, string> = { fr: 'fr-FR', en: 'en-GB' };

export function formatTrackingDate(iso: string | null, language: Language, withTime = false): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(LOCALES[language], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

/** Numéro de suivi passé dans l'adresse : ?suivi=… (ou ?track=…, format des liens ColisBox). */
export function trackingNumberFromUrl(search: string = window.location.search): string {
  const params = new URLSearchParams(search);
  return (params.get('suivi') || params.get('track') || '').trim();
}
