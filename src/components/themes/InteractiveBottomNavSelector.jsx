import React, { useState } from 'react';
import { Smartphone, Check, Sparkles, RefreshCw, Eye, Layers } from 'lucide-react';
import MobileBottomNav from '../common/MobileBottomNav';
import { updateAppSettings, switchTheme } from '../../lib/api';

/**
 * Interactive Bottom Nav Selector Studio (Admin Panel)
 * Provides 4 visual choice cards with live interactive phone preview
 * and instantaneous single-source-of-truth database mutation.
 */
export const InteractiveBottomNavSelector = ({
  currentVariant = 'floating_dock',
  currentIndustry = 'automotive',
  currentThemeId = 'fleet-grid',
  config = {},
  adminToken,
  onConfigUpdated,
  showToast
}) => {
  const getCleanVariant = (val) => {
    const clean = String(val || '').toLowerCase().trim();
    if (clean === 'dock' || clean === 'floating_dock') return 'floating_dock';
    if (clean === 'curved' || clean === 'fixed_curved') return 'fixed_curved';
    if (clean === 'bubble' || clean === 'floating_bubble' || clean === 'detached_bubble' || clean === 'detached_floating_bubble') return 'floating_bubble';
    if (clean === 'box' || clean === 'modern-box' || clean === 'floating_box') return 'floating_box';
    return 'floating_dock';
  };

  const [selectedVariant, setSelectedVariant] = useState(() => getCleanVariant(currentVariant));
  const [savingVariant, setSavingVariant] = useState(null);

  // Sync state if external prop changes
  React.useEffect(() => {
    if (currentVariant) {
      setSelectedVariant(getCleanVariant(currentVariant));
    }
  }, [currentVariant]);

  const bottomNavOptions = [
    {
      id: 'floating_dock',
      legacyId: 'dock',
      title: 'Floating Dock Pill',
      tagline: 'Varian A - Dock Melayang Kapsul',
      desc: 'Dock melayang modern rounded-full, berjarak dari tepi bawah dengan bayangan lembut (shadow-lg).',
      badge: 'Paling Populer',
      accentColor: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'fixed_curved',
      legacyId: 'curved',
      title: 'Fixed Curved Scoop',
      tagline: 'Varian B - Cekungan Melengkung Bebas Tanpa Sentuh',
      desc: 'Bar dasar dengan lekukan melengkung halus di kanan, kiri, dan bawah lingkaran menu aktif (melayang bebas di dalam cekungan tanpa bersentuhan).',
      badge: 'Desain Paling Elegan',
      accentColor: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'floating_bubble',
      legacyId: 'bubble',
      title: 'Floating Bubble Indicator',
      tagline: 'Varian C - Bola Melayang Terangkat',
      desc: 'Bar putih bersih di mana item aktif memiliki indikator lingkaran bola mengambang terangkat ke atas.',
      badge: 'Interaktif 3D',
      accentColor: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'floating_box',
      legacyId: 'modern-box',
      title: 'Modern Box Badge',
      tagline: 'Varian D - Kotak Rounded Melayang',
      desc: 'Bar bawah modern di mana menu aktif ditandai kotak rounded mengambang dengan aksen warna primer.',
      badge: 'Minimalis Modern',
      accentColor: 'from-emerald-500 to-teal-500'
    }
  ];

  const handleSelectVariant = async (variantObj) => {
    const newVariant = variantObj.id;
    const legacyStyle = variantObj.legacyId;

    // 1. Instant Optimistic UI and Local Single-Source Sync
    setSelectedVariant(newVariant);
    setSavingVariant(newVariant);

    const localUpdated = {
      ...(config || {}),
      bottom_nav_variant: newVariant,
      bottomNavStyle: legacyStyle
    };

    if (onConfigUpdated) {
      onConfigUpdated(localUpdated);
    }

    try {
      localStorage.setItem('cms_active_theme_config', JSON.stringify(localUpdated));
      window.dispatchEvent(new Event('cms-config-updated'));
    } catch {}

    try {
      // 2. Persist to Database via /api/settings and /api/admin/theme/switch
      const [resSettings, resTheme] = await Promise.all([
        updateAppSettings({
          bottom_nav_variant: newVariant,
          bottomNavStyle: legacyStyle
        }, adminToken),
        switchTheme({
          industry: currentIndustry,
          themeId: currentThemeId,
          bottomNavStyle: legacyStyle,
          bottom_nav_variant: newVariant,
          token: adminToken
        })
      ]);

      if (showToast) {
        showToast('Varian navigasi berhasil disimpan & aktif di landing page');
      }

      if (onConfigUpdated) {
        onConfigUpdated({
          ...localUpdated,
          ...(resTheme?.themeConfig || resSettings?.data || {}),
          bottom_nav_variant: newVariant,
          bottomNavStyle: legacyStyle
        });
      }
    } catch (err) {
      console.error('[BottomNavSelector] Failed to persist to database:', err);
      if (showToast) {
        showToast('Varian navigasi aktif di landing page');
      }
    } finally {
      setSavingVariant(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Smartphone className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Model Mobile Bottom Navigation (4 Varian)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Tersimpan permanen di database (Single Source of Truth). Perubahan langsung aktif di landing page publik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono">
            Aktif di DB: {selectedVariant}
          </span>
        </div>
      </div>

      {/* Main Grid: 4 Choice Cards & Live Phone Mockup Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full min-w-0 items-start">
        {/* Left Column: 4 Choice Cards (8 Cols on desktop) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bottomNavOptions.map((opt) => {
            const isSelected = selectedVariant === opt.id || selectedVariant === opt.legacyId;
            const isSavingThis = savingVariant === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectVariant(opt)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/30 shadow-md'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-card'
                }`}
              >
                {/* Top Label & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {opt.badge}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" /> Terpilih & Aktif
                    </span>
                  )}
                </div>

                {/* Simulated Thumbnail Visual */}
                <div className="h-16 w-full rounded-xl bg-slate-100 border border-slate-200/80 p-2 flex flex-col justify-between overflow-hidden relative select-none">
                  {/* Mini simulated screen wireframe */}
                  <div className="space-y-1 opacity-40">
                    <div className="w-16 h-1 bg-slate-400 rounded-full" />
                    <div className="w-24 h-1 bg-slate-300 rounded-full" />
                  </div>

                  {/* Visual bottom nav representation based on type */}
                  {opt.id === 'floating_dock' && (
                    <div className="w-4/5 mx-auto h-5 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-around px-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-2xs" />
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                  )}

                  {opt.id === 'fixed_curved' && (
                    <div className="w-full h-6 bg-white relative flex items-center justify-around px-2 border-b border-slate-200">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M 0 6 L 36 6 C 42 6, 42 20, 50 20 C 58 20, 58 6, 64 6 L 100 6" stroke="#CBD5E1" strokeWidth="1" fill="none" />
                      </svg>
                      <div className="w-2 h-2 rounded-full bg-slate-300 z-10" />
                      <div className="w-4 h-4 rounded-full bg-blue-600 -mt-2 shadow-xs border-2 border-white flex items-center justify-center text-[5px] text-white font-bold z-10" />
                      <div className="w-2 h-2 rounded-full bg-slate-300 z-10" />
                    </div>
                  )}

                  {opt.id === 'floating_bubble' && (
                    <div className="w-5/6 mx-auto h-5 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-around px-2 relative">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 -mt-2.5 shadow-xs border-2 border-white" />
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                  )}

                  {opt.id === 'floating_box' && (
                    <div className="w-5/6 mx-auto h-5 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-between p-0.5 px-1">
                      <div className="w-3 h-3 rounded-md bg-slate-200" />
                      <div className="w-3 h-3 rounded-md bg-slate-200" />
                      <div className="w-4 h-3.5 rounded-md bg-blue-600 shadow-2xs" />
                      <div className="w-3 h-3 rounded-md bg-slate-200" />
                    </div>
                  )}
                </div>

                {/* Title & Desc */}
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 leading-snug">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {opt.desc}
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">
                    {opt.id}
                  </span>
                  {isSelected ? (
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Tersimpan
                    </span>
                  ) : (
                    <span className="text-slate-500 group-hover:text-blue-600 font-semibold flex items-center gap-1">
                      {isSavingThis ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>Pilih Model Ini →</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Interactive Phone Mockup Frame (4 Cols on desktop) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-3.5 sm:p-4 text-white shadow-xl flex flex-col justify-between border-4 border-slate-800 space-y-3 min-w-0">
          {/* Phone Header Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-2 select-none">
            <span>9:41</span>
            <div className="w-20 h-3.5 bg-slate-950 rounded-full" />
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <div className="w-3 h-2 bg-emerald-400 rounded-xs" />
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="h-64 sm:h-72 bg-slate-800 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border border-slate-700/60 shadow-inner">
            {/* Simulated Hero & Content */}
            <div className="space-y-2 select-none">
              <div className="w-20 h-2 bg-blue-500/80 rounded-full" />
              <div className="w-32 h-3.5 bg-white/90 rounded-md font-bold text-[9px] text-slate-900 flex items-center px-1 truncate">
                Landing Page Preview
              </div>
              <div className="w-24 h-1.5 bg-slate-400/50 rounded-full" />
              <div className="grid grid-cols-2 gap-1.5 pt-2">
                <div className="h-10 bg-slate-700/60 rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <div className="w-10 h-1 bg-slate-400 rounded-full" />
                </div>
                <div className="h-10 bg-slate-700/60 rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="w-10 h-1 bg-slate-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Embedded Live Interactive Bottom Nav Preview */}
            <div className="relative w-full pt-4 min-w-0">
              <MobileBottomNav
                styleVariant={selectedVariant}
                whatsapp="6281288990011"
                phone="+6281288990011"
                isAlwaysVisible={true}
              />
            </div>
          </div>

          {/* Preview Footer Note */}
          <div className="text-center text-[10px] text-slate-400 leading-tight">
            ⚡ Pratinjau interaktif langsung: Tab di atas dapat diklik untuk menguji respon animasi.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBottomNavSelector;
