/**
 * themePresets.js
 * Comprehensive ready-to-use block presets for all 12 WordPress themes.
 * Eliminates all dark blue / dark styles in favor of pure, crisp Light themes.
 */

export function getIndustryDefaultTheme(industryId) {
  switch (industryId) {
    case 'ecommerce':
      return 'astra-clean';
    case 'digital':
      return 'generatepress-corp';
    case 'agency':
      return 'kadence-pro';
    case 'saas':
      return 'neve-startup';
    case 'rental':
    case 'car_rental':
      return 'oceanwp-store';
    case 'custom':
    default:
      return 'twenty-twenty-five';
  }
}

export function getThemePresetData(themeId) {
  switch (themeId) {
    case 'twenty-twenty-five':
      return {
        title: 'The Chronicle & Essays - Jurnal Editorial Modern',
        header: {
          brandName: 'The Chronicle & Essays',
          brandTagline: 'Editorial Gutenberg Edition',
          phone: '0812-3456-7890',
          whatsappNumber: '6281234567890',
          navLinks: [
            { label: 'Berita Utama', href: '#features' },
            { label: 'Esai Budaya', href: '#articles' },
            { label: 'Kolom Opini', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Kontak', href: '/?contact=true' },
          ],
        },
        footer: {
          brandName: 'The Chronicle & Essays',
          description: 'Publikasi editorial digital independen yang menyajikan esai mendalam, wawasan teknologi, dan kajian budaya kontemporer.',
          address: 'Jl. Raden Saleh No. 12, Menteng, Jakarta Pusat',
          phone: '0812-3456-7890',
          email: 'redaksi@thechronicle.id',
          copyright: `© ${new Date().getFullYear()} The Chronicle & Essays. Diterbitkan dengan standar Gutenberg WordPress 6.7.`,
        },
        blocks: [
          {
            id: 'hero_editorial',
            type: 'hero-slider',
            props: {
              badge: 'Tema Resmi Twenty Twenty-Five • Siap Pakai',
              title: 'Masa Depan Tipografi Digital & Jurnalisme Modern',
              subtitle: 'Menghadirkan ketenangan bagi pembaca dengan ruang lapang, tipografi terstruktur, dan pemuatan artikel berkecepatan tinggi.',
              ctaPrimaryText: 'Mulai Membaca Esai',
              ctaPrimaryLink: '#articles',
              ctaSecondaryText: 'Hubungi Redaksi',
              ctaSecondaryLink: '/?contact=true',
              slides: [
                {
                  id: 's1',
                  badge: 'Edisi Khusus • WordPress 6.7',
                  title: 'Masa Depan Tipografi Digital & Jurnalisme Modern',
                  subtitle: 'Menghadirkan ketenangan bagi pembaca dengan ruang lapang, tipografi terstruktur, dan pemuatan artikel berkecepatan tinggi.',
                  imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600',
                },
              ],
            },
          },
          {
            id: 'features_editorial',
            type: 'features',
            props: {
              badge: 'Pilar Jurnalisme Kami',
              title: 'Komitmen pada Kejernihan & Kualitas Informasi',
              subtitle: 'Setiap artikel disusun melalui riset mendalam dan standar penyuntingan profesional.',
              items: [
                { icon: 'shield-check', title: 'Riset Terverifikasi', desc: 'Fakta dan data yang disajikan melalui proses konfirmasi independen.' },
                { icon: 'zap', title: 'Loading Cepat Tanpa Iklan', desc: 'Pengalaman membaca nyaman tanpa gangguan banner berkedip atau pop-up.' },
                { icon: 'award', title: 'Penulis Berpengalaman', desc: 'Ditulis oleh pakar industri, jurnalis senior, dan akademisi kredibel.' },
                { icon: 'clock', title: 'Kurasi Rutin Mingguan', desc: 'Rangkuman artikel esensial dikirimkan setiap pekan langsung ke inbox Anda.' },
              ],
            },
          },
          {
            id: 'articles_editorial',
            type: 'articles',
            props: {
              badge: 'Arsip Tulisan Terkini',
              title: 'Esai & Laporan Mendalam Minggu Ini',
              subtitle: 'Kumpulan pemikiran terbaik seputar desain, teknologi cerdas, dan perkembangan sosial masyarakat.',
            },
          },
          {
            id: 'testimonials_editorial',
            type: 'testimonials',
            props: {
              badge: 'Apresiasi Pembaca',
              title: 'Apa Kata Para Penulis & Akademisi?',
              subtitle: 'Tanggapan dari komunitas pembaca setia kami.',
              reviews: [
                {
                  name: 'Dr. Adrian Maulana',
                  role: 'Dosen Komunikasi Digital',
                  rating: 5,
                  comment: 'Tata letak Twenty Twenty-Five memberikan ruang bernapas yang sangat dibutuhkan dalam membaca analisis panjang. Sangat elegan.',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                },
                {
                  name: 'Siti Rahmawati',
                  role: 'Peneliti Sosial Budaya',
                  rating: 5,
                  comment: 'Kombinasi tipografi yang tajam dan kontras warna yang ramah di mata membuat sesi membaca menjadi pengalaman yang menenangkan.',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
                },
                {
                  name: 'Budi Santoso',
                  role: 'Pemimpin Redaksi Media',
                  rating: 5,
                  comment: 'Salah satu implementasi tema WordPress paling bersih dan fokus pada esensi konten yang pernah saya gunakan.',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                },
              ],
            },
          },
          {
            id: 'faq_editorial',
            type: 'faq',
            props: {
              badge: 'Panduan Pembaca',
              title: 'Pertanyaan Seputar Redaksi & Penerbitan',
              subtitle: 'Ketahui tata cara pengiriman naskah, hak cipta tulisan, dan langganan buletin.',
              faqs: [
                {
                  q: 'Bagaimana cara mengirimkan naskah esai opini ke redaksi?',
                  a: 'Anda dapat mengirimkan draf tulisan Anda dengan panjang 800 - 1500 kata melalui halaman kontak atau email resmi redaksi. Tim editor akan meninjau dalam 3 hari kerja.',
                },
                {
                  q: 'Apakah tulisan di situs ini bebas diakses tanpa paywall?',
                  a: 'Ya, seluruh artikel kami dapat diakses publik secara gratis untuk mendukung penyebaran pengetahuan terbuka yang berkualitas.',
                },
                {
                  q: 'Bagaimana standar penulisan dan sitasi yang digunakan?',
                  a: 'Kami mengadopsi standar penulisan jurnalistik berimbang dengan rujukan sumber data primer yang dapat diverifikasi oleh pembaca.',
                },
              ],
            },
          },
          {
            id: 'cta_editorial',
            type: 'cta',
            props: {
              badge: 'Tetap Terhubung',
              title: 'Dapatkan Esai Pilihan Langsung di Perangkat Anda',
              subtitle: 'Bergabunglah dengan ribuan pembaca setia untuk menerima rangkuman artikel terkurasi setiap pekan.',
              buttonText: 'Hubungi Redaksi via WhatsApp',
              buttonLink: 'https://wa.me/6281234567890',
            },
          },
        ],
      };

    case 'twenty-twenty-four':
      return {
        title: 'Nexus Enterprise Global - Solusi Transformasi Bisnis',
        header: {
          brandName: 'Nexus Corp Global',
          brandTagline: 'Enterprise Solutions',
          phone: '0812-3456-7890',
          whatsappNumber: '6281234567890',
          navLinks: [
            { label: 'Solusi', href: '#features' },
            { label: 'Layanan', href: '#fleet' },
            { label: 'Paket Bisnis', href: '#pricing' },
            { label: 'Klien', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' },
          ],
        },
        footer: {
          brandName: 'Nexus Corp Global',
          description: 'Mitra transformasi digital terpercaya untuk korporasi dan institusi skala global dengan jaminan SLA 99.99%.',
          address: 'Gedung Menara Mandiri Lt. 32, Jl. Jend. Sudirman Kav. 54, Jakarta',
          phone: '0812-3456-7890',
          email: 'corporate@nexusglobal.com',
          copyright: `© ${new Date().getFullYear()} Nexus Corp Global. All rights reserved.`,
        },
        blocks: [
          {
            id: 'hero_corp',
            type: 'hero-slider',
            props: {
              badge: 'Tema Resmi Twenty Twenty-Four • Korporat & Bisnis',
              title: 'Transformasi Digital Terpadu untuk Korporasi Global',
              subtitle: 'Membangun infrastruktur cloud yang tangguh, aman, dan siap mengakselerasi pertumbuhan operasional bisnis Anda.',
              ctaPrimaryText: 'Jadwalkan Konsultasi',
              ctaPrimaryLink: '#pricing',
              ctaSecondaryText: 'Profil Perusahaan',
              ctaSecondaryLink: '/?contact=true',
              slides: [
                {
                  id: 's1',
                  badge: 'ISO 27001 Certified Enterprise',
                  title: 'Transformasi Digital Terpadu untuk Korporasi Global',
                  subtitle: 'Membangun infrastruktur cloud yang tangguh, aman, dan siap mengakselerasi pertumbuhan operasional bisnis Anda.',
                  imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600',
                },
              ],
            },
          },
          {
            id: 'features_corp',
            type: 'features',
            props: {
              badge: 'Kapabilitas Enterprise',
              title: 'Keunggulan Operasional Skala Korporat',
              subtitle: 'Solusi berstandar perbankan dan industri yang teruji mengelola jutaan transaksi setiap hari.',
              items: [
                { icon: 'shield-check', title: 'Keamanan Zero-Trust', desc: 'Enkripsi end-to-end dengan kepatuhan standar ISO 27001 dan GDPR.' },
                { icon: 'zap', title: 'Uptime SLA 99.99%', desc: 'Infrastruktur cloud multi-region yang menjamin layanan selalu aktif tanpa henti.' },
                { icon: 'award', title: 'Arsitektur Skalabel', desc: 'Mampu menangani lonjakan beban trafik secara otomatis dengan auto-scaling.' },
                { icon: 'clock', title: 'Dukungan Dedicated 24/7', desc: 'Tim insinyur dan technical account manager siap membantu setiap saat.' },
              ],
            },
          },
          {
            id: 'services_corp',
            type: 'fleet-catalog',
            props: {
              badge: 'Layanan Utama',
              title: 'Portofolio Solusi Digital Korporat',
              subtitle: 'Pilih modul layanan yang tepat untuk mendukung transformasi sistem perusahaan Anda.',
            },
          },
          {
            id: 'pricing_corp',
            type: 'pricing',
            props: {
              badge: 'Skema Kerjasama',
              title: 'Paket Investasi Teknologi Transparan',
              subtitle: 'Pilihan tier lisensi dan implementasi yang dapat disesuaikan dengan skala organisasi Anda.',
              plans: [
                {
                  name: 'Business Starter',
                  price: 'Rp 1.499.000',
                  period: '/bulan',
                  description: 'Ideal untuk perusahaan berkembang yang memerlukan sistem terstruktur.',
                  highlight: false,
                  features: ['Hingga 50 Pengguna Aktif', 'Cloud Backup Harian', 'Dukungan Email & Tiket', 'SLA Uptime 99.9%'],
                  buttonText: 'Pilih Paket Starter',
                },
                {
                  name: 'Corporate Enterprise',
                  price: 'Rp 4.999.000',
                  period: '/bulan',
                  description: 'Paket terpopuler untuk korporasi dengan kebutuhan operasional tinggi.',
                  highlight: true,
                  features: ['Pengguna Tanpa Batas', 'Dedicated Server Manager', 'SLA Uptime 99.99%', 'Audit Keamanan Berkala', 'Integrasi API Custom'],
                  buttonText: 'Pilih Corporate Pro',
                },
                {
                  name: 'Custom Infrastructure',
                  price: 'Hubungi Sales',
                  period: '',
                  description: 'Arsitektur khusus sesuai regulasi industri keuangan dan perbankan.',
                  highlight: false,
                  features: ['On-Premises / Private Cloud', 'Disaster Recovery Plan', '24/7 War Room Support', 'Audit Kepatuhan Menyeluruh'],
                  buttonText: 'Konsultasi Tim Ahli',
                },
              ],
            },
          },
          {
            id: 'testimonials_corp',
            type: 'testimonials',
            props: {
              badge: 'Testimoni Mitra',
              title: 'Kepercayaan dari Para Pemimpin Industri',
              subtitle: 'Lebih dari 500 korporasi telah mengandalkan sistem kami untuk operasional harian.',
              reviews: [
                {
                  name: 'Hendrawan Pratama',
                  role: 'Chief Technology Officer - FinTech Global',
                  rating: 5,
                  comment: 'Migrasi ke platform Twenty Twenty-Four menghemat biaya infrastruktur kami hingga 40% dengan performa yang jauh lebih stabil.',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
                },
                {
                  name: 'Maya Kusuma',
                  role: 'VP Operations - Logistik Nusantara',
                  rating: 5,
                  comment: 'Kecepatan respon tim teknis sangat luar biasa. Sistem kami berjalan lancar tanpa kendala meski di masa peak season.',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
                },
                {
                  name: 'Rian Setyadi',
                  role: 'Director of Security - Mandiri Solusi',
                  rating: 5,
                  comment: 'Standar audit dan kepatuhan keamanan yang diterapkan memenuhi seluruh persyaratan compliance regulator perbankan.',
                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                },
              ],
            },
          },
          {
            id: 'faq_corp',
            type: 'faq',
            props: {
              badge: 'Kepatuhan & Implementasi',
              title: 'Informasi Teknis Seputar Layanan Korporat',
              subtitle: 'Detail tata kelola data, waktu deployment, dan garansi SLA sistem.',
              faqs: [
                {
                  q: 'Berapa lama estimasi waktu implementasi untuk skala korporat?',
                  a: 'Implementasi standar memakan waktu 2 hingga 4 minggu, mencakup migrasi data, uji penetrasi keamanan, dan pelatihan staf operasional.',
                },
                {
                  q: 'Apakah data kami dijamin aman dan tersimpan di server lokal Indonesia?',
                  a: 'Ya, seluruh data disimpan di pusat data Tier-4 lokal di Jakarta dengan replikasi cadangan otomatis sesuai regulasi perlindungan data pribadi.',
                },
                {
                  q: 'Bagaimana skema pembayaran dan penagihan korporat?',
                  a: 'Kami menerima pembayaran melalui faktur korporat dengan term payment 30 hari (TOP 30) serta penerbitan faktur pajak resmi.',
                },
              ],
            },
          },
          {
            id: 'cta_corp',
            type: 'cta',
            props: {
              badge: 'Jadwalkan Pertemuan',
              title: 'Siap Mengakselerasi Pertumbuhan Bisnis Anda?',
              subtitle: 'Hubungi business consultant kami untuk demonstrasi privat dan penawaran proposal solusi.',
              buttonText: 'Hubungi Tim Konsultan via WhatsApp',
              buttonLink: 'https://wa.me/6281234567890',
            },
          },
        ],
      };

    case 'theme-car-rental-prime':
    case 'oceanwp-store':
      return {
        title: 'Samudera VIP Rental - Sewa Mobil & Transportasi Eksekutif',
        header: {
          brandName: 'Samudera VIP Transport',
          brandTagline: 'Layanan Rental Mobil Mewah 24 Jam',
          phone: '0812-3456-7890',
          whatsappNumber: '6281234567890',
          navLinks: [
            { label: 'Pilihan Armada', href: '#fleet' },
            { label: 'Keunggulan', href: '#features' },
            { label: 'Paket Sewa', href: '#pricing' },
            { label: 'Testimoni', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' },
          ],
        },
        footer: {
          brandName: 'Samudera VIP Transport',
          description: 'Pusat sewa mobil terpercaya dengan supir berpengalaman, armada bersih terawat, dan layanan antar jemput bandara 24 jam nonstop.',
          address: 'Kawasan Bandara Soekarno Hatta Terminal 3 & Jl. TB Simatupang, Jakarta',
          phone: '0812-3456-7890',
          email: 'booking@samuderarental.com',
          copyright: `© ${new Date().getFullYear()} Samudera VIP Transport. Powered by OceanWP Theme.`,
        },
        blocks: [
          {
            id: 'hero_ocean',
            type: 'hero-slider',
            props: {
              badge: 'Tema Resmi OceanWP • Rental Kendaraan VIP',
              title: 'Perjalanan Nyaman & Elegan dengan Armada Terbaik',
              subtitle: 'Unit terbaru, interior wangi bersih mewah, supir ramah berpengalaman, dan siap melayani rute dalam maupun luar kota kapan saja.',
              ctaPrimaryText: 'Pilih Armada Mobil',
              ctaPrimaryLink: '#fleet',
              ctaSecondaryText: 'Reservasi WhatsApp 24 Jam',
              ctaSecondaryLink: 'https://wa.me/6281234567890',
              slides: [
                {
                  id: 's1',
                  badge: 'Unit Terawat • Siap Berangkat',
                  title: 'Perjalanan Nyaman & Elegan dengan Armada Terbaik',
                  subtitle: 'Unit terbaru, interior wangi bersih mewah, supir ramah berpengalaman, dan siap melayani rute dalam maupun luar kota kapan saja.',
                  imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600',
                },
              ],
            },
          },
          {
            id: 'features_ocean',
            type: 'features',
            props: {
              badge: 'Standar Pelayanan VIP',
              title: 'Keunggulan Rental Bersama Samudera Transport',
              subtitle: 'Fokus pada kenyamanan, keselamatan, dan ketepatan waktu penjemputan Anda.',
              items: [
                { icon: 'shield-check', title: 'Unit Bersih & Terawat', desc: 'Perawatan berkala di bengkel resmi dan desinfeksi kabin sebelum keberangkatan.' },
                { icon: 'zap', title: 'Supir Ramah Berpengalaman', desc: 'Mengenal rute tercepat dan terlatih melayani tamu VIP dengan sopan santun.' },
                { icon: 'award', title: 'Asuransi All-Risk Termasuk', desc: 'Perjalanan Anda dilindungi proteksi asuransi menyeluruh tanpa rasa khawatir.' },
                { icon: 'clock', title: 'Bebas Antar-Jemput Bandara', desc: 'Layanan tepat waktu di Terminal Bandara atau langsung ke lobi hotel Anda.' },
              ],
            },
          },
          {
            id: 'catalog_ocean',
            type: 'fleet-catalog',
            props: {
              badge: 'Pilihan Kendaraan',
              title: 'Daftar Armada Rental Paling Populer',
              subtitle: 'Pilih unit sesuai kebutuhan perjalanan keluarga, wisata, maupun kunjungan bisnis.',
              catalogType: 'rental',
              vehicles: [
                {
                  id: 'v1',
                  name: 'Toyota Alphard Transformer VIP',
                  brand: 'Toyota',
                  category: 'SUV / Premium',
                  pricePerDay: 'Rp 2.500.000',
                  priceDriver: 'Rp 2.800.000',
                  year: '2025',
                  transmission: 'Matic',
                  fuel: 'Bensin',
                  capacity: '6 Kursi VIP',
                  luggage: '4 Koper',
                  rating: 5.0,
                  reviewsCount: 180,
                  image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
                  highlight: 'Tamu VIP',
                  description: 'Kenyamanan kelas eksekutif dengan kabin senyap, captain seat mewah, dan privasi maksimal.',
                },
                {
                  id: 'v2',
                  name: 'Toyota Innova Zenix Hybrid',
                  brand: 'Toyota',
                  category: 'MPV Keluarga',
                  pricePerDay: 'Rp 750.000',
                  priceDriver: 'Rp 950.000',
                  year: '2025',
                  transmission: 'Matic',
                  fuel: 'Hybrid Irit',
                  capacity: '7 Kursi',
                  luggage: '3 Koper',
                  rating: 4.9,
                  reviewsCount: 142,
                  highlight: 'Paling Laris',
                  image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
                  description: 'Pilihan favorit keluarga Indonesia. Kabin lega, AC sejuk dobel blower, dan konsumsi BBM sangat irit.',
                },
                {
                  id: 'v3',
                  name: 'Toyota Fortuner 2.8 GR Sport',
                  brand: 'Toyota',
                  category: 'SUV / Premium',
                  pricePerDay: 'Rp 1.200.000',
                  priceDriver: 'Rp 1.450.000',
                  year: '2025',
                  transmission: 'Matic',
                  fuel: 'Diesel Turbo',
                  capacity: '7 Kursi',
                  luggage: '4 Koper',
                  rating: 4.9,
                  reviewsCount: 95,
                  highlight: 'Gagah & Kuat',
                  image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
                  description: 'SUV tangguh bertenaga tinggi untuk perjalanan dinas, proyek, atau liburan keluarga segala medan.',
                },
                {
                  id: 'v4',
                  name: 'Mitsubishi Xpander Ultimate',
                  brand: 'Mitsubishi',
                  category: 'MPV Keluarga',
                  pricePerDay: 'Rp 450.000',
                  priceDriver: 'Rp 700.000',
                  year: '2025',
                  transmission: 'Matic',
                  fuel: 'Bensin Irit',
                  capacity: '7 Kursi',
                  luggage: '3 Koper',
                  rating: 4.9,
                  reviewsCount: 168,
                  highlight: 'Best Value',
                  image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
                  description: 'Kombinasi kenyamanan MPV dan ketangguhan SUV dengan efisiensi konsumsi BBM prima.',
                },
                {
                  id: 'v5',
                  name: 'Toyota HiAce Premio Luxury',
                  brand: 'Toyota',
                  category: 'Minibus',
                  pricePerDay: 'Rp 1.500.000',
                  priceDriver: 'Rp 1.800.000',
                  year: '2025',
                  transmission: 'Manual',
                  fuel: 'Diesel Turbo',
                  capacity: '10 Kursi',
                  luggage: '6 Koper',
                  rating: 4.9,
                  reviewsCount: 78,
                  highlight: 'Rombongan VIP',
                  image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
                  description: 'Kapasitas besar dengan kenyamanan VIP untuk rombongan keluarga besar atau delegasi kantor.',
                },
                {
                  id: 'v6',
                  name: 'Honda Brio RS Urban',
                  brand: 'Honda',
                  category: 'City Car',
                  pricePerDay: 'Rp 350.000',
                  priceDriver: 'Rp 550.000',
                  year: '2025',
                  transmission: 'Matic',
                  fuel: 'Bensin Hemat',
                  capacity: '5 Kursi',
                  luggage: '2 Koper',
                  rating: 4.8,
                  reviewsCount: 110,
                  highlight: 'Hemat & Gesit',
                  image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
                  description: 'City car lincah dan gesit untuk mobilitas harian dalam kota dengan kepraktisan maksimal.',
                }
              ],
            },
          },
          {
            id: 'pricing_ocean',
            type: 'pricing',
            props: {
              badge: 'Pilihan Skema Sewa',
              title: 'Tarif Sewa Transparan Tanpa Biaya Tersembunyi',
              subtitle: 'Pilihan lepas kunci atau termasuk supir profesional dan BBM.',
              plans: [
                {
                  name: 'Lepas Kunci 24 Jam',
                  price: 'Rp 450.000',
                  period: '/hari',
                  description: 'Kebebasan berkendara mandiri dengan proses verifikasi identitas cepat.',
                  highlight: false,
                  features: ['Durasi Penuh 24 Jam', 'Bebas Kilometer Dalam Kota', 'Bantuan Darurat 24/7'],
                  buttonText: 'Sewa Lepas Kunci',
                },
                {
                  name: 'All-In Executive',
                  price: 'Rp 850.000',
                  period: '/12 jam',
                  description: 'Paling diminati! Sudah termasuk mobil, supir profesional, dan BBM.',
                  highlight: true,
                  features: ['Mobil + Supir + BBM', 'Durasi 12 Jam Layanan', 'Penjemputan Tepat Waktu', 'Air Mineral Gratis'],
                  buttonText: 'Pilih All-In Executive',
                },
                {
                  name: 'VIP Protocol Service',
                  price: 'Rp 2.500.000',
                  period: '/hari',
                  description: 'Armada Alphard / Vellfire untuk tamu negara, pejabat, dan pernikahan.',
                  highlight: false,
                  features: ['Toyota Alphard Transformer', 'Supir Jas Berdasi Rapi', 'Protokol Khusus VIP', 'Jalur Cepat Bandara'],
                  buttonText: 'Pesan Protokol VIP',
                },
              ],
            },
          },
          {
            id: 'testimonials_ocean',
            type: 'testimonials',
            props: {
              badge: 'Ulasan Pelanggan',
              title: 'Pengalaman Nyata dari Para Penyewa Kami',
              subtitle: 'Dipercaya oleh keluarga, artis, wisatawan mancanegara, hingga pejabat korporat.',
              reviews: [
                {
                  name: 'Bambang Soediro',
                  role: 'Penyewa Eksekutif - Surabaya',
                  rating: 5,
                  comment: 'Armada Innova Zenix-nya luar biasa bersih dan wangi. Supirnya sangat paham jalan tikus Jakarta sehingga tidak pernah terlambat meeting.',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                },
                {
                  name: 'Dr. Natalia Wijaya',
                  role: 'Wisatawan Keluarga - Bali',
                  rating: 5,
                  comment: 'Sewa Alphard untuk liburan keluarga besar 3 hari di Bandung. Pelayanan sangat memuaskan dan anak-anak sangat nyaman.',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                },
                {
                  name: 'Fauzi Rahman',
                  role: 'Event Organizer Jakarta',
                  rating: 5,
                  comment: 'Selalu mengandalkan Samudera Transport untuk kebutuhan 15 unit mobil acara konser. Koordinasi tim sangat rapi dan tepat waktu.',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
                },
              ],
            },
          },
          {
            id: 'faq_ocean',
            type: 'faq',
            props: {
              badge: 'Ketentuan Rental',
              title: 'Syarat & Alur Pemesanan Rental Mobil',
              subtitle: 'Ketahui persyaratan sewa lepas kunci dan mekanisme pembatalan.',
              faqs: [
                {
                  q: 'Apa saja syarat untuk sewa mobil lepas kunci?',
                  a: 'Syarat lepas kunci cukup melampirkan foto KTP, SIM A aktif, dan akun media sosial atau ID karyawan untuk verifikasi cepat 15 menit.',
                },
                {
                  q: 'Apakah bisa diantar langsung ke Bandara Soekarno Hatta?',
                  a: 'Bisa sekali! Petugas kami akan mengantarkan unit mobil tepat di lobi terminal kedatangan pilihan Anda tanpa biaya tambahan.',
                },
                {
                  q: 'Bagaimana jika ingin memperpanjang masa sewa saat di perjalanan?',
                  a: 'Cukup kirimkan pesan ke admin WhatsApp kami minimal 3 jam sebelum masa sewa berakhir untuk konfirmasi ketersediaan unit.',
                },
              ],
            },
          },
          {
            id: 'cta_ocean',
            type: 'cta',
            props: {
              badge: 'Booking 24 Jam',
              title: 'Amankan Unit Mobil Pilihan Anda Hari Ini!',
              subtitle: 'Ketersediaan armada terbatas pada akhir pekan dan musim liburan. Hubungi tim kami untuk reservasi cepat.',
              buttonText: 'Pesan Mobil via WhatsApp',
              buttonLink: 'https://wa.me/6281234567890',
            },
          },
        ],
      };

    case 'kadence-pro':
      return {
        title: 'Kadence Studio - Konversi Lead Penjualan WhatsApp',
        header: {
          brandName: 'Kadence Studio',
          brandTagline: 'Tingkatkan Lead WhatsApp Bisnis Anda',
          phone: '0812-3456-7890',
          whatsappNumber: '6281234567890',
          navLinks: [
            { label: 'Keunggulan', href: '#features' },
            { label: 'Paket Strategi', href: '#pricing' },
            { label: 'Bukti Hasil', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Kontak', href: '/?contact=true' },
          ],
        },
        footer: {
          brandName: 'Kadence Studio',
          description: 'Agensi optimasi konversi digital terdepan yang membantu UMKM dan korporat melipatgandakan closing penjualan via WhatsApp.',
          address: 'Kuningan Cyber Hub Lt. 8, Jl. HR Rasuna Said, Jakarta',
          phone: '0812-3456-7890',
          email: 'growth@kadencestudio.id',
          copyright: `© ${new Date().getFullYear()} Kadence Studio. Powered by Kadence WP Theme.`,
        },
        blocks: [
          {
            id: 'hero_kadence',
            type: 'hero-slider',
            props: {
              badge: 'Tema Resmi Kadence WP • Konversi & Lead WhatsApp',
              title: 'Tingkatkan Penjualan & Lead Bisnis Anda Hingga 300%',
              subtitle: 'Desain halaman teruji A/B testing yang terintegrasi langsung ke WhatsApp bisnis Anda untuk percepatan closing penjualan.',
              ctaPrimaryText: 'Mulai Konsultasi Gratis',
              ctaPrimaryLink: '#pricing',
              ctaSecondaryText: 'Chat WhatsApp 24 Jam',
              ctaSecondaryLink: 'https://wa.me/6281234567890',
              slides: [
                {
                  id: 's1',
                  badge: 'Respons Cepat < 2 Menit',
                  title: 'Tingkatkan Penjualan & Lead Bisnis Anda Hingga 300%',
                  subtitle: 'Desain halaman teruji A/B testing yang terintegrasi langsung ke WhatsApp bisnis Anda untuk percepatan closing penjualan.',
                  imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600',
                },
              ],
            },
          },
          {
            id: 'features_kadence',
            type: 'features',
            props: {
              badge: 'Formula Konversi Teruji',
              title: 'Mengapa Landing Page Kadence Menghasilkan Lebih Banyak Order?',
              subtitle: 'Setiap elemen antarmuka dirancang untuk menghilangkan friksi dan memandu pengunjung menuju tombol order.',
              items: [
                { icon: 'zap', title: '1-Click WhatsApp Order', desc: 'Pesan terformat otomatis langsung terkirim ke customer service tanpa form panjang.' },
                { icon: 'shield-check', title: 'Struktur Copywriting Hipnotik', desc: 'Disusun dengan formula AIDA (Attention, Interest, Desire, Action) teruji konversi.' },
                { icon: 'award', title: 'Kecepatan Muat 0.4 Detik', desc: 'Pengunjung tidak kabur karena halaman lambat, meningkatkan retensi hingga 85%.' },
                { icon: 'clock', title: 'Tracking Pixel & Ads Ready', desc: 'Terintegrasi dengan Meta Pixel, TikTok Ads, dan Google Analytics 4.' },
              ],
            },
          },
          {
            id: 'pricing_kadence',
            type: 'pricing',
            props: {
              badge: 'Paket Pembuatan Page',
              title: 'Pilihan Paket Optimasi Konversi Bisnis',
              subtitle: 'Investasi sekali untuk aset digital yang menghasilkan prospek setiap hari.',
              plans: [
                {
                  name: 'Quick Lead Setup',
                  price: 'Rp 799.000',
                  period: '/sekali bayar',
                  description: 'Landing page 1 halaman fokus konversi WhatsApp untuk produk tunggal.',
                  highlight: false,
                  features: ['Desain Responsif Mobile-First', 'Integrasi Tombol WhatsApp Pintar', 'Copywriting Standar Konversi', 'Hosting Cepat 1 Tahun'],
                  buttonText: 'Pilih Quick Lead',
                },
                {
                  name: 'Funnel Scale-Up Pro',
                  price: 'Rp 1.899.000',
                  period: '/sekali bayar',
                  description: 'Paling diminati! Paket lengkap dengan riset kompetitor dan integrasi iklan.',
                  highlight: true,
                  features: ['Copywriting Riset Mendalam', 'A/B Testing 2 Varian Desain', 'Setup Meta Pixel & Google Ads', 'Konsultasi Strategi Iklan', 'Revisi Hingga Puas'],
                  buttonText: 'Pilih Funnel Pro',
                },
                {
                  name: 'Corporate Brand Suite',
                  price: 'Rp 3.499.000',
                  period: '/sekali bayar',
                  description: 'Sistem multi-halaman lengkap untuk bisnis jasa profesional dan agensi.',
                  highlight: false,
                  features: ['Multi-Page Custom Structure', 'CRM & WhatsApp API Otomatis', 'Audit SEO Organik Komplit', 'Pelatihan CS Closing Online'],
                  buttonText: 'Konsultasi Brand Suite',
                },
              ],
            },
          },
          {
            id: 'testimonials_kadence',
            type: 'testimonials',
            props: {
              badge: 'Hasil Nyata Klien',
              title: 'Pertumbuhan Omset yang Dialami Para Pemilik Bisnis',
              subtitle: 'Kisah sukses nyata dari pengguna landing page berbasis Kadence.',
              reviews: [
                {
                  name: 'Agus Setiawan',
                  role: 'Owner Brand Skincare Pria',
                  rating: 5,
                  comment: 'Sebelumnya konversi iklan boncos terus. Setelah ganti ke layout Kadence, biaya per lead turun dari Rp 25.000 jadi Rp 6.800 saja!',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                },
                {
                  name: 'Nadia Putri',
                  role: 'Founder Kursus Kue Online',
                  rating: 5,
                  comment: 'Tampilan di layar HP sangat rapi dan tombol WA melayang di bawah membuat peserta workshop langsung checkout tanpa ragu.',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
                },
                {
                  name: 'dr. Satrio Wibowo',
                  role: 'Klinik Gigi Estetik',
                  rating: 5,
                  comment: 'Jadwal reservasi pasien meningkat 4x lipat dalam sebulan pertama deployment. Investasi paling menguntungkan tahun ini.',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
                },
              ],
            },
          },
          {
            id: 'faq_kadence',
            type: 'faq',
            props: {
              badge: 'Pertanyaan Populer',
              title: 'Ketahui Mekanisme Optimasi Konversi Kami',
              subtitle: 'Informasi seputar waktu pengerjaan dan garansi performa.',
              faqs: [
                {
                  q: 'Berapa hari waktu yang dibutuhkan sampai landing page online?',
                  a: 'Pengerjaan standar memakan waktu 3 hingga 5 hari kerja, termasuk penulisan materi copywriting dan konfigurasi server.',
                },
                {
                  q: 'Apakah bisa dihubungkan ke nomor WhatsApp saya yang sudah ada?',
                  a: 'Tentu bisa! Anda bebas menggunakan nomor WhatsApp personal maupun akun WhatsApp Business centang hijau.',
                },
                {
                  q: 'Apakah saya bisa mengubah teks atau harga sendiri nantinya?',
                  a: 'Bisa sekali! CMS kami dilengkapi visual page builder drag-and-drop yang sangat mudah digunakan bahkan untuk pemula.',
                },
              ],
            },
          },
          {
            id: 'cta_kadence',
            type: 'cta',
            props: {
              badge: 'Mulai Sekarang',
              title: 'Jangan Biarkan Kompetitor Mendahului Bisnis Anda!',
              subtitle: 'Konsultasikan produk Anda bersama pakar konversi kami secara gratis hari ini.',
              buttonText: 'Konsultasi Gratis via WhatsApp',
              buttonLink: 'https://wa.me/6281234567890',
            },
          },
        ],
      };

    case 'astra-clean':
      return {
        title: 'Astra Store Pro - Marketplace & Produk Unggulan',
        header: {
          brandName: 'Astra Store Pro',
          brandTagline: 'Toko Resmi & Produk Pilihan',
          phone: '0812-3456-7890',
          whatsappNumber: '6281234567890',
          navLinks: [
            { label: 'Katalog Produk', href: '#fleet' },
            { label: 'Keunggulan', href: '#features' },
            { label: 'Paket Hemat', href: '#pricing' },
            { label: 'Ulasan Pembeli', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' },
          ],
        },
        footer: {
          brandName: 'Astra Store Pro',
          description: 'Pusat belanja produk berkualitas tinggi dengan jaminan 100% original, pengiriman kilat, dan layanan pelanggan responsif 24 jam.',
          address: 'Sentra Bisnis Grand Mall Blok A-12, Jakarta',
          phone: '0812-3456-7890',
          email: 'order@astrastore.id',
          copyright: `© ${new Date().getFullYear()} Astra Store Pro. Tema resmi Astra WordPress Multipurpose.`,
        },
        blocks: [
          {
            id: 'hero_astra',
            type: 'hero-slider',
            props: {
              badge: 'Tema Resmi Astra Pro • Siap Pakai & Cepat',
              title: 'Koleksi Produk Pilihan Terbaik untuk Gaya Hidup Modern',
              subtitle: 'Dapatkan penawaran harga spesial dengan diskon hingga 40% dan gratis ongkos kirim ke seluruh wilayah Indonesia.',
              ctaPrimaryText: 'Jelajahi Produk',
              ctaPrimaryLink: '#fleet',
              ctaSecondaryText: 'Chat WhatsApp 24 Jam',
              ctaSecondaryLink: 'https://wa.me/6281234567890',
              slides: [
                {
                  id: 's1',
                  badge: 'Flash Sale Hari Ini • Diskon s/d 40%',
                  title: 'Koleksi Produk Pilihan Terbaik untuk Gaya Hidup Modern',
                  subtitle: 'Dapatkan penawaran harga spesial dengan diskon hingga 40% dan gratis ongkos kirim ke seluruh wilayah Indonesia.',
                  imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600',
                },
              ],
            },
          },
          {
            id: 'features_astra',
            type: 'features',
            props: {
              badge: 'Garansi Belanja Aman',
              title: 'Mengapa Belanja di Astra Store Pro?',
              subtitle: 'Kami mengutamakan kepuasan, kecepatan pengiriman, dan keaslian setiap produk.',
              items: [
                { icon: 'shield-check', title: '100% Produk Original', desc: 'Seluruh barang langsung didistribusikan dari produsen resmi bergaransi.' },
                { icon: 'zap', title: 'Pengiriman Kilat 24 Jam', desc: 'Pesanan sebelum jam 15.00 dikemas dan dikirim pada hari yang sama.' },
                { icon: 'award', title: 'Garansi Tukar Baru', desc: 'Jaminan retur dan tukar unit baru tanpa ribet dalam 7 hari kerja.' },
                { icon: 'clock', title: 'Respon WhatsApp Instan', desc: 'Customer service kami siap membantu konsultasi produk 24 jam nonstop.' },
              ],
            },
          },
          {
            id: 'catalog_astra',
            type: 'fleet-catalog',
            props: {
              badge: 'Produk Terlaris',
              title: 'Katalog Produk Pilihan Minggu Ini',
              subtitle: 'Pesan mudah dengan tombol pemesanan WhatsApp instan.',
            },
          },
          {
            id: 'pricing_astra',
            type: 'pricing',
            props: {
              badge: 'Paket Hemat Bundling',
              title: 'Pilihan Paket Belanja Lebih Hemat',
              subtitle: 'Beli lebih banyak untuk mendapatkan potongan harga dan merchandise spesial.',
              plans: [
                {
                  name: 'Paket Single',
                  price: 'Rp 249.000',
                  period: '/item',
                  description: 'Satu produk pilihan dengan bonus kemasan proteksi ekstra.',
                  highlight: false,
                  features: ['1 Item Original Pilihan', 'Gratis Ongkir Pulau Jawa', 'Voucher Cashback 5%'],
                  buttonText: 'Beli Paket Single',
                },
                {
                  name: 'Paket Duo Combo',
                  price: 'Rp 459.000',
                  period: '/2 items',
                  description: 'Paling diminati! Hemat Rp 50.000 untuk pembelian sepasang.',
                  highlight: true,
                  features: ['2 Item Pilihan Bebas', 'Gratis Ongkir Se-Indonesia', 'Pouch Eksklusif Gratis', 'Voucher Cashback 10%'],
                  buttonText: 'Beli Paket Duo',
                },
                {
                  name: 'Paket Keluarga / Reseller',
                  price: 'Rp 899.000',
                  period: '/5 items',
                  description: 'Harga grosir terbaik untuk kebutuhan keluarga atau dijual kembali.',
                  highlight: false,
                  features: ['5 Item Pilihan', 'Harga Grosir Diskon 30%', 'Prioritas Pengiriman Kilat', 'Grup Komunitas Reseller'],
                  buttonText: 'Beli Paket Grosir',
                },
              ],
            },
          },
          {
            id: 'testimonials_astra',
            type: 'testimonials',
            props: {
              badge: 'Testimoni Pembeli',
              title: 'Ulasan Bintang 5 dari Pembeli Terverifikasi',
              subtitle: 'Ribuan pelanggan puas dengan kualitas barang dan kecepatan layanan kami.',
              reviews: [
                {
                  name: 'Clarissa Natalia',
                  role: 'Verified Buyer - Jakarta',
                  rating: 5,
                  comment: 'Barang sampai hanya dalam 1 hari! Kualitas bahannya luar biasa dan jahitan sangat rapi. Pasti order lagi di sini.',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
                },
                {
                  name: 'Dimas Wicaksono',
                  role: 'Verified Buyer - Surabaya',
                  rating: 5,
                  comment: 'Pelayanan via WhatsApp sangat cepat dan ramah. Saat tanya rekomendasi ukuran langsung dijawab dengan detail.',
                  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                },
                {
                  name: 'Reza Fahrezi',
                  role: 'Verified Buyer - Bandung',
                  rating: 5,
                  comment: 'Sangat puas dengan pengemasannya yang super aman menggunakan bubble wrap tebal. Barangnya 100% original.',
                  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
                },
              ],
            },
          },
          {
            id: 'faq_astra',
            type: 'faq',
            props: {
              badge: 'Informasi Belanja',
              title: 'Pertanyaan Seputar Pemesanan & Pembayaran',
              subtitle: 'Ketahui alur checkout mudah dan jaminan keamanan berbelanja.',
              faqs: [
                {
                  q: 'Bagaimana cara memesan produk di situs ini?',
                  a: 'Cukup klik tombol "Pesan via WhatsApp" pada produk yang Anda inginkan. Detail pesanan akan langsung terisi dan terhubung ke admin kami.',
                },
                {
                  q: 'Metode pembayaran apa saja yang didukung?',
                  a: 'Kami menerima transfer bank resmi (BCA, Mandiri, BNI), QRIS instan seluruh e-wallet (GoPay, OVO, ShopeePay), dan opsi COD (bayar di tempat).',
                },
                {
                  q: 'Apakah bisa melakukan penukaran barang jika ukuran tidak pas?',
                  a: 'Tentu bisa! Anda dapat melakukan penukaran ukuran dalam waktu maksimal 7 hari setelah barang diterima dengan menghubungi customer service kami.',
                },
              ],
            },
          },
          {
            id: 'cta_astra',
            type: 'cta',
            props: {
              badge: 'Promo Terbatas',
              title: 'Ambil Promo Diskon Anda Sekarang Sebelum Kehabisan!',
              subtitle: 'Stok terbatas untuk promo periode minggu ini. Chat admin kami untuk klaim voucher potongan harga.',
              buttonText: 'Order Cepat via WhatsApp',
              buttonLink: 'https://wa.me/6281234567890',
            },
          },
        ],
      };

    case 'generatepress-corp':
      return {
        title: 'DesignForge Digital - Studio Desain & Aset Grafis Eksklusif',
        header: {
          brandName: 'DesignForge Digital',
          brandTagline: 'Template UI, Ilustrasi Vektor & Aset Grafis Eksklusif',
          phone: '0812-3456-7890',
          whatsappNumber: '6281234567890',
          navLinks: [
            { label: 'Katalog Aset', href: '#fleet' },
            { label: 'Keunggulan', href: '#features' },
            { label: 'Lisensi & Harga', href: '#pricing' },
            { label: 'Ulasan Desainer', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Kontak', href: '/?contact=true' },
          ],
        },
        footer: {
          brandName: 'DesignForge Digital',
          description: 'Pusat unduh aset desain digital kelas dunia. UI kits, ilustrasi 3D, mockup presentasi, dan library komponen siap produksi untuk desainer dan tim produk.',
          address: 'Creative Tech Hub Lt. 5, Jl. Senopati No. 88, Jakarta Selatan',
          phone: '0812-3456-7890',
          email: 'support@designforge.id',
          copyright: `© ${new Date().getFullYear()} DesignForge Digital. Powered by GeneratePress Theme.`,
        },
        blocks: [
          {
            id: 'hero_gp',
            type: 'hero-slider',
            props: {
              badge: 'Tema Resmi GeneratePress • Digital Assets',
              title: 'Percepat Workflow Desain dengan UI Kit Standar Industri',
              subtitle: 'Koleksi lengkap template Figma, aset 3D siap render, dan sistem desain modular yang dirancang untuk mempercepat peluncuran produk digital Anda.',
              ctaPrimaryText: 'Jelajahi Semua Aset',
              ctaPrimaryLink: '#fleet',
              ctaSecondaryText: 'Lihat Paket Lisensi',
              ctaSecondaryLink: '#pricing',
              slides: [
                {
                  id: 's1',
                  badge: 'Figma UI Kit & Web Component Library 2026',
                  title: 'Percepat Workflow Desain dengan UI Kit Standar Industri',
                  subtitle: 'Koleksi lengkap template Figma, aset 3D siap render, dan sistem desain modular yang dirancang untuk mempercepat peluncuran produk digital Anda.',
                  imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600',
                },
              ],
            },
          },
          {
            id: 'features_gp',
            type: 'features',
            props: {
              badge: 'Standar Kualitas Aset',
              title: 'Keunggulan Menggunakan Aset DesignForge',
              subtitle: 'Dibuat dengan presisi tinggi oleh desainer produk senior dari industri global.',
              items: [
                { icon: 'shield-check', title: 'Auto-Layout & Variabel Figma', desc: '100% menggunakan fitur terbaru Figma dengan dukungan mode terang dan gelap siap pakai.' },
                { icon: 'zap', title: 'Unduh Instan Setelah Checkout', desc: 'Akses link unduhan langsung dikirim ke email dan WhatsApp Anda dalam hitungan detik.' },
                { icon: 'award', title: 'Lisensi Komersial Bebas Royalti', desc: 'Gunakan bebas untuk proyek pribadi, klien agensi, maupun startup komersial.' },
                { icon: 'clock', title: 'Update Seumur Hidup Gratis', desc: 'Dapatkan revisi dan penambahan komponen baru secara berkala tanpa biaya tambahan.' },
              ],
            },
          },
          {
            id: 'catalog_gp',
            type: 'fleet-catalog',
            props: {
              badge: 'Katalog Produk Digital',
              title: 'Aset Desain Paling Diminati',
              subtitle: 'Pilihan template dan UI Kit yang telah digunakan oleh lebih dari 5.000 tim produk.',
              catalogType: 'digital',
              items: [
                {
                  id: 'd1',
                  name: 'Nova SaaS Design System Pro',
                  brand: 'DesignForge',
                  category: 'UI Kit',
                  pricePerDay: 'Rp 499.000',
                  year: '2026',
                  transmission: 'Figma .FIG',
                  fuel: 'Lisensi Komersial',
                  capacity: '400+ Components',
                  rating: 5.0,
                  reviewsCount: 88,
                  image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Trending #1',
                  features: ['400+ Komponen Auto-Layout', 'Design Tokens & Variables', '15 Contoh Layar Siap Pakai', 'Dokumentasi Lengkap'],
                },
                {
                  id: 'd2',
                  name: '3D Isometric Tech Icon Pack',
                  brand: 'DesignForge 3D',
                  category: 'Aset 3D',
                  pricePerDay: 'Rp 199.000',
                  year: '2026',
                  transmission: 'PNG + Blender',
                  fuel: 'Resolusi 4K',
                  capacity: '80+ 3D Assets',
                  rating: 4.9,
                  reviewsCount: 65,
                  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                  highlight: 'High Res 4K',
                  features: ['80 Aset 3D Unik', 'Format PNG Transparan 4K', 'File Sumber Blender (.blend)', 'Pencahayaan Studio Siap Pakai'],
                },
                {
                  id: 'd3',
                  name: 'Fintech Mobile App Wireframe',
                  brand: 'AppFlow Studio',
                  category: 'Wireframe',
                  pricePerDay: 'Rp 299.000',
                  year: '2026',
                  transmission: 'Figma + XD',
                  fuel: 'Lisensi Tim',
                  capacity: '65 Screens',
                  rating: 4.8,
                  reviewsCount: 42,
                  image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Terlengkap',
                  features: ['65 Alur Layar Lengkap', 'User Flow Diagram Terpadu', 'Kompatibel iOS & Android', 'Mudah Dikustomisasi'],
                },
                {
                  id: 'd4',
                  name: 'Minimalist Brand Identity Mockups',
                  brand: 'Studio Print',
                  category: 'Mockup',
                  pricePerDay: 'Rp 249.000',
                  year: '2026',
                  transmission: 'Photoshop PSD',
                  fuel: 'Smart Object',
                  capacity: '18 Mockups',
                  rating: 4.9,
                  reviewsCount: 53,
                  image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Photorealistic',
                  features: ['18 Scene Mockup Realistis', 'Edit Mudah via Smart Object', 'Tekstur Kertas Alami', 'Resolusi Tajam 5000px'],
                },
                {
                  id: 'd5',
                  name: 'Executive Pitch Deck Presentation',
                  brand: 'VentureSlide',
                  category: 'Slide',
                  pricePerDay: 'Rp 179.000',
                  year: '2026',
                  transmission: 'PPTX + Figma',
                  fuel: '16:9 HD',
                  capacity: '50 Slides',
                  rating: 4.9,
                  reviewsCount: 79,
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Investor Ready',
                  features: ['50 Slide Berstandar Silicon Valley', 'Grafik & Diagram Editable', 'Format PowerPoint & Google Slides', 'Tipografi Modern Bersih'],
                },
                {
                  id: 'd6',
                  name: 'Developer Portfolio Web Template',
                  brand: 'CodeCraft',
                  category: 'Template Web',
                  pricePerDay: 'Rp 349.000',
                  year: '2026',
                  transmission: 'React + HTML5',
                  fuel: 'Tailwind CSS',
                  capacity: 'Responsive',
                  rating: 5.0,
                  reviewsCount: 91,
                  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Clean Code',
                  features: ['Kode React & Tailwind Bersih', 'Skor Lighthouse 100', 'SEO Teroptimasi', 'Deploy Instan ke Vercel/Netlify'],
                },
              ],
            },
          },
          {
            id: 'pricing_gp',
            type: 'pricing',
            props: {
              badge: 'Lisensi Fleksibel',
              title: 'Pilihan Lisensi Sesuai Kebutuhan Tim',
              subtitle: 'Investasi terbaik dengan hak cipta penggunaan komersial resmi tanpa batasan proyek.',
              plans: [
                {
                  name: 'Personal License',
                  price: 'Rp 199.000',
                  period: '/aset',
                  description: 'Ideal untuk freelancer, desainer mandiri, dan portofolio pribadi.',
                  highlight: false,
                  features: ['1 Pengguna / Desainer', '1 Proyek Pribadi atau Klien', 'File Sumber Figma Lengkap', 'Update Aset 1 Tahun'],
                  buttonText: 'Pilih Lisensi Personal',
                },
                {
                  name: 'Commercial Pro',
                  price: 'Rp 599.000',
                  period: '/bundle',
                  description: 'Paling diminati! Untuk agensi dan tim desain dengan banyak klien.',
                  highlight: true,
                  features: ['Hingga 5 Anggota Tim', 'Proyek Klien Tanpa Batas', 'Akses Semua File Sumber & 3D', 'Update Seumur Hidup Gratis', 'Prioritas Support Desain'],
                  buttonText: 'Pilih Lisensi Komersial',
                },
                {
                  name: 'Extended Enterprise',
                  price: 'Rp 1.499.000',
                  period: '/unlimited',
                  description: 'Akses penuh tanpa batas untuk korporasi, SaaS, dan studio produk.',
                  highlight: false,
                  features: ['Pengguna Tidak Terbatas', 'Distribusi dalam Produk SaaS', 'Custom Branding & Token', 'Dedicated Support Manager', 'Perjanjian Lisensi Resmi'],
                  buttonText: 'Pilih Extended License',
                },
              ],
            },
          },
          {
            id: 'testimonials_gp',
            type: 'testimonials',
            props: {
              badge: 'Ulasan Profesional',
              title: 'Apa Kata Para Desainer Produk?',
              subtitle: 'Tanggapan dari UI/UX designer, startup founder, dan art director.',
              reviews: [
                {
                  name: 'Bima Satria',
                  role: 'Lead Product Designer di FinTech Startup',
                  rating: 5,
                  comment: 'Nova UI Kit sangat terstruktur. Struktur token dan variasi autolayout-nya menghemat setidaknya 3 minggu kerja tim kami.',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
                },
                {
                  name: 'Nadia Putri',
                  role: 'Freelance UI/UX Designer',
                  rating: 5,
                  comment: 'Kualitas aset 3D-nya sangat tajam! Klien saya langsung terkesima saat presentasi landing page pertama kali.',
                  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
                },
                {
                  name: 'Fauzi Rahman',
                  role: 'Creative Director di Media Studio',
                  rating: 5,
                  comment: 'GeneratePress Theme sangat ringan dan mudah dikustomisasi. Landing page produk digital kami memuat dalam sekejap.',
                  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
                },
              ],
            },
          },
          {
            id: 'faq_gp',
            type: 'faq',
            props: {
              badge: 'FAQ Lisensi',
              title: 'Pertanyaan Seputar Download & Lisensi Aset',
              subtitle: 'Pelajari hak penggunaan dan proses pengunduhan file digital Anda.',
              faqs: [
                {
                  q: 'Format file apa saja yang akan saya dapatkan setelah checkout?',
                  a: 'Anda akan mendapatkan link unduhan langsung berisi file Figma (.fig), format PNG resolusi tinggi (4K), aset vektor SVG, serta file 3D Blender (.blend).',
                },
                {
                  q: 'Bolehkah saya menggunakan aset ini untuk proyek berbayar klien?',
                  a: 'Ya! Lisensi Commercial Pro dan Extended Enterprise membolehkan Anda menggunakan seluruh aset dalam proyek klien berbayar tanpa batasan.',
                },
                {
                  q: 'Apakah ada update jika ada versi baru Figma?',
                  a: 'Tentu. Kami rutin memperbarui file komponen saat Figma merilis pembaruan fitur, dan Anda dapat mengunduh versi terbaru secara gratis.',
                },
              ],
            },
          },
          {
            id: 'cta_gp',
            type: 'cta',
            props: {
              badge: 'Akses Lengkap All-In-One',
              title: 'Mulai Rancang Produk Hebat Anda Hari Ini',
              subtitle: 'Dapatkan seluruh koleksi UI Kit, icon pack 3D, dan template presentasi dengan harga promo khusus.',
              buttonText: 'Beli Paket Komplit via WhatsApp',
              buttonLink: 'https://wa.me/6281234567890',
            },
          },
        ],
      };

    case 'neve-startup':
      return {
        title: 'Neve Cloud App - Otomatisasi Alur Kerja & SaaS Platform',
        header: {
          brandName: 'Neve Cloud App',
          brandTagline: 'Tingkatkan Produktivitas Tim Anda dengan Otomatisasi Cerdas',
          phone: '0812-3456-7890',
          whatsappNumber: '6281234567890',
          navLinks: [
            { label: 'Fitur Cloud', href: '#features' },
            { label: 'Modul Sistem', href: '#fleet' },
            { label: 'Paket Harga', href: '#pricing' },
            { label: 'Kisah Sukses', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Demo Produk', href: '/?contact=true' },
          ],
        },
        footer: {
          brandName: 'Neve Cloud App',
          description: 'Platform orkestrasi workflow dan analitik bisnis modern berbasis cloud dengan keamanan enkripsi data enterprise dan SLA uptime 99.99%.',
          address: 'Mega Kuningan Cyber Tower 2 Lt. 18, Jakarta Selatan',
          phone: '0812-3456-7890',
          email: 'sales@nevecloud.io',
          copyright: `© ${new Date().getFullYear()} Neve Cloud App. Powered by Neve Startup Theme.`,
        },
        blocks: [
          {
            id: 'hero_neve',
            type: 'hero-slider',
            props: {
              badge: 'Tema Resmi Neve • SaaS & Startup Digital',
              title: 'Otomatisasi Alur Kerja Pintar untuk Pertumbuhan Tim Cepat',
              subtitle: 'Tingkatkan produktivitas hingga 300% dengan platform terpusat yang menghubungkan analitik data, otomatisasi tugas, dan kolaborasi tim tanpa friksi.',
              ctaPrimaryText: 'Coba Gratis 14 Hari',
              ctaPrimaryLink: '#pricing',
              ctaSecondaryText: 'Jadwalkan Live Demo',
              ctaSecondaryLink: '/?contact=true',
              slides: [
                {
                  id: 's1',
                  badge: 'Cloud Orchestration Platform 2026',
                  title: 'Otomatisasi Alur Kerja Pintar untuk Pertumbuhan Tim Cepat',
                  subtitle: 'Tingkatkan produktivitas hingga 300% dengan platform terpusat yang menghubungkan analitik data, otomatisasi tugas, dan kolaborasi tim tanpa friksi.',
                  imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600',
                },
              ],
            },
          },
          {
            id: 'features_neve',
            type: 'features',
            props: {
              badge: 'Kapabilitas Platform Cloud',
              title: 'Dirancang Khusus untuk Kebutuhan Skalabilitas',
              subtitle: 'Fitur canggih yang mempermudah tim manajemen hingga developer bekerja selaras.',
              items: [
                { icon: 'shield-check', title: 'Real-Time Data Analytics', desc: 'Pantau metrik KPI, arus pendapatan, dan performa tim melalui dashboard visual interaktif.' },
                { icon: 'zap', title: 'Otomatisasi Task Tanpa Kode', desc: 'Bangun alur kerja pintar cukup dengan drag-and-drop antar aplikasi bisnis Anda.' },
                { icon: 'award', title: '100+ Integrasi API Terbuka', desc: 'Terhubung mulus dengan Slack, Google Workspace, Stripe, WhatsApp, dan sistem internal Anda.' },
                { icon: 'clock', title: 'Enkripsi Data Bank-Grade', desc: 'Keamanan standar SOC-2 Type II dan enkripsi AES-256 untuk proteksi privasi pelanggan.' },
              ],
            },
          },
          {
            id: 'catalog_neve',
            type: 'fleet-catalog',
            props: {
              badge: 'Modul & Layanan Aplikasi',
              title: 'Modul Unggulan Neve Cloud',
              subtitle: 'Solusi terpadu yang dapat diaktifkan sesuai skala operasional bisnis Anda.',
              catalogType: 'digital',
              items: [
                {
                  id: 'm1',
                  name: 'Centralized Metrics Dashboard',
                  brand: 'Neve Core',
                  category: 'Analytics',
                  pricePerDay: 'Included',
                  year: '2026',
                  transmission: 'Cloud Web',
                  fuel: 'Real-Time Streaming',
                  capacity: 'Unlimited KPIs',
                  rating: 5.0,
                  reviewsCount: 120,
                  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Core Module',
                  features: ['Visualisasi Grafik Dinamis', 'Export PDF & Excel Otomatis', 'Filter Multi-Dimensi', 'Notifikasi Anomali AI'],
                },
                {
                  id: 'm2',
                  name: 'Workflow Visual Automation Builder',
                  brand: 'Neve Flow',
                  category: 'Automation',
                  pricePerDay: 'Included',
                  year: '2026',
                  transmission: 'No-Code Engine',
                  fuel: 'Instant Trigger',
                  capacity: '10k Executions/day',
                  rating: 4.9,
                  reviewsCount: 94,
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Most Popular',
                  features: ['Drag and Drop Trigger & Action', 'Dukungan Conditional Branching', 'Retry Logic Otomatis', 'Audit Log Eksekusi'],
                },
                {
                  id: 'm3',
                  name: 'Omni-Channel Customer Data Sync',
                  brand: 'Neve Sync',
                  category: 'Integration',
                  pricePerDay: 'Included',
                  year: '2026',
                  transmission: 'Two-Way Sync',
                  fuel: 'Sub-second Sync',
                  capacity: '500k Contacts',
                  rating: 4.9,
                  reviewsCount: 81,
                  image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
                  highlight: 'High Speed',
                  features: ['Sinkronisasi Dua Arah Instan', 'Pencegahan Data Duplikat', 'Field Mapping Fleksibel', 'Enkripsi Data At-Rest'],
                },
                {
                  id: 'm4',
                  name: 'Granular Access & Security Audit',
                  brand: 'Neve Shield',
                  category: 'Security',
                  pricePerDay: 'Enterprise',
                  year: '2026',
                  transmission: 'RBAC Policy',
                  fuel: 'SOC-2 Ready',
                  capacity: 'Role Management',
                  rating: 5.0,
                  reviewsCount: 47,
                  image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Bank Grade',
                  features: ['Single Sign-On (SAML / Okta)', 'Role-Based Access Control', 'Pencatatan Audit Trail Lengkap', 'IP Whitelisting'],
                },
                {
                  id: 'm5',
                  name: 'High-Throughput Webhook Pipeline',
                  brand: 'Neve API',
                  category: 'Developer',
                  pricePerDay: 'Included',
                  year: '2026',
                  transmission: 'REST & GraphQL',
                  fuel: '100% Uptime SLA',
                  capacity: '1M Requests/day',
                  rating: 4.8,
                  reviewsCount: 66,
                  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Dev Friendly',
                  features: ['REST API & GraphQL Endpoints', 'Webhook Event Subscriptions', 'Sandbox Testing Environment', 'Dokumentasi Interaktif'],
                },
                {
                  id: 'm6',
                  name: 'Real-Time Team Collaboration Hub',
                  brand: 'Neve Team',
                  category: 'Productivity',
                  pricePerDay: 'Included',
                  year: '2026',
                  transmission: 'Multi-User',
                  fuel: 'Instant Messaging',
                  capacity: 'Unlimited Teams',
                  rating: 4.9,
                  reviewsCount: 88,
                  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
                  highlight: 'Collaboration',
                  features: ['Shared Workspace & Catatan', 'Komentar Inline & Mention Tim', 'Integrasi Notifikasi WhatsApp', 'Riwayat Perubahan Terperinci'],
                },
              ],
            },
          },
          {
            id: 'pricing_neve',
            type: 'pricing',
            props: {
              badge: 'Investasi Terukur',
              title: 'Paket Berlangganan yang Tumbuh Bersama Anda',
              subtitle: 'Uji coba gratis 14 hari. Tidak memerlukan kartu kredit. Batalkan kapan saja.',
              plans: [
                {
                  name: 'Starter Plan',
                  price: 'Rp 149.000',
                  period: '/bulan',
                  description: 'Sempurna untuk tim kecil dan bisnis yang baru memulai otomatisasi.',
                  highlight: false,
                  features: ['Hingga 5 Anggota Tim', '1.000 Eksekusi Otomatisasi/bln', 'Dashboard Metrik Standar', 'Dukungan Komunitas & Email'],
                  buttonText: 'Mulai Uji Coba Gratis',
                },
                {
                  name: 'Growth Pro',
                  price: 'Rp 499.000',
                  period: '/bulan',
                  description: 'Paling diminati! Untuk perusahaan yang membutuhkan integrasi penuh.',
                  highlight: true,
                  features: ['Hingga 20 Anggota Tim', '50.000 Eksekusi Otomatisasi/bln', 'Akses Semua Integrasi API', 'Prioritas Customer Support 24/7', 'Analitik Prediktif AI'],
                  buttonText: 'Coba Growth Pro Gratis',
                },
                {
                  name: 'Enterprise Cloud',
                  price: 'Rp 1.999.000',
                  period: '/bulan',
                  description: 'Skalabilitas tinggi dengan kontrol keamanan mutlak dan dedicated server.',
                  highlight: false,
                  features: ['Pengguna Tidak Terbatas', 'Eksekusi Otomatisasi Unlimited', 'SLA Uptime 99.99%', 'Dedicated Account Manager', 'Keamanan SSO & Kustom Audit'],
                  buttonText: 'Hubungi Tim Enterprise',
                },
              ],
            },
          },
          {
            id: 'testimonials_neve',
            type: 'testimonials',
            props: {
              badge: 'Kisah Pelanggan',
              title: 'Dipercaya oleh Tim Berkinerja Tinggi',
              subtitle: 'Bagaimana platform kami membantu berbagai skala bisnis menghemat ribuan jam kerja.',
              reviews: [
                {
                  name: 'Raditya Pratama',
                  role: 'Head of Operations di Logistik Nasional',
                  rating: 5,
                  comment: 'Neve SaaS membantu kami mengotomatisasi alur penugasan kurir secara instan. Kesalahan input manual berkurang hingga 95%.',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                },
                {
                  name: 'Kartika Sari',
                  role: 'VP of Engineering di EdTech Platform',
                  rating: 5,
                  comment: 'Integrasi API-nya sangat mudah diimplementasikan. Dalam 2 hari seluruh sistem kami sudah tersinkronisasi tanpa hambatan.',
                  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
                },
                {
                  name: 'Farhan Setiawan',
                  role: 'Tech Lead di Digital Healthcare',
                  rating: 5,
                  comment: 'Kecepatan pemuatan dan stabilitas sistem luar biasa. Desain light-nya sangat bersih dan nyaman digunakan seharian penuh.',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                },
              ],
            },
          },
          {
            id: 'faq_neve',
            type: 'faq',
            props: {
              badge: 'Informasi Layanan',
              title: 'Pertanyaan Seputar Uji Coba & Implementasi',
              subtitle: 'Semua jawaban yang Anda butuhkan untuk memulai migrasi ke Neve Cloud.',
              faqs: [
                {
                  q: 'Bagaimana cara memulai masa uji coba 14 hari?',
                  a: 'Cukup pilih paket yang sesuai dan hubungi admin kami untuk aktivasi akun uji coba instan tanpa perlu memasukkan kartu kredit.',
                },
                {
                  q: 'Apakah data bisnis kami aman di platform ini?',
                  a: 'Sangat aman. Seluruh data dienkripsi dengan standar AES-256 baik saat transit maupun at-rest pada data center tersertifikasi ISO 27001.',
                },
                {
                  q: 'Bisakah tim kami dibantu proses migrasi data dari sistem lama?',
                  a: 'Ya, tim Customer Success kami siap mendampingi proses impor data CSV/JSON dan pengaturan alur kerja otomatisasi tanpa biaya tambahan.',
                },
              ],
            },
          },
          {
            id: 'cta_neve',
            type: 'cta',
            props: {
              badge: 'Siap Mengakselerasi Tim Anda?',
              title: 'Mulai Uji Coba Gratis 14 Hari Sekarang',
              subtitle: 'Bergabunglah bersama ribuan tim cerdas yang telah mentransformasi cara kerja mereka dengan Neve Cloud Platform.',
              buttonText: 'Aktivasi Uji Coba via WhatsApp',
              buttonLink: 'https://wa.me/6281234567890',
            },
          },
        ],
      };

    case 'storefront-shop':
      return getThemePresetData('astra-clean');

    case 'blocksy-mag':
    case 'twenty-twenty-three':
    case 'twenty-twenty-two':
    case 'twenty-twenty-one':
    default:
      return getThemePresetData('twenty-twenty-five');
  }
}

