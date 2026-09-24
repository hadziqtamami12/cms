import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, Eye, Calendar, MapPin, Sparkles } from 'lucide-react';

/**
 * LandingArticlesSection
 * Displays a preview of recent articles/blog posts right before Google Maps on the landing page.
 */
export const LandingArticlesSection = ({ brandName = 'Rental & Travel' }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles/public?limit=3')
      .then(res => res.text())
      .then(text => (text ? JSON.parse(text) : {}))
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data.slice(0, 3));
        }
      })
      .catch(err => {
        console.warn('[LandingArticlesSection] Fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Memuat artikel & panduan terbaru...</p>
        </div>
      </section>
    );
  }

  // If no articles exist in database, do not render an empty section
  if (articles.length === 0) return null;

  return (
    <section id="artikel-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 sm:space-y-10">
      {/* Header with Title and "Lihat Semua Artikel" Link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold tracking-wide">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Pusat Edukasi & Informasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Artikel, Tips Wisata & Panduan Perjalanan
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Dapatkan tips berkendara aman, rekomendasi rute wisata favorit, dan panduan rental mobil terbaik dari tim {brandName}.
          </p>
        </div>

        <a
          href="/artikel"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200/70 hover:border-blue-600 font-bold text-xs sm:text-sm transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-blue-600/20 shrink-0 group self-start sm:self-auto cursor-pointer"
        >
          <span>Lihat Semua Artikel</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Articles Preview Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {articles.map((art) => (
          <a
            key={art.id}
            href={`/artikel/${art.slug}`}
            className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-400 shadow-subtle hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={art.featured_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                {art.category && (
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold shadow-sm">
                    {art.category}
                  </span>
                )}
                {art.is_dynamic && (
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black tracking-wide flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>SEO Area</span>
                  </span>
                )}
              </div>

              {/* Text Content */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 flex-wrap">
                  {art.location_variable && (
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <MapPin className="w-3 h-3" />
                      <span>{art.location_variable}</span>
                      <span className="text-slate-300">•</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{art.views_count || 0} dibaca</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-base sm:text-lg leading-snug line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {art.excerpt || 'Baca ulasan dan informasi lengkap seputar layanan, panduan serta armada terpercaya kami di sini.'}
                </p>
              </div>
            </div>

            {/* Read More Link Footer */}
            <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-blue-600">
              <span className="group-hover:underline">Baca Selengkapnya</span>
              <span className="w-7 h-7 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom CTA on mobile/tablet */}
      <div className="pt-2 text-center sm:hidden">
        <a
          href="/artikel"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/25"
        >
          <span>Baca Semua Artikel & Tips Perjalanan</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default LandingArticlesSection;
