/**
 * Multi-Industry & 10-Themes Dynamic Service
 * Supports 5 core industries x 10 themes per industry = 50 total variants
 * Preserves landing page data structure during 1-click theme switches
 */

import { getCache, setCache } from '../config/cache.js';

// Default system active theme configuration
let currentThemeConfig = {
  industry: 'automotive', // 'automotive' | 'ecommerce' | 'fnb' | 'services' | 'realestate'
  themeId: 'fleet-grid',
  bottomNavStyle: 'dock', // 'dock' | 'curved' | 'bubble' | 'box'
  brandName: 'Royal Fleet Premiere',
  tagline: 'Sewa Mobil & Armada Premium Terpercaya No. 1',
  phone: '+62 812-8899-0011',
  whatsapp: '6281288990011',
  email: 'concierge@royalfleet.com',
  location: 'Jakarta Selatan & Bali',
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
      price: 'Rp 2.000.000',
      price_self_drive: 'Rp 2.000.000',
      price_with_driver: 'Rp 2.500.000',
      period: '/hari',
      badge: 'Favorit VIP',
      specs: ['7 Kursi Captain Seat', 'Matic', 'Bensin', 'Driver + BBM Available'],
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      pricing_tiers: [
        { label: 'Lepas Kunci', price: 'Rp 2.000.000', unit: '/24 jam', is_default: true },
        { label: 'Dengan Sopir', price: 'Rp 2.500.000', unit: '/12 jam', is_default: false }
      ]
    },
    {
      id: 'car-2',
      title: 'Toyota Innova Zenix Hybrid',
      category: 'Family Touring',
      price: 'Rp 650.000',
      price_self_drive: 'Rp 650.000',
      price_with_driver: 'Rp 850.000',
      period: '/hari',
      badge: 'Paling Irit',
      specs: ['7 Kursi Nyaman', 'Matic CVT', 'Hybrid Super Irit', 'Sunroof'],
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      pricing_tiers: [
        { label: 'Lepas Kunci', price: 'Rp 650.000', unit: '/24 jam', is_default: true },
        { label: 'Dengan Sopir', price: 'Rp 850.000', unit: '/12 jam', is_default: false }
      ]
    },
    {
      id: 'car-3',
      title: 'Toyota Fortuner GR Sport 2.8',
      category: 'Premium SUV',
      price: 'Rp 1.100.000',
      price_self_drive: 'Rp 1.100.000',
      price_with_driver: 'Rp 1.400.000',
      period: '/hari',
      badge: 'Gagah & Bertenaga',
      specs: ['7 Kursi', 'Matic 4x2', 'Diesel Turbo 2.8L', 'Tangguh Segala Medan'],
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      pricing_tiers: [
        { label: 'Lepas Kunci', price: 'Rp 1.100.000', unit: '/24 jam', is_default: true },
        { label: 'Dengan Sopir', price: 'Rp 1.400.000', unit: '/12 jam', is_default: false }
      ]
    },
    {
      id: 'car-4',
      title: 'Toyota HiAce Premio Luxury VIP',
      category: 'Executive Van',
      price: 'Rp 1.400.000',
      price_self_drive: 'Rp 1.400.000',
      price_with_driver: 'Rp 1.800.000',
      period: '/hari',
      badge: 'Rombongan Elegan',
      specs: ['9 Captain Seats', 'Matic', 'Full Entertainment Audio', 'Karaoke On-Board'],
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      pricing_tiers: [
        { label: 'Lepas Kunci', price: 'Rp 1.400.000', unit: '/24 jam', is_default: true },
        { label: 'Dengan Sopir', price: 'Rp 1.800.000', unit: '/12 jam', is_default: false }
      ]
    },
    {
      id: 'car-5',
      title: 'Honda HR-V RS Turbo',
      category: 'Compact Crossover',
      price: 'Rp 450.000',
      price_self_drive: 'Rp 450.000',
      price_with_driver: 'Rp 650.000',
      period: '/hari',
      badge: 'Stylish City',
      specs: ['5 Kursi', 'Matic', 'Bensin Turbo', 'Panoramic Roof'],
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      pricing_tiers: [
        { label: 'Lepas Kunci', price: 'Rp 450.000', unit: '/24 jam', is_default: true },
        { label: 'Dengan Sopir', price: 'Rp 650.000', unit: '/12 jam', is_default: false }
      ]
    },
    {
      id: 'car-6',
      title: 'Hyundai Ioniq 5 Signature',
      category: 'Electric Vehicle',
      price: 'Rp 1.200.000',
      price_self_drive: 'Rp 1.200.000',
      price_with_driver: 'Rp 1.600.000',
      period: '/hari',
      badge: 'Zero Emission',
      specs: ['5 Kursi', 'Full Electric', 'Range 450KM', 'Fast Charging Support'],
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      pricing_tiers: [
        { label: 'Lepas Kunci', price: 'Rp 1.200.000', unit: '/24 jam', is_default: true },
        { label: 'Dengan Sopir', price: 'Rp 1.600.000', unit: '/12 jam', is_default: false }
      ]
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

import {
  getPublicSettings,
  saveSettings,
  normalizeBottomNavVariant,
  mapVariantToLegacyStyle
} from './configService.js';

export const getActiveThemeConfig = async () => {
  return await getPublicSettings();
};

export const updateActiveThemeConfig = async (partialConfig) => {
  return await saveSettings(partialConfig);
};

export const switchThemeVariant = async ({ industry, themeId, bottomNavStyle, bottom_nav_variant }) => {
  const updates = {};
  if (industry) updates.industry = industry;
  if (themeId) updates.themeId = themeId;
  if (bottom_nav_variant) updates.bottom_nav_variant = bottom_nav_variant;
  if (bottomNavStyle) updates.bottomNavStyle = bottomNavStyle;
  return await saveSettings(updates);
};

export default {
  getActiveThemeConfig,
  updateActiveThemeConfig,
  switchThemeVariant
};
