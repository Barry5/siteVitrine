import React, { useState } from 'react';
import {
  Menu,
  X,
  Phone,
  Search,
  Sliders,
  MapPin,
  Package,
  Calculator,
  ShieldCheck,
  Globe,
  Lock,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentView, setCurrentView, isAdminAuthenticated } = useApp();

  const navLinks = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Services', href: '#services' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'Suivre un colis', href: '#suivi' },
    { label: 'Simulateur', href: '#simulateur' },
    { label: 'Nos Agences', href: '#agences' },
    { label: 'Contact', href: '#contact' },
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
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="hover:text-[#C8102E] transition-colors py-1 relative group"
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:text-[#C8102E] hover:bg-slate-50 transition-colors text-xs font-semibold"
              title="Assistance directe WhatsApp / Téléphone"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight hidden 2xl:block">
                <span className="text-[10px] text-slate-600 uppercase block font-bold">Assistance</span>
                <span className="text-xs font-bold text-slate-900">+224 611 83 56 83</span>
              </div>
            </a>

            {/* Quick Tracking CTA */}
            <a
              href="#suivi"
              onClick={() => handleNavClick('#suivi')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors font-semibold text-xs shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span>Suivre un colis</span>
            </a>

            {/* Primary Action */}
            <a
              href="#simulateur"
              onClick={() => handleNavClick('#simulateur')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8102E] hover:bg-[#A60D25] text-white transition-colors font-bold text-xs shadow-sm hover:shadow"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Envoyer un colis</span>
            </a>

            {/* Admin Switch */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'public' : 'admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
              }`}
              title="Interface d'administration du site"
            >
              <Lock className="w-3 h-3 text-[#C8102E]" />
              <span className="hidden sm:inline">
                {currentView === 'admin' ? 'Retour Vitrine' : 'Espace Admin'}
              </span>
              {isAdminAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connecté"></span>
              )}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'public' : 'admin')}
              className="p-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
              title="Espace Admin"
            >
              <Lock className="w-4 h-4 text-[#C8102E]" />
            </button>
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
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#C8102E] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="#suivi"
              onClick={() => handleNavClick('#suivi')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Suivre mon colis en direct</span>
            </a>

            <a
              href="#simulateur"
              onClick={() => handleNavClick('#simulateur')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8102E] text-white font-bold text-sm"
            >
              <Package className="w-4 h-4" />
              <span>Estimer le tarif d'envoi</span>
            </a>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-600 px-2">
              <span className="flex items-center gap-1 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp : 611 83 56 83
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView(currentView === 'admin' ? 'public' : 'admin');
                }}
                className="text-[#C8102E] font-bold underline"
              >
                {currentView === 'admin' ? 'Retour Vitrine' : 'Connexion Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
