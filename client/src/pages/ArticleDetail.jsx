import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, ArrowLeft, Share2, MessageSquare,
  Check, Copy, ChevronRight, BookOpen, ExternalLink, Sparkles
} from 'lucide-react';
import DynamicTopbar from '../components/navigation/DynamicTopbar';
import Footer from '../components/navigation/Footer';
import FloatingWhatsapp from '../components/navigation/FloatingWhatsapp';
import { fetchAdminPosts } from '../utils/api';

export default function ArticleDetail({
  slug,
  header = {},
  footer = {},
  floatingWhatsapp = {},
  colorMode = 'light',
  onBackToHome,
}) {
  const [article, setArticle] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);

    fetchAdminPosts()
      .then((posts) => {
        setAllPosts(posts);
        const found = posts.find((p) => p.slug === slug || p.id === slug) || posts[0];
        setArticle(found);
      })
      .catch((err) => {
        console.error('Failed to load article:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isDark = colorMode === 'dark';

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col">
        <DynamicTopbar header={header} colorMode={colorMode} />
        <div className="flex-grow max-w-4xl mx-auto px-4 py-20 w-full space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-100 rounded-lg" />
          <div className="h-12 w-3/4 bg-slate-100 rounded-2xl" />
          <div className="h-4 w-48 bg-slate-100 rounded-lg" />
          <div className="h-96 w-full bg-slate-100 rounded-3xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
            <div className="h-4 w-4/6 bg-slate-100 rounded" />
          </div>
        </div>
        <Footer footer={footer} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-black text-slate-900 mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mb-6">Artikel yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
        <button
          onClick={onBackToHome}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs hover:bg-black transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const relatedPosts = allPosts.filter((p) => p.id !== article.id && p.slug !== article.slug).slice(0, 3);
  const shareText = `Baca artikel menarik: "${article.title}"`;
  const shareWaUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' - ' + window.location.href)}`;

  // Google Rich Snippet Structured Data (Schema.org/BlogPosting)
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': article.title,
    'description': article.excerpt,
    'image': [article.imageUrl],
    'datePublished': article.createdAt || new Date().toISOString(),
    'dateModified': article.updatedAt || article.createdAt || new Date().toISOString(),
    'author': {
      '@type': 'Person',
      'name': article.author || 'Admin Editorial',
    },
    'publisher': {
      '@type': 'Organization',
      'name': header.brandName || 'Ultra CMS Engine',
      'logo': {
        '@type': 'ImageObject',
        'url': article.imageUrl,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Google Rich Snippet Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Top Header Bar */}
      <DynamicTopbar header={header} colorMode={colorMode} />

      {/* Main Article Reading Container */}
      <main className="flex-grow pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
            <button
              onClick={onBackToHome}
              className="hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <a href="/#articles" className="hover:text-slate-900 font-medium transition-colors">
              Artikel & Berita
            </a>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
          </nav>

          {/* Category Badge & Title */}
          <div className="space-y-4 mb-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider">
              {article.category || 'Wawasan & Panduan'}
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Author Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-black text-xs">
                    {article.author ? article.author[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-slate-200 leading-none">
                      {article.author || 'Tim Editorial'}
                    </span>
                    <span className="text-[10px] text-slate-400">Penulis Konten</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{article.date || 'Terbaru 2026'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{article.readTime || '4 menit baca'}</span>
                </div>
              </div>

              {/* Share Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={shareWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Bagikan ke WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Salin Tautan"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[480px] object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Excerpt Lead Paragraph */}
          {article.excerpt && (
            <div className="p-6 rounded-2xl bg-slate-50 border-l-4 border-slate-900 mb-8 text-sm sm:text-base font-medium text-slate-800 leading-relaxed italic">
              "{article.excerpt}"
            </div>
          )}

          {/* Article Main Body Content */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {article.content}
          </div>

          {/* Direct WhatsApp Callout Banner */}
          <div className="my-12 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Layanan Pelanggan 24 Jam
              </span>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                Butuh Informasi Lengkap atau Konsultasi Layanan?
              </h3>
              <p className="text-xs text-slate-500 max-w-md">
                Diskusikan kebutuhan Anda bersama tim konsultan kami secara langsung melalui WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/${header.whatsappNumber || '6281234567890'}?text=${encodeURIComponent(`Halo Admin, saya membaca artikel "${article.title}" dan ingin konsultasi lebih lanjut.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs shadow-xs flex items-center gap-2 transition-transform active:scale-95 shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-white text-white" />
              <span>Chat WhatsApp Sekarang</span>
            </a>
          </div>

          {/* Related Articles Grid */}
          {relatedPosts.length > 0 && (
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">
                  Artikel Menarik Lainnya
                </h3>
                <span className="text-xs text-slate-600 font-bold">Rekomendasi Terkait</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((rel) => (
                  <a
                    key={rel.id}
                    href={`/?article=${encodeURIComponent(rel.slug || rel.id)}`}
                    className="group p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      {rel.imageUrl && (
                        <img
                          src={rel.imageUrl}
                          alt={rel.title}
                          className="w-full h-32 rounded-xl object-cover mb-3"
                          loading="lazy"
                        />
                      )}
                      <span className="text-[10px] font-bold text-slate-600 block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-slate-700 transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                      <span>{rel.readTime || '3 menit'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Floating WhatsApp on Scroll */}
      <FloatingWhatsapp config={floatingWhatsapp} />

      {/* Footer */}
      <Footer footer={footer} />
    </div>
  );
}
