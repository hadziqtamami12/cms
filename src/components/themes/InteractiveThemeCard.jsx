import React from 'react';
import { Eye, Check, Sparkles, Layers, Layout, Smartphone } from 'lucide-react';

/**
 * Interactive Visual Theme Card
 * Renders stylized mini visual mockups representing layout structure,
 * with instant-preview and optimistic activation triggers.
 */
export const InteractiveThemeCard = ({
  theme,
  industry,
  isActive,
  onPreview,
  onActivate,
  isLoading
}) => {
  // Generate a distinct visual preview wireframe based on theme id & industry
  const getThemeColorClass = () => {
    switch (industry.id) {
      case 'ecommerce':
        return 'from-rose-500/10 to-orange-500/10 border-rose-200 text-rose-600';
      case 'fnb':
        return 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-700';
      case 'services':
        return 'from-indigo-500/10 to-blue-500/10 border-indigo-200 text-indigo-600';
      case 'realestate':
        return 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700';
      case 'automotive':
      default:
        return 'from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-600';
    }
  };

  const colorClass = getThemeColorClass();

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden bg-white ${
        isActive
          ? 'border-blue-600 ring-2 ring-blue-600 shadow-md bg-blue-50/30'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-card'
      }`}
    >
      {/* Top Visual Mockup Preview */}
      <div
        onClick={() => onPreview(theme, industry)}
        className={`h-28 w-full bg-gradient-to-br ${colorClass} p-3 flex flex-col justify-between cursor-pointer relative overflow-hidden select-none border-b border-slate-100`}
        title="Klik untuk membuka Live Modal Preview"
      >
        {/* Mockup Mini Browser Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>
          {isActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" /> Aktif
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-500 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-2xs">
              Preview
            </span>
          )}
        </div>

        {/* Mockup Visual Elements (Simulated Layout Hero & Grid) */}
        <div className="space-y-1.5 z-10">
          <div className="w-2/3 h-2 rounded-full bg-slate-800/20" />
          <div className="w-1/2 h-1.5 rounded-full bg-slate-400/30" />
          <div className="grid grid-cols-3 gap-1 pt-1">
            <div className="h-6 rounded-md bg-white/70 border border-slate-200/60 shadow-2xs flex items-center justify-center text-[10px]">
              {industry.icon}
            </div>
            <div className="h-6 rounded-md bg-white/70 border border-slate-200/60 shadow-2xs" />
            <div className="h-6 rounded-md bg-white/70 border border-slate-200/60 shadow-2xs" />
          </div>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1 rounded-xl bg-white text-blue-700 text-xs font-bold shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </span>
        </div>
      </div>

      {/* Card Body Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
        <div className="min-w-0">
          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug truncate" title={theme.name}>
            {theme.name}
          </h4>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5 truncate" title={theme.id}>
            {theme.id}
          </span>
        </div>

        {/* Action Buttons: Preview & Activate */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPreview(theme, industry)}
            className="flex-1 py-1.5 px-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            title="Buka simulasi di HP, Tablet, & Desktop"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Lihat</span>
          </button>

          {isActive ? (
            <div className="py-1.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Aktif</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onActivate(industry.id, theme.id)}
              disabled={isLoading}
              className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
              title="Aktifkan tema ini secara instan"
            >
              <Sparkles className="w-3 h-3" />
              <span>Gunakan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveThemeCard;
