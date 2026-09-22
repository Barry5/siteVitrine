import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { contactRouter } from './routes/contact.js';
import { adminRouter } from './routes/admin.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'thiaguil-backend' });
});

app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[thiaguil-backend] API en écoute sur http://localhost:${PORT}`);
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
