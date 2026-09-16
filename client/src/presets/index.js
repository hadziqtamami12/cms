/**
 * Multi-Purpose Preset Themes & Default JSON Block Trees
 * Generic themes suitable for any business, agency, store, blog, or service.
 */

export const PRESET_THEMES = [
  {
    id: 'business-modern',
    name: 'Bisnis & Perusahaan Modern (Default)',
    category: 'Corporate',
    description: 'Hero presentasi elegan, pilar keunggulan, paket layanan, ulasan klien, dan kontak terintegrasi.',
    icon: 'Building2',
    jsonLdType: 'Organization',
    samplePayload: {
      slug: 'home',
      title: 'Solusi Digital & Pertumbuhan Bisnis Modern',
      themeId: 'business-modern',
      mobileNavType: 'curved',
      seo: {
        metaTitle: 'Solusi Digital & Transformasi Bisnis Modern | Ultra CMS',
        metaDescription: 'Platform profesional dengan arsitektur web berkinerja tinggi untuk mendukung pertumbuhan bisnis Anda.',
        jsonLdType: 'Organization',
      },
      blocks: [
        {
          id: 'hero_1',
          type: 'hero-slider',
          props: {
            badge: 'Transformasi Digital Terpercaya',
            title: 'Membangun Ekosistem Digital Berkinerja Tinggi untuk Bisnis Anda',
            subtitle: 'Kami menghadirkan solusi teknologi mutakhir dengan pendekatan berbasis data dan desain berpusat pada pengguna.',
            ctaPrimaryText: 'Konsultasi Sekarang',
            ctaPrimaryLink: '#contact',
            ctaSecondaryText: 'Lihat Layanan',
            ctaSecondaryLink: '#features',
            slides: [
              {
                id: 's1',
                imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600',
                title: 'Kemitraan Strategis untuk Masa Depan',
                subtitle: 'Membantu perusahaan bertransformasi dan memimpin di era digital.',
              },
            ],
          },
        },
        {
          id: 'features_1',
          type: 'features',
          props: {
            badge: 'Keunggulan Kami',
            title: 'Mengapa Memilih Layanan Kami?',
            subtitle: 'Dedikasi tinggi terhadap kualitas, kecepatan, dan kepuasan setiap mitra.',
            items: [
              { title: 'Teknologi Modern', desc: 'Dibangun di atas arsitektur cloud serverless generasi terbaru.', icon: 'zap' },
              { title: 'Keamanan Tingkat Tinggi', desc: 'Standar enkripsi data dan perlindungan privasi yang ketat.', icon: 'shield-check' },
              { title: 'Dukungan 24/7', desc: 'Tim spesialis kami selalu siap membantu setiap saat.', icon: 'clock' },
              { title: 'Hasil Terukur', desc: 'Fokus pada ROI nyata dan metrik pertumbuhan bisnis Anda.', icon: 'award' },
            ],
          },
        },
        {
          id: 'pricing_1',
          type: 'pricing',
          props: {
            badge: 'Paket Investasi',
            title: 'Pilihan Paket Layanan Sesuai Skala Bisnis',
            subtitle: 'Transparansi penuh tanpa biaya tersembunyi.',
            plans: [
              {
                name: 'Starter',
                price: 'Rp 499.000',
                period: '/bulan',
                description: 'Ideal untuk usaha rintisan atau proyek mandiri.',
                highlight: false,
                features: ['Akses Semua Fitur Dasar', 'Dukungan Komunitas', 'Update Berkala'],
                buttonText: 'Mulai Paket Starter',
              },
              {
                name: 'Professional',
                price: 'Rp 1.499.000',
                period: '/bulan',
                description: 'Paket terlengkap untuk bisnis berkembang pesat.',
                highlight: true,
                features: ['Semua Fitur Starter', 'Prioritas Dukungan 24/7', 'Kustom Domain & SSL', 'Analitik Lengkap'],
                buttonText: 'Pilih Professional',
              },
              {
                name: 'Enterprise',
                price: 'Rp 3.999.000',
                period: '/bulan',
                description: 'Kapasitas maksimal untuk korporat berskala besar.',
                highlight: false,
                features: ['Semua Fitur Pro', 'Dedicated Account Manager', 'SLA 99.9% Uptime', 'Keamanan Kustom'],
                buttonText: 'Hubungi Tim Sales',
              },
            ],
          },
        },
        {
          id: 'cta_1',
          type: 'cta',
          props: {
            badge: 'Mulai Hari Ini',
            title: 'Siap Mengakselerasi Proyek Anda Bersama Kami?',
            subtitle: 'Diskusikan visi Anda bersama tim ahli kami untuk mendapatkan estimasi dan solusi terbaik.',
            buttonText: 'Konsultasi Gratis via WhatsApp',
            buttonLink: '#contact',
          },
        },
      ],
    },
  },
  {
    id: 'creative-agency',
    name: 'Agensi Kreatif & Portofolio',
    category: 'Creative',
    description: 'Desain visual berani, galeri karya, grid testimoni, dan penawaran proyek kreatif.',
    icon: 'Sparkles',
    jsonLdType: 'CreativeWork',
    samplePayload: {
      slug: 'agency',
      title: 'Studio Desain Kreatif & Rekayasa Merek',
      themeId: 'creative-agency',
      mobileNavType: 'curved',
      seo: {
        metaTitle: 'Studio Desain & Agensi Kreatif | Portofolio Merek',
        metaDescription: 'Membangun identitas visual dan pengalaman digital yang berkesan bagi merek terkemuka.',
        jsonLdType: 'CreativeWork',
      },
      blocks: [
        {
          id: 'hero_agency',
          type: 'hero-slider',
          props: {
            badge: 'Award-Winning Design Studio',
            title: 'Menghadirkan Karya Visual yang Menginspirasi Dunia',
            subtitle: 'Kolaborasi desain dan teknologi untuk menciptakan pengalaman merek tak terlupakan.',
            ctaPrimaryText: 'Lihat Portofolio',
            ctaPrimaryLink: '#features',
            ctaSecondaryText: 'Hubungi Kami',
            ctaSecondaryLink: '#contact',
            slides: [
              {
                id: 'sa1',
                imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1600',
                title: 'Estetika & Fungsionalitas',
                subtitle: 'Keseimbangan sempurna antara daya tarik visual dan kemudahan penggunaan.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'saas-startup',
    name: 'SaaS & Startup Teknologi',
    category: 'Technology',
    description: 'Fokus pada adopsi produk, tabel fitur komparatif, dan uji coba gratis.',
    icon: 'Zap',
    jsonLdType: 'SoftwareApplication',
    samplePayload: {
      slug: 'saas',
      title: 'Platform Otomasi Alur Kerja Generasi Baru',
      themeId: 'saas-startup',
      mobileNavType: 'curved',
      seo: {
        metaTitle: 'Platform Otomasi Cloud & Produktivitas Cerdas',
        metaDescription: 'Tingkatkan efisiensi tim hingga 5x lipat dengan sistem otomasi cerdas.',
        jsonLdType: 'SoftwareApplication',
      },
      blocks: [
        {
          id: 'hero_saas',
          type: 'hero-slider',
          props: {
            badge: 'Solusi Cloud Modern',
            title: 'Sederhanakan Alur Kerja Tim Anda dalam Satu Platform',
            subtitle: 'Otomatisasikan tugas rutin dan tingkatkan kolaborasi antar divisi secara instan.',
            ctaPrimaryText: 'Uji Coba Gratis',
            ctaPrimaryLink: '#pricing',
            slides: [
              {
                id: 'ss1',
                imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600',
                title: 'Produktivitas Tanpa Batas',
                subtitle: 'Kemudahan kolaborasi real-time dari perangkat apa pun.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'ecommerce-retail',
    name: 'Toko Digital & Retail Produk',
    category: 'Retail',
    description: 'Showcase produk unggulan, penawaran musiman, dan direct order WhatsApp.',
    icon: 'ShoppingBag',
    jsonLdType: 'Product',
    samplePayload: {
      slug: 'store',
      title: 'Koleksi Produk Eksklusif Berkualitas Premium',
      themeId: 'ecommerce-retail',
      mobileNavType: 'curved',
      seo: {
        metaTitle: 'Toko Produk Resmi | Koleksi Eksklusif & Promo',
        metaDescription: 'Belanja produk resmi dengan garansi keaslian dan layanan pengiriman cepat ke seluruh Indonesia.',
        jsonLdType: 'Product',
      },
      blocks: [
        {
          id: 'hero_store',
          type: 'hero-slider',
          props: {
            badge: 'Koleksi Musim 2026',
            title: 'Kualitas Premium untuk Kebutuhan Sehari-hari Anda',
            subtitle: 'Dapatkan diskon khusus hingga 30% untuk pemesanan hari ini.',
            ctaPrimaryText: 'Belanja Sekarang',
            ctaPrimaryLink: '#pricing',
            slides: [
              {
                id: 'st1',
                imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600',
                title: 'Pilihan Terbaik untuk Anda',
                subtitle: 'Koleksi terkurasi dengan standar kenyamanan dan ketahanan tinggi.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'blog-media',
    name: 'Blog Publikasi & Media Informasi',
    category: 'Media',
    description: 'Grid artikel informatif, pembaca artikel modal/halaman khusus, dan kategori berita.',
    icon: 'BookOpen',
    jsonLdType: 'NewsArticle',
    samplePayload: {
      slug: 'blog',
      title: 'Portal Berita, Edukasi & Wawasan Terkini',
      themeId: 'blog-media',
      mobileNavType: 'curved',
      seo: {
        metaTitle: 'Portal Berita & Wawasan Terpercaya | Ultra CMS',
        metaDescription: 'Kumpulan artikel mendalam, opini terkurasi, dan analisis perkembangan industri.',
        jsonLdType: 'NewsArticle',
      },
      blocks: [
        {
          id: 'hero_blog',
          type: 'hero-slider',
          props: {
            badge: 'Edisi Wawasan Mingguan',
            title: 'Eksplorasi Ide dan Analisis Mendalam Dunia Digital',
            subtitle: 'Artikel terkurasi dari para praktisi dan pemikir industri.',
            ctaPrimaryText: 'Baca Artikel Terbaru',
            ctaPrimaryLink: '#articles',
            slides: [
              {
                id: 'bl1',
                imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600',
                title: 'Wawasan Terkini & Terpercaya',
                subtitle: 'Temukan inspirasi dan pengetahuan baru setiap hari.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'theme-car-rental-prime',
    name: 'Sewa & Rental Mobil Pro (DriveMotion Prime)',
    category: 'Rental & Transportasi',
    description: 'Landing page sewa mobil dengan katalog armada lengkap, filter transmisi matic/manual, komparasi lepas kunci vs sopir, dan booking WhatsApp instan.',
    icon: 'Car',
    jsonLdType: 'AutoRental',
    samplePayload: {
      slug: 'rental-mobil',
      title: 'Rental Mobil & Transportasi VIP Terpercaya',
      themeId: 'oceanwp-store',
      mobileNavType: 'curved',
      seo: {
        metaTitle: 'Sewa Mobil Murah & Lepas Kunci 24 Jam | Rental Terpercaya',
        metaDescription: 'Pusat sewa mobil terlengkap dengan supir berpengalaman atau lepas kunci. Pilihan unit Alphard, Innova Zenix, Fortuner, Xpander, dan HiAce bersih terawat.',
        jsonLdType: 'AutoRental',
      },
      blocks: [
        {
          id: 'hero_rental',
          type: 'hero-slider',
          props: {
            badge: 'Rental Mobil Resmi & Bergaransi',
            title: 'Perjalanan Nyaman & Aman dengan Armada Terbaik',
            subtitle: 'Unit terbaru, kabin harum higienis, supir ramah berpengalaman, dan siap melayani rute dalam maupun luar kota 24 jam nonstop.',
            ctaPrimaryText: 'Pilih Armada Mobil',
            ctaPrimaryLink: '#fleet',
            ctaSecondaryText: 'Reservasi WhatsApp 24 Jam',
            ctaSecondaryLink: 'https://wa.me/6281234567890',
            slides: [
              {
                id: 'sr1',
                imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600',
                title: 'Armada Bersih, Nyaman, dan Selalu Terawat',
                subtitle: 'Pilihan unit terlengkap untuk kebutuhan perjalanan dinas, keluarga, maupun wisata.',
              },
            ],
          },
        },
        {
          id: 'features_rental',
          type: 'features',
          props: {
            badge: 'Standar Pelayanan Prima',
            title: 'Mengapa Memilih Layanan Rental Kami?',
            subtitle: 'Komitmen kami pada kebersihan unit, ketepatan waktu, dan kenyamanan perjalanan Anda.',
            items: [
              { title: 'Unit Bersih & Higienis', desc: 'Desinfeksi kabin berkala dan perawatan mesin rutin di bengkel resmi.', icon: 'shield-check' },
              { title: 'Supir Ramah & Hafal Rute', desc: 'Driver profesional bersertifikat, sopan, dan memahami jalur tercepat.', icon: 'award' },
              { title: 'Bebas Antar-Jemput', desc: 'Pengantaran tepat waktu di lobi bandara, stasiun, hotel, maupun rumah Anda.', icon: 'clock' },
              { title: 'Asuransi Perjalanan', desc: 'Proteksi all-risk lengkap untuk ketenangan seluruh penumpang.', icon: 'zap' },
            ],
          },
        },
        {
          id: 'catalog_rental',
          type: 'fleet-catalog',
          props: {
            badge: 'Katalog Armada Kami',
            title: 'Pilihan Unit Mobil Terpopuler',
            subtitle: 'Pilih unit yang sesuai dengan preferensi, kapasitas penumpang, dan rute perjalanan Anda.',
            catalogType: 'rental',
          },
        },
        {
          id: 'pricing_rental',
          type: 'pricing',
          props: {
            badge: 'Paket Sewa',
            title: 'Tarif Transparan Tanpa Biaya Tersembunyi',
            subtitle: 'Fleksibilitas sewa lepas kunci maupun all-in dengan supir ramah.',
            plans: [
              {
                name: 'Lepas Kunci 24 Jam',
                price: 'Rp 450.000',
                period: '/hari',
                description: 'Kebebasan mengemudi mandiri dengan verifikasi syarat mudah dan cepat.',
                highlight: false,
                features: ['Durasi Penuh 24 Jam', 'Bebas Kilometer Dalam Kota', 'Layanan Darurat 24 Jam', 'Unit Bersih & BBM Awal Penuh'],
                buttonText: 'Sewa Lepas Kunci',
              },
              {
                name: 'All-In Eksekutif (12 Jam)',
                price: 'Rp 850.000',
                period: '/12 jam',
                description: 'Paling diminati! Sudah termasuk mobil, supir berpengalaman, dan BBM.',
                highlight: true,
                features: ['Mobil + Supir + BBM', 'Durasi Layanan 12 Jam', 'Penjemputan Tepat Waktu', 'Air Mineral Gratis', 'Bebas Antar Bandara'],
                buttonText: 'Pilih All-In Eksekutif',
              },
              {
                name: 'VIP Protocol Service',
                price: 'Rp 2.500.000',
                period: '/hari',
                description: 'Layanan armada Alphard untuk tamu VVIP, kedinasan, dan pernikahan.',
                highlight: false,
                features: ['Toyota Alphard Transformer', 'Supir Berpakaian Jas Rapi', 'Protokol Khusus VIP', 'Jalur Cepat Terminal Bandara'],
                buttonText: 'Pesan VIP Protocol',
              },
            ],
          },
        },
        {
          id: 'cta_rental',
          type: 'cta',
          props: {
            badge: 'Reservasi Cepat',
            title: 'Siap Berangkat? Amankan Unit Mobil Anda Sekarang!',
            subtitle: 'Ketersediaan armada terbatas terutama pada akhir pekan dan musim liburan.',
            buttonText: 'Hubungi Admin via WhatsApp',
            buttonLink: 'https://wa.me/6281234567890',
          },
        },
      ],
    },
  },
];
