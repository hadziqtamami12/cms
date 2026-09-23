import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const HeroSlideshow = ({ slides = [], whatsapp, phone }) => {
  const [current, setCurrent] = useState(0);

  const fallbackSlides = [
    {
      title: 'Solusi Sewa Mobil Mewah & Armada Bisnis Terlengkap',
      subtitle: 'Armada tahun terbaru, jaminan bersih wangi, sopir profesional berpengalaman, dan layanan 24 jam.',
      badge: 'Armada Terlengkap & Terawat 2026',
      ctaText: 'Pesan Armada Sekarang',
      ctaLink: '#fleet',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80'
    },
    {
      title: 'Executive Chauffeur & VIP Airport Transfer',
      subtitle: 'Antar jemput bandara tepat waktu dengan unit Alphard, Camry, Fortuner, dan HiAce Luxury.',
      badge: 'Jaminan Layanan VIP 24/7',
      ctaText: 'Cek Jadwal & Tarif',
      ctaLink: '#pricing',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80'
    }
  ];

  const activeSlides = slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[current];

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 pt-24 sm:pt-32 pb-16 sm:pb-20">
      {/* Background Slideshow with Smooth Crossfade */}
      {activeSlides.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } transform transition-transform duration-10000`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          {/* Dual High-Contrast Scrim for 100% Readability */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/65" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60" />
        </div>
      ))}

      {/* Hero Content Container - Offset below desktop top navbar */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col items-center sm:items-start justify-center my-auto">
        {/* Trust Badge */}
        {slide.badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-600/90 text-white text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-md shadow-blue-500/30 backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-200" />
            <span>{slide.badge}</span>
          </div>
        )}

        {/* Main H1 Title (SEO #1 Critical) */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-4 sm:mb-6 drop-shadow-md max-w-3xl">
          {slide.title}
        </h1>

        {/* Subtitle / Value Proposition */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-100 font-medium leading-relaxed mb-6 sm:mb-8 max-w-2xl drop-shadow-sm">
          {slide.subtitle}
        </p>

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <a
            href={slide.ctaLink || '#fleet'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{slide.ctaText || 'Lihat Pilihan Armada'}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20ingin%20konsultasi%20layanan`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold text-white bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-500/50 backdrop-blur-sm transition-all shadow-md"
            >
              <span>Konsultasi WhatsApp</span>
            </a>
          )}
        </div>

        {/* Enterprise Metrics & Trust Proof */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-700/60 grid grid-cols-3 gap-6 sm:gap-12 text-white w-full sm:w-auto">
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
            <div className="text-xs sm:text-sm text-slate-300">Unit Siap Jalan</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold text-white">99.8%</div>
            <div className="text-xs sm:text-sm text-slate-300">Kepuasan Klien</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-slate-300">Dukungan Siaga</div>
          </div>
        </div>
      </div>

      {/* Manual Slideshow Controls (Desktop) */}
      <div className="hidden sm:flex absolute bottom-8 right-8 z-20 items-center gap-2">
        <button
          onClick={() => setCurrent((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1))}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % activeSlides.length)}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;
