import { Router } from 'express';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { initDbConnection, query, getDbType, testDbConnection, checkIsDatabaseInstalled } from '../config/db.js';
import { getPublicSettings, saveSettings, DEFAULT_APP_CONFIG } from '../services/configService.js';
import { activateLicense, getSystemLicenseStatus, verifyLicenseKey, setInitialInstalledState, generateLicenseKey } from '../services/licenseService.js';
import { getAdminSlug, setAdminSlug } from '../middleware/dynamicSlugRouter.js';
import { setAdminCredentials } from './admin.js';
import { switchThemeVariant } from '../services/themeService.js';
import { syncAndSaveBrandAssets } from '../services/logoGeneratorService.js';

const router = Router();

/**
 * Helper to safely parse database URL into discrete connection parameters
 */
const parseDbUrl = (urlStr) => {
  if (!urlStr) return null;
  try {
    const parsed = new URL(urlStr);
    return {
      protocol: (parsed.protocol || '').replace(':', ''),
      host: parsed.hostname || '',
      port: parsed.port || '',
      user: decodeURIComponent(parsed.username || ''),
      password: decodeURIComponent(parsed.password || ''),
      database: (parsed.pathname || '').replace(/^\//, '')
    };
  } catch {
    return null;
  }
};

/**
 * 1. GET /api/setup/env-status
 * Safely inspects current runtime environment (.env)
 * Pre-fills database, storage, and branding config without exposing raw secrets
 */
router.get('/env-status', async (req, res) => {
  try {
    const rawDbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MONGODB_URI || '';
    const parsed = parseDbUrl(rawDbUrl) || {};

    const isSupabase = rawDbUrl.includes('supabase.com') || Boolean(process.env.SUPABASE_URL);
    let detectedDbType = process.env.DB_TYPE || (isSupabase ? 'supabase' : 'postgres');
    if (rawDbUrl.startsWith('mysql')) detectedDbType = 'mysql';
    if (rawDbUrl.startsWith('mongodb')) detectedDbType = 'mongodb';

    const hasR2 = Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID);
    const hasSupabaseStorage = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
    const storageDriver = process.env.STORAGE_DRIVER || (hasR2 ? 'r2' : (hasSupabaseStorage ? 'supabase' : 'local'));

    // Persistent database installation check
    const dbInstallCheck = await checkIsDatabaseInstalled().catch(() => ({ isInstalled: false }));
    const licenseStatus = await getSystemLicenseStatus().catch(() => ({ isInstalled: false }));
    const isInstalled = Boolean(dbInstallCheck?.isInstalled || licenseStatus?.isInstalled);

    res.json({
      success: true,
      data: {
        database_url: rawDbUrl,
        db_type: detectedDbType,
        db_provider: isSupabase ? 'supabase' : detectedDbType,
        db_host: process.env.DB_HOST || parsed.host || '',
        db_port: process.env.DB_PORT || parsed.port || (detectedDbType === 'mysql' ? '3306' : detectedDbType === 'mongodb' ? '27017' : '5432'),
        db_user: process.env.DB_USER || parsed.user || '',
        db_name: process.env.DB_NAME || parsed.database || '',
        db_ssl: process.env.DB_SSL === 'true' || isSupabase,
        app_name: process.env.APP_NAME || 'OmniLanding CMS',
        app_tagline: process.env.APP_TAGLINE || 'Platform Website & CMS Multi-Industri Cepat',
        license_key: process.env.LICENSE_KEY || '',
        storage_driver: storageDriver,
        has_storage_keys: hasR2 || hasSupabaseStorage,
        default_admin_slug: process.env.ADMIN_SLUG || 'admin',
        default_admin_user: process.env.ADMIN_DEFAULT_USER || 'admin',
        is_installed: isInstalled
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. POST /api/setup/test-connection
 * Dynamic Multi-Database Driver Connection Tester (PostgreSQL, Supabase, MySQL, MongoDB, SQLite/Static, Cloudflare)
 */
router.post('/test-connection', async (req, res) => {
  const { db_type, dbType, database_url, connectionString, host, port, user, password, database } = req.body || {};
  const selectedType = (db_type || dbType || 'postgres').toLowerCase();

  // Construct connection string if individual params were provided
  let targetUrl = database_url || connectionString || '';
  if (!targetUrl && host && user && selectedType === 'mysql') {
    targetUrl = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password || '')}@${host}:${port || 3306}/${database || ''}`;
  } else if (!targetUrl && host && user && (selectedType === 'postgres' || selectedType === 'supabase')) {
    targetUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password || '')}@${host}:${port || 5432}/${database || ''}`;
  } else if (!targetUrl) {
    targetUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MONGODB_URI || '';
  }

  try {
    const testResult = await testDbConnection({
      type: selectedType,
      connectionString: targetUrl,
      host,
      port,
      user,
      password,
      database
    });

    // Re-initialize active pool/client on success
    if (selectedType !== 'static' && selectedType !== 'memory') {
      await initDbConnection({ type: selectedType, connectionString: targetUrl });
    }

    res.json({
      success: true,
      message: testResult.message || `Koneksi ke basis data ${selectedType.toUpperCase()} berhasil!`,
      details: testResult
    });
  } catch (err) {
    console.error('[Setup Test Connection Error]', err.message);
    res.status(400).json({
      success: false,
      error: err.message || 'Gagal menghubungi database. Pastikan connection string benar.'
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
      `, ['default_admin', cleanUser, passwordHash, cleanSlug]);
    } else if (currentDbType === 'mysql') {
      await query(`
        INSERT INTO admin_settings (\`id\`, \`username\`, \`password_hash\`, \`admin_slug\`, \`updated_at\`)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE 
        \`username\` = VALUES(\`username\`), \`password_hash\` = VALUES(\`password_hash\`), \`admin_slug\` = VALUES(\`admin_slug\`), \`updated_at\` = CURRENT_TIMESTAMP;
      `, ['default_admin', cleanUser, passwordHash, cleanSlug]);
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

    // Auto-generate simple & beautiful transparent brand logo & favicon based on app name and category
    const logoResult = await syncAndSaveBrandAssets({
      appName: cleanAppName,
      industry: default_industry
    }).catch(err => {
      console.warn('[Setup] Auto logo generation notice:', err.message);
      return { logoUrl: '/icons/icon-192.svg', pwaIcon: '/icons/icon-192.svg' };
    });

    const initialSettings = {
      ...DEFAULT_APP_CONFIG,
      brandName: cleanAppName,
      tagline: cleanTagline,
      logoUrl: logoResult?.logoUrl || '/icons/icon-192.svg',
      pwa_icon: logoResult?.pwaIcon || '/icons/icon-192.svg',
      pwa_name: `${cleanAppName} PWA`,
      pwa_short_name: cleanAppName.slice(0, 12),
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
        redirectUrl: '/'
      }
    });
  } catch (err) {
    console.error('[Setup Initialize Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
