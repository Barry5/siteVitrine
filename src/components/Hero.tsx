import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Building2,
  Check,
  Clock,
  ImageOff,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  PlaneTakeoff,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { resolveApiAsset } from '../lib/api';
import {
  daysUntil,
  formatDepartureDate,
  getPastShowcase,
  getUpcomingDepartures,
} from '../lib/departures';
import type { DepartureAnnouncement } from '../types';

const WHATSAPP_NUMBER = '224611835683';
const FACEBOOK_URL = 'https://www.facebook.com/p/Thiaguil-multi-services-61566989230221/';

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Nombre maximum d'affiches utilisées en fond (poids de la page sur mobile). */
const MAX_BACKDROP_POSTERS = 8;
/** En dessous de ce nombre, le mur se répéterait trop : une affiche à la fois. */
const MIN_POSTERS_FOR_WALL = 3;

/**
 * Hero « Prochain départ » : le prochain départ publié depuis l'admin est
 * l'élément central de la page (trajet, date, compte à rebours, réservation
 * WhatsApp, affiche Facebook). Les actions secondaires (suivi, tarifs,
 * agences) sont regroupées dans trois cartes à cheval sur le bas du bandeau.
 */
export const Hero: React.FC = () => {
  const { announcements, announcementsLoading, announcementsFromServer, searchPackage, activeSearchCode, language } = useApp();
  const t = translations[language].hero;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});
  const [trackingInput, setTrackingInput] = useState('');
  // Le champ reflète le numéro recherché (lien ?suivi=…) et se vide avec « Suivre un autre colis ».
  useEffect(() => {
    setTrackingInput(activeSearchCode);
  }, [activeSearchCode]);
  const [motionPaused, setMotionPaused] = useState(false);

  const upcoming = getUpcomingDepartures(announcements);
  const current = upcoming.find((a) => a.id === selectedId) ?? upcoming[0];
  const markPosterFailed = (id: string) => setFailedPosters((prev) => ({ ...prev, [id]: true }));

  const hasPoster = (a: DepartureAnnouncement) => Boolean(a.posterUrl) && !failedPosters[a.id];

  // Moins de 3 départs à venir : on complète avec les derniers départs
  // effectués. Uniquement des départs réellement publiés depuis l'admin
  // (jamais les données de repli de initialData.ts, qui sont des exemples).
  // Liste « Nos derniers départs effectués » : les plus récents, avec ou sans
  // affiche. Mur : les plus récents qui ont une affiche (tampon « Départ
  // effectué »), pour atteindre 3 affiches quand c'est possible.
  const canShowPast = !announcementsLoading && announcementsFromServer;
  const pastShowcase = canShowPast
    ? getPastShowcase(announcements, upcoming.length, hasPoster)
    : { listed: [], wall: [] };
  const recentPast = pastShowcase.listed;
  const recentPastWithPoster = pastShowcase.wall;
  const pastIds = new Set(recentPastWithPoster.map((a) => a.id));

  // Affiches en fond : d'abord les départs à venir, puis les départs
  // effectués, sans celles dont l'image ne se charge pas.
  const backdropPosters = announcementsLoading
    ? []
    : [...upcoming.filter(hasPoster), ...recentPastWithPoster].slice(0, MAX_BACKDROP_POSTERS);
  const backdropAnimated = backdropPosters.length >= 2;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    // Le résultat s'affiche juste en dessous (TrackingSection), qui fait défiler la page jusqu'à lui.
    searchPackage(trackingInput);
  };

  return (
    <section id="accueil" className="relative bg-canvas">
      <div
        className={`relative overflow-hidden bg-ink text-white border-t-4 border-brand ${
          motionPaused ? 'poster-motion-paused' : ''
        }`}
      >
        <PosterBackdrop
          posters={backdropPosters}
          pastIds={pastIds}
          pastStamp={t.recentStamp}
          onPosterError={markPosterFailed}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-24 lg:pb-32">
          {/* Ce que fait l'entreprise, visible avant le prochain départ :
              c'est le titre principal (h1) de la page. */}
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-xs font-extrabold tracking-[0.14em] uppercase text-sand">
              {t.introLabel}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.9rem] font-extrabold leading-[1.1] tracking-tight text-white">
              {t.introTitle}
            </h1>
            <p className="text-[15px] sm:text-[17px] leading-relaxed text-slate-300 max-w-3xl">{t.introBody}</p>
            <ul className="flex flex-wrap gap-2 sm:gap-2.5 pt-1">
              {t.introServices.map((service) => (
                <li
                  key={service}
                  className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-ink-2/85 border border-ink-line text-[13px] sm:text-sm font-semibold text-slate-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" aria-hidden="true" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px bg-ink-line/80 my-8 lg:my-10" aria-hidden="true" />

          <div id="departs" className="scroll-mt-24">
          {announcementsLoading ? (
            <HeroLoading label={t.loading} />
          ) : current ? (
            <DepartureHero
              key={current.id}
              departure={current}
              upcoming={upcoming}
              recent={recentPast}
              onSelect={setSelectedId}
              isNext={current.id === upcoming[0]?.id}
              posterFailed={Boolean(failedPosters[current.id])}
              onPosterError={() => markPosterFailed(current.id)}
            />
          ) : (
            <NoDepartureHero recent={recentPast} />
          )}
          </div>

          {/* Pause du défilement des affiches (masqué si le visiteur a déjà
              réduit les animations dans les réglages de son appareil). */}
          {backdropAnimated && (
            <div className="flex justify-end pt-8 motion-reduce:hidden">
              <button
                type="button"
                aria-pressed={motionPaused}
                onClick={() => setMotionPaused((p) => !p)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-slate-500 bg-ink/75 text-slate-200 text-[13px] font-bold hover:border-stone-300 transition-colors cursor-pointer"
              >
                {motionPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {motionPaused ? t.playMotion : t.pauseMotion}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trois cartes d'action, à cheval sur le bas du bandeau */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 lg:-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Le seul champ de suivi du site (ancre #suivi du menu). */}
          <div id="suivi" className="scroll-mt-28 bg-white rounded-xl border border-stone-200 shadow-xl shadow-ink/10 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-red-50 text-brand flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </span>
              <h2 className="font-display text-xl font-bold text-stone-900">{t.trackTitle}</h2>
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
                  className="flex-1 min-w-0 h-11 px-3.5 rounded-lg border border-stone-300 bg-canvas text-sm font-semibold text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <button
                  type="submit"
                  className="h-11 px-4 rounded-lg bg-ink hover:bg-ink-2 text-white text-sm font-bold transition-colors cursor-pointer shrink-0"
                >
                  {t.trackButton}
                </button>
              </div>
            </form>
          </div>

          <a
            href="#simulateur"
            className="group bg-white rounded-xl border border-stone-200 shadow-xl shadow-ink/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-brand/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-red-50 text-brand flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </span>
              <span className="font-display text-xl font-bold text-stone-900">{t.ratesTitle}</span>
            </div>
            <span className="text-sm text-stone-600 leading-relaxed">{t.ratesBody}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
              {t.ratesLink}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>

          <a
            href="#agences"
            className="group bg-white rounded-xl border border-stone-200 shadow-xl shadow-ink/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-brand/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-red-50 text-brand flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="font-display text-xl font-bold text-stone-900">{t.agenciesTitle}</span>
            </div>
            <span className="text-sm text-stone-600 leading-relaxed">{t.agenciesBody}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
              {t.agenciesLink}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>

      <div className="h-10 sm:h-12" aria-hidden="true" />
    </section>
  );
};

/* -------------------------------------------------------------------------- */

const DepartureHero: React.FC<{
  departure: DepartureAnnouncement;
  upcoming: DepartureAnnouncement[];
  recent: DepartureAnnouncement[];
  onSelect: (id: string) => void;
  isNext: boolean;
  posterFailed: boolean;
  onPosterError: () => void;
}> = ({ departure, upcoming, recent, onSelect, isNext, posterFailed, onPosterError }) => {
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
  // « Prochain départ » seulement pour le départ le plus proche ; si le
  // visiteur a choisi un autre départ dans les pastilles, on affiche sa date.
  const featuredLabel = isNext
    ? t.featuredNext
    : t.featuredOther.replace('{date}', date?.short ?? departure.departureDayLabel);

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">
      {/* Informations du départ */}
      <div className="flex-1 min-w-0 space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-brand text-white text-xs sm:text-xs font-extrabold tracking-[0.12em]">
            {t.eyebrow}
          </span>
          {departure.badge && (
            <span className="px-3 py-1.5 rounded-full border border-ink-line text-slate-200 text-xs sm:text-xs font-bold tracking-wider uppercase">
              {departure.badge}
            </span>
          )}
        </div>

        <h2 className="flex flex-col gap-2 sm:gap-2.5">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-xl sm:text-2xl font-semibold text-slate-200">
            {t.routeLead} {t.routeFrom}
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 shrink-0" aria-label={t.routeTo} />
            {departure.destinationCity}
          </span>
          {date ? (
            <>
              <span className="font-display text-2xl sm:text-3xl font-bold text-sand uppercase tracking-wide">
                {date.weekday}
              </span>
              <span className="font-display text-5xl sm:text-7xl xl:text-[6rem] font-black uppercase leading-[0.92] tracking-tight text-white">
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
          <span className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-ink-2 border border-ink-line text-sm sm:text-base font-bold">
            <Clock className="w-4 h-4 text-sand" />
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
            className="inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-lg bg-brand hover:bg-brand-dark text-white text-base sm:text-[17px] font-extrabold shadow-lg shadow-black/30 transition-colors"
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
                      : 'bg-transparent text-slate-200 border-ink-line font-semibold hover:border-stone-300'
                  }`}
                >
                  {item.destinationCity} · {itemDate?.short ?? item.departureDayLabel}
                </button>
              );
            })}
          </div>
        )}

        <RecentDepartures departures={recent} />
      </div>

      {/* Affiche Facebook, ou carte calendrier si le départ n'a pas d'affiche */}
      <div className="w-full lg:w-[400px] shrink-0 flex justify-center lg:block">
        {showPoster ? (
          <figure className="w-full max-w-sm lg:max-w-none">
            <figcaption className="ml-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-t-lg bg-brand text-white text-xs sm:text-xs font-extrabold tracking-[0.12em] uppercase">
              <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
              {featuredLabel}
            </figcaption>
            <img
              src={resolveApiAsset(departure.posterUrl as string)}
              alt={posterAlt}
              decoding="async"
              onError={onPosterError}
              className="block w-full max-h-[520px] object-contain rounded-2xl border-4 border-brand bg-ink shadow-2xl shadow-black/60"
            />
          </figure>
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
    className="w-full max-w-sm lg:max-w-none rounded-2xl bg-white text-ink overflow-hidden shadow-2xl shadow-black/40 lg:mt-4"
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

/**
 * Derniers départs effectués : simple liste (pas de bouton, pas de
 * réservation) qui montre au visiteur que les envois partent régulièrement.
 */
const RecentDepartures: React.FC<{ departures: DepartureAnnouncement[] }> = ({ departures }) => {
  const { language } = useApp();
  const t = translations[language].hero;
  if (departures.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="w-full sm:w-auto text-xs sm:text-[13px] font-bold text-slate-400">{t.recentLabel}</span>
      <ul className="flex flex-wrap gap-2">
        {departures.map((item) => {
          const itemDate = formatDepartureDate(item.departureDate, language);
          return (
            <li
              key={item.id}
              className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-50 text-[13px] font-semibold"
            >
              {item.destinationCity} · {itemDate?.dayMonthShort ?? item.departureDayLabel}
              <Check className="w-3.5 h-3.5 text-emerald-300" strokeWidth={3} aria-hidden="true" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/** Aucun départ à venir : message honnête, jamais de fausse date. */
const NoDepartureHero: React.FC<{ recent: DepartureAnnouncement[] }> = ({ recent }) => {
  const { language } = useApp();
  const t = translations[language].hero;
  return (
    <div className="max-w-4xl space-y-5 sm:space-y-6">
      <span className="inline-block px-3 py-1.5 rounded-full border border-ink-line text-slate-200 text-xs sm:text-xs font-extrabold tracking-[0.12em]">
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
          className="inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-lg bg-brand hover:bg-brand-dark text-white text-base sm:text-[17px] font-extrabold shadow-lg shadow-black/30 transition-colors"
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
      <RecentDepartures departures={recent} />
    </div>
  );
};

/** Pendant le chargement des départs depuis le serveur (évite d'afficher brièvement « bientôt annoncé »). */
const HeroLoading: React.FC<{ label: string }> = ({ label }) => (
  <div role="status" aria-live="polite" className="flex flex-col lg:flex-row gap-10 lg:gap-24 animate-pulse">
    <span className="sr-only">{label}</span>
    <div className="flex-1 space-y-5" aria-hidden="true">
      <div className="h-7 w-44 rounded-full bg-ink-2" />
      <div className="h-7 w-64 rounded-lg bg-ink-2" />
      <div className="h-24 sm:h-28 w-full max-w-2xl rounded-xl bg-ink-2" />
      <div className="h-10 w-56 rounded-lg bg-ink-2" />
      <div className="h-14 w-72 rounded-lg bg-ink-2" />
    </div>
    <div className="hidden lg:flex w-[400px] h-[480px] rounded-xl bg-ink-2 items-center justify-center" aria-hidden="true">
      <ImageOff className="w-10 h-10 text-stone-600" />
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */

/**
 * Affiches des départs en fond du bandeau, derrière un voile sombre qui garde
 * le texte lisible. Purement décoratif (aria-hidden) : les mêmes informations
 * sont données en texte au premier plan. Les affiches de départs effectués
 * (pastIds) portent un tampon « Départ effectué » sur le mur.
 * - 3 affiches ou plus : mur d'affiches qui défile, rangées en sens opposés ;
 * - 1 ou 2 affiches : une affiche à la fois, floutée, en fondu ;
 * - aucune affiche : rien (fond uni).
 * Les animations s'arrêtent avec le bouton pause (classe poster-motion-paused
 * sur le bandeau) et pour les visiteurs qui ont réduit les animations.
 */
const PosterBackdrop: React.FC<{
  posters: DepartureAnnouncement[];
  pastIds: ReadonlySet<string>;
  pastStamp: string;
  onPosterError: (id: string) => void;
}> = ({ posters, pastIds, pastStamp, onPosterError }) => {
  if (posters.length === 0) return null;

  const scrim = (
    <div className="absolute inset-0 bg-ink/90 lg:bg-transparent lg:bg-gradient-to-r lg:from-ink/95 lg:via-ink/90 lg:to-ink/55" />
  );

  if (posters.length < MIN_POSTERS_FOR_WALL) {
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {posters.map((poster, i) => (
          <img
            key={poster.id}
            src={resolveApiAsset(poster.posterUrl as string)}
            alt=""
            decoding="async"
            onError={() => onPosterError(poster.id)}
            style={posters.length > 1 ? { animationDelay: `${i * 7}s` } : undefined}
            className={`absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] max-w-none object-cover blur-xl ${
              posters.length > 1 ? 'poster-fade-2' : ''
            }`}
          />
        ))}
        {scrim}
      </div>
    );
  }

  // Chaque rangée : au moins 8 affiches, puis la même suite deux fois pour
  // une boucle sans à-coup (l'animation décale de -50 %).
  const rowCount = 6;
  const rows = Array.from({ length: rowCount }, (_, r) => {
    const base: DepartureAnnouncement[] = [];
    for (let i = 0; base.length < Math.max(8, posters.length); i++) {
      base.push(posters[(i + r) % posters.length]);
    }
    return base.concat(base);
  });

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <div className="absolute -inset-x-10 -top-16 bottom-0 flex flex-col gap-4 sm:gap-5 -rotate-[4deg] origin-center">
        {rows.map((row, r) => (
          <div
            key={r}
            className={`flex gap-4 sm:gap-5 w-max ${r % 2 === 0 ? 'poster-wall-left' : 'poster-wall-right'}`}
            style={{ marginLeft: `-${(r * 53) % 160}px` }}
          >
            {row.map((poster, i) => {
              const isPast = pastIds.has(poster.id);
              return (
                <div
                  key={`${poster.id}-${i}`}
                  className="relative w-32 h-40 sm:w-44 sm:h-56 lg:w-[200px] lg:h-[250px] shrink-0 rounded-lg overflow-hidden bg-ink-2"
                >
                  <img
                    src={resolveApiAsset(poster.posterUrl as string)}
                    alt=""
                    decoding="async"
                    onError={() => onPosterError(poster.id)}
                    className={`w-full h-full object-cover ${isPast ? 'grayscale-[40%]' : ''}`}
                  />
                  {isPast && (
                    <span className="absolute inset-x-2 bottom-2 inline-flex items-center justify-center gap-1 rounded-md bg-emerald-700 text-white text-xs sm:text-xs font-extrabold uppercase tracking-wider py-1 sm:py-1.5">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                      {pastStamp}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {scrim}
    </div>
  );
};
