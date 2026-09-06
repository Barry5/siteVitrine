import React from 'react';
import {
  PackagePlus,
  Scale,
  PlaneTakeoff,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Dépôt & Enregistrement',
      subtitle: 'En agence ou enlèvement',
      description:
        'Déposez votre colis dans l\'une de nos agences (Hamdallaye, Bentouraya, Kindia, Coyah, Kipé). Nous vérifions la nature des articles pour garantir la conformité douanière.',
      icon: <PackagePlus className="w-6 h-6 text-[#C8102E]" />,
      badge: 'Contrôle minutieux',
    },
    {
      number: '02',
      title: 'Pesée & Cerclage Sécurisé',
      subtitle: 'Préparation avec méthode',
      description:
        'Pesée certifiée devant vous. Application d\'un film étanche et scellement au scotch de sécurité haute résistance Thiaguil avec bordereau de traçabilité.',
      icon: <Scale className="w-6 h-6 text-[#C8102E]" />,
      badge: 'Scellé inviolable',
    },
    {
      number: '03',
      title: 'Acheminement & Suivi Direct',
      subtitle: 'Vols réguliers & Fret maritime',
      description:
        'Votre colis est embarqué sur le vol programmé. Suivez son avancement en direct sur le site grâce à votre numéro de suivi unique (ex: THG-NY-8910).',
      icon: <PlaneTakeoff className="w-6 h-6 text-[#C8102E]" />,
      badge: 'Traçabilité 24/7',
    },
    {
      number: '04',
      title: 'Mise à disposition & Retrait',
      subtitle: 'Au bureau de New York ou Montréal',
      description:
        'Alerte SMS et WhatsApp envoyée au destinataire dès l\'arrivée. Retrait simple et sécurisé en main propre au bureau local avec pièce d\'identité.',
      icon: <PackageCheck className="w-6 h-6 text-emerald-600" />,
      badge: 'Remise garantie',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] font-bold text-xs uppercase tracking-wider border border-red-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Processus Opérationnel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comment se déroule votre expédition ?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Un processus clair et rigoureux, conçu pour vous offrir une tranquillité d'esprit absolue du départ de Guinée jusqu'à la réception.
          </p>
        </div>

        {/* 4 Illustrated Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-[#FAF9F6] border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-[#C8102E]/40 hover:shadow-lg transition-all group"
            >
              <div>
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="font-display font-black text-2xl text-slate-300 group-hover:text-[#C8102E] transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Badge */}
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-100/60 text-[#C8102E] text-[10px] font-extrabold uppercase tracking-wide mb-2">
                  {step.badge}
                </span>

                {/* Titles */}
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1">
                  {step.title}
                </h3>
                <span className="text-xs font-semibold text-slate-600 block mb-3">
                  {step.subtitle}
                </span>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting line indicator for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banner with Authentic Quality Quote */}
        <div className="mt-14 max-w-4xl mx-auto p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
              Engagement Qualité Thiaguil
            </span>
            <p className="text-sm font-semibold text-slate-200 italic">
              « Chaque colis est enregistré, vérifié et préparé avec méthode avant son départ. Votre confiance mérite le meilleur. »
            </p>
          </div>

          <a
            href="https://wa.me/224611835683?text=Bonjour,%20je%20souhaite%20connaître%20les%20conditions%20d'emballage"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A60D25] text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            Poser une question à un agent
          </a>
        </div>
      </div>
    </section>
  );
};
