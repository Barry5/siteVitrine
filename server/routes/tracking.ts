import { Router, type Request } from 'express';

/**
 * Suivi de colis : intermédiaire entre le site et ColisBox.
 *
 * GET /api/tracking/:numero
 *   → interroge ColisBox (GET <COLISBOX_API_URL>/public/track/:numero,
 *     colisBox2/backend/src/routes/public.routes.ts l.31-73) ;
 *   → ne renvoie au navigateur que les informations utiles au client.
 *
 * Pourquoi passer par le serveur du site plutôt que d'appeler ColisBox depuis
 * le navigateur :
 *   - aucun réglage CORS à changer côté ColisBox ;
 *   - seuls les numéros Thiaguil (préfixe) sont acceptés : la route publique
 *     de ColisBox cherche dans toutes les entreprises ;
 *   - les notes internes des agents, identifiants techniques et description
 *     du contenu ne sont jamais transmis ;
 *   - cache court et limites de débit : ColisBox voit toutes les requêtes du
 *     site depuis une seule adresse IP et en accepte 60 par quart d'heure
 *     (colisBox2/backend/src/app.ts l.113-122).
 */

export const trackingRouter = Router();

const COLISBOX_API_URL = (process.env.COLISBOX_API_URL || 'https://colisbox.org/api').replace(/\/+$/, '');

/** Préfixes des numéros de suivi Thiaguil dans ColisBox (ex : GN-EXP-2026-000004-P4WD4). */
const TRACKING_PREFIXES = (process.env.COLISBOX_TRACKING_PREFIXES || 'GN-EXP')
  .split(',')
  .map((p) => p.trim().toUpperCase().replace(/-+$/, ''))
  .filter(Boolean);

/** Format ColisBox : PRÉFIXE-AAAA-NNNNNN-XXXXX (colisBox2/backend/src/lib/sequences.ts l.42-67). */
const TRACKING_FORMAT = /^[A-Z0-9]+(?:-[A-Z0-9]+)*-\d{4}-[A-Z0-9]{4,12}-[A-Z0-9]{4,8}$/;

const UPSTREAM_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 2 * 60_000;
const CACHE_MAX_ENTRIES = 500;

/** Par visiteur : 15 recherches par tranche de 10 minutes. */
const VISITOR_WINDOW_MS = 10 * 60_000;
const VISITOR_MAX = 15;

/**
 * Appels réels à ColisBox (hors cache) : 50 par quart d'heure, sous la limite
 * de 60 de ColisBox, pour ne jamais faire bloquer l'adresse du site.
 */
const UPSTREAM_WINDOW_MS = 15 * 60_000;
const UPSTREAM_MAX = 50;

export interface PublicTrackingEvent {
  status: string;
  location: string;
  timestamp: string;
}

export interface PublicTrackedParcel {
  trackingNumber: string;
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
  history: PublicTrackingEvent[];
}

type CachedResult = { status: 200; parcel: PublicTrackedParcel } | { status: 404 };

const cache = new Map<string, { expiresAt: number; result: CachedResult }>();
const visitorHits = new Map<string, number[]>();
let upstreamHits: number[] = [];

