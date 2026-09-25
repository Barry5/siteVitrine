import React from 'react';
import { Building2, Globe2, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

/**
 * Bandeau de repères de confiance. Les chiffres affichés ici sont calculés
 * directement à partir des données réelles du site (nombre d'agences,
 * destinations actives) — jamais une statistique marketing inventée
 * (ex: "X colis livrés") pour laquelle nous n'avons pas de chiffre vérifié.
 */
export const TrustStatsStrip: React.FC = () => {
  const { agencies, destinations, language } = useApp();
  const t = translations[language].trustStats;

  const localAgencies = agencies.filter((a) => !a.isInternational).length;
  const internationalOffices = agencies.filter((a) => a.isInternational).length;
  const activeDestinations = destinations.filter((d) => d.active).length;

  const stats = [
    {
      icon: Building2,
      value: String(localAgencies),
      label: t.localAgencies,
    },
    {
      icon: Globe2,
      value: String(internationalOffices),
      label: t.internationalOffices,
    },
    {
      icon: PlaneTakeoff,
      value: String(activeDestinations),
      label: t.destinationsServed,
    },
    {
      icon: ShieldCheck,
      value: null,
      label: t.qualityCharter,
    },
  ];

  return (
    <section aria-label={t.badge} className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-brand flex items-center justify-center border border-red-100 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  {stat.value && (
                    <span className="block text-xl font-extrabold text-stone-900 font-display">
                      {stat.value}
                    </span>
                  )}
                  <span className="block text-xs sm:text-xs text-stone-600 font-semibold">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
