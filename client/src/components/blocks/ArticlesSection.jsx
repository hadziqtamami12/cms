import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Calendar, Clock, User, ArrowRight, X, MessageSquare, Tag } from 'lucide-react';

const DEFAULT_ARTICLES = [
  {
    id: 'art_1',
    title: '5 Tips Rental Mobil Hemat & Aman untuk Liburan Bersama Keluarga',
    category: 'Tips Sewa',
    readTime: '4 menit baca',
    date: '14 Sep 2026',
    author: 'Tim Eksekutif Fleet',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Ketahui trik memilih tipe armada yang tepat, menghemat konsumsi BBM, serta memilih paket lepas kunci vs dengan driver untuk efisiensi biaya maksimal.',
    content: `
      Liburan bersama keluarga memerlukan persiapan matang, terutama dalam hal transportasi. Berikut adalah 5 tips penting yang dapat membantu Anda menghemat biaya sewa mobil:

      1. Pilih Kapasitas Mobil yang Tepat
      Sesuaikan unit mobil dengan jumlah anggota keluarga dan jumlah koper. Untuk 4-5 orang, tipe Avanza atau Brio sudah sangat cukup. Namun jika membawa orang tua dan anak-anak, medium MPV seperti Innova Zenix memberikan kenyamanan suspensi yang jauh lebih unggul.

      2. Bandingkan Paket Lepas Kunci vs Mobil + Supir
      Jika Anda ingin privasi dan hafal rute jalan, sewa lepas kunci lebih hemat. Namun jika destinasi memiliki medan menanjak atau macet parah, menyewa supir profesional akan menghindarkan Anda dari kelelahan fisik.

      3. Pesan Jauh-Jauh Hari (Minimal H-3)
      Pemesanan mendadak di akhir pekan (weekend) atau hari libur nasional seringkali kehabisan unit tipe favorit. Reservasi lebih awal menjamin ketersediaan unit dalam kondisi paling prima.

      4. Cek Kelengkapan dan Kondisi Unit Saat Serah Terima
      Lakukan inspeksi visual bersama tim rental, pastikan ban cadangan, dongkrak, AC, dan kondisi bodi dicatat pada formulir inspeksi bersama.

      5. Manfaatkan Promo Paket Mingguan
      Banyak layanan rental menawarkan diskon hingga 20% untuk durasi sewa di atas 3 hari atau 1 minggu penuh.
    `
  },
  {
    id: 'art_2',
    title: 'Panduan Lengkap Syarat Sewa Mobil Lepas Kunci Tanpa Ribet',
    category: 'Panduan Wisata',
    readTime: '3 menit baca',
    date: '10 Sep 2026',
    author: 'Admin Operasional',
    imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Daftar dokumen persyaratan identitas, alur verifikasi data cepat 15 menit, dan mekanisme pengembalian deposit garansi secara transparan.',
    content: `
      Sewa mobil lepas kunci memberikan kebebasan berkendara tanpa batas. Berikut adalah dokumen yang diperlukan:

      Persyaratan Utama:
      • E-KTP asli yang masih berlaku
      • SIM A aktif
      • Bukti identitas penunjang (NPWP / ID Card Kantor / Akun Sosial Media aktif)
      • Bukti tiket pesawat / reservasi hotel (khusus wisatawan luar kota)

      Alur Verifikasi:
      Tim verifikasi kami memproses data Anda dalam waktu 15 - 30 menit. Setelah disetujui, mobil dapat diantar langsung ke lokasi Anda seperti Bandara, Stasiun, atau Hotel.
    `
  },
  {
    id: 'art_3',
    title: 'Innova Zenix vs Toyota Avanza: Mana Armada yang Paling Tepat untuk Anda?',
    category: 'Tips Sewa',
    readTime: '5 menit baca',
    date: '05 Sep 2026',
    author: 'Fleet Specialist',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Komparasi mendalam antara konsumsi bahan bakar, kelegaan bagasi, suspensi kabin, dan perbandingan harga sewa harian.',
    content: `
      Kedua mobil ini merupakan pilihan terpopuler pelanggan rental mobil. Berikut perbandingannya:

      1. Toyota Avanza:
      • Pilihan paling ekonomis dan irit BBM
      • Lincah di jalan sempit perkotaan
      • Cocok untuk operasional bisnis harian dan mobilitas keluarga kecil

      2. Toyota Innova Zenix:
      • Kenyamanan suspensi platform TNGA premium
      • Kabin sangat senyap dan berwibawa untuk tamu VIP
      • Ruang kaki baris kedua yang sangat lega dan AC climate control merata
    `
  },
  {
    id: 'art_4',
    title: 'Rekomendasi Destinasi Wisata Akhir Pekan & Rute Perjalanan Alternatif',
    category: 'Rute Wisata',
    readTime: '4 menit baca',
    date: '28 Agu 2026',
    author: 'Travel Guide Team',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Jelajahi spot wisata alam pegunungan dan kuliner legendaris dengan rute jalan tikus yang aman untuk mobil keluarga Anda.',
    content: `
      Akhir pekan adalah waktu terbaik menyegarkan pikiran bersama keluarga. Dengan armada sewa yang prima, Anda dapat menjelajahi tempat wisata alam dengan tenang:

      • Periksa tekanan angin ban dan air radiator sebelum menanjak
      • Gunakan mode transmisi rendah saat melintasi jalur curam
      • Manfaatkan supir lokal kami yang hafal jalan alternatif untuk menghindari kemacetan utama
    `
  }
];

