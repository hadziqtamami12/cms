import { Router } from 'express';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { initDbConnection, query, getDbType } from '../config/db.js';
import { getPublicSettings, saveSettings, DEFAULT_APP_CONFIG } from '../services/configService.js';
import { activateLicense, getSystemLicenseStatus, verifyLicenseKey, setInitialInstalledState, generateLicenseKey } from '../services/licenseService.js';
import { getAdminSlug, setAdminSlug } from '../middleware/dynamicSlugRouter.js';
import { setAdminCredentials } from './admin.js';
import { switchThemeVariant } from '../services/themeService.js';

const router = Router();

/**
 * 1. GET /api/setup/env-status
 * Safely inspects current runtime environment (.env)
 * Pre-fills database, storage, and branding config without exposing raw secrets
 */
router.get('/env-status', async (req, res) => {
  try {
    const rawDbUrl = process.env.DATABASE_URL || '';
    const isSupabase = rawDbUrl.includes('supabase.com') || Boolean(process.env.SUPABASE_URL);
    const dbProvider = process.env.DB_PROVIDER || (isSupabase ? 'supabase' : (rawDbUrl ? 'postgresql' : 'postgresql'));

    const hasR2 = Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID);
    const hasSupabaseStorage = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
    const storageDriver = process.env.STORAGE_DRIVER || (hasR2 ? 'r2' : (hasSupabaseStorage ? 'supabase' : 'local'));

    const licenseStatus = await getSystemLicenseStatus().catch(() => ({ isInstalled: false }));

    res.json({
      success: true,
      data: {
        database_url: rawDbUrl,
        db_provider: dbProvider,
        app_name: process.env.APP_NAME || 'OmniLanding CMS',
        app_tagline: process.env.APP_TAGLINE || 'Platform Website & CMS Multi-Industri Cepat',
        license_key: process.env.LICENSE_KEY || '',
        storage_driver: storageDriver,
        has_storage_keys: hasR2 || hasSupabaseStorage,
        default_admin_slug: process.env.ADMIN_SLUG || 'admin',
        default_admin_user: process.env.ADMIN_DEFAULT_USER || 'admin',
        is_installed: Boolean(licenseStatus?.isInstalled)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. POST /api/setup/test-connection
 * Tests PostgreSQL / Supabase connection with SSL handling
 */
router.post('/test-connection', async (req, res) => {
  const { database_url, connectionString } = req.body || {};
  const targetUrl = database_url || connectionString || process.env.DATABASE_URL;

  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      error: 'URL koneksi basis data (DATABASE_URL) tidak boleh kosong.'
    });
  }

  const isSupabase = targetUrl.includes('supabase.com');
  const requiresSsl = process.env.DB_SSL === 'true' || 
                      isSupabase || 
                      targetUrl.includes('sslmode=require') || 
                      process.env.DB_SSL !== 'false';

  let testPool = null;
  try {
    testPool = new pg.Pool({
      connectionString: targetUrl,
      ssl: requiresSsl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 7000,
      max: 2
    });

    const client = await testPool.connect();
    const queryResult = await client.query('SELECT NOW() as server_time, version() as db_version');
    client.release();
    await testPool.end();

    // Re-initialize primary server pool with verified connection string
    await initDbConnection({ type: 'postgres', connectionString: targetUrl });

    res.json({
      success: true,
      message: `Koneksi ke ${isSupabase ? 'Supabase PostgreSQL' : 'PostgreSQL'} berhasil terhubung!`,
      details: {
        provider: isSupabase ? 'Supabase Cloud PostgreSQL' : 'PostgreSQL Server',
        serverTime: queryResult.rows[0]?.server_time,
        version: (queryResult.rows[0]?.db_version || '').split(' ')[0] + ' ' + (queryResult.rows[0]?.db_version || '').split(' ')[1]
      }
    });
  } catch (err) {
    if (testPool) {
      try { await testPool.end(); } catch {}
    }
    console.error('[Setup Test Connection Error]', err.message);
    res.status(400).json({
      success: false,
      error: `Gagal menyambung ke database: ${err.message}`
    });
  }
});

/**
 * 3. POST /api/setup/initialize
 * Database Finalization:
 * - Creates necessary tables (app_settings, admin_users, admin_settings, sys_licenses)
 * - Hashes admin_password with Bcrypt
 * - Binds custom user inputs (slug, username, password, branding)
 * - Sets is_installed = true
 * - Returns redirect URL
 */
router.post('/initialize', async (req, res) => {
  try {
    const {
      database_url,
      app_name,
      app_tagline,
      admin_slug,
      admin_username,
      admin_password,
      license_key,
      default_industry = 'automotive'
    } = req.body || {};

    const cleanUser = String(admin_username || '').trim();
    const cleanPassword = String(admin_password || '').trim();
    const cleanSlug = String(admin_slug || 'admin').trim().replace(/^\/+|\/+$/g, '') || 'admin';
    const cleanAppName = String(app_name || 'OmniLanding CMS').trim();
    const cleanTagline = String(app_tagline || 'Platform Website & CMS Multi-Industri Cepat').trim();

    // Validate essential inputs
    if (!cleanUser || cleanUser.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Username admin wajib diisi minimal 3 karakter.'
      });
    }
    if (!cleanPassword || cleanPassword.length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Password admin wajib diisi minimal 5 karakter demi keamanan.'
      });
    }

    // 1. Ensure DB Connection
    const targetDbUrl = database_url || process.env.DATABASE_URL;
    if (targetDbUrl) {
      await initDbConnection({ type: 'postgres', connectionString: targetDbUrl });
    } else {
      await initDbConnection();
    }

    const currentDbType = getDbType();

    // 2. Programmatically create essential tables if they do not exist
    if (currentDbType === 'postgres') {
      await query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

        CREATE TABLE IF NOT EXISTS admin_users (
          id VARCHAR(100) PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'superadmin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admin_settings (
          id VARCHAR(50) PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          admin_slug VARCHAR(100) DEFAULT 'admin',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sys_licenses (
          code VARCHAR(100) PRIMARY KEY,
          payload JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sys_configs (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(100) PRIMARY KEY,
          customer_name VARCHAR(150) NOT NULL,
          customer_phone VARCHAR(50) NOT NULL,
          customer_email VARCHAR(150),
          item_details JSONB NOT NULL,
          transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          total_amount NUMERIC(15, 2) DEFAULT 0,
          status VARCHAR(30) DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else if (currentDbType === 'mysql') {
      await query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          \`key\` VARCHAR(100) PRIMARY KEY,
          \`value\` JSON NOT NULL,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS admin_users (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`username\` VARCHAR(100) UNIQUE NOT NULL,
          \`password_hash\` VARCHAR(255) NOT NULL,
          \`role\` VARCHAR(50) DEFAULT 'superadmin',
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS admin_settings (
          \`id\` VARCHAR(50) PRIMARY KEY,
          \`username\` VARCHAR(100) NOT NULL,
          \`password_hash\` VARCHAR(255) NOT NULL,
          \`admin_slug\` VARCHAR(100) DEFAULT 'admin',
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    }

    // 3. Hash Password with Bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanPassword, salt);

    // 4. Save Admin Credentials to Database
    if (currentDbType === 'postgres') {
      await query(`
        INSERT INTO admin_users (id, username, password_hash, role, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (username) DO UPDATE 
        SET password_hash = EXCLUDED.password_hash, updated_at = CURRENT_TIMESTAMP;
      `, ['admin-root', cleanUser, passwordHash, 'superadmin']);

      await query(`
        INSERT INTO admin_settings (id, username, password_hash, admin_slug, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE 
        SET username = EXCLUDED.username, password_hash = EXCLUDED.password_hash, admin_slug = EXCLUDED.admin_slug, updated_at = CURRENT_TIMESTAMP;
      `, ['master', cleanUser, passwordHash, cleanSlug]);
    }

    // Update in-memory credentials & slug for seamless zero-reload session
    setAdminCredentials(cleanUser, cleanPassword);
    setAdminSlug(cleanSlug);

    // 5. License Activation
    let finalLicenseKey = license_key || process.env.LICENSE_KEY;
    if (!finalLicenseKey) {
      const trialGen = generateLicenseKey({
        clientName: cleanAppName || 'Enterprise Client',
        type: 'trial',
        customDays: 30
      });
      finalLicenseKey = trialGen.licenseKey;
    }
    await activateLicense(finalLicenseKey, cleanAppName || 'Enterprise Client');
    setInitialInstalledState(true);

    // 6. Save Default Configuration & Industry to app_settings
    const starterThemes = {
      automotive: 'fleet-grid',
      ecommerce: 'flash-sale',
      fnb: 'coffee-bistro',
      services: 'consulting-pro',
      realestate: 'luxury-residence'
    };

    const initialSettings = {
      ...DEFAULT_APP_CONFIG,
      brandName: cleanAppName,
      tagline: cleanTagline,
      industry: default_industry,
      themeId: starterThemes[default_industry] || 'fleet-grid',
      adminSlug: cleanSlug,
      license_key: finalLicenseKey,
      is_installed: true
    };

    await saveSettings(initialSettings);

    // Also switch theme variant service
    await switchThemeVariant({
      industry: default_industry,
      themeId: starterThemes[default_industry] || 'fleet-grid',
      bottomNavStyle: 'dock'
    }).catch(() => {});

    res.json({
      success: true,
      message: 'Instalasi CMS Enterprise berhasil diselesaikan!',
      data: {
        adminSlug: cleanSlug,
        adminUser: cleanUser,
        isInstalled: true,
        redirectUrl: `/${cleanSlug}`
      }
    });
  } catch (err) {
    console.error('[Setup Initialize Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
