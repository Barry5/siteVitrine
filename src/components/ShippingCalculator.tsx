import React, { useState } from 'react';
import {
  Calculator,
  Plane,
  Ship,
  MapPin,
  Weight,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Check,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const ShippingCalculator: React.FC = () => {
  const { destinations, agencies, pricingRules, exchangeRates, language } = useApp();
  const t = translations[language].calculator;

  const [originAgencyId, setOriginAgencyId] = useState(agencies[0]?.id || '');
  const [destinationId, setDestinationId] = useState(destinations[0]?.id || '');
  const [transitMode, setTransitMode] = useState<'air' | 'sea'>('air');
  const [packageType, setPackageType] = useState<'envelope' | 'parcel'>('parcel');
  const [weightKg, setWeightKg] = useState<number>(5);

  const selectedDestination = destinations.find((d) => d.id === destinationId) || destinations[0];
  const selectedAgency = agencies.find((a) => a.id === originAgencyId) || agencies[0];
  // Pas de repli sur une autre ligne : une destination sans grille tarifaire
  // affiche « Tarif sur demande » (avant, Bruxelles prenait les prix de New York).
  const pricing = pricingRules.find((p) => p.destinationId === selectedDestination?.id) ?? null;

  // Poids facturé : jamais moins que le minimum de la ligne (réglé dans l'admin).
  const minWeightKg = pricing ? (transitMode === 'air' ? pricing.minWeightKgAir : pricing.minWeightKgSea) : 0;
  const billableWeight = Math.max(weightKg, minWeightKg || 0);

  // Price calculations
  const calculateTotalGnf = () => {
    if (!pricing) return 0;

    if (packageType === 'envelope') {
      return pricing.envelopePriceGnf;
    }

    return billableWeight * (transitMode === 'air' ? pricing.pricePerKgAirGnf : pricing.pricePerKgSeaGnf);
  };

  const totalGnf = calculateTotalGnf();
  const totalUsd = Math.round(totalGnf / exchangeRates.usdGnf);
  const totalCad = Math.round(totalGnf / exchangeRates.cadGnf);

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-GN' : 'en-US').format(amount) + ' GNF';
  };

  const generateWhatsAppMessage = () => {
    const text = language === 'fr'
      ? `Bonjour Thiaguil Multi-services, je souhaite réserver un envoi :
- Départ : ${selectedAgency?.name || 'Conakry'}
- Destination : ${selectedDestination?.name} (${selectedDestination?.country})
- Type : ${packageType === 'envelope' ? 'Enveloppe express' : `Colis de ${weightKg} kg`}
- Mode : ${transitMode === 'air' ? 'Fret Aérien Express' : 'Fret Maritime'}
- ${pricing ? `Estimation calculée : ~${formatGnf(totalGnf)}` : 'Tarif : sur demande'}
Pouvez-vous me confirmer les modalités de dépôt ?`
      : `Hello Thiaguil Multi-services, I would like to book a shipment:
- Departure: ${selectedAgency?.name || 'Conakry'}
- Destination: ${selectedDestination?.name} (${selectedDestination?.country})
- Type: ${packageType === 'envelope' ? 'Express Envelope' : `Parcel of ${weightKg} kg`}
- Mode: ${transitMode === 'air' ? 'Air Freight Express' : 'Sea Freight'}
- ${pricing ? `Estimated quote: ~${formatGnf(totalGnf)}` : 'Price: on request'}
Could you confirm the branch deposit details?`;

    return encodeURIComponent(text);
  };

  return (
    <section id="simulateur" className="py-20 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand font-bold text-xs uppercase tracking-wider border border-red-200">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 text-base">
            {t.subtitle}
          </p>
        </div>

        {/* Calculator Interactive Box */}
        <div className="max-w-5xl mx-auto bg-canvas border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Type selection: Enveloppe vs Colis (Segmented controls with clean active state) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t.stepFormat}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPackageType('envelope');
                      setTransitMode('air');
                    }}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      packageType === 'envelope'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.envelopeOption}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPackageType('parcel')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      packageType === 'parcel'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.parcelOption}</span>
                  </button>
                </div>
              </div>

              {/* Transit Mode: Air vs Sea (only for parcels) */}
              {packageType === 'parcel' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {t.stepMode}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTransitMode('air')}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        transitMode === 'air'
                          ? 'bg-white border-brand ring-2 ring-red-100 shadow-sm'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900">
                        <Plane className="w-4 h-4 text-brand" />
                        <span>{t.airModeTitle}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 mt-1 block">
                        {t.airModeDesc}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransitMode('sea')}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        transitMode === 'sea'
                          ? 'bg-white border-brand ring-2 ring-red-100 shadow-sm'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900">
                        <Ship className="w-4 h-4 text-cyan-600" />
                        <span>{t.seaModeTitle}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 mt-1 block">
                        {t.seaModeDesc}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Origin & Destination Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {t.originLabel}
                  </label>
                  <select
                    value={originAgencyId}
                    onChange={(e) => setOriginAgencyId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    {agencies
                      .filter((a) => !a.isInternational)
                      .map((agency) => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name} ({agency.city})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {t.destLabel}
                  </label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.flagEmoji} {dest.name} ({dest.country})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weight Slider & Input (for parcels) */}
              {packageType === 'parcel' && (
                <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Weight className="w-3.5 h-3.5 text-brand" />
                      {t.weightLabel}
                    </label>
                    <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                        className="w-16 font-extrabold text-brand text-base text-right bg-transparent focus:outline-none"
                      />
                      <span className="font-extrabold text-xs text-brand">KG</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
                  />

                  <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                    <span>1 kg (Petit)</span>
                    <span>10 kg (Standard)</span>
                    <span>25 kg (Valise)</span>
                    <span>50+ kg (Fret)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Instant Calculation Quote Summary */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl border border-slate-800">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.instantEstimate}
                  </span>
                  <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded text-slate-300 font-mono">
                    {t.indicativeQuote}
                  </span>
                </div>

                {/* Price Display */}
                <div className="py-6 text-center space-y-1">
                  <span className="text-xs font-semibold text-slate-300 block uppercase">
                    {t.estimatedAmount}
                  </span>
                  {pricing ? (
                    <>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                        {formatGnf(totalGnf)}
                      </div>
                      <div className="text-xs text-amber-300/90 font-medium pt-1 flex justify-center gap-3">
                        <span>~ {totalUsd} $ USD</span>
                        <span>•</span>
                        <span>~ {totalCad} $ CAD</span>
                      </div>
                      {packageType === 'parcel' && billableWeight > weightKg && (
                        <p className="text-[11px] text-slate-300 pt-2">
                          {t.minWeightNote.replace('{kg}', String(minWeightKg))}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                        {t.onRequest}
                      </div>
                      <p className="text-xs text-slate-300 pt-1">{t.onRequestHelp}</p>
                    </>
                  )}
                </div>

                {/* Breakdown specs */}
                <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.destLabel} :</span>
                    <span className="text-white font-bold">
                      {selectedDestination?.name} ({selectedDestination?.country})
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.indicativeTransit}</span>
                    <span className="text-emerald-400 font-bold">
                      {transitMode === 'air' ? selectedDestination?.estimatedAirDays : selectedDestination?.estimatedSeaDays}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.nextFlight}</span>
                    <span className="text-amber-300 font-bold">
                      {selectedDestination?.nextScheduledFlight || (language === 'fr' ? 'Hebdomadaire' : 'Weekly')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">{t.localPickup}</span>
                    <span className="text-white font-bold truncate max-w-[170px]" title={selectedDestination?.localAddress}>
                      {selectedDestination?.localAddress || (language === 'fr' ? 'Bureau local Thiaguil' : 'Local Thiaguil Hub')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Solitary Primary CTA of this section */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/224611835683?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{pricing ? t.bookWhatsApp : t.askQuote}</span>
                </a>
                <p className="text-[10px] text-slate-300 text-center">
                  {t.guaranteeNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
