import React, { useState, useEffect } from 'react';
import {
  FileText, Search, MapPin, Calendar, Eye, ArrowRight, ArrowLeft, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Public Articles & Blog Archive Page
 */
export const ArticlesPage = () => {
  const { config } = useApp();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    fetch('/api/articles/public')
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

  const categories = ['Semua', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];

  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'Semua' || art.category === selectedCategory;
    const matchesSearch = !search ||
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      art.location_variable?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </a>
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
            {config?.brandName || 'MultiCMS'} Blog & Artikel
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full space-y-10">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            Pusat Informasi & Panduan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Artikel, Tips Wisata & Informasi Armada Daerah
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Dapatkan panduan terlengkap seputar rental mobil, rute perjalanan, destinasi wisata eksotis, dan tarif sewa terbaik.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel / kota..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Memuat artikel...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <FileText className="w-12 h-12 mx-auto stroke-1 opacity-50" />
            <p className="text-sm font-medium">Tidak ada artikel yang sesuai kriteria pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((art) => (
              <a
                key={art.id}
                href={`/artikel/${art.slug}`}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-400 shadow-subtle hover:shadow-card transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={art.featured_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-md">
                        {art.category}
                      </span>
                      {art.location_variable && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{art.location_variable}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{art.views_count || 0} views</span>
                  </span>
                  <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {config?.brandName || 'MultiCMS'}. All rights reserved.
      </footer>
    </div>
  );
};

export default ArticlesPage;
