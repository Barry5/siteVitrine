import { Router } from 'express';
import { requireAdmin } from '../lib/auth.js';
import {
  readAnnouncements,
  writeAnnouncements,
  validateAnnouncements,
  deleteOrphanedPosters,
  withAnnouncementsLock,
} from '../lib/announcementsStore.js';

/**
 * GET /api/announcements — public.
 * Renvoie uniquement les départs actifs. `announcements: null` signifie
 * qu'aucune annonce n'a encore été publiée depuis l'admin : le frontend
 * garde alors ses données initiales.
 */
export const publicAnnouncementsRouter = Router();

publicAnnouncementsRouter.get('/', async (_req, res) => {
  try {
    const list = await readAnnouncements();
    res.setHeader('Cache-Control', 'no-cache');
    res.json({ announcements: list ? list.filter((a) => a.isActive) : null });
  } catch (err) {
    console.error('[announcements/public]', (err as Error).message);
    res.status(500).json({ error: 'Impossible de lire les annonces.' });
  }
});

/**
 * /api/admin/announcements — réservé à l'admin connecté.
 * GET : toutes les annonces (actives et masquées).
 * PUT : remplace la liste complète (création, modification, masquage,
 *       suppression passent toutes par un enregistrement de la liste).
 */
export const adminAnnouncementsRouter = Router();

adminAnnouncementsRouter.use(requireAdmin);

adminAnnouncementsRouter.get('/', async (_req, res) => {
  try {
    const list = await readAnnouncements();
    res.setHeader('Cache-Control', 'no-store');
    res.json({ announcements: list });
  } catch (err) {
    console.error('[admin/announcements:get]', (err as Error).message);
    res.status(500).json({ error: 'Impossible de lire les annonces.' });
  }
});

adminAnnouncementsRouter.put('/', async (req, res) => {
  try {
    const outcome = await withAnnouncementsLock(async () => {
      const validation = await validateAnnouncements(req.body?.announcements);
      if ('error' in validation) return { status: 400 as const, body: { error: validation.error } };

      const before = await readAnnouncements();
      await writeAnnouncements(validation.value);
      await deleteOrphanedPosters(before, validation.value);
      return { status: 200 as const, body: { announcements: validation.value } };
    });
    res.status(outcome.status).json(outcome.body);
  } catch (err) {
    console.error('[admin/announcements:put]', (err as Error).message);
    res.status(500).json({ error: "Impossible d'enregistrer les annonces." });
  }
});
