import React, { useState, useEffect } from 'react';
import { BellRing, MapPin, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const AnnouncementBar: React.FC = () => {
  const { announcements, language } = useApp();
  const t = translations[language].announcement;
  const activeAnnouncements = announcements.filter((a) => a.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeAnnouncements.length <= 1 || isPaused || isDismissed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length, isPaused, isDismissed]);

  if (activeAnnouncements.length === 0 || isDismissed) {
    return null;
  }

  const current = activeAnnouncements[currentIndex % activeAnnouncements.length];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  return (
    <aside
      aria-label="Annonces de départs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-[#C8102E] text-white border-b border-[#991B1B] relative z-40 text-xs sm:text-sm shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Badge, indicators & announcement copy */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 text-white font-extrabold text-[11px] tracking-wide uppercase border border-white/20 shrink-0">
            <BellRing className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>{t.badge}</span>
          </span>

          {/* Dots pagination */}
          {activeAnnouncements.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 shrink-0" aria-label="Pagination des annonces">
              {activeAnnouncements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-amber-300 w-4'
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Aller à l'annonce ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Announcement content with key-based subtle transition */}
          <div key={current.id} className="flex items-center gap-2 overflow-hidden text-slate-50 transition-opacity duration-300">
            <span className="font-extrabold tracking-wide uppercase text-amber-200 shrink-0">
              {current.departureDayLabel}
            </span>
            <span className="text-white/40 hidden md:inline">•</span>
            <span className="font-semibold text-white/95">
              {current.title}
            </span>
            <span className="hidden xl:inline-flex items-center gap-1 text-white/90 text-xs bg-black/20 px-2 py-0.5 rounded shrink-0">
              <MapPin className="w-3 h-3 text-amber-300" />
              {current.urgencyNote}
            </span>
          </div>
        </div>

        {/* Right actions: Prev/Next controls, Reserve button & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {activeAnnouncements.length > 1 && (
            <div className="flex items-center gap-1 bg-black/25 rounded-md px-1.5 py-0.5 border border-white/10">
              <button
                type="button"
                onClick={handlePrev}
                className="p-0.5 hover:text-amber-200 transition-colors cursor-pointer"
                title="Précédent"
                aria-label="Annonce précédente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 font-bold text-white/90">
                {currentIndex + 1}/{activeAnnouncements.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-0.5 hover:text-amber-200 transition-colors cursor-pointer"
                title="Suivant"
                aria-label="Annonce suivante"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <a
            href="https://wa.me/224611835683?text=Bonjour%20Thiaguil%20Multi-services,%20je%20souhaite%20réserver%20pour%20le%20prochain%20départ."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#C8102E] font-bold text-xs transition-colors shadow-2xs"
          >
            <span>{t.reserveButton}</span>
            <ArrowRight className="w-3 h-3" />
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-white/70 hover:text-white rounded hover:bg-black/20 transition-colors cursor-pointer"
            aria-label="Fermer la bannière"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
