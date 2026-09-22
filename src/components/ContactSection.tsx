import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Send,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { PlaceholderImage } from './PlaceholderImage';
import { submitContactRequest } from '../lib/api';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactSection: React.FC = () => {
  const { agencies, language } = useApp();
  const t = translations[language].contact;
  const tAgencies = translations[language].agencies;
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    agency: agencies.find((a) => !a.isInternational)?.name || '',
    destination: 'New York (USA)',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitContactRequest(formData);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData((prev) => ({
          ...prev,
          fullName: '',
          phone: '',
          email: '',
          message: '',
        }));
      }, 5000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Socials */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 text-red-300 font-bold text-xs uppercase tracking-wider border border-red-800/80 mb-3">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{t.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                {t.title}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            <PlaceholderImage
              label={tAgencies.photoPlaceholder}
              caption={t.hqTitle}
              dark
              className="h-32 w-full"
            />

            {/* Direct Contact Cards */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-brand flex items-center justify-center shrink-0 border border-red-500/30">
                  <MapPin className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-0.5">
                    {t.hqTitle}
                  </h4>
                  <p className="text-slate-300 leading-snug">
                    Carrefour Concasseur, Hamdallaye, Commune de Ratoma, Conakry.
                  </p>
                  <span className="text-[11px] text-amber-300 font-semibold mt-1 block">
                    {t.hqLandmark}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-0.5">
                    {t.whatsappTitle}
                  </h4>
                  <div className="flex flex-col gap-0.5 text-slate-300 font-mono">
                    <span>Service Client WhatsApp : <strong className="text-emerald-400">+224 611 83 56 83</strong></span>
                    <span>Standard Hamdallaye : <strong className="text-white">+224 625 69 83 79</strong></span>
                    <span>Bureau New York (Bronx) : <strong className="text-amber-300">+1 (614) 254 2775</strong></span>
                    <span>Bureau Montréal : <strong className="text-amber-300">+1 (438) 927 1767</strong></span>
                  </div>
                </div>
              </div>

              {/* Social Link Facebook Badge */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-base">
                    f
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-xs block">
                      {t.facebookTitle}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {t.facebookSubtitle}
                    </span>
                  </div>
                </div>
                <a
                  href="https://www.facebook.com/p/Thiaguil-multi-services-61566989230221/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{t.visitPage}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quote / Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
              {t.formTitle}
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              {t.formSubtitle}
            </p>

            {status === 'success' ? (
              <div className="p-8 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 text-center space-y-3 animate-fadeIn" role="status" aria-live="polite">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-white text-lg">{t.successTitle}</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {t.successDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {status === 'error' && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t.errorGeneric}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-fullName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      {t.fullNameLabel}
                    </label>
                    <input
                      id="contact-fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder={t.fullNamePlaceholder}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      {t.phoneLabel}
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder={t.phonePlaceholder}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-agency" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      {t.agencyLabel}
                    </label>
                    <select
                      id="contact-agency"
                      name="agency"
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-brand"
                    >
                      {agencies
                        .filter((a) => !a.isInternational)
                        .map((agency) => (
                          <option key={agency.id} value={agency.name}>
                            {agency.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-destination" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      {t.destLabel}
                    </label>
                    <select
                      id="contact-destination"
                      name="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-brand"
                    >
                      <option value="New York (USA)">New York (USA)</option>
                      <option value="Montréal (Canada)">Montréal (Canada)</option>
                      <option value="Paris (France)">Paris (France)</option>
                      <option value="Berlin / Allemagne">Berlin / Allemagne</option>
                      <option value="Autre pays">Autre pays</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder={t.messagePlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'submitting' ? t.submitting : t.submitButton}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
