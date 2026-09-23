import React, { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Building2,
  Clock,
  ImageOff,
  MapPin,
  MessageCircle,
  PlaneTakeoff,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { resolveApiAsset } from '../lib/api';
import { daysUntil, formatDepartureDate, getUpcomingDepartures } from '../lib/departures';
import type { DepartureAnnouncement } from '../types';

const WHATSAPP_NUMBER = '224611835683';
const FACEBOOK_URL = 'https://www.facebook.com/p/Thiaguil-multi-services-61566989230221/';

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/**
 * Hero « Prochain départ » : le prochain départ publié depuis l'admin est
 * l'élément central de la page (trajet, date, compte à rebours, réservation
 * WhatsApp, affiche Facebook). Les actions secondaires (suivi, tarifs,
 * agences) sont regroupées dans trois cartes à cheval sur le bas du bandeau.
 */
export const Hero: React.FC = () => {
  const { announcements, announcementsLoading, searchPackage, language } = useApp();
  const t = translations[language].hero;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});
  const [trackingInput, setTrackingInput] = useState('');

  const upcoming = getUpcomingDepartures(announcements);
  const current = upcoming.find((a) => a.id === selectedId) ?? upcoming[0];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    searchPackage(trackingInput);
    document.getElementById('suivi')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="accueil" className="relative bg-canvas">
      {/* Titre de page pour les moteurs de recherche et lecteurs d'écran ;
          la même phrase est affichée plus bas, sous les cartes. */}
      <h1 className="sr-only">{t.slogan}</h1>

      <div className="bg-ink text-white border-t-4 border-brand">
        <div
          id="departs"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-24 lg:pb-32 scroll-mt-20"
        >
          {announcementsLoading ? (
            <HeroLoading label={t.loading} />
          ) : current ? (
            <DepartureHero
              key={current.id}
              departure={current}
              upcoming={upcoming}
              onSelect={setSelectedId}
              posterFailed={Boolean(failedPosters[current.id])}
              onPosterError={() => setFailedPosters((prev) => ({ ...prev, [current.id]: true }))}
            />
          ) : (
            <NoDepartureHero />
          )}
        </div>
      </div>

      {/* Trois cartes d'action, à cheval sur le bas du bandeau */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 lg:-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-slate-900/10 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-50 text-brand flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900">{t.trackTitle}</h2>
            </div>
            <form onSubmit={handleTrackSubmit} className="space-y-2">
              <label htmlFor="hero-tracking" className="block text-xs font-semibold text-stone-600">
                {t.trackLabel}
              </label>
              <div className="flex gap-2">
                <input
                  id="hero-tracking"
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder={t.trackPlaceholder}
                  autoComplete="off"
                  className="flex-1 min-w-0 h-11 px-3.5 rounded-xl border border-stone-300 bg-canvas text-sm font-semibold text-slate-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <button
                  type="submit"
                  className="h-11 px-4 rounded-xl bg-ink hover:bg-slate-800 text-white text-sm font-bold transition-colors cursor-pointer shrink-0"
                >
                  {t.trackButton}
                </button>
              </div>
            </form>
          </div>

          <a
            href="#simulateur"
            className="group bg-white rounded-2xl border border-stone-200 shadow-xl shadow-slate-900/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-brand/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-50 text-brand flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </span>
              <span className="font-display text-xl font-bold text-slate-900">{t.ratesTitle}</span>
            </div>
            <span className="text-sm text-stone-600 leading-relaxed">{t.ratesBody}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
              {t.ratesLink}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>

          <a
            href="#agences"
            className="group bg-white rounded-2xl border border-stone-200 shadow-xl shadow-slate-900/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-brand/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-50 text-brand flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="font-display text-xl font-bold text-slate-900">{t.agenciesTitle}</span>
            </div>
            <span className="text-sm text-stone-600 leading-relaxed">{t.agenciesBody}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
              {t.agenciesLink}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>

      <p aria-hidden="true" className="max-w-4xl mx-auto px-4 pt-10 pb-12 text-center font-display text-xl sm:text-2xl font-semibold text-stone-700">
        {t.slogan}
      </p>
    </section>
  );
};

