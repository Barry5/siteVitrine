import React, { useState } from 'react';
import {
  Globe2,
  Plane,
  Ship,
  MapPin,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const DestinationsSection: React.FC = () => {
  const { destinations, language } = useApp();
  const t = translations[language].destinations;
  const activeDestinations = destinations.filter((d) => d.active);
  const [selectedDestId, setSelectedDestId] = useState<string>(activeDestinations[0]?.id || '');

  const selectedDest = activeDestinations.find((d) => d.id === selectedDestId) || activeDestinations[0];

  return (
    <section id="destinations" className="py-20 bg-canvas border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand font-bold text-xs uppercase tracking-wider border border-red-200">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Interactive Destination Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Destination Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1 block">
              {t.selectLabel}
            </span>

            {activeDestinations.map((dest) => {
              const isSelected = dest.id === selectedDest?.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white border-brand shadow-md ring-2 ring-red-100'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dest.flagEmoji}</span>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {dest.name}
                      </h4>
                      <span className="text-xs text-slate-600 font-medium">
                        {dest.country} • {t.airShortLabel} {dest.estimatedAirDays}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {dest.nextScheduledFlight && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-50 text-brand border border-red-200">
                        {dest.nextScheduledFlight}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-brand translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Rich Destination Focus Card */}
          <div className="lg:col-span-7">
            {selectedDest && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                {/* Destination Hero Title Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedDest.flagEmoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-extrabold text-slate-900">
                          {selectedDest.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                          {selectedDest.countryCode}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">
                        {t.lineLabel} {selectedDest.name}
                      </span>
                    </div>
                  </div>

                  {selectedDest.nextScheduledFlight && (
                    <div className="bg-gradient-to-r from-brand-darker to-brand text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                      <span className="block text-[10px] text-red-200 uppercase font-semibold">{t.nextFlightLabel}</span>
                      {selectedDest.nextScheduledFlight}
                    </div>
                  )}
                </div>

                {/* Speed & Delays Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Plane className="w-4 h-4 text-brand" />
                      <span>{t.airFreightLabel}</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 font-display">
                      {selectedDest.estimatedAirDays}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {t.airFreightNote}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Ship className="w-4 h-4 text-cyan-700" />
                      <span>{t.seaFreightLabel}</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 font-display">
                      {selectedDest.estimatedSeaDays}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {t.seaFreightNote}
                    </p>
                  </div>
                </div>

                {/* Local Distribution Office in Destination */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {t.localOfficeLabel}
                    </span>
                    <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {t.localOfficeTag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-extrabold text-base text-white">
                      {selectedDest.localContactName || `${t.officeFallback} ${selectedDest.name}`}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedDest.localAddress || t.addressFallback}
                    </p>
                  </div>

                  {selectedDest.localPhone && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-slate-300">{t.localPhoneLabel}</span>
                      <a
                        href={`tel:${selectedDest.localPhone}`}
                        className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {selectedDest.localPhone}
                      </a>
                    </div>
                  )}
                </div>

                {/* CTA to book or check pricing */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <a
                    href="#simulateur"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    <span>{t.simulateCta} {selectedDest.name}</span>
                  </a>

                  <a
                    href={`https://wa.me/224611835683?text=Bonjour,%20je%20souhaite%20expédier%20un%20colis%20vers%20${selectedDest.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>{t.planCta}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
