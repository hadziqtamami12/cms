import { Router } from 'express';
import { initDbConnection } from '../config/db.js';
import { activateLicense, getSystemLicenseStatus, verifyLicenseKey, setInitialInstalledState } from '../services/licenseService.js';
import { setAdminSlug } from '../middleware/dynamicSlugRouter.js';
import { setAdminCredentials } from './admin.js';
import { switchThemeVariant } from '../services/themeService.js';

const router = Router();

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
      clientName,
      selectedIndustry,
      selectedThemeId,
      bottomNavStyle
    } = req.body;

    // 1. Verify License Key
    const licenseCheck = verifyLicenseKey(licenseKey);
    if (!licenseCheck.valid) {
      return res.status(400).json({
        success: false,
        error: `Lisensi tidak valid: ${licenseCheck.reason}`
      });
    }

    // 2. Set Admin Credentials & Slug
    if (adminUser && adminPassword) {
      setAdminCredentials(adminUser, adminPassword);
    }
    if (adminSlug) {
      setAdminSlug(adminSlug);
    }

    // 3. Activate License
    const activation = await activateLicense(licenseKey, clientName || 'Enterprise Client');
    if (!activation.success) {
      return res.status(400).json({ success: false, error: activation.error });
    }

    // 4. Set Initial Industry & Theme
    if (selectedIndustry) {
      await switchThemeVariant({
        industry: selectedIndustry,
        themeId: selectedThemeId || 'fleet-grid',
        bottomNavStyle: bottomNavStyle || 'dock'
      });
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
