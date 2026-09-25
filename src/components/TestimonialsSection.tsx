import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { SectionEyebrow } from './SectionEyebrow';

export const TestimonialsSection: React.FC<{ number?: string }> = ({ number }) => {
  const { testimonials, language } = useApp();
  const t = translations[language].testimonials;

  // Aucun avis publié : la section n'apparaît pas (une section vide « Soyez
  // parmi les premiers » donnait au site un air inachevé).
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <SectionEyebrow number={number} label={translations[language].sections.testimonials} />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-stone-600 text-base">
            {t.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-canvas border border-stone-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-sand mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-1">{item.rating.toFixed(1)}</span>
                </div>

                {/* Route pill */}
                <div className="mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100/70 text-brand text-xs font-extrabold uppercase">
                    {item.destination}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-stone-700 leading-relaxed italic mb-6">
                  « {item.comment} »
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-stone-900">
                    {item.author}
                  </h4>
                  <span className="text-xs text-stone-600 block">
                    {item.city}
                  </span>
                </div>

                {item.verified && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    title={t.verifiedTitle}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{t.verifiedLabel}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
