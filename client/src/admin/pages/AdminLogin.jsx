import React, { useState } from 'react';
import {
  Lock, User, Shield, ArrowRight, Eye, EyeOff, Sparkles,
  CheckCircle2, Layers, BarChart3, Globe, Command, KeyRound,
  ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { loginAdmin } from '../../utils/api';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDefaultCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginAdmin(username, password);
      if (data.needsSetup) {
        window.location.href = '/setup';
        return;
      }
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError(err.message || 'Kredensial tidak valid. Silakan periksa username dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex font-sans antialiased text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* LEFT COLUMN: 45% Desktop Showcase (Executive Dark Canvas - Clerk/Supabase Auth Style) */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-950 text-white relative flex-col justify-between p-12 overflow-hidden border-r border-slate-900">
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

        {/* Top Branding */}
        <div className="relative z-10">
          <a href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                Ultra<span className="text-indigo-400">CMS</span> Pro
              </span>
              <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">
                Enterprise Content Management Suite
              </span>
            </div>
          </a>
        </div>

        {/* Center Mockup / Testimonial Showcase */}
        <div className="relative z-10 space-y-6 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-indigo-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>High-Speed Static Generation & Live Visual Engine</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Kendali Penuh Portal Web Anda dalam Satu Dashboard.
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Kelola katalog armada mobil, artikel SEO-friendly, layout visual drag-and-drop, dan analitik konversi secara instan tanpa kendala teknis.
          </p>

          {/* Mini Dashboard Metrics Preview Card */}
          <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Statistik Kinerja Sistem</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Status
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">PageSpeed</span>
                <span className="text-sm font-black text-emerald-400">100 / 100</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Server Uptime</span>
                <span className="text-sm font-black text-indigo-400">99.99%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Database</span>
                <span className="text-sm font-black text-amber-400">Serverless</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-900/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>End-to-End Encrypted Session</span>
          </div>
          <span className="font-mono text-[11px]">v2.4.0</span>
        </div>
      </div>

      {/* RIGHT COLUMN: 55% Login Form Area (Minimalist, Spacious, Focus-Driven) */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-slate-50 lg:bg-white">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-md">
              <Command className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">
              UltraCMS Admin
            </span>
          </a>
        </div>

        {/* Center Auth Card */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Masuk ke Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Masukkan kredensial administrator Anda untuk mengakses panel kendali.
            </p>
          </div>

          {/* Quick Credential Helper Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Akun Bawaan (Default):
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 truncate block">
                admin / admin123
              </span>
            </div>
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 text-xs font-bold transition-all shadow-xs shrink-0"
            >
              Isi Otomatis
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nama Pengguna / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Ingat sesi saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Footer Link */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <a href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1.5 font-medium">
            <span>← Kembali ke Halaman Publik</span>
          </a>
          <span className="text-[11px]">UltraCMS Enterprise • Secure Session</span>
        </div>
      </div>
    </div>
  );
}
