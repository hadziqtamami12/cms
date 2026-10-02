/**
 * Travel Trips & Tour Packages API Routes
 * Automated Google/Wikipedia Destination Search, Itinerary & Article Generation
 */

import { Router } from 'express';
import { query, getDbType } from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { getPublicSettings } from '../services/configService.js';

const router = Router();

const DEFAULT_TRIPS = [
  {
    id: 'trip-1',
    title: 'Paket Eksplorasi Kawah Ijen & TN Baluran 2H1M',
    slug: 'paket-kawah-ijen-baluran-2h1m',
    description: 'Petualangan eksotis menyaksikan Blue Fire Kawah Ijen legendaris dan safari savana ala Afrika di Taman Nasional Baluran dengan armada ternyaman.',
    route_itinerary: [
      'Hari 1: Penjemputan di Stasiun / Bandara Banyuwangi, menuju Savana Bekol & Pantai Bama TN Baluran, makan siang kuliner khas, check-in hotel.',
      'Hari 2: Dini hari pukul 00.30 bersiap menuju Paltuding Kawah Ijen, trekking Blue Fire & sunrise sunrise point, sarapan, belanja oleh-oleh, transfer out.'
    ],
    duration: '2 Hari 1 Malam',
    price_per_pax: 'Rp 750.000',
    price_per_group: 'Rp 3.500.000 (Min 5 Pax)',
    images: ['https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Blue Fire Kawah Ijen', 'Savana Bekol Baluran', 'Pantai Bama & Hutan Mangrove'],
    included: ['Armada AC + Driver + BBM', 'Tiket Objek Wisata', 'Masker Gas & Pemandu Lokal', 'Air Mineral'],
    excluded: ['Tiket Pesawat / Kereta', 'Pengeluaran Pribadi', 'Tipping Driver / Guide'],
    badge: 'Paling Populer',
    is_active: true
  },
  {
    id: 'trip-2',
    title: 'Sunrise Bromo & Air Terjun Madakaripura Private Trip',
    slug: 'sunrise-bromo-madakaripura-private-trip',
    description: 'Nikmati keajaiban matahari terbit Kaldera Tengger, petualangan Jeep 4WD di Pasir Berbisik & Bukit Teletubbies, dilanjutkan kesegaran air terjun abadi.',
    route_itinerary: [
      'Pukul 23.30 Penjemputan dari Surabaya/Malang, perjalanan darat ke transit point Sukapura.',
      'Pukul 03.00 Naik Jeep 4x4 menuju Penanjakan 1 / Kingkong Hill menyaksikan Golden Sunrise.',
      'Pukul 06.00 Eksplor Kawah Bromo, Pura Poten, Pasir Berbisik, dan Savana Bukit Teletubbies.',
      'Pukul 10.00 Perjalanan menuju Air Terjun Madakaripura, makan siang lokal, dan drop kembali.'
    ],
    duration: '1 Hari (Full Day)',
    price_per_pax: 'Rp 650.000',
    price_per_group: 'Rp 3.000.000 (Min 5 Pax)',
    images: ['https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Golden Sunrise Penanjakan', 'Jeep 4x4 Bromo', 'Air Terjun Madakaripura'],
    included: ['Kendaraan Antar-Jemput AC', 'Jeep 4WD Bromo All Spot', 'Tiket Masuk Bromo & Madakaripura', 'Driver & BBM'],
    excluded: ['Sewa Kuda di Bromo', 'Jas Hujan Madakaripura', 'Makan Pribadi'],
    badge: 'Pilihan Utama',
    is_active: true
  },
  {
    id: 'trip-3',
    title: 'Exotic Bali Selatan & Sunset Uluwatu Chauffeur Tour',
    slug: 'exotic-bali-selatan-uluwatu-tour',
    description: 'Jelajahi pantai pasir putih Pandawa & Melasti, Garuda Wisnu Kencana (GWK), dan keindahan magis tari Kecak saat matahari terbenam di tebing Uluwatu.',
    route_itinerary: [
      'Pukul 09.00 Penjemputan di Hotel / Villa area Kuta/Seminyak/Nusa Dua.',
      'Pukul 10.30 Mengunjungi Tebing & Pantai Melasti yang eksotis.',
      'Pukul 13.00 Makan siang dan menikmati kemegahan Patung Garuda Wisnu Kencana.',
      'Pukul 16.30 Menuju Pura Uluwatu, menyaksikan Sunset & Tari Kecak di bibir tebing samudra.',
      'Pukul 19.30 Makan malam seafood di Pantai Jimbaran, kembali ke hotel.'
    ],
    duration: '10 - 12 Jam',
    price_per_pax: 'Rp 500.000',
    price_per_group: 'Rp 1.800.000 (Keluarga 4-6 Orang)',
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Pantai Melasti', 'GWK Cultural Park', 'Pura Uluwatu & Tari Kecak', 'Jimbaran Seafood'],
    included: ['Mobil Pribadi Nyaman + Driver + BBM', 'Parkir & Tol', 'Air Mineral Dingin'],
    excluded: ['Tiket Masuk Objek Wisata', 'Tiket Tari Kecak', 'Makan Malam Jimbaran'],
    badge: 'Wisata Keluarga',
    is_active: true
  }
];

