import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

/**
 * Clean & Professional Splash Screen
 * Pure white background (#ffffff) with transparent logo presentation
 * and elegant circular spinner loading indicator.
 */
export const SplashScreen = ({
  brandName = 'Royal Fleet Premiere',
  tagline = 'Sewa Mobil & Armada Terpercaya',
  logoUrl = '/api/brand/logo.svg',
  duration = 1.2,
  onFinish
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);

  useEffect(() => {
    const totalMs = Math.max(800, Number(duration || 1.2) * 1000);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 300); // 300ms smooth fade transition
    }, totalMs);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-slate-900 transition-opacity duration-300 ease-out select-none px-4 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto animate-fade-in">
        {/* Brand Logo - 100% Background Transparan tanpa card/box */}
        <div className="flex items-center justify-center min-w-[80px] min-h-[80px] max-w-[240px] max-h-[100px] bg-transparent">
          {logoUrl && !logoLoadError ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="max-h-20 max-w-full object-contain bg-transparent filter drop-shadow-xs"
              onError={() => setLogoLoadError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1 px-2">
          <div role="heading" aria-level="2" className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {brandName}
          </div>
          {tagline && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
              {tagline}
            </p>
          )}
        </div>

        {/* Modern Circular Spinner Loading Icon */}
        <div className="pt-2 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
