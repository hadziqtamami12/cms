import React, { useState } from 'react';
import { Database, Shield, Key, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Loader2, CloudUpload } from 'lucide-react';
import { testInstallerDb, completeInstaller } from '../../lib/api';
import { formatLicenseKey } from '../../lib/licenseUtils';

export const SetupWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Database & R2 Storage
  const [dbConfig, setDbConfig] = useState({
    dbType: 'postgres',
    connectionString: '',
    r2AccountId: '',
    r2AccessKey: '',
    r2SecretKey: '',
    r2Bucket: 'cms-assets'
  });
  const [dbTested, setDbTested] = useState(false);

  // Step 2: Admin Slug & Account
  const [adminConfig, setAdminConfig] = useState({
    adminSlug: 'admin',
    adminUser: 'admin',
    adminPassword: '',
    confirmPassword: ''
  });

  // Step 3: License Activation
  const [licenseConfig, setLicenseConfig] = useState({
    licenseKey: '',
    clientName: ''
  });

  // Step 4: Industry & Starter Theme
  const [starterConfig, setStarterConfig] = useState({
    selectedIndustry: 'automotive',
    selectedThemeId: 'fleet-grid',
    bottomNavStyle: 'dock'
  });

  const industries = [
    { id: 'automotive', name: 'Rental & Otomotif', icon: '🚗', desc: 'Sewa mobil, motor, armada tour & chauffeur' },
    { id: 'ecommerce', name: 'E-Commerce & Retail', icon: '🛍️', desc: 'Toko online, flash sale & brand showcase' },
    { id: 'fnb', name: 'F&B & Kuliner', icon: '☕', desc: 'Resto, kafe, bakery & catering delivery' },
    { id: 'services', name: 'Jasa Profesional', icon: '💼', desc: 'Konsultan, klinik kecantikan, bengkel & legal' },
    { id: 'realestate', name: 'Properti & Real Estate', icon: '🏢', desc: 'Perumahan, villa, apartemen & ruko komersial' }
  ];

  // Test DB Action
  const handleTestDb = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await testInstallerDb(dbConfig);
      if (res.success) {
        setDbTested(true);
      } else {
        setErrorMessage(res.error || 'Gagal menyambung ke database.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Koneksi database gagal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete Installer Action
  const handleComplete = async () => {
    if (!licenseConfig.licenseKey || licenseConfig.licenseKey.length < 19) {
      setErrorMessage('Masukkan lisensi 16-karakter valid (XXXX-XXXX-XXXX-XXXX)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        ...dbConfig,
        ...adminConfig,
        licenseKey: licenseConfig.licenseKey,
        clientName: licenseConfig.clientName || 'Enterprise Owner',
        selectedIndustry: starterConfig.selectedIndustry,
        selectedThemeId: starterConfig.selectedThemeId,
        bottomNavStyle: starterConfig.bottomNavStyle
      };

      const res = await completeInstaller(payload);
      if (res.success) {
        if (onComplete) onComplete(res);
        else window.location.href = `/${adminConfig.adminSlug || 'admin'}`;
      } else {
        setErrorMessage(res.error || 'Gagal menyelesaikan instalasi');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Instalasi error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-warm flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            First-Run Setup Installer Wizard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Inisialisasi sistem CMS Multi-Industri, proteksi lisensi, dan database dalam 4 langkah terpandu.
          </p>
        </div>

        {/* Interactive Step Indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { num: 1, label: 'DB & R2 Storage', icon: Database },
              { num: 2, label: 'Admin Portal', icon: Shield },
              { num: 3, label: 'Aktivasi Lisensi', icon: Key },
              { num: 4, label: 'Kategori Industri', icon: Sparkles },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[11px] sm:text-xs mt-2 font-semibold transition-colors ${
                    isActive ? 'text-blue-600' : isPast ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-6 sm:p-10 step-slide-in">
          {/* STEP 1: DB & R2 STORAGE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Langkah 1: Koneksi Basis Data & Cloudflare R2</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pilih tipe basis data yang Anda gunakan (PostgreSQL/Supabase, MySQL, MongoDB, atau Memory Dev).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Tipe Basis Data</label>
                <div className="grid grid-cols-3 gap-3">
                  {['postgres', 'mysql', 'mongodb'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDbConfig({ ...dbConfig, dbType: type })}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold capitalize text-center transition-all ${
                        dbConfig.dbType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Connection String / URI URI (Opsional untuk Dev)
                </label>
                <input
                  type="text"
                  placeholder="postgresql://postgres:password@localhost:5432/cms_db"
                  value={dbConfig.connectionString}
                  onChange={(e) => setDbConfig({ ...dbConfig, connectionString: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Biarkan kosong jika ingin menggunakan adapter in-memory fallback secara instan.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <CloudUpload className="w-4 h-4 text-slate-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Cloudflare R2 Media Storage (Opsional)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">R2 Account ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 9a8b7c6d5e4f3a2b1..."
                      value={dbConfig.r2AccountId}
                      onChange={(e) => setDbConfig({ ...dbConfig, r2AccountId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">R2 Access Key</label>
                    <input
                      type="password"
                      placeholder="Access Key ID"
                      value={dbConfig.r2AccessKey}
                      onChange={(e) => setDbConfig({ ...dbConfig, r2AccessKey: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleTestDb}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{dbTested ? '✓ Terkoneksi Sukses' : 'Uji Koneksi DB'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADMIN SLUG & ACCOUNT */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Langkah 2: Dynamic Admin Slug & Akun Superadmin</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Atur URL portal login admin secara dinamis untuk keamanan tingkat tinggi dan cegah brute-force crawler.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Dynamic Admin URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 text-sm font-mono">
                    https://domain.com/
                  </span>
                  <input
                    type="text"
                    placeholder="sys-portal"
                    value={adminConfig.adminSlug}
                    onChange={(e) => setAdminConfig({ ...adminConfig, adminSlug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                    className="flex-1 px-4 py-3 rounded-r-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Contoh: <code className="text-blue-600">sys-portal</code>, <code className="text-blue-600">cms-panel</code>, atau default <code className="text-blue-600">admin</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Superadmin Username
                  </label>
                  <input
                    type="text"
                    value={adminConfig.adminUser}
                    onChange={(e) => setAdminConfig({ ...adminConfig, adminUser: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Superadmin Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={adminConfig.adminPassword}
                    onChange={(e) => setAdminConfig({ ...adminConfig, adminPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!adminConfig.adminUser || !adminConfig.adminPassword) {
                      setErrorMessage('Username dan password admin wajib diisi.');
                      return;
                    }
                    setErrorMessage('');
                    setCurrentStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LISENSI 16 KARAKTER */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Langkah 3: Aktivasi Lisensi & Token Proteksi</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Masukkan kunci lisensi 16 karakter alfanumerik yang diterbitkan oleh programmer resmi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Nama Klien / ID Proyek
                </label>
                <input
                  type="text"
                  placeholder="PT Maju Bersama Sejahtera"
                  value={licenseConfig.clientName}
                  onChange={(e) => setLicenseConfig({ ...licenseConfig, clientName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  16-Character License Key (XXXX-XXXX-XXXX-XXXX)
                </label>
                <input
                  type="text"
                  placeholder="Y365-XXXX-XXXX-XXXX"
                  maxLength={19}
                  value={licenseConfig.licenseKey}
                  onChange={(e) => setLicenseConfig({ ...licenseConfig, licenseKey: formatLicenseKey(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-lg font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 text-center font-bold"
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Format tepat: 16 karakter alfanumerik kapital dipisahkan tanda strip.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Lisensi diverifikasi menggunakan algoritma HMAC matematis berkecepatan tinggi di backend.
                  Jika belum memiliki kunci, Anda dapat membuatnya melalui <strong>Secret Programmer Keygen Portal</strong>.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!licenseConfig.licenseKey || licenseConfig.licenseKey.length < 19) {
                      setErrorMessage('Format lisensi wajib 16 karakter dipisahkan strip (XXXX-XXXX-XXXX-XXXX).');
                      return;
                    }
                    setErrorMessage('');
                    setCurrentStep(4);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: STARTER INDUSTRY & THEME */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Langkah 4: Pilih Industri & Tema Awal</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pilih kategori landing page yang ingin Anda gunakan. Anda dapat beralih ke 50 variasi tema lainnya kapan saja via admin dengan 1 klik.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industries.map((ind) => (
                  <div
                    key={ind.id}
                    onClick={() => setStarterConfig({ ...starterConfig, selectedIndustry: ind.id })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      starterConfig.selectedIndustry === ind.id
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ind.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{ind.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{ind.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Gaya Mobile Bottom Navigation
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'dock', label: 'Floating Dock' },
                    { id: 'curved', label: 'Fixed Curved Scoop' },
                    { id: 'bubble', label: 'Floating Bubble' },
                    { id: 'box', label: 'Modern Box' }
                  ].map((nav) => (
                    <button
                      key={nav.id}
                      type="button"
                      onClick={() => setStarterConfig({ ...starterConfig, bottomNavStyle: nav.id })}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                        starterConfig.bottomNavStyle === nav.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {nav.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Selesaikan & Luncurkan CMS</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