/* -------------------------------------------------------------------------- */

const DepartureHero: React.FC<{
  departure: DepartureAnnouncement;
  upcoming: DepartureAnnouncement[];
  onSelect: (id: string) => void;
  posterFailed: boolean;
  onPosterError: () => void;
}> = ({ departure, upcoming, onSelect, posterFailed, onPosterError }) => {
  const { language } = useApp();
  const t = translations[language].hero;

  const date = formatDepartureDate(departure.departureDate, language);
  const days = daysUntil(departure.departureDate);
  const countdown =
    days <= 0 ? t.countdownToday : days === 1 ? t.countdownTomorrow : t.countdownDays.replace('{n}', String(days));

  const longDate = date?.long ?? departure.departureDayLabel;
  const reserveHref = whatsappLink(
    t.reserveMessage.replace('{date}', longDate).replace('{city}', departure.destinationCity)
  );
  const posterAlt = t.posterAlt.replace('{city}', departure.destinationCity).replace('{date}', longDate);
  const showPoster = Boolean(departure.posterUrl) && !posterFailed;

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">
      {/* Informations du départ */}
      <div className="flex-1 min-w-0 space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-brand text-white text-[11px] sm:text-xs font-extrabold tracking-[0.12em]">
            {t.eyebrow}
          </span>
          {departure.badge && (
            <span className="px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 text-[11px] sm:text-xs font-bold tracking-wider uppercase">
              {departure.badge}
            </span>
          )}
        </div>

        <h2 className="flex flex-col gap-2 sm:gap-2.5">
          <span className="flex items-center gap-2.5 font-display text-xl sm:text-2xl font-semibold text-slate-200">
            {t.routeFrom}
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 shrink-0" aria-label={t.routeTo} />
            {departure.destinationCity}
          </span>
          {date ? (
            <>
              <span className="font-display text-2xl sm:text-3xl font-bold text-red-300 uppercase tracking-wide">
                {date.weekday}
              </span>
              <span className="font-display text-5xl sm:text-7xl xl:text-[6.75rem] font-black uppercase leading-[0.92] tracking-tight text-white">
                {date.dayMonth}
              </span>
            </>
          ) : (
            <span className="font-display text-5xl sm:text-7xl font-black uppercase leading-[0.92] tracking-tight text-white">
              {departure.departureDayLabel}
            </span>
          )}
        </h2>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
          <span className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm sm:text-base font-bold">
            <Clock className="w-4 h-4 text-red-400" />
            {countdown}
          </span>
          {departure.urgencyNote && (
            <span className="flex items-start sm:items-center gap-2 text-sm sm:text-[15px] text-slate-300 max-w-xl">
              <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
              {departure.urgencyNote}
            </span>
          )}
        </div>

        {departure.localOffices.length > 0 && (
          <p className="text-sm text-slate-400">
            <strong className="text-slate-200">{t.agenciesLabel}</strong> {departure.localOffices.join(', ')}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-1">
          <a
            href={reserveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-xl bg-brand hover:bg-brand-dark text-white text-base sm:text-[17px] font-extrabold shadow-lg shadow-black/30 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            {t.reserveButton}
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-[15px] font-bold text-white underline underline-offset-[5px] decoration-slate-500 hover:decoration-white"
          >
            {t.facebookLink}
          </a>
        </div>

        {upcoming.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="w-full sm:w-auto text-xs sm:text-[13px] font-bold text-slate-400">{t.upcomingLabel}</span>
            {upcoming.map((item) => {
              const itemDate = formatDepartureDate(item.departureDate, language);
              const isSelected = item.id === departure.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(item.id)}
                  className={`min-h-11 px-3.5 rounded-full text-[13px] border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white text-ink border-white font-bold'
                      : 'bg-transparent text-slate-200 border-slate-600 font-semibold hover:border-slate-300'
                  }`}
                >
                  {item.destinationCity} · {itemDate?.short ?? item.departureDayLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Affiche Facebook, ou carte calendrier si le départ n'a pas d'affiche */}
      <div className="w-full lg:w-[400px] shrink-0 flex justify-center lg:block">
        {showPoster ? (
          <img
            src={resolveApiAsset(departure.posterUrl as string)}
            alt={posterAlt}
            decoding="async"
            onError={onPosterError}
            className="w-full max-w-sm lg:max-w-none max-h-[520px] object-contain rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/40"
          />
        ) : (
          <CalendarCard
            month={date?.month ?? ''}
            day={departure.departureDate.slice(8, 10)}
            weekday={date?.weekday ?? ''}
            route={`${t.routeFrom} → ${departure.destinationCity}`}
          />
        )}
      </div>
    </div>
  );
};

/** Carte calendrier affichée quand un départ n'a pas (encore) d'affiche. */
const CalendarCard: React.FC<{ month: string; day: string; weekday: string; route: string }> = ({
  month,
  day,
  weekday,
  route,
}) => (
  <div
    aria-hidden="true"
    className="w-full max-w-sm lg:max-w-none rounded-3xl bg-white text-ink overflow-hidden shadow-2xl shadow-black/40 lg:mt-4"
  >
    <div className="h-20 sm:h-24 bg-brand text-white flex items-center justify-between px-6 sm:px-8">
      <span className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.12em]">{month}</span>
      <PlaneTakeoff className="w-8 h-8" />
    </div>
    <div className="flex flex-col items-center justify-center gap-1 py-8 sm:py-10">
      <span className="font-display text-[8rem] sm:text-[11rem] font-black leading-[0.85] tracking-tighter">{day}</span>
      <span className="font-display text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-stone-600">{weekday}</span>
    </div>
    <div className="h-14 sm:h-16 border-t border-dashed border-stone-300 flex items-center justify-center text-sm sm:text-base font-extrabold uppercase tracking-wider text-brand px-4 text-center">
      {route}
    </div>
  </div>
);

/** Aucun départ à venir : message honnête, jamais de fausse date. */
const NoDepartureHero: React.FC = () => {
  const { language } = useApp();
  const t = translations[language].hero;
  return (
    <div className="max-w-4xl space-y-5 sm:space-y-6">
      <span className="inline-block px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 text-[11px] sm:text-xs font-extrabold tracking-[0.12em]">
        {t.emptyEyebrow}
      </span>
      <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
        {t.emptyTitle}
      </h2>
      <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">{t.emptyBody}</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-1">
        <a
          href={whatsappLink(t.emptyMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-xl bg-brand hover:bg-brand-dark text-white text-base sm:text-[17px] font-extrabold shadow-lg shadow-black/30 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          {t.emptyButton}
        </a>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm sm:text-[15px] font-bold text-white underline underline-offset-[5px] decoration-slate-500 hover:decoration-white"
        >
          {t.facebookLink}
        </a>
      </div>
    </div>
  );
};

/** Pendant le chargement des départs depuis le serveur (évite d'afficher brièvement « bientôt annoncé »). */
const HeroLoading: React.FC<{ label: string }> = ({ label }) => (
  <div role="status" aria-live="polite" className="flex flex-col lg:flex-row gap-10 lg:gap-24 animate-pulse">
    <span className="sr-only">{label}</span>
    <div className="flex-1 space-y-5" aria-hidden="true">
      <div className="h-7 w-44 rounded-full bg-slate-800" />
      <div className="h-7 w-64 rounded-lg bg-slate-800" />
      <div className="h-24 sm:h-28 w-full max-w-2xl rounded-2xl bg-slate-800" />
      <div className="h-10 w-56 rounded-xl bg-slate-800" />
      <div className="h-14 w-72 rounded-xl bg-slate-800" />
    </div>
    <div className="hidden lg:flex w-[400px] h-[480px] rounded-2xl bg-slate-800 items-center justify-center" aria-hidden="true">
      <ImageOff className="w-10 h-10 text-slate-600" />
    </div>
  </div>
);
