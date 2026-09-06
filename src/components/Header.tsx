import React, { useState } from 'react';
import {
  Menu,
  X,
  Phone,
  Search,
  Package,
  Globe,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentView, setCurrentView, language, setLanguage } = useApp();
  const t = translations[language].nav;

  const navLinks = [
    { label: t.home, href: '#accueil' },
    { label: t.services, href: '#services' },
    { label: t.destinations, href: '#destinations' },
    { label: t.tracking, href: '#suivi' },
    { label: t.simulator, href: '#simulateur' },
    { label: t.agencies, href: '#agences' },
    { label: t.faq, href: '#faq' },
    { label: t.contact, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView === 'admin') {
      setCurrentView('public');
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <a
            href="#accueil"
            onClick={() => {
              if (currentView === 'admin') setCurrentView('public');
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="hover:text-[#C8102E] transition-colors py-1 relative group text-[13px]"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8102E] transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Hotline direct link */}
            <a
              href="tel:+224611835683"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-[#C8102E] hover:bg-slate-50 transition-colors text-xs font-semibold"
              title="Assistance directe WhatsApp / Téléphone"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight hidden 2xl:block">
                <span className="text-[10px] text-slate-600 uppercase block font-bold">{t.assistance}</span>
                <span className="text-xs font-bold text-slate-900">+224 611 83 56 83</span>
              </div>
            </a>

            {/* Language Switcher (FR / EN) */}
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-white text-slate-950 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Passer en français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-950 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Secondary CTA: Suivre un colis (discret / contour neutre) */}
            <a
              href="#suivi"
              onClick={() => handleNavClick('#suivi')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-800 transition-colors font-semibold text-xs shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.trackButton}</span>
            </a>

            {/* Primary Action (solid red - reserved single primary CTA for section) */}
            <a
              href="#simulateur"
              onClick={() => handleNavClick('#simulateur')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#A60D25] text-white transition-colors font-bold text-xs shadow-xs hover:shadow cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.sendButton}</span>
            </a>
          </div>

          {/* Mobile menu trigger & Lang */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Lang switch */}
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded transition-all ${
                  language === 'fr' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-all ${
                  language === 'en' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C8102E]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#C8102E] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {/* Secondary mobile button */}
            <a
              href="#suivi"
              onClick={() => handleNavClick('#suivi')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>{t.trackButton}</span>
            </a>

            {/* Primary mobile button */}
            <a
              href="#simulateur"
              onClick={() => handleNavClick('#simulateur')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8102E] text-white font-bold text-sm shadow-xs"
            >
              <Package className="w-4 h-4" />
              <span>{t.sendButton}</span>
            </a>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-600 px-2">
              <span className="flex items-center gap-1 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp : 611 83 56 83
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
