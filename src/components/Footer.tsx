import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
  ArrowUp,
  Globe2,
  Heart,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { agencies, setCurrentView } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0F19] text-white border-t border-slate-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Votre partenaire de confiance pour le fret aérien, maritime et l'envoi de colis express entre la République de Guinée, l'Amérique du Nord (New York, Montréal) et l'Europe.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-[11px] text-slate-300">
              <span className="text-white font-bold block uppercase tracking-wider">
                Devise d'Entreprise
              </span>
              <p className="italic text-slate-300">
                « L'organisation fait la différence : chaque colis est enregistré, vérifié et préparé avec méthode avant son départ. »
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs">
              Navigation
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#accueil" className="hover:text-[#C8102E] transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C8102E] transition-colors">
                  Nos Services Fret
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#C8102E] transition-colors">
                  Destinations & Vols
                </a>
              </li>
              <li>
                <a href="#suivi" className="hover:text-[#C8102E] transition-colors">
                  Suivre un colis
                </a>
              </li>
              <li>
                <a href="#simulateur" className="hover:text-[#C8102E] transition-colors">
                  Simulateur de tarifs
                </a>
              </li>
              <li>
                <a href="#agences" className="hover:text-[#C8102E] transition-colors">
                  Toutes les Agences
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C8102E] transition-colors">
                  Questions fréquentes (FAQ)
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C8102E] transition-colors">
                  Contactez-nous
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Agency Hubs List */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs">
              Agences Locales Guinée
            </h4>
            <ul className="space-y-2 text-slate-300 text-[11px]">
              <li>
                <strong className="text-white block">Hamdallaye (Siège) :</strong>
                Carrefour Concasseur • 625 69 83 79 / 628 25 97 15
              </li>
              <li>
                <strong className="text-white block">Bentouraya :</strong>
                Axe RN1 • +224 627 25 97 43
              </li>
              <li>
                <strong className="text-white block">Kindia Centre :</strong>
                Centre-ville • +224 625 35 05 85
              </li>
              <li>
                <strong className="text-white block">Coyah :</strong>
                Centre Commercial • 623 47 98 26
              </li>
              <li>
                <strong className="text-white block">Kipé :</strong>
                Commune de Ratoma • 623 86 13 46
              </li>
              <li>
                <strong className="text-white block">Kountia CBA :</strong>
                Secteur CBA • 623 48 19 69 / 612 60 57 81
              </li>
            </ul>
          </div>

          {/* International Bureaux */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs">
              Bureaux Internationaux
            </h4>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-amber-300 block font-bold">🇺🇸 New York (Bronx Hub) :</strong>
                <span>1112 Brook Av Bronx, NY</span>
                <span className="block font-mono text-white font-semibold mt-0.5">+1 (614) 254-2775</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-amber-300 block font-bold">🇨🇦 Montréal (Point Relais) :</strong>
                <span>Réception & Retrait Montréal QC</span>
                <span className="block font-mono text-white font-semibold mt-0.5">+1 (438) 927-1767</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-300 font-semibold block mb-0.5">Assistance Centrale :</span>
              <a href="tel:+224611835683" className="text-white font-mono font-bold hover:text-red-400 transition-colors">
                +224 611 83 56 83
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and discreet legal/admin line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300 text-[11px]">
          <p>
            © {new Date().getFullYear()} Thiaguil Multi-services. Tous droits réservés. Agrément transitaire & fret international.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.facebook.com/people/Thiaguil-multi-services/61566989230221/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook Officiel
            </a>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Haut de page</span>
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
              <span>Accès Espace Interne</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
