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
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  return { weekday, dayMonth, short, month, long: `${weekday} ${dayMonth}` };
}
