/**
 * Theme & CMS Category Presets Engine
 * Provides turn-key dummy content, layout, features, and SEO configuration
 * for 4 core CMS categories:
 * 1. E-Commerce (Toko Online)
 * 2. Company Profile (Korporat & Jasa Profesional)
 * 3. Rental & Jasa Transport (Armada & Sewa)
 * 4. Blog & Portal Berita (Media & Editorial)
 */

export const THEME_PRESETS = {
  ecommerce: {
    id: 'ecommerce',
    categoryName: 'Toko Online / E-Commerce',
    industry: 'ecommerce',
    themeId: 'modern-shop',
    bottomNavStyle: 'dock',
    bottom_nav_variant: 'floating_dock',
    brandName: 'LuxeStore Official',
    tagline: 'Pusat Belanja Fashion & Gadget Premium Original Terlengkap',
    phone: '+62 812-3344-5566',
    whatsapp: '6281233445566',
    email: 'order@luxestore.id',
    location: 'Jakarta Barat & Surabaya',
    onboarded: true,
    heroSlides: [
      {
        title: 'Koleksi Fashion & Gadget Eksklusif 2026',
        subtitle: 'Dapatkan penawaran terbatas diskon hingga 40% untuk produk terlaris minggu ini.',
        badge: 'Diskon Musim Panas 40%',
        ctaText: 'Belanja Sekarang',
        ctaLink: '#products',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80'
      },
      {
        title: 'Gadget & Smart Accessories Original Bergaransi',
        subtitle: '100% Produk Original resmi dengan pengiriman same-day ke seluruh kota besar.',
        badge: 'Garansi Resmi 1 Tahun',
        ctaText: 'Lihat Katalog Gadget',
        ctaLink: '#products',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1920&q=80'
      }
    ],
    items: [
      {
        id: 'prod-1',
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling',
        category: 'Audio & Gadget',
        price: 'Rp 4.499.000',
        original_price: 'Rp 5.299.000',
        period: '',
        badge: 'Best Seller',
        specs: ['30 Jam Baterai', 'Active Noise Cancelling', 'Hi-Res Audio', 'Garansi Resmi 1 Thn'],
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviews_count: 142
      },
      {
        id: 'prod-2',
        title: 'Leather Weekender Travel Duffel Bag',
        category: 'Fashion & Aksesoris',
        price: 'Rp 1.250.000',
        original_price: 'Rp 1.650.000',
        period: '',
        badge: 'Bahan Kulit Asli',
        specs: ['Crazy Horse Leather', 'Kapasitas 45L', 'Tahan Air', 'Kompartemen Sepatu Khusus'],
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviews_count: 98
      },
      {
        id: 'prod-3',
        title: 'Mechanical Keyboard Pro RGB Custom 75%',
        category: 'Komputer & Gaming',
        price: 'Rp 899.000',
        original_price: 'Rp 1.150.000',
        period: '',
        badge: 'Hot Item',
        specs: ['Gateron Yellow Switch', 'PBT Keycaps', 'Hot-Swappable 5-Pin', 'Tri-Mode Wireless'],
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        reviews_count: 215
      },
      {
        id: 'prod-4',
        title: 'Minimalist Chronograph Watch Matte Black',
        category: 'Jam Tangan & Aksesoris',
        price: 'Rp 1.750.000',
        original_price: 'Rp 2.100.000',
        period: '',
        badge: 'Edisi Terbatas',
        specs: ['Sapphire Crystal Glass', 'Japanese Quartz Movement', 'Water Resistant 50M', 'Strap Kulit Asli'],
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviews_count: 67
      }
    ],
    features: [
      {
        title: 'Jaminan 100% Produk Original',
        desc: 'Semua barang bersumber dari distributor resmi dengan garansi keaslian penuh atau uang kembali.',
        icon: 'ShieldCheck'
      },
      {
        title: 'Pengiriman Cepat & Terlindungi',
        desc: 'Kerjasama dengan kurir ekspres terpercaya dilengkapi asuransi pengiriman gratis tanpa biaya tambahan.',
        icon: 'Truck'
      },
      {
        title: 'Pembayaran Mudah & Aman',
        desc: 'Mendukung QRIS, transfer bank virtual account, kartu kredit, dan COD.',
        icon: 'CreditCard'
      },
      {
        title: 'Garansi Tukar 14 Hari',
        desc: 'Jika barang cacat atau tidak sesuai ukuran, tukar unit baru dengan proses mudah.',
        icon: 'RefreshCw'
      }
    ],
    testimonials: [
      {
        name: 'Sarah Safira',
        role: 'Verified Buyer - Jakarta',
        comment: 'Headphone sampai hanya dalam 4 jam via pengiriman instan. Barangnya benar-benar original, garansi resmi langsung terdaftar. Sangat puas!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      },
      {
        name: 'David Wijaya',
        role: 'Tech Enthusiast - Surabaya',
        comment: 'Packing sangat rapi dengan bubble wrap tebal. Keyboard mekanikalnya nyaman sekali dan build quality luar biasa untuk harganya.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      }
    ],
    faqs: [
      {
        q: 'Bagaimana cara melakukan pemesanan?',
        a: 'Pilih produk yang Anda sukai, klik tombol "Beli / Pesan via WhatsApp", dan tim kami akan segera memproses detail pesanan serta ongkir Anda.'
      },
      {
        q: 'Apakah semua produk bergaransi resmi?',
        a: 'Ya, seluruh produk elektronik dan gadget memiliki garansi resmi Indonesia 1 hingga 2 tahun.'
      },
      {
        q: 'Berapa lama estimasi pengiriman?',
        a: 'Untuk area Jabodetabek tersedia same-day kurir (1-4 jam). Luar kota reguler memakan waktu 2-3 hari kerja.'
      }
    ],
    seo: {
      targetKeywords: ['toko online terpercaya', 'belanja gadget original', 'fashion pria wanita online', 'diskon promo toko'],
      title: 'LuxeStore Official - Toko Online Fashion & Gadget Original Terpercaya',
      metaDescription: 'Belanja produk gadget, fashion, dan aksesoris original bergaransi resmi. Diskon hingga 40%, pengiriman cepat same-day, dan jaminan uang kembali.',
      slug: 'toko-online-indonesia'
    }
  },

  services: {
    id: 'services',
    categoryName: 'Company Profile & Jasa Profesional',
    industry: 'services',
    themeId: 'agency-dark',
    bottomNavStyle: 'dock',
    bottom_nav_variant: 'floating_dock',
    brandName: 'Apex Global Consulting',
    tagline: 'Partner Strategis Transformasi Digital, Legalitas, & Konsultasi Bisnis',
    phone: '+62 821-9988-7711',
    whatsapp: '6282199887711',
    email: 'contact@apexglobal.co.id',
    location: 'Sudirman Central Business District (SCBD), Jakarta',
    onboarded: true,
    heroSlides: [
      {
        title: 'Mendorong Pertumbuhan Eksponensial Perusahaan Anda',
        subtitle: 'Layanan konsultasi manajemen bisnis terintegrasi, audit finansial, legalitas korporat, dan otomatisasi digital.',
        badge: 'Konsultan Terakreditasi Nasional',
        ctaText: 'Jadwalkan Konsultasi Gratis',
        ctaLink: '#services',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80'
      },
      {
        title: 'Solusi Legalitas Bisnis & Perizinan Berusaha Terpercaya',
        subtitle: 'Pendirian PT, PMA, HKI merek, perjanjian kerja sama bisnis selesai cepat sesuai regulasi terbaru.',
        badge: 'Proses Legal Kilat & Aman',
        ctaText: 'Konsultasi Tim Legal',
        ctaLink: '#contact',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'
      }
    ],
    items: [
      {
        id: 'srv-1',
        title: 'Konsultasi Strategi Manajemen & Scaling Bisnis',
        category: 'Business Growth',
        price: 'Mulai Rp 5.000.000',
        period: '/project',
        badge: 'Paling Dicari',
        specs: ['Analisis Pasar & Kompetitor', 'Audit Efisiensi Finansial', 'Roadmap Skalabilitas 3 Tahun', 'Pendampingan C-Level'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'srv-2',
        title: 'Pendirian PT & Izin Usaha Terintegrasi (OSS RBA)',
        category: 'Corporate Legal',
        price: 'Mulai Rp 3.500.000',
        period: '/paket',
        badge: 'Selesai 3 Hari',
        specs: ['Akta Notaris & SK Kemenkumham', 'NIB OSS RBA Lengkap', 'NPWP Badan & Rekening Bank', 'Free Konsultasi Pajak Awal'],
        image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'srv-3',
        title: 'Transformasi Digital & Arsitektur Cloud Enterprise',
        category: 'Technology & AI',
        price: 'Custom Enterprise',
        period: '',
        badge: 'Modern Tech Stack',
        specs: ['Modernisasi Infrastruktur Cloud', 'Otomatisasi Workflow Bisnis', 'Integrasi ERP & CRM', 'Audit Keamanan Siber ISO27001'],
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'srv-4',
        title: 'Pendaftaran HKI, Paten & Hak Cipta Merek',
        category: 'Intellectual Property',
        price: 'Mulai Rp 2.200.000',
        period: '/kelas',
        badge: 'Jaminan Berkas Lolos',
        specs: ['Pengecekan Database DJKI', 'Penyusunan Deskripsi & Etiket', 'Monitoring Status Rutin', 'Sertifikat Resmi DJKI'],
        image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80'
      }
    ],
    features: [
      {
        title: '12+ Tahun Pengalaman Industri',
        desc: 'Telah membantu lebih dari 650+ startup, UKM, hingga emiten multinasional mencapai target ekspansi.',
        icon: 'Award'
      },
      {
        title: 'Kerahasiaan Data Mutlak (Strict NDA)',
        desc: 'Setiap informasi dan strategi bisnis Anda dilindungi perjanjian kerahasiaan bernilai legal penuh.',
        icon: 'Lock'
      },
      {
        title: 'Praktisi & Konsultan Bersertifikasi',
        desc: 'Tim terdiri dari advokat resmi PERADI, akuntan publik tersertifikasi, dan lead system architect.',
        icon: 'Users'
      },
      {
        title: 'Hasil Terukur & ROI Nyata',
        desc: 'Pendekatan berbasis data (data-driven) yang fokus pada pertumbuhan laba dan efisiensi biaya operasional.',
        icon: 'TrendingUp'
      }
    ],
    testimonials: [
      {
        name: 'Ir. Hendrawan Soetopo',
        role: 'Direktur Utama PT Nusantara Prima Energi',
        comment: 'Apex Global membantu restrukturisasi perizinan dan compliance korporat kami dengan sangat cepat dan presisi. Rekomendasi utama untuk para pelaku usaha.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      },
      {
        name: 'Jessica Melina, MBA',
        role: 'Co-Founder Finova Tech',
        comment: 'Strategi ekspansi pasar yang dirancang tim Apex terbukti meningkatkan revenue kami sebesar 180% dalam 6 bulan pertama. Luar biasa!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
      }
    ],
    faqs: [
      {
        q: 'Apakah bisa melakukan konsultasi awal secara online?',
        a: 'Bisa. Kami menyediakan sesi konsultasi diagnostik 30 menit via Zoom atau Google Meet tanpa dipungut biaya.'
      },
      {
        q: 'Berapa lama rata-rata proses pendirian PT?',
        a: 'Proses pendirian PT Standar memakan waktu 3 sampai 5 hari kerja setelah dokumen identitas ditandatangani.'
      }
    ],
    seo: {
      targetKeywords: ['konsultan bisnis jakarta', 'jasa pendirian pt cepat', 'konsultan hukum korporat', 'jasa pendaftaran merek hki'],
      title: 'Apex Global Consulting - Solusi Konsultasi Bisnis & Legalitas Korporat',
      metaDescription: 'Partner konsultan manajemen bisnis, pendirian PT, legalitas usaha, dan transformasi digital profesional di Jakarta. Konsultasi gratis sekarang.',
      slug: 'company-profile-konsultan'
    }
  },

  automotive: {
    id: 'automotive',
    categoryName: 'Rental Mobil & Jasa Transportasi',
    industry: 'automotive',
    themeId: 'fleet-grid',
    bottomNavStyle: 'dock',
    bottom_nav_variant: 'floating_dock',
    brandName: 'Royal Fleet Premiere',
    tagline: 'Sewa Mobil Mewah & Rental Armada Bisnis Terpercaya No. 1',
    phone: '+62 812-8899-0011',
    whatsapp: '6281288990011',
    email: 'concierge@royalfleet.com',
    location: 'Jakarta Selatan & Bali',
    onboarded: true,
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
        ctaLink: '#fleet',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80'
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
    testimonials: [
      {
        name: 'Bambang Sudiro',
        role: 'CEO Artha Tech Nusantara',
        comment: 'Pelayanan Alphard untuk tamu direksi dari Jepang sangat memuaskan. Mobil bersih luar biasa dan driver sangat sopan.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      },
      {
        name: 'dr. Hendra Kusuma',
        role: 'Spesialis RS Mitra',
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
      }
    ],
    seo: {
      targetKeywords: ['sewa mobil jakarta', 'rental alphard bandara', 'rental mobil murah lepas kunci'],
      title: 'Sewa Mobil & Rental Armada Mewah Terpercaya | Royal Fleet 24 Jam',
      metaDescription: 'Layanan sewa mobil terpercaya lepas kunci dan include driver di Jakarta dan Bali. Armada terbaru Alphard, Innova Zenix, Fortuner, dan HiAce.',
      slug: 'sewa-mobil-mewah-jakarta'
    }
  },

  news: {
    id: 'news',
    categoryName: 'Blog & Portal Berita Digital',
    industry: 'services', // Maps to informative editorial layout
    themeId: 'portal-mag',
    bottomNavStyle: 'dock',
    bottom_nav_variant: 'floating_dock',
    brandName: 'WartaNusantara Digital',
    tagline: 'Portal Berita Terkini, Wawasan Teknologi, Bisnis, & Tren Nasional',
    phone: '+62 811-7788-9900',
    whatsapp: '6281177889900',
    email: 'redaksi@wartanusantara.id',
    location: 'Gedung Pers Kebon Sirih, Jakarta Pusat',
    onboarded: true,
    heroSlides: [
      {
        title: 'Jurnalisme Terpercaya & Informasi Aktual Tanpa Hoaks',
        subtitle: 'Dapatkan liputan mendalam seputar ekonomi makro, tren kecerdasan buatan, gaya hidup modern, dan sains masa depan.',
        badge: 'Pembaruan Real-Time 24 Jam',
        ctaText: 'Baca Berita Terkini',
        ctaLink: '/artikel',
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=80'
      },
      {
        title: 'Analisis Finansial & Lanskap Startup Teknologi 2026',
        subtitle: 'Kajian komprehensif dari para ekonom terkemuka dan praktisi ventura nusantara.',
        badge: 'Edisi Khusus Finansial',
        ctaText: 'Jelajahi Kolom Opini',
        ctaLink: '/artikel',
        image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1920&q=80'
      }
    ],
    items: [
      {
        id: 'news-1',
        title: 'Revolusi AI Generatif pada Sektor Perbankan & Layanan Finansial Indonesia',
        category: 'Teknologi & Bisnis',
        price: 'Bacaan 5 Menit',
        period: '',
        badge: 'Trending Topik',
        specs: ['Analisis Industri', 'Penulis: Redaksi Utama', '12.4K Pembaca', 'Kategori: FinTech'],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'news-2',
        title: 'Kebijakan Insentif Kendaraan Listrik Nasional Mendapat Respon Positif Pasar',
        category: 'Otomotif & Kebijakan',
        price: 'Bacaan 4 Menit',
        period: '',
        badge: 'Fokus Nasional',
        specs: ['Wawancara Eksklusif', 'Penulis: Tim Ekonomi', '8.9K Pembaca', 'Kategori: Otomotif'],
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'news-3',
        title: 'Strategi UKM Menembus Pasar Global Melalui Optimasi E-Commerce Ekspor',
        category: 'Ekonomi Digital',
        price: 'Bacaan 6 Menit',
        period: '',
        badge: 'Panduan Bisnis',
        specs: ['Studi Kasus Nyata', 'Penulis: Pakar UKM', '15.1K Pembaca', 'Kategori: Edukasi'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'news-4',
        title: 'Destinasi Wisata Tersembunyi di Indonesia Timur yang Wajib Dikunjungi Tahun Ini',
        category: 'Travel & Lifestyle',
        price: 'Bacaan 7 Menit',
        period: '',
        badge: 'Inspirasi Perjalanan',
        specs: ['Foto Jurnalistik', 'Penulis: Travelogue', '19.7K Pembaca', 'Kategori: Wisata'],
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    features: [
      {
        title: 'Standar Jurnalistik Berimbang & Faktual',
        desc: 'Semua artikel diverifikasi oleh dewan redaksi independen bebas clickbait murahan.',
        icon: 'FileText'
      },
      {
        title: 'Pembaruan Berita Tercepat 24/7',
        desc: 'Jaringan koresponden aktif di lebih dari 34 provinsi menyajikan fakta langsung dari lapangan.',
        icon: 'Clock'
      },
      {
        title: 'Analisis Mendalam dari Tokoh & Pakar',
        desc: 'Kolom opini berkala dari akademisi, ekonom, dan praktisi industri terkemuka.',
        icon: 'TrendingUp'
      },
      {
        title: 'Akses Multiplatform Ringan & Cepat',
        desc: 'Didesain hemat kuota dengan teknologi Core Web Vitals berkecepatan tinggi.',
        icon: 'Zap'
      }
    ],
    testimonials: [
      {
        name: 'Prof. Dr. Ir. Gunawan Wibisono',
        role: 'Pengamat Kebijakan Publik',
        comment: 'WartaNusantara menyajikan artikel yang sangat berbobot dengan data komprehensif. Menjadi rujukan utama saya setiap pagi.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
      }
    ],
    faqs: [
      {
        q: 'Bagaimana cara mengirimkan opini atau siaran pers?',
        a: 'Silakan kirimkan naskah tulisan Anda ke email redaksi@wartanusantara.id dengan melampirkan identitas diri resmi.'
      },
      {
        q: 'Apakah artikel berita dapat dikutip oleh media lain?',
        a: 'Pengutipan diperbolehkan dengan mencantumkan tautan aktif (backlink) ke artikel sumber asli.'
      }
    ],
    seo: {
      targetKeywords: ['portal berita terkini', 'berita bisnis terpercaya', 'analisis teknologi indonesia', 'warta nasional aktual'],
      title: 'WartaNusantara Digital - Berita Terkini, Teknologi & Analisis Bisnis',
      metaDescription: 'Portal berita digital terdepan menyajikan informasi aktual terverifikasi seputar ekonomi, teknologi kecerdasan buatan, politik, dan gaya hidup.',
      slug: 'portal-berita-nasional'
    }
  }
};

export const getPreset = (key) => THEME_PRESETS[key] || THEME_PRESETS.automotive;
export const getAllPresets = () => Object.values(THEME_PRESETS);
