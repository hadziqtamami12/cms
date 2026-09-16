import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, Zap, CheckCircle, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { fetchAdminPages, deleteAdminPage, saveAdminPage } from '../../utils/api';
import { PRESET_THEMES } from '../../presets';

export default function Dashboard({ onEditPage, onNewPage, onNavigate }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [installingPreset, setInstallingPreset] = useState(false);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminPages();
      setPages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus halaman "${title}"?`)) return;
    try {
      await deleteAdminPage(id);
      loadPages();
    } catch (err) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const handleApplyPreset = async (preset) => {
    setInstallingPreset(true);
    try {
      const payload = {
        ...preset.samplePayload,
        title: `${preset.name} (Preset)`,
        slug: `${preset.id}-${Date.now().toString().slice(-4)}`,
        status: 'published',
      };
      const saved = await saveAdminPage(payload);
      await loadPages();
      onEditPage(saved);
    } catch (err) {
      alert(`Gagal menerapkan preset: ${err.message}`);
    } finally {
      setInstallingPreset(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard WordPress Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Format data murni JSON Block Tree decoupled berkecepatan tinggi dengan skor Lighthouse 100
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onNavigate && onNavigate('pages')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <span>Semua Halaman</span>
          </button>
          <button
            onClick={onNewPage}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Buat Halaman Baru</span>
          </button>
        </div>
      </div>

      {/* Quick WordPress Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate && onNavigate('pages')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all shadow-sm group"
        >
          <div className="text-[10px] uppercase font-bold text-blue-600 mb-1">Manajemen Halaman</div>
          <div className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">Halaman (Pages)</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Kelola {pages.length} halaman web</div>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('posts')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all shadow-sm group"
        >
          <div className="text-[10px] uppercase font-bold text-blue-600 mb-1">Blog & Berita</div>
          <div className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">Post / Artikel</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tulis & edit artikel blog</div>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('themes')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all shadow-sm group"
        >
          <div className="text-[10px] uppercase font-bold text-blue-600 mb-1">Styling & Warna</div>
          <div className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">Tampilan & Tema</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Default putih/biru & customizer</div>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('builder')}
          className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-left transition-all shadow-md shadow-blue-600/20 group"
        >
          <div className="text-[10px] uppercase font-bold text-blue-200 mb-1">Elementor Pro</div>
          <div className="font-extrabold text-sm text-white">Visual Builder</div>
          <div className="text-[11px] text-blue-100 mt-0.5">Buka studio kanvas interaktif</div>
        </button>
      </div>

      {/* Core Web Vitals Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">LCP (Largest Contentful Paint)</div>
            <div className="text-2xl font-black text-blue-600 mt-1">&lt; 1.2s</div>
            <div className="text-[10px] text-blue-600/80 mt-0.5 font-medium">Preload Eager Slide 1 Active</div>
          </div>
          <Zap className="w-8 h-8 text-blue-600" />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">CLS (Cumulative Layout Shift)</div>
            <div className="text-2xl font-black text-blue-600 mt-1">0.000</div>
            <div className="text-[10px] text-blue-600/80 mt-0.5 font-medium">1:1 Geometry Skeletons</div>
          </div>
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Redis Cache Status</div>
            <div className="text-2xl font-black text-blue-600 mt-1">&lt; 45ms</div>
            <div className="text-[10px] text-blue-600/80 mt-0.5 font-medium">Cache-Aside REST Active</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* 10 Multi-Niche Presets Quick Deploy Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Katalog 10 Preset Niche Siap Pakai
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Klik untuk langsung meng-generate JSON Block Tree lengkap untuk industri pilihan:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESET_THEMES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              disabled={installingPreset}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-400 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 block mb-1">
                  {preset.category}
                </span>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 line-clamp-1">
                  {preset.name}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-3 group-hover:text-blue-600 font-semibold">
                + Deploy Preset
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Daftar Halaman Aktif</h2>
          <span className="text-xs text-slate-500 font-medium">{pages.length} Halaman Terdaftar</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat halaman...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-xs text-slate-500">Belum ada halaman. Buat halaman baru atau pilih preset di atas.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {pages.map((p) => (
              <div key={p.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-900 truncate">{p.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        p.status === 'published'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Nav: {p.mobileNavType || 'curved'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5">
                    <span>Slug: <code className="text-blue-600 font-semibold">/{p.slug === 'home' ? '' : p.slug}</code></span>
                    <span>•</span>
                    <span>{p.blocks?.length || 0} Blok</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/?page=${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Lihat Halaman Publik"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onEditPage(p)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Hapus Halaman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
