import React from 'react';
import { Smartphone, Landmark, Banknote, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

/**
 * Bandeau visuel des moyens de paiement acceptés, affiché dans le footer.
 *
 * Les libellés reprennent strictement les moyens de paiement déjà annoncés
 * dans la FAQ (voir FAQSection.tsx, question "moyens-paiement") : aucun
 * moyen de paiement supplémentaire n'est inventé ici. Les icônes sont des
 * pictogrammes génériques (lucide-react) — volontairement PAS les logos de
 * marque protégés d'Orange Money, MTN, Zelle ou Interac, pour ne pas laisser
 * entendre un partenariat officiel qui n'existe pas et éviter tout usage non
 * autorisé de logos tiers.
 */
export const PaymentMethodsStrip: React.FC = () => {
  const { language } = useApp();
  const t = translations[language].paymentMethods;

  const localMethods = [
    { icon: Smartphone, label: t.orangeMoney },
    { icon: Smartphone, label: t.mtnMoney },
    { icon: Landmark, label: t.bankTransferLocal },
    { icon: Banknote, label: t.cash },
  ];

  const internationalMethods = [
    { icon: ArrowLeftRight, label: t.zelle },
    { icon: ArrowLeftRight, label: t.interac },
    { icon: Landmark, label: t.bankTransferIntl },
  ];

  return (
    <div className="pt-10 mt-2 border-t border-slate-800">
      <h4 className="font-extrabold uppercase tracking-wider text-white text-xs mb-4">
        {t.title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <span className="block text-[11px] font-semibold text-slate-300 mb-2">
            {t.localTitle}
          </span>
          <div className="flex flex-wrap gap-2">
            {localMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200"
                >
                  <Icon className="w-3.5 h-3.5 text-brand shrink-0" />
                  {method.label}
                </span>
              );
            })}
          </div>
        </div>
        <div>
          <span className="block text-[11px] font-semibold text-slate-300 mb-2">
            {t.internationalTitle}
          </span>
          <div className="flex flex-wrap gap-2">
            {internationalMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200"
                >
                  <Icon className="w-3.5 h-3.5 text-brand shrink-0" />
                  {method.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
