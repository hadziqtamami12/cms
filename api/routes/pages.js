import { Router } from 'express';
import { getDbDriver } from '../lib/db-factory.js';
import { getCacheClient, invalidatePageCache } from '../lib/cache-provider.js';
import { validatePagePayload } from '../lib/sanitizer.js';
import { requireAdmin } from '../lib/auth-helper.js';

const router = Router();

/**
 * Public Route: GET /api/pages/public/:slug
 * Ultra-fast response (<50ms) using Redis Cache-Aside
 */
router.get('/public/:slug', async (req, res) => {
  const { slug } = req.params;
  const normalizedSlug = (!slug || slug === 'home' || slug === 'index') ? 'home' : slug;
  const cacheKey = `page:${normalizedSlug}`;

  const startTime = Date.now();
  const cache = await getCacheClient();

  try {
    // 1. Check Redis Cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
      return res.json(cached);
    }

    // 2. Database query fallback
    const db = await getDbDriver();
    const page = await db.getPageBySlug(normalizedSlug);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // 3. Cache for 600 seconds (10 minutes)
    await cache.set(cacheKey, page, 600);

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
    return res.json(page);
  } catch (err) {
    console.error('[API] Public page fetch error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Admin: GET /api/pages
 * Returns all pages for the builder dashboard
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const db = await getDbDriver();
    const pages = await db.getPages();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: GET /api/pages/:id
 */
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const db = await getDbDriver();
    const pages = await db.getPages();
    const page = pages.find((p) => p.id === req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: POST /api/pages
 * Create or publish a new page
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const cleanPayload = validatePagePayload(req.body);
    const db = await getDbDriver();
    const saved = await db.savePage(cleanPayload);

    // Invalidate public cache
    await invalidatePageCache(saved.slug);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Admin: PUT /api/pages/:id
 * Update existing page
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const cleanPayload = validatePagePayload({ ...req.body, id: req.params.id });
    const db = await getDbDriver();
    const saved = await db.savePage(cleanPayload);

    // Invalidate public cache
    await invalidatePageCache(saved.slug);

    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Admin: DELETE /api/pages/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = await getDbDriver();
    const pages = await db.getPages();
    const page = pages.find((p) => p.id === req.params.id);

    if (!page) return res.status(404).json({ error: 'Page not found' });

    await db.deletePage(req.params.id);
    await invalidatePageCache(page.slug);

    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
