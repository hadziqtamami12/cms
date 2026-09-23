import { Router } from 'express';
import { getActiveThemeConfig } from '../services/themeService.js';
import { analyzeKeywordDensity, generateJsonLdSchema } from '../services/seoService.js';
import { getSystemLicenseStatus } from '../services/licenseService.js';
import { getAdminSlug } from '../middleware/dynamicSlugRouter.js';

const router = Router();

// In-memory leads storage for enquiries
const leads = [];

/**
 * GET /api/config
 * Returns active theme configuration, SEO metadata, and system status
 */
router.get('/config', async (req, res) => {
  try {
    const themeConfig = await getActiveThemeConfig();
    const licenseStatus = await getSystemLicenseStatus();

    res.json({
      success: true,
      data: {
        ...themeConfig,
        adminSlug: getAdminSlug(),
        license: {
          status: licenseStatus.status,
          type: licenseStatus.type,
          daysRemaining: licenseStatus.daysRemaining,
          isLocked: licenseStatus.isLocked
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/leads
 * Handles customer contact / booking enquiry submission
 */
router.post('/leads', async (req, res) => {
  try {
    const { name, phone, email, itemId, message, dates } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Nama dan nomor WhatsApp/telepon wajib diisi' });
    }

    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      phone,
      email: email || '',
      itemId: itemId || null,
      message: message || '',
      dates: dates || null,
      status: 'new',
      createdAt: new Date()
    };

    leads.unshift(lead);

    res.status(201).json({
      success: true,
      message: 'Pesanan/Pesan Anda berhasil diterima. Tim kami akan segera menghubungi Anda.',
      leadId: lead.id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/seo/analyze
 * Real-time on-page keyword density audit and scoring
 */
router.post('/seo/analyze', (req, res) => {
  try {
    const { keywords, title, metaDescription, h1, headings, bodyText, altTexts, slug } = req.body;
    const audit = analyzeKeywordDensity({
      keywords,
      title,
      metaDescription,
      h1,
      headings,
      bodyText,
      altTexts,
      slug
    });

    res.json({ success: true, audit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/seo/schema
 * Generates dynamic JSON-LD structured schema for the active niche
 */
router.get('/seo/schema', async (req, res) => {
  try {
    const config = await getActiveThemeConfig();
    const schemas = generateJsonLdSchema({
      industry: config.industry,
      siteUrl: req.protocol + '://' + req.get('host'),
      businessName: config.brandName,
      description: config.tagline,
      phone: config.phone,
      items: config.items,
      faqs: config.faqs
    });

    res.json({ success: true, schemas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    engine: 'Enterprise-MultiCMS-Serverless'
  });
});

export const getLeads = () => leads;
export default router;
