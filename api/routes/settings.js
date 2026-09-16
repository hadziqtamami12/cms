import { Router } from 'express';
import { getDbDriver, JsonDriver } from '../lib/db-factory.js';
import { requireAdmin } from '../lib/auth-helper.js';

const router = Router();

/**
 * GET /api/settings
 * Returns public system settings & setup status
 */
router.get('/', async (req, res) => {
  try {
    const settings = await JsonDriver.getSettings();
    // Return safe subset without password hash
    const { passwordHash, ...safeSettings } = settings;
    res.json(safeSettings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/settings
 * Update system configuration (Requires Admin)
 */
router.put('/', requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.passwordHash; // Protect hash from accidental overwrite

    const db = await getDbDriver();
    const current = await db.getSettings();
    const updated = await db.saveSettings({ ...current, ...updates });

    // Also persist into JsonDriver for boot persistence
    await JsonDriver.saveSettings(updated);

    const { passwordHash, ...safeSettings } = updated;
    res.json({ success: true, settings: safeSettings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/settings/test-db
 * Test database credentials dynamically
 */
router.post('/test-db', async (req, res) => {
  const { dbType, config } = req.body;

  try {
    if (dbType === 'json') {
      return res.json({ success: true, message: 'Local JSON storage is ready and operational.' });
    }

    if (dbType === 'supabase') {
      const { createClient } = await import('@supabase/supabase-js');
      const testClient = createClient(config.supabaseUrl, config.supabaseKey);
      const { error } = await testClient.from('cms_pages').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return res.json({ success: true, message: 'Supabase connection successful!' });
    }

    if (dbType === 'mysql') {
      const mysql = await import('mysql2/promise');
      const connection = await mysql.createConnection({
        host: config.mysqlHost,
        port: Number(config.mysqlPort) || 3306,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database: config.mysqlDatabase,
        connectTimeout: 2000,
      });
      await connection.ping();
      await connection.end();
      return res.json({ success: true, message: 'MySQL connection successful!' });
    }

    if (dbType === 'mongodb') {
      const { MongoClient } = await import('mongodb');
      const testClient = new MongoClient(config.mongoUrl, { serverSelectionTimeoutMS: 2000 });
      await testClient.connect();
      await testClient.db(config.mongoDbName || 'admin').command({ ping: 1 });
      await testClient.close();
      return res.json({ success: true, message: 'MongoDB connection successful!' });
    }

    res.status(400).json({ error: 'Unknown database driver specified' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
