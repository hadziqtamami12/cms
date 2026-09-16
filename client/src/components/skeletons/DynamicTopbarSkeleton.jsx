import React from 'react';

export default function DynamicTopbarSkeleton() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand placeholder */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
          <div className="flex flex-col gap-1.5">
            <div className="w-32 h-4 rounded skeleton-shimmer" />
            <div className="w-20 h-2.5 rounded skeleton-shimmer" />
          </div>
        </div>

        {/* Navigation placeholder */}
        <div className="hidden md:flex items-center gap-8">
          <div className="w-20 h-3.5 rounded skeleton-shimmer" />
          <div className="w-16 h-3.5 rounded skeleton-shimmer" />
          <div className="w-20 h-3.5 rounded skeleton-shimmer" />
          <div className="w-16 h-3.5 rounded skeleton-shimmer" />
        </div>

        {/* Action placeholder */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-28 h-8 rounded-lg skeleton-shimmer" />
          <div className="w-32 h-9 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </header>
  );
}
