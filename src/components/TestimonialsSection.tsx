import React from 'react';
import { Star, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, language } = useApp();
  const t = translations[language].testimonials;

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand font-bold text-xs uppercase tracking-wider border border-red-200">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 text-base">
            {t.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-canvas border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                </div>

                {/* Route pill */}
                <div className="mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100/70 text-brand text-[10px] font-extrabold uppercase">
                    {item.destination}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                  « {item.comment} »
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    {item.author}
                  </h4>
                  <span className="text-[11px] text-slate-600 block">
                    {item.city}
                  </span>
                </div>

                {item.verified && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
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
