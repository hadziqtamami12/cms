import React from 'react';
import DynamicTopbarSkeleton from './DynamicTopbarSkeleton';
import HeroSliderSkeleton from './HeroSliderSkeleton';
import FleetCatalogSkeleton from './FleetCatalogSkeleton';
import CurvedNavSkeleton from './CurvedNavSkeleton';

export default function PageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-900 flex flex-col relative overflow-x-hidden">
      {/* 1:1 Pixel Match Topbar */}
      <DynamicTopbarSkeleton />

      {/* 1:1 Pixel Match 100svh Hero Slider */}
      <HeroSliderSkeleton />

      {/* 1:1 Pixel Match Fleet Catalog */}
      <FleetCatalogSkeleton />
    </div>
  );
}
