import React, { useState } from 'react';
import {
  Monitor, Tablet, Smartphone, RefreshCw, ZoomIn, ZoomOut,
  Maximize2, ExternalLink, RotateCcw, Sparkles
} from 'lucide-react';

/**
 * ThemePreviewCanvas - Framer / Webflow Style Responsive Viewport Wrapper
 * - 100% Free Smooth Scrolling from Hero to Footer (Zero clipping or overflow-hidden lock)
 * - Floating Device Switcher [Desktop: 100% | Tablet: 768px | Mobile PWA: 390px]
 * - Realistic Bezel Mockups with Internal Scrollbar in Tablet & Mobile mode
 * - Dot-Grid Background Canvas with Zoom Controls
 */
export default function ThemePreviewCanvas({
  children,
  defaultDevice = 'desktop',
  onDeviceChange = null,
  title = 'Live Responsive Preview',
  previewUrl = '/',
  customHeight = 'max-h-[86vh]',
}) {
  const [device, setDevice] = useState(defaultDevice);
  const [zoom, setZoom] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDeviceChange = (newDevice) => {
    setDevice(newDevice);
    if (onDeviceChange) onDeviceChange(newDevice);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(125, prev + 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(70, prev - 10));
  const handleZoomReset = () => setZoom(100);
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="w-full flex flex-col items-center relative select-none">
      {/* 1. FLOATING RESPONSIVE TOP BAR (Framer/Webflow Canvas Header) */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2.5 mb-4 shadow-xl flex flex-wrap items-center justify-between gap-3 z-30">
        {/* Left: Indicator & Title */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">{title}</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            {device === 'desktop' ? 'Fluid Desktop (100%)' : device === 'tablet' ? 'iPad Pro (768px)' : 'iPhone 15 Pro (390px)'}
          </span>
        </div>

        {/* Center: Floating Device Frame Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => handleDeviceChange('desktop')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              device === 'desktop'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Tampilan Desktop (100% Full Width)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => handleDeviceChange('tablet')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              device === 'tablet'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Tampilan Tablet (768px Bezel)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => handleDeviceChange('mobile')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              device === 'mobile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Tampilan Mobile PWA (390px Dynamic Island)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Zoom Controls & Open Tab */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Perkecil Kanvas"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="px-1.5 text-[10px] font-mono text-slate-300 font-bold hover:text-white"
              title="Reset ke 100%"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Perbesar Kanvas"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Muat Ulang Pratinjau"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
              title="Buka Website di Tab Baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* 2. MAIN CANVAS VIEWPORT (Dot-Grid Canvas Background, Anti-Macet Scroll Engine) */}
      <div className="w-full min-h-[640px] bg-slate-950 border border-slate-800/80 rounded-3xl p-3 sm:p-6 lg:p-8 flex justify-center items-start relative overflow-x-auto shadow-2xl">
        {/* Subtle Webflow Dot-Grid Matrix */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #475569 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Scalable Container Wrapper */}
        <div
          key={refreshKey}
          className="w-full flex justify-center transition-transform duration-200 ease-out origin-top relative z-10"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* ========================================================================= */}
          {/* VARIANT A: DESKTOP VIEWPORT (100% Fluid Width, Smooth Internal Scroll)   */}
          {/* ========================================================================= */}
          {device === 'desktop' && (
            <div className={`w-full max-w-7xl bg-white rounded-2xl border border-slate-800 shadow-2xl overflow-y-auto ${customHeight} scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-950 text-slate-900 transition-all duration-300`}>
              <div className="w-full min-h-full">
                {children}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VARIANT B: TABLET IPAD VIEWPORT (768px with Bezel & Smooth Scroll)        */}
          {/* ========================================================================= */}
          {device === 'tablet' && (
            <div className={`w-[768px] shrink-0 bg-slate-900 border-[10px] border-slate-850 rounded-[40px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col ${customHeight} transition-all duration-300`}>
              {/* Tablet Top Camera Notch */}
              <div className="w-full flex justify-center py-1 shrink-0">
                <div className="w-3 h-3 rounded-full bg-slate-800 ring-1 ring-slate-700/50" />
              </div>

              {/* Tablet Screen Canvas (Internal Scroll from Hero to Footer) */}
              <div className="flex-1 w-full bg-white rounded-[28px] overflow-y-auto shadow-inner scrollbar-thin scrollbar-thumb-slate-700 text-slate-900">
                <div className="w-full min-h-full">
                  {children}
                </div>
              </div>

              {/* Tablet Bottom Bezel */}
              <div className="w-full h-2 shrink-0" />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VARIANT C: MOBILE PWA VIEWPORT (390px iPhone Bezel with Dynamic Island)   */}
          {/* ========================================================================= */}
          {device === 'mobile' && (
            <div className={`w-[390px] shrink-0 bg-slate-900 border-[10px] border-slate-850 rounded-[52px] p-3 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] flex flex-col ${customHeight} transition-all duration-300 relative`}>
              {/* Dynamic Island Notch */}
              <div className="w-full flex justify-center pt-0.5 pb-2 shrink-0 select-none">
                <div className="w-28 h-6 bg-slate-950 rounded-full flex items-center justify-between px-3 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/80 ring-1 ring-indigo-500/50" />
                </div>
              </div>

              {/* Phone Screen Canvas (Internal Scroll from Hero to Footer) */}
              <div className="flex-1 w-full bg-white rounded-[38px] overflow-y-auto shadow-inner scrollbar-thin scrollbar-thumb-slate-600 text-slate-900">
                <div className="w-full min-h-full">
                  {children}
                </div>
              </div>

              {/* Home Indicator Bottom Bar */}
              <div className="w-full flex justify-center pt-2 pb-0.5 shrink-0">
                <div className="w-32 h-1 rounded-full bg-slate-700" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
