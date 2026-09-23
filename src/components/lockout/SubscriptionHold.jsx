import React, { useState } from 'react';
import { Lock, ShieldAlert, Key, CheckCircle2, ArrowRight, MessageSquare, PhoneCall } from 'lucide-react';
import { formatLicenseKey } from '../../lib/licenseUtils';

export const SubscriptionHold = ({ onRenewSuccess, programmerContact = '+62 812-3456-7890' }) => {
  const [newKey, setNewKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleReactivate = async (e) => {
    e.preventDefault();
    if (!newKey || newKey.length < 19) {
      setStatusMessage({ type: 'error', text: 'Format lisensi tidak valid (XXXX-XXXX-XXXX-XXXX).' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/installer/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: newKey })
      });
      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { success: false, error: 'Respon server tidak valid' };
      }
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Lisensi berhasil diperpanjang! Mengalihkan...' });
        setTimeout(() => {
          if (onRenewSuccess) onRenewSuccess();
          else window.location.reload();
        }, 1500);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Gagal memperbarui lisensi' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Terjadi kesalahan jaringan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-warm flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Lockout Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-elevated p-8 sm:p-12 text-center">
          {/* Animated Lock Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 mb-6 shadow-sm">
            <Lock className="w-10 h-10 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-4 h-4" />
            <span>Subscription Hold / Token Expired</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Layanan Sementara Ditangguhkan
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Masa aktif lisensi sistem CMS untuk instance ini telah berakhir. Seluruh rute publik dan panel administrasi terkunci demi keamanan data Anda.
          </p>

          {/* Re-activation Key Input Form */}
          <form onSubmit={handleReactivate} className="mt-8 text-left space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Aktivasi Kunci Lisensi Baru (16 Karakter)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={19}
                  placeholder="Y365-XXXX-XXXX-XXXX"
                  value={newKey}
                  onChange={(e) => setNewKey(formatLicenseKey(e.target.value))}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-center text-lg font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                />
              </div>
            </div>

            {statusMessage.text && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>{loading ? 'Memvalidasi...' : 'Aktifkan Lisensi & Buka Sistem'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Programmer Assistance Contact Box */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-slate-600 text-xs space-y-3">
            <p className="font-medium">
              Butuh perpanjangan lisensi atau persetujuan programmer (approval status)?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${programmerContact.replace(/[^0-9]/g, '')}?text=Halo%20saya%20ingin%20perpanjang%20lisensi%20CMS`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi Programmer via WA</span>
              </a>

              <a
                href={`tel:${programmerContact.replace(/[^0-9+]/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{programmerContact}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHold;
