import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Phone, MessageSquare, Menu, X, Car, Search, ArrowRight,
  BookOpen, ChevronRight, FileText, Sparkles, TrendingUp,
  Compass, ExternalLink
} from 'lucide-react';

const UNIVERSAL_SEARCH_ITEMS = [
  // 1. PRODUK & ARMADA / LAYANAN (PRODUCTS & FLEET FIRST - PRIORITY 1)
  { type: 'product', id: 'prod-avanza', title: 'Toyota All New Avanza', category: 'MPV Keluarga', desc: '7 Kursi • Matic/Manual • Kabin lega & irit bahan bakar', price: 'Rp 350.000 / hari', href: '#fleet' },
  { type: 'product', id: 'prod-zenix', title: 'Toyota Innova Zenix Hybrid', category: 'Medium MPV', desc: '7 Kursi • Captain Seat • Suspensi TNGA senyap & berwibawa', price: 'Rp 650.000 / hari', href: '#fleet' },
  { type: 'product', id: 'prod-alphard', title: 'Toyota Alphard Transformers', category: 'VIP Executive', desc: '7 Kursi • VIP Lounge • Fasilitas eksekutif mewah', price: 'Rp 1.800.000 / hari', href: '#fleet' },
  { type: 'product', id: 'prod-fortuner', title: 'Toyota Fortuner GR Sport', category: 'SUV Gagah', desc: '7 Kursi • 4x2 Diesel • Tangguh di segala medan', price: 'Rp 850.000 / hari', href: '#fleet' },
  { type: 'product', id: 'prod-brio', title: 'Honda All New Brio RS', category: 'City Car', desc: '5 Kursi • Matic • Lincah dan hemat untuk mobilitas perkotaan', price: 'Rp 300.000 / hari', href: '#fleet' },
  { type: 'product', id: 'prod-hiace', title: 'Toyota Hiace Commuter', category: 'Microbus 15 Kursi', desc: '15 Kursi • AC Ducting dingin merata • Rombongan wisata keluarga', price: 'Rp 1.100.000 / hari', href: '#fleet' },
  { type: 'product', id: 'prod-driver', title: 'Paket Sewa All-In Mobil + Supir + BBM', category: 'Layanan Prioritas', desc: 'Bebas lelah, supir berpengalaman, rute hafal, siap antar jemput', price: 'Mulai Rp 500.000 / hari', href: '#pricing' },
  { type: 'product', id: 'prod-lepas-kunci', title: 'Paket Sewa Lepas Kunci 24 Jam', category: 'Layanan Fleksibel', desc: 'Privasi penuh, proses serah terima kilat, unit diantar ke lokasi Anda', price: 'Mulai Rp 300.000 / hari', href: '#pricing' },

  // 2. ARTIKEL & TIPS BLOG (ARTICLES & NEWS - PRIORITY 2)
  { type: 'article', id: 'art-1', title: '5 Tips Rental Mobil Hemat & Aman untuk Liburan Bersama Keluarga', category: 'Tips Sewa', desc: 'Trik memilih kapasitas kabin, efisiensi konsumsi BBM, dan durasi sewa', meta: '4 menit baca', href: '#articles' },
  { type: 'article', id: 'art-2', title: 'Panduan Lengkap Syarat Sewa Mobil Lepas Kunci Tanpa Ribet', category: 'Panduan Wisata', desc: 'Dokumen KTP, SIM A, verifikasi kilat 15 menit, dan pengembalian deposit', meta: '3 menit baca', href: '#articles' },
  { type: 'article', id: 'art-3', title: 'Innova Zenix vs Toyota Avanza: Komparasi Lengkap Perjalanan', category: 'Tips Sewa', desc: 'Perbandingan suspensi TNGA, konsumsi bahan bakar, dan kenyamanan kabin', meta: '5 menit baca', href: '#articles' },
  { type: 'article', id: 'art-4', title: 'Rekomendasi Destinasi Wisata Akhir Pekan & Rute Alternatif Terbaik', category: 'Rute Wisata', desc: 'Spot liburan ramah keluarga yang dapat diakses dengan nyaman via mobil', meta: '4 menit baca', href: '#articles' },
  { type: 'article', id: 'art-5', title: 'Pentingnya Memilih Asuransi All-Risk Saat Sewa Mobil Lepas Kunci', category: 'Edukasi Sewa', desc: 'Perlindungan maksimal dari risiko lecet atau insiden selama perjalanan', meta: '3 menit baca', href: '#articles' },

  // 3. HALAMAN UTAMA & NAVIGASI (PAGES)
  { type: 'page', id: 'page-home', title: 'Beranda (Halaman Utama)', category: 'Halaman Utama', desc: 'Landing page eksekutif dengan hero slider, katalog produk, dan fitur lengkap', href: '#top' },
  { type: 'page', id: 'page-fleet', title: 'Katalog Armada & Produk', category: 'Halaman Produk', desc: 'Pilihan lengkap armada MPV, SUV, Luxury Sedan, dan City Car', href: '#fleet' },
  { type: 'page', id: 'page-pricing', title: 'Daftar Paket Harga Sewa', category: 'Halaman Tarif', desc: 'Perbandingan paket sewa harian, mingguan, lepas kunci, dan all-in', href: '#pricing' },
  { type: 'page', id: 'page-articles', title: 'Artikel, Tips & Berita Blog', category: 'Halaman Blog', desc: 'Kumpulan tips cerdas sewa mobil, rute liburan, dan panduan wisata', href: '#articles' },
  { type: 'page', id: 'page-features', title: 'Keunggulan & Standar Mutu Layanan', category: 'Halaman Fitur', desc: '4 pilar keunggulan, jaminan unit prima, dan supir berpengalaman', href: '#features' },
  { type: 'page', id: 'page-testimonials', title: 'Ulasan & Testimoni Pelanggan', category: 'Halaman Review', desc: 'Pengalaman nyata pelanggan dengan ulasan rating bintang 5', href: '#testimonials' },
  { type: 'page', id: 'page-faq', title: 'Pusat Bantuan & FAQ', category: 'Halaman Bantuan', desc: 'Pertanyaan umum seputar syarat sewa, verifikasi, deposit, dan asuransi', href: '#faq' },
  { type: 'page', id: 'page-contact', title: 'Kontak & Reservasi WhatsApp', category: 'Halaman Kontak', desc: 'Layanan konsultasi unit dan reservasi cepat 24 jam nonstop', href: '#footer' },

  // 4. FITUR & BAGIAN HALAMAN (SECTIONS & HIGHLIGHTS)
  { type: 'feature', id: 'feat-armada-prima', title: 'Armada Bersih, Wangi & Terawat Rutin', category: 'Standar Mutu', desc: 'Servis berkala di bengkel resmi dengan inspeksi keselamatan 20 titik', href: '#features' },
  { type: 'feature', id: 'feat-cs-24jam', title: 'Layanan Konsultasi & Bantuan 24 Jam', category: 'Support Nonstop', desc: 'Tim customer care selalu siaga membantu kebutuhan reservasi darurat', href: '#features' },
  { type: 'feature', id: 'feat-harga-transparan', title: 'Harga Transparan Tanpa Biaya Tersembunyi', category: 'Garansi Kejujuran', desc: 'Tarif sewa jelas tertera di awal pemesanan tanpa pungutan liar', href: '#features' },
  { type: 'feature', id: 'feat-antar-jemput', title: 'Layanan Antar-Jemput Bandara & Hotel', category: 'Kemudahan Akses', desc: 'Mobil dapat diantar langsung ke Bandara, Stasiun, atau Hotel Anda', href: '#pricing' },
  { type: 'feature', id: 'feat-refund-fleksibel', title: 'Kebijakan Reschedule & Batal Fleksibel', category: 'Ketentuan Sewa', desc: 'Perubahan jadwal sewa dapat dilakukan dengan mudah tanpa denda rumit', href: '#faq' },
];

