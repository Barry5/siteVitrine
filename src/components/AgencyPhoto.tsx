import React, { useState } from 'react';
import { PlaceholderImage } from './PlaceholderImage';

interface AgencyPhotoProps {
  /** Chemin ou URL de la vraie photo (ex: '/photos/agences/ag-hamdallaye.jpg'). */
  photoUrl?: string;
  /** Texte alternatif de l'image réelle (accessibilité, SEO). */
  alt: string;
  /** Texte affiché sur l'emplacement réservé si aucune photo n'est disponible. */
  label: string;
  caption?: string;
  className?: string;
  dark?: boolean;
}

/**
 * Affiche la vraie photo d'une agence quand `photoUrl` est fourni et que le
 * fichier se charge correctement. Sinon (aucune photo fournie, ou fichier
 * introuvable/erreur de chargement), retombe proprement sur PlaceholderImage
 * — jamais d'icône d'image cassée côté visiteur.
 */
export const AgencyPhoto: React.FC<AgencyPhotoProps> = ({
  photoUrl,
  alt,
  label,
  caption,
  className = '',
  dark = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (!photoUrl || failed) {
    return <PlaceholderImage label={label} caption={caption} className={className} dark={dark} />;
  }

  return (
    <img
      src={photoUrl}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover rounded-2xl ${className}`}
    />
  );
};
