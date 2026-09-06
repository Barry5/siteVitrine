import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Plane,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Printer,
  Calendar,
  Weight,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const TrackingSection: React.FC = () => {
  const {
    activeTrackedItem,
    activeSearchCode,
    trackingError,
    searchPackage,
    clearTracking,
    language,
  } = useApp();

  const t = translations[language].tracking;
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    if (activeSearchCode) {
      setQuickInput(activeSearchCode);
    }
  }, [activeSearchCode]);

  const handleMiniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    searchPackage(quickInput);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return {
          label: language === 'fr' ? 'ENREGISTRÉ EN AGENCE' : 'REGISTERED AT BRANCH',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'in_transit':
        return {
          label: language === 'fr' ? 'EN TRANSIT INTERNATIONAL (EN VOL)' : 'IN TRANSIT (AIR FREIGHT)',
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-600',
        };
      case 'customs':
        return {
          label: language === 'fr' ? 'EN COURS DE DÉDOUANEMENT' : 'CUSTOMS CLEARANCE IN PROGRESS',
          bg: 'bg-purple-100 text-purple-900 border-purple-300',
          dot: 'bg-purple-600',
        };
      case 'ready_for_pickup':
        return {
          label: language === 'fr' ? 'DISPONIBLE POUR RETRAIT AU BUREAU' : 'READY FOR PICKUP AT HUB',
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'delivered':
        return {
          label: language === 'fr' ? 'LIVRÉ AU DESTINATAIRE' : 'DELIVERED TO RECIPIENT',
          bg: 'bg-emerald-50 text-emerald-950 border-emerald-400',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          label: language === 'fr' ? 'TRAITEMENT EN COURS' : 'PROCESSING',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
        };
    }
  };

  return (
    <section id="suivi" className="py-14 sm:py-18 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Focused on Results display */}
        <div className="max-w-3xl mx-auto text-center space-y-2.5 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs uppercase tracking-wider border border-red-200">
            <Package className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Tracking Details Result Card */}
        {activeTrackedItem ? (
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl transition-all animate-fadeIn">
            {/* Top Status Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-wider text-amber-300">
                    {activeTrackedItem.trackingNumber}
                  </span>
                  {(() => {
                    const badge = getStatusBadge(activeTrackedItem.status);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bg}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${badge.dot} animate-ping`}></span>
                        <span>{badge.label}</span>
                      </span>
                    );
                  })()}
                </div>
                <div className="text-slate-300 text-xs sm:text-sm flex flex-wrap items-center gap-2">
                  <span>{t.sender} : <strong className="text-white">{activeTrackedItem.senderName}</strong></span>
                  <span>➔</span>
                  <span>{t.receiver} : <strong className="text-white">{activeTrackedItem.receiverName}</strong></span>
                </div>
              </div>

              {/* Action buttons with strict hierarchy: secondary WhatsApp & print */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/224611835683?text=Bonjour,%20je%20suis%20le%20colis%20${activeTrackedItem.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.whatsappHelp}</span>
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                  title={t.printReceipt}
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={clearTracking}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                  title={t.searchAnother}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.searchAnother}</span>
                </button>
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 bg-slate-50 border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">{t.origin}</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                  {activeTrackedItem.senderCity}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">{t.destination}</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-blue-600" />
                  {activeTrackedItem.destinationCity}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">{t.weight}</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <Weight className="w-3.5 h-3.5 text-slate-700" />
                  {activeTrackedItem.weightKg} kg
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">{t.estimatedDelivery}</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {activeTrackedItem.estimatedDeliveryDate}
                </span>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C8102E]" />
                  {t.historyTitle}
                </h4>
                <span className="text-xs text-slate-600 font-medium">
                  {language === 'fr' ? 'Dernier point de contrôle validé' : 'Latest verified milestone'}
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeTrackedItem.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center ring-4 ring-white transition-all ${
                        step.completed
                          ? step.current
                            ? 'bg-[#C8102E] text-white ring-red-100 shadow-md'
                            : 'bg-slate-900 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className={`space-y-1 ${step.current ? 'bg-red-50/70 p-3.5 rounded-xl border border-red-200/90 -mt-2' : ''}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`font-bold text-sm sm:text-base ${
                            step.current ? 'text-[#C8102E]' : step.completed ? 'text-slate-900' : 'text-slate-600'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {step.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <MapPin className="w-3 h-3 text-[#C8102E]" />
                        <span>{step.location}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pickup point instruction if ready */}
              {activeTrackedItem.pickupAgency && (
                <div className="mt-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold uppercase tracking-wide block">
                      {language === 'fr' ? 'Point de retrait assigné :' : 'Designated Pickup Hub:'}
                    </span>
                    <p className="font-semibold text-sm text-emerald-950">
                      {activeTrackedItem.pickupAgency}
                    </p>
                    <p className="text-emerald-700">
                      {language === 'fr'
                        ? "Veuillez vous munir d'une pièce d'identité valide lors du retrait."
                        : 'Please bring a valid ID and this tracking number when collecting your package.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty / Initial State: Clean Results Hub with Quick Selectors */
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#C8102E] flex items-center justify-center mx-auto border border-red-100">
              <Package className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                {t.noPackageTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {t.noPackageDesc}
              </p>
            </div>

            {/* Error Message if search failed */}
            {trackingError && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-sm text-left max-w-lg mx-auto">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{trackingError}</p>
                  <p className="text-xs text-amber-800">
                    {language === 'fr'
                      ? 'Vérifiez les caractères ou cliquez directement sur un colis témoin ci-dessous.'
                      : 'Please check your code or click one of the live demo parcels below.'}
                  </p>
                </div>
              </div>
            )}

            {/* Live demo parcels buttons */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">
                {language === 'fr' ? 'Consulter un colis pilote en cours :' : 'Inspect a live pilot parcel:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => searchPackage('THG-NY-8910')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="text-[11px] font-mono font-bold text-[#C8102E] group-hover:underline">
                    THG-NY-8910
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">New York JFK</div>
                  <div className="text-[11px] text-slate-600">En vol international</div>
                </button>

                <button
                  type="button"
                  onClick={() => searchPackage('THG-MTL-2708')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="text-[11px] font-mono font-bold text-[#C8102E] group-hover:underline">
                    THG-MTL-2708
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Montréal YUL</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">Prêt pour retrait</div>
                </button>

                <button
                  type="button"
                  onClick={() => searchPackage('THG-KND-0109')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="text-[11px] font-mono font-bold text-[#C8102E] group-hover:underline">
                    THG-KND-0109
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Kindia</div>
                  <div className="text-[11px] text-slate-600">Enregistré en agence</div>
                </button>
              </div>
            </div>

            {/* Quick direct number lookup without whole redundant banner */}
            <div className="pt-3 border-t border-slate-100 max-w-md mx-auto">
              <form onSubmit={handleMiniSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder={language === 'fr' ? 'Ou saisir un autre code de suivi...' : 'Or enter another tracking code...'}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#C8102E] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Afficher' : 'View'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
