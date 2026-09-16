import React, { useState } from 'react';
import {
  Database, HardDrive, Globe, UserCheck, Sparkles, CheckCircle2,
  ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Eye, EyeOff, ShieldCheck,
  ShoppingBag, Palette, Briefcase, Rocket, Car, Layout
} from 'lucide-react';
import { Button, Input, Select, Card } from '../../components/ui';

const INDUSTRY_PRESETS = [
  {
    id: 'ecommerce',
    name: 'Toko Online & E-Commerce',
    icon: ShoppingBag,
    title: 'Store Online Indonesia',
    tagline: 'Koleksi Produk Pilihan Berkualitas & Pengiriman Cepat',
    desc: 'Katalog produk retail, pakaian, aksesoris, dan checkout WhatsApp instan.',
    defaultTheme: 'astra-clean',
    themeName: 'Tema Astra (Toko Online)',
  },
  {
    id: 'digital',
    name: 'Produk Desain Digital',
    icon: Palette,
    title: 'Studio Desain & Digital Assets',
    tagline: 'Template UI, Ilustrasi Vektor, Font & Aset Grafis Eksklusif',
    desc: 'Penjualan karya desain digital, Figma UI kits, template web, dan aset 3D.',
    defaultTheme: 'generatepress-corp',
    themeName: 'Tema GeneratePress (Aset UI)',
  },
  {
    id: 'agency',
    name: 'Agensi Kreatif & Portofolio',
    icon: Briefcase,
    title: 'Creative Agency & Studio',
    tagline: 'Membangun Identitas Brand & Pengalaman Digital Kelas Dunia',
    desc: 'Showcase portofolio proyek klien, layanan studio, dan formulir konsultasi.',
    defaultTheme: 'kadence-pro',
    themeName: 'Tema Kadence WP (Agensi)',
  },
  {
    id: 'saas',
    name: 'SaaS & Startup Digital',
    icon: Rocket,
    title: 'Cloud App & SaaS Platform',
    tagline: 'Tingkatkan Produktivitas Tim Anda dengan Otomatisasi Cerdas',
    desc: 'Landing page aplikasi cloud, tier paket harga langganan, dan demo produk.',
    defaultTheme: 'neve-startup',
    themeName: 'Tema Neve (SaaS Cloud)',
  },
  {
    id: 'rental',
    name: 'Rental & Transportasi',
    icon: Car,
    title: 'Rental Kendaraan & Transportasi',
    tagline: 'Armada Terawat, Bersih & Layanan Pelanggan 24 Jam Terpercaya',
    desc: 'Penyewaan mobil, motor, atau transportasi eksekutif dengan supir / lepas kunci.',
    defaultTheme: 'oceanwp-store',
    themeName: 'Tema OceanWP (Rental VIP)',
  },
  {
    id: 'custom',
    name: 'Universal / Kustom',
    icon: Layout,
    title: 'The Chronicle & Editorial Web',
    tagline: 'Publikasi Editorial & Wawasan Industri Terpercaya',
    desc: 'CMS fleksibel untuk publikasi artikel, profil korporat, atau portal media.',
    defaultTheme: 'twenty-twenty-five',
    themeName: 'Tema Twenty Twenty-Five (Editorial)',
  }
];

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);

  // 1. Database
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

  // 2. Storage
  const [storageType, setStorageType] = useState('local');
  const [storageConfig, setStorageConfig] = useState({
    bucket: '',
    endpoint: '',
    accessKey: '',
    secretKey: '',
  });
  const [storageTesting, setStorageTesting] = useState(false);
  const [storageTestResult, setStorageTestResult] = useState(null);

  // 3. Site Identity & Industry
  const [selectedIndustry, setSelectedIndustry] = useState('custom');
  const [siteIdentity, setSiteIdentity] = useState({
    title: 'Ultra CMS',
    tagline: 'Modern High-Performance Content Management System',
    language: 'id',
    timezone: 'Asia/Jakarta',
    industryType: 'custom',
  });

  // 4. Super Admin
  const [adminData, setAdminData] = useState({
    username: 'admin',
    email: 'admin@example.com',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // 5. Execution State
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleTestStorage = async () => {
    setStorageTesting(true);
    setStorageTestResult(null);
    try {
      const res = await fetch('/api/setup/test-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: storageType, ...storageConfig }),
      });
      const data = await res.json();
      setStorageTestResult(data);
    } catch (err) {
      setStorageTestResult({ success: false, message: err.message || 'Koneksi storage gagal' });
    } finally {
      setStorageTesting(false);
    }
  };

  const handleRunInstall = async () => {
    setInstalling(true);
    setError('');
    try {
      const payload = {
        dbConfig: { type: dbType, ...dbConfig },
        storageConfig: { type: storageType, ...storageConfig },
        siteIdentity,
        superAdmin: adminData,
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
      setError(err.message || 'Terjadi kesalahan saat migrasi database');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-2xl w-full bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs">
        {/* Wizard Header */}
        <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold text-lg shadow-xs">
            W
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Instalasi Ultra CMS
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Siapkan arsitektur data, penyimpanan media, jenis bisnis, dan akun administrator.
            </p>
          </div>
        </div>

        {/* 5-Step Progress Indicators */}
        <div className="grid grid-cols-5 gap-2 mb-8 text-center text-xs font-medium select-none">
          {[
            { s: 1, label: 'Database' },
            { s: 2, label: 'Storage' },
            { s: 3, label: 'Industri' },
            { s: 4, label: 'Admin' },
            { s: 5, label: 'Selesai' },
          ].map((item) => (
            <div
              key={item.s}
              className={`pb-2.5 border-b-2 transition-all ${
                step === item.s
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : step > item.s
                  ? 'border-emerald-500 text-emerald-600 font-semibold'
                  : 'border-slate-200 text-slate-400'
              }`}
            >
              <span>{item.s}. {item.label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Database Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" />
              <h2 className="text-slate-900 font-semibold text-base tracking-tight">
                Langkah 1: Pilih Driver Database
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'local-json', label: 'Local JSON', desc: 'Zero-config tahan banting' },
                { id: 'supabase', label: 'Supabase / PG', desc: 'Serverless PostgreSQL' },
                { id: 'postgresql', label: 'PostgreSQL', desc: 'Enterprise Relational' },
                { id: 'mysql', label: 'MySQL', desc: 'Standard Relational' },
                { id: 'mongodb', label: 'MongoDB', desc: 'NoSQL Document Store' },
                { id: 'firebase', label: 'Firebase', desc: 'Firestore REST' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDbType(d.id);
                    setDbTestResult(null);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    dbType === d.id
                      ? 'bg-slate-50 border-slate-900 text-slate-900 ring-1 ring-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-900">{d.label}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {d.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Supabase inputs */}
            {dbType === 'supabase' && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <Input
                  label="Supabase Project URL"
                  value={dbConfig.supabaseUrl}
                  onChange={(e) => setDbConfig({ ...dbConfig, supabaseUrl: e.target.value })}
                  placeholder="https://xyzcompany.supabase.co"
                />
                <Input
                  label="Supabase Anon / Service Key"
                  type="password"
                  value={dbConfig.supabaseKey}
                  onChange={(e) => setDbConfig({ ...dbConfig, supabaseKey: e.target.value })}
                  placeholder="eyJhbGciOi..."
                />
              </div>
            )}

            {/* Connection Test Action */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTestDb}
                disabled={dbTesting}
                icon={dbTesting ? RefreshCw : Database}
              >
                {dbTesting ? 'Menguji...' : 'Uji Koneksi Database'}
              </Button>

              {dbTestResult && (
                <span className={`text-xs font-medium flex items-center gap-1.5 ${dbTestResult.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {dbTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{dbTestResult.message}</span>
                </span>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                icon={ArrowRight}
              >
                Lanjut: Penyimpanan Media
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Storage Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-700" />
              <h2 className="text-slate-900 font-semibold text-base tracking-tight">
                Langkah 2: Penyimpanan Media & Berkas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'local', label: 'Local Storage', desc: 'Simpan di direktori publik server' },
                { id: 'cloudflare-r2', label: 'Cloudflare R2', desc: 'Bebas biaya egress object storage' },
                { id: 'aws-s3', label: 'AWS S3 Bucket', desc: 'Amazon Web Services S3' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStorageType(s.id);
                    setStorageTestResult(null);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    storageType === s.id
                      ? 'bg-slate-50 border-slate-900 text-slate-900 ring-1 ring-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-900">{s.label}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {s.desc}
                  </div>
                </button>
              ))}
            </div>

            {(storageType === 'cloudflare-r2' || storageType === 'aws-s3') && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Nama Bucket"
                    value={storageConfig.bucket}
                    onChange={(e) => setStorageConfig({ ...storageConfig, bucket: e.target.value })}
                    placeholder="cms-assets"
                  />
                  <Input
                    label="Access Key ID"
                    value={storageConfig.accessKey}
                    onChange={(e) => setStorageConfig({ ...storageConfig, accessKey: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                icon={ArrowLeft}
              >
                Kembali
              </Button>

              <Button
                variant="primary"
                onClick={() => setStep(3)}
                icon={ArrowRight}
              >
                Lanjut: Tipe Industri & Identitas
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Industry & Site Identity */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-700" />
              <h2 className="text-slate-900 font-semibold text-base tracking-tight">
                Langkah 3: Tipe Bisnis / Industri & Identitas Situs
              </h2>
            </div>

            {/* Industry Preset Selector */}
            <div>
              <label className="block text-slate-700 font-medium text-sm mb-2.5">
                Pilih Model Bisnis / Industri Anda:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INDUSTRY_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedIndustry === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectIndustry(preset)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-slate-50 border-slate-900 text-slate-900 ring-1 ring-slate-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} />
                        <span className="font-semibold text-sm text-slate-900 truncate">{preset.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
                        {preset.desc}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          {preset.themeName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Site Title & Tagline inputs */}
            <div className="space-y-4 pt-2">
              <Input
                label="Judul Situs (Site Title)"
                value={siteIdentity.title}
                onChange={(e) => setSiteIdentity({ ...siteIdentity, title: e.target.value })}
              />

              <Input
                label="Slogan / Tagline"
                value={siteIdentity.tagline}
                onChange={(e) => setSiteIdentity({ ...siteIdentity, tagline: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Bahasa Situs"
                  value={siteIdentity.language}
                  onChange={(e) => setSiteIdentity({ ...siteIdentity, language: e.target.value })}
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English (United States)</option>
                </Select>

                <Select
                  label="Zona Waktu"
                  value={siteIdentity.timezone}
                  onChange={(e) => setSiteIdentity({ ...siteIdentity, timezone: e.target.value })}
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </Select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(2)}
                icon={ArrowLeft}
              >
                Kembali
              </Button>

              <Button
                variant="primary"
                onClick={() => setStep(4)}
                icon={ArrowRight}
              >
                Lanjut: Akun Super Admin
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Super Admin Account */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-700" />
              <h2 className="text-slate-900 font-semibold text-base tracking-tight">
                Langkah 4: Akun Super Administrator
              </h2>
            </div>

            <Input
              label="Nama Pengguna (Username)"
              value={adminData.username}
              onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
            />

            <Input
              label="Alamat Email Administrator"
              type="email"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-medium text-sm">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-medium text-sm">Ulangi Kata Sandi</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminData.confirmPassword}
                  onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                  placeholder="Ulangi kata sandi"
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(3)}
                icon={ArrowLeft}
              >
                Kembali
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  if (adminData.password && adminData.password !== adminData.confirmPassword) {
                    setError('Kata sandi konfirmasi tidak cocok');
                    return;
                  }
                  setError('');
                  setStep(5);
                }}
                icon={ArrowRight}
              >
                Lanjut: Migrasi & Inisialisasi
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Migration & Auto Seed */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <h2 className="text-slate-900 font-semibold text-base tracking-tight">
                Langkah 5: Konfirmasi & Eksekusi Migrasi
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2.5 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Driver Database:</span>
                <span className="font-semibold text-slate-900 uppercase">{dbType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Penyimpanan Media:</span>
                <span className="font-semibold text-slate-900 uppercase">{storageType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Tipe Industri:</span>
                <span className="font-semibold text-slate-900 capitalize">{selectedIndustry}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Judul Situs:</span>
                <span className="font-semibold text-slate-900">{siteIdentity.title}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Admin User:</span>
                <span className="font-semibold text-slate-900">{adminData.username} ({adminData.email})</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
              <div className="font-semibold flex items-center gap-1.5 mb-1 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Otomatisasi Penuh yang Akan Dijalankan:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-emerald-800">
                <li>Membuat struktur tabel/koleksi inti: <code>options</code>, <code>pages</code>, <code>posts</code>.</li>
                <li>Menanamkan halaman starter yang disesuaikan dengan tipe industri pilihan Anda.</li>
                <li>Menginisialisasi konfigurasi SEO Yoast dan XML Sitemap Engine otomatis.</li>
                <li>Mengunci rute <code>/setup</code> secara permanen demi keamanan produksi.</li>
              </ul>
            </div>

            {success ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-medium text-sm">
                Instalasi berhasil! Mengarahkan Anda ke dashboard admin...
              </div>
            ) : (
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setStep(4)}
                  disabled={installing}
                  icon={ArrowLeft}
                >
                  Kembali
                </Button>

                <Button
                  variant="primary"
                  onClick={handleRunInstall}
                  disabled={installing}
                  loading={installing}
                  icon={Sparkles}
                >
                  {installing ? 'Mengeksekusi Migrasi...' : 'Pasang Ultra CMS Sekarang'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
