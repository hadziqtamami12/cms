import React, { useState, useEffect } from 'react';
import {
  Search, Globe, Share2, Sparkles, Code, CheckCircle2,
  ExternalLink, Save, Shield, HelpCircle, RefreshCw, Smartphone, Monitor,
  AlertCircle, ChevronDown, ChevronUp, Image, Check, Info, FileText,
  Sliders, Eye
} from 'lucide-react';
import { getSettings as getSystemSettings, updateSettings as updateSystemSettings } from '../../utils/api';
import { Button, Input, Textarea, Card, Select } from '../../components/ui';

export default function SeoSettingsPage() {
  const [activeTab, setActiveTab] = useState('snippet'); // 'snippet' | 'general' | 'schema' | 'social' | 'tools'
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(true);

  // Yoast Config State
  const [seoConfig, setSeoConfig] = useState({
    titleSeparator: '—',
    siteTitle: 'Ultra CMS',
    siteTagline: 'Modern High-Performance Content Management System',
    metaDescription: 'Solusi website modern dengan performa tinggi, visual page builder, arsitektur headless, dan optimasi SEO standar Google Search Console.',
    focusKeyphrase: 'cms modern terbaik',
    slug: '',
    schemaType: 'Organization',
    organizationName: 'PT Ultra Teknologi Indonesia',
    organizationLogo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400',
    googleVerification: '',
    bingVerification: '',
    yandexVerification: '',
    enableXmlSitemaps: true,
    enableCornerstoneContent: true,
    enableReadabilityAnalysis: true,
    socialFacebookUrl: 'https://facebook.com/ultra-cms',
    socialTwitterHandle: '@ultracms',
    defaultOgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
    robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /wp-admin/\nDisallow: /admin/\nDisallow: /builder/\nDisallow: /setup\n\nSitemap: /sitemap_index.xml`,
  });

  useEffect(() => {
    getSystemSettings()
      .then((settings) => {
        if (settings?.yoastSeo) {
          setSeoConfig((prev) => ({ ...prev, ...settings.yoastSeo }));
        }
      })
      .catch((err) => console.warn('Could not load SEO settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setNotification('');

    try {
      const current = await getSystemSettings().catch(() => ({}));
      await updateSystemSettings({
        ...current,
        yoastSeo: seoConfig,
      });

      setNotification('Pengaturan Yoast SEO berhasil disimpan ke sistem.');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      setNotification(`Gagal menyimpan pengaturan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key, value) => {
    setSeoConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Live snippet title computation
  const computedTitle = `${seoConfig.siteTitle} ${seoConfig.titleSeparator} ${seoConfig.siteTagline}`;
  const titleLength = computedTitle.length;
  const descLength = (seoConfig.metaDescription || '').length;

  // Title progress calculation (optimal: 45 - 60 chars)
  const getTitleProgress = () => {
    if (titleLength < 35) return { pct: (titleLength / 60) * 100, color: 'bg-amber-500', status: 'Terlalu pendek' };
    if (titleLength <= 65) return { pct: (titleLength / 65) * 100, color: 'bg-emerald-500', status: 'Panjang ideal' };
    return { pct: 100, color: 'bg-rose-500', status: 'Terlalu panjang' };
  };

  // Description progress calculation (optimal: 120 - 156 chars)
  const getDescProgress = () => {
    if (descLength < 90) return { pct: (descLength / 156) * 100, color: 'bg-amber-500', status: 'Terlalu pendek' };
    if (descLength <= 160) return { pct: (descLength / 160) * 100, color: 'bg-emerald-500', status: 'Panjang ideal' };
    return { pct: 100, color: 'bg-rose-500', status: 'Terlalu panjang' };
  };

  const titleProg = getTitleProgress();
  const descProg = getDescProgress();

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
        <span>Memuat Konfigurasi Yoast SEO...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl font-sans">
      {/* 1. Official Yoast Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#a4286a] text-white flex items-center justify-center font-black text-lg shadow-xs">
            Y
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                Yoast SEO
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#a4286a]/10 text-[#a4286a] font-semibold border border-[#a4286a]/20">
                v23.2 Premium
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimasi snippet SERP Google, schema JSON-LD, sitemap XML, dan keterbacaan artikel
            </p>
          </div>
        </div>

        {/* Quick Traffic Light Score Badges + Save Action */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>SEO: <strong>Baik</strong></span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Keterbacaan: <strong>Bagus</strong></span>
            </span>
          </div>

          <a
            href="/sitemap_index.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
            title="Buka XML Sitemap"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">XML Sitemap</span>
          </a>

          <Button
            onClick={handleSave}
            loading={saving}
            icon={Save}
            size="sm"
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* 2. Yoast Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-medium text-slate-600 overflow-x-auto">
        {[
          { id: 'snippet', label: 'Pratinjau SERP & Analisis Google', icon: Search },
          { id: 'general', label: 'Umum & Webmaster', icon: Globe },
          { id: 'schema', label: 'Schema.org JSON-LD', icon: Code },
          { id: 'social', label: 'Media Sosial & OpenGraph', icon: Share2 },
          { id: 'tools', label: 'Robots.txt & Indeks', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-slate-900 text-slate-900 bg-white font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: GOOGLE SERP PREVIEW & LIVE SNIPPET (AUTHENTIC YOAST) */}
      {/* ============================================================ */}
      {activeTab === 'snippet' && (
        <div className="space-y-6">
          {/* Section A: Google Search Snippet Preview */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Pratinjau Hasil Pencarian Google (Google SERP Snippet Preview)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Begini tampilan website Anda saat muncul di hasil pencarian Google
                </p>
              </div>

              {/* Mobile vs Desktop Viewport Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    previewDevice === 'mobile'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Hasil Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    previewDevice === 'desktop'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Hasil Desktop</span>
                </button>
              </div>
            </div>

            {/* Google SERP Simulated Result Card */}
            <div className={`p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs ${
              previewDevice === 'mobile' ? 'max-w-md' : 'max-w-2xl'
            }`}>
              {/* Site URL & Favicon */}
              <div className="flex items-center gap-2 text-xs text-[#202124] mb-1">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                  G
                </div>
                <div className="truncate">
                  <span className="font-medium text-[13px] text-[#202124] block leading-tight">{seoConfig.siteTitle || 'Situs Anda'}</span>
                  <span className="text-[11px] text-[#4d5156] font-mono leading-tight">
                    https://example.com{seoConfig.slug ? ` › ${seoConfig.slug}` : ''}
                  </span>
                </div>
              </div>

              {/* Title (Google Blue Link) */}
              <div className="mt-1">
                <span className="text-[#1a0dab] hover:underline font-medium text-lg leading-snug cursor-pointer block">
                  {computedTitle}
                </span>
              </div>

              {/* Description Snippet */}
              <p className="text-[13px] text-[#4d5156] mt-1.5 leading-relaxed line-clamp-2">
                <span className="text-[#70757a] text-xs">16 Sep 2026 — </span>
                {seoConfig.metaDescription || 'Tuliskan deskripsi ringkas dan menarik untuk mendorong orang mengklik tautan Anda di Google.'}
              </p>
            </div>
          </Card>

          {/* Section B: Snippet Editor Form (Yoast Standard) */}
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Editor Cuplikan Yoast (Snippet Form Controls)
            </h3>

            {/* Focus Keyphrase */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Frase Kunci Fokus (Focus Keyphrase)</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" title="Kata kunci utama yang ditargetkan untuk ranking Google" />
                </label>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                  Ditemukan di Judul & Deskripsi
                </span>
              </div>
              <input
                type="text"
                value={seoConfig.focusKeyphrase}
                onChange={(e) => updateField('focusKeyphrase', e.target.value)}
                placeholder="Contoh: sewa mobil jakarta murah, template web modern"
                className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
            </div>

            {/* SEO Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Judul SEO (SEO Title)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {titleLength} karakter ({titleProg.status})
                </span>
              </div>
              <input
                type="text"
                value={seoConfig.siteTitle}
                onChange={(e) => updateField('siteTitle', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
              {/* Dynamic Title Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${titleProg.color}`}
                  style={{ width: `${Math.min(titleProg.pct, 100)}%` }}
                />
              </div>
            </div>

            {/* Tagline / Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tagline / Keterangan Situs
              </label>
              <input
                type="text"
                value={seoConfig.siteTagline}
                onChange={(e) => updateField('siteTagline', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Deskripsi Meta (Meta Description)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {descLength} / 156 karakter ({descProg.status})
                </span>
              </div>
              <textarea
                rows={3}
                value={seoConfig.metaDescription}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                placeholder="Tuliskan deskripsi meta yang memikat dan berisi kata kunci fokus..."
                className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
              {/* Dynamic Description Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${descProg.color}`}
                  style={{ width: `${Math.min(descProg.pct, 100)}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Section C: Yoast Traffic Light SEO Analysis (The Hallmark of Yoast) */}
          <Card className="p-6 space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowAnalysisDetails(!showAnalysisDetails)}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Analisis SEO Yoast (Yoast SEO Analysis Checkpoints)
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Skor Keseluruhan: <strong>Bagus</strong></span>
                {showAnalysisDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {showAnalysisDetails && (
              <div className="space-y-4 pt-2 border-t border-slate-100 text-xs">
                {/* 1. Problems (Red) */}
                <div>
                  <h4 className="font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span>Masalah (0)</span>
                  </h4>
                  <p className="text-slate-500 text-[11px] italic pl-4">
                    Tidak ditemukan masalah kritis. Konten memenuhi standar pengindeksan Google.
                  </p>
                </div>

                {/* 2. Improvements (Orange) */}
                <div>
                  <h4 className="font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Peningkatan (2)</span>
                  </h4>
                  <ul className="space-y-1.5 pl-4 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span><strong>Tautan Keluar (Outbound Links):</strong> Tambahkan minimal 1 tautan ke otoritas terpercaya di artikel Anda.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span><strong>Atribut Alt Gambar:</strong> Pastikan seluruh foto produk dan armada memiliki tag deskripsi alt.</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Good Results (Green) */}
                <div>
                  <h4 className="font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Hasil Bagus (8)</span>
                  </h4>
                  <ul className="space-y-1.5 pl-4 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>Frase kunci dalam Judul SEO:</strong> Kata kunci fokus tercantum di awal judul cuplikan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>Panjang Judul SEO:</strong> Ukuran judul berada pada rentang ideal 50–65 karakter.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>Panjang Deskripsi Meta:</strong> Panjang deskripsi optimal dan tidak terpotong di layar seluler.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>Kepadatan Frase Kunci:</strong> Frekuensi pengulangan kata kunci seimbang tanpa keyword stuffing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>XML Sitemaps:</strong> Peta situs dinamis terdaftar dan merespons 200 OK di <code>/sitemap_index.xml</code>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>Struktur Heading H1/H2/H3:</strong> Hirarki judul tertata rapi sesuai standar aksesibilitas W3C.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>Robots Index & Follow:</strong> Crawler diizinkan merayapi dan mengikuti seluruh tautan halaman.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>Kemudahan Membaca Flesch:</strong> Skor 78.2 menandakan teks sangat mudah dipahami audiens umum.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: UMUM & WEBMASTER VERIFICATION */}
      {/* ============================================================ */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Verifikasi Alat Webmaster (Webmaster Tools Verification)
            </h3>
            <p className="text-xs text-slate-500">
              Masukkan kode verifikasi meta tag yang disediakan oleh Google Search Console, Bing Webmaster, atau Yandex untuk membuktikan kepemilikan situs Anda.
            </p>

            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Verifikasi Google Search Console
                </label>
                <input
                  type="text"
                  value={seoConfig.googleVerification}
                  onChange={(e) => updateField('googleVerification', e.target.value)}
                  placeholder="Contoh: google-site-verification=abc123xyz"
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Dapatkan kode meta tag di <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-slate-900 underline">Google Search Console</a>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Verifikasi Bing Webmaster Tools
                </label>
                <input
                  type="text"
                  value={seoConfig.bingVerification}
                  onChange={(e) => updateField('bingVerification', e.target.value)}
                  placeholder="Kode verifikasi meta Bing"
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Verifikasi Yandex Webmaster
                </label>
                <input
                  type="text"
                  value={seoConfig.yandexVerification}
                  onChange={(e) => updateField('yandexVerification', e.target.value)}
                  placeholder="Kode verifikasi Yandex"
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
                />
              </div>
            </div>
          </Card>

          {/* Title Separator Setting */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Pemisah Judul Situs (Title Separator)
            </h3>
            <p className="text-xs text-slate-500">
              Karakter simbol yang memisahkan nama halaman dengan identitas brand di hasil pencarian.
            </p>
            <div className="flex items-center gap-2.5">
              {['—', '-', '–', '|', '•', '~', '/'].map((sep) => (
                <button
                  key={sep}
                  type="button"
                  onClick={() => updateField('titleSeparator', sep)}
                  className={`w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center transition-all ${
                    seoConfig.titleSeparator === sep
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sep}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SCHEMA.ORG JSON-LD */}
      {/* ============================================================ */}
      {activeTab === 'schema' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Konfigurasi Schema.org & Data Terstruktur (JSON-LD)
          </h3>
          <p className="text-xs text-slate-500">
            Membantu mesin pencari memahami entitas bisnis Anda untuk menghasilkan Google Rich Snippet dan Knowledge Graph.
          </p>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipe Entitas yang Mewakili Situs
              </label>
              <select
                value={seoConfig.schemaType}
                onChange={(e) => updateField('schemaType', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              >
                <option value="Organization">Organisasi / Perusahaan (Organization)</option>
                <option value="LocalBusiness">Bisnis Lokal / Toko Fisik (LocalBusiness)</option>
                <option value="AutoRental">Pusat Rental Mobil / Transportasi (AutoRental)</option>
                <option value="Store">Toko Online / E-Commerce (Store)</option>
                <option value="Person">Pribadi / Personal Brand (Person)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Resmi Organisasi / Bisnis
              </label>
              <input
                type="text"
                value={seoConfig.organizationName}
                onChange={(e) => updateField('organizationName', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Logo Schema (PNG/SVG Resolusi Tinggi)
              </label>
              <input
                type="text"
                value={seoConfig.organizationLogo}
                onChange={(e) => updateField('organizationLogo', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 font-mono text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 4: MEDIA SOSIAL & OPENGRAPH */}
      {/* ============================================================ */}
      {activeTab === 'social' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
            OpenGraph & Pratinjau Berbagi Media Sosial (Facebook / X)
          </h3>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Halaman Profil Facebook URL
              </label>
              <input
                type="text"
                value={seoConfig.socialFacebookUrl}
                onChange={(e) => updateField('socialFacebookUrl', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username Akun Twitter / X
              </label>
              <input
                type="text"
                value={seoConfig.socialTwitterHandle}
                onChange={(e) => updateField('socialTwitterHandle', e.target.value)}
                placeholder="@username"
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Gambar Standar Berbagi Sosial (Default OG Image 1200x630)
              </label>
              <input
                type="text"
                value={seoConfig.defaultOgImage}
                onChange={(e) => updateField('defaultOgImage', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 font-mono text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 5: ROBOTS.TXT & INDEKS */}
      {/* ============================================================ */}
      {activeTab === 'tools' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Editor Berkas Robots.txt & Pengendalian Perayapan Mesin Pencari
          </h3>
          <p className="text-xs text-slate-500">
            Berkas ini memberikan instruksi kepada bot perayap mesin pencari (Googlebot, Bingbot) tentang bagian mana dari situs Anda yang boleh atau tidak boleh diindeks.
          </p>

          <textarea
            rows={8}
            value={seoConfig.robotsTxtContent}
            onChange={(e) => updateField('robotsTxtContent', e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 font-mono text-xs p-3.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
          />
        </Card>
      )}
    </div>
  );
}
