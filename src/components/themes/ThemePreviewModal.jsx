import React, { useState } from 'react';
import {
  X, Smartphone, Tablet, Monitor, Check, ExternalLink,
  Sparkles, RefreshCw, Eye, Zap, ShieldCheck
} from 'lucide-react';
import ThemeRegistry from './ThemeRegistry';

/**
 * Interactive Fullscreen Live Preview Modal (WordPress / Shopify Theme Store pattern)
 * Provides seamless device switcher (Desktop 100%, Tablet 768px, Mobile 375px)
 * and direct 1-click theme activation without leaving the modal.
 */
export const ThemePreviewModal = ({
  isOpen,
  onClose,
  theme,
  industry,
  config,
  onActivate,
  isActiveTheme
}) => {
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isActivating, setIsActivating] = useState(false);

  if (!isOpen || !theme || !industry) return null;

  const handleActivateClick = async () => {
    setIsActivating(true);
    try {
      await onActivate(industry.id, theme.id);
    } finally {
      setIsActivating(false);
    }
  };

  // Industry tags helper
  const getFeatureTags = () => {
    switch (industry.id) {
      case 'ecommerce':
        return ['Direct Checkout', 'Flash Sale Timer', 'Mobile-First'];
      case 'fnb':
        return ['Digital Menu', 'Fast Booking', 'Visual Rich'];
      case 'services':
        return ['Lead Gen Engine', 'Trust Badges', 'SEO Boost'];
      case 'realestate':
        return ['Gallery Showcase', 'Property Specs', 'Lead Capture'];
      case 'automotive':
      default:
        return ['Fast Loading', 'SEO Boost', 'Booking Engine'];
    }
  };

  const featureTags = getFeatureTags();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 overflow-hidden w-full max-w-full min-w-0">
      {/* Top Interactive Header Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm z-20 w-full max-w-full min-w-0">
        {/* Left: Theme Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
            {industry.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                {theme.name}
              </h3>
              {isActiveTheme ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-300 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Tema Aktif
                </span>
              ) : (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                  Pratinjau
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate mt-0.5">
              <span>{industry.name}</span>
              <span>•</span>
              <span className="font-mono text-slate-400 truncate">{theme.id}</span>
              <div className="hidden md:flex items-center gap-1.5 ml-2">
                {featureTags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              deviceMode === 'desktop'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Desktop (100% Full Width)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              deviceMode === 'tablet'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tablet (768px Viewport)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet (768px)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              deviceMode === 'mobile'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mobile (375px Viewport)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ponsel (375px)</span>
          </button>
        </div>

        {/* Right: Actions (Activate & Close) */}
        <div className="flex items-center gap-2 shrink-0">
          {isActiveTheme ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Sedang Aktif di Toko</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleActivateClick}
              disabled={isActivating}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {isActivating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Aktifkan Tema Ini Sekarang</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors"
            title="Tutup Pratinjau (Esc)"
            aria-label="Tutup Pratinjau"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <div className="flex-1 bg-slate-900/60 p-2 sm:p-4 overflow-y-auto flex items-center justify-center min-w-0 w-full max-w-full">
        <div
          className={`transition-all duration-300 ease-in-out bg-white shadow-2xl flex flex-col overflow-hidden min-w-0 max-w-full ${
            deviceMode === 'mobile'
              ? 'w-[375px] h-[740px] max-h-[85vh] rounded-[40px] border-8 border-slate-800 ring-1 ring-slate-700'
              : deviceMode === 'tablet'
              ? 'w-[768px] h-[780px] max-h-[85vh] rounded-3xl border-8 border-slate-700 ring-1 ring-slate-600'
              : 'w-full h-full max-h-[88vh] rounded-2xl border border-slate-200'
          }`}
        >
          {/* Simulated Mobile Status Notch */}
          {deviceMode === 'mobile' && (
            <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none">
              <span>9:41</span>
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">5G</span>
                <div className="w-4 h-2 bg-emerald-400 rounded-xs" />
              </div>
            </div>
          )}

          {/* Embedded Interactive Theme */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative w-full h-full min-w-0 scroll-smooth bg-slate-50">
            <ThemeRegistry
              industry={industry.id}
              themeId={theme.id}
              config={{
                ...config,
                industry: industry.id,
                themeId: theme.id
              }}
            />
          </div>

          {/* Simulated Mobile Home Bar */}
          {deviceMode === 'mobile' && (
            <div className="bg-slate-900 py-2 flex justify-center shrink-0">
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewModal;
