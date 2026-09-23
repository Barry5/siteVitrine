import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getAnnouncementsFile, POSTER_URL_PATTERN, posterUrlToDiskPath } from './storage.js';

/**
 * Copie côté serveur du type DepartureAnnouncement (src/types.ts).
 * Le backend a sa propre définition pour rester indépendant du code frontend.
 */
export interface StoredAnnouncement {
  id: string;
  title: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  departureDayLabel: string;
  badge: string;
  urgencyNote: string;
  localOffices: string[];
  isActive: boolean;
  createdAt: string;
  posterUrl?: string;
}

const MAX_ANNOUNCEMENTS = 100;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Lit la liste enregistrée. Renvoie null si aucune annonce n'a encore été
 * publiée depuis l'admin (fichier absent) : le frontend affiche alors ses
 * données initiales (src/data/initialData.ts).
 */
export async function readAnnouncements(): Promise<StoredAnnouncement[] | null> {
  try {
    const raw = await fs.readFile(getAnnouncementsFile(), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

/**
 * Sérialise les opérations lecture → validation → écriture pour éviter que
 * deux enregistrements simultanés (deux onglets admin ouverts) s'écrasent
 * au milieu d'une écriture.
 */
let queue: Promise<unknown> = Promise.resolve();
export function withAnnouncementsLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

/** Écriture atomique : fichier temporaire puis renommage (pas de fichier à moitié écrit). */
export async function writeAnnouncements(list: StoredAnnouncement[]): Promise<void> {
  const file = getAnnouncementsFile();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

type ValidationResult =
  | { ok: true; value: StoredAnnouncement[] }
  | { ok: false; error: string };

function readString(
  obj: Record<string, unknown>,
  key: string,
  maxLength: number,
  required: boolean
): string | Error {
  const value = obj[key];
  if (value === undefined || value === null) {
    return required ? new Error(`Champ "${key}" manquant.`) : '';
  }
  if (typeof value !== 'string') return new Error(`Champ "${key}" invalide.`);
  const trimmed = value.trim();
  if (required && !trimmed) return new Error(`Champ "${key}" vide.`);
  if (trimmed.length > maxLength) return new Error(`Champ "${key}" trop long (${maxLength} caractères max).`);
  return trimmed;
}

/**
 * Valide et normalise la liste envoyée par l'admin. Les champs inconnus sont
 * ignorés : seul un objet reconstruit champ par champ est enregistré.
 */
export async function validateAnnouncements(input: unknown): Promise<ValidationResult> {
  if (!Array.isArray(input)) return { ok: false, error: 'La liste des annonces est invalide.' };
  if (input.length > MAX_ANNOUNCEMENTS) {
    return { ok: false, error: `Trop d'annonces (${MAX_ANNOUNCEMENTS} maximum).` };
  }

  const seenIds = new Set<string>();
  const result: StoredAnnouncement[] = [];

  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    const label = `Annonce n°${i + 1}`;
    if (!item || typeof item !== 'object') return { ok: false, error: `${label} : format invalide.` };
    const obj = item as Record<string, unknown>;

    const fields = {
      id: readString(obj, 'id', 64, true),
      title: readString(obj, 'title', 200, true),
      destination: readString(obj, 'destination', 200, false),
      destinationCity: readString(obj, 'destinationCity', 100, true),
      departureDate: readString(obj, 'departureDate', 10, true),
      departureDayLabel: readString(obj, 'departureDayLabel', 100, true),
      badge: readString(obj, 'badge', 100, false),
      urgencyNote: readString(obj, 'urgencyNote', 500, false),
      createdAt: readString(obj, 'createdAt', 40, false),
    };
    for (const value of Object.values(fields)) {
      if (value instanceof Error) return { ok: false, error: `${label} : ${value.message}` };
    }
    const f = fields as Record<keyof typeof fields, string>;

    if (!ID_PATTERN.test(f.id)) return { ok: false, error: `${label} : identifiant invalide.` };
    if (seenIds.has(f.id)) return { ok: false, error: `${label} : identifiant en double.` };
    seenIds.add(f.id);

    if (!DATE_PATTERN.test(f.departureDate)) {
      return { ok: false, error: `${label} : date de départ invalide (format AAAA-MM-JJ attendu).` };
    }

    if (typeof obj.isActive !== 'boolean') return { ok: false, error: `${label} : champ "isActive" invalide.` };

    const offices = obj.localOffices ?? [];
    if (
      !Array.isArray(offices) ||
      offices.length > 20 ||
      offices.some((o) => typeof o !== 'string' || o.length > 100)
    ) {
      return { ok: false, error: `${label} : liste des agences invalide.` };
    }

    const announcement: StoredAnnouncement = {
      ...f,
      localOffices: (offices as string[]).map((o) => o.trim()).filter(Boolean),
      isActive: obj.isActive as boolean,
    };

    if (obj.posterUrl !== undefined && obj.posterUrl !== null && obj.posterUrl !== '') {
      if (typeof obj.posterUrl !== 'string' || !POSTER_URL_PATTERN.test(obj.posterUrl)) {
        return { ok: false, error: `${label} : chemin d'affiche invalide.` };
      }
      const diskPath = posterUrlToDiskPath(obj.posterUrl);
      try {
        await fs.access(diskPath as string);
      } catch {
        return { ok: false, error: `${label} : l'affiche indiquée n'existe pas sur le serveur. Téléversez-la à nouveau.` };
      }
      announcement.posterUrl = obj.posterUrl;
    }

    result.push(announcement);
  }

  return { ok: true, value: result };
}

/**
 * Supprime du disque les affiches qui étaient utilisées avant l'enregistrement
 * et ne le sont plus (affiche remplacée, retirée, ou annonce supprimée).
 */
export async function deleteOrphanedPosters(
  before: StoredAnnouncement[] | null,
  after: StoredAnnouncement[]
): Promise<void> {
  if (!before) return;
  const stillUsed = new Set(after.map((a) => a.posterUrl).filter(Boolean));
  for (const old of before) {
    if (!old.posterUrl || stillUsed.has(old.posterUrl)) continue;
    const diskPath = posterUrlToDiskPath(old.posterUrl);
    if (!diskPath) continue;
    await fs.unlink(diskPath).catch(() => {
      /* fichier déjà absent : rien à faire */
    });
  }
}
