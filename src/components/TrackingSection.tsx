import React, { useState } from 'react';
import {
  Search,
  Package,
  Plane,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Share2,
  Phone,
  Printer,
  Calendar,
  Weight,
  User,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrackingStep } from '../types';

export const TrackingSection: React.FC = () => {
  const {
    activeTrackedItem,
    activeSearchCode,
    trackingError,
    searchPackage,
    clearTracking,
  } = useApp();

  const [inputVal, setInputVal] = useState(activeSearchCode || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    searchPackage(inputVal);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return {
          label: 'ENREGISTRÉ EN AGENCE',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'in_transit':
        return {
          label: 'EN TRANSIT INTERNATIONAL (EN VOL)',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-600',
        };
      case 'customs':
        return {
          label: 'EN COURS DE DÉDOUANEMENT',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          dot: 'bg-purple-600',
        };
      case 'ready_for_pickup':
        return {
          label: 'DISPONIBLE POUR RETRAIT AU BUREAU',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'delivered':
        return {
          label: 'LIVRÉ AU DESTINATAIRE',
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-400',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          label: 'TRAITEMENT EN COURS',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
        };
    }
  };

  return (
    <section id="suivi" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs uppercase tracking-wider border border-red-200">
            <Search className="w-3.5 h-3.5" />
            <span>Traçabilité & Statut en Direct</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Suivi de votre expédition internationale
          </h2>
          <p className="text-slate-600 text-base">
            Saisissez le numéro de bordereau délivré lors du dépôt en agence (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé) pour connaître l'acheminement précis de votre colis.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Numéro de suivi (ex: THG-NY-8910)..."
                className="w-full pl-4 pr-10 py-3.5 rounded-xl border-2 border-slate-300 focus:border-[#C8102E] focus:ring-4 focus:ring-red-100 text-slate-900 font-semibold placeholder:text-slate-600 text-sm shadow-xs transition-all"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    clearTracking();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#C8102E] hover:bg-[#A60D25] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Actualiser le statut</span>
            </button>
          </form>

          {/* Error Message */}
          {trackingError && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{trackingError}</p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span>Numéros tests opérationnels :</span>
                  <button
                    onClick={() => {
                      setInputVal('THG-NY-8910');
                      searchPackage('THG-NY-8910');
                    }}
                    className="font-bold underline text-[#C8102E] cursor-pointer"
                  >
                    THG-NY-8910
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setInputVal('THG-MTL-2708');
                      searchPackage('THG-MTL-2708');
                    }}
                    className="font-bold underline text-[#C8102E] cursor-pointer"
                  >
                    THG-MTL-2708
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setInputVal('THG-KND-0109');
                      searchPackage('THG-KND-0109');
                    }}
                    className="font-bold underline text-[#C8102E] cursor-pointer"
                  >
                    THG-KND-0109
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Details Result Card */}
        {activeTrackedItem ? (
          <div className="max-w-4xl mx-auto bg-[#FAF9F6] border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xl transition-all animate-fadeIn">
            {/* Top Status Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
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
                <div className="text-slate-300 text-xs sm:text-sm flex items-center gap-2">
                  <span>Expéditeur : <strong>{activeTrackedItem.senderName}</strong></span>
                  <span>➔</span>
                  <span>Destinataire : <strong>{activeTrackedItem.receiverName}</strong></span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/224611835683?text=Bonjour,%20je%20suis%20le%20colis%20${activeTrackedItem.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Aide WhatsApp</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Imprimer le reçu"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 bg-white border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">Origine</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                  {activeTrackedItem.senderCity}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">Destination</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-blue-600" />
                  {activeTrackedItem.destinationCity}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">Poids Certifié</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <Weight className="w-3.5 h-3.5 text-slate-700" />
                  {activeTrackedItem.weightKg} kg
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 block uppercase font-bold text-[10px]">Livraison Estimée</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {activeTrackedItem.estimatedDeliveryDate}
                </span>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="p-6 sm:p-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C8102E]" />
                Historique des étapes logistiques
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
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
                    <div className={`space-y-1 ${step.current ? 'bg-red-50/60 p-3.5 rounded-xl border border-red-200/80 -mt-2' : ''}`}>
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
                      Point de retrait assigné :
                    </span>
                    <p className="font-semibold text-sm text-emerald-950">
                      {activeTrackedItem.pickupAgency}
                    </p>
                    <p className="text-emerald-700">
                      Veuillez vous munir d'une pièce d'identité valide lors du retrait.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty placeholder prompt */
          <div className="max-w-2xl mx-auto text-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#C8102E] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">
              Aucun colis recherché pour le moment
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Testez immédiatement notre simulateur de suivi avec l'un des colis pilotes en cours d'acheminement :
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setInputVal('THG-NY-8910');
                  searchPackage('THG-NY-8910');
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:border-[#C8102E] hover:text-[#C8102E] transition-all shadow-2xs cursor-pointer"
              >
                ✈️ THG-NY-8910 (New York en vol)
              </button>
              <button
                onClick={() => {
                  setInputVal('THG-MTL-2708');
                  searchPackage('THG-MTL-2708');
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:border-[#C8102E] hover:text-[#C8102E] transition-all shadow-2xs cursor-pointer"
              >
                🇨🇦 THG-MTL-2708 (Montréal prêt pour retrait)
              </button>
              <button
                onClick={() => {
                  setInputVal('THG-KND-0109');
                  searchPackage('THG-KND-0109');
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:border-[#C8102E] hover:text-[#C8102E] transition-all shadow-2xs cursor-pointer"
              >
                🇬🇳 THG-KND-0109 (Kindia enregistré)
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
