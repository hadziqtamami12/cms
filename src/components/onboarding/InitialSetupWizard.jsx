import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Briefcase, 
  Car, 
  Newspaper, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  ShieldCheck,
  Lock,
  User,
  Globe,
  Eye,
  EyeOff,
  Sliders,
  Check
} from 'lucide-react';
import { THEME_OPTIONS } from './ThemeOnboardingModal';

export const InitialSetupWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('automotive');
  
  // Credentials & Slug
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [adminSlug, setAdminSlug] = useState('admin');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentTheme = THEME_OPTIONS.find(t => t.id === selectedCategory) || THEME_OPTIONS[0];

  const handleFinishSetup = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          adminUser: adminUser.trim(),
          adminPassword: adminPassword.trim(),
          adminSlug: adminSlug.trim().replace(/^\/+|\/+$/g, '') || 'admin'
        })
      });

      const json = await res.json();
      if (json.success) {
        if (onComplete) {
          onComplete(json);
        }
      } else {
        setError(json.error || 'Gagal menyelesaikan setup.');
      }
    } catch (err) {
      setError('Koneksi server gagal. Pastikan server backend sedang aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-3xl mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Setup Awal CMS Siap Pakai</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Konfigurasi Cepat Website & CMS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Pilih jenis website Anda dan buat akun administrator dalam 2 langkah mudah.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              step === 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Pilih Kategori CMS</span>
            </div>
            <div className="w-6 h-0.5 bg-slate-800" />
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              step === 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>Kredensial & URL Admin</span>
            </div>
          </div>
        </div>

        {/* Wizard Box */}
        <div className="bg-white rounded-3xl text-slate-800 shadow-2xl border border-slate-100 overflow-hidden">
          {error && (
            <div className="m-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PILIH KATEGORI CMS */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Langkah 1: Tentukan Kategori CMS Anda
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Layout, modul fitur, data seeder, dan schema SEO akan disesuaikan otomatis dengan kategori terpilih.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEME_OPTIONS.map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = selectedCategory === theme.id;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedCategory(theme.id)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? `${theme.borderActive} shadow-md scale-[1.01]`
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.accentColor} text-white flex items-center justify-center shadow-md`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                          {theme.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          {theme.tagline}
                        </p>

                        <div className="space-y-1 pt-2 border-t border-slate-100">
                          {theme.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
                        Contoh: <strong className="text-slate-600">{theme.sampleBrand}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Terpilih: <strong className="text-slate-800">{currentTheme.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>Lanjut: Akun Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: KREDENSIAL & SLUG ADMIN */}
          {step === 2 && (
            <form onSubmit={handleFinishSetup} className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Langkah 2: Akun Administrator & Alamat URL
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Atur username dan password untuk masuk ke panel admin, serta tentukan alamat URL admin.
                </p>
              </div>

              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Username Administrator
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Gunakan untuk login ke panel admin.</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Password Administrator
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Masukkan password admin"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Password akan dienkripsi dengan standar Bcrypt.</p>
                </div>

                {/* Dynamic Admin Slug */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Alamat URL Portal Admin (Default: <code>/admin</code>)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={adminSlug}
                      onChange={(e) => setAdminSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-blue-600 font-bold"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Preview akses login:</span>
                    <code className="text-blue-600 font-bold font-mono bg-blue-50 px-2 py-0.5 rounded">
                      /{adminSlug || 'admin'}
                    </code>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    💡 Alamat URL admin ini dapat diubah kapan saja di Panel Admin (menu Pengaturan Keamanan).
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan & Menyiapkan Website...</span>
                    </>
                  ) : (
                    <>
                      <span>Selesaikan Setup & Buka Website</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialSetupWizard;
