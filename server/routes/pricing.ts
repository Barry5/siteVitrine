import { Router } from 'express';
import { requireAdmin } from '../lib/auth.js';
import { readPricing, validatePricing, withPricingLock, writePricing } from '../lib/pricingStore.js';

/**
 * GET /api/pricing — public.
 * Tarifs du simulateur. `pricing: null` signifie qu'aucun tarif n'a encore été
 * enregistré depuis l'admin : le site garde alors ses tarifs initiaux
 * (src/data/initialData.ts).
 */
export const publicPricingRouter = Router();

publicPricingRouter.get('/', async (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache');
    res.json({ pricing: await readPricing() });
  } catch (err) {
    console.error('[pricing/public]', (err as Error).message);
    res.status(500).json({ error: 'Impossible de lire les tarifs.' });
  }
});

/**
 * PUT /api/admin/pricing — réservé à l'admin connecté.
 * Remplace la grille complète (lignes tarifaires + taux de change).
 */
export const adminPricingRouter = Router();

adminPricingRouter.use(requireAdmin);

adminPricingRouter.put('/', async (req, res) => {
  try {
    const outcome = await withPricingLock(async () => {
      const validation = validatePricing(req.body?.pricing);
      if ('error' in validation) return { status: 400 as const, body: { error: validation.error } };
      await writePricing(validation.value);
      return { status: 200 as const, body: { pricing: validation.value } };
    });
    res.status(outcome.status).json(outcome.body);
  } catch (err) {
    console.error('[admin/pricing:put]', (err as Error).message);
    res.status(500).json({ error: "Impossible d'enregistrer les tarifs." });
  }
});