const SEARCH_SUGGESTION_DICTIONARY = [
  { keyword: 'Avanza', matchWords: ['avanza', 'av', 'toyota', 'mpv'] },
  { keyword: 'Innova Zenix', matchWords: ['innova', 'zenix', 'hybrid', 'medium'] },
  { keyword: 'Alphard', matchWords: ['alphard', 'al', 'vip', 'mewah', 'executive'] },
  { keyword: 'Fortuner', matchWords: ['fortuner', 'suv', 'diesel', 'gr'] },
  { keyword: 'Brio', matchWords: ['brio', 'city', 'honda', 'matic'] },
  { keyword: 'Hiace', matchWords: ['hiace', 'bus', 'microbus', 'rombongan', '15'] },
  { keyword: 'Lepas Kunci', matchWords: ['lepas', 'kunci', 'tanpa', 'mandiri', 'self'] },
  { keyword: 'Paket Supir', matchWords: ['supir', 'driver', 'all', 'in', 'paket'] },
  { keyword: 'Tips Liburan', matchWords: ['tips', 'liburan', 'hemat', 'keluarga'] },
  { keyword: 'Syarat Sewa', matchWords: ['syarat', 'ktp', 'dokumen', 'verifikasi'] },
  { keyword: 'Harga Sewa', matchWords: ['harga', 'tarif', 'biaya', 'promo', 'murah'] },
  { keyword: 'Antar Bandara', matchWords: ['bandara', 'airport', 'stasiun', 'hotel'] },
  { keyword: 'Asuransi All-Risk', matchWords: ['asuransi', 'risk', 'aman', 'proteksi'] },
  { keyword: 'FAQ & Bantuan', matchWords: ['faq', 'tanya', 'bantuan', 'cs'] },
];

