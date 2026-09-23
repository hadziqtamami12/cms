import { Router } from 'express';
import {
  generateLicenseKey,
  verifyProgrammerPassphrase,
  programmerOverrideUnlock,
  getSystemLicenseStatus,
  verifyLicenseKey
} from '../services/licenseService.js';

const router = Router();

/**
 * Middleware: Verify Programmer Secret Passphrase
 */
const programmerAuth = (req, res, next) => {
  const secretKey = req.headers['x-programmer-key'] || req.body?.masterKey;
  if (!secretKey || !verifyProgrammerPassphrase(secretKey)) {
    return res.status(403).json({
      success: false,
      error: 'ACCESS_DENIED',
      message: 'Passphrase / Master Key Programmer tidak valid. Akses ditolak.'
    });
  }
  next();
};

/**
 * POST /api/keygen/login
 * Validates programmer passphrase
 */
router.post('/login', (req, res) => {
  const masterKey = req.body?.masterKey;
  if (masterKey && verifyProgrammerPassphrase(masterKey)) {
    return res.json({
      success: true,
      message: 'Otorisasi Programmer Berhasil. Portal Keygen Terbuka.'
    });
  }
  return res.status(403).json({
    success: false,
    error: 'Secret Master Key salah.'
  });
});

/**
 * GET /api/keygen/status
 * Fetches current system license status and override details
 */
router.get('/status', programmerAuth, async (req, res) => {
  try {
    const status = await getSystemLicenseStatus();
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/keygen/generate
 * Generates mathematically signed 16-character license key
 */
router.post('/generate', programmerAuth, (req, res) => {
  try {
    const { clientName, type, customDays } = req.body || {};
    if (!clientName) {
      return res.status(400).json({ success: false, error: 'Nama klien / ID proyek wajib diisi' });
    }

    const license = generateLicenseKey({
      clientName,
      type: type || 'yearly',
      customDays: customDays ? Number(customDays) : null
    });

    res.json({
      success: true,
      message: 'Lisensi 16 Karakter Berhasil Digenerate',
      data: license
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/keygen/verify-key
 * Validates any given license key against the mathematical algorithm
 */
router.post('/verify-key', programmerAuth, (req, res) => {
  const { licenseKey } = req.body || {};
  const result = verifyLicenseKey(licenseKey);
  res.json({ success: true, result });
});

/**
 * POST /api/keygen/override-unlock
 * Emergency Bypass: Approve & Unlock Project immediately
 */
router.post('/override-unlock', programmerAuth, async (req, res) => {
  try {
    const { masterKey, note } = req.body || {};
    const unlock = await programmerOverrideUnlock({
      masterKey: masterKey || req.headers['x-programmer-key'],
      note: note || 'Programmer Emergency Override Unlock'
    });
    res.json(unlock);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