export function normalizeTrackingNumber(raw: string): string {
  return String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

export function isAcceptedTrackingNumber(code: string): boolean {
  if (code.length > 64 || !TRACKING_FORMAT.test(code)) return false;
  return TRACKING_PREFIXES.some((prefix) => code.startsWith(`${prefix}-`));
}

function text(value: unknown, max = 160): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function isoDate(value: unknown): string | null {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** Ne garde que les champs destinés au client (liste blanche). */
export function toPublicParcel(raw: any): PublicTrackedParcel | null {
  if (!raw || typeof raw !== 'object') return null;
  const trackingNumber = text(raw.trackingNumber, 64).toUpperCase();
  if (!trackingNumber) return null;
  const weight = typeof raw.weightKg === 'number' && Number.isFinite(raw.weightKg) ? raw.weightKg : null;
  const history: PublicTrackingEvent[] = Array.isArray(raw.statusHistory)
    ? raw.statusHistory
        .map((h: any) => ({
          status: text(h?.status, 40),
          location: text(h?.location),
          timestamp: isoDate(h?.timestamp) ?? '',
        }))
        .filter((h: PublicTrackingEvent) => h.status && h.timestamp)
        // Du plus récent au plus ancien, quel que soit l'ordre reçu.
        .sort((a: PublicTrackingEvent, b: PublicTrackingEvent) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 20)
    : [];
  return {
    trackingNumber,
    status: text(raw.status, 40) || 'unknown',
    parcelType: text(raw.parcelType, 40),
    transportMode: text(raw.transportMode, 40),
    originCountry: text(raw.originCountry, 80),
    originBranchName: text(raw.originBranchName),
    destinationCountry: text(raw.destinationCountry, 80),
    destinationCity: text(raw.destinationCity, 80),
    destinationBranchName: text(raw.destinationBranchName),
    estimatedDeliveryDate: isoDate(raw.estimatedDeliveryDate),
    weightKg: weight,
    createdAt: isoDate(raw.createdAt),
    // Déjà masqués par ColisBox (« Mamadou D. ») : transmis tels quels.
    senderName: text(raw.senderName, 80),
    recipientName: text(raw.recipientName, 80),
    history,
  };
}

function visitorKey(req: Request): string {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.ip || 'unknown';
}

function allowVisitor(key: string, now: number): boolean {
  const recent = (visitorHits.get(key) || []).filter((t) => now - t < VISITOR_WINDOW_MS);
  if (recent.length >= VISITOR_MAX) {
    visitorHits.set(key, recent);
    return false;
  }
  recent.push(now);
  visitorHits.set(key, recent);
  // Nettoyage occasionnel pour que la table ne grossisse pas indéfiniment.
  if (visitorHits.size > 5_000) {
    for (const [k, hits] of visitorHits) {
      if (!hits.some((t) => now - t < VISITOR_WINDOW_MS)) visitorHits.delete(k);
    }
  }
  return true;
}

function allowUpstream(now: number): boolean {
  upstreamHits = upstreamHits.filter((t) => now - t < UPSTREAM_WINDOW_MS);
  if (upstreamHits.length >= UPSTREAM_MAX) return false;
  upstreamHits.push(now);
  return true;
}

function remember(code: string, result: CachedResult, now: number) {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(code, { expiresAt: now + CACHE_TTL_MS, result });
}

trackingRouter.get('/:trackingNumber', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const code = normalizeTrackingNumber(req.params.trackingNumber);

  if (!isAcceptedTrackingNumber(code)) {
    return res.status(400).json({ error: 'invalid_number' });
  }

  const now = Date.now();
  if (!allowVisitor(visitorKey(req), now)) {
    return res.status(429).json({ error: 'too_many_requests' });
  }

  const cached = cache.get(code);
  if (cached && cached.expiresAt > now) {
    return cached.result.status === 200
      ? res.json({ parcel: cached.result.parcel })
      : res.status(404).json({ error: 'not_found' });
  }

  if (!allowUpstream(now)) {
    return res.status(503).json({ error: 'busy' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(`${COLISBOX_API_URL}/public/track/${encodeURIComponent(code)}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (upstream.status === 404) {
      remember(code, { status: 404 }, now);
      return res.status(404).json({ error: 'not_found' });
    }
    if (upstream.status === 429) {
      console.error('[tracking] ColisBox a limité le débit (429).');
      return res.status(503).json({ error: 'busy' });
    }
    if (!upstream.ok) {
      console.error(`[tracking] ColisBox a répondu ${upstream.status}.`);
      return res.status(502).json({ error: 'unavailable' });
    }

    const body: any = await upstream.json().catch(() => null);
    // ColisBox renvoie { success, parcel } (public.routes.ts l.71).
    const parcel = toPublicParcel(body?.parcel ?? body?.data);
    if (!parcel || parcel.trackingNumber !== code) {
      console.error('[tracking] Réponse ColisBox inattendue.');
      return res.status(502).json({ error: 'unavailable' });
    }

    remember(code, { status: 200, parcel }, now);
    return res.json({ parcel });
  } catch (err) {
    console.error('[tracking] ColisBox injoignable :', (err as Error).name === 'AbortError' ? 'délai dépassé' : (err as Error).message);
    return res.status(502).json({ error: 'unavailable' });
  } finally {
    clearTimeout(timer);
  }
});
