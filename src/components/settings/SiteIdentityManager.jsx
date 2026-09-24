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
  ShieldCheck,
  Smartphone,
  Image as ImageIcon,
  Layers,
  UploadCloud,
  Check
} from 'lucide-react';
import { updateAppSettings } from '../../lib/api';
import ImageUploadInput from '../common/ImageUploadInput';

/**
 * SiteIdentityManager
 * Panel pengelolaan Identitas Aplikasi & Situs Web:
 * - Nama Aplikasi / Brand (brandName)
 * - Logo Website Utama (logoUrl)
 * - PWA App Full Name (pwa_name)
 * - PWA App Short Name (pwa_short_name)
 * - PWA App Icon (pwa_icon)
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
    logoUrl: config.logoUrl || '/images/logo.png',
    pwa_name: config.pwa_name || config.brandName || 'Royal Fleet Rental Mobil & Wisata',
    pwa_short_name: config.pwa_short_name || config.brandName || 'RoyalFleet',
    pwa_icon: config.pwa_icon || '/icons/icon-192.png',
    title: config.seo?.title || config.title || 'Sewa Mobil & Rental Armada Mewah Terpercaya | Royal Fleet 24 Jam',
    tagline: config.tagline || 'Sewa Mobil & Armada Premium Terpercaya No. 1',
    metaDescription: config.seo?.metaDescription || config.metaDescription || 'Layanan sewa mobil terpercaya lepas kunci dan include driver dengan armada terlengkap, bersih, dan wangi.',
    phone: config.phone || '+62 812-8899-0011',
    whatsapp: config.whatsapp || '6281288990011',
    email: config.email || 'info@enterprise.com',
    location: config.location || 'Jakarta Selatan & Bali',
    google_maps_embed_url: config.google_maps?.embed_url || config.seo?.gmbEmbedMapUrl || '',
    google_maps_coords: config.google_maps?.coordinates || '',
    google_maps_address: config.google_maps?.address || config.location || '',
    splash_screen_enabled: config.splash_screen?.enabled !== false,
    splash_screen_duration: config.splash_screen?.duration || 2.5,
    // Footer Settings
    footer_about: config.footer?.about || 'Didukung oleh arsitektur Cloud Edge berkecepatan tinggi dengan enkripsi enterprise.',
    footer_button_text: config.footer?.button_text || 'Baca Artikel & Panduan Wisata',
    footer_button_url: config.footer?.button_url || '/artikel',
    footer_show_button: config.footer?.show_button !== false,
    footer_contact_title: config.footer?.contact_title || 'Informasi Kontak',
    footer_show_phone: config.footer?.show_phone !== false,
    footer_show_email: config.footer?.show_email !== false,
    footer_show_address: config.footer?.show_address !== false,
    footer_legal_title: config.footer?.legal_title || 'Legalitas & Proteksi',
    footer_legal_text: config.footer?.legal_text || 'Hak Cipta dilindungi Undang-Undang. Terdaftar dan terverifikasi di Google Business & Cloudflare Enterprise.',
    footer_status_text: config.footer?.status_text || 'Status Sistem: Operasional Aktif',
    footer_show_status: config.footer?.show_status !== false,
    footer_copyright: config.footer?.copyright || 'All rights reserved. Powered by Enterprise MultiCMS Engine.'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [generatingLogo, setGeneratingLogo] = useState(false);

  // Sync state if external config changes
  useEffect(() => {
    if (config) {
      setFormData(prev => ({
        ...prev,
        brandName: config.brandName || prev.brandName,
        logoUrl: config.logoUrl || prev.logoUrl || '',
        pwa_name: config.pwa_name || config.brandName || prev.pwa_name,
        pwa_short_name: config.pwa_short_name || config.brandName || prev.pwa_short_name,
        pwa_icon: config.pwa_icon || prev.pwa_icon || '/icons/icon-192.svg',
        title: config.seo?.title || config.title || prev.title,
        tagline: config.tagline || prev.tagline,
        metaDescription: config.seo?.metaDescription || config.metaDescription || prev.metaDescription,
        phone: config.phone || prev.phone,
        whatsapp: config.whatsapp || prev.whatsapp,
        email: config.email || prev.email,
        location: config.location || prev.location,
        google_maps_embed_url: config.google_maps?.embed_url || config.seo?.gmbEmbedMapUrl || prev.google_maps_embed_url,
        google_maps_coords: config.google_maps?.coordinates || prev.google_maps_coords,
        google_maps_address: config.google_maps?.address || config.location || prev.google_maps_address,
        splash_screen_enabled: config.splash_screen?.enabled !== false,
        splash_screen_duration: config.splash_screen?.duration || prev.splash_screen_duration || 2.5,
        footer_about: config.footer?.about || prev.footer_about,
        footer_button_text: config.footer?.button_text || prev.footer_button_text,
        footer_button_url: config.footer?.button_url || prev.footer_button_url,
        footer_show_button: config.footer?.show_button !== undefined ? config.footer?.show_button : prev.footer_show_button,
        footer_contact_title: config.footer?.contact_title || prev.footer_contact_title,
        footer_show_phone: config.footer?.show_phone !== undefined ? config.footer?.show_phone : prev.footer_show_phone,
        footer_show_email: config.footer?.show_email !== undefined ? config.footer?.show_email : prev.footer_show_email,
        footer_show_address: config.footer?.show_address !== undefined ? config.footer?.show_address : prev.footer_show_address,
        footer_legal_title: config.footer?.legal_title || prev.footer_legal_title,
        footer_legal_text: config.footer?.legal_text || prev.footer_legal_text,
        footer_status_text: config.footer?.status_text || prev.footer_status_text,
        footer_show_status: config.footer?.show_status !== undefined ? config.footer?.show_status : prev.footer_show_status,
        footer_copyright: config.footer?.copyright || prev.footer_copyright
      }));
    }
  }, [config]);

  const handleAutoGenerateLogo = async () => {
    try {
      setGeneratingLogo(true);
      const res = await fetch('/api/admin/brand/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken ? `Bearer ${adminToken}` : ''
        },
        body: JSON.stringify({
          appName: formData.brandName,
          industry: config?.industry || 'automotive'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFormData(prev => ({
          ...prev,
          logoUrl: data.data.logoUrl,
          pwa_icon: data.data.pwaIcon
        }));
        showToast?.('Logo & favicon simpel transparan berhasil digenerate!', 'success');
        if (onConfigUpdated && data.data.settings) {
          onConfigUpdated(data.data.settings);
        }
      } else {
        showToast?.(data.error || 'Gagal generate logo otomatis', 'error');
      }
    } catch (err) {
      showToast?.('Koneksi gagal saat generate logo', 'error');
    } finally {
      setGeneratingLogo(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPresetIcon = (url) => {
    setFormData(prev => ({ ...prev, pwa_icon: url }));
  };

  const PWA_ICON_PRESETS = [
    {
      id: 'default',
      name: 'Royal VIP Crown (Baru)',
      url: '/icons/icon-192.png'
    },
    {
      id: 'automotive',
      name: 'Rental Mobil Badge',
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=192&h=192&q=80'
    },
    {
      id: 'luxury',
      name: 'Luxury Gold Fleet',
      url: '/icons/pwa-icon.jpg'
    },
    {
      id: 'travel',
      name: 'Travel & Tour Bag',
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=192&h=192&q=80'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const cleanWhatsapp = formData.whatsapp.trim().replace(/[^0-9]/g, '');
    const cleanBrandName = formData.brandName.trim();
    const cleanTitle = formData.title.trim();
    const cleanTagline = formData.tagline.trim();
    const cleanMetaDesc = formData.metaDescription.trim();
    const cleanLogoUrl = formData.logoUrl.trim();
    const cleanPwaName = formData.pwa_name.trim() || cleanBrandName;
    const cleanPwaShortName = formData.pwa_short_name.trim() || cleanBrandName.slice(0, 12);
    const cleanPwaIcon = formData.pwa_icon.trim() || '/icons/icon-192.svg';

    const payload = {
      brandName: cleanBrandName,
      logoUrl: cleanLogoUrl,
      pwa_name: cleanPwaName,
      pwa_short_name: cleanPwaShortName,
      pwa_icon: cleanPwaIcon,
      title: cleanTitle,
      tagline: cleanTagline,
      metaDescription: cleanMetaDesc,
      phone: formData.phone.trim(),
      whatsapp: cleanWhatsapp,
      email: formData.email.trim(),
      location: formData.location.trim(),
      google_maps: {
        embed_url: formData.google_maps_embed_url.trim(),
        coordinates: formData.google_maps_coords.trim(),
        address: formData.google_maps_address.trim()
      },
      splash_screen: {
        enabled: Boolean(formData.splash_screen_enabled),
        duration: Math.max(0.5, Math.min(10, Number(formData.splash_screen_duration) || 2.5))
      },
      seo: {
        ...(config.seo || {}),
        title: cleanTitle,
        metaDescription: cleanMetaDesc,
        gmbEmbedMapUrl: formData.google_maps_embed_url.trim()
      },
      floating_whatsapp: {
        ...(config.floating_whatsapp || {}),
        phone: cleanWhatsapp
      },
      whatsapp_settings: {
        ...(config.whatsapp_settings || {}),
        phone: cleanWhatsapp,
        brandName: cleanBrandName
      },
      footer: {
        about: formData.footer_about.trim(),
        button_text: formData.footer_button_text.trim(),
        button_url: formData.footer_button_url.trim(),
        show_button: Boolean(formData.footer_show_button),
        contact_title: formData.footer_contact_title.trim(),
        show_phone: Boolean(formData.footer_show_phone),
        show_email: Boolean(formData.footer_show_email),
        show_address: Boolean(formData.footer_show_address),
        legal_title: formData.footer_legal_title.trim(),
        legal_text: formData.footer_legal_text.trim(),
        status_text: formData.footer_status_text.trim(),
        show_status: Boolean(formData.footer_show_status),
        copyright: formData.footer_copyright.trim()
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
          showToast('Identitas situs, logo, dan ikon PWA berhasil diperbarui!');
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
            <Globe className="w-3.5 h-3.5" /> Identitas & Branding PWA
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pengaturan Nama Aplikasi, Logo & Ikon PWA
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Ubah nama brand, logo situs, ikon aplikasi mobile PWA (Progressive Web App), nama shortcut di HP, judul SEO, dan nomor kontak resmi secara instan.
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
            
            {/* Section 1: Nama Brand & Judul Website */}
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

            {/* Section 2: Logo Website & Ikon PWA (Progressive Web App) */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>2. Logo Website & Ikon PWA (Mobile App)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuaikan logo situs dan ikon aplikasi yang muncul saat pengunjung menginstal web ini ke layar smartphone (PWA).
                </p>
              </div>

              {/* Generator Logo Otomatis (Simpel & Transparan) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-blue-600 text-white shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      Generator Logo & Favicon Otomatis
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                      Simpel & Transparan
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-md">
                    Membuat logo & favicon yang simpel, berkelas, dan 100% transparan secara otomatis berdasarkan nama brand <b>"{formData.brandName}"</b> dan kategori industri.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoGenerateLogo}
                  disabled={generatingLogo}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${generatingLogo ? 'animate-spin' : ''}`} />
                  <span>{generatingLogo ? 'Mengenerate Logo...' : 'Generate Logo Simpel'}</span>
                </button>
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <ImageUploadInput
                  label="Logo Website Utama (Navbar & Footer)"
                  value={formData.logoUrl}
                  onChange={(val) => setFormData(prev => ({ ...prev, logoUrl: val }))}
                  placeholder="/images/logo.png atau https://domain.com/logo.png"
                  helperText="Format PNG transparan atau SVG. Logo dan favicon disarankan sama dan transparan."
                />
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, pwa_icon: prev.logoUrl }));
                      showToast?.('Favicon & Ikon PWA disamakan dengan Logo Utama!', 'success');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Samakan Favicon & Ikon PWA dengan Logo ini</span>
                  </button>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    100% Background Transparan
                  </span>
                </div>
              </div>

              {/* PWA App Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Lengkap Aplikasi PWA *
                  </label>
                  <input
                    type="text"
                    name="pwa_name"
                    required
                    value={formData.pwa_name}
                    onChange={handleChange}
                    placeholder="Contoh: Royal Fleet Rental Mobil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Muncul di prompt dialog instalasi browser ("Tambahkan ke Layar Utama").
                  </span>
                </div>

                {/* PWA Short Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Nama Ikon di Layar HP (Short Name) *
                    </label>
                    <span className={`text-[10px] font-mono ${formData.pwa_short_name.length > 12 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                      {formData.pwa_short_name.length} / 12 Karakter
                    </span>
                  </div>
                  <input
                    type="text"
                    name="pwa_short_name"
                    required
                    maxLength={20}
                    value={formData.pwa_short_name}
                    onChange={handleChange}
                    placeholder="Contoh: RoyalFleet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Nama singkat di bawah ikon desktop/homescreen HP (disarankan maks. 12 huruf agar tidak terpotong).
                  </span>
                </div>
              </div>

              {/* PWA Icon URL & Preset Picker */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <ImageUploadInput
                  label="Ikon Aplikasi PWA (192x192 / 512x512)"
                  value={formData.pwa_icon}
                  onChange={(val) => setFormData(prev => ({ ...prev, pwa_icon: val }))}
                  placeholder="/icons/icon-192.svg atau https://..."
                  helperText="Upload gambar ikon aplikasi resolusi tinggi atau pilih preset di bawah"
                />

                {/* Preset Options */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    Atau pilih template ikon cepat beresolusi tinggi:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PWA_ICON_PRESETS.map((preset) => {
                      const isSelected = formData.pwa_icon === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPresetIcon(preset.url)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-100"
                            onError={(e) => { e.currentTarget.src = '/icons/icon-192.svg'; }}
                          />
                          <div className="truncate flex-1 min-w-0">
                            <span className="block text-[11px] font-bold text-slate-800 truncate leading-tight">
                              {preset.name}
                            </span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] text-blue-600 font-extrabold">
                                <Check className="w-2.5 h-2.5 stroke-[3]" /> Aktif
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Kontak Utama Bisnis */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>3. Kontak Utama & Lokasi Operasional</span>
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
                    Email Perusahaan *
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

            {/* Section 4: Pengaturan Splash Screen Awal */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>4. Splash Screen Dinamis (Rendering Awal)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Layar pembuka elegan sebelum landing page ditampilkan kepada pengunjung.
                </p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                {/* Toggle On / Off */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                      Aktifkan Fitur Splash Screen
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Tampilkan logo & animasi progress saat pengunjung pertama kali membuka web.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.splash_screen_enabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, splash_screen_enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Durasi Tampil */}
                {formData.splash_screen_enabled && (
                  <div className="pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        Durasi Tampil (Detik):
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Waktu splash screen muncul sebelum membuka landing page (1 – 10 detik). Default: 2.5 detik.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.5"
                        max="10"
                        step="0.5"
                        name="splash_screen_duration"
                        value={formData.splash_screen_duration}
                        onChange={handleChange}
                        className="w-24 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold font-mono text-center text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                      <span className="text-xs font-bold text-slate-500">Detik</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Integrasi Google Maps Dinamis */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>5. Integrasi Google Maps & Lokasi Kantor</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tampilkan peta interaktif Google Maps pada bagian bawah landing page agar kredibilitas bisnis meningkat.
                </p>
              </div>

              <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* Embed URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Google Maps Embed URL (Iframe src)
                  </label>
                  <input
                    type="url"
                    name="google_maps_embed_url"
                    value={formData.google_maps_embed_url}
                    onChange={handleChange}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Dapatkan dari Google Maps: Bagikan (Share) &rarr; Sematkan Peta (Embed a map) &rarr; Salin URL di atribut src.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Coordinates */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Koordinat GPS (Latitude, Longitude)
                    </label>
                    <input
                      type="text"
                      name="google_maps_coords"
                      value={formData.google_maps_coords}
                      onChange={handleChange}
                      placeholder="-6.229728, 106.758849"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Physical Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Alamat Fisik Lengkap
                    </label>
                    <input
                      type="text"
                      name="google_maps_address"
                      value={formData.google_maps_address}
                      onChange={handleChange}
                      placeholder="Jl. Jenderal Sudirman No. Kav 52-53, Jakarta Selatan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Live Preview */}
                {formData.google_maps_embed_url && (
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">Pratinjau Peta:</span>
                    <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-200">
                      <iframe
                        src={formData.google_maps_embed_url}
                        title="Google Maps Preview"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 6: Kustomisasi & Pengaturan Footer Website */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>6. Kustomisasi & Pengaturan Footer Website</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola seluruh konten, link tombol CTA, kontak, legalitas, dan teks hak cipta pada footer landing page.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Footer Settings
                </span>
              </div>

              <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* 1. Footer About / Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Deskripsi / Bio Singkat Footer (Kolom Brand)
                  </label>
                  <textarea
                    name="footer_about"
                    rows={3}
                    value={formData.footer_about}
                    onChange={handleChange}
                    placeholder="Didukung oleh arsitektur Cloud Edge berkecepatan tinggi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden leading-relaxed"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Muncul tepat di bawah logo brand pada footer website.
                  </span>
                </div>

                {/* 2. Tombol Aksi / CTA Footer */}
                <div className="pt-3 border-t border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block">Tombol Aksi / CTA Footer</span>
                      <span className="text-[11px] text-slate-500">Tombol pintas di bawah deskripsi brand footer.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.footer_show_button}
                        onChange={(e) => setFormData(prev => ({ ...prev, footer_show_button: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {formData.footer_show_button && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Label / Teks Tombol</label>
                        <input
                          type="text"
                          name="footer_button_text"
                          value={formData.footer_button_text}
                          onChange={handleChange}
                          placeholder="Baca Artikel & Panduan Wisata"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">URL / Link Tujuan</label>
                        <input
                          type="text"
                          name="footer_button_url"
                          value={formData.footer_button_url}
                          onChange={handleChange}
                          placeholder="/artikel atau #fleet"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Pengaturan Kolom Informasi Kontak */}
                <div className="pt-3 border-t border-slate-200/80 space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Judul Kolom Kontak Footer
                    </label>
                    <input
                      type="text"
                      name="footer_contact_title"
                      value={formData.footer_contact_title}
                      onChange={handleChange}
                      placeholder="Informasi Kontak"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 block">Pilih data kontak yang ditampilkan:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.footer_show_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, footer_show_phone: e.target.checked }))}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Nomor Telepon</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.footer_show_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, footer_show_email: e.target.checked }))}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Email Resmi</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.footer_show_address}
                          onChange={(e) => setFormData(prev => ({ ...prev, footer_show_address: e.target.checked }))}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Alamat Fisik</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. Kolom Legalitas & Status Sistem */}
                <div className="pt-3 border-t border-slate-200/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Judul Kolom Legalitas
                      </label>
                      <input
                        type="text"
                        name="footer_legal_title"
                        value={formData.footer_legal_title}
                        onChange={handleChange}
                        placeholder="Legalitas & Proteksi"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Teks Badge Status
                      </label>
                      <input
                        type="text"
                        name="footer_status_text"
                        value={formData.footer_status_text}
                        onChange={handleChange}
                        placeholder="Status Sistem: Operasional Aktif"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Keterangan Legalitas & Proteksi Hak Cipta
                    </label>
                    <textarea
                      name="footer_legal_text"
                      rows={2}
                      value={formData.footer_legal_text}
                      onChange={handleChange}
                      placeholder="Hak Cipta dilindungi Undang-Undang..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700">Tampilkan Badge Status Operasional</span>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.footer_show_status}
                        onChange={(e) => setFormData(prev => ({ ...prev, footer_show_status: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

                {/* 5. Teks Copyright Bar Paling Bawah */}
                <div className="pt-3 border-t border-slate-200/80">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Teks Hak Cipta (Copyright Bar Bawah)
                  </label>
                  <input
                    type="text"
                    name="footer_copyright"
                    value={formData.footer_copyright}
                    onChange={handleChange}
                    placeholder="All rights reserved. Powered by Enterprise MultiCMS Engine."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Secara otomatis menyertakan tanda ©, tahun sekarang, dan nama brand Anda di landing page.
                  </span>
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

          {/* Preview 1: PWA Mobile Homescreen Mockup */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Pratinjau PWA Layar HP</h3>
              </div>
              <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                Home Screen
              </span>
            </div>

            {/* Mobile Screen Shell */}
            <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden">
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-6">
                <span>09:41</span>
                <div className="w-16 h-3 bg-black/60 rounded-full mx-auto" />
                <span>5G 100%</span>
              </div>

              {/* Simulated App Grid */}
              <div className="grid grid-cols-4 gap-3 text-center my-4">
                {/* Simulated Dummy Apps */}
                <div className="flex flex-col items-center gap-1.5 opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium truncate w-full">WhatsApp</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium truncate w-full">Maps</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium truncate w-full">Kontak</span>
                </div>

                {/* THE ACTIVE PWA APP ICON (HIGHLIGHTED) */}
                <div className="flex flex-col items-center gap-1.5 relative group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md p-1 shadow-lg shadow-blue-500/20 ring-2 ring-blue-400 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
                    <img
                      src={formData.pwa_icon}
                      alt="PWA Icon Preview"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      onError={(e) => { e.currentTarget.src = '/icons/icon-192.svg'; }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white tracking-tight truncate w-14">
                    {formData.pwa_short_name || formData.brandName}
                  </span>
                </div>
              </div>

              {/* Install Prompt Banner Mockup */}
              <div className="mt-5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={formData.pwa_icon}
                    alt="Prompt Icon"
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => { e.currentTarget.src = '/icons/icon-192.svg'; }}
                  />
                </div>
                <div className="truncate flex-1">
                  <span className="text-[11px] font-bold text-white block truncate leading-tight">
                    {formData.pwa_name || formData.brandName}
                  </span>
                  <span className="text-[9px] text-blue-200 block truncate">
                    Tersedia mode offline & navigasi secepat aplikasi native
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview 2: Google Search Result (SERP Snippet) */}
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
                <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-[9px] text-slate-700 font-bold overflow-hidden p-0.5">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Favicon" className="w-full h-full object-contain" />
                  ) : (
                    formData.brandName.charAt(0) || 'M'
                  )}
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

          {/* Preview 3: Live Header Navbar Mockup */}
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
                {formData.logoUrl ? (
                  <div className="h-9 w-auto max-w-[100px] flex items-center justify-center shrink-0">
                    <img src={formData.logoUrl} alt="Logo Brand" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
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

          {/* Preview 4: Live Footer Mockup */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Pratinjau Footer Website</h3>
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                Live Footer
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-300 space-y-3.5 shadow-inner text-left font-sans">
              {/* Brand & Bio */}
              <div className="space-y-1.5 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {formData.logoUrl ? (
                    <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                      <img src={formData.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain filter drop-shadow-sm" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="font-bold text-xs text-white tracking-tight">{formData.brandName}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {formData.footer_about || formData.tagline}
                </p>
                {formData.footer_show_button && formData.footer_button_text && (
                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-white text-[9px] font-bold border border-slate-700">
                      <span>{formData.footer_button_text}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                )}
              </div>

              {/* Contact & Legal Grid */}
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="space-y-1.5">
                  <span className="font-bold text-white uppercase tracking-wider block text-[9px]">
                    {formData.footer_contact_title}
                  </span>
                  <div className="space-y-1 text-slate-400">
                    {formData.footer_show_phone && formData.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                        <span className="truncate">{formData.phone}</span>
                      </div>
                    )}
                    {formData.footer_show_email && formData.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                        <span className="truncate">{formData.email}</span>
                      </div>
                    )}
                    {formData.footer_show_address && formData.location && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                        <span className="truncate">{formData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-white uppercase tracking-wider block text-[9px]">
                    {formData.footer_legal_title}
                  </span>
                  <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight">
                    {formData.footer_legal_text}
                  </p>
                  {formData.footer_show_status && (
                    <div className="pt-0.5">
                      <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="truncate">{formData.footer_status_text}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="pt-2 border-t border-slate-800 text-center text-[9px] text-slate-500 truncate">
                © {new Date().getFullYear()} {formData.brandName}. {formData.footer_copyright}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteIdentityManager;
