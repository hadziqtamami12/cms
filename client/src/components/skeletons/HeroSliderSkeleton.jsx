import React from 'react';

export default function HeroSliderSkeleton() {
  return (
    <section
      className="relative w-full h-[100svh] min-h-[100svh] flex items-center justify-center overflow-hidden bg-slate-100"
      aria-hidden="true"
    >
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 skeleton-shimmer opacity-30" />

      {/* Light overlay gradients matching final Hero */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-white/50 to-transparent" />

      {/* Main Content Container matching HeroSlider */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-16 flex flex-col items-start justify-center">
        {/* Badge Placeholder */}
        <div className="w-48 h-7 rounded-full skeleton-shimmer mb-6" />

        {/* Heading Placeholder (2 lines responsive) */}
        <div className="w-11/12 sm:w-3/4 md:w-2/3 h-10 sm:h-14 rounded-xl skeleton-shimmer mb-3" />
        <div className="w-3/4 sm:w-1/2 md:w-5/12 h-10 sm:h-14 rounded-xl skeleton-shimmer mb-6" />

        {/* Subtitle Placeholder (2 lines) */}
        <div className="w-full sm:w-2/3 md:w-1/2 h-5 rounded-lg skeleton-shimmer mb-2.5" />
        <div className="w-5/6 sm:w-1/2 md:w-1/3 h-5 rounded-lg skeleton-shimmer mb-10" />

        {/* Buttons Placeholder */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-48 h-14 rounded-2xl skeleton-shimmer" />
          <div className="w-full sm:w-44 h-14 rounded-2xl skeleton-shimmer" />
        </div>

        {/* Slider Indicator Dots Placeholder */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-8 h-2 rounded-full skeleton-shimmer" />
          <div className="w-2 h-2 rounded-full skeleton-shimmer" />
          <div className="w-2 h-2 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </section>
  );
}
