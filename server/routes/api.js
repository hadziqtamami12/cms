import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { query, getDbType } from '../config/db.js';
import { getActiveThemeConfig } from '../services/themeService.js';
import { getPublicSettings, saveSettings } from '../services/configService.js';
import { analyzeKeywordDensity, generateJsonLdSchema } from '../services/seoService.js';
import { getSystemLicenseStatus } from '../services/licenseService.js';
import { getAdminSlug, setAdminSlug } from '../middleware/dynamicSlugRouter.js';
import { adminAuth, generateAdminToken } from '../middleware/adminAuth.js';
import { createPublicOrder } from './orders.js';
import { syncAndSaveBrandAssets } from '../services/logoGeneratorService.js';
import { getPreset, getAllPresets } from '../services/themePresets.js';
import { delCache } from '../config/cache.js';

const router = Router();

/**
 * GET /api/theme/presets
 * List all available turn-key CMS category presets
 */
router.get('/theme/presets', (req, res) => {
  res.json({
    success: true,
    presets: getAllPresets()
  });
});

/**
 * POST /api/theme/apply-preset
 * 1-Click apply turn-key category preset with dummy seeder content & layouts
 */
router.post('/theme/apply-preset', async (req, res) => {
  try {
    const { presetId } = req.body;
    const preset = getPreset(presetId);
    if (!preset) {
      return res.status(400).json({ success: false, error: 'Preset kategori tidak ditemukan' });
    }

    const updated = await saveSettings({
      ...preset,
      onboarded: true,
      is_onboarded: true
    });

    await delCache('*');

    res.json({
      success: true,
      message: `Tema kategori ${preset.categoryName} berhasil diterapkan secara instan!`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/onboarding/complete
 * Initial setup:
 * 1. Applies selected category theme preset & seeders
 * 2. Hashes & saves admin username & password (Bcrypt)
 * 3. Saves custom admin URL slug (default /admin)
 * 4. Marks is_onboarded = true
 * 5. Returns active JWT session token for seamless redirection
 */
router.post('/onboarding/complete', async (req, res) => {
  try {
    const { category = 'automotive', adminUser, adminPassword, adminSlug } = req.body;

    const cleanUser = String(adminUser || 'admin').trim();
    const cleanPass = String(adminPassword || 'admin123').trim();
    const cleanSlug = String(adminSlug || 'admin').trim().replace(/^\/+|\/+$/g, '') || 'admin';

    // 1. Hash password with Bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanPass, salt);

    // 2. Persist admin credentials to database
    const dbType = getDbType();
    try {
      if (dbType === 'postgres') {
        await query(`
          INSERT INTO admin_settings (id, username, email, password_hash, admin_slug, token_version, updated_at)
          VALUES ('default_admin', $1, 'admin@multicms.id', $2, $3, 1, CURRENT_TIMESTAMP)
          ON CONFLICT (id) DO UPDATE
          SET username = EXCLUDED.username, password_hash = EXCLUDED.password_hash, admin_slug = EXCLUDED.admin_slug, updated_at = CURRENT_TIMESTAMP;
        `, [cleanUser, passwordHash, cleanSlug]);

        await query(`
          INSERT INTO admin_users (id, username, password_hash, role, updated_at)
          VALUES ('admin-root', $1, $2, 'superadmin', CURRENT_TIMESTAMP)
          ON CONFLICT (username) DO UPDATE
          SET password_hash = EXCLUDED.password_hash, updated_at = CURRENT_TIMESTAMP;
        `, [cleanUser, passwordHash]);
      } else if (dbType === 'mysql') {
        await query(`
          INSERT INTO admin_settings (id, username, password_hash, admin_slug)
          VALUES ('default_admin', ?, ?, ?)
          ON DUPLICATE KEY UPDATE username = VALUES(username), password_hash = VALUES(password_hash), admin_slug = VALUES(admin_slug);
        `, [cleanUser, passwordHash, cleanSlug]);

        await query(`
          INSERT INTO admin_users (id, username, password_hash, role)
          VALUES ('admin-root', ?, ?, 'superadmin')
          ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
        `, [cleanUser, passwordHash]);
      }
    } catch (dbErr) {
      console.warn('[Onboarding Complete DB Warning]:', dbErr.message);
    }

    // 3. Set dynamic admin slug
    setAdminSlug(cleanSlug);

    // 4. Apply selected theme preset & mark onboarded
    const preset = getPreset(category);
    const updated = await saveSettings({
      ...preset,
      adminSlug: cleanSlug,
      onboarded: true,
      is_onboarded: true
    });

    await delCache('*');

    // 5. Generate admin session token
    const token = generateAdminToken({ id: 'admin-root', username: cleanUser });

    res.json({
      success: true,
      message: `Setup CMS selesai! Kategori ${preset.categoryName} berhasil diaktifkan.`,
      token,
      adminSlug: cleanSlug,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// In-memory leads storage for enquiries
const leads = [];

/**
 * GET /api/settings/public
 * Returns active public landing page settings with high-performance edge cache headers
 * (bottom_nav_variant, active theme, floating WA, SEO tags, branding)
 */
router.get('/settings/public', async (req, res) => {
  try {
    const settings = await getPublicSettings(true);
    const licenseStatus = await getSystemLicenseStatus();

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json({
      success: true,
      data: {
        ...settings,
        adminSlug: getAdminSlug(),
        license: {
          isInstalled: licenseStatus.isInstalled,
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
 * PUT /api/settings & POST /api/settings
 * Admin-protected route for saving settings directly to database and invalidating serverless cache
 */
router.put('/settings', adminAuth, async (req, res) => {
  try {
    const updated = await saveSettings(req.body);
    res.json({
      success: true,
      message: 'Pengaturan berhasil disimpan ke database',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/settings', adminAuth, async (req, res) => {
  try {
    const updated = await saveSettings(req.body);
    res.json({
      success: true,
      message: 'Pengaturan berhasil disimpan ke database',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/config
 * Returns active theme configuration, SEO metadata, and system status
 */
router.get('/config', async (req, res) => {
  try {
    const themeConfig = await getPublicSettings(true);
    const licenseStatus = await getSystemLicenseStatus();

    res.json({
      success: true,
      data: {
        ...themeConfig,
        adminSlug: getAdminSlug(),
        license: {
          isInstalled: licenseStatus.isInstalled,
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
 * POST /api/orders
 * Public checkout and booking creation
 */
router.post('/orders', async (req, res) => {
  try {
    const { name, phone, email, itemDetails, totalAmount, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Nama dan nomor WhatsApp wajib diisi' });
    }

    const order = createPublicOrder({
      name,
      phone,
      email,
      itemDetails,
      totalAmount,
      message
    });

    res.status(201).json({
      success: true,
      message: `Pesanan Anda (${order.id}) berhasil dibuat. Kami akan segera menghubungi Anda via WhatsApp.`,
      orderId: order.id,
      order
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
 * GET /manifest.json & GET /api/manifest.json
 * Generates dynamic PWA manifest populated from active site settings / branding
 */
router.get(['/manifest.json', '/manifest.webmanifest'], async (req, res) => {
  try {
    const settings = await getPublicSettings(false);
    const pwaName = settings.pwa_name || settings.brandName || "Enterprise Multi-Industry CMS & PWA";
    const pwaShortName = settings.pwa_short_name || settings.brandName || "MultiCMS";
    const pwaIcon = settings.pwa_icon || settings.logoUrl || "/icons/icon-192.svg";
    const themeColor = settings.theme?.primaryColor || "#1d4ed8";

    const isPng = pwaIcon.toLowerCase().endsWith('.png');
    const isSvg = pwaIcon.toLowerCase().endsWith('.svg');
    const iconType = isPng ? "image/png" : (isSvg ? "image/svg+xml" : "image/jpeg");

    const manifest = {
      name: pwaName,
      short_name: pwaShortName,
      description: settings.metaDescription || settings.tagline || "High performance mobile-first landing page generator",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: themeColor,
      icons: [
        {
          src: pwaIcon,
          sizes: "192x192",
          type: iconType,
          purpose: "any maskable"
        },
        {
          src: pwaIcon,
          sizes: "512x512",
          type: iconType,
          purpose: "any maskable"
        }
      ]
    };

    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.json(manifest);
  } catch (err) {
    console.error('[Manifest] Error generating dynamic manifest:', err);
    res.status(500).json({ error: 'Failed to generate manifest' });
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

/**
 * POST /api/upload
 * Universal Image & Icon Upload Handler
 * Accepts: { file: "data:image/...;base64,...", filename: "my-photo.png" }
 * Saves to public/uploads/ and returns { success: true, url: "/uploads/my-photo-123456.png" }
 */
router.post('/upload', async (req, res) => {
  try {
    const { file, filename, title } = req.body;
    if (!file) {
      return res.status(400).json({ success: false, error: 'File data is required.' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let buffer;
    let ext = 'png';

    if (typeof file === 'string' && file.startsWith('data:')) {
      const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1].toLowerCase();
        buffer = Buffer.from(matches[2], 'base64');
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
        else if (mimeType.includes('webp')) ext = 'webp';
        else if (mimeType.includes('svg')) ext = 'svg';
        else if (mimeType.includes('png')) ext = 'png';
        else if (mimeType.includes('gif')) ext = 'gif';
        else if (mimeType.includes('ico') || mimeType.includes('icon')) ext = 'ico';
      } else {
        return res.status(400).json({ success: false, error: 'Format data URL tidak valid.' });
      }
    } else if (typeof file === 'string') {
      buffer = Buffer.from(file, 'base64');
      if (filename && filename.includes('.')) {
        ext = filename.split('.').pop().toLowerCase();
      }
    } else {
      return res.status(400).json({ success: false, error: 'Format file tidak didukung.' });
    }

    const baseName = (filename || title || 'asset')
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 40) || 'asset';

    const safeFilename = `${baseName}-${Date.now()}.${ext}`;
    const destinationPath = path.join(uploadDir, safeFilename);

    let publicUrl = `/uploads/${safeFilename}`;
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(destinationPath, buffer);
    } catch (fsErr) {
      console.warn('[Upload API] Serverless read-only mode, serving data URI:', fsErr.message);
      const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
      publicUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    }

    return res.json({
      success: true,
      message: 'File berhasil diunggah!',
      url: publicUrl,
      filename: safeFilename
    });
  } catch (err) {
    console.error('[Upload API Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/brand/logo.svg
 * Dynamic serverless-safe SVG streaming endpoint
 * Guarantees crisp transparent brand logo stream even on read-only environments
 */
router.get('/brand/logo.svg', async (req, res) => {
  try {
    const { getLastGeneratedLogoSvg, generateLogoSvg } = await import('../services/logoGeneratorService.js');
    let svg = getLastGeneratedLogoSvg();

    if (!svg) {
      const settings = await getPublicSettings(false);
      svg = generateLogoSvg({
        appName: settings.brandName || 'Enterprise CMS',
        industry: settings.industry || 'automotive',
        style: settings.logo_style || 'badge'
      });
    }

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.send(svg);
  } catch (err) {
    res.status(500).send('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="#3B82F6"/></svg>');
  }
});

/**
 * POST /api/brand/generate-logo
 * Universally accessible route to generate brand logo & favicon with varied layouts
 */
router.post('/brand/generate-logo', async (req, res) => {
  try {
    const { appName, industry, style } = req.body || {};
    const current = await getPublicSettings(false);
    const targetAppName = appName || current.brandName || 'Royal Fleet';
    const targetIndustry = industry || current.industry || 'automotive';
    const targetStyle = style || current.logo_style || 'badge';

    const result = await syncAndSaveBrandAssets({
      appName: targetAppName,
      industry: targetIndustry,
      style: targetStyle
    });

    const updated = await saveSettings({
      logoUrl: result.logoUrl,
      pwa_icon: result.pwaIcon,
      logo_style: targetStyle
    });

    res.json({
      success: true,
      message: 'Logo dan favicon transparan berhasil digenerate otomatis!',
      data: {
        logoUrl: result.logoUrl,
        pwaIcon: result.pwaIcon,
        faviconUrl: result.faviconUrl,
        dataUri: result.dataUri,
        initials: result.initials,
        style: result.style,
        settings: updated
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /sitemap.xml & /api/sitemap.xml
 * Dynamic search-engine compliant XML Sitemap generator
 */
router.get(['/sitemap.xml', '/api/sitemap.xml'], async (req, res) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3005';
    const baseUrl = `${protocol}://${host}`;

    let articles = [];
    try {
      const artRes = await query('SELECT slug, updated_at, created_at FROM articles WHERE is_published = true ORDER BY id DESC LIMIT 500');
      if (Array.isArray(artRes)) {
        articles = artRes;
      } else if (artRes && Array.isArray(artRes.rows)) {
        articles = artRes.rows;
      }
    } catch (_) {}

    let trips = [];
    try {
      const tripRes = await query('SELECT slug, updated_at, created_at FROM travel_trips WHERE is_published = true ORDER BY id DESC LIMIT 500');
      if (Array.isArray(tripRes)) {
        trips = tripRes;
      } else if (tripRes && Array.isArray(tripRes.rows)) {
        trips = tripRes.rows;
      }
    } catch (_) {}

    const now = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Homepage
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // 2. Articles Index
    xml += `  <url>\n    <loc>${baseUrl}/artikel</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    // 3. Articles detail
    for (const art of articles) {
      if (!art.slug) continue;
      const lastMod = art.updated_at ? new Date(art.updated_at).toISOString().split('T')[0] : now;
      xml += `  <url>\n    <loc>${baseUrl}/artikel/${encodeURIComponent(art.slug)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // 4. Travel trips detail
    for (const trip of trips) {
      if (!trip.slug) continue;
      const lastMod = trip.updated_at ? new Date(trip.updated_at).toISOString().split('T')[0] : now;
      xml += `  <url>\n    <loc>${baseUrl}/wisata/${encodeURIComponent(trip.slug)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

export const getLeads = () => leads;
export const deleteLeads = (ids) => {
  const idSet = new Set(ids);
  for (let i = leads.length - 1; i >= 0; i--) {
    if (idSet.has(leads[i].id)) {
      leads.splice(i, 1);
    }
  }
  return ids.length;
};
export const updateLeadsStatus = (ids, status) => {
  const idSet = new Set(ids);
  let count = 0;
  for (const l of leads) {
    if (idSet.has(l.id)) {
      l.status = status;
      count++;
    }
  }
  return count;
};
export default router;
