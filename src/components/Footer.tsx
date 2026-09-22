import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const Footer: React.FC = () => {
  const { agencies, setCurrentView, language } = useApp();
  const t = translations[language].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyrightText = t.copyright.replace('{year}', String(new Date().getFullYear()));

  return (
    <footer className="bg-ink text-white border-t border-slate-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              {t.tagline}
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-[11px] text-slate-300">
              <span className="text-white font-bold block uppercase tracking-wider">
                {t.mottoLabel}
              </span>
              <p className="italic text-slate-300">
                {t.mottoText}
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs">
              {t.navTitle}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#accueil" className="hover:text-brand transition-colors">
                  {t.linkHome}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand transition-colors">
                  {t.linkServices}
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-brand transition-colors">
                  {t.linkDestinations}
                </a>
              </li>
              <li>
                <a href="#suivi" className="hover:text-brand transition-colors">
                  {t.linkTracking}
                </a>
              </li>
              <li>
                <a href="#simulateur" className="hover:text-brand transition-colors">
                  {t.linkSimulator}
                </a>
              </li>
              <li>
                <a href="#agences" className="hover:text-brand transition-colors">
                  {t.linkAgencies}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand transition-colors">
                  {t.linkFaq}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand transition-colors">
                  {t.linkContact}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Agency Hubs List */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs">
              {t.localAgenciesTitle}
            </h4>
            <ul className="space-y-2 text-slate-300 text-[11px]">
              {agencies
                .filter((a) => !a.isInternational)
                .map((agency) => (
                  <li key={agency.id}>
                    <strong className="text-white block">{agency.name} :</strong>
                    {agency.address} • {agency.phones.join(' / ')}
                  </li>
                ))}
            </ul>
          </div>

          {/* International Bureaux */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs">
              {t.intlOfficesTitle}
            </h4>
            <div className="space-y-2 text-slate-300 text-[11px]">
              {agencies
                .filter((a) => a.isInternational)
                .map((agency) => (
                  <div key={agency.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-amber-300 block font-bold">{agency.name} :</strong>
                    <span>{agency.address}</span>
                    <span className="block font-mono text-white font-semibold mt-0.5">
                      {agency.phones.join(' / ')}
                    </span>
                  </div>
                ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-300 font-semibold block mb-0.5">{t.centralAssistance}</span>
              <a href="tel:+224611835683" className="text-white font-mono font-bold hover:text-red-400 transition-colors">
                +224 611 83 56 83
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and discreet legal/admin line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300 text-[11px]">
          <p>{copyrightText}</p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.facebook.com/p/Thiaguil-multi-services-61566989230221/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {t.facebookLink}
            </a>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{t.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            {/* Discreet admin link as requested */}
            <button
              onClick={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-300 hover:text-slate-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Portail Interne Gestionnaire"
            >
              <Lock className="w-3 h-3 text-slate-300" />
              <span>{t.adminAccess}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
