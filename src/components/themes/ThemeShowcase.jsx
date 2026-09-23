import React, { useState } from 'react';
import {
  Palette, Eye, Check, Sparkles, Layers, Search,
  Zap, Shield, Smartphone, ArrowRight, ExternalLink, RefreshCw, Star
} from 'lucide-react';
import ThemePreviewModal from './ThemePreviewModal';

/**
 * Interactive Theme Showcase Studio (Ala WordPress Theme Directory / Shopify Theme Store)
 * Renders a 3-column responsive grid with visual mockup previews, feature tags,
 * 1-click optimistic activation, and fullscreen device preview switcher modal.
 */
export const ThemeShowcase = ({
  industries = [],
  currentIndustry,
  currentThemeId,
  onSwitchTheme,
  config,
  loading = false,
  showToast
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTheme, setPreviewTheme] = useState(null);
  const [previewIndustry, setPreviewIndustry] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activatingThemeId, setActivatingThemeId] = useState(null);

  // Flatten all themes for unified filtering and search
  const allThemesWithIndustry = industries.flatMap((ind) =>
    ind.themes.map((th) => ({
      ...th,
      industryId: ind.id,
      industryName: ind.name,
      industryIcon: ind.icon,
      industryRef: ind
    }))
  );

  // Industry-specific feature tag generators
  const getThemeTags = (industryId, themeId) => {
    switch (industryId) {
      case 'ecommerce':
        return ['Fast Checkout', 'Conversion Boost', 'Mobile Ready'];
      case 'fnb':
        return ['Digital Menu', 'Online Booking', 'Visual Rich'];
      case 'services':
        return ['Lead Gen Engine', 'Trust Badges', 'SEO Boost'];
      case 'realestate':
        return ['Virtual Showcase', 'Spec Highlights', 'Fast Lead'];
      case 'automotive':
      default:
        return ['Fast Loading', 'SEO Boost', 'Booking Engine'];
    }
  };

  // Color gradient generator for high-fidelity visual mockups
  const getMockupGradient = (industryId) => {
    switch (industryId) {
      case 'ecommerce':
        return {
          bg: 'from-rose-500/10 via-pink-500/5 to-orange-500/10',
          accent: 'bg-rose-500',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          hero: 'from-rose-600 to-orange-500'
        };
      case 'fnb':
        return {
          bg: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10',
          accent: 'bg-amber-500',
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          hero: 'from-amber-600 to-orange-600'
        };
      case 'services':
        return {
          bg: 'from-indigo-500/10 via-blue-500/5 to-cyan-500/10',
          accent: 'bg-indigo-600',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          hero: 'from-indigo-600 to-blue-600'
        };
      case 'realestate':
        return {
          bg: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
          accent: 'bg-emerald-600',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          hero: 'from-emerald-700 to-teal-600'
        };
      case 'automotive':
      default:
        return {
          bg: 'from-blue-500/10 via-sky-500/5 to-cyan-500/10',
          accent: 'bg-blue-600',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          hero: 'from-blue-600 to-cyan-600'
        };
    }
  };

  // Filtered themes list
  const filteredThemes = allThemesWithIndustry.filter((item) => {
    const matchesIndustry = selectedIndustry === 'all' || item.industryId === selectedIndustry;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.industryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const handleOpenPreview = (theme, industry) => {
    setPreviewTheme(theme);
    setPreviewIndustry(industry);
    setIsPreviewOpen(true);
  };

  const handleActivate = async (industryId, themeId) => {
    setActivatingThemeId(themeId);
    try {
      await onSwitchTheme(industryId, themeId);
      if (showToast) {
        showToast(`Tema [${themeId}] berhasil diaktifkan seketika!`);
      }
    } finally {
      setActivatingThemeId(null);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Directory Header & Stats */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs w-full max-w-full min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Palette className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Direktori Tema Modern
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                {allThemesWithIndustry.length} Tema
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Katalog tema landing page performa tinggi dengan aktivasi 1 klik, optimasi SEO instan, dan pratinjau responsif.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tema, fitur, industri..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Responsive Industry Filter Pills */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedIndustry('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedIndustry === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Kategori ({allThemesWithIndustry.length})</span>
          </button>
          {industries.map((ind) => (
            <button
              key={ind.id}
              type="button"
              onClick={() => setSelectedIndustry(ind.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedIndustry === ind.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{ind.icon}</span>
              <span>{ind.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedIndustry === ind.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {ind.themes.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* WordPress-style 3-Column Responsive Theme Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-full min-w-0">
        {filteredThemes.map((th) => {
          const isActive = currentIndustry === th.industryId && currentThemeId === th.id;
          const isActivatingThis = activatingThemeId === th.id;
          const style = getMockupGradient(th.industryId);
          const tags = getThemeTags(th.industryId, th.id);

          return (
            <div
              key={`${th.industryId}-${th.id}`}
              className={`group bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg bg-emerald-50/10'
                  : 'border-slate-200 hover:border-blue-400 hover:shadow-xl'
              }`}
            >
              {/* Active Theme Glowing Accent Ribbon */}
              {isActive && (
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 z-10" />
              )}

              {/* Visual Mockup Showcase Header (High Fidelity Simulated Screenshot) */}
              <div
                onClick={() => handleOpenPreview(th, th.industryRef)}
                className={`h-48 w-full bg-gradient-to-br ${style.bg} p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden select-none border-b border-slate-100 transition-transform group-hover:scale-[1.01]`}
                title="Klik untuk membuka Pratinjau Langsung"
              >
                {/* Simulated Mini Browser Chrome */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-slate-500 font-mono ml-1 font-semibold truncate max-w-[120px]">
                      {th.id}.cms
                    </span>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" /> Tema Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 text-slate-600 text-[10px] font-bold shadow-2xs border border-slate-200/50">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.9 (Pro)
                    </span>
                  )}
                </div>

                {/* Simulated Visual Layout Content */}
                <div className="space-y-2 z-10 my-auto py-2">
                  {/* Hero Banner Wireframe */}
                  <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${style.hero} p-2.5 flex items-center justify-between shadow-xs text-white`}>
                    <div className="space-y-1">
                      <div className="w-24 h-2 rounded-full bg-white/80" />
                      <div className="w-16 h-1.5 rounded-full bg-white/50" />
                    </div>
                    <span className="text-xl opacity-90">{th.industryIcon}</span>
                  </div>

                  {/* 3 Grid Feature Cards */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <div className="h-9 rounded-lg bg-white/90 border border-slate-200/70 p-1.5 shadow-2xs flex flex-col justify-between">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div className="w-full h-1 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-9 rounded-lg bg-white/90 border border-slate-200/70 p-1.5 shadow-2xs flex flex-col justify-between">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div className="w-full h-1 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-9 rounded-lg bg-white/90 border border-slate-200/70 p-1.5 shadow-2xs flex flex-col justify-between">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-full h-1 bg-slate-200 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Hover Live Preview Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <span className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-black shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-4 h-4 text-blue-600" /> Pratinjau Interaktif
                  </span>
                </div>
              </div>

              {/* Theme Information Section */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 min-w-0">
                  {/* Category & ID badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${style.badge}`}>
                      <span>{th.industryIcon}</span>
                      <span>{th.industryName}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono truncate">
                      #{th.id}
                    </span>
                  </div>

                  {/* Theme Title */}
                  <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug truncate" title={th.name}>
                    {th.name}
                  </h3>

                  {/* Feature Tags (Fast Loading, SEO Boost, Booking Engine, etc.) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(th, th.industryRef)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pratinjau</span>
                  </button>

                  {isActive ? (
                    <div className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs select-none">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Aktif</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleActivate(th.industryId, th.id)}
                      disabled={isActivatingThis || loading}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isActivatingThis ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>Aktifkan</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredThemes.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-base">Tidak ada tema yang cocok</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ditemukan tema dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain atau pilih kategori Semua.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedIndustry('all'); }}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Interactive Fullscreen Live Preview Modal */}
      <ThemePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        theme={previewTheme}
        industry={previewIndustry}
        config={config}
        onActivate={async (indId, thId) => {
          await handleActivate(indId, thId);
        }}
        isActiveTheme={
          previewTheme &&
          previewIndustry &&
          currentIndustry === previewIndustry.id &&
          currentThemeId === previewTheme.id
        }
      />
    </div>
  );
};

export default ThemeShowcase;
