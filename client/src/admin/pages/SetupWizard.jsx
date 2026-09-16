import React, { useState } from 'react';
import {
  Database, HardDrive, Globe, UserCheck, Sparkles, CheckCircle2,
  ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Eye, EyeOff, ShieldCheck,
  ShoppingBag, Palette, Briefcase, Rocket, Car, Layout, Check, Server,
  Sliders, Layers, Lock, Mail, User, Shield, Terminal
} from 'lucide-react';

const INDUSTRY_PRESETS = [
  {
    id: 'rental',
    name: 'Rental & Transportasi',
    icon: Car,
    title: 'Samudera VIP Transport',
    tagline: 'Executive Fleet & 24/7 Car Rental Terpercaya',
    desc: 'Penyewaan mobil eksekutif, armada Alphard & Zenix dengan supir atau lepas kunci.',
    defaultTheme: 'oceanwp-store',
    themeName: 'Tema OceanWP (Rental VIP)',
    primaryColor: '#4f46e5',
    accentColor: '#f59e0b',
    modules: ['Hero Slideshow Dinamis', 'Katalog Armada Realtime', 'Booking Cepat WhatsApp', 'FAQ Interaktif'],
    badge: 'Rekomendasi Utama',
  },
  {
    id: 'ecommerce',
    name: 'Toko Online & Retail',
    icon: ShoppingBag,
    title: 'Astra Store Indonesia',
    tagline: 'Koleksi Produk Pilihan Berkualitas & Pengiriman Cepat',
    desc: 'Katalog produk retail, pakaian, aksesoris, dan checkout WhatsApp instan.',
    defaultTheme: 'astra-clean',
    themeName: 'Tema Astra (Toko Online)',
    primaryColor: '#0f172a',
    accentColor: '#10b981',
    modules: ['Katalog Produk Grid', 'WhatsApp Instant Checkout', 'Filter Kategori', 'Testimonial Pembeli'],
  },
  {
    id: 'agency',
    name: 'Agensi Kreatif & Portofolio',
    icon: Briefcase,
    title: 'Nexus Creative Studio',
    tagline: 'Membangun Identitas Brand & Pengalaman Digital Kelas Dunia',
    desc: 'Showcase portofolio proyek klien, layanan agensi, dan formulir konsultasi.',
    defaultTheme: 'kadence-pro',
    themeName: 'Tema Kadence WP (Agensi)',
    primaryColor: '#2563eb',
    accentColor: '#38bdf8',
    modules: ['Showcase Portofolio Filterable', 'Layanan & Paket Harga', 'Formulir Reservasi', 'Client Logos'],
  },
  {
    id: 'saas',
    name: 'SaaS & Startup Digital',
    icon: Rocket,
    title: 'CloudFlow SaaS Platform',
    tagline: 'Tingkatkan Efisiensi Bisnis dengan Otomatisasi Terintegrasi',
    desc: 'Landing page aplikasi cloud, tier paket harga langganan, dan demo produk.',
    defaultTheme: 'neve-startup',
    themeName: 'Tema Neve (SaaS Cloud)',
    primaryColor: '#7c3aed',
    accentColor: '#ec4899',
    modules: ['Tier Pricing Table (Bulanan/Tahunan)', 'Feature Comparison', 'Statistik Metrik', 'CTA Demo'],
  },
  {
    id: 'digital',
    name: 'Produk Digital & Desain',
    icon: Palette,
    title: 'PixelCraft Design Assets',
    tagline: 'UI Kits, Template Web & Aset Grafis Premium',
    desc: 'Penjualan aset desain digital, Figma kits, icon pack, dan template web.',
    defaultTheme: 'generatepress-corp',
    themeName: 'Tema GeneratePress (Aset UI)',
    primaryColor: '#059669',
    accentColor: '#10b981',
    modules: ['Preview Aset Digital', 'Lisensi Personal/Komersial', 'FAQ Lisensi', 'Download Instan'],
  },
  {
    id: 'custom',
    name: 'Universal & Editorial Media',
    icon: Layout,
    title: 'The Chronicle Media',
    tagline: 'Publikasi Editorial & Wawasan Industri Terpercaya',
    desc: 'CMS fleksibel untuk publikasi artikel berita, blog korporat, atau portal media.',
    defaultTheme: 'twenty-twenty-five',
    themeName: 'Tema Twenty Twenty-Five (Editorial)',
    primaryColor: '#18181b',
    accentColor: '#71717a',
    modules: ['Rich Article Blog Grid', 'Kategori Berita', 'Author Box', 'Yoast SEO Optimizer'],
  },
];

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);

  // 1. Site Identity & Industry (Step 1 & 2)
  const [selectedIndustry, setSelectedIndustry] = useState('rental');
  const [siteIdentity, setSiteIdentity] = useState({
    title: 'Samudera VIP Transport',
    tagline: 'Executive Fleet & 24/7 Car Rental Terpercaya',
    language: 'id',
    timezone: 'Asia/Jakarta',
    industryType: 'rental',
  });

  // 2. Database (Step 3)
  const [dbType, setDbType] = useState('local-json');
  const [dbConfig, setDbConfig] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    databaseUrl: '',
    mysqlHost: 'localhost',
    mysqlPort: '3306',
    mysqlUser: 'root',
    mysqlPassword: '',
    mysqlDatabase: 'ultra_cms',
    mongoUrl: '',
  });
  const [dbTesting, setDbTesting] = useState(false);
  const [dbTestResult, setDbTestResult] = useState(null);

  // 3. Super Admin (Step 3)
  const [adminData, setAdminData] = useState({
    username: 'admin',
    email: 'admin@ultracms.local',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // 4. Execution State
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const activePreset = INDUSTRY_PRESETS.find((p) => p.id === selectedIndustry) || INDUSTRY_PRESETS[0];

  const handleSelectIndustry = (preset) => {
    setSelectedIndustry(preset.id);
    setSiteIdentity((prev) => ({
      ...prev,
      title: preset.title,
      tagline: preset.tagline,
      industryType: preset.id,
    }));
  };

  const handleTestDb = async () => {
    setDbTesting(true);
    setDbTestResult(null);
    try {
      const res = await fetch('/api/setup/test-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: dbType, ...dbConfig }),
      });
      const data = await res.json();
      setDbTestResult(data);
    } catch (err) {
      setDbTestResult({ success: false, message: err.message || 'Koneksi database gagal' });
    } finally {
      setDbTesting(false);
    }
  };

  const handleRunInstall = async (e) => {
    if (e) e.preventDefault();
    if (!adminData.username || !adminData.password) {
      setError('Username dan kata sandi admin wajib diisi.');
      return;
    }
    if (adminData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (adminData.password !== adminData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setInstalling(true);
    setError('');
    try {
      const payload = {
        dbConfig: { type: dbType, ...dbConfig },
        storageConfig: { type: 'local' },
        siteIdentity,
        superAdmin: adminData,
        selectedTheme: activePreset.defaultTheme,
      };

      const res = await fetch('/api/setup/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Instalasi gagal');

      setSuccess(true);
      setTimeout(() => {
        if (onComplete) onComplete();
        else window.location.href = '/admin';
      }, 1500);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat konfigurasi database');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-indigo-600 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-blue-600/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main Center Container */}
      <div className="w-full max-w-4xl relative z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-indigo-400 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ultra CMS • Onboarding Setup Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Konfigurasi Portal Web & CMS Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
            Selesaikan wizard singkat ini untuk menginisialisasi tema, database, dan akun pengelola super admin.
          </p>
        </div>

        {/* Stepper Progress Header */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-2 sm:p-3 mb-6 shadow-xl">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, title: 'Profil Bisnis', desc: 'Identitas & Nama Web' },
              { num: 2, title: 'Kategori & Tema', desc: 'Desain & Modul Bawaan' },
              { num: 3, title: 'Database & Akun', desc: 'Koneksi & Super Admin' },
            ].map((st) => {
              const isDone = step > st.num;
              const isCurrent = step === st.num;
              return (
                <button
                  key={st.num}
                  type="button"
                  disabled={st.num > step}
                  onClick={() => setStep(st.num)}
                  className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all ${
                    isCurrent
                      ? 'bg-indigo-600/15 border border-indigo-500/40 text-white'
                      : isDone
                      ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-800/70 border border-transparent'
                      : 'text-slate-500 opacity-60 border border-transparent cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-md'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : st.num}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <span className="text-xs font-bold block truncate text-slate-200">
                      {st.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {st.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Perhatian:</strong> {error}
              </div>
            </div>
          )}

          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Instalasi Berhasil Dijalankan!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Konfigurasi website, tema bawaan, dan kredensial admin telah disimpan. Mengalihkan Anda ke Dashboard...
              </p>
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
            </div>
          ) : (
            <>
              {/* STEP 1: Profil Bisnis */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">1. Identitas & Profil Bisnis</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tentukan judul website, slogan utama, dan bahasa default untuk portal Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Nama Website / Bisnis
                      </label>
                      <input
                        type="text"
                        value={siteIdentity.title}
                        onChange={(e) => setSiteIdentity({ ...siteIdentity, title: e.target.value })}
                        placeholder="Contoh: Samudera VIP Transport"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Slogan / Deskripsi Singkat
                      </label>
                      <input
                        type="text"
                        value={siteIdentity.tagline}
                        onChange={(e) => setSiteIdentity({ ...siteIdentity, tagline: e.target.value })}
                        placeholder="Contoh: Executive Fleet & 24/7 Car Rental Terpercaya"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Bahasa Utama
                      </label>
                      <select
                        value={siteIdentity.language}
                        onChange={(e) => setSiteIdentity({ ...siteIdentity, language: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                      >
                        <option value="id">Bahasa Indonesia (ID)</option>
                        <option value="en">English (US)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Zona Waktu
                      </label>
                      <select
                        value={siteIdentity.timezone}
                        onChange={(e) => setSiteIdentity({ ...siteIdentity, timezone: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                      >
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB, UTC+7)</option>
                        <option value="Asia/Makassar">Asia/Makassar (WITA, UTC+8)</option>
                        <option value="Asia/Jayapura">Asia/Jayapura (WIT, UTC+9)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>Lanjut ke Kategori & Tema</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Kategori & Tema Visual Card Selector */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">2. Pilih Kategori Bisnis & Tema Bawaan</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      CMS akan mengonfigurasi blok layout, modul konversi, dan palet warna optimal sesuai sektor usaha Anda.
                    </p>
                  </div>

                  {/* Grid Cards Category Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {INDUSTRY_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = selectedIndustry === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectIndustry(preset)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative group ${
                            isSelected
                              ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                          }`}
                        >
                          {preset.badge && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {preset.badge}
                            </span>
                          )}

                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <h3 className="text-sm font-bold text-white">{preset.name}</h3>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                            {preset.desc}
                          </p>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-medium">{preset.themeName.split(' ')[1]}</span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: preset.primaryColor }}
                              />
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: preset.accentColor }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Theme Preset Dynamic Preview Banner */}
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white">Preset Terpilih: {activePreset.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                          {activePreset.themeName}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[11px]">
                        Modul yang akan aktif otomatis: {activePreset.modules.join(' • ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-400 text-[11px]">Palet Warna:</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activePreset.primaryColor }} />
                        <span className="text-[10px] font-mono text-slate-300">{activePreset.primaryColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>Lanjut ke Database & Akun</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Database & Super Admin */}
              {step === 3 && (
                <form onSubmit={handleRunInstall} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">3. Database & Akun Super Administrator</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pilih tipe penyimpanan basis data dan buat akun utama untuk mengelola CMS Anda.
                    </p>
                  </div>

                  {/* Database Engine Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Tipe Basis Data (Database Engine)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'local-json', name: 'JSON Serverless', desc: 'Siap Pakai (No-Setup)' },
                        { id: 'supabase', name: 'Supabase Cloud', desc: 'PostgreSQL API' },
                        { id: 'mysql', name: 'MySQL / MariaDB', desc: 'Server Tradisional' },
                        { id: 'mongodb', name: 'MongoDB Atlas', desc: 'Document Store' },
                      ].map((db) => (
                        <button
                          key={db.id}
                          type="button"
                          onClick={() => setDbType(db.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            dbType === db.id
                              ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                        >
                          <span className="text-xs font-bold block">{db.name}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{db.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Database Config Extra Inputs (if not local-json) */}
                    {dbType === 'supabase' && (
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 mt-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Supabase Project URL</label>
                          <input
                            type="text"
                            value={dbConfig.supabaseUrl}
                            onChange={(e) => setDbConfig({ ...dbConfig, supabaseUrl: e.target.value })}
                            placeholder="https://xyzcompany.supabase.co"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Supabase Anon Key</label>
                          <input
                            type="password"
                            value={dbConfig.supabaseKey}
                            onChange={(e) => setDbConfig({ ...dbConfig, supabaseKey: e.target.value })}
                            placeholder="eyJh..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    )}

                    {dbType === 'mysql' && (
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Host</label>
                          <input
                            type="text"
                            value={dbConfig.mysqlHost}
                            onChange={(e) => setDbConfig({ ...dbConfig, mysqlHost: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Database Name</label>
                          <input
                            type="text"
                            value={dbConfig.mysqlDatabase}
                            onChange={(e) => setDbConfig({ ...dbConfig, mysqlDatabase: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {dbType !== 'local-json' && (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={handleTestDb}
                          disabled={dbTesting}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${dbTesting ? 'animate-spin' : ''}`} />
                          <span>{dbTesting ? 'Menguji...' : 'Uji Koneksi Database'}</span>
                        </button>
                        {dbTestResult && (
                          <span className={`text-xs font-semibold ${dbTestResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {dbTestResult.message || (dbTestResult.success ? 'Koneksi Sukses' : 'Gagal')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Super Admin Credentials Section */}
                  <div className="pt-2 border-t border-slate-800 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Akun Super Administrator
                      </span>
                      <span className="text-[11px] text-slate-400">Digunakan untuk login ke /admin</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Nama Pengguna (Username)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={adminData.username}
                            onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                            placeholder="admin"
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Email Administrator
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={adminData.email}
                            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                            placeholder="admin@domain.com"
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Kata Sandi (Password)
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={adminData.password}
                            onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                            placeholder="Minimal 6 karakter"
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Konfirmasi Kata Sandi
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={adminData.confirmPassword}
                            onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                            placeholder="Ulangi kata sandi"
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali</span>
                    </button>
                    <button
                      type="submit"
                      disabled={installing}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                    >
                      {installing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Menginstal CMS & Database...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Selesaikan & Masuk ke Admin</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
