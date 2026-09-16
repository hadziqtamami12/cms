import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Shield, ArrowRight, PhoneCall } from 'lucide-react';

export default function HeroSlider({ props = {} }) {
  const {
    badge = 'Layanan Rental Mobil #1 Terpercaya',
    ctaPrimaryText = 'Pilih Armada Sekarang',
    ctaPrimaryLink = '#fleet',
    ctaSecondaryText = 'Hubungi WhatsApp',
    ctaSecondaryLink = 'https://wa.me/6281234567890',
    slides = [
      {
        id: 'slide_1',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
        alt: 'Rental Mobil Mewah Eksekutif',
        badge: 'Armada Eksekutif',
        title: 'Kenyamanan Eksklusif untuk Bisnis & Keluarga',
        subtitle: 'Unit terbaru, interior bersih mewah, dan siap berangkat kapan saja.',
      },
    ],
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Smooth Auto-play with pause on user interaction
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative w-full h-[100svh] min-h-[100svh] flex items-center justify-center overflow-hidden bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Slideshow Promosi Utama"
    >
      {/* Background Slides with Hardware Accelerated Crossfade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          aria-hidden={idx !== currentIndex}
        >
          <img
            src={slide.imageUrl}
            alt={slide.alt || slide.title}
            width={1600}
            height={900}
            // CRITICAL: Lowercase fetchpriority for React 18 compliance, first slide is eager preloaded for LCP < 1.2s
            loading={idx === 0 ? 'eager' : 'lazy'}
            fetchpriority={idx === 0 ? 'high' : undefined}
            decoding={idx === 0 ? 'sync' : 'async'}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
          />

          {/* High-visibility cinematic overlays: keeps vehicle image vividly visible while ensuring text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>
      ))}

      {/* Content Overlay - Responsive padding to always fit 100svh on mobile */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-12 sm:pt-24 sm:pb-16 flex flex-col items-start justify-center">
        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/50 text-white text-xs sm:text-sm font-bold tracking-wide shadow-xs mb-4 sm:mb-6 backdrop-blur-sm">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          <span>{slides[currentIndex]?.badge || badge}</span>
        </div>

        {/* Dynamic Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight sm:leading-[1.15] mb-3 sm:mb-6 drop-shadow-md">
          {slides[currentIndex]?.title || 'Perjalanan Nyaman & Elegan dengan Armada Terbaik'}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-slate-100 max-w-2xl leading-relaxed mb-6 sm:mb-10 font-normal drop-shadow-sm line-clamp-3 sm:line-clamp-none">
          {slides[currentIndex]?.subtitle || 'Unit terbaru, interior bersih mewah, dan siap berangkat kapan saja.'}
        </p>

        {/* Action Buttons - Neutral Executive Palette & Soft Shadows */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <a
            href={ctaPrimaryLink}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-base shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{ctaPrimaryText}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
          </a>

          <a
            href={ctaSecondaryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-base border border-white/30 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span>{ctaSecondaryText}</span>
          </a>
        </div>
      </div>

      {/* Slide Navigation Controls (Desktop) */}
      {slides.length > 1 && (
        <div className="hidden sm:flex absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 justify-between pointer-events-none">
          <button
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className="pointer-events-auto p-3 rounded-full bg-white/90 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 backdrop-blur-md transition-all shadow-sm focus:outline-none"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className="pointer-events-auto p-3 rounded-full bg-white/90 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 backdrop-blur-md transition-all shadow-sm focus:outline-none"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Minimalist Slide Indicator Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Pindah ke slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                i === currentIndex ? 'w-8 bg-white shadow-xs' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