const CATEGORIES = ['Semua', 'Tips Sewa', 'Panduan Wisata', 'Rute Wisata'];

export default function ArticlesSection({ props = {} }) {
  const {
    badge = 'Pusat Informasi & Blog',
    title = 'Artikel, Tips & Wawasan Sewa Mobil',
    subtitle = 'Pelajari panduan perjalanan, tips mengemudi hemat, dan berita armada terkini dari tim ahli kami.',
    articles = DEFAULT_ARTICLES,
  } = props;

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articleList = Array.isArray(articles) && articles.length > 0 ? articles : DEFAULT_ARTICLES;

  const filteredArticles = useMemo(() => {
    return articleList.filter((art) => {
      return selectedCategory === 'Semua' || art.category === selectedCategory;
    });
  }, [articleList, selectedCategory]);

  return (
    <section id="articles" className="py-20 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold mb-4">
          <BookOpen className="w-4 h-4 text-slate-900" />
          <span>{badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          {subtitle}
        </p>

        {/* Category Pill Filters (No Search - Search is on Topbar) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 p-8">
          <p className="text-slate-500 text-sm">Tidak ada artikel dalam kategori "{selectedCategory}".</p>
          <button
            onClick={() => setSelectedCategory('Semua')}
            className="mt-3 text-xs text-slate-900 font-bold hover:underline"
          >
            Tampilkan Semua Artikel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="group rounded-2xl border border-slate-200/90 bg-white overflow-hidden flex flex-col shadow-xs hover:shadow-md hover:border-slate-400 transition-all duration-300"
            >
              {/* Thumbnail Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="250"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                  {art.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{art.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <a
                    href={`/?article=${encodeURIComponent(art.slug || art.id)}`}
                    className="block font-bold text-sm text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 leading-snug"
                  >
                    {art.title}
                  </a>

                  <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`/?article=${encodeURIComponent(art.slug || art.id)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-black transition-colors group-hover:translate-x-0.5"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Article Detail Modal Viewer */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-xl relative">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-3">
              {selectedArticle.category}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200 mb-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-600" />
                {selectedArticle.author}
              </span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 bg-slate-100">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-slate text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed space-y-4">
              {selectedArticle.content || selectedArticle.excerpt}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20saya%20tertarik%20dengan%20artikel%20${encodeURIComponent(selectedArticle.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4 fill-current text-white" />
                <span>Konsultasi via WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