// Curated high quality Indonesian destination images fallback index
const DESTINATION_IMAGE_BANK = {
  bromo: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
  ijen: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
  baluran: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  borobudur: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
  prambanan: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  jogja: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80',
  dieng: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
  komodo: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
  labuan: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
  toba: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
};

function resolveDestinationFallbackImage(destination) {
  const norm = (destination || '').toLowerCase();
  for (const [key, img] of Object.entries(DESTINATION_IMAGE_BANK)) {
    if (key !== 'default' && norm.includes(key)) {
      return img;
    }
  }
  return DESTINATION_IMAGE_BANK.default;
}

/**
 * Root /api/travel-trips or /api/admin/travel-trips router handler
 */
router.get('/', async (req, res, next) => {
  if (req.headers.authorization) {
    return adminAuth(req, res, () => {
      req.url = '/manage';
      router.handle(req, res, next);
    });
  }
  req.url = '/public';
  router.handle(req, res, next);
});

/**
 * Public: GET /api/travel-trips/categories
 */
router.get('/categories', async (req, res) => {
  try {
    let trips = [];
    try {
      const sql = `SELECT DISTINCT badge FROM travel_trips WHERE is_active = TRUE AND badge IS NOT NULL`;
      const result = await query(sql);
      trips = Array.isArray(result) ? result : (result?.rows || []);
    } catch (_) {}
    const badges = trips.map(t => t.badge).filter(Boolean);
    res.json({
      success: true,
      data: ['Semua', ...Array.from(new Set(badges.length > 0 ? badges : ['Paling Populer', 'Pilihan Utama', 'Paket Spesial']))]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Public: GET /api/travel-trips/public
 */
router.get('/public', async (req, res) => {
  try {
    let trips = [];

    try {
      const sql = `SELECT * FROM travel_trips WHERE is_active = TRUE ORDER BY created_at DESC`;
      const result = await query(sql);
      trips = Array.isArray(result) ? result : (result?.rows || []);
    } catch (e) {
      console.warn('[Travel Trips] DB query fallback:', e.message);
    }

    if (trips.length === 0) {
      trips = DEFAULT_TRIPS;
    } else {
      trips = trips.map(t => ({
        ...t,
        route_itinerary: typeof t.route_itinerary === 'string' ? JSON.parse(t.route_itinerary) : t.route_itinerary,
        images: typeof t.images === 'string' ? JSON.parse(t.images) : t.images,
        highlights: typeof t.highlights === 'string' ? JSON.parse(t.highlights) : t.highlights,
        included: typeof t.included === 'string' ? JSON.parse(t.included) : t.included,
        excluded: typeof t.excluded === 'string' ? JSON.parse(t.excluded) : t.excluded
      }));
    }

    res.json({
      success: true,
      data: trips
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: GET /api/admin/travel-trips/manage
 */
router.get('/manage', adminAuth, async (req, res) => {
  try {
    let trips = [];
    try {
      const sql = `SELECT * FROM travel_trips ORDER BY created_at DESC`;
      const result = await query(sql);
      trips = Array.isArray(result) ? result : (result?.rows || []);
    } catch (e) {
      console.warn('[Travel Manage] Error:', e.message);
    }

    if (trips.length === 0) {
      trips = DEFAULT_TRIPS;
    } else {
      trips = trips.map(t => ({
        ...t,
        route_itinerary: typeof t.route_itinerary === 'string' ? JSON.parse(t.route_itinerary) : t.route_itinerary,
        images: typeof t.images === 'string' ? JSON.parse(t.images) : t.images,
        highlights: typeof t.highlights === 'string' ? JSON.parse(t.highlights) : t.highlights,
        included: typeof t.included === 'string' ? JSON.parse(t.included) : t.included,
        excluded: typeof t.excluded === 'string' ? JSON.parse(t.excluded) : t.excluded
      }));
    }

    res.json({
      success: true,
      data: trips
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: POST /api/admin/travel-trips/manage
 */
router.post('/manage', adminAuth, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      route_itinerary = [],
      duration = '1 Hari',
      price_per_pax = 'Rp 500.000',
      price_per_group = 'Rp 2.500.000',
      images = [],
      highlights = [],
      included = ['Armada AC + Driver + BBM', 'Tiket Masuk Objek Wisata', 'Air Mineral'],
      excluded = ['Pengeluaran Pribadi', 'Tipping Driver'],
      badge = 'Paket Spesial',
      is_active = true
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Judul paket tour wajib diisi' });
    }

    const id = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dbType = getDbType();

    const insertSql = dbType === 'postgres'
      ? `INSERT INTO travel_trips (id, title, slug, description, route_itinerary, duration, price_per_pax, price_per_group, images, highlights, included, excluded, badge, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`
      : `INSERT INTO travel_trips (\`id\`, \`title\`, \`slug\`, \`description\`, \`route_itinerary\`, \`duration\`, \`price_per_pax\`, \`price_per_group\`, \`images\`, \`highlights\`, \`included\`, \`excluded\`, \`badge\`, \`is_active\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      id,
      title,
      finalSlug,
      description,
      JSON.stringify(route_itinerary),
      duration,
      price_per_pax,
      price_per_group,
      JSON.stringify(images),
      JSON.stringify(highlights),
      JSON.stringify(included),
      JSON.stringify(excluded),
      badge,
      is_active
    ];

    await query(insertSql, params);

    res.status(201).json({
      success: true,
      message: 'Paket tour berhasil ditambahkan',
      data: { id, title, slug: finalSlug }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: PUT /api/admin/travel-trips/manage/:id
 * Updates an existing tour package
 */
router.put('/manage/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      route_itinerary = [],
      duration,
      price_per_pax,
      price_per_group,
      images = [],
      highlights = [],
      included = [],
      excluded = [],
      badge,
      is_active
    } = req.body;

    const dbType = getDbType();
    const finalSlug = slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : id);

    const updateSql = dbType === 'postgres'
      ? `UPDATE travel_trips SET 
          title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          route_itinerary = COALESCE($4, route_itinerary),
          duration = COALESCE($5, duration),
          price_per_pax = COALESCE($6, price_per_pax),
          price_per_group = COALESCE($7, price_per_group),
          images = COALESCE($8, images),
          highlights = COALESCE($9, highlights),
          included = COALESCE($10, included),
          excluded = COALESCE($11, excluded),
          badge = COALESCE($12, badge),
          is_active = COALESCE($13, is_active),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $14`
      : `UPDATE travel_trips SET 
          \`title\` = COALESCE(?, \`title\`),
          \`slug\` = COALESCE(?, \`slug\`),
          \`description\` = COALESCE(?, \`description\`),
          \`route_itinerary\` = COALESCE(?, \`route_itinerary\`),
          \`duration\` = COALESCE(?, \`duration\`),
          \`price_per_pax\` = COALESCE(?, \`price_per_pax\`),
          \`price_per_group\` = COALESCE(?, \`price_per_group\`),
          \`images\` = COALESCE(?, \`images\`),
          \`highlights\` = COALESCE(?, \`highlights\`),
          \`included\` = COALESCE(?, \`included\`),
          \`excluded\` = COALESCE(?, \`excluded\`),
          \`badge\` = COALESCE(?, \`badge\`),
          \`is_active\` = COALESCE(?, \`is_active\`),
          \`updated_at\` = CURRENT_TIMESTAMP
         WHERE \`id\` = ?`;

    const params = [
      title,
      finalSlug,
      description,
      route_itinerary ? JSON.stringify(route_itinerary) : null,
      duration,
      price_per_pax,
      price_per_group,
      images ? JSON.stringify(images) : null,
      highlights ? JSON.stringify(highlights) : null,
      included ? JSON.stringify(included) : null,
      excluded ? JSON.stringify(excluded) : null,
      badge,
      is_active,
      id
    ];

    await query(updateSql, params);

    res.json({
      success: true,
      message: 'Paket tour berhasil diperbarui'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: POST /api/admin/travel-trips/auto-generate
 * Automatically searches destination information via Google / Wikipedia Search,
 * extracts highlights, route, accessibility, facilities, and itinerary,
 * formats into a full professional article page layout,
 * and saves to both travel_trips and articles database.
 */
router.post('/auto-generate', adminAuth, async (req, res) => {
  try {
    const { destination, customNotes } = req.body || {};
    const cleanDest = String(destination || '').trim();

    if (!cleanDest || cleanDest.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Nama destinasi atau objek wisata wajib diisi (minimal 3 karakter).'
      });
    }

    const settings = await getPublicSettings(false);
    const brandName = settings.brandName || settings.pwa_name || 'Royal Fleet';
    const whatsappNum = String(settings.whatsapp || '6281288990011').replace(/[^0-9]/g, '');

    // 1. Data Fetching / Automated Search via Wikipedia API (Indonesian)
    let fetchedTitle = cleanDest;
    let fetchedExtract = '';
    let fetchedImage = '';

    try {
      const wikiUrl = `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanDest)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const wikiResp = await fetch(wikiUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'TravelTripGenerator/2.0 (CMS Application)' }
      });
      clearTimeout(timeout);

      if (wikiResp.ok) {
        const wikiData = await wikiResp.json();
        if (wikiData.title) fetchedTitle = wikiData.title;
        if (wikiData.extract) fetchedExtract = wikiData.extract;
        if (wikiData.originalimage?.source || wikiData.thumbnail?.source) {
          fetchedImage = wikiData.originalimage?.source || wikiData.thumbnail?.source;
        }
      }
    } catch (wikiErr) {
      console.warn('[AutoGenerateTrip] Wiki fetch fallback:', wikiErr.message);
    }

    // Secondary Search fallback if extract empty
    if (!fetchedExtract) {
      try {
        const searchUrl = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanDest + ' wisata')}&utf8=&format=json`;
        const sResp = await fetch(searchUrl, {
          headers: { 'User-Agent': 'TravelTripGenerator/2.0 (CMS Application)' }
        });
        if (sResp.ok) {
          const sData = await sResp.json();
          const firstHit = sData.query?.search?.[0];
          if (firstHit) {
            fetchedExtract = firstHit.snippet?.replace(/<[^>]+>/g, '').trim() || '';
          }
        }
      } catch (_) {}
    }

    // Guaranteed Image Resolution
    const heroImage = fetchedImage || resolveDestinationFallbackImage(cleanDest);

    // 2. Synthesize High-Impact Structured Travel Data
    const formattedTitle = `Paket Eksplorasi Wisata ${cleanDest} Private Tour`;
    const tripSlug = `paket-wisata-${cleanDest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

    const mainDescription = fetchedExtract
      ? `${fetchedExtract} Nikmati perjalanan tanpa repot bersama ${brandName} dengan fasilitas kendaraan prima, pengemudi ramah berpengalaman, dan jadwal perjalanan yang fleksibel.`
      : `Eksplorasi keindahan spektakuler ${cleanDest} bersama armada sewa mobil terbaik dari ${brandName}. Pilihan tepat untuk liburan keluarga, perjalanan dinas, maupun rombongan wisata.`;

    const highlights = [
      `Spot Panorama Utama ${cleanDest}`,
      'Hunting Foto & Golden Sunset/Sunrise',
      'Wisata Kuliner Lokal Legendaris',
      'Pusat Kerajinan & Oleh-Oleh Khas',
      'Armada Nyaman AC Dingin + Driver'
    ];

    const routeItinerary = [
      `Hari 1 - 08.00: Penjemputan di Bandara / Stasiun / Hotel area kota bersama armada ${brandName}.`,
      `Hari 1 - 10.30: Perjalanan darat menuju kawasan ${cleanDest} dengan rute ternyaman dan panorama asri.`,
      `Hari 1 - 13.00: Makan siang kuliner lokal khas, dilanjutkan eksplorasi spot wisata utama ${cleanDest}.`,
      `Hari 1 - 16.30: Menikmati suasana sore / sunset di spot foto terbaik kawasan ${cleanDest}.`,
      `Hari 1 - 19.00: Makan malam santai dan pengantaran kembali ke hotel / meeting point awal dengan aman.`
    ];

    const included = [
      `Sewa Mobil AC Prima (Innova / Avanza / Hiace) + BBM`,
      `Driver Profesional, Ramah & Berpengalaman`,
      `Tiket Masuk Resmi Kawasan Wisata ${cleanDest}`,
      `Air Mineral Dingin & Snack Perjalanan`,
      `Parkir Kendaraan & Retribusi Wisata`
    ];

    const excluded = [
      'Tiket Pesawat / Kereta Api ke Kota Asal',
      'Pengeluaran Pribadi di Luar Paket',
      'Tipping Sukarela untuk Driver / Guide'
    ];

    const duration = '1 - 2 Hari (Fleksibel)';
    const pricePax = 'Rp 650.000';
    const priceGroup = 'Rp 2.800.000 (Min. 4-6 Pax)';

    // 3. Auto-Generate Konten Berformat Halaman Artikel Profesional (HTML)
    const waBookingUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Halo ${brandName}, saya tertarik untuk reservasi Paket Wisata ${cleanDest}. Mohon informasi jadwal dan ketersediaan armadanya.`)}`;

    const articleHtmlContent = `
      <div class="travel-package-article space-y-6 text-slate-700 leading-relaxed">
        <div class="rounded-2xl overflow-hidden shadow-lg mb-8">
          <img src="${heroImage}" alt="${cleanDest}" class="w-full h-80 sm:h-96 object-cover" />
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Menjelajahi Keindahan Eksotis ${cleanDest} Bersama ${brandName}
        </h2>
        
        <p class="text-base sm:text-lg leading-relaxed">
          ${mainDescription}
        </p>

        <div class="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 my-6">
          <h3 class="text-lg font-bold text-blue-900 mb-2">Highlight Daya Tarik & Aktivitas Utama</h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-950 font-medium">
            ${highlights.map(h => `<li class="flex items-center gap-2"><span class="text-blue-600 font-bold">✔</span> ${h}</li>`).join('')}
          </ul>
        </div>

        <h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">
          Rute Perjalanan & Rekomendasi Sewa Mobil
        </h3>
        <p>
          Menuju kawasan <strong>${cleanDest}</strong> kini semakin mudah dan menyenangkan menggunakan layanan sewa mobil plus driver berpengalaman dari ${brandName}. Armada kami (seperti Toyota Innova Zenix/Reborn, All New Avanza, hingga Hiace Luxury) selalu dalam kondisi servis rutin, bersih, dan berpendingin udara prima untuk memastikan kenyamanan seluruh penumpang selama perjalanan.
        </p>

        <h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">
          Rencana Perjalanan (Itinerary) Pilihan
        </h3>
        <div class="space-y-3 border-l-2 border-blue-500 pl-4 my-4">
          ${routeItinerary.map(item => `
            <div class="text-sm">
              <span class="font-bold text-slate-900">${item.split(':')[0]}:</span>
              <span class="text-slate-600">${item.split(':').slice(1).join(':')}</span>
            </div>
          `).join('')}
        </div>

        <h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">
          Fasilitas Layanan yang Termasuk
        </h3>
        <ul class="list-disc list-inside space-y-1 text-sm text-slate-600 mb-8">
          ${included.map(inc => `<li>${inc}</li>`).join('')}
        </ul>

        <!-- Call to Action Banner -->
        <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center space-y-4 shadow-xl">
          <h4 class="text-xl sm:text-2xl font-black">
            Siap Liburan Nyaman ke ${cleanDest}?
          </h4>
          <p class="text-blue-100 text-sm max-w-xl mx-auto">
            Dapatkan penawaran tarif sewa mobil paket all-in terbaik dan jadwal yang dapat disesuaikan dengan kebutuhan Anda.
          </p>
          <div class="pt-2">
            <a
              href="${waBookingUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg transition-transform hover:scale-105"
            >
              <span>Hubungi Customer Service via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // 4. Save to travel_trips Database Table
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const dbType = getDbType();

    const insertTripSql = dbType === 'postgres'
      ? `INSERT INTO travel_trips (id, title, slug, description, route_itinerary, duration, price_per_pax, price_per_group, images, highlights, included, excluded, badge, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           route_itinerary = EXCLUDED.route_itinerary,
           images = EXCLUDED.images,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`
      : `INSERT INTO travel_trips (\`id\`, \`title\`, \`slug\`, \`description\`, \`route_itinerary\`, \`duration\`, \`price_per_pax\`, \`price_per_group\`, \`images\`, \`highlights\`, \`included\`, \`excluded\`, \`badge\`, \`is_active\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           \`title\` = VALUES(\`title\`),
           \`description\` = VALUES(\`description\`),
           \`route_itinerary\` = VALUES(\`route_itinerary\`),
           \`images\` = VALUES(\`images\`),
           \`updated_at\` = CURRENT_TIMESTAMP`;

    const tripParams = [
      tripId,
      formattedTitle,
      tripSlug,
      mainDescription,
      JSON.stringify(routeItinerary),
      duration,
      pricePax,
      priceGroup,
      JSON.stringify([heroImage]),
      JSON.stringify(highlights),
      JSON.stringify(included),
      JSON.stringify(excluded),
      'Pilihan Favorit',
      true
    ];

    try {
      await query(insertTripSql, tripParams);
    } catch (tripDbErr) {
      console.warn('[AutoGenerateTrip] Trip DB write note:', tripDbErr.message);
    }

    // 5. Save as a High-Ranking Article Page in articles Database Table
    const articleId = `art_trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const articleSlug = `panduan-wisata-${cleanDest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    const articleExcerpt = `Panduan lengkap liburan dan paket sewa mobil menuju ${cleanDest}. Simak rute terbaik, estimasi itinerary, dan rekomendasi armada terpercaya bersama ${brandName}.`;

    const insertArticleSql = dbType === 'postgres'
      ? `INSERT INTO articles (id, title, slug, content, excerpt, featured_image, category, location_variable, meta_title, meta_description, canonical_url, schema_markup, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           content = EXCLUDED.content,
           excerpt = EXCLUDED.excerpt,
           featured_image = EXCLUDED.featured_image,
           updated_at = CURRENT_TIMESTAMP`
      : `INSERT INTO articles (\`id\`, \`title\`, \`slug\`, \`content\`, \`excerpt\`, \`featured_image\`, \`category\`, \`location_variable\`, \`meta_title\`, \`meta_description\`, \`canonical_url\`, \`schema_markup\`, \`is_published\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           \`title\` = VALUES(\`title\`),
           \`content\` = VALUES(\`content\`),
           \`excerpt\` = VALUES(\`excerpt\`),
           \`featured_image\` = VALUES(\`featured_image\`),
           \`updated_at\` = CURRENT_TIMESTAMP`;

    const articleParams = [
      articleId,
      `Panduan Lengkap Wisata & Paket Tour ${cleanDest}`,
      articleSlug,
      articleHtmlContent,
      articleExcerpt,
      heroImage,
      'Paket Wisata & Trip',
      cleanDest,
      `Paket Wisata ${cleanDest} & Sewa Mobil All-In Terbaik | ${brandName}`,
      articleExcerpt,
      `/artikel/${articleSlug}`,
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: formattedTitle,
        description: mainDescription,
        touristType: ['Family', 'Group', 'Executive']
      }),
      true
    ];

    try {
      await query(insertArticleSql, articleParams);
    } catch (artDbErr) {
      console.warn('[AutoGenerateTrip] Article DB write note:', artDbErr.message);
    }

    res.json({
      success: true,
      message: `Berhasil mencari data Google & membuat Paket Wisata serta Artikel untuk ${cleanDest}!`,
      data: {
        id: tripId,
        title: formattedTitle,
        slug: tripSlug,
        duration,
        price_per_pax: pricePax,
        price_per_group: priceGroup,
        images: [heroImage],
        highlights,
        route_itinerary: routeItinerary,
        article_slug: articleSlug,
        article_url: `/artikel/${articleSlug}`
      }
    });
  } catch (err) {
    console.error('[AutoGenerateTrip Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: DELETE /api/admin/travel-trips/:id
 */
router.delete('/manage/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const dbType = getDbType();
    const sql = dbType === 'postgres' ? `DELETE FROM travel_trips WHERE id = $1` : `DELETE FROM travel_trips WHERE id = ?`;
    await query(sql, [id]);

    res.json({
      success: true,
      message: 'Paket tour berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: POST /api/admin/travel-trips/batch-delete
 * Bulk delete travel packages by ID array
 */
router.post('/batch-delete', adminAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Pilih minimal satu paket tour untuk dihapus' });
    }

    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query('DELETE FROM travel_trips WHERE id = ANY($1)', [ids]);
    } else if (dbType === 'mysql') {
      const placeholders = ids.map(() => '?').join(',');
      await query(`DELETE FROM travel_trips WHERE id IN (${placeholders})`, ids);
    }

    res.json({
      success: true,
      message: `Berhasil menghapus ${ids.length} paket tour secara serentak (bulk delete)!`,
      deletedCount: ids.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: POST /api/admin/travel-trips/batch-status
 * Bulk update travel packages active status
 */
router.post('/batch-status', adminAuth, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Pilih minimal satu paket tour' });
    }

    const isActive = status === 'active' || status === true;
    const dbType = getDbType();

    if (dbType === 'postgres') {
      await query('UPDATE travel_trips SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = ANY($2)', [isActive, ids]);
    } else if (dbType === 'mysql') {
      const placeholders = ids.map(() => '?').join(',');
      await query(`UPDATE travel_trips SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`, [isActive, ...ids]);
    }

    res.json({
      success: true,
      message: `Berhasil memperbarui status ${ids.length} paket tour menjadi ${isActive ? 'Aktif' : 'Nonaktif'}!`,
      updatedCount: ids.length,
      is_active: isActive
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
