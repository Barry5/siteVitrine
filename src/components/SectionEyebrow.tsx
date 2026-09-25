import React from 'react';

/**
 * Repère au-dessus du titre d'une section : un trait rouge, le numéro de la
 * section et son nom court (« 01 — Nos services »). Remplace l'ancienne
 * étiquette-pilule rouge, identique dans les 9 sections.
 */
export const SectionEyebrow: React.FC<{ number?: string; label: string; dark?: boolean; className?: string }> = ({
  number,
  label,
  dark = false,
  className = '',
}) => (
  <p
    className={`inline-flex items-center gap-2.5 text-[13px] font-bold tracking-[0.08em] ${
      dark ? 'text-sand' : 'text-brand'
    } ${className}`}
  >
    <span className={`w-7 h-0.5 ${dark ? 'bg-sand' : 'bg-brand'}`} aria-hidden="true" />
    {number && <span>{number} —</span>}
    <span>{label}</span>
  </p>
);
