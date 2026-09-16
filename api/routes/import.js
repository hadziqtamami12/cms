import { Router } from 'express';
import { getDbDriver } from '../lib/db-factory.js';
import { invalidatePageCache } from '../lib/cache-provider.js';
import { validatePagePayload } from '../lib/sanitizer.js';
import { verifySessionToken, COOKIE_NAME } from '../lib/auth-helper.js';

const router = Router();

/**
 * Middleware: Allow either Admin Session Cookie or X-API-KEY header
 */
async function authenticateImport(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.CMS_IMPORT_API_KEY || 'ultra-import-secret-key-123';

  if (apiKey && apiKey === expectedKey) {
    return next();
  }

  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  if (token && verifySessionToken(token)) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Valid X-API-KEY or Admin session required' });
}

/**
 * POST /api/import
 * Direct JSON Block Tree payload importer
 */
router.post('/', authenticateImport, async (req, res) => {
  try {
    const rawPayload = req.body;
    if (!rawPayload) {
      return res.status(400).json({ error: 'Payload is empty' });
    }

    // Support single page object or array of pages
    const pagesToImport = Array.isArray(rawPayload) ? rawPayload : [rawPayload];
    const db = await getDbDriver();
    const importedResults = [];

    for (const raw of pagesToImport) {
      const sanitized = validatePagePayload(raw);
      const saved = await db.savePage(sanitized);
      await invalidatePageCache(saved.slug);
      importedResults.push({
        id: saved.id,
        slug: saved.slug,
        title: saved.title,
        blockCount: saved.blocks?.length || 0,
        status: saved.status,
      });
    }

    res.status(201).json({
      success: true,
      importedCount: importedResults.length,
      pages: importedResults,
    });
  } catch (err) {
    console.error('[Import] Error importing JSON payload:', err);
    res.status(400).json({ error: `Validation or import failed: ${err.message}` });
  }
});

export default router;
