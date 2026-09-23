import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

/**
 * LandingPageSkeleton
 * High-fidelity skeleton loader that visually mirrors the real Landing Page
 * (Hero Slideshow, Transparent Top Navbar, Dynamic Features, and Product Catalog Grid).
 * Features smooth pulse and shimmer animations to eliminate jarring blank screens.
 */
export const LandingPageSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-warm text-slate-800 relative overflow-x-hidden">
      {/* 1. TOP NAVBAR SKELETON */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Text */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/50 animate-pulse flex items-center justify-center text-white/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-28 sm:w-36 bg-white/20 rounded-md animate-pulse" />
                <div className="hidden sm:block h-3 w-44 bg-white/10 rounded-md animate-pulse" />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <div className="h-4 w-20 bg-white/15 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-white/15 rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-white/15 rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-white/15 rounded-full animate-pulse" />
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-28 sm:w-36 bg-blue-600/70 rounded-full animate-pulse shadow-md shadow-blue-600/20" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SLIDESHOW SKELETON */}
      <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 pt-24 sm:pt-32 pb-16 sm:pb-20 shimmer-wrapper shimmer-dark">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col items-center sm:items-start justify-center my-auto space-y-6">
          {/* Badge Shimmer */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <div className="h-3.5 w-44 bg-white/25 rounded" />
          </div>

          {/* Headline Skeletons */}
          <div className="w-full space-y-3 flex flex-col items-center sm:items-start">
            <div className="h-10 sm:h-14 w-full sm:w-4/5 max-w-2xl bg-white/20 rounded-2xl animate-pulse" />
            <div className="h-10 sm:h-14 w-4/5 sm:w-3/5 max-w-xl bg-white/15 rounded-2xl animate-pulse" />
          </div>

          {/* Subtitle Skeletons */}
          <div className="w-full space-y-2 flex flex-col items-center sm:items-start pt-2">
            <div className="h-4 sm:h-5 w-11/12 sm:w-3/4 max-w-xl bg-white/15 rounded-lg animate-pulse" />
            <div className="h-4 sm:h-5 w-4/5 sm:w-1/2 max-w-md bg-white/10 rounded-lg animate-pulse" />
          </div>

          {/* CTA Buttons Skeletons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <div className="h-13 w-full sm:w-52 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl animate-pulse shadow-lg shadow-blue-600/30" />
            <div className="h-13 w-full sm:w-44 bg-white/10 border border-white/20 rounded-2xl animate-pulse" />
          </div>

          {/* Slideshow Indicator Dots */}
          <div className="flex items-center gap-2 pt-6">
            <div className="h-2 w-8 bg-blue-500 rounded-full animate-pulse" />
            <div className="h-2 w-2.5 bg-white/20 rounded-full animate-pulse" />
            <div className="h-2 w-2.5 bg-white/20 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHT METRICS / FEATURES STRIP SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle flex items-center gap-3 shimmer-wrapper">
              <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FLEET / PRODUCT CATALOG GRID SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="h-6 w-32 bg-blue-100 rounded-full mx-auto animate-pulse" />
          <div className="h-8 sm:h-10 w-3/4 bg-slate-200 rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-1/2 bg-slate-100 rounded mx-auto animate-pulse" />
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((cat) => (
            <div key={cat} className="h-9 w-24 bg-slate-200/70 rounded-full animate-pulse shrink-0" />
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((card) => (
            <div key={card} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle p-4 space-y-4 shimmer-wrapper">
              {/* Product Image Placeholder */}
              <div className="w-full h-48 sm:h-52 bg-slate-200 rounded-2xl relative overflow-hidden animate-pulse">
                <div className="absolute top-3 left-3 h-6 w-20 bg-white/80 rounded-full" />
                <div className="absolute bottom-3 right-3 h-7 w-28 bg-slate-900/60 rounded-xl" />
              </div>

              {/* Title & Tag */}
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-3.5 w-1/2 bg-slate-100 rounded animate-pulse" />
              </div>

              {/* Specs Pills */}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
              </div>

              {/* Footer CTA Button */}
              <div className="pt-2">
                <div className="h-11 w-full bg-slate-200 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MOBILE FLOATING BOTTOM NAV SKELETON */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 sm:hidden">
        <div className="flex items-center gap-6 px-6 py-3.5 rounded-full bg-slate-900/90 backdrop-blur-lg border border-white/10 shadow-2xl">
          <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-blue-500 animate-pulse -mt-4 shadow-lg shadow-blue-500/40" />
          <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LandingPageSkeleton;
