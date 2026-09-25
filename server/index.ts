import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { contactRouter } from './routes/contact.js';
import { adminRouter } from './routes/admin.js';
import { publicAnnouncementsRouter, adminAnnouncementsRouter } from './routes/announcements.js';
import { uploadsRouter } from './routes/uploads.js';
import { trackingRouter } from './routes/tracking.js';
import { publicPricingRouter, adminPricingRouter } from './routes/pricing.js';
import { getDataDir, getSiteDir, getUploadsDir } from './lib/storage.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
// Adresse(s) du site autorisées à appeler l'API avec le cookie admin (CORS).
// Plusieurs adresses possibles, séparées par des virgules, par exemple :
// FRONTEND_URL="https://colisthiaguil.com,https://www.colisthiaguil.com"
const FRONTEND_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({ origin: FRONTEND_ORIGINS, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'thiaguil-backend' });
});

app.use('/api/contact', contactRouter);
app.use('/api/announcements', publicAnnouncementsRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/pricing', publicPricingRouter);
app.use('/api/admin/pricing', adminPricingRouter);
app.use('/api/admin/announcements', adminAnnouncementsRouter);
app.use('/api/admin/uploads', uploadsRouter);
app.use('/api/admin', adminRouter);

// Affiches téléversées depuis l'admin. Noms de fichiers aléatoires (UUID),
// jamais réutilisés : on peut les mettre en cache longtemps.
app.use(
  '/api/uploads',
  express.static(getUploadsDir(), {
    index: false,
    dotfiles: 'deny',
    maxAge: '30d',
    immutable: true,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);

// Site vitrine (build Vite) servi par ce même serveur, à la même adresse que
// l'API : utilisé en production (o2switch). En développement, le dossier
// dist/ n'existe généralement pas et Vite sert le site lui-même.
const SITE_DIR = getSiteDir();
const SITE_INDEX = path.join(SITE_DIR, 'index.html');
const siteAvailable = fs.existsSync(SITE_INDEX);

if (siteAvailable) {
  app.use(
    express.static(SITE_DIR, {
      index: 'index.html',
      dotfiles: 'ignore',
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          // Toujours revalider la page : elle référence les fichiers du dernier build.
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          // Fichiers de build Vite : noms uniques à chaque build.
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    })
  );

  // Toute adresse de page (hors /api et hors fichier, ex. /contact) renvoie
  // la page du site ; un fichier absent (ex. /photo.jpg) reste une vraie 404.
  app.get(/^\/(?!api(?:\/|$))[^.]*$/, (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(SITE_INDEX);
  });
}

app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée.' });
});

// Erreurs de lecture du corps de requête (JSON mal formé, fichier trop lourd)
// renvoyées en JSON lisible par le frontend plutôt qu'en page HTML Express.
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(err);
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Fichier trop lourd (5 Mo maximum).' });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Requête mal formée.' });
  }
  console.error('[thiaguil-backend]', err?.message || err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[thiaguil-backend] API en écoute sur http://localhost:${PORT}`);
  console.log(`[thiaguil-backend] Données (annonces, affiches) stockées dans : ${getDataDir()}`);
  console.log(`[thiaguil-backend] Site(s) autorisé(s) : ${FRONTEND_ORIGINS.join(', ')}`);
  console.log(
    siteAvailable
      ? `[thiaguil-backend] Site vitrine servi depuis : ${SITE_DIR}`
      : `[thiaguil-backend] Aucun site construit dans ${SITE_DIR} (lancer « npm run build ») : seule l'API répond.`
  );
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('[thiaguil-backend] ATTENTION : ADMIN_PASSWORD non défini — la connexion admin échouera.');
  }
  if (!process.env.SESSION_SECRET) {
    console.warn('[thiaguil-backend] ATTENTION : SESSION_SECRET non défini — la connexion admin échouera.');
  }
  if (!process.env.SMTP_HOST) {
    console.warn('[thiaguil-backend] ATTENTION : SMTP_* non défini — le formulaire de contact renverra une erreur 503.');
  }
});
