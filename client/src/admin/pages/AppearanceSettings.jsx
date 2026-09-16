import React, { useState, useEffect } from 'react';
import {
  Palette, Layout, Smartphone, MessageSquare, Save, CheckCircle,
  RefreshCw, Globe, HelpCircle, AlertCircle, Sparkles, Sliders
} from 'lucide-react';
import { getSettings, updateSettings } from '../../utils/api';

export default function AppearanceSettings() {
  const [activeSubTab, setActiveSubTab] = useState('theme');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [appearance, setAppearance] = useState({
    primaryColor: '#18181b',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    header: {
      brandName: 'Ultra CMS',
      tagline: 'Modern Web Platform',
      whatsappNumber: '6281234567890',
      enableSearch: true,
      menuItems: [
        { label: 'Beranda', href: '/' },
        { label: 'Fitur', href: '/#features' },
        { label: 'Paket', href: '/#pricing' },
        { label: 'Artikel', href: '/#articles' },
        { label: 'Kontak', href: '/#contact' },
      ],
    },
    footer: {
      brandName: 'Ultra CMS',
      tagline: 'Platform CMS modern berkinerja tinggi.',
      copyright: '© 2026 Ultra CMS. All rights reserved.',
      whatsappNumber: '6281234567890',
      email: 'contact@example.com',
    },
    floatingWhatsApp: {
      enabled: true,
      phoneNumber: '6281234567890',
      agentName: 'Customer Support',
      agentStatus: 'Online (Respon Cepat)',
      greetingMessage: 'Halo! Ada yang bisa kami bantu seputar layanan kami?',
      defaultMessage: 'Halo Admin, saya ingin bertanya tentang layanan Anda.',
    },
    mobileBottomNav: {
      enabled: true,
      items: [
        { id: 'home', label: 'Beranda', href: '#top' },
        { id: 'features', label: 'Fitur', href: '#features' },
        { id: 'pricing', label: 'Paket', href: '#pricing' },
        { id: 'articles', label: 'Artikel', href: '#articles' },
        { id: 'contact', label: 'Kontak', href: '#contact' },
      ],
    },
  });

  useEffect(() => {
    fetchAppearance();
  }, []);

  const fetchAppearance = async () => {
    try {
      setLoading(true);
      const res = await getSettings();
      if (res && res.appearance_settings) {
        setAppearance((prev) => ({ ...prev, ...res.appearance_settings }));
      }
    } catch (err) {
      console.warn('Using default appearance settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateSettings({ appearance_settings: appearance });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pengaturan tampilan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-[#2271b1] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      {/* WordPress Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-[#2271b1]" />
            <span>Tampilan & Pengaturan Global Situs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola identitas visual, Header, Footer, Floating WhatsApp, dan Mobile Bottom Nav secara terpusat (terpisah dari konten halaman).
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan tampilan global berhasil diperbarui!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2 mb-6">
        {[
          { id: 'theme', label: 'Tema & Warna', icon: Palette },
          { id: 'header', label: 'Header & Menu', icon: Layout },
          { id: 'footer', label: 'Footer & Sosial', icon: Globe },
          { id: 'whatsapp', label: 'Floating WhatsApp', icon: MessageSquare },
          { id: 'bottom-nav', label: 'Bottom Nav Mobile', icon: Smartphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                isActive
                  ? 'border-[#2271b1] text-[#2271b1] bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Theme & Palette */}
      {activeSubTab === 'theme' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#2271b1]" />
            <span>Palet Warna & Tipografi Situs</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Warna Primer (Primary Slate)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={appearance.primaryColor}
                  onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={appearance.primaryColor}
                  onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                  className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono w-32 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Digunakan untuk tombol utama, teks judul, dan aksen dominan.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Warna Aksen (Accent Emerald)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={appearance.accentColor}
                  onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={appearance.accentColor}
                  onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                  className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono w-32 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Digunakan untuk badge keunggulan dan status interaktif.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Warna Background Dasar (Light Mode)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={appearance.backgroundColor}
                  onChange={(e) => setAppearance({ ...appearance, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={appearance.backgroundColor}
                  onChange={(e) => setAppearance({ ...appearance, backgroundColor: e.target.value })}
                  className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono w-32 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Default background bersih (#ffffff atau #f8fafc).</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Font Tipografi
              </label>
              <select
                value={appearance.fontFamily}
                onChange={(e) => setAppearance({ ...appearance, fontFamily: e.target.value })}
                className="bg-white w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:border-slate-400 focus:outline-none"
              >
                <option value="Inter">Inter (Modern Clean)</option>
                <option value="Roboto">Roboto (Google Standard)</option>
                <option value="Outfit">Outfit (Geometric Tech)</option>
                <option value="System">System Native UI</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Header & Topbar */}
      {activeSubTab === 'header' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#2271b1]" />
            <span>Pengaturan Header & Menu Navigasi</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Brand Situs</label>
              <input
                type="text"
                value={appearance.header?.brandName || ''}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    header: { ...appearance.header, brandName: e.target.value },
                  })
                }
                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp CS</label>
              <input
                type="text"
                value={appearance.header?.whatsappNumber || ''}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    header: { ...appearance.header, whatsappNumber: e.target.value },
                  })
                }
                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Footer */}
      {activeSubTab === 'footer' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-700" />
            <span>Pengaturan Footer & Hak Cipta</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teks Hak Cipta (Copyright)</label>
              <input
                type="text"
                value={appearance.footer?.copyright || ''}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    footer: { ...appearance.footer, copyright: e.target.value },
                  })
                }
                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Kontak</label>
              <input
                type="email"
                value={appearance.footer?.email || ''}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    footer: { ...appearance.footer, email: e.target.value },
                  })
                }
                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Floating WhatsApp */}
      {activeSubTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Tombol Floating WhatsApp (Hanya di Halaman Publik)</span>
            </h2>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearance.floatingWhatsApp?.enabled !== false}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    floatingWhatsApp: { ...appearance.floatingWhatsApp, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {appearance.floatingWhatsApp?.enabled !== false ? 'Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Penerima</label>
              <input
                type="text"
                value={appearance.floatingWhatsApp?.phoneNumber || ''}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    floatingWhatsApp: { ...appearance.floatingWhatsApp, phoneNumber: e.target.value },
                  })
                }
                placeholder="6281234567890"
                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Customer Care</label>
              <input
                type="text"
                value={appearance.floatingWhatsApp?.agentName || ''}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    floatingWhatsApp: { ...appearance.floatingWhatsApp, agentName: e.target.value },
                  })
                }
                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Pesan Pembuka (Greeting)</label>
              <textarea
                rows={2}
                value={appearance.floatingWhatsApp?.greetingMessage || ''}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    floatingWhatsApp: { ...appearance.floatingWhatsApp, greetingMessage: e.target.value },
                  })
                }
                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Mobile Bottom Nav */}
      {activeSubTab === 'bottom-nav' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-700" />
              <span>Menu Navigasi Melengkung Mobile (Bottom Nav)</span>
            </h2>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearance.mobileBottomNav?.enabled !== false}
                onChange={(e) =>
                  setAppearance({
                    ...appearance,
                    mobileBottomNav: { ...appearance.mobileBottomNav, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {appearance.mobileBottomNav?.enabled !== false ? 'Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Menu navigasi melengkung di layar ponsel dengan touch target &gt;= 48px dan indikator aktif dinamis.
          </p>

          <div className="space-y-3">
            {appearance.mobileBottomNav?.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 text-center text-xs font-bold text-slate-400">#{idx + 1}</span>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const newItems = [...appearance.mobileBottomNav.items];
                    newItems[idx].label = e.target.value;
                    setAppearance({
                      ...appearance,
                      mobileBottomNav: { ...appearance.mobileBottomNav, items: newItems },
                    });
                  }}
                  className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 w-32 focus:outline-none focus:border-slate-400"
                  placeholder="Label Menu"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const newItems = [...appearance.mobileBottomNav.items];
                    newItems[idx].href = e.target.value;
                    setAppearance({
                      ...appearance,
                      mobileBottomNav: { ...appearance.mobileBottomNav, items: newItems },
                    });
                  }}
                  className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 flex-grow focus:outline-none focus:border-slate-400"
                  placeholder="Target Link (#section atau URL)"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
