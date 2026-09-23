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
import MobileBottomNav from '../common/MobileBottomNav';
import WhatsAppChatModal from '../common/WhatsAppChatModal';
import { updateAppSettings } from '../../lib/api';

/**
 * WhatsApp & Floating Chat Studio (Admin Panel)
 * Allows customizing:
 * 1. Display Mode (Integrated in Bottom Nav vs Floating Button vs Both)
 * 2. Bottom Nav WA Position (Center Detached Bubble vs Right Tab)
 * 3. Action Type (WordPress-style Chat Popup vs Direct wa.me link)
 * 4. Contact credentials & greeting templates
 * 5. Instant persistence to database (Single Source of Truth)
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

  const [displayMode, setDisplayMode] = useState(
    existingWa.displayMode || 'bottom_nav' // 'bottom_nav' | 'floating' | 'both'
  );

  const [navPosition, setNavPosition] = useState(
    existingWa.navPosition || 'center' // 'center' | 'right'
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

  // Bottom Nav variant to preview
  const bottomNavVariant = config.bottom_nav_variant || config.bottomNavStyle || 'detached_floating_bubble';

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const cleanPhone = String(phone).replace(/[^0-9]/g, '');

    const whatsappPayload = {
      enabled,
      displayMode,
      navPosition,
      actionType,
      phone: cleanPhone,
      brandName,
      messageTemplate,
      welcomeMessage
    };

    const floatingPayload = {
      enabled: enabled && (displayMode === 'floating' || displayMode === 'both'),
      phone: cleanPhone,
      messageTemplate,
      displayMode,
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
          showToast('Pengaturan WhatsApp berhasil disimpan permanen ke database!');
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
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> WhatsApp Interactive Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Integrasi WhatsApp & Mobile Bottom Navigation
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Satukan tombol WhatsApp langsung ke dalam Navigation Bar bawah ponsel untuk tampilan bersih bebas tumpukan tombol (Zero Clutter Policy), atau pilih model pop-up chat ala WordPress.
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Main Form & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full min-w-0 items-start">
        {/* Left Column: Configuration Controls (7 Cols on desktop) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6 min-w-0">
          {/* Card 1: Mode Tampilan WhatsApp */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Layout className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    1. Mode Tampilan WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tentukan bagaimana tombol kontak WhatsApp ditampilkan pada perangkat pengguna.
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

            {/* 3 Display Mode Choices */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              {/* Option A: Bottom Nav (Recommended) */}
              <div
                onClick={() => setDisplayMode('bottom_nav')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 relative ${
                  displayMode === 'bottom_nav'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  displayMode === 'bottom_nav' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {displayMode === 'bottom_nav' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      Satu Kesatuan di Bottom Navigation Bar
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      Rekomendasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Tombol WA menjadi salah satu tab utama di bar bawah ponsel. Menghapus floating button tumpuk sehingga layar ponsel 100% bersih dan rapi.
                  </p>
                </div>
              </div>

              {/* Option B: Floating Only */}
              <div
                onClick={() => setDisplayMode('floating')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 relative ${
                  displayMode === 'floating'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  displayMode === 'floating' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {displayMode === 'floating' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-slate-900 block">
                    Floating Action Button Bebas (Pojok Layar)
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Tombol bulat mengambang klasik di pojok kanan bawah. Navigasi bawah ponsel hanya menampilkan menu halaman biasa.
                  </p>
                </div>
              </div>

              {/* Option C: Both Active */}
              <div
                onClick={() => setDisplayMode('both')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 relative ${
                  displayMode === 'both'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  displayMode === 'both' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {displayMode === 'both' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-slate-900 block">
                    Keduanya Aktif Bersamaan
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Tombol WhatsApp hadir di dalam Mobile Bottom Nav dan juga tombol floating melayang di atasnya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Posisi & Aksi Tombol WA di Navigasi Bawah */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  2. Posisi & Perilaku Klik Tombol WhatsApp
                </h3>
                <p className="text-xs text-slate-500">
                  Kustomisasi tata letak di bar navigasi dan pengalaman interaktif pengunjung.
                </p>
              </div>
            </div>

            {/* Posisi Tombol */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Posisi Tombol di Mobile Bottom Nav:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setNavPosition('center')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    navPosition === 'center'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    navPosition === 'center' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {navPosition === 'center' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Pusat / Center Action</span>
                    <span className="text-[10px] text-slate-500">Bola Terangkat Bebas (FAB)</span>
                  </div>
                </div>

                <div
                  onClick={() => setNavPosition('right')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    navPosition === 'right'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    navPosition === 'right' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {navPosition === 'right' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Ujung Kanan Bar</span>
                    <span className="text-[10px] text-slate-500">Tab Terakhir Samping Menu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perilaku Klik Tombol */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Perilaku Klik Tombol (Interactive Action):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setActionType('popup')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    actionType === 'popup'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    actionType === 'popup' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {actionType === 'popup' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Chat Popup WordPress</span>
                    <span className="text-[10px] text-slate-500">Buka modal interaktif instan</span>
                  </div>
                </div>

                <div
                  onClick={() => setActionType('direct')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    actionType === 'direct'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    actionType === 'direct' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {actionType === 'direct' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Direct WA Link</span>
                    <span className="text-[10px] text-slate-500">Langsung buka link wa.me</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Informasi Kontak & Pesan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <MessageCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  3. Nomor WhatsApp & Pesan Template
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
                  Awali dengan kode negara (contoh: 62812...)
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
          <div className="h-80 sm:h-96 bg-slate-800 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border border-slate-700/60 shadow-inner">
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
                  Mode: {displayMode}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[9px] font-bold border border-blue-800/60">
                  Posisi: {navPosition}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[9px] font-bold border border-purple-800/60">
                  Aksi: {actionType}
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

            {/* Embedded Live Mobile Bottom Nav Preview */}
            <div className="relative w-full pt-2 min-w-0">
              <MobileBottomNav
                styleVariant={bottomNavVariant}
                whatsapp={phone}
                brandName={brandName}
                welcomeMessage={welcomeMessage}
                waPosition={navPosition}
                waAction={actionType}
                isAlwaysVisible={true}
              />
            </div>
          </div>

          {/* Preview Footer Note */}
          <div className="text-center text-[10px] text-slate-400 leading-tight">
            ⚡ Pratinjau interaktif langsung: Klik tombol WhatsApp pada preview di atas untuk menguji respon animasi & chat modal.
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
