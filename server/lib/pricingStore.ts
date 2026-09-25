import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getPricingFile } from './storage.js';

/**
 * Tarifs du simulateur, enregistrés sur le serveur (DATA_DIR/pricing.json)
 * pour que tous les visiteurs voient les montants saisis dans l'admin.
 * Copie côté serveur du type PricingRule (src/types.ts).
 */
export interface StoredPricingRule {
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

export interface StoredPricing {
  rules: StoredPricingRule[];
  /** Nombre de GNF pour 1 USD et pour 1 CAD (conversion indicative du simulateur). */
  exchangeRates: { usdGnf: number; cadGnf: number };
  updatedAt: string;
}

const MAX_RULES = 50;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const MAX_PRICE_GNF = 1_000_000_000;

/** null si aucun tarif n'a encore été enregistré depuis l'admin (fichier absent). */
export async function readPricing(): Promise<StoredPricing | null> {
  try {
    const raw = await fs.readFile(getPricingFile(), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.rules) ? parsed : null;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

let queue: Promise<unknown> = Promise.resolve();
/** Sérialise les enregistrements (deux onglets admin ouverts). */
export function withPricingLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

/** Écriture atomique : fichier temporaire puis renommage. */
export async function writePricing(pricing: StoredPricing): Promise<void> {
  const file = getPricingFile();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(pricing, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

function readText(obj: Record<string, unknown>, key: string, max: number, required: boolean): string | Error {
  const value = obj[key];
  if (value === undefined || value === null || value === '') {
    return required ? new Error(`Champ "${key}" manquant.`) : '';
  }
  if (typeof value !== 'string') return new Error(`Champ "${key}" invalide.`);
  const trimmed = value.trim();
  if (required && !trimmed) return new Error(`Champ "${key}" vide.`);
  if (trimmed.length > max) return new Error(`Champ "${key}" trop long (${max} caractères max).`);
  return trimmed;
}

function readNumber(
  obj: Record<string, unknown>,
  key: string,
  label: string,
  { min, max, positive }: { min: number; max: number; positive?: boolean }
): number | Error {
  const value = obj[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) return new Error(`${label} : montant manquant ou invalide.`);
  if (positive && value <= 0) return new Error(`${label} : le montant doit être supérieur à 0.`);
  if (value < min || value > max) return new Error(`${label} : valeur hors limites (${min} à ${max}).`);
  return value;
}

type ValidationResult = { ok: true; value: StoredPricing } | { ok: false; error: string };

/** Valide et reconstruit champ par champ ce que l'admin envoie (champs inconnus ignorés). */
export function validatePricing(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Tarifs manquants.' };
  const body = input as Record<string, unknown>;
  if (!Array.isArray(body.rules)) return { ok: false, error: 'Liste des tarifs manquante.' };
  if (body.rules.length > MAX_RULES) return { ok: false, error: `Trop de lignes tarifaires (${MAX_RULES} maximum).` };

  const rules: StoredPricingRule[] = [];
  const seenIds = new Set<string>();
  const seenDestinations = new Set<string>();

  for (const item of body.rules) {
    if (!item || typeof item !== 'object') return { ok: false, error: 'Ligne tarifaire invalide.' };
    const r = item as Record<string, unknown>;
    const id = readText(r, 'id', 64, true);
    const destinationId = readText(r, 'destinationId', 64, true);
    const destinationName = readText(r, 'destinationName', 100, true);
    if (id instanceof Error) return { ok: false, error: id.message };
    if (destinationId instanceof Error) return { ok: false, error: destinationId.message };
    if (destinationName instanceof Error) return { ok: false, error: destinationName.message };
    if (!ID_PATTERN.test(id) || !ID_PATTERN.test(destinationId)) return { ok: false, error: 'Identifiant de ligne invalide.' };
    if (seenIds.has(id) || seenDestinations.has(destinationId)) {
      return { ok: false, error: `Deux lignes tarifaires pour « ${destinationName} ».` };
    }
    seenIds.add(id);
    seenDestinations.add(destinationId);

    const line = `Ligne ${destinationName}`;
    const envelopePriceGnf = readNumber(r, 'envelopePriceGnf', `${line}, forfait enveloppe`, { min: 0, max: MAX_PRICE_GNF, positive: true });
    const pricePerKgAirGnf = readNumber(r, 'pricePerKgAirGnf', `${line}, prix au kg aérien`, { min: 0, max: MAX_PRICE_GNF, positive: true });
    const pricePerKgSeaGnf = readNumber(r, 'pricePerKgSeaGnf', `${line}, prix au kg maritime`, { min: 0, max: MAX_PRICE_GNF, positive: true });
    const minWeightKgAir = readNumber(r, 'minWeightKgAir', `${line}, poids minimum aérien`, { min: 0, max: 1000 });
    const minWeightKgSea = readNumber(r, 'minWeightKgSea', `${line}, poids minimum maritime`, { min: 0, max: 10000 });
    for (const v of [envelopePriceGnf, pricePerKgAirGnf, pricePerKgSeaGnf, minWeightKgAir, minWeightKgSea]) {
      if (v instanceof Error) return { ok: false, error: v.message };
    }
    const delaiAir = readText(r, 'delaiAir', 40, false);
    const delaiSea = readText(r, 'delaiSea', 40, false);
    if (delaiAir instanceof Error) return { ok: false, error: delaiAir.message };
    if (delaiSea instanceof Error) return { ok: false, error: delaiSea.message };

    rules.push({
      id,
      destinationId,
      destinationName,
      envelopePriceGnf: envelopePriceGnf as number,
      pricePerKgAirGnf: pricePerKgAirGnf as number,
      pricePerKgSeaGnf: pricePerKgSeaGnf as number,
      minWeightKgAir: minWeightKgAir as number,
      minWeightKgSea: minWeightKgSea as number,
      delaiAir,
      delaiSea,
    });
  }

  const rates = body.exchangeRates;
  if (!rates || typeof rates !== 'object') return { ok: false, error: 'Taux de change manquants.' };
  const usdGnf = readNumber(rates as Record<string, unknown>, 'usdGnf', 'Taux USD', { min: 1, max: 1_000_000, positive: true });
  const cadGnf = readNumber(rates as Record<string, unknown>, 'cadGnf', 'Taux CAD', { min: 1, max: 1_000_000, positive: true });
  if (usdGnf instanceof Error) return { ok: false, error: usdGnf.message };
  if (cadGnf instanceof Error) return { ok: false, error: cadGnf.message };

  return {
    ok: true,
    value: { rules, exchangeRates: { usdGnf, cadGnf }, updatedAt: new Date().toISOString() },
  };
}
