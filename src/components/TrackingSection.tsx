import React, { useEffect, useRef } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  Plane,
  Printer,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Ship,
  Truck,
  Weight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import {
  TRACKING_STAGE_COUNT,
  formatTrackingDate,
  isAwaitingPickup,
  isProblemStatus,
  trackingNumberFromUrl,
  trackingStage,
} from '../lib/tracking';
import type { TrackedParcel } from '../types';
import { SectionEyebrow } from './SectionEyebrow';

const WHATSAPP_NUMBER = '224611835683';
const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Place le curseur dans le champ de suivi de l'accueil (le seul champ de saisie du site). */
export function focusHeroTrackingField() {
  const field = document.getElementById('hero-tracking') as HTMLInputElement | null;
  if (!field) return;
  field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  field.focus({ preventScroll: true });
}

/**
 * Résultat du suivi de colis : données réelles de ColisBox, via le serveur du
 * site (GET /api/tracking/:numero). Le numéro se saisit dans la carte « Suivre
 * un colis » de l'accueil (id="suivi") : cette zone n'apparaît que pendant une
 * recherche, avec son résultat ou son erreur — plus de second champ identique.
 * Un lien du type colisthiaguil.com/?suivi=NUMÉRO lance directement la recherche.
 */
export const TrackingSection: React.FC<{ number?: string }> = ({ number }) => {
  const { activeTrackedItem, trackingError, trackingLoading, searchPackage, clearTracking, language } = useApp();
  const t = translations[language].tracking;
  const zoneRef = useRef<HTMLDivElement>(null);
  const visible = Boolean(activeTrackedItem || trackingLoading || trackingError);

  // Lien direct ?suivi=NUMÉRO (par ex. envoyé au client par WhatsApp).
  useEffect(() => {
    const code = trackingNumberFromUrl();
    if (code) searchPackage(code);
    // Une seule fois, à l'ouverture de la page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // À chaque recherche, on descend jusqu'au résultat.
  useEffect(() => {
    if (!trackingLoading) return;
    requestAnimationFrame(() => zoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [trackingLoading]);

  const searchAgain = () => {
    clearTracking();
    focusHeroTrackingField();
  };

  return (
    <div id="suivi-resultat" ref={zoneRef} className="scroll-mt-24">
      {visible && (
        <section aria-live="polite" className="py-14 sm:py-16 bg-stone-50/70 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-2.5 mb-8">
              <SectionEyebrow number={number} label={translations[language].sections.tracking} />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">{t.title}</h2>
            </div>

            {trackingLoading ? (
              <p role="status" className="flex items-center justify-center gap-2 text-sm font-semibold text-stone-600">
                <RefreshCcw className="w-4 h-4 animate-spin text-brand" />
                {t.loading}
              </p>
            ) : activeTrackedItem ? (
              <TrackingResult parcel={activeTrackedItem} onReset={searchAgain} />
            ) : trackingError ? (
              <div
                role="alert"
                className="max-w-2xl mx-auto p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-3">
                  <p className="font-semibold">
                    {trackingError.kind === 'not_found'
                      ? t.notFound.replace('{code}', trackingError.code)
                      : trackingError.kind === 'invalid_number'
                        ? t.invalidNumber.replace('{code}', trackingError.code)
                        : trackingError.kind === 'too_many_requests'
                          ? t.tooManyRequests
                          : t.unavailable}
                  </p>
                  {trackingError.kind === 'not_found' && <p className="text-amber-800">{t.notFoundHelp}</p>}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={searchAgain}
                      className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 text-sm font-bold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t.fixNumber}
                    </button>
                    <a
                      href={whatsappLink(t.contactMessage.replace('{code}', trackingError.code))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t.contactAgency}
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const TrackingResult: React.FC<{ parcel: TrackedParcel; onReset: () => void }> = ({ parcel, onReset }) => {
  const { language } = useApp();
  const t = translations[language].tracking;

  const statusLabel = t.statuses[parcel.status] ?? t.unknownStatus;
  const stage = trackingStage(parcel.status);
  const problem = isProblemStatus(parcel.status);
  const lastEvent = parcel.history[0];
  const transportLabel = parcel.transportMode ? t.transportModes[parcel.transportMode] ?? '' : '';
  const TransportIcon = parcel.transportMode === 'maritime' ? Ship : parcel.transportMode === 'road' ? Truck : Plane;

  const origin = [parcel.originBranchName, parcel.originCountry].filter(Boolean).join(' · ');
  const destination = [parcel.destinationCity, parcel.destinationCountry].filter(Boolean).join(' · ');

  const meta: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: t.origin, value: origin, icon: <MapPin className="w-3.5 h-3.5 text-brand" /> },
    { label: t.destination, value: destination, icon: <MapPin className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: t.transport, value: transportLabel, icon: <TransportIcon className="w-3.5 h-3.5 text-stone-700" /> },
    {
      label: t.weight,
      value: parcel.weightKg !== null ? `${parcel.weightKg.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB')} kg` : '',
      icon: <Weight className="w-3.5 h-3.5 text-stone-700" />,
    },
    {
      label: t.estimatedDelivery,
      value: formatTrackingDate(parcel.estimatedDeliveryDate, language),
      icon: <Calendar className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      label: t.registeredOn,
      value: formatTrackingDate(parcel.createdAt, language),
      icon: <Clock className="w-3.5 h-3.5 text-stone-700" />,
    },
  ].filter((item) => item.value);

  const badgeClass = problem
    ? 'bg-amber-100 text-amber-900 border-amber-300'
    : parcel.status === 'delivered'
      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
      : isAwaitingPickup(parcel.status)
        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
        : 'bg-sand/15 text-sand border-sand/40';

  return (
    <div className="max-w-4xl mx-auto bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
      {/* En-tête : numéro, statut, expéditeur → destinataire */}
      <div className="bg-ink text-white p-5 sm:p-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <span className="block font-mono text-lg sm:text-2xl font-extrabold tracking-wider text-sand break-all">
            {parcel.trackingNumber}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badgeClass}`}>
            {parcel.status === 'delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-current" />}
            {statusLabel}
          </span>
          {(parcel.senderName || parcel.recipientName) && (
            <p className="text-slate-300 text-xs sm:text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
              {parcel.senderName && (
                <span>
                  {t.sender} : <strong className="text-white">{parcel.senderName}</strong>
                </span>
              )}
              {parcel.senderName && parcel.recipientName && <span aria-hidden="true">→</span>}
              {parcel.recipientName && (
                <span>
                  {t.receiver} : <strong className="text-white">{parcel.recipientName}</strong>
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={whatsappLink(t.whatsAppMessage.replace('{code}', parcel.trackingNumber))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {t.whatsAppHelp}
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center min-h-10 min-w-10 rounded-lg bg-ink-2 hover:bg-ink-line text-slate-300 hover:text-white transition-colors cursor-pointer border border-ink-line"
            title={t.printReceipt}
            aria-label={t.printReceipt}
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 min-h-10 px-3 rounded-lg bg-ink-2 hover:bg-ink-line text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-ink-line"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.searchAnother}
          </button>
        </div>
      </div>

      {/* Frise des 5 étapes */}
      {stage !== null && (
        <ol className="grid grid-cols-5 gap-1 sm:gap-2 px-4 sm:px-8 pt-6 sm:pt-8" aria-label={statusLabel}>
          {t.stages.slice(0, TRACKING_STAGE_COUNT).map((label, i) => {
            const done = i <= stage;
            const current = i === stage;
            return (
              <li key={label} className="flex flex-col items-center text-center gap-2" aria-current={current ? 'step' : undefined}>
                <span
                  className={`h-1.5 w-full rounded-full ${done ? (current ? 'bg-brand' : 'bg-ink') : 'bg-stone-200'}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs sm:text-xs leading-tight font-bold ${
                    current ? 'text-brand' : done ? 'text-stone-900' : 'text-stone-500'
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {problem && (
        <div role="alert" className="mx-4 sm:mx-8 mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-bold">{t.problemTitle}</p>
            <p className="text-amber-800">{t.problemBody}</p>
            <a
              href={whatsappLink(t.whatsAppMessage.replace('{code}', parcel.trackingNumber))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {t.contactAgency}
            </a>
          </div>
        </div>
      )}

      {/* Informations du colis (seulement celles fournies par ColisBox) */}
      {meta.length > 0 && (
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 m-4 sm:m-8 mb-0 sm:mb-0 p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
          {meta.map((item) => (
            <div key={item.label} className="space-y-1 min-w-0">
              <dt className="text-stone-600 uppercase font-bold text-xs tracking-wide">{item.label}</dt>
              <dd className="font-extrabold text-stone-900 text-sm flex items-start gap-1.5 break-words">
                <span className="mt-0.5 shrink-0">{item.icon}</span>
                <span className="min-w-0">{item.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Historique */}
      <div className="p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand" />
            {t.historyTitle}
          </h3>
          {lastEvent && (
            <span className="text-xs text-stone-600 font-medium">
              {t.lastUpdate} : {formatTrackingDate(lastEvent.timestamp, language, true)}
            </span>
          )}
        </div>

        {parcel.history.length === 0 ? (
          <p className="text-sm text-stone-600">{t.noHistory}</p>
        ) : (
          <ol className="relative pl-7 space-y-6 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {parcel.history.map((event, idx) => {
              const current = idx === 0;
              return (
                <li key={`${event.timestamp}-${idx}`} className="relative">
                  <span
                    className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                      current ? 'bg-brand text-white' : 'bg-ink text-white'
                    }`}
                    aria-hidden="true"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <div className={current ? 'bg-red-50/70 p-3 rounded-lg border border-red-200/90 -mt-2' : ''}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <span className={`font-bold text-sm sm:text-base ${current ? 'text-brand' : 'text-stone-900'}`}>
                        {t.statuses[event.status] ?? t.unknownStatus}
                      </span>
                      <time dateTime={event.timestamp} className="text-xs font-semibold text-stone-600">
                        {formatTrackingDate(event.timestamp, language, true)}
                      </time>
                    </div>
                    {event.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                        <MapPin className="w-3 h-3 text-brand shrink-0" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {isAwaitingPickup(parcel.status) && parcel.destinationBranchName && (
          <div className="mt-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold uppercase tracking-wide block">{t.pickupPoint}</span>
              <p className="font-semibold text-sm text-emerald-950">{parcel.destinationBranchName}</p>
              <p className="text-emerald-800">{t.pickupIdRequired}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
