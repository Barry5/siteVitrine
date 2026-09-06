import React from 'react';
import {
  Mail,
  Package,
  Boxes,
  Plane,
  Ship,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { INITIAL_SERVICES } from '../data/initialData';

export const ServicesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail':
        return <Mail className="w-6 h-6 text-[#C8102E]" />;
      case 'Package':
        return <Package className="w-6 h-6 text-[#C8102E]" />;
      case 'Boxes':
        return <Boxes className="w-6 h-6 text-[#C8102E]" />;
      case 'Plane':
        return <Plane className="w-6 h-6 text-[#C8102E]" />;
      case 'Ship':
        return <Ship className="w-6 h-6 text-[#C8102E]" />;
      default:
        return <Package className="w-6 h-6 text-[#C8102E]" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-[#FAF9F6] border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs uppercase tracking-wider border border-red-200">
            <Zap className="w-3.5 h-3.5" />
            <span>Offres & Typologies d'Envois</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Des solutions adaptées de l'enveloppe au conteneur complet
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Que vous envoyiez un document officiel urgent ou plusieurs m³ de fret, Thiaguil garantit une préparation méthodique et un conditionnement renforcé pour chaque colis.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INITIAL_SERVICES.map((service) => (
            <div
              key={service.id}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                service.highlighted
                  ? 'bg-white border-2 border-[#C8102E] shadow-xl ring-4 ring-red-50'
                  : 'bg-white border border-slate-200/90 shadow-md hover:shadow-lg'
              }`}
            >
              {service.highlighted && (
                <div className="absolute -top-3.5 left-7 px-3 py-0.5 rounded-full bg-[#C8102E] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  Le plus populaire
                </div>
              )}

              <div>
                {/* Icon & Category Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                    {getIcon(service.icon)}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">
                      Délai estimé
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900">
                      <Clock className="w-3 h-3 text-[#C8102E]" />
                      {service.transitTime}
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {service.name}
                </h3>
                <p className="text-xs font-semibold text-[#C8102E] mb-3">
                  {service.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Weight constraint pill */}
                <div className="mb-6 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Capacité :</span>
                  <span className="text-slate-900 font-extrabold">{service.weightLimit}</span>
                </div>

                {/* Key features checklist */}
                <div className="space-y-2.5 mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Avantages inclus :
                  </span>
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="#simulateur"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    service.highlighted
                      ? 'bg-[#C8102E] hover:bg-[#A60D25] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Calculer le tarif pour ce format</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}

          {/* Banner Card: Quality Commitment */}
          <div className="rounded-3xl p-7 bg-slate-900 text-white flex flex-col justify-between border border-slate-800 shadow-lg">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/30 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-1">
                La Charte Rigueur Thiaguil
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight mb-3">
                L'organisation fait la différence
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed space-y-2 mb-6">
                Chaque colis qui entre dans nos agences de Hamdallaye, Bentouraya, Kindia, Coyah ou Kipé fait l'objet d'une vérification stricte :
              </p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Pesée digitale certifiée en présence du client
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Scotchage et cerclage renforcé inviolable
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Bordereau numéroté et suivi SMS / WhatsApp
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/224611835683?text=Bonjour,%20je%20souhaite%20un%20renseignement%20sur%20les%20emballages"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
            >
              <span>Question sur l'emballage ? Contactez-nous</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
