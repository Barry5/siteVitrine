import React from 'react';
import { ImagePlus } from 'lucide-react';

interface PlaceholderImageProps {
  /** Texte explicite affiché à la place de la photo réelle (ex: "Photo à venir"). */
  label: string;
  /** Légende optionnelle (ex: nom de l'agence) affichée sous l'icône. */
  caption?: string;
  className?: string;
  dark?: boolean;
}

/**
 * Emplacement réservé pour une vraie photographie, en attendant que
 * l'entreprise fournisse ses propres visuels (agences, équipe, colis).
 * N'affiche jamais une image générée ou trouvée en ligne à la place
 * d'une vraie photo : uniquement un espace clairement identifié comme
 * réservé, pour ne pas laisser croire à une photo authentique.
 */
export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  label,
  caption,
  className = '',
  dark = false,
}) => {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed ${
        dark
          ? 'border-slate-700 bg-slate-950/60 text-slate-400'
          : 'border-slate-300 bg-slate-50 text-slate-500'
      } ${className}`}
    >
      <ImagePlus className="w-6 h-6" />
      <span className="text-[11px] font-bold uppercase tracking-wider text-center px-2">
        {label}
      </span>
      {caption && (
        <span className="text-[10px] text-center px-2 opacity-80">{caption}</span>
      )}
    </div>
  );
};
