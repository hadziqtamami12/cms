import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText, Search, MapPin, Calendar, Eye, ArrowRight, ArrowLeft,
  Clock, TrendingUp, Sparkles, ChevronLeft, ChevronRight, X, MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Public Articles & Blog Archive Page
 * Features:
 * - Search bar with instant filter & clear
 * - Category filter pills
 * - Paginated main articles grid
 * - Widget: "Artikel Terbaru" (Recent Articles)
 * - Widget: "Banyak Dilihat" (Most Viewed / Popular Articles)
 * - Direct back navigation & responsive layout
 */
export const ArticlesPage = () => {
  const { config } = useApp();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('/api/articles/public?limit=100')
      .then(res => res.text())
      .then(text => (text ? JSON.parse(text) : {}))
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data);
        }
      })
      .catch(err => console.warn('[ArticlesPage] Error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Distinct categories
  const categories = useMemo(() => {
    return ['Semua', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];
  }, [articles]);

  // Filtered articles based on search & category
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesCat = selectedCategory === 'Semua' || art.category === selectedCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q ||
        art.title?.toLowerCase().includes(q) ||
        art.excerpt?.toLowerCase().includes(q) ||
        art.location_variable?.toLowerCase().includes(q) ||
        art.category?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [articles, selectedCategory, search]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  // Artikel Terbaru (sorted by created_at desc)
  const recentArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5);
  }, [articles]);

  // Banyak Dilihat (sorted by views_count desc)
  const popularArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 5);
  }, [articles]);

  const brandName = config?.brandName || 'Rental & Tour';
  const cleanWa = config?.whatsapp ? String(config.whatsapp).replace(/[^0-9]/g, '') : '6281288990011';

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Sticky Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-bold text-xs sm:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </a>
          <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
            {brandName} <span className="text-blue-600 font-semibold">Blog & Panduan</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8 sm:space-y-10">
        {/* Hero Banner Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold tracking-wide">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Pusat Edukasi & Informasi</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Artikel, Tips Wisata & Informasi Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Dapatkan panduan terlengkap seputar rental mobil, rute perjalanan wisata, tips berkendara aman, dan tarif sewa terbaik.
          </p>
        </div>

        {/* Layout: Main Articles (Left) + Sidebar Widgets (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Search, Categories, Grid, Pagination (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search and Category Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari artikel, kota tujuan, atau tips perjalanan..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Articles Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Menampilkan{' '}
                <strong className="text-slate-800 font-bold">
                  {filteredArticles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                  -
                  {Math.min(currentPage * itemsPerPage, filteredArticles.length)}
                </strong>{' '}
                dari <strong className="text-slate-800 font-bold">{filteredArticles.length}</strong> artikel
              </span>
              {selectedCategory !== 'Semua' && (
                <span className="text-blue-600 font-medium">Kategori: {selectedCategory}</span>
              )}
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400 mt-2 font-medium">Memuat daftar artikel...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
                <FileText className="w-12 h-12 mx-auto stroke-1 opacity-50" />
                <h3 className="text-base font-bold text-slate-700">Tidak ada artikel yang sesuai</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Coba kata kunci lain atau pilih kategori "Semua" untuk melihat seluruh artikel yang dipublikasikan.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearch(''); setSelectedCategory('Semua'); }}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paginatedArticles.map((art) => (
                  <a
                    key={art.id}
                    href={`/artikel/${art.slug}`}
                    className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-400 shadow-subtle hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={art.featured_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {art.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                            {art.category}
                          </span>
                        )}
                        {art.is_dynamic && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>SEO Area</span>
                          </span>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium flex-wrap">
                          {art.created_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{formatDate(art.created_at)}</span>
                            </span>
                          )}
                          {art.location_variable && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                <span>{art.location_variable}</span>
                              </span>
                            </>
                          )}
                        </div>

                        <h2 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                          {art.title}
                        </h2>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {art.excerpt || 'Baca ulasan lengkap seputar informasi dan panduan layanan armada terpercaya kami di sini.'}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{art.views_count || 0} views</span>
                      </span>
                      <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Widgets (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Widget 1: Banyak Dilihat (Popular Articles) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">Banyak Dilihat</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Populer</span>
              </div>

              {popularArticles.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Belum ada data artikel populer.</p>
              ) : (
                <div className="space-y-3">
                  {popularArticles.map((popArt, idx) => (
                    <a
                      key={popArt.id}
                      href={`/artikel/${popArt.slug}`}
                      className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      {/* Rank Number Badge */}
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-700'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>

                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img
                          src={popArt.featured_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80'}
                          alt={popArt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>

                      {/* Title & Views */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {popArt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 font-medium text-amber-600">
                            <Eye className="w-2.5 h-2.5" />
                            <span>{popArt.views_count || 0} dibaca</span>
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Widget 2: Artikel Terbaru (Recent Articles) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <Clock className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">Artikel Terbaru</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Update</span>
              </div>

              {recentArticles.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Belum ada artikel terbaru.</p>
              ) : (
                <div className="space-y-3">
                  {recentArticles.map((recArt) => (
                    <a
                      key={recArt.id}
                      href={`/artikel/${recArt.slug}`}
                      className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img
                          src={recArt.featured_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80'}
                          alt={recArt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>

                      {/* Title & Date */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {recArt.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{formatDate(recArt.created_at) || 'Baru'}</span>
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Widget 3: Butuh Armada Cepat? Contact Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white space-y-3 shadow-lg shadow-blue-600/20">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                Layanan 24 Jam
              </span>
              <h4 className="text-base font-extrabold leading-snug">
                Butuh Sewa Mobil Cepat & Terpercaya?
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Hubungi customer service {brandName} langsung untuk cek ketersediaan unit dan penawaran tarif sewa terbaik.
              </p>
              <div className="pt-1">
                <a
                  href={`https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(brandName)},%20saya%20tertarik%20sewa%20mobil%20setelah%20membaca%20artikel%20website.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Chat WhatsApp Sekarang</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
      </footer>
    </div>
  );
};

export default ArticlesPage;
