import React, { useState } from 'react';
import {
  Plane,
  Ship,
  MapPin,
  Phone,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { SectionEyebrow } from './SectionEyebrow';
import { nextDepartureLabel } from '../lib/departures';

export const DestinationsSection: React.FC<{ number?: string }> = ({ number }) => {
  const { destinations, announcements, language } = useApp();
  // Prochain départ = celui publié dans l'admin (plus de date écrite en dur).
  const nextFlight = (name: string) => nextDepartureLabel(announcements, name, language);
  const t = translations[language].destinations;
  const activeDestinations = destinations.filter((d) => d.active);
  const [selectedDestId, setSelectedDestId] = useState<string>(activeDestinations[0]?.id || '');

  const selectedDest = activeDestinations.find((d) => d.id === selectedDestId) || activeDestinations[0];

  return (
    <section id="destinations" className="py-20 bg-canvas border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <SectionEyebrow number={number} label={translations[language].sections.destinations} />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Interactive Destination Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Destination Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1 block">
              {t.selectLabel}
            </span>

            {activeDestinations.map((dest) => {
              const isSelected = dest.id === selectedDest?.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white border-brand shadow-md ring-2 ring-red-100'
                      : 'bg-white/80 border-stone-200 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dest.flagEmoji}</span>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
                        {dest.name}
                      </h4>
                      <span className="text-xs text-stone-600 font-medium">
                        {dest.country} • {t.airShortLabel} {dest.estimatedAirDays}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {nextFlight(dest.name) && (
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-brand border border-red-200">
                        {nextFlight(dest.name)}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-brand translate-x-1' : 'text-stone-600'
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
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Destination Hero Title Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedDest.flagEmoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-extrabold text-stone-900">
                          {selectedDest.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold uppercase">
                          {selectedDest.countryCode}
                        </span>
                      </div>
                      <span className="text-xs text-stone-600 font-medium">
                        {t.lineLabel} {selectedDest.name}
                      </span>
                    </div>
                  </div>

                  {nextFlight(selectedDest.name) && (
                    <div className="bg-brand text-white px-3.5 py-1.5 rounded-lg text-xs font-bold">
                      <span className="block text-xs text-red-100 font-semibold">{t.nextFlightLabel}</span>
                      {nextFlight(selectedDest.name)}
                    </div>
                  )}
                </div>

                {/* Speed & Delays Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      <Plane className="w-4 h-4 text-brand" />
                      <span>{t.airFreightLabel}</span>
                    </div>
                    <div className="text-xl font-extrabold text-stone-900 font-display">
                      {selectedDest.estimatedAirDays}
                    </div>
                    <p className="text-xs text-stone-600">
                      {t.airFreightNote}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      <Ship className="w-4 h-4 text-stone-700" />
                      <span>{t.seaFreightLabel}</span>
                    </div>
                    <div className="text-xl font-extrabold text-stone-900 font-display">
                      {selectedDest.estimatedSeaDays}
                    </div>
                    <p className="text-xs text-stone-600">
                      {t.seaFreightNote}
                    </p>
                  </div>
                </div>

                {/* Local Distribution Office in Destination */}
                <div className="p-5 rounded-xl bg-ink text-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-sand font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {t.localOfficeLabel}
                    </span>
                    <span className="text-xs bg-ink-2 text-slate-300 px-2 py-0.5 rounded">
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
                    <div className="pt-2 border-t border-ink-line flex items-center justify-between flex-wrap gap-2 text-xs">
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm transition-colors"
                  >
                    <span>{t.simulateCta} {selectedDest.name}</span>
                  </a>

                  <a
                    href={`https://wa.me/224611835683?text=Bonjour,%20je%20souhaite%20expédier%20un%20colis%20vers%20${selectedDest.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-lg bg-brand hover:bg-brand-dark text-white font-extrabold text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.planCta}</span>
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
