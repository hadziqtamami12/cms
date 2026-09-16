import React from 'react';

export default function FleetCatalogSkeleton() {
  return (
    <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" aria-hidden="true">
      {/* Header Placeholder */}
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
        <div className="w-32 h-6 rounded-full skeleton-shimmer mb-4" />
        <div className="w-64 sm:w-96 h-10 rounded-xl skeleton-shimmer mb-3" />
        <div className="w-full sm:w-3/4 h-5 rounded skeleton-shimmer" />
      </div>

      {/* Grid of 6 Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden flex flex-col shadow-sm"
          >
            {/* 16:9 Aspect Ratio Image Box */}
            <div className="w-full aspect-[16/10] skeleton-shimmer relative" />

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Category & Name */}
              <div className="w-24 h-4 rounded skeleton-shimmer mb-2" />
              <div className="w-48 h-6 rounded-lg skeleton-shimmer mb-5" />

              {/* Specs Grid (4 pills) */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                <div className="h-8 rounded-xl skeleton-shimmer" />
                <div className="h-8 rounded-xl skeleton-shimmer" />
                <div className="h-8 rounded-xl skeleton-shimmer" />
                <div className="h-8 rounded-xl skeleton-shimmer" />
              </div>

              {/* Price & Action Row */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="w-16 h-3 rounded skeleton-shimmer" />
                  <div className="w-28 h-6 rounded skeleton-shimmer" />
                </div>
                <div className="w-28 h-10 rounded-xl skeleton-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
