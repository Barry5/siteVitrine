import express, { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requireAdmin } from '../lib/auth.js';
import { getPostersDir } from '../lib/storage.js';

export const MAX_POSTER_BYTES = 5 * 1024 * 1024; // 5 Mo

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Détermine le vrai format à partir des premiers octets du fichier, sans se
 * fier au nom ni au Content-Type envoyés par le navigateur.
 */
function detectImageExtension(buf: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'png';
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buf.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

/**
 * POST /api/admin/uploads/poster — réservé à l'admin connecté.
 * Corps de la requête : le fichier image brut (Content-Type image/jpeg,
 * image/png ou image/webp), 5 Mo maximum. Aucune dépendance supplémentaire
 * (pas de multer) : express.raw suffit pour un seul fichier.
 *
 * La session admin est vérifiée AVANT de lire le corps, pour ne pas accepter
 * 5 Mo de données d'un visiteur non connecté.
 *
 * Réponse : { posterUrl: "/uploads/posters/<uuid>.<ext>" }, servi ensuite
 * par l'API sous /api/uploads/posters/<uuid>.<ext>.
 */
export const uploadsRouter = Router();

uploadsRouter.post(
  '/poster',
  requireAdmin,
  express.raw({ type: ACCEPTED_TYPES, limit: MAX_POSTER_BYTES }),
  async (req, res) => {
    const body = req.body;
    if (!Buffer.isBuffer(body) || body.length === 0) {
      return res
        .status(415)
        .json({ error: 'Format non pris en charge. Envoyez une image JPEG, PNG ou WebP.' });
    }

    const ext = detectImageExtension(body);
    if (!ext) {
      return res
        .status(415)
        .json({ error: "Le fichier n'est pas une image JPEG, PNG ou WebP valide." });
    }

    try {
      const dir = getPostersDir();
      await fs.mkdir(dir, { recursive: true });
      const fileName = `${crypto.randomUUID()}.${ext}`;
      await fs.writeFile(path.join(dir, fileName), body);
      res.status(201).json({ posterUrl: `/uploads/posters/${fileName}` });
    } catch (err) {
      console.error('[admin/uploads/poster]', (err as Error).message);
      res.status(500).json({ error: "Impossible d'enregistrer l'affiche sur le serveur." });
    }
  }
);
