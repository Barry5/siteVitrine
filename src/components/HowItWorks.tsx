import React from 'react';
import {
  PackagePlus,
  Scale,
  PlaneTakeoff,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const HowItWorks: React.FC = () => {
  const { language } = useApp();
  const t = translations[language].howItWorks;

  const steps = [
    {
      number: '01',
      title: t.step1Title,
      subtitle: t.step1Subtitle,
      description: t.step1Desc,
      icon: <PackagePlus className="w-6 h-6 text-brand" />,
      badge: t.step1Badge,
    },
    {
      number: '02',
      title: t.step2Title,
      subtitle: t.step2Subtitle,
      description: t.step2Desc,
      icon: <Scale className="w-6 h-6 text-brand" />,
      badge: t.step2Badge,
    },
    {
      number: '03',
      title: t.step3Title,
      subtitle: t.step3Subtitle,
      description: t.step3Desc,
      icon: <PlaneTakeoff className="w-6 h-6 text-brand" />,
      badge: t.step3Badge,
    },
    {
      number: '04',
      title: t.step4Title,
      subtitle: t.step4Subtitle,
      description: t.step4Desc,
      icon: <PackageCheck className="w-6 h-6 text-emerald-600" />,
      badge: t.step4Badge,
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand font-bold text-xs uppercase tracking-wider border border-red-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Illustrated Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-canvas border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-brand/40 hover:shadow-lg transition-all group"
            >
              <div>
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="font-display font-black text-2xl text-slate-300 group-hover:text-brand transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Badge */}
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-100/60 text-brand text-[10px] font-extrabold uppercase tracking-wide mb-2">
                  {step.badge}
                </span>

                {/* Titles */}
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1">
                  {step.title}
                </h3>
                <span className="text-xs font-semibold text-slate-600 block mb-3">
                  {step.subtitle}
                </span>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting line indicator for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banner with Authentic Quality Quote */}
        <div className="mt-14 max-w-4xl mx-auto p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
              {t.commitmentLabel}
            </span>
            <p className="text-sm font-semibold text-slate-200 italic">
              {t.commitmentQuote}
            </p>
          </div>

          <a
            href="https://wa.me/224611835683?text=Bonjour,%20je%20souhaite%20connaître%20les%20conditions%20d'emballage"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            {t.commitmentCta}
          </a>
        </div>
      </div>
    </section>
  );
};
