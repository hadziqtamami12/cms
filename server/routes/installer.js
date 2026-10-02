import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { initDbConnection, query, getDbType } from '../config/db.js';
import { activateLicense, getSystemLicenseStatus, verifyLicenseKey, setInitialInstalledState, generateLicenseKey } from '../services/licenseService.js';
import { setAdminSlug } from '../middleware/dynamicSlugRouter.js';
import { setAdminCredentials } from './admin.js';
import { switchThemeVariant } from '../services/themeService.js';
import { syncAndSaveBrandAssets } from '../services/logoGeneratorService.js';
import { saveSettings } from '../services/configService.js';

const router = Router();

/**
 * GET /api/installer/demo-key
 */
router.get('/demo-key', (req, res) => {
  const key = generateLicenseKey({ clientName: 'STARTER_CLIENT', type: 'yearly' });
  res.json({ success: true, demoKey: key.licenseKey });
});

/**
 * GET /api/installer/status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await getSystemLicenseStatus();
    res.json({
      success: true,
      isInstalled: status.isInstalled,
      licenseStatus: status
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/installer/test-db
 * Step 1: Test DB and Storage Connection
 */
router.post('/test-db', async (req, res) => {
  try {
    const { dbType, connectionString, r2AccountId, r2AccessKey } = req.body;
    const dbResult = await initDbConnection({ type: dbType, connectionString });

    res.json({
      success: true,
      db: dbResult,
      storage: {
        configured: Boolean(r2AccountId && r2AccessKey),
        message: r2AccountId ? 'Cloudflare R2 credentials accepted' : 'R2 optional credentials skipped (using local mock)'
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/installer/complete
 * Executes the 4-step wizard completion in a single atomic transaction
 */
router.post('/complete', async (req, res) => {
  try {
    const {
      adminUser,
      adminPassword,
      adminSlug,
      licenseKey,
      planType = 'trial',
      clientName,
      selectedIndustry,
      selectedThemeId,
      bottomNavStyle
    } = req.body;

    // 1. Resolve & Verify License Key
    let finalLicenseKey = licenseKey;
    if (planType === 'trial' || !finalLicenseKey) {
      // First-Run Free 30-Day Trial is automatically generated
      const trialGen = generateLicenseKey({
        clientName: clientName || 'Trial Client',
        type: 'trial',
        customDays: 30
      });
      finalLicenseKey = trialGen.licenseKey;
    }

    const licenseCheck = verifyLicenseKey(finalLicenseKey);
    if (!licenseCheck.valid) {
      return res.status(400).json({
        success: false,
        error: `Lisensi tidak valid: ${licenseCheck.reason}`
      });
    }

    // 2. Prioritize Manual Password Input from User (Fallback to .env only if empty)
    const cleanAdminUser = String(adminUser || process.env.ADMIN_DEFAULT_USER || 'admin').trim();
    const cleanAdminPassword = String(adminPassword || process.env.ADMIN_DEFAULT_PASSWORD || 'admin123').trim();
    const cleanAdminSlug = String(adminSlug || 'admin').trim().replace(/^\/+|\/+$/g, '') || 'admin';

    // Hash password with Bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanAdminPassword, salt);

    // Save to database permanently
    const dbType = getDbType();
    try {
      if (dbType === 'postgres') {
        await query(`
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
          INSERT INTO admin_users (id, username, password_hash, role, updated_at)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
          ON CONFLICT (username) DO UPDATE 
          SET password_hash = EXCLUDED.password_hash, updated_at = CURRENT_TIMESTAMP;

          INSERT INTO admin_settings (id, username, password_hash, admin_slug, updated_at)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
          ON CONFLICT (id) DO UPDATE 
          SET username = EXCLUDED.username, password_hash = EXCLUDED.password_hash, admin_slug = EXCLUDED.admin_slug, updated_at = CURRENT_TIMESTAMP;
        `, ['admin-root', cleanAdminUser, passwordHash, 'superadmin']);
      } else if (dbType === 'mysql') {
        await query(`
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

          INSERT INTO admin_settings (\`id\`, \`username\`, \`password_hash\`, \`admin_slug\`, \`updated_at\`)
          VALUES ('default_admin', ?, ?, ?, CURRENT_TIMESTAMP)
          ON DUPLICATE KEY UPDATE 
          \`username\` = VALUES(\`username\`), \`password_hash\` = VALUES(\`password_hash\`), \`admin_slug\` = VALUES(\`admin_slug\`), \`updated_at\` = CURRENT_TIMESTAMP;
        `, [cleanAdminUser, passwordHash, cleanAdminSlug]);
      }
    } catch (dbErr) {
      console.warn('[Installer] Admin DB table persistence note:', dbErr.message);
    }

    // Set Admin Credentials & Slug in runtime session
    setAdminCredentials(cleanAdminUser, cleanAdminPassword);
    setAdminSlug(cleanAdminSlug);

    // 3. Activate License
    const activation = await activateLicense(licenseKey, clientName || 'Enterprise Client');
    if (!activation.success) {
      return res.status(400).json({ success: false, error: activation.error });
    }

    // 4. Set Initial Industry, Theme & Brand Assets
    if (selectedIndustry) {
      await switchThemeVariant({
        industry: selectedIndustry,
        themeId: selectedThemeId || 'fleet-grid',
        bottomNavStyle: bottomNavStyle || 'dock'
      });

      const logoRes = await syncAndSaveBrandAssets({
        appName: clientName || 'Enterprise CMS',
        industry: selectedIndustry
      }).catch(() => null);

      if (logoRes) {
        await saveSettings({
          brandName: clientName || 'Enterprise CMS',
          industry: selectedIndustry,
          logoUrl: logoRes.logoUrl,
          pwa_icon: logoRes.pwaIcon
        }).catch(() => {});
      }
    }

    setInitialInstalledState(true);

    res.json({
      success: true,
      message: 'Instalasi CMS Enterprise berhasil diselesaikan!',
      redirectUrl: `/${adminSlug || 'admin'}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
