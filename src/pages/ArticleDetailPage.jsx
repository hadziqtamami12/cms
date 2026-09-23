import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Calendar, Eye, MapPin, Tag, Share2, MessageCircle,
  ShieldCheck, Check, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Public Article Detail Page with Programmatic SEO Markup
 */
export const ArticleDetailPage = ({ slug: propSlug }) => {
  const currentSlug = propSlug || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\/artikel\/?/, '').replace(/\/$/, '') : '');
  const { config } = useApp();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentSlug) return;
    setLoading(true);
    setError(null);
    fetch(`/api/articles/public/${currentSlug}`)
      .then(res => res.json())
      .then(json => {
        if (!json.success || !json.data) {
          throw new Error(json.error || 'Artikel tidak ditemukan');
        }
        setArticle(json.data);

        // Dynamic Document Title and Meta
        if (json.data.meta_title) {
          document.title = json.data.meta_title;
        }

        // Schema Markup injection
        if (json.data.schema_markup) {
          const scriptId = 'article-json-ld';
          let scriptEl = document.getElementById(scriptId);
          if (!scriptEl) {
            scriptEl = document.createElement('script');
            scriptEl.id = scriptId;
            scriptEl.type = 'application/ld+json';
            document.head.appendChild(scriptEl);
          }
          scriptEl.text = typeof json.data.schema_markup === 'string'
            ? json.data.schema_markup
            : JSON.stringify(json.data.schema_markup);
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => {
      // Cleanup injected script on unmount
      const scriptEl = document.getElementById('article-json-ld');
      if (scriptEl) scriptEl.remove();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-800">404 - Artikel Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500 max-w-md">Artikel yang Anda cari mungkin telah dipindahkan atau belum dipublikasikan.</p>
        <a href="/artikel" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">
          Lihat Semua Artikel
        </a>
      </div>
    );
  }

  const cleanWa = config?.whatsapp ? String(config.whatsapp).replace(/[^0-9]/g, '') : '6281288990011';
  const locationName = article.location_variable || 'Sekitarnya';
  const waOrderUrl = `https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(config?.brandName || 'Rental')},%20saya%20membaca%20artikel%20seputar%20sewa%20mobil%20${encodeURIComponent(locationName)}.%20Saya%20ingin%20tanya%20unit%20tersedia.`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/artikel" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Semua Artikel</span>
          </a>
          <a href="/" className="font-extrabold text-slate-900 text-sm hover:text-blue-600">
            {config?.brandName || 'Beranda Utama'}
          </a>
        </div>
      </header>

      {/* Article Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full space-y-8 flex-1">
        {/* Category & Location Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
            {article.category || 'Rental Mobil'}
          </span>
          {article.location_variable && (
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Wilayah {article.location_variable}</span>
            </span>
          )}
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <Eye className="w-3.5 h-3.5" />
            <span>{article.views_count || 1} x dibaca</span>
          </span>
        </div>

        {/* Article H1 Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Featured Image */}
        {article.featured_image && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed">
          {article.content.split('\n\n').map((paragraph, pIdx) => {
            if (!paragraph.trim()) return null;
            return (
              <p key={pIdx} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Local Booking Callout Card */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
              Solusi Sewa Armada Terpercaya
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Butuh Rental Mobil di {locationName}?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
              Hubungi {config?.brandName || 'tim kami'} sekarang untuk cek ketersediaan unit Alphard, Innova Zenix, Fortuner, maupun Avanza dengan tarif termurah.
            </p>
          </div>

          <a
            href={waOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-blue-700" />
            <span>Pesan Unit di {locationName}</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {config?.brandName || 'MultiCMS'}. All rights reserved.
      </footer>
    </div>
  );
};

export default ArticleDetailPage;
