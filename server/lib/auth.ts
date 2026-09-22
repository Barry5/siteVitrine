import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export const ADMIN_SESSION_COOKIE = 'thg_admin_session';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 heures

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET manquant : définissez une valeur secrète dans server/.env avant de démarrer le serveur."
    );
  }
  return secret;
}

/**
 * Jeton de session signé (HMAC-SHA256), sans dépendance externe.
 * Format : <payload base64url>.<signature base64url>
 */
export function signAdminToken(): string {
  const payload = JSON.stringify({ role: 'admin', exp: Date.now() + TOKEN_TTL_MS });
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return false;

  let expectedSignature: string;
  try {
    expectedSignature = crypto
      .createHmac('sha256', getSessionSecret())
      .update(payloadB64)
      .digest('base64url');
  } catch {
    return false;
  }

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length) return false;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/**
 * Comparaison en temps constant du mot de passe soumis contre
 * ADMIN_PASSWORD (variable d'environnement, jamais codée en dur,
 * jamais journalisée, jamais renvoyée au client).
 */
export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD manquant : définissez le mot de passe administrateur dans server/.env avant de démarrer le serveur."
    );
  }
  const candidateBuf = Buffer.from(candidate);
  const expectedBuf = Buffer.from(expected);
  if (candidateBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(candidateBuf, expectedBuf);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Non authentifié.' });
  }
  next();
}
