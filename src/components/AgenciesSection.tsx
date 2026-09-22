import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Copy,
  Check,
  Building2,
  Navigation,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Agency } from '../types';
import { translations } from '../data/translations';
import { PlaceholderImage } from './PlaceholderImage';

export const AgenciesSection: React.FC = () => {
  const { agencies, language } = useApp();
  const t = translations[language].agencies;
  const [filter, setFilter] = useState<'all' | 'guinea' | 'international'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAgencies = agencies.filter((agency) => {
    if (filter === 'guinea') return !agency.isInternational;
    if (filter === 'international') return agency.isInternational;
    return true;
  });

  const handleCopy = (agency: Agency) => {
    const fullText = `${agency.name} - ${agency.address} (${agency.phones.join(', ')})`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(agency.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="agences" className="py-20 bg-canvas border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand font-bold text-xs uppercase tracking-wider border border-red-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 text-base">
            {t.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.filterAll} ({agencies.length})
          </button>
          <button
            onClick={() => setFilter('guinea')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'guinea'
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🇬🇳 {t.filterGuinea} ({agencies.filter((a) => !a.isInternational).length})
          </button>
          <button
            onClick={() => setFilter('international')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'international'
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🌎 {t.filterIntl} ({agencies.filter((a) => a.isInternational).length})
          </button>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.map((agency) => (
            <div
              key={agency.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                agency.isMainAgency
                  ? 'bg-white border-2 border-brand shadow-xl ring-4 ring-red-50'
                  : agency.isInternational
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-lg'
                  : 'bg-white border border-slate-200 shadow-md hover:shadow-lg'
              }`}
            >
              <div>
                <PlaceholderImage
                  label={t.photoPlaceholder}
                  caption={agency.name}
                  dark={agency.isInternational}
                  className="h-28 w-full mb-5"
                />

                {/* Agency Top Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    {agency.isInternational ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase">
                        {t.badgeIntl}
                      </span>
                    ) : agency.isMainAgency ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-brand text-white font-extrabold text-[10px] uppercase">
                        {t.badgeMain}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase">
                        {t.badgeLocal}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopy(agency)}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                      agency.isInternational
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={t.copyTitle}
                  >
                    {copiedId === agency.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-bold">{t.copiedLabel}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{t.copyLabel}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Name & City */}
                <h3
                  className={`text-lg font-extrabold tracking-tight mb-1 ${
                    agency.isInternational ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {agency.name}
                </h3>

                <div
                  className={`flex items-center gap-1.5 text-xs font-semibold mb-3 ${
                    agency.isInternational ? 'text-amber-300' : 'text-brand'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{agency.city}</span>
                </div>

                {/* Full Address */}
                <p
                  className={`text-xs leading-relaxed mb-4 ${
                    agency.isInternational ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {agency.address}
                  {agency.landmark && (
                    <span className="block font-medium mt-1 text-[11px] opacity-85">
                      {t.landmarkLabel} {agency.landmark}
                    </span>
                  )}
                </p>

                {/* Opening Hours */}
                <div
                  className={`py-2 px-3 rounded-xl text-[11px] font-medium mb-5 flex items-center gap-2 ${
                    agency.isInternational
                      ? 'bg-slate-950 text-slate-300 border border-slate-800'
                      : 'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>{agency.hours}</span>
                </div>

                {/* Phones & Contacts */}
                <div className="space-y-1.5 mb-6">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider block ${
                      agency.isInternational ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t.phonesLabel}
                  </span>
                  <div className="flex flex-col gap-1">
                    {agency.phones.map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className={`font-mono text-xs font-bold hover:underline flex items-center gap-1.5 ${
                          agency.isInternational ? 'text-emerald-400' : 'text-slate-900'
                        }`}
                      >
                        <Phone className="w-3 h-3 text-brand" />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/50 flex gap-2">
                <a
                  href={`tel:${agency.phones[0]?.replace(/\s+/g, '')}`}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors ${
                    agency.isInternational
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  <span>{t.callAction}</span>
                </a>

                <a
                  href={`https://wa.me/224611835683?text=Bonjour,%20je%20souhaite%20contacter%20l'agence%20de%20${agency.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center bg-brand hover:bg-brand-dark text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{t.whatsappAction}</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
