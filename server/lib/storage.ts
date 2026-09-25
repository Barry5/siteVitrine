import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Emplacements de stockage persistant du backend.
 *
 * Tout ce que le gestionnaire publie depuis l'admin (annonces de départ,
 * affiches téléversées) est écrit sous DATA_DIR. Par défaut : server/data/
 * (exclu de git). En production, DATA_DIR doit pointer vers un disque
 * PERSISTANT et sauvegardé (pas le système de fichiers éphémère d'un
 * conteneur), sinon les annonces et affiches seraient perdues à chaque
 * redéploiement.
 *
 * Les chemins sont calculés à l'appel (et non au chargement du module) pour
 * que la valeur de DATA_DIR lue depuis server/.env soit bien prise en compte.
 */
const SERVER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Dossier du site construit par Vite (npm run build), servi par ce même
 * serveur en production (un seul domaine pour le site et l'API).
 * Par défaut : <racine du projet>/dist ; modifiable avec SITE_DIR.
 */
export function getSiteDir(): string {
  return path.resolve(process.env.SITE_DIR || path.join(SERVER_ROOT, '..', 'dist'));
}

export function getDataDir(): string {
  return path.resolve(process.env.DATA_DIR || path.join(SERVER_ROOT, 'data'));
}

export function getUploadsDir(): string {
  return path.join(getDataDir(), 'uploads');
}

export function getPostersDir(): string {
  return path.join(getUploadsDir(), 'posters');
}

export function getAnnouncementsFile(): string {
  return path.join(getDataDir(), 'announcements.json');
}

export function getPricingFile(): string {
  return path.join(getDataDir(), 'pricing.json');
}

/**
 * Format exact des chemins d'affiche acceptés : uniquement des fichiers
 * générés par la route d'upload (UUID + extension image). Empêche d'enregistrer
 * une URL arbitraire (lien externe, "javascript:", chemin "../").
 */
export const POSTER_URL_PATTERN =
  /^\/uploads\/posters\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp))$/;

/** Convertit "/uploads/posters/<fichier>" en chemin disque, ou null si invalide. */
export function posterUrlToDiskPath(posterUrl: string): string | null {
  const match = POSTER_URL_PATTERN.exec(posterUrl);
  if (!match) return null;
  return path.join(getPostersDir(), match[1]);
}
