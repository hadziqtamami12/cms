import React, { useState } from 'react';
import { Lock, User, Shield, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginAdmin } from '../../utils/api';
import { Button, Input, Card } from '../../components/ui';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Login gagal, periksa username/password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      {/* Brand Icon / Header */}
      <div className="mb-6 text-center">
        <a
          href="/"
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-xs hover:bg-slate-800 transition-colors"
          title="Kembali ke Situs Utama"
        >
          CMS
        </a>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight mt-4">
          Masuk ke CMS Admin
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola konten, halaman visual builder, dan konfigurasi sistem
        </p>
      </div>

      <Card className="max-w-[400px] w-full p-6 sm:p-7 bg-white border border-slate-200/80 shadow-xs rounded-2xl">
        {/* Quick Credentials Info Box */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Kredensial Default:</span>
            <span className="font-mono text-xs font-semibold text-slate-800">
              admin / admin123
            </span>
          </div>
          <button
            type="button"
            onClick={fillDefaultCredentials}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition-colors shadow-xs"
          >
            Isi Otomatis
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-medium">
            <strong>GALAT:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Pengguna atau Email"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-medium text-sm">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <span>Ingat Sesi Saya</span>
            </label>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full justify-center mt-2"
          >
            Masuk ke Dashboard
          </Button>
        </form>
      </Card>

      <div className="mt-6 text-center text-xs space-y-2">
        <a href="/" className="text-slate-500 hover:text-slate-900 transition-colors block">
          ← Kembali ke Halaman Utama Website
        </a>
        <span className="text-slate-400 text-[11px] block">
          Minimalist Ultra CMS Engine • Inspired by Linear & Stripe
        </span>
      </div>
    </div>
  );
}
