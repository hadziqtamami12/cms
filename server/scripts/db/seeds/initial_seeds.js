/**
 * Initial Database Seeds
 * Seeds 50 modular themes across 5 industries, system config, admin credentials,
 * initial license, SEO metrics, and sample orders for PostgreSQL & MySQL.
 */

import bcrypt from 'bcryptjs';
import { generateLicenseKey } from '../../../services/licenseService.js';

export const seed = async ({ query, getDbType }) => {
  const dbType = getDbType();
  console.log(`🌱 [DB Seed] Running seeds for database type: ${dbType}...`);

  // 1. Seed 50 Themes across 5 Industries
  console.log('  ➡️ Seeding 50 Theme metadata records...');
  const industries = [
    {
      id: 'automotive',
      name: 'Rental & Otomotif',
      themes: [
        { id: 'fleet-grid', name: 'Fleet Showcase Grid' },
        { id: 'booking-bar-hero', name: 'Booking Reservation Bar' },
        { id: 'luxury-chauffeur', name: 'Luxury VIP Chauffeur' },
        { id: 'minimalist-rent', name: 'Minimalist Fast Rent' },
        { id: 'daily-express', name: 'Daily Express Rental' },
        { id: 'offroad-adventure', name: 'Offroad & Tour 4x4' },
        { id: 'executive-van', name: 'Executive Van & Shuttle' },
        { id: 'eco-electric', name: 'Eco Electric EV Fleet' },
        { id: 'airport-shuttle', name: 'Airport Express Transfer' },
        { id: 'bike-scooter', name: 'Urban Bike & Scooter' },
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce & Retail',
      themes: [
        { id: 'direct-checkout', name: 'Direct Funnel Checkout' },
        { id: 'flash-sale-modern', name: 'Flash Sale Modern' },
        { id: 'brand-catalog', name: 'Brand Product Catalog' },
        { id: 'storytelling-artisan', name: 'Artisan Storytelling' },
        { id: 'minimal-boutique', name: 'Editorial Minimal Boutique' },
        { id: 'tech-gadget', name: 'Tech Gadget Specs' },
        { id: 'organic-grocery', name: 'Fresh Organic Grocery' },
        { id: 'wholesale-b2b', name: 'B2B Wholesale Portal' },
        { id: 'fashion-lookbook', name: 'Fashion Lookbook Grid' },
        { id: 'single-product', name: 'Single Product Spotlight' },
      ]
    },
    {
      id: 'fnb',
      name: 'F&B & Kuliner',
      themes: [
        { id: 'bistro-fine-dining', name: 'Fine Dining & Bistro' },
        { id: 'coffee-roastery', name: 'Artisan Coffee Roastery' },
        { id: 'fast-casual', name: 'Fast Casual Burger & Bites' },
        { id: 'artisan-bakery', name: 'Pastry & Artisan Bakery' },
        { id: 'cloud-kitchen', name: 'Cloud Kitchen Delivery Hub' },
        { id: 'japanese-omakase', name: 'Authentic Japanese Omakase' },
        { id: 'street-food-hub', name: 'Modern Street Food Hub' },
        { id: 'catering-banquet', name: 'Catering & Banquet Hall' },
        { id: 'juice-health-bar', name: 'Cold-Pressed Juice Bar' },
        { id: 'dessert-parlour', name: 'Gelato & Dessert Parlour' },
      ]
    },
    {
      id: 'services',
      name: 'Jasa Profesional & Layanan Lokal',
      themes: [
        { id: 'legal-law-firm', name: 'Advocate & Law Firm' },
        { id: 'tech-consulting', name: 'Enterprise IT Consulting' },
        { id: 'accounting-tax', name: 'Tax & Accounting Advisory' },
        { id: 'auto-repair', name: 'Auto Repair & Detailing Lab' },
        { id: 'beauty-salon-spa', name: 'Aesthetic Clinic & Luxury Spa' },
        { id: 'medical-dental', name: 'Dental Care & Health Clinic' },
        { id: 'home-services-hvac', name: 'HVAC & Home Repair Express' },
        { id: 'creative-agency', name: 'Creative Studio & Branding' },
        { id: 'security-safety', name: 'Corporate Security & Guard' },
        { id: 'fitness-personal-trainer', name: 'Gym & Elite Fitness Studio' },
      ]
    },
    {
      id: 'realestate',
      name: 'Properti & Real Estate',
      themes: [
        { id: 'luxury-villa-penthouse', name: 'Luxury Villa & Penthouse' },
        { id: 'suburban-housing', name: 'Suburban Housing Cluster' },
        { id: 'commercial-leasing', name: 'Grade-A Office Leasing' },
        { id: 'high-rise-apartment', name: 'Metropolitan High-Rise' },
        { id: 'land-plots', name: 'Land & Investment Plots' },
        { id: 'co-living-boarding', name: 'Modern Co-Living Residence' },
        { id: 'modern-minimalist-home', name: 'Scandinavian Minimalist Home' },
        { id: 'smart-home-residence', name: 'Smart IoT Eco Residences' },
        { id: 'beachfront-resort', name: 'Tropical Beachfront Resort' },
        { id: 'industrial-warehouse', name: 'Logistics Warehouse Hub' },
      ]
    }
  ];

  for (const ind of industries) {
    for (const th of ind.themes) {
      if (dbType === 'postgres') {
        await query(`
          INSERT INTO sys_themes (id, industry, name, description, is_active)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET name = $3;
        `, [th.id, ind.id, th.name, `Preset tema untuk industri ${ind.name}`, th.id === 'fleet-grid']);
      } else if (dbType === 'mysql') {
        await query(`
          INSERT INTO sys_themes (id, industry, name, description, is_active)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = ?;
        `, [th.id, ind.id, th.name, `Preset tema untuk industri ${ind.name}`, th.id === 'fleet-grid', th.name]);
      }
    }
  }

  // 2. Seed System Config
  console.log('  ➡️ Seeding Default System Config...');
  const defaultConfig = {
    industry: 'automotive',
    themeId: 'fleet-grid',
    bottomNavStyle: 'dock',
    siteName: 'Enterprise Multi-CMS Platform',
    contactWhatsapp: '6281234567890',
    contactEmail: 'contact@multicms.id',
    seoTitle: 'Enterprise Multi-Industry Landing Page Generator & CMS',
    seoDescription: 'Solusi Landing Page PWA Berkecepatan Tinggi untuk 5 Industri Utama di Indonesia'
  };

  if (dbType === 'postgres') {
    await query(`
      INSERT INTO sys_configs (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP;
    `, ['main_config', JSON.stringify(defaultConfig)]);
  } else if (dbType === 'mysql') {
    await query(`
      INSERT INTO sys_configs (\`key\`, \`value\`)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE \`value\` = ?, \`updated_at\` = CURRENT_TIMESTAMP;
    `, ['main_config', JSON.stringify(defaultConfig), JSON.stringify(defaultConfig)]);
  }

  // 3. Seed Default Master License
  console.log('  ➡️ Seeding Starter Enterprise License...');
  const sampleLicense = generateLicenseKey({ clientName: 'STARTER_ENTERPRISE', type: 'yearly' });
  const now = new Date();
  const expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  if (dbType === 'postgres') {
    await query(`
      INSERT INTO sys_licenses (license_key, client_name, license_type, duration_days, issued_at, expires_at, is_active, is_approved, approval_note)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (license_key) DO NOTHING;
    `, [
      sampleLicense.licenseKey,
      'STARTER_ENTERPRISE',
      'yearly_365d',
      365,
      now.toISOString(),
      expires.toISOString(),
      true,
      true,
      'Pre-seeded official master license key'
    ]);
  } else if (dbType === 'mysql') {
    await query(`
      INSERT INTO sys_licenses (license_key, client_name, license_type, duration_days, issued_at, expires_at, is_active, is_approved, approval_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE is_active = TRUE;
    `, [
      sampleLicense.licenseKey,
      'STARTER_ENTERPRISE',
      'yearly_365d',
      365,
      now,
      expires,
      true,
      true,
      'Pre-seeded official master license key'
    ]);
  }
  console.log(`     Active License Key: ${sampleLicense.licenseKey}`);

  // 4. Seed Admin Settings & Credentials
  console.log('  ➡️ Seeding Admin Settings & Credentials...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'admin123', salt);
  const adminUsername = process.env.ADMIN_DEFAULT_USER || 'admin';
  const adminSlug = process.env.ADMIN_SLUG || 'admin';

  if (dbType === 'postgres') {
    await query(`
      INSERT INTO admin_settings (id, username, email, password_hash, admin_slug, token_version)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET 
        username = $2,
        email = $3,
        admin_slug = $5;
    `, ['default_admin', adminUsername, 'admin@multicms.id', passwordHash, adminSlug, 1]);
  } else if (dbType === 'mysql') {
    await query(`
      INSERT INTO admin_settings (id, username, email, password_hash, admin_slug, token_version)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        username = ?,
        email = ?,
        admin_slug = ?;
    `, ['default_admin', adminUsername, 'admin@multicms.id', passwordHash, adminSlug, 1, adminUsername, 'admin@multicms.id', adminSlug]);
  }

  // 5. Seed SEO Marketing Config
  console.log('  ➡️ Seeding SEO Marketing Settings...');
  const keywords = ['sewa mobil jakarta', 'rental alphard bandara', 'toko online indonesia', 'cafe bistro jakarta'];
  if (dbType === 'postgres') {
    await query(`
      INSERT INTO sys_seo_marketing (id, target_keywords, meta_title, meta_description, canonical_url, ga_measurement_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING;
    `, [1, JSON.stringify(keywords), 'Enterprise Landing Page Hub', 'Platform Landing Page PWA Modern No.1', 'https://multicms.id', 'G-ABC1234XYZ']);
  } else if (dbType === 'mysql') {
    await query(`
      INSERT INTO sys_seo_marketing (id, target_keywords, meta_title, meta_description, canonical_url, ga_measurement_id)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE meta_title = ?;
    `, [1, JSON.stringify(keywords), 'Enterprise Landing Page Hub', 'Platform Landing Page PWA Modern No.1', 'https://multicms.id', 'G-ABC1234XYZ', 'Enterprise Landing Page Hub']);
  }

  // 6. Seed SEO Metrics (Last 7 Days)
  console.log('  ➡️ Seeding Real-time SEO Performance Metrics (7 Days)...');
  const baseVisitors = [1420, 1580, 1690, 1490, 1850, 2100, 1940];
  const baseClicks = [820, 910, 970, 860, 1050, 1220, 1140];
  const topKws = [
    { keyword: 'rental mobil alphard harian', clicks: 320, impressions: 4200, ctr: '7.6%', position: 2.1 },
    { keyword: 'sewa hiace luxury jakarta', clicks: 210, impressions: 3100, ctr: '6.7%', position: 3.4 },
    { keyword: 'jasa pembuatan pt kilat', clicks: 180, impressions: 2400, ctr: '7.5%', position: 1.8 },
    { keyword: 'croissant artisan delivery', clicks: 140, impressions: 1800, ctr: '7.7%', position: 2.5 },
    { keyword: 'sewa villa bali kolam renang', clicks: 120, impressions: 1500, ctr: '8.0%', position: 1.2 }
  ];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const idx = 6 - i;
    const visitors = baseVisitors[idx];
    const clicks = baseClicks[idx];
    const impressions = clicks * 9;
    const pageViews = visitors * 2;
    const ctr = Number(((clicks / impressions) * 100).toFixed(1));
    const position = Number((2.4 + (i * 0.1)).toFixed(1));

    if (dbType === 'postgres') {
      await query(`
        INSERT INTO seo_metrics (metric_date, daily_visitors, page_views, gsc_clicks, gsc_impressions, avg_position, ctr, top_keywords)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (metric_date) DO UPDATE SET
          daily_visitors = $2, page_views = $3, gsc_clicks = $4, gsc_impressions = $5, avg_position = $6, ctr = $7;
      `, [dateStr, visitors, pageViews, clicks, impressions, position, ctr, JSON.stringify(topKws)]);
    } else if (dbType === 'mysql') {
      await query(`
        INSERT INTO seo_metrics (metric_date, daily_visitors, page_views, gsc_clicks, gsc_impressions, avg_position, ctr, top_keywords)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          daily_visitors = ?, page_views = ?, gsc_clicks = ?, gsc_impressions = ?, avg_position = ?, ctr = ?;
      `, [dateStr, visitors, pageViews, clicks, impressions, position, ctr, JSON.stringify(topKws),
          visitors, pageViews, clicks, impressions, position, ctr]);
    }
  }

  // 7. Seed Sample Orders
  console.log('  ➡️ Seeding Sample Orders...');
  const sampleOrders = [
    {
      id: 'ORD-2026-101',
      customerName: 'Budi Pratama',
      customerPhone: '081234567890',
      customerEmail: 'budi.pratama@gmail.com',
      itemDetails: { name: 'Toyota Alphard Transformer 2.5G', category: 'Rental & Otomotif', price: 2500000, duration: '1 Hari' },
      totalAmount: 2500000,
      status: 'confirmed',
      notes: 'Penjemputan Bandara Soekarno Hatta Terminal 3 Domestik pkl 14:00.'
    },
    {
      id: 'ORD-2026-102',
      customerName: 'Siti Nurhaliza',
      customerPhone: '085712345678',
      customerEmail: 'siti.nur@outlook.com',
      itemDetails: { name: 'Paket Artisan French Croissant Box', category: 'F&B & Kuliner', price: 495000, quantity: 3 },
      totalAmount: 495000,
      status: 'pending',
      notes: 'Kirim sebelum jam 16:00 sore.'
    },
    {
      id: 'ORD-2026-103',
      customerName: 'Hendro Kusumo, S.H.',
      customerPhone: '082198765432',
      customerEmail: 'hendro@corporatetech.id',
      itemDetails: { name: 'Paket Legal Corporate & HKI Merek', category: 'Jasa Profesional', price: 4500000, quantity: 1 },
      totalAmount: 4500000,
      status: 'completed',
      notes: 'Dokumen akta dan surat kuasa telah ditandatangani basah.'
    },
    {
      id: 'ORD-2026-104',
      customerName: 'Maya Savitri',
      customerPhone: '081987654321',
      customerEmail: 'maya.savitri@gmail.com',
      itemDetails: { name: 'Luxury Penthouse 3BR Sudirman Suite', category: 'Properti & Real Estate', price: 15000000, duration: '1 Bulan' },
      totalAmount: 15000000,
      status: 'confirmed',
      notes: 'Jadwal check-in tanggal 1 bulan depan, kunci diserahkan via resepsionis.'
    },
    {
      id: 'ORD-2026-105',
      customerName: 'Reza Firmansyah',
      customerPhone: '081345678912',
      customerEmail: 'reza.f@gmail.com',
      itemDetails: { name: 'Wireless Noise-Cancelling Headphones Pro', category: 'E-Commerce & Retail', price: 1850000, quantity: 1 },
      totalAmount: 1850000,
      status: 'cancelled',
      notes: 'Dibatalkan oleh pembeli karena perubahan alamat pengiriman.'
    }
  ];

  for (const o of sampleOrders) {
    if (dbType === 'postgres') {
      await query(`
        INSERT INTO orders (id, customer_name, customer_phone, customer_email, item_details, total_amount, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;
      `, [o.id, o.customerName, o.customerPhone, o.customerEmail, JSON.stringify(o.itemDetails), o.totalAmount, o.status, o.notes]);
    } else if (dbType === 'mysql') {
      await query(`
        INSERT INTO orders (id, customer_name, customer_phone, customer_email, item_details, total_amount, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status = ?;
      `, [o.id, o.customerName, o.customerPhone, o.customerEmail, JSON.stringify(o.itemDetails), o.totalAmount, o.status, o.notes, o.status]);
    }
  }

  console.log('🎉 [DB Seed] All tables and data records seeded successfully into database.');
};

export default { seed };
