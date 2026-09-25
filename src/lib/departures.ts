import type { DepartureAnnouncement } from '../types';
import type { Language } from '../data/translations';

/**
 * Outils de date pour les départs. Les dates sont au format AAAA-MM-JJ
 * (champ `departureDate`, validé côté serveur) et interprétées en date
 * LOCALE du visiteur, sans heure : un départ du 6 octobre reste « à venir »
 * jusqu'à la fin de la journée du 6 octobre.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseIsoLocal(iso: string): Date | null {
  const match = ISO_DATE.exec(iso);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function todayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Départs actifs dont la date n'est pas passée, du plus proche au plus
 * lointain. Les départs passés ou sans date valide ne sont jamais affichés.
 */
export function getUpcomingDepartures(
  announcements: DepartureAnnouncement[],
  today: string = todayIso()
): DepartureAnnouncement[] {
  return announcements
    .filter((a) => a.isActive && ISO_DATE.test(a.departureDate) && a.departureDate >= today)
    .slice()
    .sort((a, b) => a.departureDate.localeCompare(b.departureDate));
}

/**
 * Nombre de départs montrés au visiteur : s'il y a moins de départs à venir,
 * le site complète avec les derniers départs effectués (toujours marqués
 * comme tels, sans bouton de réservation) pour montrer la régularité des envois.
 */
export const SHOWN_DEPARTURES_TARGET = 3;

/**
 * Départ actif dont la date est passée (départ effectué). Sert à l'admin
 * (badge) et au hero (preuve de régularité).
 */
export function isPastDeparture(announcement: DepartureAnnouncement, today: string = todayIso()): boolean {
  return ISO_DATE.test(announcement.departureDate) && announcement.departureDate < today;
}

/**
 * Les `count` départs effectués les plus récents (actifs, date valide et
 * passée), du plus récent au plus ancien. Affichés uniquement pour rassurer
 * le visiteur sur la régularité des envois, toujours marqués « effectués ».
 */
export function getRecentPastDepartures(
  announcements: DepartureAnnouncement[],
  count: number,
  today: string = todayIso()
): DepartureAnnouncement[] {
  if (count <= 0) return [];
  return announcements
    .filter((a) => a.isActive && isPastDeparture(a, today))
    .slice()
    .sort((a, b) => b.departureDate.localeCompare(a.departureDate))
    .slice(0, count);
}

/**
 * Départs effectués montrés au visiteur quand il y a moins de
 * SHOWN_DEPARTURES_TARGET départs à venir :
 * - `listed` : les plus récents, avec ou sans affiche (liste « Nos derniers
 *   départs effectués ») ;
 * - `wall` : les plus récents qui ont une affiche (mur d'affiches en fond,
 *   avec le tampon « Départ effectué »).
 * Utilisé par le bandeau d'accueil et par l'admin (statut de chaque départ).
 */
export function getPastShowcase(
  announcements: DepartureAnnouncement[],
  upcomingCount: number,
  hasPoster: (a: DepartureAnnouncement) => boolean = (a) => Boolean(a.posterUrl),
  today: string = todayIso()
): { listed: DepartureAnnouncement[]; wall: DepartureAnnouncement[] } {
  const count = SHOWN_DEPARTURES_TARGET - upcomingCount;
  return {
    listed: getRecentPastDepartures(announcements, count, today),
    wall: getRecentPastDepartures(announcements.filter(hasPoster), count, today),
  };
}

/** Nombre de jours entre aujourd'hui et la date de départ (0 = aujourd'hui). */
export function daysUntil(iso: string, today: string = todayIso()): number {
  const target = parseIsoLocal(iso);
  const start = parseIsoLocal(today);
  if (!target || !start) return 0;
  // Math.round absorbe les journées de 23 h / 25 h des changements d'heure.
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

const LOCALES: Record<Language, string> = { fr: 'fr-FR', en: 'en-GB' };

export interface FormattedDepartureDate {
  /** Ex : "mardi" / "Tuesday" */
  weekday: string;
  /** Ex : "06 octobre" / "06 October" */
  dayMonth: string;
  /** Ex : "mar. 06 oct." / "Tue 06 Oct" */
  short: string;
  /** Ex : "27 août" / "27 Aug" — pour les listes compactes */
  dayMonthShort: string;
  /** Ex : "octobre" / "October" */
  month: string;
  /** Ex : "mardi 06 octobre" — pour les phrases (message WhatsApp, texte alternatif) */
  long: string;
}

/**
 * Libellés de date calculés à partir de la date ISO, dans la langue du site :
 * ils restent justes et traduits, quel que soit le texte libre saisi dans
 * l'admin (departureDayLabel).
 */
export function formatDepartureDate(iso: string, language: Language): FormattedDepartureDate | null {
  const date = parseIsoLocal(iso);
  if (!date) return null;
  const locale = LOCALES[language];
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const dayMonth = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long' }).format(date);
  const short = new Intl.DateTimeFormat(locale, { weekday: 'short', day: '2-digit', month: 'short' }).format(date);
  const dayMonthShort = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  return { weekday, dayMonth, short, dayMonthShort, month, long: `${weekday} ${dayMonth}` };
}

function normalizeCity(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Prochain départ publié (actif, à venir) vers une destination du site, par
 * exemple « New York » ou « Berlin & Allemagne » (comparaison sans accents,
 * dans les deux sens). Remplace les dates écrites en dur dans les
 * destinations, qui devenaient fausses une fois passées.
 */
export function nextDepartureForDestination(
  announcements: DepartureAnnouncement[],
  destinationName: string,
  today: string = todayIso()
): DepartureAnnouncement | null {
  const dest = normalizeCity(destinationName);
  if (!dest) return null;
  return (
    getUpcomingDepartures(announcements, today).find((a) => {
      const city = normalizeCity(a.destinationCity);
      return Boolean(city) && (dest.includes(city) || city.includes(dest));
    }) ?? null
  );
}

/** Libellé court du prochain départ vers une destination (« jeu. 01 oct. »), ou null. */
export function nextDepartureLabel(
  announcements: DepartureAnnouncement[],
  destinationName: string,
  language: Language
): string | null {
  const next = nextDepartureForDestination(announcements, destinationName);
  if (!next) return null;
  return formatDepartureDate(next.departureDate, language)?.short ?? null;
}
