/**
 * Fichier de démarrage du serveur pour o2switch (cPanel « Setup Node.js App »,
 * Phusion Passenger). À indiquer dans « Fichier de démarrage de l'application ».
 *
 * Passenger charge ce fichier avec require() (CommonJS), alors que le projet
 * est en modules ES ("type": "module" dans package.json) : ce fichier .cjs
 * charge donc le serveur compilé avec import().
 *
 * Le serveur compilé (server/dist/index.mjs) est produit par :
 *   npm run build:server
 * En local, continuez à utiliser `npm run server` ou `npm run dev:all`.
 */
const path = require('path');
const { pathToFileURL } = require('url');

const entry = path.join(__dirname, 'server', 'dist', 'index.mjs');

import(pathToFileURL(entry).href).catch((err) => {
  console.error(
    '[thiaguil-backend] Démarrage impossible. Le fichier server/dist/index.mjs est-il présent ? ' +
      'Il se génère avec « npm run build:server ».'
  );
  console.error(err);
  process.exit(1);
});
