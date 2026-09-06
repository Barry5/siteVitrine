import React, { useState } from 'react';
import { Plane, Calendar, MapPin, X, ArrowRight, BellRing } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnnouncementBar: React.FC = () => {
  const { announcements } = useApp();
  const activeAnnouncements = announcements.filter((a) => a.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  if (activeAnnouncements.length === 0 || isDismissed) {
    return null;
  }

  const current = activeAnnouncements[currentIndex % activeAnnouncements.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  return (
    <aside aria-label="Annonces de départs" className="bg-[#C8102E] text-white border-b border-[#991B1B] relative z-40 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Badge and text */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-white font-bold text-[11px] tracking-wide uppercase border border-white/20 shrink-0">
            <BellRing className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>Départ Spécial</span>
          </span>

          <div className="flex items-center gap-2 overflow-hidden text-slate-50">
            <span className="font-extrabold tracking-wide uppercase text-amber-200">
              {current.departureDayLabel}
            </span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="font-semibold truncate">
              {current.title}
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-white/90 text-xs bg-black/20 px-2 py-0.5 rounded">
              <MapPin className="w-3 h-3" />
              {current.urgencyNote}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {activeAnnouncements.length > 1 && (
            <button
              onClick={handleNext}
              className="text-[11px] font-medium text-white/80 hover:text-white underline underline-offset-2 px-1 py-0.5 cursor-pointer"
              title="Voir l'annonce suivante"
            >
              Annonce suivante ({currentIndex + 1}/{activeAnnouncements.length})
            </button>
          )}

          <a
            href="https://wa.me/224611835683?text=Bonjour%20Thiaguil%20Multi-services,%20je%20souhaite%20réserver%20pour%20le%20prochain%20départ."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white text-[#C8102E] font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
          >
            <span>Réserver mon colis</span>
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