const TRENDING_KEYWORDS = [
  'Toyota Avanza', 'Innova Zenix', 'Lepas Kunci', 'Paket Supir',
  'Tips Hemat', 'Syarat Sewa', 'Harga Sewa', 'Antar Bandara'
];

export default function DynamicTopbar({ header = {}, siteName = 'Ultra Rent Auto', phone: defaultPhone = '0812-3456-7890', colorMode = 'light', isPreview = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'page' | 'article' | 'product' | 'feature'
  const searchInputRef = useRef(null);

  const brandName = header.brandName || siteName;
  const brandTagline = header.brandTagline || 'Executive Fleet';
  const phone = header.phone || defaultPhone;
  const whatsappNumber = header.whatsappNumber || '6281234567890';
  const navLinks = Array.isArray(header.navLinks) && header.navLinks.length > 0
    ? header.navLinks
    : [
        { label: 'Pilihan Armada', href: '#fleet' },
        { label: 'Keunggulan', href: '#features' },
        { label: 'Paket Sewa', href: '#pricing' },
        { label: 'Artikel & Tips', href: '#articles' },
        { label: 'Testimoni', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
      ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener (ESC to close, Ctrl+K / Cmd+K to toggle)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background body scroll strictly when search megamenu is open
  useEffect(() => {
    if (searchOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  // Dynamic live keyword suggestions matching words typed
  const liveSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return SEARCH_SUGGESTION_DICTIONARY.slice(0, 6);
    }
    const words = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return SEARCH_SUGGESTION_DICTIONARY.filter((item) => {
      return words.some((w) =>
        item.keyword.toLowerCase().includes(w) ||
        item.matchWords.some((mw) => mw.toLowerCase().includes(w) || w.includes(mw))
      );
    }).slice(0, 8);
  }, [searchQuery]);

  const categoryCounts = useMemo(() => {
    return {
      all: UNIVERSAL_SEARCH_ITEMS.length,
      product: UNIVERSAL_SEARCH_ITEMS.filter((i) => i.type === 'product').length,
      article: UNIVERSAL_SEARCH_ITEMS.filter((i) => i.type === 'article').length,
      page: UNIVERSAL_SEARCH_ITEMS.filter((i) => i.type === 'page').length,
      feature: UNIVERSAL_SEARCH_ITEMS.filter((i) => i.type === 'feature').length,
    };
  }, []);

  const searchResults = useMemo(() => {
    let items = UNIVERSAL_SEARCH_ITEMS;
    if (activeFilter !== 'all') {
      items = items.filter((i) => i.type === activeFilter);
    }
    if (!searchQuery.trim()) {
      return items.slice(0, 8);
    }
    const q = searchQuery.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const titleLower = item.title.toLowerCase();
      const catLower = item.category.toLowerCase();
      const descLower = (item.desc || '').toLowerCase();
      // Match full query or any word in title, category, or desc
      return (
        titleLower.includes(q) ||
        catLower.includes(q) ||
        descLower.includes(q) ||
        words.every((w) => titleLower.includes(w) || catLower.includes(w) || descLower.includes(w))
      );
    });
  }, [searchQuery, activeFilter]);

  const isDark = colorMode === 'dark';

  const handleSelectItem = (href) => {
    setSearchOpen(false);
    setSearchQuery('');
    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`${
          isPreview ? 'sticky top-0 w-full z-20' : 'fixed top-0 inset-x-0 z-50'
        } transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-sm py-2.5 text-slate-900'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent border-b border-transparent py-4 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-lg p-1 shrink-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-all duration-300 ${
                scrolled
                  ? 'bg-slate-900 text-white'
                  : 'bg-white/20 backdrop-blur-md border border-white/30 text-white'
              }`}
            >
              <Car className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-black text-lg tracking-tight leading-tight transition-colors ${
                  scrolled ? 'text-slate-900' : 'text-white drop-shadow-sm'
                }`}
              >
                {brandName}
              </span>
              <span
                className={`text-[10px] tracking-widest uppercase font-semibold transition-colors ${
                  scrolled ? 'text-slate-400' : 'text-slate-200 drop-shadow-xs'
                }`}
              >
                {brandTagline}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-6 text-sm font-semibold transition-colors ${
              scrolled ? 'text-slate-700' : 'text-white/90'
            }`}
          >
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className={`transition-colors px-2 py-1 rounded-lg ${
                  scrolled ? 'hover:text-slate-950' : 'hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Topbar Search Button (Desktop & Tablet) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                scrolled
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200/90'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-sm'
              }`}
              title="Cari Mobil & Artikel"
            >
              <Search className={`w-4 h-4 shrink-0 ${scrolled ? 'text-slate-400' : 'text-white/80'}`} />
              <span className="hidden sm:inline">Cari Armada / Artikel...</span>
              <span
                className={`hidden md:inline px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  scrolled ? 'bg-slate-200 text-slate-600' : 'bg-white/20 text-white'
                }`}
              >
                Ctrl+K
              </span>
            </button>

            {/* Quick WhatsApp Action Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                className={`hidden xl:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                  scrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Phone className={`w-4 h-4 ${scrolled ? 'text-slate-400' : 'text-white/80'}`} />
                <span>{phone}</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo%20${encodeURIComponent(brandName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all duration-200 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white text-white" />
                <span>WhatsApp CS</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                scrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/15'
              }`}
              aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white text-slate-900 border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-md">
            <div className="pb-2 border-b border-slate-100">
              <button
                onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                <Search className="w-4 h-4 text-slate-700" />
                <span>Cari Armada Mobil atau Artikel...</span>
              </button>
            </div>
            <nav className="flex flex-col space-y-1 text-sm font-semibold">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg hover:bg-slate-100 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo%20${encodeURIComponent(brandName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs"
              >
                <MessageSquare className="w-4 h-4 fill-white text-white" />
                <span>Konsultasi Cepat WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* UNIVERSAL MEGA-SEARCH COMMAND HUB (Executive Neutral CMS Panel) */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center pt-3 sm:pt-6 px-2 sm:px-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-5xl bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden my-auto sm:my-6 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Mega-Search Bar with Suggestions & Filter Pills */}
            <div className="p-4 sm:p-6 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3 bg-white px-4 py-3.5 rounded-2xl border border-slate-300 shadow-xs focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 transition-all">
                <Search className="w-5 h-5 text-slate-500 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari armada, produk rental, artikel, atau syarat sewa..."
                  className="flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Hapus teks"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Tutup</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white text-[10px] border border-slate-300 font-mono">ESC</kbd>
                </button>
              </div>

              {/* Dynamic Live Suggestions Per-Word */}
              <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                  <span>Saran kata kunci:</span>
                </span>
                {liveSuggestions.map((sug) => (
                  <button
                    key={sug.keyword}
                    type="button"
                    onClick={() => {
                      setSearchQuery(sug.keyword);
                      searchInputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold text-[11px] transition-all shrink-0"
                  >
                    {sug.keyword}
                  </button>
                ))}
              </div>

              {/* Category Filter Pills (Prioritizing Produk & Artikel First) */}
              <div className="flex items-center gap-2 mt-3.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                {[
                  { id: 'all', label: '⭐ Semua Hasil', count: categoryCounts.all },
                  { id: 'product', label: '🚗 Produk & Armada', count: categoryCounts.product },
                  { id: 'article', label: '📝 Artikel & Berita', count: categoryCounts.article },
                  { id: 'page', label: '📄 Halaman', count: categoryCounts.page },
                  { id: 'feature', label: '⚡ Fitur & Standar', count: categoryCounts.feature },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                      activeFilter === tab.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Mega-Search Dual-Pane Body (overscroll-contain to protect landing page scroll) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 max-h-[58vh] overflow-y-auto overscroll-contain">
              {/* Left Column (8 Cols): Matched Results */}
              <div className="lg:col-span-8 p-4 sm:p-5 space-y-2.5 overflow-y-auto overscroll-contain">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                  {searchQuery ? `Hasil Pencarian ("${searchQuery}")` : 'Rekomendasi Utama: Produk & Artikel Terpopuler'}
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-14 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      Tidak Ada Hasil yang Cocok
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Coba gunakan kata kunci lain seperti "Avanza", "Syarat Sewa", "Paket All-In", atau klik salah satu topik pencarian di sebelah kanan.
                    </p>
                  </div>
                ) : (
                  searchResults.map((item) => {
                    const badgeStyles =
                      item.type === 'page'
                        ? 'bg-slate-100 text-slate-800'
                        : item.type === 'article'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                        : item.type === 'product'
                        ? 'bg-slate-100 text-slate-900 border border-slate-200'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200/60';

                    const badgeLabel =
                      item.type === 'page'
                        ? 'Halaman'
                        : item.type === 'article'
                        ? 'Artikel Blog'
                        : item.type === 'product'
                        ? 'Produk / Armada'
                        : 'Fitur & Standar';

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item.href)}
                        className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-3 cursor-pointer transition-all group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${badgeStyles}`}>
                            {item.type === 'page' ? (
                              <FileText className="w-5 h-5" />
                            ) : item.type === 'article' ? (
                              <BookOpen className="w-5 h-5" />
                            ) : item.type === 'product' ? (
                              <Car className="w-5 h-5" />
                            ) : (
                              <Sparkles className="w-5 h-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeStyles}`}>
                                {badgeLabel}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                {item.category}
                              </span>
                            </div>

                            <h5 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-black truncate">
                              {item.title}
                            </h5>

                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.desc}
                            </p>

                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-900 mt-1">
                              {item.price && <span>{item.price}</span>}
                              {item.meta && <span className="text-slate-400 font-normal">• {item.meta}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 shrink-0 group-hover:translate-x-1 transition-transform">
                          <span className="hidden sm:inline">Buka</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column (4 Cols): Discovery Hub */}
              <div className="lg:col-span-4 p-4 sm:p-5 bg-slate-50/50 space-y-5">
                {/* Trending searches */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
                    <span>Sering Dicari</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_KEYWORDS.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => setSearchQuery(kw)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-900 text-slate-700 text-xs font-medium transition-all shadow-2xs"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Section Jump */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-slate-700" />
                    <span>Pintasan Cepat</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'Katalog Armada', href: '#fleet' },
                      { label: 'Keunggulan', href: '#features' },
                      { label: 'Paket Sewa', href: '#pricing' },
                      { label: 'Artikel Blog', href: '#articles' },
                      { label: 'Testimoni', href: '#testimonials' },
                      { label: 'Pusat FAQ', href: '#faq' },
                    ].map((shortcut) => (
                      <button
                        key={shortcut.label}
                        onClick={() => handleSelectItem(shortcut.href)}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-left text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all truncate"
                      >
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Help Card (Executive Clean Neutral) */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xs border border-slate-800 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Bantuan Instan 24 Jam
                  </div>
                  <h4 className="font-bold text-xs leading-snug">
                    Tidak menemukan yang Anda cari?
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Tim customer care kami siap membantu reservasi unit armada atau pertanyaan lainnya kapan saja.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Halo%20Admin,%20saya%20ingin%20tanya%20informasi%20layanan`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs mt-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                    <span>Chat WhatsApp Langsung</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Status Bar Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 px-6">
              <span>Menampilkan <strong>{searchResults.length}</strong> hasil relevan</span>
              <span className="hidden sm:inline">Tekan <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">ESC</kbd> untuk keluar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
