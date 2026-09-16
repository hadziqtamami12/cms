import React from 'react';

export default function CurvedNavSkeleton() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden pb-safe pt-2 bg-white/95 border-t border-slate-200/90 shadow-lg" aria-hidden="true">
      <div className="flex items-center justify-around h-14 px-4">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="w-12 h-12 rounded-full skeleton-shimmer -mt-5" />
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
