import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
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

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  if (currentView === 'admin') {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 selection:bg-[#C8102E] selection:text-white">
      {/* Top dynamic announcements bar (Vol confirmation / Facebook posters) */}
      <AnnouncementBar />

      {/* Modern navigation bar with logo, links and admin access */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Quick Tracker & Departure Showcase */}
        <Hero />

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
      <MainLayout />
    </AppProvider>
  );
}
