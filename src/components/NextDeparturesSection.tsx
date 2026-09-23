import React, { useEffect, useState } from 'react';
import {
  CalendarClock,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  PlaneTakeoff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

const AUTOPLAY_MS = 6000;

export const NextDeparturesSection: React.FC = () => {
  const { announcements, destinations, language } = useApp();
  const t = translations[language].nextDepartures;

  // Prochains départs actifs, triés du plus proche au plus lointain.
  const upcoming = announcements
    .filter((a) => a.isActive)
    .slice()
    .sort((a, b) => a.departureDate.localeCompare(b.departureDate));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (upcoming.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % upcoming.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [upcoming.length, isPaused]);

  if (upcoming.length === 0) {
    return null;
  }

  const safeIndex = currentIndex % upcoming.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + upcoming.length) % upcoming.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % upcoming.length);
  };

  // Retrouve le drapeau de la destination en réutilisant les données déjà
  // saisies dans DestinationsSection — jamais de drapeau inventé : si aucune
  // correspondance n'est trouvée, on affiche une icône neutre à la place.
  const flagFor = (destinationCity: string): string | null => {
    const match = destinations.find(
      (d) =>
        d.name.toLowerCase().includes(destinationCity.toLowerCase()) ||
        destinationCity.toLowerCase().includes(d.name.toLowerCase())
    );
    return match?.flagEmoji ?? null;
  };

  return (
    <section
      id="departs"
      aria-label={t.title}
      className="relative py-16 sm:py-20 bg-slate-900 overflow-hidden scroll-mt-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative brand-colored dot pattern, consistent with the Hero section */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(var(--color-brand)_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 text-red-300 font-bold text-xs uppercase tracking-wider border border-red-800/80">
            <PlaneTakeoff className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${safeIndex * 100}%)` }}
            >
              {upcoming.map((departure) => {
                const flag = flagFor(departure.destinationCity);
                return (
                  <div key={departure.id} className="w-full shrink-0 px-1">
                    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                      {/* Left: big date block */}
                      <div className="lg:col-span-4 flex flex-col items-start gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand text-white font-extrabold text-[10px] uppercase tracking-wide">
                          {departure.badge}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center shrink-0">
                            <CalendarClock className="w-6 h-6 text-brand" />
                          </div>
                          <div>
                            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                              {t.dateLabel}
                            </span>
                            <span className="block text-xl sm:text-2xl font-extrabold text-white font-display leading-tight">
                              {departure.departureDayLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: route + title + urgency note */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white">
                          <span className="flex items-center gap-1.5">
                            <span className="text-lg">🇬🇳</span>
                            {t.routeFrom}
                          </span>
                          <ArrowRight className="w-4 h-4 text-brand shrink-0" />
                          <span className="flex items-center gap-1.5">
                            {flag && <span className="text-lg">{flag}</span>}
                            {departure.destinationCity}
                          </span>
                        </div>
                        <h3 className="text-white/90 font-semibold text-sm sm:text-base">
                          {departure.title}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 text-xs bg-black/30 text-amber-200 px-2.5 py-1 rounded-lg border border-white/10">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{departure.urgencyNote}</span>
                        </div>
                      </div>

                      {/* Right: reserve CTA */}
                      <div className="lg:col-span-3 flex lg:justify-end">
                        <a
                          href={`https://wa.me/224611835683?text=${encodeURIComponent(
                            `Bonjour Thiaguil Multi-services, je souhaite réserver pour le départ du ${departure.departureDayLabel} vers ${departure.destinationCity}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-sm transition-colors shadow-lg"
                        >
                          <span>{t.reserveButton}</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls: prev/next + pause + dots */}
          {upcoming.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                aria-label={t.prevLabel}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5" aria-label={t.title}>
                {upcoming.map((departure, idx) => (
                  <button
                    key={departure.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`${t.goToLabel} ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === safeIndex ? 'bg-brand w-6' : 'bg-white/30 hover:bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? t.playLabel : t.pauseLabel}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label={t.nextLabel}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
