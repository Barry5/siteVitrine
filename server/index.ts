import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { contactRouter } from './routes/contact.js';
import { adminRouter } from './routes/admin.js';
import { publicAnnouncementsRouter, adminAnnouncementsRouter } from './routes/announcements.js';
import { uploadsRouter } from './routes/uploads.js';
import { getDataDir, getUploadsDir } from './lib/storage.js';

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
