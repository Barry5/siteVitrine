import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustStatsStrip } from './components/TrustStatsStrip';
import { TrackingSection } from './components/TrackingSection';
import { ServicesSection } from './components/ServicesSection';
import { ShippingCalculator } from './components/ShippingCalculator';
import { DestinationsSection } from './components/DestinationsSection';
import { HowItWorks } from './components/HowItWorks';
import { AgenciesSection } from './components/AgenciesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPortal } from './components/AdminPortal';
import { LegalPage } from './components/LegalPage';
import { Analytics } from './components/Analytics';

const MainLayout: React.FC = () => {
  const { currentView, testimonials } = useApp();

  // Numéro affiché au-dessus du titre de chaque section (« 01 — Nos services »).
  // La section Avis n'apparaît que s'il y a des avis : la numérotation suit.
  const sectionOrder = [
    'tracking',
    'services',
    'calculator',
    'destinations',
    'howItWorks',
    'agencies',
    ...(testimonials.length > 0 ? ['testimonials'] : []),
    'faq',
    'contact',
  ];
  const sectionNumber = (id: string) => String(sectionOrder.indexOf(id) + 1).padStart(2, '0');

  if (currentView === 'admin') {
    return <AdminPortal />;
  }

  const isLegalPage =
    currentView === 'mentions-legales' ||
    currentView === 'confidentialite' ||
    currentView === 'cgv';

  if (isLegalPage) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas text-stone-900 selection:bg-brand selection:text-white">
        <Header />
        <main className="flex-1">
          <LegalPage page={currentView} />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-stone-900 selection:bg-brand selection:text-white">
      {/* Modern navigation bar with logo, links and admin access */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero « Prochain départ » : départ à venir, affiche, réservation + cartes Suivi / Tarifs / Agences */}
        <Hero />

        {/* Trust bar with real, computed figures (agencies/destinations) — never invented stats */}
        <TrustStatsStrip />

        {/* Live Parcel Tracking Module */}
        <TrackingSection number={sectionNumber('tracking')} />

        {/* Services & Package Typologies */}
        <ServicesSection number={sectionNumber('services')} />

        {/* Interactive Shipping Rate Calculator */}
        <ShippingCalculator number={sectionNumber('calculator')} />

        {/* International Destinations & Local Hubs */}
        <DestinationsSection number={sectionNumber('destinations')} />

        {/* 4-Step Operational Flow */}
        <HowItWorks number={sectionNumber('howItWorks')} />

        {/* Agencies & Local Network */}
        <AgenciesSection number={sectionNumber('agencies')} />

        {/* Verified Customer Testimonials */}
        <TestimonialsSection number={sectionNumber('testimonials')} />

        {/* Frequently Asked Questions (FAQ Accordion) */}
        <FAQSection number={sectionNumber('faq')} />

        {/* Direct Contact & Quote Form */}
        <ContactSection number={sectionNumber('contact')} />
      </main>

      {/* Full-featured Footer */}
      <Footer />

      {/* Floating 24/7 WhatsApp Assistance */}
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      {/* No-op unless VITE_GA_MEASUREMENT_ID is set — never loads tracking without a real, user-provided ID */}
      <Analytics />
      <MainLayout />
    </AppProvider>
  );
}
