import React, { useState, useEffect, useRef } from 'react';
import { Home, Sparkles, Search, BookOpen, MessageSquare } from 'lucide-react';

const DEFAULT_NAV_ITEMS = [
  { id: 'home', label: 'Beranda', icon: Home, href: '#top' },
  { id: 'features', label: 'Layanan', icon: Sparkles, href: '#features' },
  { id: 'search', label: 'Cari', icon: Search, href: '#search' },
  { id: 'articles', label: 'Artikel', icon: BookOpen, href: '#articles' },
  { id: 'contact', label: 'Kontak', icon: MessageSquare, href: '/?contact=true' },
];

export default function CurvedBottomNav({
  items = DEFAULT_NAV_ITEMS,
  whatsappNumber = '6281234567890',
}) {
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('contact=true') || window.location.pathname === '/kontak')) {
      return 'contact';
    }
    return 'home';
  });
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const lockScrollSpyRef = useRef(false);
  const unlockTimerRef = useRef(null);

  // Auto-hide navigation bar when virtual keyboard / input focus is active on mobile
  useEffect(() => {
    const handleFocusIn = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    // Also track visualViewport resize on mobile
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const isShrunk = window.visualViewport.height < window.innerHeight * 0.75;
        setIsKeyboardOpen(isShrunk);
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  // Track scroll position for overall nav visibility, but isolate click state
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      // Hide only when at the very top of beranda (<= 30px). As soon as user scrolls, show immediately!
      setVisible(currentScrollY > 30);

      // If user clicked or locked, do NOT let scroll spy override activeKey
      if (lockScrollSpyRef.current) return;

      // Pure fallback detection without triggering FAQ on bottom bounce
      if (currentScrollY <= 150) {
        setActiveKey('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleItemClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Immediately update active state key directly (100% isolated from scroll listener)
    setActiveKey(item.id);

    // 2. Lock scroll spy indefinitely for 2.5 seconds during smooth scroll transition
    lockScrollSpyRef.current = true;
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      lockScrollSpyRef.current = false;
    }, 2500);

    // 3. Smooth scroll with exact anchor targeting
    if (item.href === '#top' || item.href === '#' || item.href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.href.startsWith('#')) {
      const targetEl = document.querySelector(item.href);
      if (targetEl) {
        // Adjust for sticky header
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      window.location.href = item.href;
    }
  };

  const navItems = items && items.length === 5 ? items : DEFAULT_NAV_ITEMS;
  const activeIndex = Math.max(0, navItems.findIndex((it) => it.id === activeKey));
  const ActiveIcon = navItems[activeIndex]?.icon || Home;
  const isHidden = !visible || isKeyboardOpen;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-all duration-300 transform ${
        isHidden
          ? 'translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      <div className="relative w-full max-w-md mx-auto">
        {/* Dynamic Floating Curved Bubble for the ACTIVE Menu Item */}
        <div
          className="absolute -top-4 z-30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
          style={{
            left: `calc(${(activeIndex * 20) + 10}%)`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20 border-2 border-white transform transition-transform duration-200">
            <ActiveIcon className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Curved Navigation Bar Container - 100% Solid White (Zero Transparency) */}
        <div className="relative bg-white border-t border-slate-200 shadow-xl pb-[env(safe-area-inset-bottom,12px)] pt-2 transition-colors duration-200">
          {/* Dynamic SVG Arch Curve Notch - 100% Solid White */}
          <svg
            className="absolute -top-3.5 w-16 h-3.5 fill-white pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              left: `calc(${(activeIndex * 20) + 10}%)`,
              transform: 'translateX(-50%)',
            }}
            viewBox="0 0 80 16"
            preserveAspectRatio="none"
          >
            <path d="M 0,16 C 18,16 24,0 40,0 C 56,0 62,16 80,16 Z" fill="#ffffff" />
            <path d="M 0,16 C 18,16 24,0 40,0 C 56,0 62,16 80,16" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          </svg>

          {/* 5-Column Grid with minimum 48px touch target per item */}
          <nav className="grid grid-cols-5 min-h-[52px] px-1 relative z-10 text-[10px]">
            {navItems.map((item) => {
              const Icon = item.icon || Home;
              const isActive = activeKey === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleItemClick(e, item)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex flex-col items-center justify-center min-h-[48px] py-1 relative z-10 w-full focus:outline-none transition-colors group select-none"
                >
                  {/* Default Icon */}
                  <span
                    className={`transition-all duration-200 ${
                      isActive
                        ? 'opacity-0 -translate-y-2 pointer-events-none'
                        : 'opacity-100 translate-y-0 text-slate-500 group-hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-0.5" />
                  </span>

                  {/* Menu Label */}
                  <span
                    className={`text-[10px] tracking-tight transition-all duration-200 ${
                      isActive
                        ? 'font-bold text-slate-900 translate-y-1'
                        : 'font-medium text-slate-500 group-hover:text-slate-800'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
