import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plane,
  Ship,
  ChevronRight,
  PhoneCall,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const Hero: React.FC = () => {
  const { searchPackage, announcements, language } = useApp();
  const t = translations[language].hero;
  const [searchInput, setSearchInput] = useState('');
  const activeAnnouncement = announcements.find((a) => a.isActive) || announcements[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    searchPackage(searchInput);
    const trackingEl = document.getElementById('suivi');
    trackingEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickSearch = (code: string) => {
    setSearchInput(code);
    searchPackage(code);
    const trackingEl = document.getElementById('suivi');
    trackingEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="accueil"
      className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#FDFCFB] via-[#FAF9F6] to-[#F1F5F9]"
    >
      {/* Subtle geometric background grid and circular motif */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#C8102E_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Decorative red curve in background */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C8102E]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-slate-900/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value proposition & Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></span>
              <span>{t.tagline}</span>
            </div>

            {/* Main Punchy Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              {t.titleStart}{' '}
              <span className="text-[#C8102E] underline decoration-[#C8102E]/30 decoration-4 underline-offset-6">
                {t.destinations}
              </span>{' '}
              {t.titleEnd}
            </h1>

            {/* Subtitle with authentic brand philosophy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.description}
            </p>

            {/* HERO TRACKING INPUT BOX (Immediate utility & single primary CTA of this zone) */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200/90 ring-4 ring-slate-100/80 transition-all hover:border-[#C8102E]/40">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 text-xs text-slate-600 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-[#C8102E]">
                    <Search className="w-3.5 h-3.5" />
                    {t.trackingTitle}
                  </span>
                  <span className="text-[11px] text-slate-600 font-normal">
                    {t.trackingRealtime}
                  </span>
                </div>

                <form onSubmit={handleSearchSubmit} className="mt-2.5 flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder={t.trackingPlaceholder}
                      className="w-full pl-4 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C8102E] focus:border-transparent transition-all"
                    />
                  </div>
                  {/* Primary solid red CTA */}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C8102E] hover:bg-[#A60D25] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                  >
                    <span>{t.searchButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick click demo codes */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-600 px-1">
                  <span className="font-semibold text-slate-600 text-[11px]">{t.sampleCodesLabel}</span>
                  <button
                    type="button"
                    onClick={() => handleQuickSearch('THG-NY-8910')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-red-50 hover:text-[#C8102E] text-slate-700 font-mono text-[11px] font-bold transition-colors cursor-pointer border border-slate-200"
                  >
                    THG-NY-8910 (New York)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSearch('THG-MTL-2708')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-red-50 hover:text-[#C8102E] text-slate-700 font-mono text-[11px] font-bold transition-colors cursor-pointer border border-slate-200"
                  >
                    THG-MTL-2708 (Montréal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSearch('THG-KND-0109')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-red-50 hover:text-[#C8102E] text-slate-700 font-mono text-[11px] font-bold transition-colors cursor-pointer border border-slate-200"
                  >
                    THG-KND-0109 (Kindia)
                  </button>
                </div>
              </div>
            </div>

            {/* Trust points row */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
                <span>{t.trust1}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <Plane className="w-4 h-4 text-slate-900" />
                <span>{t.trust2}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.trust3}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card - Lightened & Harmonized */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer subtle glow */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#C8102E]/20 to-slate-200 opacity-70 blur-md pointer-events-none"></div>

              {/* Main Refined Card: Crisp light container */}
              <div className="relative bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 overflow-hidden space-y-5">
                {/* Header: Liaisons Internationales */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
                      {t.networkTitle}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#C8102E] border border-red-200 text-[11px] font-extrabold uppercase">
                      {t.directHub}
                    </span>
                  </div>

                  {/* Stylized Flight Network Map with high contrast and refined arcs */}
                  <div className="relative h-44 bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between overflow-hidden shadow-inner">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 160" preserveAspectRatio="none">
                      <defs>
                        <pattern id="heroDotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="#475569" opacity="0.4" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#heroDotGrid)" />

                      {/* Flight Arc 1: Conakry to New York */}
                      <path
                        d="M 60 130 Q 110 30 250 45"
                        fill="none"
                        stroke="#C8102E"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        className="animate-pulse"
                      />
                      {/* Flight Arc 2: Conakry to Montreal */}
                      <path
                        d="M 60 130 Q 140 20 260 85"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeOpacity="0.6"
                        strokeDasharray="4 4"
                      />

                      <circle cx="60" cy="130" r="6" fill="#C8102E" />
                      <circle cx="60" cy="130" r="12" fill="#C8102E" opacity="0.25" />
                      <circle cx="250" cy="45" r="5" fill="#FFFFFF" />
                      <circle cx="260" cy="85" r="5" fill="#EF4444" />
                    </svg>

                    {/* Nodes annotations */}
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="bg-slate-950/90 border border-slate-700 px-2.5 py-1 rounded-lg text-left">
                        <span className="text-[10px] text-slate-300 font-bold block uppercase">{t.originLabel}</span>
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          🇬🇳 {t.originCity}
                        </span>
                      </div>

                      <div className="space-y-1 text-right">
                        <div className="bg-[#C8102E] text-white px-2 py-0.5 rounded text-[11px] font-bold inline-block shadow-xs">
                          🇺🇸 New York JFK
                        </div>
                        <div className="bg-slate-800 text-white/90 px-2 py-0.5 rounded text-[10px] font-bold block">
                          🇨🇦 Montréal YUL
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 font-semibold">
                        <Plane className="w-3 h-3 text-red-400" /> Fret aérien régulier
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Ship className="w-3 h-3 text-cyan-400" /> Conteneurs maritimes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Featured Next Departure Poster - Light & Elegant */}
                {activeAnnouncement && (
                  <div className="bg-gradient-to-br from-red-50/90 via-white to-amber-50/60 rounded-2xl p-4 border border-red-200/90 text-slate-900 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-[#C8102E] mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {t.nextFlightTitle}
                      </span>
                      <span className="bg-[#C8102E] text-white px-2 py-0.5 rounded text-[10px] uppercase font-extrabold shadow-2xs">
                        {activeAnnouncement.destinationCity}
                      </span>
                    </div>

                    <div className="text-lg font-extrabold tracking-tight uppercase text-slate-900">
                      {activeAnnouncement.departureDayLabel}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {activeAnnouncement.urgencyNote}
                    </p>

                    <div className="mt-3 pt-3 border-t border-red-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-600">
                        <span className="font-bold text-slate-800">Agences :</span> Hamdallaye, Bentouraya, Kindia, Coyah...
                      </div>
                      {/* Secondary Action on this card */}
                      <a
                        href="https://wa.me/224611835683?text=Bonjour%20Thiaguil,%20je%20veux%20déposer%20un%20colis%20pour%20le%20départ%20du%20"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-bold text-xs transition-colors shadow-2xs"
                      >
                        <span>{t.reserveButton}</span>
                        <ChevronRight className="w-3 h-3 text-[#C8102E]" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Quick Agency & WhatsApp Strip - Clean light design */}
                <div className="pt-1 text-xs">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>{t.contactsTitle}</span>
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <PhoneCall className="w-3 h-3 text-emerald-600" /> {t.directWhatsApp}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-700 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Hamdallaye (Siège) :</span>
                      <span className="text-slate-900 font-bold">625 69 83 79 / 628 25 97 15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">WhatsApp Entreprise :</span>
                      <span className="text-emerald-700 font-bold">611 83 56 83</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">New York (Bronx) :</span>
                      <span className="text-slate-900 font-bold">+1 (614) 254 2775</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
