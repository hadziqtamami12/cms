import React, { useState } from 'react';
import {
  MessageCircle,
  Smartphone,
  Check,
  Save,
  RefreshCw,
  Sparkles,
  Phone,
  Layout,
  ExternalLink,
  ShieldCheck,
  Send,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import FloatingWhatsApp from '../common/FloatingWhatsApp';
import WhatsAppChatModal from '../common/WhatsAppChatModal';
import { updateAppSettings } from '../../lib/api';

/**
 * WhatsApp Floating Chat Studio (Admin Panel)
 * Focused purely on the dedicated Floating Quick Contact button & Chat Popup modal.
 * WhatsApp is cleanly separated from bottom nav (Zero Clutter Policy).
 */
export const WhatsAppStudio = ({
  config = {},
  adminToken,
  onConfigUpdated,
  showToast
}) => {
  const existingWa = config.whatsapp_settings || {};
  const legacyFloating = config.floating_whatsapp || {};

  const [enabled, setEnabled] = useState(
    existingWa.enabled !== undefined ? existingWa.enabled : (legacyFloating.enabled !== false)
  );

  const [actionType, setActionType] = useState(
    existingWa.actionType || 'popup' // 'popup' | 'direct'
  );

  const [phone, setPhone] = useState(
    existingWa.phone || legacyFloating.phone || config.whatsapp || '6281288990011'
  );

  const [brandName, setBrandName] = useState(
    existingWa.brandName || config.brandName || 'Customer Support Official'
  );

  const [messageTemplate, setMessageTemplate] = useState(
    existingWa.messageTemplate || legacyFloating.messageTemplate || 'Halo, saya ingin bertanya informasi lebih lanjut.'
  );

  const [welcomeMessage, setWelcomeMessage] = useState(
    existingWa.welcomeMessage || 'Halo kak! Ada yang bisa kami bantu seputar produk, armada, atau reservasi Anda hari ini? Silakan pilih opsi cepat di bawah atau ketik pesan Anda 😊'
  );

  const [saving, setSaving] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const cleanPhone = String(phone).replace(/[^0-9]/g, '');

    const whatsappPayload = {
      enabled,
      actionType,
      phone: cleanPhone,
      brandName,
      messageTemplate,
      welcomeMessage
    };

    const floatingPayload = {
      enabled,
      phone: cleanPhone,
      messageTemplate,
      actionType
    };

    try {
      const res = await updateAppSettings({
        whatsapp: cleanPhone,
        whatsapp_settings: whatsappPayload,
        floating_whatsapp: floatingPayload
      }, adminToken);

      if (res && res.success) {
        if (showToast) {
          showToast('Pengaturan Floating WhatsApp berhasil disimpan permanen ke database!');
        }
        if (onConfigUpdated) {
          onConfigUpdated({
            ...config,
            whatsapp: cleanPhone,
            whatsapp_settings: whatsappPayload,
            floating_whatsapp: floatingPayload
          });
        }
      } else {
        if (showToast) showToast('Gagal menyimpan ke database');
      }
    } catch (err) {
      console.error('[WhatsAppStudio] Save error:', err);
      if (showToast) showToast('Terjadi kesalahan saat menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Studio Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Floating WhatsApp Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Pengaturan Tombol Floating WhatsApp & Chat Popup
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Kelola tombol mengambang kontak cepat WhatsApp di sudut layar dan pesan sambutan interaktif ala WordPress tanpa mengganggu bar navigasi bawah.
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Main Form & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full min-w-0 items-start">
        {/* Left Column: Configuration Controls (7 Cols on desktop) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6 min-w-0">
          {/* Card 1: Status & Perilaku Klik */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <MessageCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    1. Status Tombol Floating WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tombol kontak mengambang di sudut kanan bawah layar pengunjung.
                  </p>
                </div>
              </div>

              {/* Master Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            {/* Perilaku Klik Tombol */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 block">
                Perilaku Klik Tombol (Interactive Action):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setActionType('popup')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    actionType === 'popup'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    actionType === 'popup' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {actionType === 'popup' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Chat Popup WordPress</span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Buka modal interaktif otentik dengan opsi pesan instan.
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActionType('direct')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    actionType === 'direct'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    actionType === 'direct' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {actionType === 'direct' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Direct WA Link</span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Langsung buka tautan resmi wa.me di tab baru.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Informasi Kontak & Pesan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  2. Kredensial Kontak & Pesan Sambutan
                </h3>
                <p className="text-xs text-slate-500">
                  Data yang digunakan saat pengunjung memulai obrolan dengan tim Anda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor WhatsApp CS:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="6281288990011"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Awali dengan kode negara tanpa simbol + (contoh: 62812...)
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Brand / CS Display:
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Customer Support Official"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pesan Pembuka dari Pengunjung (Template):
              </label>
              <input
                type="text"
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Halo, saya ingin bertanya informasi lebih lanjut."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Greeting Sambutan CS di Chat Popup:
              </label>
              <textarea
                rows={2}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan WhatsApp ke Database</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Live Interactive Mockup & Test Studio (5 Cols on desktop) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-xl flex flex-col justify-between border-4 border-slate-800 space-y-4 min-w-0">
          {/* Phone Frame Header */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-2 select-none">
            <span>9:41</span>
            <div className="w-20 h-3.5 bg-slate-950 rounded-full" />
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <div className="w-3 h-2 bg-emerald-400 rounded-xs" />
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="h-80 sm:h-96 bg-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden border border-slate-700/60 shadow-inner">
            {/* Simulated Hero & Content */}
            <div className="space-y-2 select-none">
              <div className="w-24 h-2 bg-emerald-500/80 rounded-full" />
              <div className="w-40 h-4 bg-white/90 rounded-md font-bold text-[10px] text-slate-900 flex items-center px-1.5 truncate">
                {brandName}
              </div>
              <div className="w-32 h-1.5 bg-slate-400/50 rounded-full" />

              {/* Status Pills */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800/60">
                  Status: {enabled ? 'Aktif' : 'Nonaktif'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[9px] font-bold border border-purple-800/60">
                  Aksi: {actionType === 'popup' ? 'Chat Popup' : 'Direct Link'}
                </span>
              </div>
            </div>

            {/* Test Trigger Button in Mockup */}
            <div className="text-center py-2">
              <button
                type="button"
                onClick={() => setTestModalOpen(true)}
                className="py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1.5 transition-colors border border-white/10"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Uji Coba Tampilan Chat Popup
              </button>
            </div>

            {/* Embedded Floating WA Simulation in Mockup */}
            {enabled && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (actionType === 'popup') setTestModalOpen(true);
                    else window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#25D366] text-white shadow-md text-[10px] font-bold transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Chat WA</span>
                </button>
              </div>
            )}
          </div>

          {/* Preview Footer Note */}
          <div className="text-center text-[10px] text-slate-400 leading-tight">
            ⚡ Pratinjau interaktif langsung: Klik tombol uji coba untuk mengetes modal chat popup.
          </div>
        </div>
      </div>

      {/* Interactive Modal Preview */}
      <WhatsAppChatModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        phone={phone}
        brandName={brandName}
        welcomeMessage={welcomeMessage}
      />
    </div>
  );
};

export default WhatsAppStudio;
