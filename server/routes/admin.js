import { Router } from 'express';
import { adminAuth, generateAdminToken } from '../middleware/adminAuth.js';
import { getActiveThemeConfig, updateActiveThemeConfig, switchThemeVariant } from '../services/themeService.js';
import { getAdminSlug, setAdminSlug } from '../middleware/dynamicSlugRouter.js';
import { getUploadPresignedUrl } from '../config/storage.js';
import { getSystemLicenseStatus } from '../services/licenseService.js';
import { getLeads } from './api.js';

const router = Router();

// Master in-memory admin credentials (overridden by installer or ENV)
let adminCredentials = {
  username: process.env.ADMIN_DEFAULT_USER || 'admin',
  password: process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'
};

export const setAdminCredentials = (username, password) => {
  if (username && password) {
    adminCredentials = { username, password };
  }
};

/**
 * POST /api/admin/login
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = generateAdminToken({ id: 'superadmin', username });
    return res.json({
      success: true,
      message: 'Login berhasil',
      token,
      adminSlug: getAdminSlug()
    });
  }
  return res.status(401).json({ success: false, error: 'Username atau password admin salah' });
});

/**
 * GET /api/admin/me
 */
router.get('/me', adminAuth, async (req, res) => {
  const themeConfig = await getActiveThemeConfig();
  const license = await getSystemLicenseStatus();
  res.json({
    success: true,
    user: req.admin,
    adminSlug: getAdminSlug(),
    themeConfig,
    license
  });
});

/**
 * POST /api/admin/theme/switch
 * 1-Click theme & industry switch without data corruption
 */
router.post('/theme/switch', adminAuth, async (req, res) => {
  try {
    const { industry, themeId, bottomNavStyle } = req.body;
    const updated = await switchThemeVariant({ industry, themeId, bottomNavStyle });
    res.json({
      success: true,
      message: `Tema berhasil diganti menjadi [${industry} - ${themeId}]`,
      themeConfig: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/theme/content
 * Full content and theme configuration update
 */
router.put('/theme/content', adminAuth, async (req, res) => {
  try {
    const updated = await updateActiveThemeConfig(req.body);
    res.json({
      success: true,
      message: 'Konten dan konfigurasi landing page berhasil diperbarui',
      themeConfig: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/seo-marketing
 * Updates Technical SEO, Keyword list, Google Search Console, GA4, Meta Pixel, GMB
 */
router.put('/seo-marketing', adminAuth, async (req, res) => {
  try {
    const { seo } = req.body;
    const updated = await updateActiveThemeConfig({ seo });
    res.json({
      success: true,
      message: 'Pengaturan SEO dan integrasi marketing berhasil disimpan',
      seo: updated.seo
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/slug
 * Configures the dynamic admin route slug (e.g. /admin -> /sys-portal)
 */
router.put('/slug', adminAuth, (req, res) => {
  const { newSlug } = req.body;
  if (!newSlug || !/^[a-zA-Z0-9_-]+$/.test(newSlug)) {
    return res.status(400).json({ success: false, error: 'Slug tidak valid. Hanya huruf, angka, dash, dan underscore.' });
  }
  const slug = setAdminSlug(newSlug);
  res.json({
    success: true,
    message: `Slug portal admin berhasil diubah menjadi /${slug}`,
    newSlug: slug
  });
});

/**
 * POST /api/admin/media/presign
 * Generates presigned upload URL for Cloudflare R2
 */
router.post('/media/presign', adminAuth, async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType) {
      return res.status(400).json({ success: false, error: 'Filename dan contentType wajib disertakan' });
    }
    const result = await getUploadPresignedUrl(filename, contentType);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/leads
 */
router.get('/leads', adminAuth, (req, res) => {
  res.json({ success: true, leads: getLeads() });
});

export default router;
