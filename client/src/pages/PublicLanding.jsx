import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Car, Users, Zap, Fuel, Briefcase, Star, ShieldCheck, Clock,
  Award, Sparkles, Phone, MessageSquare, ArrowRight, CheckCircle2,
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, MapPin,
  Calendar, Check, Shield, ChevronDown, ExternalLink, Heart, X,
  HelpCircle
} from 'lucide-react';
import FloatingWhatsapp from '../components/navigation/FloatingWhatsapp';

/**
 * PublicLanding - Premium, visual-heavy, zero layout shift landing page.
 * Conversion-focused design for automotive & VIP fleet rentals.
 */
export default function PublicLanding({
  hero = null,
  fleet = null,
  styling = null,
  header = null,
  footer = null,
  floatingWhatsapp = null,
  isCanvasPreview = false,
}) {
  // --- Brand & Contact Config ---
  const whatsappPhone = header?.whatsappNumber || '6281234567890';
  const brandTitle = header?.brandName || 'Samudera VIP Transport';

  // --- Styling Tokens ---
  const primaryColor = styling?.primaryColor || '#4f46e5'; // Indigo-600
  const accentColor = styling?.accentColor || '#f59e0b'; // Amber-500
  const surfaceColor = styling?.surfaceColor || '#ffffff';
  const fontFamily = styling?.fontFamily || 'Inter, system-ui, sans-serif';
  const cardRadius = styling?.cardRadius || 'rounded-2xl';
  const enableMeshGradient = styling?.enableMeshGradient !== false;

  // --- Hero Data Defaults ---
  const heroMode = hero?.mode || 'slideshow'; // 'static' | 'slideshow'
  const heroAutoplayInterval = (hero?.autoplayInterval || 5) * 1000;
  const heroAspectRatio = hero?.aspectRatio || '16:9'; // '16:9' | '21:9' | '4:3' | 'fullscreen'
  const heroOverlayOpacity = hero?.overlayOpacity !== undefined ? hero?.overlayOpacity : 50;

  const defaultSlides = [
    {
      id: 'slide-1',
      badge: 'Layanan VIP Rental 24 Jam • #1 Terpercaya',
      title: 'Perjalanan Mewah & Berkelas dengan Armada Terbaik',
      subtitle: 'Armada tahun terbaru, kabin bersih wangi berkelas, siap lepas kunci atau supir eksekutif ramah berpengalaman.',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
      ctaPrimaryText: 'Pilih Armada Mobil',
      ctaPrimaryLink: '#fleet',
      ctaSecondaryText: 'Chat WhatsApp 24 Jam',
      ctaSecondaryLink: 'https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20tanya%20rental%20mobil',
    },
    {
      id: 'slide-2',
      badge: 'Armada Eksekutif • Siap Antar Jemput Bandara',
      title: 'Toyota Alphard Transformer & Vellfire VIP',
      subtitle: 'Kenyamanan kelas bisnis dengan captain seat mewah, privasi maksimal, dan fasilitas bintang lima untuk tamu kehormatan.',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600&auto=format&fit=crop',
      ctaPrimaryText: 'Booking Alphard VIP',
      ctaPrimaryLink: '#fleet',
      ctaSecondaryText: 'Konsultasi Gratis',
      ctaSecondaryLink: 'https://wa.me/6281234567890',
    },
  ];

  const slides = hero?.slides && hero.slides.length > 0 ? hero.slides : defaultSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Auto-play Slideshow
  useEffect(() => {
    if (heroMode !== 'slideshow' || isSlidePaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, heroAutoplayInterval);
    return () => clearInterval(interval);
  }, [heroMode, isSlidePaused, slides.length, heroAutoplayInterval]);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  // --- Fleet / Product Catalog Defaults ---
  const defaultVehicles = [
    {
      id: 'car-1',
      name: 'Toyota Alphard Transformer VIP',
      category: 'VIP Luxury',
      priceLepasKunci: 'Rp 2.500.000',
      priceWithDriver: 'Rp 2.800.000',
      period: 'per hari',
      transmission: 'Matic TNGA',
      capacity: '6 Kursi VIP',
      fuel: 'Bensin',
      luggage: '4 Koper',
      rating: 5.0,
      reviewsCount: 184,
      badge: 'Paling Populer',
      badgeColor: 'from-amber-500 to-orange-600',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      specs: ['Captain Seat Leather', 'Sunroof & Ambient Light', 'Supir Jas Berdasi'],
      description: 'Pilihan utama tamu VIP, direksi, dan perjalanan bisnis mewah dengan kenyamanan kabin kedap suara.',
    },
    {
      id: 'car-2',
      name: 'Toyota Innova Zenix Hybrid',
      category: 'MPV Keluarga',
      priceLepasKunci: 'Rp 750.000',
      priceWithDriver: 'Rp 950.000',
      period: 'per hari',
      transmission: 'Matic CVT',
      capacity: '7 Penumpang',
      fuel: 'Hybrid Irit',
      luggage: '3 Koper',
      rating: 4.9,
      reviewsCount: 215,
      badge: 'Paling Laris',
      badgeColor: 'from-blue-600 to-indigo-700',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      specs: ['Panoramic Roof', 'Suspensi Empuk TNGA', 'Kabin Ekstra Senyap'],
      description: 'Kombinasi sempurna kenyamanan keluarga, efisiensi bahan bakar maksimal, dan kabin lapang modern.',
    },
    {
      id: 'car-3',
      name: 'Toyota Fortuner 2.8 GR Sport',
      category: 'SUV Tangguh',
      priceLepasKunci: 'Rp 1.200.000',
      priceWithDriver: 'Rp 1.450.000',
      period: 'per hari',
      transmission: 'Matic 4x2',
      capacity: '7 Penumpang',
      fuel: 'Diesel Turbo',
      luggage: '4 Koper',
      rating: 4.9,
      reviewsCount: 98,
      badge: 'Gagah & Kuat',
      badgeColor: 'from-emerald-600 to-teal-700',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      specs: ['Mesin 2.800cc Turbo', 'Jok Kulit Sporty GR', 'Ground Clearance Tinggi'],
      description: 'SUV gagah berdaya tangguh untuk perjalanan luar kota, kunjungan proyek, atau liburan medan berliku.',
    },
    {
      id: 'car-4',
      name: 'Mitsubishi Xpander Ultimate',
      category: 'MPV Keluarga',
      priceLepasKunci: 'Rp 450.000',
      priceWithDriver: 'Rp 700.000',
      period: 'per hari',
      transmission: 'Matic CVT',
      capacity: '7 Penumpang',
      fuel: 'Bensin Irit',
      luggage: '3 Koper',
      rating: 4.9,
      reviewsCount: 172,
      badge: 'Best Value',
      badgeColor: 'from-purple-600 to-indigo-600',
      imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      specs: ['AC Double Blower', 'Kabin Lega Fleksibel', 'Konsumsi BBM Hemat'],
      description: 'Pilihan hemat dan nyaman untuk keliling kota, belanja, atau perjalanan silaturahmi keluarga.',
    },
    {
      id: 'car-5',
      name: 'Toyota HiAce Premio Luxury',
      category: 'Minibus Wisata',
      priceLepasKunci: 'Rp 1.600.000',
      priceWithDriver: 'Rp 1.950.000',
      period: 'per hari',
      transmission: 'Manual',
      capacity: '10-12 Kursi',
      fuel: 'Diesel Euro 4',
      luggage: '6 Koper',
      rating: 5.0,
      reviewsCount: 88,
      badge: 'Rombongan VIP',
      badgeColor: 'from-amber-600 to-rose-600',
      imageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=800&auto=format&fit=crop&q=80',
      specs: ['Reclining Seat Jumbo', 'Audio Video Karaoke', 'Bagasi Belakang Luas'],
      description: 'Minibus eksekutif berkapasitas besar dengan kenyamanan kursi empuk untuk tour wisata atau rombongan kantor.',
    },
    {
      id: 'car-6',
      name: 'Hyundai Ioniq 5 EV Signature',
      category: 'VIP Luxury',
      priceLepasKunci: 'Rp 1.800.000',
      priceWithDriver: 'Rp 2.100.000',
      period: 'per hari',
      transmission: 'Matic EV',
      capacity: '5 Kursi',
      fuel: 'Listrik (EV)',
      luggage: '3 Koper',
      rating: 4.9,
      reviewsCount: 64,
      badge: 'Ramah Lingkungan',
      badgeColor: 'from-cyan-600 to-blue-600',
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
      specs: ['100% Bebas Emisi & Ganjil Genap', 'Akselerasi Halus Senyap', 'Relaxation Comfort Seat'],
      description: 'Mobil listrik futuristik bebas aturan ganjil-genap Jakarta dengan teknologi masa depan yang memukau.',
    },
  ];

  const vehicles = fleet?.vehicles && fleet.vehicles.length > 0 ? fleet.vehicles : defaultVehicles;

  // Fleet Filtering State
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState(0);

  // --- Scroll State Tracking for Dynamic Topbar and Mobile Nav ---
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [activeBottomNav, setActiveBottomNav] = useState('hero');
  const [quickServiceType, setQuickServiceType] = useState('lepas-kunci');
  const [quickSelectedCar, setQuickSelectedCar] = useState(vehicles[0]?.name || 'Toyota Alphard Transformer VIP');
  const [quickLocation, setQuickLocation] = useState('');
  const lockScrollSpyRef = useRef(false);
  const unlockTimerRef = useRef(null);

  // Strictly sequential with page layout from top to bottom:
  // 1. Beranda (#hero) -> 2. Layanan (#features) -> 3. Armada (#fleet - Center!) -> 4. FAQ (#faq) -> 5. Kontak
  const navTabs = useMemo(() => [
    { id: 'hero', label: 'Beranda', icon: Car, href: '#hero' },
    { id: 'features', label: 'Layanan', icon: ShieldCheck, href: '#features' },
    { id: 'fleet', label: 'Armada', icon: SlidersHorizontal, href: '#fleet' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, href: '#faq' },
    { id: 'contact', label: 'Kontak', icon: Phone, href: `tel:+${whatsappPhone}` },
  ], [whatsappPhone]);

  const activeIndex = useMemo(() => {
    const idx = navTabs.findIndex((t) => t.id === activeBottomNav);
    return idx >= 0 ? idx : 0;
  }, [navTabs, activeBottomNav]);

  const ActiveIcon = navTabs[activeIndex]?.icon || Car;

  const handleTabClick = (e, tab) => {
    setActiveBottomNav(tab.id);
    lockScrollSpyRef.current = true;
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      lockScrollSpyRef.current = false;
    }, 1500);

    if (tab.href && tab.href.startsWith('#')) {
      e.preventDefault();
      const targetEl = document.querySelector(tab.href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = (scrollTop) => {
      // Topbar changes background when scrolled > 30px
      setIsScrolled(scrollTop > 30);
      // Mobile bottom nav is hidden ONLY when at the very top of beranda (scrollTop <= 30).
      // As soon as user starts scrolling (> 30px), it immediately appears!
      setScrolledPastHero(scrollTop > 30);

      if (lockScrollSpyRef.current) return;

      const featuresEl = document.getElementById('features');
      const fleetEl = document.getElementById('fleet');
      const faqEl = document.getElementById('faq');
      const contactEl = document.getElementById('contact');

      const scrollParent = containerRef.current?.closest('.overflow-y-auto');
      const viewportH = scrollParent ? scrollParent.clientHeight : window.innerHeight;
      const threshold = viewportH * 0.45;

      const getTop = (el) => {
        if (!el) return Infinity;
        if (scrollParent) {
          const elRect = el.getBoundingClientRect();
          const parentRect = scrollParent.getBoundingClientRect();
          return elRect.top - parentRect.top;
        }
        return el.getBoundingClientRect().top;
      };

      const contactTop = getTop(contactEl);
      const faqTop = getTop(faqEl);
      const fleetTop = getTop(fleetEl);
      const featuresTop = getTop(featuresEl);

      if (contactTop <= threshold + 60) {
        setActiveBottomNav('contact');
      } else if (faqTop <= threshold) {
        setActiveBottomNav('faq');
      } else if (fleetTop <= threshold) {
        setActiveBottomNav('fleet');
      } else if (featuresTop <= threshold) {
        setActiveBottomNav('features');
      } else {
        setActiveBottomNav('hero');
      }
    };

    const onWindowScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      handleScroll(scrollY);
    };

    // Also listen to parent container scroll when rendered inside Admin Canvas Sandbox
    const scrollParent = containerRef.current?.closest('.overflow-y-auto');
    const onParentScroll = () => {
      if (!scrollParent) return;
      handleScroll(scrollParent.scrollTop);
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    if (scrollParent) {
      scrollParent.addEventListener('scroll', onParentScroll, { passive: true });
    }

    onWindowScroll();
    if (scrollParent) onParentScroll();

    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      if (scrollParent) scrollParent.removeEventListener('scroll', onParentScroll);
    };
  }, []);

  const categories = useMemo(() => {
    const cats = ['Semua'];
    vehicles.forEach((v) => {
      if (v.category && !cats.includes(v.category)) cats.push(v.category);
    });
    return cats;
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((item) => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.specs && item.specs.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [vehicles, selectedCategory, searchQuery]);

  return (
    <div
      ref={containerRef}
      style={{ fontFamily }}
      className="w-full min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white relative overflow-x-hidden flex flex-col"
    >
      {/* 1. TOPBAR NAVBAR (Transparent on top of slideshow, changes to solid on scroll) */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 py-3 text-slate-900 shadow-md'
            : 'bg-transparent border-none py-4 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md ${
                isScrolled
                  ? 'text-white'
                  : 'backdrop-blur-md bg-white/20 border border-white/30 text-white'
              }`}
              style={{ backgroundColor: isScrolled ? primaryColor : undefined }}
            >
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`font-extrabold text-base sm:text-lg tracking-tight block leading-tight transition-colors ${
                  isScrolled ? 'text-slate-950' : 'text-white drop-shadow-sm'
                }`}
              >
                {brandTitle}
              </span>
              <span
                className={`text-[11px] font-medium tracking-normal block transition-colors ${
                  isScrolled ? 'text-slate-500' : 'text-slate-300 drop-shadow-xs'
                }`}
              >
                Executive Fleet & 24/7 Car Rental
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav
            className={`hidden md:flex items-center gap-6 text-sm font-semibold transition-colors ${
              isScrolled ? 'text-slate-700' : 'text-white/90'
            }`}
          >
            <a
              href="#hero"
              className={`transition-colors px-2 py-1 rounded-lg ${
                isScrolled ? 'hover:text-indigo-600' : 'hover:text-white hover:bg-white/10'
              }`}
            >
              Beranda
            </a>
            <a
              href="#fleet"
              className={`transition-colors px-2 py-1 rounded-lg ${
                isScrolled ? 'hover:text-indigo-600' : 'hover:text-white hover:bg-white/10'
              }`}
            >
              Pilihan Armada
            </a>
            <a
              href="#features"
              className={`transition-colors px-2 py-1 rounded-lg ${
                isScrolled ? 'hover:text-indigo-600' : 'hover:text-white hover:bg-white/10'
              }`}
            >
              Keunggulan
            </a>
            <a
              href="#faq"
              className={`transition-colors px-2 py-1 rounded-lg ${
                isScrolled ? 'hover:text-indigo-600' : 'hover:text-white hover:bg-white/10'
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* WhatsApp CTA Desktop */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappPhone}?text=Halo%20Admin,%20saya%20ingin%20tanya%20reservasi%20mobil`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Chat WhatsApp 24 Jam</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. FULLSCREEN HERO SLIDESHOW SECTION (Full Satu Layar / 100svh) */}
      <section
        id="hero"
        ref={heroRef}
        className="relative w-full h-screen min-h-[100svh] overflow-hidden flex flex-col justify-between text-white"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
      >
        {/* Fullscreen Slideshow Background Engine */}
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title || 'Slideshow Armada'}
                className="w-full h-full object-cover object-[center_35%] lg:object-[center_45%] transition-transform duration-[8000ms] ease-out"
                style={{
                  transform: idx === currentSlideIndex ? 'scale(1.02)' : 'scale(1.0)',
                }}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchpriority={idx === 0 ? 'high' : undefined}
              />

              {/* Luxury Soft Overlay - Keeps Car Crisp, Framed & Unclipped */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/10"
                style={{ opacity: Math.max(0.35, heroOverlayOpacity / 100) }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
            </div>
          ))}

          {/* Ambient Glowing Orbs */}
          {enableMeshGradient && (
            <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
              <div
                className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-35 animate-pulse"
                style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
              />
              <div
                className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
                style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
              />
            </div>
          )}
        </div>

        {/* Hero Main Content (2-Column Grid on Desktop: Left Story, Right Quick Booking Card) */}
        <div className="relative z-20 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            {/* Left Column: Headline, Story & Core CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Glassmorphism Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg text-xs font-bold text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{activeSlide.badge || 'Layanan VIP Rental 24 Jam • #1 Terpercaya'}</span>
              </div>

              {/* H1 Headline with High-Impact Typography */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] drop-shadow-lg">
                {activeSlide.title || 'Perjalanan Mewah & Berkelas dengan Armada Terbaik'}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow-md">
                {activeSlide.subtitle || 'Unit terbaru, interior bersih wangi berkelas, siap lepas kunci atau supir eksekutif ramah berpengalaman.'}
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href={activeSlide.ctaPrimaryLink || '#fleet'}
                  className="px-7 py-3.5 rounded-xl font-bold text-sm text-white shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{activeSlide.ctaPrimaryText || 'Pilih Armada Mobil'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={activeSlide.ctaSecondaryLink || `https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-xl font-bold text-sm text-white backdrop-blur-md bg-white/15 border border-white/30 shadow-lg hover:bg-white/25 transition-all flex items-center gap-2.5"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{activeSlide.ctaSecondaryText || 'Chat WhatsApp 24 Jam'}</span>
                </a>
              </div>

              {/* Trust Statistics Bar (Frosted Glass) */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20 max-w-lg">
                <div className="backdrop-blur-sm bg-slate-900/40 p-2.5 rounded-xl border border-white/10">
                  <span className="text-lg sm:text-xl font-black text-white block">50+</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-300 block">Unit Siap Jalan</span>
                </div>
                <div className="backdrop-blur-sm bg-slate-900/40 p-2.5 rounded-xl border border-white/10">
                  <span className="text-lg sm:text-xl font-black text-white block">99.8%</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-300 block">On-Time Penjemputan</span>
                </div>
                <div className="backdrop-blur-sm bg-slate-900/40 p-2.5 rounded-xl border border-white/10">
                  <span className="text-lg sm:text-xl font-black text-white block">100%</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-300 block">Asuransi All-Risk</span>
                </div>
              </div>
            </div>

            {/* Right Column: Desktop Quick Booking Card (Eliminates empty space on right) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="backdrop-blur-2xl bg-slate-950/75 border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-400 block">
                      Booking Cepat 24 Jam
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">Cek Ketersediaan Armada</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Unit Ready</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Pilihan Layanan</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickServiceType('lepas-kunci')}
                        className={`py-2 px-3 rounded-xl font-bold text-center transition-all ${
                          quickServiceType === 'lepas-kunci'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200'
                        }`}
                      >
                        Lepas Kunci
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickServiceType('dengan-supir')}
                        className={`py-2 px-3 rounded-xl font-bold text-center transition-all ${
                          quickServiceType === 'dengan-supir'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200'
                        }`}
                      >
                        Dengan Supir VIP
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Pilihan Mobil</label>
                    <select
                      value={quickSelectedCar}
                      onChange={(e) => setQuickSelectedCar(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 border border-white/20 text-white text-xs focus:outline-none focus:border-indigo-400"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.name} className="bg-slate-900 text-white">
                          {v.name} ({v.priceLepasKunci || v.priceWithDriver})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Lokasi Penjemputan</label>
                    <input
                      type="text"
                      value={quickLocation}
                      onChange={(e) => setQuickLocation(e.target.value)}
                      placeholder="Contoh: Bandara Soekarno Hatta / Hotel Jakarta"
                      className="w-full py-2 px-3 rounded-xl bg-slate-900/90 border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Halo Admin ${brandTitle}, saya ingin reservasi armada:\n- Unit: ${quickSelectedCar}\n- Layanan: ${
                      quickServiceType === 'lepas-kunci' ? 'Lepas Kunci' : 'Dengan Supir VIP'
                    }\n- Lokasi: ${quickLocation || 'Bandara / Hotel'}\nApakah unit masih tersedia?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white text-center flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Hubungi Admin & Konfirmasi Unit</span>
                </a>

                <p className="text-[10px] text-slate-400 text-center">
                  ✓ Tanpa survei rumit • Unit bersih wangi berkelas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar: Slide Controls & Scroll Prompt */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 flex items-center justify-between text-xs">
          {/* Slideshow pagination indicators & arrows */}
          {heroMode === 'slideshow' && slides.length > 1 ? (
            <div className="flex items-center gap-2 backdrop-blur-md bg-slate-900/60 p-1.5 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/20 text-white transition-colors"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 px-1">
                {slides.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => setCurrentSlideIndex(sIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      sIdx === currentSlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ke slide ${sIdx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/20 text-white transition-colors"
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Smooth Scroll Down Indicator */}
          <a
            href="#fleet"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors drop-shadow-sm font-medium animate-bounce"
          >
            <span>Eksplorasi Armada</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </section>


      {/* 3. VALUE PROPOSITION / KEUNGGULAN */}
      <section id="features" className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
              Standar Layanan VIP
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Mengapa Memilih Samudera VIP Transport?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Komitmen kami menjamin kenyamanan, keamanan, dan kepastian perjalanan Anda tanpa kompromi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Unit Bersih & Terawat',
                desc: 'Seluruh armada melalui servis berkala di bengkel resmi serta pembersihan steril sebelum serah terima.',
              },
              {
                icon: Clock,
                title: 'Supir Ramah Berdasi',
                desc: 'Driver berpengalaman, menguasai rute jalan tol tercepat, dan terlatih melayani tamu VIP dengan sopan.',
              },
              {
                icon: Award,
                title: 'Asuransi All-Risk',
                desc: 'Perjalanan aman terlindungi asuransi menyeluruh. Bebas rasa cemas sepanjang agenda Anda berlangsung.',
              },
              {
                icon: MapPin,
                title: 'Bebas Antar Jemput',
                desc: 'Pengantaran tepat waktu di Terminal Bandara Soekarno Hatta, Halim, stasiun, maupun lobi hotel.',
              },
            ].map((feat, i) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={i}
                  className={`p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110 shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FLEET / PRODUCT CARD GRID (Visual-Heavy & Conversion Focused) */}
      <section id="fleet" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
                Katalog Armada Tersedia
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Pilihan Kendaraan Mewah & Keluarga
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Unit tahun 2024-2025 dengan kondisi prima, siap diberangkatkan hari ini.
              </p>
            </div>

            {/* Live Search Box */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari unit (Alphard, Zenix...)"
                className="w-full text-xs font-medium pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVehicles.map((car) => (
              <div
                key={car.id}
                className={`bg-white border border-slate-200/80 ${cardRadius} overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group`}
              >
                {/* Image Container with Zoom & Highlight Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category & Rating Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
                      {car.category}
                    </span>
                    {car.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                        {car.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{car.rating || 5.0}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-950 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {car.description}
                    </p>

                    {/* Unit Specifications with Pill Icons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 pb-2 border-y border-slate-100 my-3">
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{car.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
                        <Zap className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
                        <Fuel className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{car.luggage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clear Pricing Breakdown (Lepas Kunci vs With Driver) */}
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Lepas Kunci
                        </span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 block">
                          {car.priceLepasKunci}
                        </span>
                      </div>
                      <div className="border-l border-slate-200 pl-2">
                        <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block">
                          + Supir VIP
                        </span>
                        <span className="text-xs sm:text-sm font-black text-indigo-950 block">
                          {car.priceWithDriver}
                        </span>
                      </div>
                    </div>

                    {/* Prominent WhatsApp / Checkout Button */}
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        `Halo Admin ${brandTitle}, saya ingin sewa mobil *${car.name}*. Mohon info ketersediaan unit untuk tanggal...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all transform group-hover:scale-[1.02]"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Sewa via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">Unit tidak ditemukan</h4>
              <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian lain atau reset filter kategori.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
              Informasi Penting
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Apa saja persyaratan untuk sewa mobil lepas kunci?',
                a: 'Persyaratan sangat mudah: E-KTP asli penjamin, SIM A aktif, bukti reservasi tiket/hotel, dan deposit jaminan sewa yang akan dikembalikan penuh setelah masa sewa berakhir.',
              },
              {
                q: 'Apakah bisa diantar langsung ke Bandara Soekarno Hatta / Halim?',
                a: 'Bisa sekali! Tim operasional kami siap mengantarkan armada ke pintu kedatangan Terminal 1, 2, atau 3 Bandara Soekarno Hatta maupun Bandara Halim Perdanakusuma tepat waktu 24 jam nonstop.',
              },
              {
                q: 'Apakah harga all-in supir sudah termasuk bensin dan tol?',
                a: 'Paket All-In mencakup mobil + supir profesional. Biaya BBM, tarif tol, dan parkir dapat disesuaikan dengan rute aktual perjalanan Anda atau menggunakan paket All-Inclusive hemat kami.',
              },
              {
                q: 'Bagaimana jika terjadi kendala teknis di perjalanan?',
                a: 'Setiap armada kami dilengkapi layanan darurat 24 jam dan unit pengganti siap jalan jika terjadi kendala mesin, sehingga agenda penting Anda tetap berjalan lancar.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/60 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === idx ? -1 : idx)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-sm text-slate-900 hover:text-indigo-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      faqOpen === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="contact" className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Car className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-white">{brandTitle}</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Pusat layanan rental mobil eksekutif, sewa harian, mingguan, dan bulanan terpercaya dengan supir berpengalaman di Jakarta dan sekitarnya.
              </p>
              <div className="text-[11px] text-slate-500">
                Layanan 24 Jam Antar Jemput Bandara & Hotel VIP.
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Tautan Cepat</h4>
              <ul className="space-y-2">
                <li><a href="#hero" className="hover:text-white">Beranda</a></li>
                <li><a href="#fleet" className="hover:text-white">Daftar Mobil</a></li>
                <li><a href="#features" className="hover:text-white">Keunggulan Layanan</a></li>
                <li><a href="#faq" className="hover:text-white">Syarat & Ketentuan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Hubungi Kami</h4>
              <p className="text-slate-400 leading-relaxed mb-2">
                WhatsApp: +{whatsappPhone}<br />
                Email: booking@samuderarental.com<br />
                Jakarta, Indonesia
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} {brandTitle}. Seluruh Hak Cipta Dilindungi.</p>
            <p className="flex items-center gap-1">
              <span>Dibangun dengan standar zero layout shift</span>
              <Heart className="w-3 h-3 text-red-500 fill-current" />
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action (Configured in CMS Admin) */}
      <FloatingWhatsapp
        config={floatingWhatsapp || {
          enabled: true,
          phoneNumber: whatsappPhone,
          agentName: "Customer Support",
          agentStatus: "Online",
          greetingMessage: "Halo! Butuh bantuan atau ingin sewa mobil? Hubungi kami langsung.",
          defaultMessage: `Halo Admin ${brandTitle}, saya ingin reservasi/tanya ketersediaan unit mobil.`,
          ctaText: "Chat WhatsApp",
        }}
        isCanvasPreview={isCanvasPreview}
      />

      {/* 7. SOLID WHITE MOBILE BOTTOM NAV (Curved Arch FOR ACTIVE TAB ONLY, Search in Center) */}
      <nav
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-all duration-300 ease-out transform ${
          scrolledPastHero
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        aria-label="Navigasi Bawah Mobile"
      >
        <div className="relative w-full max-w-md mx-auto">
          {/* Dynamic Floating Curved Bubble for the ACTIVE Menu Item */}
          <div
            className="absolute -top-3.5 z-30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
            style={{
              left: `${(activeIndex * 20) + 10}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div
              className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md shadow-indigo-600/30 border-2 border-white transform transition-transform duration-200"
              style={{ backgroundColor: primaryColor }}
            >
              <ActiveIcon className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          {/* Dynamic SVG Arch Curve Notch that smoothly arches up ONLY at the active item */}
          <div
            className="absolute -top-3.5 z-20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
            style={{
              left: `${(activeIndex * 20) + 10}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <svg
              viewBox="0 0 76 16"
              className="w-[72px] h-[16px] block"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,16 C 18,16 22,0 38,0 C 54,0 58,16 76,16 Z"
                fill="#ffffff"
              />
              <path
                d="M 0,16 C 18,16 22,0 38,0 C 54,0 58,16 76,16"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* 100% Solid White Navigation Container */}
          <div className="bg-white border-t border-slate-200/90 shadow-[0_-6px_25px_rgba(0,0,0,0.06)] pb-[max(0.6rem,env(safe-area-inset-bottom))] px-1 relative z-10">
            <div className="grid grid-cols-5 h-14 items-center">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeBottomNav === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={(e) => handleTabClick(e, tab)}
                    className="flex flex-col items-center justify-center py-1 relative z-10 w-full focus:outline-none transition-colors group select-none"
                    aria-label={tab.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Default Icon (hidden when lifted into the active bubble) */}
                    <span
                      className={`transition-all duration-200 ${
                        isActive
                          ? 'opacity-0 -translate-y-2 pointer-events-none'
                          : 'opacity-100 translate-y-0 text-slate-500 group-hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-0.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                    </span>

                    {/* Tab Label */}
                    <span
                      className={`text-[10px] tracking-tight transition-all duration-200 ${
                        isActive
                          ? 'font-bold translate-y-1'
                          : 'font-medium text-slate-500 group-hover:text-slate-800'
                      }`}
                      style={{ color: isActive ? primaryColor : undefined }}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
