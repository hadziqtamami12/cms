/**
 * Travel Trips & Tour Packages API Routes
 */

import { Router } from 'express';
import { query, getDbType } from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';

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

/**
 * Public: GET /api/travel-trips
 */
router.get('/public', async (req, res) => {
  try {
    const dbType = getDbType();
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
      // Ensure JSON fields are parsed if returned as strings
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
 * Admin: GET /api/admin/travel-trips
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
 * Admin: POST /api/admin/travel-trips
 */
router.post('/manage', adminAuth, async (req, res) => {
  try {
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

export default router;
