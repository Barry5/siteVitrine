import { Router } from 'express';
import { checkAdminPassword, signAdminToken, requireAdmin, ADMIN_SESSION_COOKIE } from '../lib/auth.js';

export const adminRouter = Router();

const isProd = process.env.NODE_ENV === 'production';

/**
 * POST /api/admin/login
 * Vérifie le mot de passe côté serveur uniquement (ADMIN_PASSWORD).
 * Ne renvoie jamais d'indice sur le mot de passe attendu.
 */
adminRouter.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Mot de passe requis.' });
  }

  let valid: boolean;
  try {
    valid = checkAdminPassword(password);
  } catch (err) {
    console.error('[admin/login]', (err as Error).message);
    return res.status(503).json({
      error: "Le portail admin n'est pas configuré côté serveur (ADMIN_PASSWORD manquant dans server/.env).",
    });
  }

  if (!valid) {
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
  }

  let token: string;
  try {
    token = signAdminToken();
  } catch (err) {
    console.error('[admin/login]', (err as Error).message);
    return res.status(503).json({
      error: "Le portail admin n'est pas configuré côté serveur (SESSION_SECRET manquant dans server/.env).",
    });
  }

  res.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ ok: true });
});

adminRouter.post('/logout', (_req, res) => {
  res.clearCookie(ADMIN_SESSION_COOKIE);
  res.json({ ok: true });
});

/** GET /api/admin/session — utilisé par le frontend pour savoir si la session est encore valide. */
adminRouter.get('/session', requireAdmin, (_req, res) => {
  res.json({ authenticated: true });
});
