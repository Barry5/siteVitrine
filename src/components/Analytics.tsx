import React, { useEffect } from 'react';

/**
 * Charge Google Analytics 4 (gtag.js) UNIQUEMENT si un identifiant de
 * mesure réel a été fourni via la variable d'environnement
 * VITE_GA_MEASUREMENT_ID (build .env, jamais codé en dur dans le dépôt).
 * Sans identifiant configuré, ce composant ne fait rien — aucun script
 * de suivi n'est chargé et aucun identifiant n'est inventé.
 */
export const Analytics: React.FC = () => {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId) return;

    if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.setAttribute('data-ga-id', measurementId);
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.setAttribute('data-ga-id', measurementId);
    inlineScript.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(inlineScript);
  }, []);

  return null;
};
