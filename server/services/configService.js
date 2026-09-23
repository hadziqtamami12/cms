/**
 * Enterprise Config Service - Single Source of Truth Database Persistence Engine
 * Enforces database storage for all admin configurations (Bottom Nav Variant,
 * Active Theme, Floating WhatsApp Widget, Admin Slug, License, SEO Verifications).
 */

import { query, getDbType, getMemoryStore } from '../config/db.js';
import { getCache, setCache, delCache } from '../config/cache.js';

// Base Default Configuration
export const DEFAULT_APP_CONFIG = {
  industry: 'automotive',
  themeId: 'fleet-grid',
  bottom_nav_variant: 'floating_dock', // 'floating_dock' | 'fixed_curved' | 'floating_bubble' | 'floating_box'
  bottomNavStyle: 'dock', // Synchronized legacy alias: 'dock' | 'curved' | 'bubble' | 'modern-box'
  brandName: 'Royal Fleet Premiere',
  tagline: 'Sewa Mobil & Armada Premium Terpercaya No. 1',
  phone: '+62 812-8899-0011',
  whatsapp: '6281288990011',
  email: 'concierge@royalfleet.com',
  location: 'Jakarta Selatan & Bali',
  floating_whatsapp: {
    enabled: true,
    phone: '6281288990011',
    messageTemplate: 'Halo Royal Fleet, saya ingin bertanya seputar sewa armada.',
    position: 'right'
  },
  whatsapp_settings: {
    enabled: true,
    displayMode: 'bottom_nav',
    navPosition: 'center',
    actionType: 'popup',
    phone: '6281288990011',
    brandName: 'Royal Fleet Concierge',
    messageTemplate: 'Halo Royal Fleet, saya ingin bertanya seputar sewa armada.',
    welcomeMessage: 'Halo kak! Ada yang bisa kami bantu seputar armada, ketersediaan, atau pemesanan hari ini? Silakan pilih opsi cepat di bawah atau ketik pesan Anda 😊'
  },
  heroSlides: [
    {
      title: 'Solusi Sewa Mobil Mewah & Armada Bisnis Terlengkap',
      subtitle: 'Armada tahun terbaru, jaminan bersih wangi, sopir profesional berpengalaman, dan layanan 24 jam.',
      badge: 'Armada Terlengkap & Terawat',
      ctaText: 'Pesan Armada Sekarang',
      ctaLink: '#fleet',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80'
    },
    {
      title: 'Executive Chauffeur & VIP Airport Transfer',
      subtitle: 'Antar jemput bandara tepat waktu dengan unit Alphard, Camry, Fortuner, dan HiAce Luxury.',
      badge: 'Jaminan Layanan VIP 24/7',
      ctaText: 'Cek Jadwal & Tarif',
      ctaLink: '#booking-bar',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80'
    },
    {
      title: 'Rental Lepas Kunci Mudah & Instan',
      subtitle: 'Syarat cepat tanpa ribet, proses verifikasi digital 10 menit, langsung siap jalan.',
      badge: 'Verifikasi Kilat 10 Menit',
      ctaText: 'Pilih Mobil Anda',
      ctaLink: '#fleet',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80'
    }
  ],
  items: [
    {
      id: 'car-1',
      title: 'Toyota Alphard Transformer Facelift',
      category: 'Luxury MPV',
      price: 'Rp 2.500.000',
      period: '/hari',
      badge: 'Favorit VIP',
      specs: ['7 Kursi Captain Seat', 'Matic', 'Bensin', 'Driver + BBM Available'],
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'car-2',
      title: 'Toyota Innova Zenix Hybrid',
      category: 'Family Touring',
      price: 'Rp 850.000',
      period: '/hari',
      badge: 'Paling Irit',
      specs: ['7 Kursi Nyaman', 'Matic CVT', 'Hybrid Super Irit', 'Sunroof'],
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'car-3',
      title: 'Toyota Fortuner GR Sport 2.8',
      category: 'Premium SUV',
      price: 'Rp 1.400.000',
      period: '/hari',
      badge: 'Gagah & Bertenaga',
      specs: ['7 Kursi', 'Matic 4x2', 'Diesel Turbo 2.8L', 'Tangguh Segala Medan'],
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'car-4',
      title: 'Toyota HiAce Premio Luxury VIP',
      category: 'Executive Van',
      price: 'Rp 1.800.000',
      period: '/hari',
      badge: 'Rombongan Elegan',
      specs: ['9 Captain Seats', 'Matic', 'Full Entertainment Audio', 'Karaoke On-Board'],
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'car-5',
      title: 'Honda HR-V RS Turbo',
      category: 'Compact Crossover',
      price: 'Rp 650.000',
      period: '/hari',
      badge: 'Stylish City',
      specs: ['5 Kursi', 'Matic', 'Bensin Turbo', 'Panoramic Roof'],
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'car-6',
      title: 'Hyundai Ioniq 5 Signature',
      category: 'Electric Vehicle',
      price: 'Rp 1.600.000',
      period: '/hari',
      badge: 'Zero Emission',
      specs: ['5 Kursi', 'Full Electric', 'Range 450KM', 'Fast Charging Support'],
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
    }
  ],
  features: [
    {
      title: 'Armada Terbaru & Bersih Higienis',
      desc: 'Seluruh kendaraan rutin diservis di bengkel resmi serta melalui sanitasi disinfektan sebelum diserahkan.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Driver Berlisensi & Santun',
      desc: 'Pengemudi terlatih, menguasai rute tercepat, ramah, dan memprioritaskan kenyamanan serta privasi Anda.',
      icon: 'UserCheck'
    },
    {
      title: 'Asuransi All-Risk Komprehensif',
      desc: 'Perjalanan aman dan bebas cemas berkat perlindungan asuransi all-risk penuh untuk setiap unit.',
      icon: 'FileBadge'
    },
    {
      title: 'Layanan Darurat 24 Jam Non-Stop',
      desc: 'Tim customer service dan mobil derek darurat siap siaga 24/7 di seluruh area operasional.',
      icon: 'Headphones'
    }
  ],
  pricing: [
    {
      title: 'Paket Lepas Kunci 24 Jam',
      price: 'Rp 450.000',
      period: '/24 jam',
      badge: 'Paling Fleksibel',
      features: ['Mobil tahun 2022-2024', 'Bebas keliling dalam kota', 'Asuransi all-risk', 'Bisa antar-ambil bandara', 'Verifikasi via KTP & SIM'],
      popular: false
    },
    {
      title: 'Paket Mobil + Driver VIP',
      price: 'Rp 750.000',
      period: '/12 jam',
      badge: 'Terlaris Bisnis',
      features: ['Mobil bersih + Sopir beretika', 'Bebas capek & macet', 'Bisa overtime fleksibel', 'Free air mineral & permen', 'Jemput langsung di lobi'],
      popular: true
    },
    {
      title: 'Paket All-In (Driver + BBM + Tol)',
      price: 'Rp 1.150.000',
      period: '/12 jam',
      badge: 'Tanpa Pikir Biaya',
      features: ['Include BBM, tol, dan parkir', 'Driver eksekutif berseragam', 'Tanpa biaya tambahan tersembunyi', 'Prioritas rute wisata / bisnis', 'Kwitansi resmi perusahaan'],
      popular: false
    }
  ],
  testimonials: [
    {
      name: 'Bambang Sudiro',
      role: 'CEO Artha Tech Nusantara',
      comment: 'Pelayanan Alphard untuk tamu direksi dari Jepang sangat memuaskan. Mobil bersih luar biasa dan driver sangat sopan.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Clarissa Valerie',
      role: 'Wedding Organizer Director',
      comment: 'Sewa armada Zenix dan HiAce Premio untuk rombongan resepsi di Bali tepat waktu dan tanpa kendala sama sekali. Sukses terus!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'dr. Hendra Kusuma',
      role: 'Spesialis Jantung RS Mitra',
      comment: 'Proses lepas kunci Fortuner hanya 15 menit dari bandara. Kondisi ban tebal dan AC dingin maksimal. Layanan bintang lima!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
  ],
  faqs: [
    {
      q: 'Apa saja syarat untuk sewa mobil lepas kunci?',
      a: 'Cukup foto e-KTP asli, SIM A aktif, bukti kepemilikan media sosial atau ID karyawan, serta deposit jaminan yang dikembalikan 100% setelah masa sewa selesai.'
    },
    {
      q: 'Apakah bisa antar-jemput unit langsung di Bandara?',
      a: 'Bisa sekali! Petugas kami akan mengantarkan mobil tepat di area penjemputan terminal bandara sesuai jadwal kedatangan penerbangan Anda.'
    },
    {
      q: 'Bagaimana jika mobil mengalami kendala teknis di jalan?',
      a: 'Kami menyediakan layanan ganti unit darurat gratis dalam waktu 60-90 menit serta tim mekanik siaga 24 jam.'
    },
    {
      q: 'Apakah tersedia kwitansi resmi untuk keperluan reimbursement kantor?',
      a: 'Ya, kami menerbitkan invoice resmi berstempel dan faktur pajak lengkap jika diperlukan oleh instansi atau korporasi Anda.'
    }
  ],
  seo: {
    targetKeywords: ['sewa mobil jakarta', 'rental alphard bandara', 'rental mobil murah lepas kunci'],
    title: 'Sewa Mobil & Rental Armada Mewah Terpercaya | Royal Fleet 24 Jam',
    metaDescription: 'Layanan sewa mobil terpercaya lepas kunci dan include driver di Jakarta dan Bali. Armada terbaru Alphard, Innova Zenix, Fortuner, dan HiAce.',
    slug: 'sewa-mobil-mewah-jakarta',
    gscVerificationTag: 'google-site-verification=SAMPLE_GSC_TAG_EXAMPLE',
    gaMeasurementId: 'G-XXXXXXXXXX',
    gtmId: 'GTM-XXXXXXX',
    metaPixelId: '123456789012345',
    googleAdsId: 'AW-123456789',
    ahrefsVerification: 'ahrefs-site-verification_sample',
    gmbPlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    gmbEmbedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.2858189608!2d106.758849!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid'
  }
};

// In-Memory cache of active configuration
let inMemoryConfig = { ...DEFAULT_APP_CONFIG };
let isDbTableEnsured = false;

/**
 * Normalizes bottom nav variant values between legacy and new naming:
 * - 'floating_dock' <-> 'dock'
 * - 'fixed_curved' <-> 'curved'
 * - 'floating_bubble' <-> 'bubble'
 * - 'floating_box' <-> 'modern-box' / 'box'
 */
export const normalizeBottomNavVariant = (val) => {
  if (!val) return 'floating_dock';
  const clean = String(val).toLowerCase().trim();
  if (clean === 'dock' || clean === 'floating_dock') return 'floating_dock';
  if (clean === 'curved' || clean === 'fixed_curved') return 'fixed_curved';
  if (clean === 'bubble' || clean === 'floating_bubble' || clean === 'detached_bubble' || clean === 'detached_floating_bubble') return 'floating_bubble';
  if (clean === 'box' || clean === 'modern-box' || clean === 'floating_box') return 'floating_box';
  return 'floating_dock';
};

export const mapVariantToLegacyStyle = (variant) => {
  const normalized = normalizeBottomNavVariant(variant);
  switch (normalized) {
    case 'fixed_curved': return 'curved';
    case 'floating_bubble': return 'bubble';
    case 'floating_box': return 'modern-box';
    case 'floating_dock':
    default: return 'dock';
  }
};

/**
 * Ensures the app_settings table exists in the database.
 */
export const ensureSettingsTable = async () => {
  if (isDbTableEnsured) return;
  const dbType = getDbType();

  try {
    if (dbType === 'postgres') {
      await query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      isDbTableEnsured = true;
    } else if (dbType === 'mysql') {
      await query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          \`key\` VARCHAR(100) PRIMARY KEY,
          \`value\` JSON NOT NULL,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      isDbTableEnsured = true;
    }
  } catch (err) {
    console.warn('[ConfigService] Table check skipped or non-fatal:', err.message);
  }
};

/**
 * Reads setting by key directly from database.
 */
export const getSettingFromDb = async (key) => {
  const dbType = getDbType();
  await ensureSettingsTable();

  try {
    if (dbType === 'postgres') {
      const rows = await query('SELECT value FROM app_settings WHERE key = $1 LIMIT 1', [key]);
      if (rows && rows.length > 0) {
        return typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
      }
    } else if (dbType === 'mysql') {
      const rows = await query('SELECT `value` FROM app_settings WHERE `key` = ? LIMIT 1', [key]);
      if (rows && rows.length > 0) {
        return typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
      }
    } else if (dbType === 'memory') {
      const mem = getMemoryStore();
      const val = mem.configs.get(key);
      if (val) return val;
    }
  } catch (err) {
    console.warn(`[ConfigService] Error reading setting [${key}] from DB:`, err.message);
  }
  return null;
};

/**
 * Writes setting by key directly to database with atomic UPSERT.
 */
export const saveSettingToDb = async (key, value) => {
  const dbType = getDbType();
  await ensureSettingsTable();

  const jsonVal = typeof value === 'object' ? JSON.stringify(value) : JSON.stringify({ data: value });

  try {
    if (dbType === 'postgres') {
      await query(`
        INSERT INTO app_settings (key, value, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value, updated_at = NOW();
      `, [key, jsonVal]);

      // Dual persistence into legacy sys_configs table
      await query(`
        INSERT INTO sys_configs (key, value, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value, updated_at = NOW();
      `, ['theme_config', jsonVal]).catch(() => {});
    } else if (dbType === 'mysql') {
      await query(`
        INSERT INTO app_settings (\`key\`, \`value\`, updated_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = NOW();
      `, [key, jsonVal]);

      await query(`
        INSERT INTO sys_configs (\`key\`, \`value\`, updated_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = NOW();
      `, ['theme_config', jsonVal]).catch(() => {});
    } else if (dbType === 'memory') {
      const mem = getMemoryStore();
      mem.configs.set(key, value);
      mem.configs.set('theme_config', value);
    }
  } catch (err) {
    console.error(`[ConfigService] Error saving setting [${key}] to DB:`, err.message);
  }
};

/**
 * Returns active public settings directly from database (with Redis / in-memory cache).
 * Single Source of Truth for Landing Page and Admin Studio.
 */
export const getPublicSettings = async () => {
  // 1. Check multi-tier cache
  const cached = await getCache('sys:public_settings');
  if (cached) return cached;

  // 2. Fetch master configuration from database
  let dbConfig = await getSettingFromDb('app_config');

  // If no consolidated app_config yet, check legacy sys_configs table or initialize
  if (!dbConfig) {
    try {
      const legacyRow = await query('SELECT value FROM sys_configs WHERE key = $1 LIMIT 1', ['theme_config']).catch(() => null);
      if (legacyRow && legacyRow.length > 0) {
        dbConfig = typeof legacyRow[0].value === 'string' ? JSON.parse(legacyRow[0].value) : legacyRow[0].value;
      }
    } catch {}
  }

  // Merge with default config
  const merged = {
    ...DEFAULT_APP_CONFIG,
    ...(dbConfig || {}),
    floating_whatsapp: {
      ...DEFAULT_APP_CONFIG.floating_whatsapp,
      ...(dbConfig?.floating_whatsapp || {})
    },
    seo: {
      ...DEFAULT_APP_CONFIG.seo,
      ...(dbConfig?.seo || {})
    }
  };

  // Harmonize bottom navigation variant and legacy bottomNavStyle
  const variant = normalizeBottomNavVariant(merged.bottom_nav_variant || merged.bottomNavStyle);
  merged.bottom_nav_variant = variant;
  merged.bottomNavStyle = mapVariantToLegacyStyle(variant);

  // Keep in-memory reference updated
  inMemoryConfig = merged;

  // Set Cache with 60s TTL
  await setCache('sys:public_settings', merged, 60);

  return merged;
};

/**
 * Saves setting updates permanently to the database and invalidates all cache tiers.
 */
export const saveSettings = async (partialSettings = {}) => {
  const current = await getPublicSettings();

  // Normalize variant if bottomNavStyle or bottom_nav_variant is updated
  let targetVariant = current.bottom_nav_variant;
  if (partialSettings.bottom_nav_variant) {
    targetVariant = normalizeBottomNavVariant(partialSettings.bottom_nav_variant);
  } else if (partialSettings.bottomNavStyle) {
    targetVariant = normalizeBottomNavVariant(partialSettings.bottomNavStyle);
  }

  const updated = {
    ...current,
    ...partialSettings,
    bottom_nav_variant: targetVariant,
    bottomNavStyle: mapVariantToLegacyStyle(targetVariant),
    floating_whatsapp: {
      ...current.floating_whatsapp,
      ...(partialSettings.floating_whatsapp || {})
    },
    seo: {
      ...current.seo,
      ...(partialSettings.seo || {})
    }
  };

  // Save to database permanently
  await saveSettingToDb('app_config', updated);

  // Update in-memory reference
  inMemoryConfig = updated;

  // Invalidate and refresh cache immediately
  await delCache('sys:public_settings');
  await delCache('sys:active_theme');
  await setCache('sys:public_settings', updated, 60);
  await setCache('sys:active_theme', updated, 60);

  return updated;
};

export default {
  DEFAULT_APP_CONFIG,
  getPublicSettings,
  saveSettings,
  getSettingFromDb,
  saveSettingToDb,
  normalizeBottomNavVariant,
  mapVariantToLegacyStyle
};
