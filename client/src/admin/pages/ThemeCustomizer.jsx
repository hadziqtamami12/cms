import React, { useState, useEffect } from 'react';
import {
  Palette, Check, Search, ExternalLink, Sliders, CheckCircle2,
  Sparkles, Eye, Info, X, Shield, RefreshCw, Monitor, Tablet,
  Smartphone, Star, MessageSquare, ArrowRight, ChevronRight,
  ShoppingBag, Layers, Layout, HelpCircle, Phone, Send, Clock,
  DollarSign, Zap, Globe, ShoppingCart, Award, Cpu, BookOpen,
  Car, CheckCheck, TrendingUp, Download, Terminal, Tag, FileText
} from 'lucide-react';
import { fetchAdminPages, saveAdminPage } from '../../utils/api';
import { getThemePresetData } from '../../utils/themePresets';

export const WP_THEMES = [
  {
    id: 'twenty-twenty-five',
    name: 'Twenty Twenty-Five',
    version: '1.0',
    author: 'Tim WordPress',
    screenshot: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800',
    description: 'Tema default resmi WordPress 6.7 yang menghadirkan estetika editorial modern, tipografi lapang berstandar internasional, tata letak blok fleksibel, dan performa super cepat tanpa bloatware. Sempurna untuk blog berita, majalah, dan profil usaha.',
    tags: ['Resmi WP 6.7', 'Editorial', 'Berita & Opini', 'Minimalis', 'Gutenberg Blocks'],
    colorMode: 'light',
    primaryColor: '#18181b',
    accentColor: '#3f3f46',
    category: 'Blog & Editorial',
  },
  {
    id: 'twenty-twenty-four',
    name: 'Twenty Twenty-Four',
    version: '1.2',
    author: 'Tim WordPress',
    screenshot: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
    description: 'Tema standar resmi WordPress 6.4 yang dirancang serbaguna untuk segala skala usaha, agensi korporat, dan konsultasi profesional. Menghadirkan keseimbangan estetika elegan dan struktur navigasi intuitif.',
    tags: ['Resmi WP 6.4', 'Korporat', 'Agensi', 'Multi-Niche', 'Aksesibilitas'],
    colorMode: 'light',
    primaryColor: '#18181b',
    accentColor: '#52525b',
    category: 'Bisnis & Agensi',
  },
  {
    id: 'twenty-twenty-three',
    name: 'Twenty Twenty-Three',
    version: '1.5',
    author: 'Tim WordPress',
    screenshot: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    description: 'Tema kanvas minimalis resmi WordPress 6.1 dengan fokus pada kesederhanaan, ruang negatif lapang, tipografi bersih, dan kecepatan loading kilat tanpa beban skrip.',
    tags: ['Resmi WP 6.1', 'Minimalis', 'Kanvas Seni', 'FSE Block', 'Cepat'],
    colorMode: 'light',
    primaryColor: '#27272a',
    accentColor: '#71717a',
    category: 'Portofolio Minimalis',
  },
  {
    id: 'twenty-twenty-two',
    name: 'Twenty Twenty-Two',
    version: '1.8',
    author: 'Tim WordPress',
    screenshot: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800',
    description: 'Tema blok penuh resmi WordPress 5.9 yang terinspirasi oleh keindahan alam burung dan lanskap hijau. Menampilkan gaya artistik alami untuk museum, yayasan, dan proyek kreatif.',
    tags: ['Resmi WP 5.9', 'Artistik', 'Alam & Budaya', 'Showcase Visual'],
    colorMode: 'light',
    primaryColor: '#1c1917',
    accentColor: '#047857',
    category: 'Kreatif & Alam',
  },
  {
    id: 'twenty-twenty-one',
    name: 'Twenty Twenty-One',
    version: '2.1',
    author: 'Tim WordPress',
    screenshot: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800',
    description: 'Tema kanvas klasik resmi WordPress 5.6 dengan warna pastel yang tenang, tipografi ramah pembaca, dan standar aksesibilitas tertinggi untuk para penulis esai dan jurnalis.',
    tags: ['Resmi WP 5.6', 'Penulisan', 'Pastel Lembut', 'Ramah Mata'],
    colorMode: 'light',
    primaryColor: '#065f46',
    accentColor: '#10b981',
    category: 'Penulisan & Jurnal',
  },
  {
    id: 'astra-clean',
    name: 'Astra',
    version: '4.8.5',
    author: 'Brainstorm Force',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
    description: 'Tema WordPress terpopuler di dunia dengan lebih dari 1,6 juta pengguna aktif. Sangat ringan (<50KB), ramah SEO Google, dan dapat disesuaikan untuk segala profil bisnis atau toko online.',
    tags: ['Paling Populer', 'Toko Online', 'Marketing', 'Super Cepat', 'Ramah SEO'],
    colorMode: 'light',
    primaryColor: '#18181b',
    accentColor: '#10b981',
    category: 'Multipurpose',
  },
  {
    id: 'generatepress-corp',
    name: 'GeneratePress',
    version: '3.4.2',
    author: 'Tom Usborne',
    screenshot: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
    description: 'Tema WordPress legendaris berfokus pada kecepatan 100% PageSpeed dan aksesibilitas standar WCAG 2.0. Kode modular bersih tanpa beban script berlebih.',
    tags: ['100% PageSpeed', 'Aksesibilitas', 'Ultra Ringan', 'Standar WCAG'],
    colorMode: 'light',
    primaryColor: '#047857',
    accentColor: '#065f46',
    category: 'Performa Tinggi',
  },
  {
    id: 'kadence-pro',
    name: 'Kadence WP',
    version: '1.4.0',
    author: 'Kadence WP',
    screenshot: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800',
    description: 'Tema WordPress modern serbaguna dengan integrasi formulir kontak instan WhatsApp, responsif mobile-first, dan kartu profil yang terstruktur rapi untuk konversi penjualan.',
    tags: ['Konversi Tinggi', 'Blok Dinamis', 'Bisnis', 'WhatsApp Lead'],
    colorMode: 'light',
    primaryColor: '#27272a',
    accentColor: '#10b981',
    category: 'Konversi & Lead',
  },
  {
    id: 'oceanwp-store',
    name: 'OceanWP',
    version: '3.6.1',
    author: 'OceanWP Team',
    screenshot: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    description: 'Tema responsif berfitur lengkap untuk armada transportasi, rental kendaraan VIP, dan katalog produk ritel dengan kartu spesifikasi mendalam.',
    tags: ['Rental Mobil VIP', 'Katalog Layanan', 'Toko Ritel', 'WhatsApp Order'],
    colorMode: 'light',
    primaryColor: '#18181b',
    accentColor: '#059669',
    category: 'Transport & Rental',
  },
  {
    id: 'neve-startup',
    name: 'Neve',
    version: '3.8.4',
    author: 'ThemeIsle',
    screenshot: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800',
    description: 'Desain mobile-first super ringan yang dibangun untuk startup teknologi, aplikasi SaaS, dan konsultan profesional dengan dukungan AMP dan performa loading instan.',
    tags: ['Mobile First', 'Tech Startup', 'Konsultan', 'AMP Ready'],
    colorMode: 'light',
    primaryColor: '#18181b',
    accentColor: '#ea580c',
    category: 'Startup & Tech',
  },
  {
    id: 'storefront-shop',
    name: 'Storefront',
    version: '4.5.3',
    author: 'WooCommerce',
    screenshot: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800',
    description: 'Tema resmi pengembang WooCommerce. Fondasi toko online yang solid, bebas konflik plugin, dengan kisi produk terstruktur rapi dan alur pemesanan mudah.',
    tags: ['Resmi WooCommerce', 'Produk Digital', 'E-Commerce', 'Kasir Cepat'],
    colorMode: 'light',
    primaryColor: '#18181b',
    accentColor: '#7c3aed',
    category: 'E-Commerce Resmi',
  },
  {
    id: 'blocksy-mag',
    name: 'Blocksy',
    version: '2.0.42',
    author: 'CreativeThemes',
    screenshot: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800',
    description: 'Tema Gutenberg generasi baru berarsitektur modern untuk majalah digital, review gadget, portal berita, dan ulasan teknologi terkini dengan tipografi tajam.',
    tags: ['Next-Gen FSE', 'Majalah Modern', 'Review Tech', 'Tipografi Tajam'],
    colorMode: 'light',
    primaryColor: '#18181b',
    accentColor: '#059669',
    category: 'Majalah & Ulasan',
  },
];

