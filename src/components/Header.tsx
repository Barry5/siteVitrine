import React, { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentView, setCurrentView, language, setLanguage } = useApp();
  const t = translations[language].nav;

  // Menu volontairement court (5 liens). Services, destinations et FAQ
  // restent accessibles dans la page et dans le pied de page.
  const navLinks = [
    { label: t.departures, href: '#departs' },
    { label: t.tracking, href: '#suivi' },
    { label: t.rates, href: '#simulateur' },
    { label: t.agencies, href: '#agences' },
    { label: t.contact, href: '#contact' },
  ];

  const whatsappHref = 'https://wa.me/224611835683';

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'public') {
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
              if (currentView !== 'public') setCurrentView('public');
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="hover:text-brand transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
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

            {/* Contact direct WhatsApp (la réservation principale est dans le hero) */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white transition-colors text-sm font-bold"
              title={t.assistance}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xl:inline">+224 611 83 56 83</span>
              <span className="xl:hidden">WhatsApp</span>
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
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-brand" /> : <Menu className="w-6 h-6" />}
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
                className="px-3 py-2 rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-brand transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-[1.5px] border-ink text-ink font-bold text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp : +224 611 83 56 83</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
