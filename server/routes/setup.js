/**
 * Setup Wizard API Routes
 * Handles 5-step setup: DB connection test, storage test, site identity, super admin, and initial migration seed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import { getDatabase } from '../config/db.js';
import { getStorage } from '../config/storage.js';
import { setInstalledCache, checkInstalled } from '../middleware/installation-guard.js';
import { hashPassword, bcrypt } from '../../api/lib/auth-helper.js';
import { getSetupPresetForIndustry, getIndustryDefaultTheme } from '../services/setupPresets.js';
import { invalidatePageCache } from '../../api/lib/cache-provider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Check setup status
router.get('/status', async (req, res) => {
  const installed = await checkInstalled();
  res.json({ installed });
});

// Step 1: Test DB Connection
router.post('/test-db', async (req, res) => {
  try {
    const { type, supabaseUrl, supabaseKey, databaseUrl } = req.body;
    const db = await getDatabase({ type, supabaseUrl, supabaseKey, databaseUrl });
    const testResult = await db.testConnection();
    res.json(testResult);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Database test failed' });
  }
});

// Step 2: Test Storage
router.post('/test-storage', async (req, res) => {
  try {
    const storage = getStorage(req.body);
    const testResult = await storage.testConnection();
    res.json(testResult);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Storage test failed' });
  }
});

// Step 5: Complete Installation & Seed
router.post('/install', async (req, res) => {
  try {
    const isInstalled = await checkInstalled();
    if (isInstalled) {
      return res.status(403).json({ error: 'System already installed' });
    }

    const {
      dbConfig = {},
      storageConfig = {},
      siteIdentity = {},
      superAdmin = {},
    } = req.body;

    const db = await getDatabase(dbConfig);
    await db.initTables();

    // 1. Hash Super Admin password
    const passwordHash = superAdmin.password
      ? await hashPassword(superAdmin.password)
      : await hashPassword('admin123');

    const adminUser = {
      id: 'usr_admin',
      username: superAdmin.username || 'admin',
      email: superAdmin.email || 'admin@example.com',
      role: 'administrator',
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    // 2. Save site options
    await db.updateOption('site_title', siteIdentity.title || 'Ultra CMS');
    await db.updateOption('site_tagline', siteIdentity.tagline || 'Modern High-Performance Content Management System');
    await db.updateOption('site_language', siteIdentity.language || 'id');
    await db.updateOption('site_timezone', siteIdentity.timezone || 'Asia/Jakarta');
    await db.updateOption('admin_user', adminUser);
    await db.updateOption('db_config', dbConfig);
    await db.updateOption('storage_config', storageConfig);

    // Sync settings.json for auth session compatibility
    try {
      const settingsPath = path.resolve(__dirname, '../../api/data/settings.json');
      let currentSettings = {};
      try {
        const raw = await fs.readFile(settingsPath, 'utf-8');
        currentSettings = JSON.parse(raw);
      } catch {
        currentSettings = {};
      }
      const updatedSettings = {
        ...currentSettings,
        adminUsername: superAdmin.username || 'admin',
        adminEmail: superAdmin.email || 'admin@example.com',
        passwordHash,
        siteName: siteIdentity.title || 'Ultra CMS',
        dbType: dbConfig.type || 'json',
        setupCompleted: true,
        updatedAt: new Date().toISOString(),
      };
      await fs.mkdir(path.dirname(settingsPath), { recursive: true });
      await fs.writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf-8');
    } catch (syncErr) {
      console.warn('[Setup Warning] Could not sync settings.json:', syncErr.message);
    }

    // Appearance / Theme Defaults (Zero saturated blues, clean executive light theme)
    const industryType = siteIdentity.industryType || 'custom';
    const defaultTheme = getIndustryDefaultTheme(industryType);

    await db.updateOption('active_theme', defaultTheme);
    await db.updateOption('installed_industry', industryType);

    await db.updateOption('appearance_settings', {
      primaryColor: '#18181b', // Clean neutral charcoal
      accentColor: '#10b981', // Neutral modern emerald
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      headerStyle: 'modern',
      footerStyle: 'clean',
      activeTheme: defaultTheme,
      floatingWhatsApp: {
        enabled: true,
        phoneNumber: '6281234567890',
        message: 'Halo, saya ingin bertanya seputar layanan Anda.',
      },
      mobileBottomNav: {
        enabled: true,
        items: [
          { id: 'nav-home', label: 'Home', href: '/', icon: 'Home' },
          { id: 'nav-features', label: 'Fitur', href: '/#features', icon: 'Sparkles' },
          { id: 'nav-pricing', label: 'Harga', href: '/#pricing', icon: 'Tag' },
          { id: 'nav-articles', label: 'Artikel', href: '/#articles', icon: 'BookOpen' },
          { id: 'nav-contact', label: 'Kontak', href: '/#contact', icon: 'MessageSquare' },
        ],
      },
    });

    // 3. Seed Industry-Specific Ready-to-Use Page & Blocks (Never empty!)
    const homePreset = getSetupPresetForIndustry(industryType, siteIdentity);
    const homePage = {
      ...homePreset,
      id: 'page_home',
      slug: 'home',
      status: 'published',
      themeId: defaultTheme,
      content: homePreset.blocks, // Backward compatibility
      blocks: homePreset.blocks,
    };

    const aboutPage = {
      id: 'page_about',
      title: 'Tentang Kami',
      slug: 'about',
      status: 'published',
      themeId: defaultTheme,
      content: [
        {
          id: 'sec_about_content',
          type: 'text_editor',
          props: {
            heading: `Tentang ${siteIdentity.title || 'Perusahaan Kami'}`,
            body: `${siteIdentity.tagline || 'Solusi terdepan berstandar industri'}. Kami berdedikasi menciptakan pengalaman web berkualitas tinggi dengan teknologi modern, performa tinggi, dan komitmen pelayanan terbaik.`,
          },
        },
      ],
      seo: {
        metaTitle: `Tentang Kami - ${siteIdentity.title || 'Visi dan Misi'}`,
        metaDescription: `Pelajari lebih dalam mengenai profil, dedikasi, dan standar kualitas ${siteIdentity.title || 'kami'}.`,
        focusKeyphrase: 'tentang kami profil',
        robots: 'index, follow',
        priority: '0.8',
        changefreq: 'monthly',
      },
    };

    await db.savePage(homePage);
    await db.savePage(aboutPage);

    // Invalidate Redis/Memory Page Cache immediately
    try {
      await invalidatePageCache('home');
      await invalidatePageCache('about');
    } catch (cacheErr) {
      console.warn('[Setup Warning] Could not invalidate cache:', cacheErr.message);
    }

    // 4. Seed Initial Post
    const samplePost = {
      id: 'post_welcome',
      title: 'Selamat Datang di Ultra CMS: Era Baru Manajemen Konten Modern',
      slug: 'selamat-datang-ultra-cms',
      status: 'published',
      category: 'Teknologi',
      author: adminUser.username,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: '3 Menit Baca',
      excerpt: 'Inilah pengantar ringkas mengenai kemampuan arsitektur Ultra CMS dengan integrasi PWA, multi-database adapter, dan visual builder.',
      content: `Selamat datang di instalasi baru Ultra CMS!\n\nWebsite ini telah siap digunakan dan dilengkapi beragam fitur canggih:\n1. Visual Page Builder dengan kustomisasi tingkat lanjut.\n2. PWA terintegrasi untuk akses cepat bahkan saat koneksi lambat.\n3. Dukungan multi-database yang fleksibel.\n4. Optimasi mesin pencari standar Google Search Console dengan XML Sitemap otomatis.\n\nAnda dapat mengelola seluruh postingan dan halaman melalui dashboard /wp-admin.`,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      seo: {
        metaTitle: 'Selamat Datang di Ultra CMS - Era Baru Konten Modern',
        metaDescription: 'Inilah pengantar ringkas kemampuan Ultra CMS dengan visual builder dan PWA.',
        focusKeyphrase: 'selamat datang ultra cms',
        priority: '0.9',
        changefreq: 'weekly',
      },
    };
    await db.savePost(samplePost);

    // 5. Finalize Installation
    await db.updateOption('is_installed', true);
    setInstalledCache(true);

    res.json({
      success: true,
      message: 'Instalasi dan migrasi berhasil diselesaikan.',
      redirect: '/wp-admin/login',
    });
  } catch (err) {
    console.error('[Setup Install Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Setup installation failed' });
  }
});

export default router;
