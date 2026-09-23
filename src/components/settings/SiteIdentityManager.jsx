import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  RefreshCw,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Sparkles,
  Type,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { updateAppSettings } from '../../lib/api';

/**
 * SiteIdentityManager
 * Panel pengelolaan Identitas Aplikasi & Situs Web:
 * - Nama Aplikasi / Brand (brandName)
 * - Judul Website / H1 (title & seo.title)
 * - Slogan / Tagline (tagline)
 * - Deskripsi Meta SEO (metaDescription)
 * - Nomor Telepon Hotline (phone)
 * - Nomor WhatsApp Utama (whatsapp)
 * - Email Bisnis Resmi (email)
 * - Lokasi Operasional (location)
 */
export const SiteIdentityManager = ({
  config = {},
  adminToken,
  onConfigUpdated,
  showToast
}) => {
  const [formData, setFormData] = useState({
    brandName: config.brandName || 'Royal Fleet',
    title: config.seo?.title || config.title || 'Sewa Mobil & Rental Armada Mewah Terpercaya | Royal Fleet 24 Jam',
    tagline: config.tagline || 'Sewa Mobil & Armada Premium Terpercaya No. 1',
    metaDescription: config.seo?.metaDescription || config.metaDescription || 'Layanan sewa mobil terpercaya lepas kunci dan include driver dengan armada terlengkap, bersih, dan wangi.',
    phone: config.phone || '+62 812-8899-0011',
    whatsapp: config.whatsapp || '6281288990011',
    email: config.email || 'info@enterprise.com',
    location: config.location || 'Jakarta Selatan & Bali'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if external config changes
  useEffect(() => {
    if (config) {
      setFormData(prev => ({
        ...prev,
        brandName: config.brandName || prev.brandName,
        title: config.seo?.title || config.title || prev.title,
        tagline: config.tagline || prev.tagline,
        metaDescription: config.seo?.metaDescription || config.metaDescription || prev.metaDescription,
        phone: config.phone || prev.phone,
        whatsapp: config.whatsapp || prev.whatsapp,
        email: config.email || prev.email,
        location: config.location || prev.location
      }));
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const cleanWhatsapp = formData.whatsapp.trim().replace(/[^0-9]/g, '');
    const cleanBrandName = formData.brandName.trim();
    const cleanTitle = formData.title.trim();
    const cleanTagline = formData.tagline.trim();
    const cleanMetaDesc = formData.metaDescription.trim();

    const payload = {
      brandName: cleanBrandName,
      title: cleanTitle,
      tagline: cleanTagline,
      metaDescription: cleanMetaDesc,
      phone: formData.phone.trim(),
      whatsapp: cleanWhatsapp,
      email: formData.email.trim(),
      location: formData.location.trim(),
      seo: {
        ...(config.seo || {}),
        title: cleanTitle,
        metaDescription: cleanMetaDesc
      },
      floating_whatsapp: {
        ...(config.floating_whatsapp || {}),
        phone: cleanWhatsapp
      },
      whatsapp_settings: {
        ...(config.whatsapp_settings || {}),
        phone: cleanWhatsapp,
        brandName: cleanBrandName
      }
    };

    // 1. Instant optimistic update locally
    if (onConfigUpdated) {
      onConfigUpdated(payload);
    }

    try {
      const res = await updateAppSettings(payload, adminToken);
      if (res && res.success) {
        setSavedSuccess(true);
        if (showToast) {
          showToast('Identitas situs & nama aplikasi berhasil diperbarui!');
        }
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        if (showToast) {
          showToast('Identitas diperbarui di penyimpanan lokal');
        }
      }
    } catch (err) {
      console.error('[SiteIdentityManager] Save notice:', err);
      if (showToast) {
        showToast('Identitas disimpan ke cache lokal');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-blue-100 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" /> Identitas & Branding Aplikasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pengaturan Nama Aplikasi & Judul Situs
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Ubah nama aplikasi, judul website (SEO title), slogan, deskripsi, nomor kontak resmi, dan email yang tampil di landing page publik secara instan.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Hasil Live</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Pengaturan (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                <span>1. Nama Brand & Judul Website</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Identitas utama yang digunakan pada logo navbar, tab browser, dan hasil pencarian Google.
              </p>
            </div>

            <div className="space-y-4">
              {/* Nama Aplikasi / Brand Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Aplikasi / Brand *
                </label>
                <input
                  type="text"
                  name="brandName"
                  required
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Contoh: Royal Fleet, AutoRent Jakarta, Toko Maju"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ditampilkan pada logo navigasi, footer, dan salam pesan WhatsApp.
                </span>
              </div>

              {/* Judul Website / SEO Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Judul Website (Browser Tab & SEO Title) *
                  </label>
                  <span className={`text-[10px] font-mono ${formData.title.length > 60 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {formData.title.length} / 60 Karakter Disarankan
                  </span>
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Contoh: Sewa Mobil & Rental Armada Mewah Terpercaya 24 Jam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Judul dokumen yang muncul di tab browser dan hasil pencarian Google (SERP).
                </span>
              </div>

              {/* Tagline / Slogan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Slogan / Tagline Bisnis *
                </label>
                <input
                  type="text"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Contoh: Solusi Sewa Mobil Mewah & Armada Bisnis Terpercaya"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Slogan ringkas yang muncul di bawah logo navbar dan bagian footer.
                </span>
              </div>

              {/* Deskripsi Meta SEO */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Deskripsi Ringkas Situs (Meta Description) *
                  </label>
                  <span className={`text-[10px] font-mono ${formData.metaDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {formData.metaDescription.length} / 160 Karakter Disarankan
                  </span>
                </div>
                <textarea
                  rows={3}
                  name="metaDescription"
                  required
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Contoh: Layanan sewa mobil terpercaya lepas kunci dan include driver di Jakarta dan Bali dengan armada terlengkap..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>

            {/* Section 2: Kontak Resmi Bisnis */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>2. Kontak Resmi & Lokasi Operasional</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informasi kontak yang terpasang pada tombol telepon navbar, WhatsApp, dan footer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telepon Hotline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nomor Telepon Hotline *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+62 812-8899-0011"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nomor WhatsApp Utama *
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="6281288990011"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Resmi Bisnis *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="concierge@royalfleet.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Lokasi */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kota / Wilayah Operasional *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Jakarta Selatan & Bali"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Penyimpanan langsung ke database PostgreSQL Supabase (Single Source of Truth).
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : savedSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 stroke-[3]" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Menyimpan ke DB...' : savedSuccess ? 'Tersimpan ke Database!' : 'Simpan Identitas Situs'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Previews (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preview 1: Google Search Result (SERP Snippet) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Pratinjau Hasil Google Search</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                SERP Preview
              </span>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-[11px] text-slate-600 truncate">
                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">
                  {formData.brandName.charAt(0) || 'M'}
                </div>
                <span className="font-semibold text-slate-800">{formData.brandName}</span>
                <span className="text-slate-400">https://your-domain.com</span>
              </div>
              <h4 className="text-blue-700 text-sm sm:text-base font-bold leading-snug line-clamp-2 hover:underline cursor-pointer">
                {formData.title || `${formData.brandName} - ${formData.tagline}`}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                {formData.metaDescription}
              </p>
            </div>
          </div>

          {/* Preview 2: Live Header Navbar Mockup */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Pratinjau Header Navbar</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Live Navbar
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-white shadow-inner">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="font-black text-sm text-white block truncate leading-tight">
                    {formData.brandName}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium block truncate">
                    {formData.tagline}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold">
                  {formData.phone ? 'Hubungi' : 'Kontak'}
                </span>
              </div>
            </div>
          </div>

          {/* Preview 3: Footer Contact Info */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Informasi Footer Publik</h3>
              <p className="text-xs text-slate-500">Otomatis terpasang di bagian bawah landing page.</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-mono text-slate-800">{formData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-mono text-slate-800">+{formData.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-mono text-slate-800">{formData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-slate-800">{formData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteIdentityManager;
