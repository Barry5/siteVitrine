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

export const ShippingCalculator: React.FC = () => {
  const { destinations, agencies, pricingRules } = useApp();

  const [originAgencyId, setOriginAgencyId] = useState(agencies[0]?.id || '');
  const [destinationId, setDestinationId] = useState(destinations[0]?.id || '');
  const [transitMode, setTransitMode] = useState<'air' | 'sea'>('air');
  const [packageType, setPackageType] = useState<'envelope' | 'parcel'>('parcel');
  const [weightKg, setWeightKg] = useState<number>(5);

  const selectedDestination = destinations.find((d) => d.id === destinationId) || destinations[0];
  const selectedAgency = agencies.find((a) => a.id === originAgencyId) || agencies[0];
  const pricing = pricingRules.find((p) => p.destinationId === destinationId) || pricingRules[0];

  // Price calculations
  const calculateTotalGnf = () => {
    if (!pricing) return 0;

    if (packageType === 'envelope') {
      return pricing.envelopePriceGnf;
    }

    if (transitMode === 'air') {
      const billableWeight = Math.max(weightKg, pricing.minWeightKgAir || 1);
      return billableWeight * pricing.pricePerKgAirGnf;
    } else {
      const billableWeight = Math.max(weightKg, pricing.minWeightKgSea || 10);
      return billableWeight * pricing.pricePerKgSeaGnf;
    }
  };

  const totalGnf = calculateTotalGnf();
  // Approximate exchange rates for diaspora convenience:
  // 1 USD ~ 8,600 GNF
  // 1 CAD ~ 6,300 GNF
  const totalUsd = Math.round(totalGnf / 8600);
  const totalCad = Math.round(totalGnf / 6300);

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-GN').format(amount) + ' GNF';
  };

  const generateWhatsAppMessage = () => {
    const text = `Bonjour Thiaguil Multi-services, je souhaite réserver un envoi :
- Départ : ${selectedAgency?.name || 'Conakry'}
- Destination : ${selectedDestination?.name} (${selectedDestination?.country})
- Type : ${packageType === 'envelope' ? 'Enveloppe express' : `Colis de ${weightKg} kg`}
- Mode : ${transitMode === 'air' ? 'Fret Aérien Express' : 'Fret Maritime'}
- Estimation calculée : ~${formatGnf(totalGnf)}
Pouvez-vous me confirmer les modalités de dépôt ?`;
    return encodeURIComponent(text);
  };

  return (
    <section id="simulateur" className="py-20 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs uppercase tracking-wider border border-red-200">
            <Calculator className="w-3.5 h-3.5" />
            <span>Transparence Tarifaire</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simulateur de tarif d'expédition
          </h2>
          <p className="text-slate-600 text-base">
            Obtenez une estimation immédiate de votre envoi vers l'international selon le poids, l'agence de dépôt et le mode d'acheminement.
          </p>
        </div>

        {/* Calculator Interactive Box */}
        <div className="max-w-5xl mx-auto bg-[#FAF9F6] border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Type selection: Enveloppe vs Colis */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Format de l'envoi
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
                        ? 'bg-[#C8102E] text-white border-[#C8102E] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>✉️ Enveloppe / Documents (&lt; 1 kg)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPackageType('parcel')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      packageType === 'parcel'
                        ? 'bg-[#C8102E] text-white border-[#C8102E] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>📦 Colis / Bagages (kg)</span>
                  </button>
                </div>
              </div>

              {/* Transit Mode: Air vs Sea (only for parcels) */}
              {packageType === 'parcel' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    2. Mode d'acheminement
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTransitMode('air')}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        transitMode === 'air'
                          ? 'bg-white border-[#C8102E] ring-2 ring-red-100 shadow-sm'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900">
                        <Plane className="w-4 h-4 text-[#C8102E]" />
                        <span>Fret Aérien Express</span>
                      </div>
                      <span className="text-[11px] text-slate-600 mt-1 block">
                        Rapide • 3 à 5 jours ouvrés
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransitMode('sea')}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        transitMode === 'sea'
                          ? 'bg-white border-[#C8102E] ring-2 ring-red-100 shadow-sm'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900">
                        <Ship className="w-4 h-4 text-cyan-600" />
                        <span>Fret Maritime Éco</span>
                      </div>
                      <span className="text-[11px] text-slate-600 mt-1 block">
                        Économique • 25 à 35 jours
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Origin & Destination Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Agence de dépôt (Guinée)
                  </label>
                  <select
                    value={originAgencyId}
                    onChange={(e) => setOriginAgencyId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-[#C8102E] focus:outline-none"
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
                    Ville de destination
                  </label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-[#C8102E] focus:outline-none"
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
                      <Weight className="w-3.5 h-3.5 text-[#C8102E]" />
                      Poids estimé du colis :
                    </label>
                    <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                        className="w-16 font-extrabold text-[#C8102E] text-base text-right bg-transparent focus:outline-none"
                      />
                      <span className="font-extrabold text-xs text-[#C8102E]">KG</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C8102E]"
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
                    Estimation Instantanée
                  </span>
                  <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded text-slate-300 font-mono">
                    Devis indicatif
                  </span>
                </div>

                {/* Price Display */}
                <div className="py-6 text-center space-y-1">
                  <span className="text-xs font-semibold text-slate-300 block uppercase">
                    Montant estimé de l'envoi
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                    {formatGnf(totalGnf)}
                  </div>
                  <div className="text-xs text-amber-300/90 font-medium pt-1 flex justify-center gap-3">
                    <span>~ {totalUsd} $ USD</span>
                    <span>•</span>
                    <span>~ {totalCad} $ CAD</span>
                  </div>
                </div>

                {/* Breakdown specs */}
                <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Destination :</span>
                    <span className="text-white font-bold">
                      {selectedDestination?.name} ({selectedDestination?.country})
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">Délai indicatif :</span>
                    <span className="text-emerald-400 font-bold">
                      {transitMode === 'air' ? selectedDestination?.estimatedAirDays : selectedDestination?.estimatedSeaDays}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">Prochain vol prévu :</span>
                    <span className="text-amber-300 font-bold">
                      {selectedDestination?.nextScheduledFlight || 'Hebdomadaire'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-300">Retrait sur place :</span>
                    <span className="text-white font-bold truncate max-w-[170px]" title={selectedDestination?.localAddress}>
                      {selectedDestination?.localAddress || 'Bureau local Thiaguil'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Book via WhatsApp */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/224611835683?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#C8102E] hover:bg-[#A60D25] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Réserver ce tarif sur WhatsApp</span>
                </a>
                <p className="text-[10px] text-slate-300 text-center">
                  Tarif final pesé et certifié en agence avant scellement. Pas de frais cachés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
