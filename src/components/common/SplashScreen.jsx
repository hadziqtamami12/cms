import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * Normal & Clean Splash Screen
 * Simple, professional, and fast initial brand reveal.
 */
export const SplashScreen = ({
  brandName = 'Royal Fleet Premiere',
  tagline = 'Sewa Mobil & Armada Terpercaya',
  duration = 1.2,
  onFinish
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-300 ease-out select-none px-4 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4 max-w-xs mx-auto animate-fade-in">
        {/* Clean Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[1.5px] shadow-xl shadow-blue-500/20">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Clean Brand Name & Tagline */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {brandName}
          </h1>
          {tagline && (
            <p className="text-xs text-slate-400 font-normal">
              {tagline}
            </p>
          )}
        </div>

        {/* Minimal Subtle Loader */}
        <div className="flex items-center gap-1.5 pt-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:200ms]" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