// Helper to render distinct mockups for all 12 themes
function ThemePreviewMockup({ theme, viewport, accentChoice, mobileNavChoice, onActivate }) {
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  const containerClasses = isMobile
    ? 'w-[375px] bg-white shadow-2xl rounded-[32px] overflow-hidden border-[10px] border-slate-900 min-h-[720px] flex flex-col relative transition-all duration-200 select-none'
    : isTablet
    ? 'w-[768px] bg-white shadow-2xl rounded-2xl overflow-hidden border-8 border-slate-800 min-h-[700px] flex flex-col transition-all duration-200'
    : 'w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 min-h-[600px] flex flex-col transition-all duration-200';

  return (
    <div className={containerClasses}>
      {/* Mobile Simulated Notch & Status Bar */}
      {isMobile && (
        <div className="h-6 bg-slate-900 text-white text-[10px] px-5 flex items-center justify-between shrink-0 select-none">
          <span className="font-semibold">09:41</span>
          <div className="w-16 h-3.5 bg-black rounded-full" />
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono">5G</span>
            <div className="w-4 h-2 border border-white rounded-xs p-0.5 flex items-center">
              <div className="w-2.5 h-1 bg-white rounded-2xs" />
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Theme Body Content (Distinct per Theme ID) */}
      <div className="flex-grow overflow-y-auto bg-white text-slate-800">
        {renderThemeSpecificContent(theme, accentChoice, isMobile)}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <div className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 py-1.5 px-3 shadow-lg select-none">
          {mobileNavChoice === 'curved' ? (
            <div className="flex items-center justify-around text-slate-500 text-[10px]">
              <div className="flex flex-col items-center gap-0.5 text-slate-900 font-bold">
                <Layout className="w-4 h-4" />
                <span>Beranda</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Katalog</span>
              </div>
              {/* Curved Elevated Floating WhatsApp Button */}
              <div className="-mt-5">
                <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-600/20">
                  <MessageSquare className="w-5 h-5 fill-white" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Phone className="w-4 h-4" />
                <span>Kontak</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Palette className="w-4 h-4" />
                <span>Tema</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 text-center text-slate-500 text-[10px]">
              <div className="flex flex-col items-center gap-0.5 text-slate-900 font-bold">
                <Layout className="w-4 h-4" />
                <span>Beranda</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Katalog</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 text-emerald-600 font-semibold">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Phone className="w-4 h-4" />
                <span>Telepon</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderThemeSpecificContent(theme, accentColor, isMobile) {
  switch (theme.id) {
    case 'twenty-twenty-five':
      return (
        <div className="font-serif">
          {/* Editorial Masthead */}
          <header className="border-b border-slate-200 py-4 px-6 text-center">
            <div className="text-[10px] tracking-widest uppercase font-sans text-slate-500 mb-1">
              Edisi Khusus • 16 September 2026 • Arsip Gutenberg
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              THE CHRONICLE & ESSAYS
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs font-sans text-slate-600 mt-2 border-t border-slate-100 pt-2">
              <span className="font-semibold text-slate-900">Berita Utama</span>
              <span>Esai Budaya</span>
              <span>Sains & Teknologi</span>
              <span>Kolom Opini</span>
            </div>
          </header>

          {/* Editorial Featured Story */}
          <article className="p-6 sm:p-8 max-w-3xl mx-auto space-y-4">
            <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-sans font-bold uppercase tracking-wider rounded">
              Laporan Mendalam
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Masa Depan Tipografi Digital di Era Komputasi Generatif
            </h2>
            <div className="text-xs font-sans text-slate-500">
              Oleh <span className="font-bold text-slate-800">Redaksi Editorial</span> • 6 Menit Membaca
            </div>
            <div className="aspect-[16/9] rounded-md overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={theme.screenshot}
                alt="Editorial"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-700 font-sans">
              Bagaimana desainer masa kini memadukan kesederhanaan kanvas putih dengan tipografi terstruktur untuk menghadirkan ketenangan bagi para pembaca di tengah gelombang arus informasi.
            </p>

            <blockquote className="border-l-2 border-slate-900 pl-4 py-1 my-4 italic text-slate-800 text-sm font-serif">
              "Kesederhanaan adalah bentuk tertinggi dari kecanggihan informasi."
            </blockquote>

            {/* Sub-grid stories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400">01 / OPINI</span>
                <h4 className="font-bold text-xs text-slate-900">Merancang Antarmuka yang Menenangkan Jiwa Pembaca</h4>
                <p className="text-[11px] text-slate-500">Evolusi ruang negatif dalam tata kelola konten web modern.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400">02 / RISET</span>
                <h4 className="font-bold text-xs text-slate-900">Standar Aksesibilitas Tipografi WordPress 6.7</h4>
                <p className="text-[11px] text-slate-500">Pemberian kontras teruji untuk kenyamanan membaca jangka panjang.</p>
              </div>
            </div>
          </article>
        </div>
      );

    case 'twenty-twenty-four':
      return (
        <div className="font-sans">
          {/* Corporate Topbar */}
          <header className="border-b border-slate-200 py-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                NX
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900">NEXUS CORP</span>
            </div>
            <nav className="hidden sm:flex items-center gap-5 text-xs font-semibold text-slate-600">
              <span className="text-slate-900">Solusi</span>
              <span>Layanan Bisnis</span>
              <span>Studi Kasus</span>
              <span>Kontak</span>
            </nav>
          </header>

          {/* Corporate Hero */}
          <section className="p-6 sm:p-10 text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-semibold text-slate-800 border border-slate-200">
              <Award className="w-3.5 h-3.5 text-slate-700" />
              <span>Terakreditasi ISO 27001 Enterprise Grade</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Transformasi Digital Terpadu untuk Korporasi Global
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Membangun fondasi infrastruktur cloud yang tangguh, aman, dan dirancang untuk akselerasi pertumbuhan bisnis Anda.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-black transition-colors"
              >
                Mulai Konsultasi
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Profil Perusahaan
              </button>
            </div>
          </section>

          {/* Stats Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 border-y border-slate-200 text-center">
            <div>
              <div className="text-xl font-bold text-slate-900">99.99%</div>
              <div className="text-[11px] text-slate-500">Enterprise SLA</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">18.500+</div>
              <div className="text-[11px] text-slate-500">Klien Korporat</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">4.9 / 5</div>
              <div className="text-[11px] text-slate-500">CSAT Score</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">35+</div>
              <div className="text-[11px] text-slate-500">Negara Mitra</div>
            </div>
          </div>
        </div>
      );

    case 'twenty-twenty-three':
      return (
        <div className="font-mono p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
          <header className="flex items-center justify-between border-b border-slate-300 pb-3 text-xs">
            <span className="font-bold tracking-widest text-slate-900">[CANVAS.STUDIO]</span>
            <div className="flex gap-4 text-slate-500 text-[11px]">
              <span className="text-slate-900 font-bold">[01] WORK</span>
              <span>[02] ABOUT</span>
              <span>[03] ARCHIVE</span>
            </div>
          </header>

          <div className="space-y-4 pt-4">
            <h2 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              KONTUR, RUANG &amp; TIPOGRAFI MURNI.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
              Sebuah eksperimen estetika Swiss-minimalist. Menghilangkan elemen dekoratif yang berlebihan untuk mengedepankan konten utama secara objektif dan jernih.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div className="space-y-2">
              <div className="aspect-[4/3] bg-slate-100 border border-slate-300 overflow-hidden">
                <img src={theme.screenshot} alt="Work 01" className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between text-xs font-bold pt-1">
                <span>01_PROYEK_SPASIAL</span>
                <span className="text-slate-400">2026</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="aspect-[4/3] bg-slate-100 border border-slate-300 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800" alt="Work 02" className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between text-xs font-bold pt-1">
                <span>02_MONOKROM_IDENTITAS</span>
                <span className="text-slate-400">2026</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'twenty-twenty-two':
      return (
        <div className="font-sans">
          <header className="bg-emerald-900 text-white p-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-950 font-bold text-xs">
                🌱
              </div>
              <span className="font-bold text-sm tracking-wide">YAYASAN BUMI LESTARI</span>
            </div>
            <div className="hidden sm:flex gap-4 text-xs text-emerald-200">
              <span>Konservasi</span>
              <span>Keanekaragaman Hayati</span>
              <span>Galeri Hutan</span>
            </div>
          </header>

          <section className="bg-emerald-50/50 p-6 sm:p-10 border-b border-emerald-100">
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md">
                Inisiatif Hijau Nusantara
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950 leading-tight">
                Melindungi Ekosistem Alami &amp; Keanekaragaman Hayati Hutan Indonesia
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed">
                Mendokumentasikan keindahan alam nusantara dan mendukung komunitas lokal dalam melestarikan ekosistem hutan hujan tropis.
              </p>
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-emerald-200 shadow-sm mt-4">
                <img src={theme.screenshot} alt="Nature" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>

          <div className="p-6 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white border border-emerald-100 rounded-lg">
              <div className="text-lg font-bold text-emerald-900">150.000 Ha</div>
              <div className="text-[11px] text-emerald-700">Hutan Terjaga</div>
            </div>
            <div className="p-4 bg-white border border-emerald-100 rounded-lg">
              <div className="text-lg font-bold text-emerald-900">45 Spesies</div>
              <div className="text-[11px] text-emerald-700">Fauna Dilindungi</div>
            </div>
            <div className="p-4 bg-white border border-emerald-100 rounded-lg">
              <div className="text-lg font-bold text-emerald-900">100%</div>
              <div className="text-[11px] text-emerald-700">Relawan Berdaya</div>
            </div>
          </div>
        </div>
      );

    case 'twenty-twenty-one':
      return (
        <div className="font-serif bg-[#fbfbfa] min-h-[500px] p-6 sm:p-10">
          <header className="border-b border-emerald-950/10 pb-4 mb-6 flex justify-between items-baseline">
            <h1 className="text-xl font-bold text-emerald-950">Jurnal Sastra &amp; Pemikiran</h1>
            <span className="text-xs text-emerald-800/70 font-sans">Vol. VII • Catatan Harian</span>
          </header>

          <article className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950 leading-snug">
              Menemukan Ketenangan di Tengah Deru Informasi Kota
            </h2>
            <div className="text-xs font-sans text-emerald-800/60 pb-2">
              Ditulis pada 16 September 2026 • Waktu baca 4 menit
            </div>
            <div className="aspect-[16/9] rounded-sm overflow-hidden border border-emerald-900/10">
              <img src={theme.screenshot} alt="Writing" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-emerald-950/80 leading-relaxed font-sans">
              Dalam hiruk-pikuk kehidupan modern, sebuah halaman putih dengan goresan tinta hitam tetap menjadi ruang paling sunyi untuk menata pemikiran kita kembali.
            </p>
          </article>
        </div>
      );

    case 'astra-clean':
      return (
        <div className="font-sans">
          {/* Top announcement strip */}
          <div className="bg-slate-900 text-white text-[10px] py-1 text-center font-semibold">
            ⚡ PROMO SPESIAL: Diskon Hingga 40% + Bebas Ongkir Seluruh Indonesia
          </div>

          <header className="border-b border-slate-200 py-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <span className="font-bold text-sm text-slate-900">AstraStore Pro</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-medium text-slate-600">Semua Produk</span>
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Keranjang (3)</span>
              </div>
            </div>
          </header>

          {/* Hero Banner */}
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="space-y-3 sm:w-1/2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold rounded">
                Koleksi Baru 2026
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                Peralatan Kerja &amp; Aksesoris Modern Pilihan
              </h2>
              <p className="text-xs text-slate-600">
                Tingkatkan produktivitas harian Anda dengan perangkat berstandar kualitas internasional.
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors"
              >
                Belanja Sekarang
              </button>
            </div>
            <div className="sm:w-1/2 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200">
              <img src={theme.screenshot} alt="Astra Store" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Cards */}
          <div className="p-6 max-w-5xl mx-auto">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-4">
              Produk Terlaris Minggu Ini
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Kemeja Minimalis Oxford', price: 'Rp 249.000', rating: '4.9' },
                { name: 'Sneakers Urban Leather', price: 'Rp 489.000', rating: '5.0' },
                { name: 'Jam Tangan Chrono Elite', price: 'Rp 699.000', rating: '4.8' },
                { name: 'Ransel Laptop Waterproof', price: 'Rp 329.000', rating: '4.9' },
              ].map((p, idx) => (
                <div key={idx} className="p-2.5 border border-slate-200 rounded-lg space-y-1.5 bg-white">
                  <div className="aspect-square bg-slate-100 rounded overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?auto=format&fit=crop&w=300&q=80`}
                      alt={p.name}
                      onError={(e) => { e.target.src = theme.screenshot; }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold text-xs text-slate-800 truncate">{p.name}</div>
                  <div className="text-xs font-bold text-emerald-700">{p.price}</div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{p.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'generatepress-corp':
      return (
        <div className="font-sans">
          <header className="border-b border-slate-200 py-3 px-6 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="font-bold text-sm text-slate-900">GenerateSpeed Core</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" /> 100/100 PageSpeed
              </span>
            </div>
          </header>

          <section className="p-6 sm:p-10 text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kinerja Ekstrem Tanpa Beban Script Berlebih
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Dibangun dengan arsitektur HTML semantik murni. Ukuran halaman di bawah 30KB dengan waktu pemuatan 0.2 detik.
            </p>

            {/* Performance Benchmark Matrix */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-left mt-6">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Time To First Byte</div>
                <div className="text-lg font-extrabold text-emerald-600">38 ms</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Total Page Size</div>
                <div className="text-lg font-extrabold text-slate-900">28.4 KB</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">HTTP Requests</div>
                <div className="text-lg font-extrabold text-slate-900">4 Req</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Modul Performa Cepat</span>
              </button>
            </div>
          </section>
        </div>
      );

    case 'kadence-pro':
      return (
        <div className="font-sans">
          {/* Quick WhatsApp Online Badge */}
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-1.5 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tim Konsultan WhatsApp Siap Membantu Anda</span>
            </div>
            <span className="font-bold text-emerald-700 hidden sm:inline">Respon Cepat &lt; 2 Menit</span>
          </div>

          <header className="border-b border-slate-200 py-3 px-6 flex items-center justify-between">
            <span className="font-extrabold text-sm text-slate-900">Kadence Studio</span>
            <button
              type="button"
              className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Hubungi WA</span>
            </button>
          </header>

          <section className="p-6 sm:p-8 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Tingkatkan Penjualan &amp; Lead Bisnis Anda Hingga 300%
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Desain formulir cepat terintegrasi langsung ke WhatsApp bisnis Anda tanpa alur checkout yang berbelit.
            </p>

            {/* Quick Inquiry Form */}
            <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-xs space-y-3 text-xs">
              <div className="font-bold text-slate-800">Formulir Konsultasi Instan</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda..."
                  disabled
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Nomor WhatsApp..."
                  disabled
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                />
              </div>
              <button
                type="button"
                className="w-full py-2 bg-slate-900 text-white font-bold rounded hover:bg-black transition-colors"
              >
                Kirim Permintaan Konsultasi Gratis
              </button>
            </div>
          </section>
        </div>
      );

    case 'oceanwp-store':
      return (
        <div className="font-sans">
          <header className="bg-slate-900 text-white py-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-sky-400" />
              <span className="font-extrabold text-sm tracking-wide">SAMUDERA VIP RENTAL</span>
            </div>
            <div className="text-xs text-sky-300 font-medium">Hotline: 0812-3456-7890</div>
          </header>

          <section className="p-6 sm:p-8 space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Katalog Armada Rental Pilihan</h2>
                <p className="text-xs text-slate-500">Unit terawat, bersih, wangi, dengan supir profesional atau lepas kunci.</p>
              </div>
              <div className="flex gap-1.5 text-xs">
                <span className="px-2 py-1 bg-slate-900 text-white rounded font-semibold">Semua</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">MPV</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">Luxury SUV</span>
              </div>
            </div>

            {/* Fleet Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Innova Zenix Hybrid 2026', price: 'Rp 650.000 / hari', spec: 'Matic • 7 Kursi • Bensin Super Irit' },
                { name: 'Alphard Transformer VIP', price: 'Rp 2.200.000 / hari', spec: 'Matic • Captain Seat • Protokol VIP' },
                { name: 'Fortuner 2.8 GR Sport', price: 'Rp 950.000 / hari', spec: 'Matic • 4x4 Gagah • Termasuk Supir' },
              ].map((car, i) => (
                <div key={i} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={theme.screenshot}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="font-bold text-xs text-slate-900">{car.name}</div>
                    <div className="text-[11px] text-slate-500">{car.spec}</div>
                    <div className="font-extrabold text-sm text-sky-700">{car.price}</div>
                    <button
                      type="button"
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>Sewa via WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      );

    case 'neve-startup':
      return (
        <div className="font-sans">
          <header className="border-b border-slate-200 py-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-sm text-slate-900">CloudPulse API</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600">Dokumentasi</span>
              <span className="font-bold text-orange-600">v3.8 Live</span>
            </div>
          </header>

          <section className="p-6 sm:p-10 max-w-3xl mx-auto space-y-4 text-center">
            <div className="inline-block px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-[10px] font-mono font-bold">
              ⚡ Global Edge Network with 45ms Latency
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Infrastruktur Microservices untuk Developer Modern
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Kembangkan aplikasi web responsif tanpa perlu mengelola server manual. Terintegrasi penuh dengan WordPress headless REST API.
            </p>

            {/* Terminal snippet mockup */}
            <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-left text-xs shadow-md space-y-1">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="ml-2">bash terminal</span>
              </div>
              <div className="text-slate-400">$ npm install @cloudpulse/cms-sdk</div>
              <div className="text-emerald-400">✓ Connected to cluster: ap-southeast-1 (Jakarta)</div>
              <div className="text-slate-300">$ ready in 180ms!</div>
            </div>
          </section>
        </div>
      );

    case 'storefront-shop':
      return (
        <div className="font-sans">
          {/* Official Storefront Top Branding */}
          <header className="border-b border-slate-200 py-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center">
                W
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">Storefront Official</span>
                <span className="text-[10px] text-slate-400">Powered by WooCommerce</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-purple-50 text-[#7c3aed] border border-purple-200 px-2.5 py-1 rounded text-xs font-bold">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Keranjang (Rp 1.250.000)</span>
              </div>
            </div>
          </header>

          <div className="p-6 max-w-4xl mx-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Katalog Produk &amp; Aksesoris Digital</h3>
              <span className="text-xs text-slate-500">Menampilkan 4 produk pilihan</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Headphone Wireless ANC', price: 'Rp 899.000', badge: 'SALE -20%' },
                { name: 'Mechanical Keyboard RGB', price: 'Rp 549.000', badge: 'READY' },
                { name: 'Mouse Ergonomis Pro', price: 'Rp 389.000', badge: 'HEMAT 15%' },
                { name: 'Smartwatch Fitness 2026', price: 'Rp 650.000', badge: 'BEST' },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-2.5 bg-white space-y-2 flex flex-col justify-between">
                  <div className="relative aspect-square bg-slate-100 rounded overflow-hidden">
                    <img src={theme.screenshot} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#7c3aed] text-white text-[9px] font-bold rounded">
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 truncate">{item.name}</div>
                    <div className="font-extrabold text-xs text-[#7c3aed] mt-0.5">{item.price}</div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-1 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded transition-colors"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'blocksy-mag':
      return (
        <div className="font-sans">
          {/* Breaking News Ticker */}
          <div className="bg-slate-900 text-white text-[10px] py-1 px-4 flex items-center gap-2">
            <span className="bg-emerald-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-slate-950">
              TRENDING
            </span>
            <span className="truncate">Peluncuran Chipset AI Generasi 3nm Resmi Diumumkan Hari Ini</span>
          </div>

          <header className="border-b border-slate-200 py-3 px-6 flex items-center justify-between">
            <span className="font-black text-base tracking-tighter text-slate-900">
              BLOCKSY<span className="text-emerald-600">.PULSE</span>
            </span>
            <div className="text-xs font-semibold text-slate-600 flex gap-3">
              <span className="text-slate-900 font-bold">Review</span>
              <span>Smartphone</span>
              <span>AI Tools</span>
            </div>
          </header>

          <section className="p-6 max-w-4xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={theme.screenshot} alt="Tech Review" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Ulasan Lengkap Smartphone Flagship 2026: Lompatan Besar di Sektor Kamera
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kami menguji performa baterai, ketahanan termal saat rendering grafis intensif, dan akurasi sensor optik terkini.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 flex flex-col justify-center text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Skor Ulasan Redaksi</div>
                <div className="text-4xl font-black text-emerald-600">9.7<span className="text-xs text-slate-400 font-normal">/10</span></div>
                <div className="text-xs font-bold text-slate-800">Editor's Choice Award</div>
                <p className="text-[11px] text-slate-500">Layar 144Hz, material titanium ringan, dan optimasi baterai terbaik.</p>
              </div>
            </div>
          </section>
        </div>
      );

    default:
      return (
        <div className="p-8 text-center space-y-3">
          <h3 className="font-bold text-lg text-slate-800">{theme.name}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">{theme.description}</p>
        </div>
      );
  }
}

export default function ThemeCustomizer() {
  const [homePage, setHomePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeThemeId, setActiveThemeId] = useState('twenty-twenty-five');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'installed'
  const [activating, setActivating] = useState(false);
  const [notification, setNotification] = useState('');
  const [selectedThemeDetails, setSelectedThemeDetails] = useState(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // Live Preview Customizer States
  const [livePreviewTheme, setLivePreviewTheme] = useState(null);
  const [previewViewport, setPreviewViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [previewAccent, setPreviewAccent] = useState('#18181b');

  // Customizer options
  const [accentChoice, setAccentChoice] = useState('#18181b');
  const [mobileNavChoice, setMobileNavChoice] = useState('curved');

  useEffect(() => {
    fetchAdminPages()
      .then((pages) => {
        const home = pages.find((p) => p.slug === 'home' || p.slug === '') || pages[0];
        if (home) {
          setHomePage(home);
          if (home.themeId) {
            setActiveThemeId(home.themeId);
          }
          if (home.mobileNavType) {
            setMobileNavChoice(home.mobileNavType);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleActivateTheme = async (theme) => {
    if (!homePage) return;
    setActivating(true);

    try {
      const preset = getThemePresetData(theme.id);
      const updated = {
        ...homePage,
        themeId: theme.id,
        colorMode: 'light', // Strict light theme default
        mobileNavType: mobileNavChoice,
        title: preset?.title || homePage.title,
        header: preset?.header || homePage.header,
        footer: preset?.footer || homePage.footer,
        blocks: preset?.blocks || homePage.blocks,
      };

      await saveAdminPage(updated);
      setHomePage(updated);
      setActiveThemeId(theme.id);
      setNotification(`Tema "${theme.name}" berhasil diaktifkan dengan template blok siap pakai!`);
      setSelectedThemeDetails(null);

      // Remove any dark mode class
      document.documentElement.classList.remove('dark');

      setTimeout(() => setNotification(''), 4500);
    } catch (err) {
      alert(`Gagal mengaktifkan tema: ${err.message}`);
    } finally {
      setActivating(false);
    }
  };

  const handleSaveCustomization = async () => {
    if (!homePage) return;
    setActivating(true);
    try {
      const updated = {
        ...homePage,
        themeId: activeThemeId,
        colorMode: 'light',
        mobileNavType: mobileNavChoice,
      };
      await saveAdminPage(updated);
      setHomePage(updated);
      setCustomizeOpen(false);
      setNotification('Kustomisasi tampilan berhasil disimpan.');
      setTimeout(() => setNotification(''), 3500);
    } catch (err) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setActivating(false);
    }
  };

  const openLivePreview = (theme) => {
    setLivePreviewTheme(theme);
    setPreviewAccent(theme.accentColor || '#18181b');
    setPreviewViewport('desktop');
  };

  const filteredThemes = WP_THEMES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeFilter === 'installed') return matchesSearch;
    return matchesSearch;
  });

  const activeTheme = WP_THEMES.find((t) => t.id === activeThemeId) || WP_THEMES[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* WordPress Themes Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Tema
          </h1>
          <button
            type="button"
            onClick={() => alert('Fitur instalasi tema baru (.zip) akan aktif pada pembaruan mendatang.')}
            className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-900 text-xs font-semibold text-slate-700 rounded-md transition-colors shadow-xs"
          >
            Tambah Tema Baru
          </button>
        </div>

        {/* Search Themes Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tema terpasang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
          />
        </div>
      </div>

      {/* WordPress Sub-navigation filter bar */}
      <div className="flex items-center gap-4 text-xs border-b border-slate-200/80 pb-2.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`font-semibold transition-colors ${
            activeFilter === 'all'
              ? 'text-slate-900 border-b-2 border-slate-900 pb-2.5 -mb-2.5'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Semua ({WP_THEMES.length})
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setActiveFilter('installed')}
          className={`font-semibold transition-colors ${
            activeFilter === 'installed'
              ? 'text-slate-900 border-b-2 border-slate-900 pb-2.5 -mb-2.5'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Terpasang ({WP_THEMES.length})
        </button>
      </div>

      {/* WordPress Notification Banner */}
      {notification && (
        <div className="p-3 bg-white border-l-4 border-emerald-500 border-t border-r border-b border-slate-200 shadow-xs flex items-center justify-between text-xs text-slate-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 hover:underline font-semibold ml-2 inline-flex items-center gap-1"
            >
              Kunjungi Situs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={() => setNotification('')}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* WordPress Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => {
          const isActive = theme.id === activeThemeId;

          return (
            <div
              key={theme.id}
              className={`bg-white border transition-all rounded-lg overflow-hidden flex flex-col ${
                isActive
                  ? 'border-slate-900 shadow-md ring-1 ring-slate-900/10'
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
              }`}
            >
              {/* Theme Screenshot Container */}
              <div
                className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer group"
                onClick={() => openLivePreview(theme)}
              >
                <img
                  src={theme.screenshot}
                  alt={theme.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Active Overlay Badge */}
                {isActive && (
                  <div className="absolute top-3 left-3 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Aktif</span>
                  </div>
                )}

                {/* Hover Action Overlay (Authentic WordPress Behavior) */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 z-10 backdrop-blur-[2px]">
                  {isActive ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomizeOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Sesuaikan</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={activating}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivateTheme(theme);
                      }}
                      className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-colors"
                    >
                      {activating ? 'Mengaktifkan...' : 'Aktifkan'}
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLivePreview(theme);
                      }}
                      className="px-3 py-1 rounded-md bg-white/95 hover:bg-white text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-700" />
                      <span>Pratinjau Langsung</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedThemeDetails(theme);
                      }}
                      className="px-3 py-1 rounded-md bg-white/95 hover:bg-white text-slate-800 font-semibold text-xs transition-colors"
                    >
                      Rincian Tema
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme Footer Info Bar (Authentic WordPress layout) */}
              <div className="p-3.5 border-t border-slate-200 flex items-center justify-between bg-white flex-grow">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{theme.name}</h3>
                  <div className="text-[11px] text-slate-500 font-medium">Oleh {theme.author}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isActive ? (
                    <button
                      type="button"
                      onClick={() => setCustomizeOpen(true)}
                      className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      Sesuaikan
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={activating}
                        onClick={() => handleActivateTheme(theme)}
                        className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-900 text-slate-700 font-semibold text-xs transition-colors shadow-xs"
                      >
                        Aktifkan
                      </button>
                      <button
                        type="button"
                        onClick={() => openLivePreview(theme)}
                        className="hidden sm:inline-block px-2.5 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium transition-colors"
                      >
                        Pratinjau
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WordPress Live Customizer / Live Preview Fullscreen Modal */}
      {livePreviewTheme && (
        <div className="fixed inset-0 z-50 bg-[#f0f0f1] flex flex-col animate-in fade-in duration-150 select-none">
          {/* Top Customizer Header */}
          <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-xs z-20">
            {/* Left: Close & Theme Identity */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLivePreviewTheme(null)}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Tutup Pratinjau"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Pratinjau Tema:</span>
                <span className="text-xs font-bold text-slate-800">{livePreviewTheme.name}</span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  v{livePreviewTheme.version}
                </span>
              </div>
            </div>

            {/* Center: Device Viewport Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'desktop'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('tablet')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'tablet'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'mobile'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Mobile</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {livePreviewTheme.id === activeThemeId ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Tema Aktif</span>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={activating}
                  onClick={() => {
                    handleActivateTheme(livePreviewTheme);
                    setLivePreviewTheme(null);
                  }}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  {activating ? 'Mengaktifkan...' : 'Aktifkan & Simpan'}
                </button>
              )}
            </div>
          </header>

          {/* Main Workspace: Left Controls + Canvas */}
          <div className="flex flex-grow overflow-hidden">
            {/* Left: Customizer Quick Panel */}
            <div className="w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto space-y-4 shrink-0 hidden lg:block text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{livePreviewTheme.name}</h4>
                <div className="text-[11px] text-slate-500 mb-2">
                  Kategori: <span className="font-semibold text-slate-700">{livePreviewTheme.category}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {livePreviewTheme.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="block font-bold text-slate-700 mb-2">
                  Pilihan Warna Aksen:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { color: '#18181b', label: 'Charcoal' },
                    { color: '#2271b1', label: 'WP Blue' },
                    { color: '#047857', label: 'Emerald' },
                    { color: '#b45309', label: 'Amber' },
                    { color: '#7c3aed', label: 'Purple' },
                    { color: '#ea580c', label: 'Orange' },
                    { color: '#0284c7', label: 'Sky' },
                    { color: '#52525b', label: 'Slate' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setPreviewAccent(c.color)}
                      className={`p-1.5 rounded border flex flex-col items-center gap-1 transition-all ${
                        previewAccent === c.color
                          ? 'border-[#2271b1] bg-blue-50/40 ring-1 ring-[#2271b1]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-[9px] text-slate-600">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="block font-bold text-slate-700 mb-2">
                  Gaya Bilah Bawah HP:
                </label>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setMobileNavChoice('curved')}
                    className={`w-full p-2 rounded-md border text-left text-xs transition-colors ${
                      mobileNavChoice === 'curved'
                        ? 'border-slate-900 bg-slate-50 font-bold text-slate-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Curved Floating WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileNavChoice('classic')}
                    className={`w-full p-2 rounded-md border text-left text-xs transition-colors ${
                      mobileNavChoice === 'classic'
                        ? 'border-slate-900 bg-slate-50 font-bold text-slate-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Classic Flat Toolbar
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="font-bold text-slate-700 mb-2">Fitur Tema:</div>
                <div className="flex flex-wrap gap-1">
                  {livePreviewTheme.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Responsive Interactive Canvas */}
            <div className="flex-grow bg-[#dcdcde] p-3 sm:p-6 overflow-y-auto flex justify-center items-start">
              <ThemePreviewMockup
                theme={livePreviewTheme}
                viewport={previewViewport}
                accentChoice={previewAccent}
                mobileNavChoice={mobileNavChoice}
                onActivate={() => {
                  handleActivateTheme(livePreviewTheme);
                  setLivePreviewTheme(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* WordPress Theme Details Modal */}
      {selectedThemeDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-300 rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-900">
                  Rincian Tema: {selectedThemeDetails.name}
                </h2>
                <span className="text-xs text-slate-500 font-mono">v{selectedThemeDetails.version}</span>
              </div>
              <button
                onClick={() => setSelectedThemeDetails(null)}
                className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="aspect-[16/9] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedThemeDetails.screenshot}
                  alt={selectedThemeDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">
                  Oleh <span className="font-bold text-slate-700">{selectedThemeDetails.author}</span> | Versi {selectedThemeDetails.version}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedThemeDetails.description}
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Tag Fitur:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedThemeDetails.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedThemeDetails(null)}
                className="px-4 py-1.5 rounded-md border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const t = selectedThemeDetails;
                    setSelectedThemeDetails(null);
                    openLivePreview(t);
                  }}
                  className="px-4 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Buka Pratinjau Langsung</span>
                </button>

                {selectedThemeDetails.id === activeThemeId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedThemeDetails(null);
                      setCustomizeOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                  >
                    Sesuaikan Tema Ini
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={activating}
                    onClick={() => handleActivateTheme(selectedThemeDetails)}
                    className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                  >
                    {activating ? 'Mengaktifkan...' : 'Aktifkan Tema Ini'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WordPress Customizer Drawer / Modal */}
      {customizeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Sesuaikan: {activeTheme.name}
                </h3>
                <p className="text-xs text-slate-500">Konfigurasi visual cepat berstandar WordPress</p>
              </div>
              <button
                onClick={() => setCustomizeOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Warna Aksen Utama Komponen:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'zinc', color: '#18181b', label: 'Neutral Charcoal' },
                    { id: 'stone', color: '#27272a', label: 'Deep Graphite' },
                    { id: 'emerald', color: '#047857', label: 'Emerald Forest' },
                    { id: 'amber', color: '#b45309', label: 'Warm Amber' },
                    { id: 'neutral', color: '#52525b', label: 'Soft Slate' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAccentChoice(c.color)}
                      className={`p-2 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                        accentChoice === c.color
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-[#2271b1]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-[10px] font-semibold text-slate-700">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Gaya Bilah Navigasi Bawah di Layar HP (Mobile Bottom Nav):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileNavChoice('curved')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      mobileNavChoice === 'curved'
                        ? 'border-slate-900 bg-slate-100 font-bold text-slate-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-xs">Curved Modern Floating</div>
                    <div className="text-[11px] text-slate-500 font-normal">Tombol tengah WhatsApp melayang elegan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileNavChoice('classic')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      mobileNavChoice === 'classic'
                        ? 'border-slate-900 bg-slate-100 font-bold text-slate-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-xs">Classic Flat Toolbar</div>
                    <div className="text-[11px] text-slate-500 font-normal">Gaya toolbar datar standar aplikasi</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCustomizeOpen(false)}
                className="px-4 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={activating}
                onClick={handleSaveCustomization}
                className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                {activating ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
