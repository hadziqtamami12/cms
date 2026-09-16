import React, { useState, useEffect, useMemo } from 'react';
import {
  Monitor, Tablet, Smartphone, Save, ArrowLeft, Eye, Undo2,
  Sparkles, Layers, Sliders, Palette, Search, Check, ChevronDown,
  ChevronRight, Plus, Trash2, Image, Type, Car, CheckCircle2,
  AlertCircle, RefreshCw, ExternalLink, HelpCircle, Shield, Globe,
  MessageCircle
} from 'lucide-react';
import YoastSeoPanel from './components/YoastSeoPanel';
import PublicLanding from '../pages/PublicLanding';
import { saveAdminPage } from '../utils/api';

/**
 * AdminPageBuilder - Elementor Pro-Style Split-Screen Visual Page Builder
 * - Docked Inspector Sidebar on Left (w-96)
 * - Live Responsive Sandbox Canvas on Right (Desktop, Tablet, Mobile PWA frames)
 * - Accordions: Hero Banner, Katalog Produk/Armada, Styling & Tokens, SEO & Meta (Yoast)
 */
export default function AdminPageBuilder({
  page = null,
  onBack = () => {},
  onSaved = () => {},
}) {
  // --- Active Inspector Accordion / Tab ---
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'style' | 'seo' | 'settings'
  const [openAccordion, setOpenAccordion] = useState('hero'); // 'hero' | 'fleet' | 'whatsapp' | 'tokens' | 'seo'
  
  // --- Responsive Device Preview Canvas State ---
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [zoomScale, setZoomScale] = useState(100); // 100 | 85 | 75
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // --- 1. Hero State ---
  const [heroConfig, setHeroConfig] = useState({
    mode: 'slideshow', // 'static' | 'slideshow'
    autoplayInterval: 5,
    aspectRatio: '16:9',
    overlayOpacity: 45,
    slides: [
      {
        id: 's1',
        badge: 'Layanan VIP Rental 24 Jam • #1 Terpercaya',
        title: 'Perjalanan Mewah & Berkelas dengan Armada Terbaik',
        subtitle: 'Armada tahun terbaru, kabin bersih wangi berkelas, siap lepas kunci atau supir eksekutif ramah berpengalaman.',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
        ctaPrimaryText: 'Pilih Armada Mobil',
        ctaPrimaryLink: '#fleet',
        ctaSecondaryText: 'Chat WhatsApp 24 Jam',
        ctaSecondaryLink: 'https://wa.me/6281234567890',
      },
      {
        id: 's2',
        badge: 'Armada Eksekutif • Siap Antar Jemput Bandara',
        title: 'Toyota Alphard Transformer & Vellfire VIP',
        subtitle: 'Kenyamanan kelas bisnis dengan captain seat mewah, privasi maksimal, dan fasilitas bintang lima untuk tamu kehormatan.',
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600&auto=format&fit=crop',
        ctaPrimaryText: 'Booking Alphard VIP',
        ctaPrimaryLink: '#fleet',
        ctaSecondaryText: 'Konsultasi Gratis',
        ctaSecondaryLink: 'https://wa.me/6281234567890',
      },
    ],
  });

  // --- 2. Fleet / Product Catalog State ---
  const [fleetConfig, setFleetConfig] = useState({
    title: 'Pilihan Kendaraan Mewah & Keluarga',
    subtitle: 'Unit tahun 2024-2025 dengan kondisi prima, siap diberangkatkan hari ini.',
    vehicles: [
      {
        id: 'car-1',
        name: 'Toyota Alphard Transformer VIP',
        category: 'VIP Luxury',
        priceLepasKunci: 'Rp 2.500.000',
        priceWithDriver: 'Rp 2.800.000',
        transmission: 'Matic TNGA',
        capacity: '6 Kursi VIP',
        fuel: 'Bensin',
        luggage: '4 Koper',
        rating: 5.0,
        badge: 'Paling Populer',
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
        description: 'Pilihan utama tamu VIP, direksi, dan perjalanan bisnis mewah dengan kenyamanan kabin kedap suara.',
      },
      {
        id: 'car-2',
        name: 'Toyota Innova Zenix Hybrid',
        category: 'MPV Keluarga',
        priceLepasKunci: 'Rp 750.000',
        priceWithDriver: 'Rp 950.000',
        transmission: 'Matic CVT',
        capacity: '7 Penumpang',
        fuel: 'Hybrid Irit',
        luggage: '3 Koper',
        rating: 4.9,
        badge: 'Paling Laris',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
        description: 'Kombinasi sempurna kenyamanan keluarga, efisiensi bahan bakar maksimal, dan kabin lapang modern.',
      },
      {
        id: 'car-3',
        name: 'Toyota Fortuner 2.8 GR Sport',
        category: 'SUV Tangguh',
        priceLepasKunci: 'Rp 1.200.000',
        priceWithDriver: 'Rp 1.450.000',
        transmission: 'Matic 4x2',
        capacity: '7 Penumpang',
        fuel: 'Diesel Turbo',
        luggage: '4 Koper',
        rating: 4.9,
        badge: 'Gagah & Kuat',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
        description: 'SUV gagah berdaya tangguh untuk perjalanan luar kota, kunjungan proyek, atau liburan medan berliku.',
      },
    ],
  });

  // --- 3. Styling Tokens State ---
  const [stylingTokens, setStylingTokens] = useState({
    primaryColor: '#4f46e5',
    accentColor: '#f59e0b',
    surfaceColor: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardRadius: 'rounded-2xl',
    enableMeshGradient: true,
  });

  // --- 4. SEO & Meta State ---
  const [seoData, setSeoData] = useState({
    metaTitle: page?.seo?.metaTitle || page?.title || 'Sewa Mobil Murah & Armada VIP 24 Jam | Samudera VIP',
    metaDescription: page?.seo?.metaDescription || 'Pusat sewa mobil dan armada eksekutif terlengkap. Tersedia Alphard, Zenix, Fortuner lepas kunci atau all-in supir ramah.',
    focusKeyphrase: page?.seo?.focusKeyphrase || 'sewa mobil vip jakarta',
    canonicalUrl: page?.seo?.canonicalUrl || '',
    jsonLdType: page?.seo?.jsonLdType || 'AutoRental',
  });

  // --- 5. Floating WhatsApp Widget State ---
  const [floatingWhatsappConfig, setFloatingWhatsappConfig] = useState({
    enabled: page?.floatingWhatsapp?.enabled !== undefined ? page.floatingWhatsapp.enabled : true,
    phoneNumber: page?.floatingWhatsapp?.phoneNumber || page?.header?.whatsappNumber || '6281234567890',
    agentName: page?.floatingWhatsapp?.agentName || 'Customer Support VIP',
    agentStatus: page?.floatingWhatsapp?.agentStatus || 'Online (Respon Cepat)',
    greetingMessage: page?.floatingWhatsapp?.greetingMessage || 'Halo! Ada yang bisa kami bantu seputar sewa mobil atau informasi armada?',
    defaultMessage: page?.floatingWhatsapp?.defaultMessage || 'Halo Admin, saya ingin reservasi/tanya ketersediaan armada mobil.',
  });

  // Header & Footer
  const [headerConfig, setHeaderConfig] = useState({
    brandName: page?.header?.brandName || 'Samudera VIP Transport',
    whatsappNumber: page?.header?.whatsappNumber || '6281234567890',
  });

  // Pre-fill from page data if available
  useEffect(() => {
    if (page) {
      if (page.seo) setSeoData((prev) => ({ ...prev, ...page.seo }));
      if (page.header?.brandName) setHeaderConfig((prev) => ({ ...prev, brandName: page.header.brandName }));
      if (page.header?.whatsappNumber) setHeaderConfig((prev) => ({ ...prev, whatsappNumber: page.header.whatsappNumber }));
      if (page.floatingWhatsapp) setFloatingWhatsappConfig((prev) => ({ ...prev, ...page.floatingWhatsapp }));
    }
  }, [page]);

  // Image presets helper for easy testing
  const IMAGE_PRESETS = [
    { label: 'Alphard Transformer VIP', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600' },
    { label: 'Porsche / Sport Luxury', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600' },
    { label: 'SUV Offroad / Fortuner', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600' },
    { label: 'Modern City MPV', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1600' },
  ];

  // Save Handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...(page || {}),
        id: page?.id || 'page_home',
        slug: page?.slug || 'home',
        title: seoData.metaTitle || 'Landing Page',
        header: headerConfig,
        seo: seoData,
        styling: stylingTokens,
        hero: heroConfig,
        fleet: fleetConfig,
        floatingWhatsapp: floatingWhatsappConfig,
        updatedAt: new Date().toISOString(),
      };

      const res = await saveAdminPage(payload);
      setSaveToast({ type: 'success', message: 'Perubahan berhasil disimpan dan dipublikasikan!' });
      if (onSaved) onSaved(res);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveToast({ type: 'error', message: err.message || 'Gagal menyimpan data.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveToast(null), 3500);
    }
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? '' : section);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER APP BAR (Elementor Studio Bar) */}
      {/* ========================================================================= */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Brand & Page Context */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Kembali ke CMS Manager"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Keluar</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center font-black text-xs text-white shadow-xs">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-tight">Elementor Studio Pro</span>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Builder
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                {page?.title || 'Halaman Utama'} ({page?.slug || 'home'})
              </p>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher (Desktop, Tablet, Mobile PWA) & Zoom */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Pratinjau Desktop (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                previewDevice === 'tablet'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Pratinjau Tablet iPad (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Pratinjau Mobile PWA (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile PWA</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Zoom scale */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 pr-1">
            <button
              type="button"
              onClick={() => setZoomScale(zoomScale === 100 ? 85 : zoomScale === 85 ? 75 : 100)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
            >
              {zoomScale}%
            </button>
          </div>
        </div>

        {/* Right: Publish / Save CTA */}
        <div className="flex items-center gap-2">
          <a
            href={`/?page=${page?.slug || 'home'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Web</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md flex items-center gap-1.5 transition-all disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Publikasikan</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold text-white border ${
              saveToast.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-red-600 border-red-500'
            }`}
          >
            {saveToast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{saveToast.message}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BODY SPLIT-SCREEN LAYOUT: DOCKED INSPECTOR (LEFT) & SANDBOX (RIGHT) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* ------------------------------------------------------------- */}
        {/* LEFT DOCKED INSPECTOR PANEL (w-96)                            */}
        {/* ------------------------------------------------------------- */}
        <aside className="w-96 min-w-[24rem] max-w-[24rem] h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 shrink-0 shadow-2xl">
          {/* Top Panel Tabs (Content, Style, SEO Suite) */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/60 text-xs font-bold px-2 pt-2 gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2.5 rounded-t-lg flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'content'
                  ? 'bg-slate-900 border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Konten</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-2.5 rounded-t-lg flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'style'
                  ? 'bg-slate-900 border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Gaya</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`flex-1 py-2.5 rounded-t-lg flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'seo'
                  ? 'bg-slate-900 border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Yoast SEO</span>
            </button>
          </div>

          {/* Inspector Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {/* ========================================================= */}
            {/* TAB: CONTENT (ACCORDIONS: HERO, FLEET CATALOG)            */}
            {/* ========================================================= */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                {/* ACCORDION 1: HERO BANNER */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('hero')}
                    className="w-full px-3.5 py-3 flex items-center justify-between text-left font-bold text-slate-200 hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Hero Banner</span>
                    </span>
                    {openAccordion === 'hero' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openAccordion === 'hero' && (
                    <div className="p-3.5 space-y-4 border-t border-slate-800 bg-slate-900/60">
                      {/* Toggle Static vs Slideshow */}
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="font-semibold text-slate-300">Mode Tampilan Hero</span>
                        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700">
                          <button
                            type="button"
                            onClick={() => setHeroConfig({ ...heroConfig, mode: 'static' })}
                            className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors ${
                              heroConfig.mode === 'static' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Static
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroConfig({ ...heroConfig, mode: 'slideshow' })}
                            className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors ${
                              heroConfig.mode === 'slideshow' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Slideshow
                          </button>
                        </div>
                      </div>

                      {/* Autoplay Interval Slider (if slideshow) */}
                      {heroConfig.mode === 'slideshow' && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-slate-300 font-medium">Autoplay Interval</label>
                            <span className="text-[11px] font-bold text-indigo-400">
                              {heroConfig.autoplayInterval} detik
                            </span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="10"
                            step="1"
                            value={heroConfig.autoplayInterval}
                            onChange={(e) => setHeroConfig({ ...heroConfig, autoplayInterval: Number(e.target.value) })}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      )}

                      {/* Aspect Ratio Selector */}
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-medium">Rasio Auto-Fit Gambar</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {['16:9', '21:9', '4:3', 'fullscreen'].map((ratio) => (
                            <button
                              key={ratio}
                              type="button"
                              onClick={() => setHeroConfig({ ...heroConfig, aspectRatio: ratio })}
                              className={`py-1.5 rounded-lg font-bold text-[10px] border transition-all ${
                                heroConfig.aspectRatio === ratio
                                  ? 'bg-indigo-600 border-indigo-500 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {ratio === 'fullscreen' ? 'Full' : ratio}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Slide Text Inputs */}
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-semibold text-[11px]">Badge Text</label>
                          <input
                            type="text"
                            value={heroConfig.slides[0]?.badge || ''}
                            onChange={(e) => {
                              const nextSlides = [...heroConfig.slides];
                              nextSlides[0] = { ...nextSlides[0], badge: e.target.value };
                              setHeroConfig({ ...heroConfig, slides: nextSlides });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 font-semibold text-[11px]">Judul Utama (H1)</label>
                          <textarea
                            rows={2}
                            value={heroConfig.slides[0]?.title || ''}
                            onChange={(e) => {
                              const nextSlides = [...heroConfig.slides];
                              nextSlides[0] = { ...nextSlides[0], title: e.target.value };
                              setHeroConfig({ ...heroConfig, slides: nextSlides });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 font-semibold text-[11px]">Subjudul Rangkuman</label>
                          <textarea
                            rows={2}
                            value={heroConfig.slides[0]?.subtitle || ''}
                            onChange={(e) => {
                              const nextSlides = [...heroConfig.slides];
                              nextSlides[0] = { ...nextSlides[0], subtitle: e.target.value };
                              setHeroConfig({ ...heroConfig, slides: nextSlides });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white resize-none"
                          />
                        </div>

                        {/* Image Uploader / Selector with Quick Presets */}
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-semibold text-[11px] flex items-center justify-between">
                            <span>URL Gambar Utama</span>
                            <span className="text-indigo-400 text-[10px]">Preset Cepat</span>
                          </label>
                          <input
                            type="text"
                            value={heroConfig.slides[0]?.imageUrl || ''}
                            onChange={(e) => {
                              const nextSlides = [...heroConfig.slides];
                              nextSlides[0] = { ...nextSlides[0], imageUrl: e.target.value };
                              setHeroConfig({ ...heroConfig, slides: nextSlides });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px]"
                          />
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {IMAGE_PRESETS.map((p, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  const nextSlides = [...heroConfig.slides];
                                  nextSlides[0] = { ...nextSlides[0], imageUrl: p.url };
                                  setHeroConfig({ ...heroConfig, slides: nextSlides });
                                }}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 truncate text-left"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Overlay Darkness Slider */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Kegelapan Overlay Foto</span>
                            <span className="text-slate-300 font-bold">{heroConfig.overlayOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="90"
                            value={heroConfig.overlayOpacity}
                            onChange={(e) => setHeroConfig({ ...heroConfig, overlayOpacity: Number(e.target.value) })}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION 2: KATALOG PRODUK / ARMADA */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('fleet')}
                    className="w-full px-3.5 py-3 flex items-center justify-between text-left font-bold text-slate-200 hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-emerald-400" />
                      <span>Katalog Produk / Armada</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                        {fleetConfig.vehicles.length} unit
                      </span>
                    </span>
                    {openAccordion === 'fleet' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openAccordion === 'fleet' && (
                    <div className="p-3.5 space-y-4 border-t border-slate-800 bg-slate-900/60">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-semibold text-[11px]">Judul Bagian Katalog</label>
                        <input
                          type="text"
                          value={fleetConfig.title}
                          onChange={(e) => setFleetConfig({ ...fleetConfig, title: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>

                      {/* Fleet Items List */}
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300 text-xs">Daftar Kendaraan</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newCar = {
                                id: `car-${Date.now()}`,
                                name: 'New Executive Unit',
                                category: 'VIP Luxury',
                                priceLepasKunci: 'Rp 800.000',
                                priceWithDriver: 'Rp 1.100.000',
                                transmission: 'Matic',
                                capacity: '7 Kursi',
                                fuel: 'Bensin',
                                luggage: '3 Koper',
                                rating: 5.0,
                                badge: 'Unit Baru',
                                imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
                                description: 'Unit terawat wangi prima siap antar jemput bandara maupun wisata.',
                              };
                              setFleetConfig({ ...fleetConfig, vehicles: [newCar, ...fleetConfig.vehicles] });
                            }}
                            className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Unit</span>
                          </button>
                        </div>

                        {fleetConfig.vehicles.map((car, idx) => (
                          <div
                            key={car.id}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200 text-xs truncate max-w-[180px]">
                                {car.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = fleetConfig.vehicles.filter((_, i) => i !== idx);
                                  setFleetConfig({ ...fleetConfig, vehicles: updated });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Hapus unit"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-500">Nama Mobil</label>
                                <input
                                  type="text"
                                  value={car.name}
                                  onChange={(e) => {
                                    const updated = [...fleetConfig.vehicles];
                                    updated[idx].name = e.target.value;
                                    setFleetConfig({ ...fleetConfig, vehicles: updated });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-500">Kategori</label>
                                <input
                                  type="text"
                                  value={car.category}
                                  onChange={(e) => {
                                    const updated = [...fleetConfig.vehicles];
                                    updated[idx].category = e.target.value;
                                    setFleetConfig({ ...fleetConfig, vehicles: updated });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-500">Tarif Lepas Kunci</label>
                                <input
                                  type="text"
                                  value={car.priceLepasKunci}
                                  onChange={(e) => {
                                    const updated = [...fleetConfig.vehicles];
                                    updated[idx].priceLepasKunci = e.target.value;
                                    setFleetConfig({ ...fleetConfig, vehicles: updated });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-500">Tarif + Supir</label>
                                <input
                                  type="text"
                                  value={car.priceWithDriver}
                                  onChange={(e) => {
                                    const updated = [...fleetConfig.vehicles];
                                    updated[idx].priceWithDriver = e.target.value;
                                    setFleetConfig({ ...fleetConfig, vehicles: updated });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION 3: FLOATING WHATSAPP WIDGET */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('whatsapp')}
                    className="w-full px-3.5 py-3 flex items-center justify-between text-left font-bold text-slate-200 hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Floating WhatsApp Widget</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        floatingWhatsappConfig.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {floatingWhatsappConfig.enabled ? 'Aktif' : 'Nonaktif'}
                      </span>
                      {openAccordion === 'whatsapp' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {openAccordion === 'whatsapp' && (
                    <div className="p-3.5 space-y-3.5 border-t border-slate-800 bg-slate-900/60">
                      {/* Toggle Switch */}
                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <span className="font-semibold text-slate-200 block">Status Floating WA</span>
                          <span className="text-[10px] text-slate-400">Tombol WA mengapung di kanan bawah</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFloatingWhatsappConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                            floatingWhatsappConfig.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {floatingWhatsappConfig.enabled ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold flex items-center justify-between">
                          <span>Nomor WhatsApp CS</span>
                          <span className="text-[10px] text-slate-500">Awali kode negara (62...)</span>
                        </label>
                        <input
                          type="text"
                          value={floatingWhatsappConfig.phoneNumber}
                          onChange={(e) => setFloatingWhatsappConfig((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="6281234567890"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      {/* Agent Name */}
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold">Nama Agen / CS</label>
                        <input
                          type="text"
                          value={floatingWhatsappConfig.agentName}
                          onChange={(e) => setFloatingWhatsappConfig((prev) => ({ ...prev, agentName: e.target.value }))}
                          placeholder="Customer Support VIP"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      {/* Agent Status */}
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold">Status Kehadiran Agen</label>
                        <input
                          type="text"
                          value={floatingWhatsappConfig.agentStatus}
                          onChange={(e) => setFloatingWhatsappConfig((prev) => ({ ...prev, agentStatus: e.target.value }))}
                          placeholder="Online (Respon Cepat)"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      {/* Greeting Message */}
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold">Pesan Sambutan (Pop-up Chat)</label>
                        <textarea
                          rows={2}
                          value={floatingWhatsappConfig.greetingMessage}
                          onChange={(e) => setFloatingWhatsappConfig((prev) => ({ ...prev, greetingMessage: e.target.value }))}
                          placeholder="Halo! Ada yang bisa kami bantu seputar sewa mobil?"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      {/* Default Message */}
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold">Template Pesan WhatsApp Konsumen</label>
                        <textarea
                          rows={2}
                          value={floatingWhatsappConfig.defaultMessage}
                          onChange={(e) => setFloatingWhatsappConfig((prev) => ({ ...prev, defaultMessage: e.target.value }))}
                          placeholder="Halo Admin, saya ingin reservasi armada mobil..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: STYLE & TOKENS (COLORS, GOOGLE FONTS, RADIUS)        */}
            {/* ========================================================= */}
            {activeTab === 'style' && (
              <div className="space-y-4">
                {/* Primary Brand Color */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="font-bold text-slate-200 text-xs flex items-center justify-between">
                    <span>Warna Utama (Primary Brand)</span>
                    <span className="font-mono text-[11px] text-slate-400">{stylingTokens.primaryColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={stylingTokens.primaryColor}
                      onChange={(e) => setStylingTokens({ ...stylingTokens, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <div className="flex-1 grid grid-cols-4 gap-1.5">
                      {['#4f46e5', '#2563eb', '#059669', '#0f172a'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setStylingTokens({ ...stylingTokens, primaryColor: c })}
                          className="h-6 rounded-md border border-slate-700"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="font-bold text-slate-200 text-xs flex items-center justify-between">
                    <span>Warna Aksen (Badge & Highlights)</span>
                    <span className="font-mono text-[11px] text-slate-400">{stylingTokens.accentColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={stylingTokens.accentColor}
                      onChange={(e) => setStylingTokens({ ...stylingTokens, accentColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <div className="flex-1 grid grid-cols-4 gap-1.5">
                      {['#f59e0b', '#ec4899', '#06b6d4', '#84cc16'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setStylingTokens({ ...stylingTokens, accentColor: c })}
                          className="h-6 rounded-md border border-slate-700"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google Fonts Picker */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="font-bold text-slate-200 text-xs">Pilihan Font Google</label>
                  <select
                    value={stylingTokens.fontFamily}
                    onChange={(e) => setStylingTokens({ ...stylingTokens, fontFamily: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    <option value="Inter, system-ui, sans-serif">Inter (Modern Clean UI)</option>
                    <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Trendy Corporate)</option>
                    <option value="'Outfit', sans-serif">Outfit (Geometric Bold Character)</option>
                    <option value="'Poppins', sans-serif">Poppins (Friendly Rounded)</option>
                    <option value="'Roboto', sans-serif">Roboto (Universal Standard)</option>
                    <option value="'Playfair Display', serif">Playfair Display (Luxury Editorial)</option>
                  </select>
                </div>

                {/* Card Border Radius */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="font-bold text-slate-200 text-xs">Kelengkungan Sudut Kartu (Radius)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'rounded-lg', label: '8px' },
                      { id: 'rounded-xl', label: '12px' },
                      { id: 'rounded-2xl', label: '16px' },
                      { id: 'rounded-3xl', label: '24px' },
                    ].map((rad) => (
                      <button
                        key={rad.id}
                        type="button"
                        onClick={() => setStylingTokens({ ...stylingTokens, cardRadius: rad.id })}
                        className={`py-1.5 rounded-lg text-center font-bold text-[11px] border transition-all ${
                          stylingTokens.cardRadius === rad.id
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {rad.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mesh Gradient Toggle */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Ambient Gradient Mesh</span>
                    <span className="text-[10px] text-slate-400 block">Pencahayaan radial halus di latar belakang</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={stylingTokens.enableMeshGradient}
                    onChange={(e) => setStylingTokens({ ...stylingTokens, enableMeshGradient: e.target.checked })}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: SEO SUITE (INTEGRATED YOAST PANEL)                   */}
            {/* ========================================================= */}
            {activeTab === 'seo' && (
              <div className="space-y-3">
                <YoastSeoPanel
                  seo={seoData}
                  onChange={(updated) => setSeoData(updated)}
                  pageTitle={page?.title || 'Sewa Mobil Samudera VIP'}
                  h1Text={heroConfig.slides[0]?.title || ''}
                  images={[
                    { url: heroConfig.slides[0]?.imageUrl, alt: heroConfig.slides[0]?.title },
                    ...fleetConfig.vehicles.map(v => ({ url: v.imageUrl, alt: v.name }))
                  ]}
                  siteDomain="samuderarental.com"
                  slug={page?.slug || 'home'}
                  brandName={headerConfig.brandName}
                />
              </div>
            )}
          </div>

          {/* Inspector Sticky Bottom Actions */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-400 text-[11px]">
              Draft terhubung otomatis
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </aside>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT LIVE RESPONSIVE CANVAS SANDBOX                          */}
        {/* ------------------------------------------------------------- */}
        <main className="flex-1 h-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 relative">
          {/* Subtle Grid Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Sandbox Frame Container */}
          <div
            className="h-full w-full flex items-center justify-center transition-all duration-300"
            style={{ transform: `scale(${zoomScale / 100})` }}
          >
            {/* 1. DESKTOP CANVAS (Full Fluid Width) */}
            {previewDevice === 'desktop' && (
              <div className="w-full h-full rounded-2xl overflow-y-auto border border-slate-800 shadow-2xl bg-white text-slate-900 custom-scrollbar">
                <PublicLanding
                  hero={heroConfig}
                  fleet={fleetConfig}
                  styling={stylingTokens}
                  header={headerConfig}
                  floatingWhatsapp={floatingWhatsappConfig}
                  footer={{
                    brandName: headerConfig.brandName,
                    phone: headerConfig.whatsappNumber,
                  }}
                  isCanvasPreview={true}
                />
              </div>
            )}

            {/* 2. TABLET IPAD CANVAS (768px Width with Bezel) */}
            {previewDevice === 'tablet' && (
              <div className="w-[768px] h-[95%] rounded-[36px] p-3.5 bg-slate-900 border-4 border-slate-800 shadow-2xl flex flex-col shrink-0">
                {/* iPad Camera Notch */}
                <div className="w-full flex justify-center pb-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                </div>
                <div className="flex-1 rounded-[24px] overflow-y-auto bg-white text-slate-900 custom-scrollbar">
                  <PublicLanding
                    hero={heroConfig}
                    fleet={fleetConfig}
                    styling={stylingTokens}
                    header={headerConfig}
                    floatingWhatsapp={floatingWhatsappConfig}
                    footer={{
                      brandName: headerConfig.brandName,
                      phone: headerConfig.whatsappNumber,
                    }}
                    isCanvasPreview={true}
                  />
                </div>
              </div>
            )}

            {/* 3. MOBILE PWA CANVAS (390px Width with Dynamic Island & Safe Area) */}
            {previewDevice === 'mobile' && (
              <div className="w-[390px] h-[95%] rounded-[48px] p-3.5 bg-slate-900 border-[6px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col shrink-0 relative">
                {/* Dynamic Island Pill Notch */}
                <div className="w-full flex justify-center pt-1 pb-2">
                  <div className="w-28 h-6 bg-slate-950 rounded-full flex items-center justify-between px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/60 ring-1 ring-indigo-500/40" />
                  </div>
                </div>

                {/* Phone Screen Sandbox */}
                <div className="flex-1 rounded-[36px] overflow-y-auto bg-white text-slate-900 custom-scrollbar relative pb-16">
                  <PublicLanding
                    hero={heroConfig}
                    fleet={fleetConfig}
                    styling={stylingTokens}
                    header={headerConfig}
                    floatingWhatsapp={floatingWhatsappConfig}
                    footer={{
                      brandName: headerConfig.brandName,
                      phone: headerConfig.whatsappNumber,
                    }}
                    isCanvasPreview={true}
                  />
                </div>

                {/* Home Indicator Bottom Bar */}
                <div className="w-full flex justify-center pt-2 pb-1">
                  <div className="w-32 h-1 rounded-full bg-slate-700" />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
