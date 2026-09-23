/**
 * Industry Starter Catalogs for Dynamic Multi-Industry CMS
 * Automatically supplies industry-appropriate products, hero slides, and branding
 * when switching between industries.
 */

export const INDUSTRY_PRESETS = {
  automotive: {
    brandName: 'Royal Fleet Premiere',
    tagline: 'Sewa Mobil & Armada Premium Terpercaya No. 1',
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
      }
    ],
    items: [
      {
        id: 'auto-1',
        title: 'Toyota Alphard Transformer Facelift',
        category: 'Luxury MPV',
        price: 'Rp 2.500.000',
        period: '/hari',
        badge: 'Favorit VIP',
        specs: ['7 Kursi Captain Seat', 'Matic', 'Bensin', 'Driver + BBM Available'],
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'auto-2',
        title: 'Toyota Innova Zenix Hybrid',
        category: 'Family Touring',
        price: 'Rp 850.000',
        period: '/hari',
        badge: 'Paling Irit',
        specs: ['7 Kursi Nyaman', 'Matic CVT', 'Hybrid Super Irit', 'Sunroof'],
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'auto-3',
        title: 'Toyota Fortuner GR Sport 2.8',
        category: 'Premium SUV',
        price: 'Rp 1.400.000',
        period: '/hari',
        badge: 'Gagah & Bertenaga',
        specs: ['7 Kursi', 'Matic 4x2', 'Diesel Turbo 2.8L', 'Tangguh Segala Medan'],
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'auto-4',
        title: 'Toyota HiAce Premio Luxury VIP',
        category: 'Executive Van',
        price: 'Rp 1.800.000',
        period: '/hari',
        badge: 'Rombongan Elegan',
        specs: ['9 Captain Seats', 'Matic', 'Full Entertainment Audio', 'Karaoke On-Board'],
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'auto-5',
        title: 'Honda HR-V RS Turbo',
        category: 'Compact Crossover',
        price: 'Rp 650.000',
        period: '/hari',
        badge: 'Stylish City',
        specs: ['5 Kursi', 'Matic', 'Bensin Turbo', 'Panoramic Roof'],
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'auto-6',
        title: 'Hyundai Ioniq 5 Signature',
        category: 'Electric Vehicle',
        price: 'Rp 1.600.000',
        period: '/hari',
        badge: 'Zero Emission',
        specs: ['5 Kursi', 'Full Electric', 'Range 450KM', 'Fast Charging Support'],
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  ecommerce: {
    brandName: 'Aurelia Lifestyle & Store',
    tagline: 'Koleksi Fashion & Gadget Eksklusif Berkualitas Internasional',
    heroSlides: [
      {
        title: 'Koleksi Eksklusif Musim Ini - Diskon Kilat Hingga 40%',
        subtitle: 'Didesain dengan material premium terbaik, tahan lama, dan gaya kontemporer modern.',
        badge: 'New Season Arrival 2026',
        ctaText: 'Belanja Koleksi Baru',
        ctaLink: '#fleet',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80'
      },
      {
        title: 'Garansi Original 100% & Gratis Ongkir Seluruh Indonesia',
        subtitle: 'Pengiriman instan dengan proteksi paket aman dan pengembalian 30 hari tanpa syarat.',
        badge: 'Official Flagship Store',
        ctaText: 'Lihat Promo Terlaris',
        ctaLink: '#fleet',
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1920&q=80'
      }
    ],
    items: [
      {
        id: 'ecom-1',
        title: 'AeroGlide Pro Wireless Headphone',
        category: 'Audio & Gadget',
        price: 'Rp 1.899.000',
        period: '/unit',
        badge: 'Terlaris',
        specs: ['Active Noise Cancelling', 'Battery 40 Hours', 'Hi-Res Audio', 'Bluetooth 5.3'],
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'ecom-2',
        title: 'Chronos Sapphire Automatic Watch',
        category: 'Jam Tangan',
        price: 'Rp 3.450.000',
        period: '/unit',
        badge: 'Eksklusif',
        specs: ['Sapphire Glass', 'Water Resistant 100M', 'Automatic Movement', 'Leather Strap'],
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'ecom-3',
        title: 'Urban Explorer Tech Backpack',
        category: 'Aksesoris & Tas',
        price: 'Rp 750.000',
        period: '/unit',
        badge: 'Waterproof',
        specs: ['Waterproof Oxford', 'Laptop 16 Inch Slot', 'USB Charging Port', 'Ergonomic Straps'],
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'ecom-4',
        title: 'Artisan Minimalist Sneakers White',
        category: 'Sepatu & Footwear',
        price: 'Rp 1.150.000',
        period: '/pasang',
        badge: 'Favorit',
        specs: ['Genuine Italian Leather', 'Memory Foam Insole', 'Anti-Slip Outsole', 'Handmade Stitching'],
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'ecom-5',
        title: 'Lumix Mechanical Keyboard RGB',
        category: 'Audio & Gadget',
        price: 'Rp 980.000',
        period: '/unit',
        badge: 'Hot Product',
        specs: ['Gateron Yellow Switch', 'PBT Keycaps', 'Hot-Swappable', 'Tri-Mode Wireless'],
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'ecom-6',
        title: 'Nomad Merino Wool Overcoat',
        category: 'Fashion Pria',
        price: 'Rp 2.100.000',
        period: '/pcs',
        badge: 'Premium',
        specs: ['100% Merino Wool', 'Thermal Warmth', 'Classic Tailored Fit', 'Dry Clean Only'],
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  fnb: {
    brandName: 'Le Botanica Bistro & Roastery',
    tagline: 'Sajian Kuliner Artisan, Kopi Spesialti & Suasana Berkelas',
    heroSlides: [
      {
        title: 'Petualangan Rasa Kuliner Artisan & Kopi Segar Terbaik',
        subtitle: 'Bahan segar pilihan dari petani lokal, dimasak oleh koki berpengalaman bintang lima.',
        badge: 'Chef Signature Dining 2026',
        ctaText: 'Reservasi Meja Anda',
        ctaLink: '#fleet',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80'
      },
      {
        title: 'Tempat Hangat untuk Merayakan Setiap Momen Berharga',
        subtitle: 'Ruang privat, suasana nyaman dan elegan, ideal untuk makan malam romantis atau rapat bisnis.',
        badge: 'Fine Dining & Specialty Coffee',
        ctaText: 'Lihat Daftar Menu',
        ctaLink: '#fleet',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80'
      }
    ],
    items: [
      {
        id: 'fnb-1',
        title: 'Dry-Aged Australian Wagyu Striploin',
        category: 'Main Course',
        price: 'Rp 420.000',
        period: '/porsi',
        badge: 'Chef Recommended',
        specs: ['MB 7+ Wagyu', 'Truffle Mashed Potato', 'Red Wine Reduction', 'Charred Asparagus'],
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fnb-2',
        title: 'Signature Geisha Hand-Drip Coffee',
        category: 'Specialty Coffee',
        price: 'Rp 65.000',
        period: '/cup',
        badge: 'Award Winner',
        specs: ['Floral Jasmine Notes', 'Light Roast', 'V60 Pour Over', 'Single Origin Panama'],
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fnb-3',
        title: 'Truffle Carbonara Tagliolini',
        category: 'Pasta & Risotto',
        price: 'Rp 145.000',
        period: '/porsi',
        badge: 'Best Seller',
        specs: ['Handmade Fresh Pasta', 'Black Truffle Paste', 'Pecorino Romano', 'Crispy Guanciale'],
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fnb-4',
        title: 'Crispy Norwegian Salmon Steak',
        category: 'Main Course',
        price: 'Rp 185.000',
        period: '/porsi',
        badge: 'Healthy Choice',
        specs: ['Fresh Norwegian Salmon', 'Lemon Butter Sauce', 'Baby Spinach', 'Roasted Baby Potato'],
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fnb-5',
        title: 'French Almond Croissant & Butter',
        category: 'Artisan Bakery',
        price: 'Rp 45.000',
        period: '/pcs',
        badge: 'Fresh Daily',
        specs: ['Normandy French Butter', 'Almond Frangipane', 'Toasted Flaked Almond', 'Crispy Flaky Layers'],
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fnb-6',
        title: 'Classic Tiramisu al Mascarpone',
        category: 'Dessert',
        price: 'Rp 68.000',
        period: '/slice',
        badge: 'Italian Classic',
        specs: ['Savoiardi Ladyfingers', 'Espresso Soak', 'Mascarpone Cream', 'Valrhona Cocoa Powder'],
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  services: {
    brandName: 'Apex Advisory & Tech Solutions',
    tagline: 'Mitra Konsultasi Hukum, Pajak, dan Transformasi Digital Perusahaan',
    heroSlides: [
      {
        title: 'Solusi Konsultasi Bisnis & Transformasi Digital Terpadu',
        subtitle: 'Membantu lebih dari 500+ korporasi dan UKM tumbuh dengan kepatuhan hukum dan efisiensi teknologi.',
        badge: 'Enterprise Advisory Partner',
        ctaText: 'Konsultasi Gratis 30 Menit',
        ctaLink: '#fleet',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'
      }
    ],
    items: [
      {
        id: 'svc-1',
        title: 'Pendirian PT & Perizinan Usaha Lengkap',
        category: 'Legal & Kepatuhan',
        price: 'Rp 5.500.000',
        period: '/paket',
        badge: 'Proses 3 Hari',
        specs: ['Akta Notaris & SK Kemenkumham', 'NIB OSS RBA', 'NPWP & PKP Badan', 'Rekening Bank Perusahaan'],
        image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'svc-2',
        title: 'Audit Pajak & Penyusunan SPT Tahunan',
        category: 'Keuangan & Pajak',
        price: 'Rp 4.000.000',
        period: '/laporan',
        badge: 'Akuntan Resmi',
        specs: ['Rekonsiliasi Fiskal', 'Optimalisasi Tax Planning', 'Pendampingan SP2DK', 'Laporan Keuangan Standar'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'svc-3',
        title: 'Cloud DevOps & Keamanan Infrastruktur',
        category: 'Teknologi & IT',
        price: 'Rp 8.500.000',
        period: '/bulan',
        badge: 'SLA 99.99%',
        specs: ['AWS/GCP Migration', 'Docker & Kubernetes Setup', '24/7 Monitoring Alert', 'Zero-Downtime CI/CD'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'svc-4',
        title: 'Branding & Social Media Growth Engine',
        category: 'Digital Marketing',
        price: 'Rp 6.000.000',
        period: '/bulan',
        badge: 'High Engagement',
        specs: ['30 Konten Kreatif Desain/Video', 'Meta & TikTok Ads Manage', 'Copywriting Hypnotic', 'Laporan Kinerja Mingguan'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  realestate: {
    brandName: 'Grand Horizon Estates & Villas',
    tagline: 'Properti Mewah, Villa Eksklusif & Hunian Modern Terpercaya',
    heroSlides: [
      {
        title: 'Temukan Hunian Impian dan Investasi Properti Bernilai Tinggi',
        subtitle: 'Koleksi villa tepi pantai, penthouse privat, dan townhouse berdesain ramah lingkungan.',
        badge: 'Prime Location Estates 2026',
        ctaText: 'Jadwalkan Private Tour',
        ctaLink: '#fleet',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80'
      }
    ],
    items: [
      {
        id: 'prop-1',
        title: 'The Cliffside Ocean Villa Uluwatu',
        category: 'Luxury Villa',
        price: 'Rp 14.500.000.000',
        period: '/unit (SHM)',
        badge: 'Ocean View 180°',
        specs: ['4 Kamar Tidur Ensuite', 'Infinity Pool 15M', 'Full Furnished Luxury', 'Private Helipad Access'],
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prop-2',
        title: 'Skyline Penthouse SCBD Tower',
        category: 'Apartemen Mewah',
        price: 'Rp 9.800.000.000',
        period: '/unit (Strata)',
        badge: 'City Center',
        specs: ['3 Bedroom 280 m²', 'Private Elevator', 'Panoramic City View', 'Smart Home System'],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prop-3',
        title: 'Botanica Green Cluster Modern House',
        category: 'Rumah Tinggal',
        price: 'Rp 2.750.000.000',
        period: '/unit (SHM)',
        badge: 'Eco Living',
        specs: ['LT 140 m² / LB 180 m²', '3+1 Kamar Tidur', 'Solar Panel System', 'Clubhouse & Tennis Court'],
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prop-4',
        title: 'Sunset Beachfront Townhouse Canggu',
        category: 'Townhouse Investasi',
        price: 'Rp 4.200.000.000',
        period: '/unit (Leasehold 30th)',
        badge: 'ROI 14% / Th',
        specs: ['2 Kamar Tidur Nyaman', 'Plunge Pool', 'High Rental Demand', 'Management Service Inc.'],
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
};

export const getPresetForIndustry = (industryId) => {
  return INDUSTRY_PRESETS[industryId] || INDUSTRY_PRESETS.automotive;
};

export default { INDUSTRY_PRESETS, getPresetForIndustry };
