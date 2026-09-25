/**
 * Client HTTP minimal vers le backend Express (server/).
 * En développement, VITE_API_URL peut pointer vers http://localhost:4000/api ;
 * en production, l'API est généralement servie sous le même domaine, via /api.
 */
import type { DepartureAnnouncement, TrackedParcel, TrackingErrorKind } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function parseJsonSafe(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export interface ContactFormPayload {
  fullName: string;
  phone: string;
  email?: string;
  agency: string;
  destination: string;
  message: string;
}

export async function submitContactRequest(payload: ContactFormPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await parseJsonSafe(res);
    throw new Error(data?.error || 'La demande a échoué.');
  }
}

export async function adminLogin(password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const data = await parseJsonSafe(res);
    throw new Error(data?.error || 'Authentification refusée.');
  }
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_BASE}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/session`, {
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Transforme un chemin de fichier renvoyé par l'API (ex: "/uploads/posters/x.jpg")
 * en URL utilisable dans <img src>. Les fichiers sont servis par l'API sous
 * /api/uploads/..., donc la même règle de reverse proxy que /api suffit en production.
 */
export function resolveApiAsset(path: string): string {
  return `${API_BASE}${path}`;
}

// --- Annonces de départ ------------------------------------------------------

/**
 * Départs actifs publiés depuis l'admin. Renvoie null si aucune annonce n'a
 * encore été publiée côté serveur (le site garde alors ses données initiales).
 * Lève une erreur si l'API est injoignable.
 */
export async function fetchPublicAnnouncements(): Promise<DepartureAnnouncement[] | null> {
  const res = await fetch(`${API_BASE}/announcements`);
  if (!res.ok) throw new Error('Annonces indisponibles.');
  const data = await parseJsonSafe(res);
  return Array.isArray(data?.announcements) ? data.announcements : null;
}

/** Toutes les annonces (actives et masquées) — admin connecté uniquement. */
export async function fetchAdminAnnouncements(): Promise<DepartureAnnouncement[] | null> {
  const res = await fetch(`${API_BASE}/admin/announcements`, { credentials: 'include' });
  if (!res.ok) {
    const data = await parseJsonSafe(res);
    throw new Error(data?.error || 'Impossible de charger les annonces.');
  }
  const data = await parseJsonSafe(res);
  return Array.isArray(data?.announcements) ? data.announcements : null;
}

/** Enregistre la liste complète des annonces sur le serveur et renvoie la version enregistrée. */
export async function saveAnnouncements(
  announcements: DepartureAnnouncement[]
): Promise<DepartureAnnouncement[]> {
  const res = await fetch(`${API_BASE}/admin/announcements`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ announcements }),
  });
  const data = await parseJsonSafe(res);
  if (!res.ok || !Array.isArray(data?.announcements)) {
    throw new Error(data?.error || "L'enregistrement a échoué.");
  }
  return data.announcements;
}

export const MAX_POSTER_BYTES = 5 * 1024 * 1024;
const ACCEPTED_POSTER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Téléverse une affiche (JPEG/PNG/WebP, 5 Mo max) et renvoie son chemin serveur. */
export async function uploadPoster(file: File): Promise<string> {
  if (!ACCEPTED_POSTER_TYPES.includes(file.type)) {
    throw new Error('Format non pris en charge. Choisissez une image JPEG, PNG ou WebP.');
  }
  if (file.size > MAX_POSTER_BYTES) {
    throw new Error('Image trop lourde (5 Mo maximum).');
  }
  const res = await fetch(`${API_BASE}/admin/uploads/poster`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    credentials: 'include',
    body: file,
  });
  const data = await parseJsonSafe(res);
  if (!res.ok || typeof data?.posterUrl !== 'string') {
    throw new Error(data?.error || "Le téléversement de l'affiche a échoué.");
  }
  return data.posterUrl;
}

/** Échec d'une recherche de suivi, avec la raison à afficher au visiteur. */
export class TrackingLookupError extends Error {
  constructor(public kind: TrackingErrorKind) {
    super(kind);
  }
}

/**
 * Suivi d'un colis ColisBox via le serveur du site (server/routes/tracking.ts).
 * Lève TrackingLookupError si le colis est introuvable, le numéro invalide,
 * trop de recherches ont été faites, ou si ColisBox est injoignable.
 */
export async function fetchTracking(trackingNumber: string): Promise<TrackedParcel> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/tracking/${encodeURIComponent(trackingNumber)}`);
  } catch {
    throw new TrackingLookupError('unavailable');
  }
  const data = await parseJsonSafe(res);
  if (res.ok && data?.parcel && typeof data.parcel.trackingNumber === 'string') {
    return data.parcel as TrackedParcel;
  }
  if (res.status === 404) throw new TrackingLookupError('not_found');
  if (res.status === 400) throw new TrackingLookupError('invalid_number');
  if (res.status === 429) throw new TrackingLookupError('too_many_requests');
  throw new TrackingLookupError('unavailable');
}
