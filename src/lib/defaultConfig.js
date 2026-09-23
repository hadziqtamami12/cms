/**
 * Default Client Configuration
 * Provides immediate instant hydration data for frontend PWA
 */

export const DEFAULT_CONFIG = {
  industry: 'automotive',
  themeId: 'fleet-grid',
  bottom_nav_variant: 'floating_dock',
  bottomNavStyle: 'dock',
  brandName: 'CMS Enterprise Portal',
  tagline: 'Inisialisasi Setup & Generator Landing Page Multi-Industri',
  phone: '+62 812-8899-0011',
  whatsapp: '6281288990011',
  floating_whatsapp: {
    enabled: true,
    phone: '6281288990011',
    messageTemplate: 'Halo, saya ingin bertanya seputar sewa armada.',
    position: 'right'
  },
  whatsapp_settings: {
    enabled: true,
    displayMode: 'bottom_nav',
    navPosition: 'center',
    actionType: 'popup',
    phone: '6281288990011',
    brandName: 'CMS Customer Support',
    messageTemplate: 'Halo, saya ingin bertanya informasi lebih lanjut.',
    welcomeMessage: 'Halo kak! Ada yang bisa kami bantu seputar produk, armada, atau reservasi Anda hari ini? Silakan pilih opsi cepat di bawah atau ketik pesan Anda 😊'
  },
  email: 'concierge@royalfleet.com',
  location: 'Jakarta Selatan & Bali',
  heroSlides: [
    {
      title: 'Solusi Sewa Mobil Mewah & Armada Bisnis Terlengkap',
      subtitle: 'Armada tahun terbaru, jaminan bersih wangi, sopir profesional berpengalaman, dan layanan 24 jam.',
      badge: 'Armada Terlengkap & Terawat 2026',
      ctaText: 'Pesan Armada Sekarang',
      ctaLink: '#fleet',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80'
    },
    {
      title: 'Executive Chauffeur & VIP Airport Transfer',
      subtitle: 'Antar jemput bandara tepat waktu dengan unit Alphard, Camry, Fortuner, dan HiAce Luxury.',
      badge: 'Jaminan Layanan VIP 24/7',
      ctaText: 'Cek Jadwal & Tarif',
      ctaLink: '#pricing',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80'
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
      desc: 'Seluruh kendaraan rutin diservis di bengkel resmi serta melalui sanitasi disinfektan sebelum diserahkan.'
    },
    {
      title: 'Driver Berlisensi & Santun',
      desc: 'Pengemudi terlatih, menguasai rute tercepat, ramah, dan memprioritaskan kenyamanan serta privasi Anda.'
    },
    {
      title: 'Asuransi All-Risk Komprehensif',
      desc: 'Perjalanan aman dan bebas cemas berkat perlindungan asuransi all-risk penuh untuk setiap unit.'
    },
    {
      title: 'Layanan Darurat 24 Jam Non-Stop',
      desc: 'Tim customer service dan mobil derek darurat siap siaga 24/7 di seluruh area operasional.'
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
    }
  ],
  seo: {
    targetKeywords: ['cms multi industri', 'setup cms landing page', 'instalasi generator tema'],
    title: 'Instalasi CMS Enterprise Multi-Industri | Setup Wizard',
    metaDescription: 'Setup wizard inisialisasi CMS Multi-Industri dan generator landing page enterprise.',
    slug: 'setup-cms-enterprise'
  },
  adminSlug: 'admin',
  license: {
    isInstalled: null,
    status: 'unknown',
    type: 'trial',
    daysRemaining: 30,
    isLocked: false
  }
};

export default DEFAULT_CONFIG;
