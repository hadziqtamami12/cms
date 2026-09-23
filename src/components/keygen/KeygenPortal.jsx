import React, { useState } from 'react';
import { Key, Unlock, ShieldCheck, Copy, Check, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { programmerKeygenLogin, generateKeygenLicense, emergencyOverrideUnlock } from '../../lib/api';

export const KeygenPortal = () => {
  const [masterKey, setMasterKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keygen Generator Form
  const [clientName, setClientName] = useState('');
  const [licenseType, setLicenseType] = useState('yearly'); // 'trial' | 'yearly'
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Override status
  const [overrideMessage, setOverrideMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await programmerKeygenLogin(masterKey);
      if (res.success) {
        setIsAuthenticated(true);
      } else {
        setError(res.error || 'Master Key Programmer tidak valid');
      }
    } catch (err) {
      setError(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!clientName) {
      setError('Masukkan ID atau nama klien/proyek.');
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);

    try {
      const res = await generateKeygenLicense({
        clientName,
        type: licenseType
      }, masterKey);

      if (res.success && res.data) {
        setGeneratedResult(res.data);
      } else {
        setError(res.error || 'Gagal generate lisensi');
      }
    } catch (err) {
      setError(err.message || 'Error saat generate');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (generatedResult?.licenseKey) {
      navigator.clipboard.writeText(generatedResult.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOverrideUnlock = async () => {
    setLoading(true);
    setOverrideMessage('');
    try {
      const res = await emergencyOverrideUnlock(masterKey, 'Programmer Emergency Override Unlock from Keygen Portal');
      if (res.success) {
        setOverrideMessage('✅ Sukses! Status persetujuan programmer aktif. Sistem di-unlock secara instan!');
      } else {
        setError(res.error || 'Gagal membuka sistem');
      }
    } catch (err) {
      setError(err.message || 'Gagal eksekusi override');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white mb-4 shadow-md">
            <Key className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Secret Programmer Keygen Portal
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Dedicated portal for cryptographic 16-character license generation and system overrides.
          </p>
        </div>

        {/* State 1: Programmer Master Authentication */}
        {!isAuthenticated ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-10">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Autentikasi Master Key Programmer</h2>
            <p className="text-xs text-slate-500 mb-6">
              Masukkan master secret passphrase yang tercatat pada environment (<code className="text-blue-600 font-mono">PROGRAMMER_SECRET_KEY</code>).
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Master Passphrase
                </label>
                <input
                  type="password"
                  placeholder="Masukkan master key programmer..."
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all"
              >
                {loading ? 'Memvalidasi...' : 'Masuk ke Portal Keygen'}
              </button>
            </form>
          </div>
        ) : (
          /* State 2: Keygen Generator & Override Dashboard */
          <div className="space-y-6">
            {/* License Generator Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">16-Character License Generator</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Authorized Session
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Klien / ID Proyek
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT_MAJU_JAYA atau RENTAL_BALI_2026"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Tipe & Durasi Lisensi
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLicenseType('trial')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                        licenseType === 'trial'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Trial 1 Bulan (30 Hari)
                    </button>

                    <button
                      type="button"
                      onClick={() => setLicenseType('yearly')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                        licenseType === 'yearly'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Yearly License (365 Hari)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Generate Kunci Lisensi 16-Karakter</span>
                </button>
              </form>

              {/* Generated License Result Box */}
              {generatedResult && (
                <div className="mt-6 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
                    Lisensi Berhasil Diterbitkan
                  </div>

                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-blue-200">
                    <span className="font-mono text-lg font-extrabold text-blue-900 tracking-wider">
                      {generatedResult.licenseKey}
                    </span>
                    <button
                      onClick={handleCopyKey}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Tipe: </span>
                      <strong className="capitalize">{generatedResult.type} ({generatedResult.durationDays} hari)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Kedaluwarsa: </span>
                      <strong>{new Date(generatedResult.expiresAt).toLocaleDateString('id-ID')}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Programmer Bypass & Unlock Card */}
            <div className="bg-white rounded-2xl border border-amber-200 shadow-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <Unlock className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold">Emergency Override: Approve & Unlock Project</h3>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Gunakan tombol override ini jika token kedaluwarsa atau terjadi kendala darurat. Sistem akan langsung memulihkan rute publik dan admin tanpa menunggu aktivasi token baru.
              </p>

              {overrideMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {overrideMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleOverrideUnlock}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Approve & Unlock Project Instantly</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeygenPortal;
