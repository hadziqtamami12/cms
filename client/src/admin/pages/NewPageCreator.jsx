import React, { useState } from 'react';
import {
  ArrowLeft, Sparkles, Layout, CheckCircle, AlertCircle,
  FileText, Globe, Layers, ArrowRight
} from 'lucide-react';
import { saveAdminPage } from '../../utils/api';
import { PRESET_THEMES } from '../../presets';

export default function NewPageCreator({ onBack, onCreated }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('business-modern');
  const [status, setStatus] = useState('published');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (val) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };

  const handleCreate = async (openBuilderDirectly = true) => {
    if (!title.trim()) {
      setError('Mohon masukkan judul halaman terlebih dahulu.');
      return;
    }

    setCreating(true);
    setError('');

    const preset = PRESET_THEMES.find((p) => p.id === selectedTemplate) || PRESET_THEMES[0];
    const initialBlocks = preset?.samplePayload?.blocks || [
      {
        id: `hero_${Date.now()}`,
        type: 'hero',
        props: {
          badge: 'Halaman Baru',
          title,
          subtitle: 'Selamat datang di halaman baru ini.',
          primaryCtaText: 'Hubungi Kami',
          primaryCtaLink: '#contact',
        },
      },
    ];

    const newPageData = {
      title,
      slug: slug || `page-${Date.now()}`,
      status,
      themeId: selectedTemplate,
      colorMode: 'light',
      mobileNavType: 'curved',
      seo: {
        metaTitle: `${title} | Ultra CMS`,
        metaDescription: `Informasi dan layanan resmi halaman ${title}`,
        jsonLdType: preset?.jsonLdType || 'WebPage',
      },
      header: {
        brandName: 'Ultra CMS',
        brandTagline: 'Modern Web Platform',
        phone: '0812-3456-7890',
        whatsappNumber: '6281234567890',
        navLinks: [
          { label: 'Beranda', href: '/' },
          { label: 'Fitur', href: '#features' },
          { label: 'Paket', href: '#pricing' },
          { label: 'Kontak', href: '#contact' },
        ],
      },
      footer: {
        brandName: 'Ultra CMS',
        description: 'Solusi platform manajemen konten web modern berkinerja tinggi.',
        phone: '0812-3456-7890',
        email: 'contact@example.com',
        copyright: '© 2026 Ultra CMS. All rights reserved.',
      },
      floatingWhatsapp: {
        enabled: true,
        phoneNumber: '6281234567890',
        agentName: 'Customer Support 24 Jam',
        agentStatus: 'Online',
        greetingMessage: `Halo! Ada yang bisa kami bantu terkait ${title}?`,
        defaultMessage: `Halo Admin, saya ingin bertanya mengenai layanan ${title}.`,
        ctaText: 'Chat WhatsApp',
      },
      blocks: initialBlocks,
    };

    try {
      const saved = await saveAdminPage(newPageData);
      if (onCreated) {
        onCreated(saved, openBuilderDirectly);
      }
    } catch (err) {
      setError(`Gagal membuat halaman: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dcdcde] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-[3px] bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2c3338] border border-[#dcdcde] font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Semua Halaman</span>
          </button>
          <span className="text-xs font-bold text-slate-300 hidden sm:inline">|</span>
          <span className="text-xs font-bold text-[#1d2327]">Tambah Halaman Baru</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleCreate(false)}
            disabled={creating}
            className="px-3.5 py-1.5 rounded-[3px] bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2271b1] border border-[#2271b1] font-semibold text-xs transition-colors"
          >
            Simpan Draf
          </button>
          <button
            onClick={() => handleCreate(true)}
            disabled={creating}
            className="px-4 py-1.5 rounded-[3px] bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs shadow-[0_1px_0_#135e96] flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{creating ? 'Membuat...' : 'Buat & Buka di Elementor Studio'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Page Identity Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Informasi Halaman Baru</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Judul Halaman <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Paket Sewa Bulanan Perusahaan / Kontak Kami / Promo Liburan"
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              URL Slug / Permalink
            </label>
            <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono focus-within:border-[#2271b1] focus-within:ring-1 focus-within:ring-[#2271b1]">
              <span className="text-slate-400 select-none">https://domain.com/?page=</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nama-slug-halaman"
                className="flex-1 bg-transparent font-medium text-slate-800 focus:outline-none ml-1"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Slug otomatis terisi dari judul dan bisa disesuaikan untuk kebutuhan SEO URL.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status Visibilitas
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2271b1]"
            >
              <option value="published">Diterbitkan Langsung (Published)</option>
              <option value="draft">Simpan Sebagai Draf (Draft)</option>
            </select>
          </div>
        </div>

        {/* Blueprint Template Selection */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-600" />
                <span>Pilih Template Blueprint Awal</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih tata letak awal yang siap disesuaikan melalui Elementor Studio Pro.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {PRESET_THEMES.map((theme) => {
              const selected = selectedTemplate === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTemplate(theme.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{theme.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{theme.description}</div>
                    </div>
                    {selected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono">{theme.samplePayload?.blocks?.length || 4} Blok Desain</span>
                    <span className="font-bold text-slate-700">{theme.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base">Siap mendesain halaman Anda?</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Buka langsung di Elementor Studio untuk drag & drop blok dan kustomisasi visual.
            </p>
          </div>

          <button
            onClick={() => handleCreate(true)}
            disabled={creating}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
          >
            <span>{creating ? 'Menyiapkan...' : 'Buka Visual Builder'}</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
