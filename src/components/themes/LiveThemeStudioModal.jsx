import React, { useState } from 'react';
import {
  X, Smartphone, Tablet, Monitor, Check, ExternalLink,
  Sparkles, RefreshCw, Eye
} from 'lucide-react';
import ThemeRegistry from './ThemeRegistry';

/**
 * Live Split / Modal Preview Studio
 * Allows admins to test any theme in real-time across simulated Mobile (375px),
 * Tablet (768px), and Desktop (100%) screen resolutions before activating.
 */
export const LiveThemeStudioModal = ({
  isOpen,
  onClose,
  theme,
  industry,
  config,
  onActivate,
  isActiveTheme
}) => {
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'
  const [isActivating, setIsActivating] = useState(false);

  if (!isOpen || !theme) return null;

  const handleActivateClick = async () => {
    setIsActivating(true);
    await onActivate(industry.id, theme.id);
    setIsActivating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-slate-100 rounded-3xl border border-slate-300 shadow-2xl flex flex-col w-full h-[95vh] max-w-6xl overflow-hidden min-w-0 animate-scale-up">
        {/* Studio Top Control Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Theme Meta Info */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{industry.icon}</span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                  {theme.name}
                </h3>
                {isActiveTheme && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                    Sedang Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono truncate">
                {industry.name} • {theme.id}
              </p>
            </div>
          </div>

          {/* Device Resolution Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Simulasi Mobile Phone (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ponsel (375px)</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Simulasi Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet (768px)</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Simulasi Desktop (Full Width)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>

          {/* Actions: Activate & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {!isActiveTheme && (
              <button
                type="button"
                onClick={handleActivateClick}
                disabled={isActivating}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                {isActivating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Aktifkan Tema Ini</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-colors"
              aria-label="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Viewport Simulation Workspace */}
        <div className="flex-1 bg-slate-200/80 p-2 sm:p-6 overflow-y-auto flex items-center justify-center min-w-0">
          <div
            className={`transition-all duration-300 ease-in-out bg-white rounded-2xl shadow-xl border border-slate-300 flex flex-col overflow-hidden ${
              deviceMode === 'mobile'
                ? 'w-[375px] h-[720px] max-h-[85vh] rounded-[36px] border-4 border-slate-800'
                : deviceMode === 'tablet'
                ? 'w-[768px] h-[750px] max-h-[85vh] rounded-3xl border-4 border-slate-700'
                : 'w-full h-full max-h-[88vh] rounded-xl'
            }`}
          >
            {/* Simulated Phone / Tablet Notch & Header */}
            {deviceMode === 'mobile' && (
              <div className="bg-slate-900 text-white px-5 py-1.5 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none">
                <span>9:41</span>
                <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto" />
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-4 h-2 bg-emerald-400 rounded-xs" />
                </div>
              </div>
            )}

            {/* Embedded Live Theme Viewport */}
            <div className="flex-1 overflow-y-auto relative w-full h-full min-w-0 scroll-smooth">
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
              <div className="bg-slate-900 py-1.5 flex justify-center shrink-0">
                <div className="w-28 h-1 bg-slate-600 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveThemeStudioModal;
