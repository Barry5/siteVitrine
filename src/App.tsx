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
  const { currentView } = useApp();

  if (currentView === 'admin') {
    return <AdminPortal />;
  }

  const isLegalPage =
    currentView === 'mentions-legales' ||
    currentView === 'confidentialite' ||
    currentView === 'cgv';

  if (isLegalPage) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas text-slate-900 selection:bg-brand selection:text-white">
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
    <div className="min-h-screen flex flex-col bg-canvas text-slate-900 selection:bg-brand selection:text-white">
      {/* Modern navigation bar with logo, links and admin access */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero « Prochain départ » : départ à venir, affiche, réservation + cartes Suivi / Tarifs / Agences */}
        <Hero />

        {/* Trust bar with real, computed figures (agencies/destinations) — never invented stats */}
        <TrustStatsStrip />

        {/* Live Parcel Tracking Module */}
        <TrackingSection />

        {/* Services & Package Typologies */}
        <ServicesSection />

        {/* Interactive Shipping Rate Calculator */}
        <ShippingCalculator />

        {/* International Destinations & Local Hubs */}
        <DestinationsSection />

        {/* 4-Step Operational Flow */}
        <HowItWorks />

        {/* Agencies & Local Network */}
        <AgenciesSection />

        {/* Verified Customer Testimonials */}
        <TestimonialsSection />

        {/* Frequently Asked Questions (FAQ Accordion) */}
        <FAQSection />

        {/* Direct Contact & Quote Form */}
        <ContactSection />
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
