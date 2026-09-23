import React, { useState, useEffect } from 'react';
import { Home, Layers, ShoppingBag, Car, Briefcase, Building2, Tag, HelpCircle, PhoneCall, MapPin } from 'lucide-react';

/**
 * Normalizes bottom nav variant values
 * Supports 4 clean variants without any embedded WhatsApp button.
 */
const normalizeVariant = (val) => {
  if (!val) return 'floating_dock';
  const clean = String(val).toLowerCase().trim();
  if (clean === 'curved' || clean === 'fixed_curved') return 'fixed_curved';
  if (clean === 'bubble' || clean === 'floating_bubble' || clean === 'detached_bubble' || clean === 'detached_floating_bubble') return 'floating_bubble';
  if (clean === 'box' || clean === 'modern-box' || clean === 'floating_box') return 'floating_box';
  return 'floating_dock';
};

/**
 * Industry Catalog Icon & Label Selector
 */
const getIndustryCatalogMeta = (industry) => {
  switch (industry) {
    case 'automotive':
      return { label: 'Armada', icon: Car, href: '#fleet' };
    case 'ecommerce':
      return { label: 'Katalog', icon: ShoppingBag, href: '#fleet' };
    case 'services':
      return { label: 'Layanan', icon: Briefcase, href: '#fleet' };
    case 'realestate':
      return { label: 'Properti', icon: Building2, href: '#fleet' };
    default:
      return { label: 'Katalog', icon: Layers, href: '#fleet' };
  }
};

/**
 * Mobile Bottom Navigation Bar (100% Clean - No WhatsApp button)
 * Purely focused on frictionless page navigation across all 4 modern styles.
 */
export const MobileBottomNav = ({
  styleVariant = 'floating_dock', // 'floating_dock' | 'fixed_curved' | 'floating_bubble' | 'floating_box'
  variant, // Alias
  industry = 'automotive',
  phone = '+62 812-8899-0011',
  isAlwaysVisible = false, // When used inside admin mobile preview mockup
  onVisibilityChange
}) => {
  const [visible, setVisible] = useState(isAlwaysVisible);
  const [activeTab, setActiveTab] = useState('home');

  const resolvedVariant = normalizeVariant(variant || styleVariant);
  const catalogMeta = getIndustryCatalogMeta(industry);

  useEffect(() => {
    if (isAlwaysVisible) {
      setVisible(true);
      if (onVisibilityChange) onVisibilityChange(true);
      return;
    }

    const handleScroll = () => {
      // Emerges dynamically after scrolling down 100px
      const isScrolled = window.scrollY > 100;
      setVisible(isScrolled);
      if (onVisibilityChange) onVisibilityChange(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAlwaysVisible, onVisibilityChange]);

  if (!visible) return null;

  // Clean 4-5 Navigation Items (Purely page sections, NO WhatsApp)
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home, href: '#' },
    { id: 'catalog', label: catalogMeta.label, icon: catalogMeta.icon, href: catalogMeta.href },
    { id: 'pricing', label: 'Tarif', icon: Tag, href: '#pricing' },
    { id: 'faq', label: 'Cara Pesan', icon: HelpCircle, href: '#contact' },
    { id: 'contact', label: 'Kontak', icon: PhoneCall, href: phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#contact' }
  ];

  /* -------------------------------------------------------------
   * Varian A: Floating Dock Pill (Melayang Rounded-Full)
   * ------------------------------------------------------------- */
  if (resolvedVariant === 'floating_dock') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 min-w-0 w-auto select-none animate-bounce-in">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-xl py-2 px-3 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 font-extrabold bg-blue-50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-blue-600' : 'text-slate-500'}`} />
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </aside>
    );
  }

  /* -------------------------------------------------------------
   * Varian B: Fixed Curved Scoop (Melengkung di Kanan, Kiri, dan Bawah Tanpa Menyentuh Lingkaran Menu Aktif)
   * ------------------------------------------------------------- */
  if (resolvedVariant === 'fixed_curved') {
    const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === activeTab));
    // Coordinate calculation in 375-width SVG grid:
    const tabWidth = 75; // 375 / 5 tabs = 75
    const cx = activeIndex * tabWidth + 37.5;
    const curveRadius = 36;
    const dipDepth = 50;
    const barTop = 14;

    const scoopPath = `M 0 ${barTop} L ${cx - curveRadius} ${barTop} C ${cx - 20} ${barTop}, ${cx - 20} ${dipDepth}, ${cx} ${dipDepth} C ${cx + 20} ${dipDepth}, ${cx + 20} ${barTop}, ${cx + curveRadius} ${barTop} L 375 ${barTop} L 375 72 L 0 72 Z`;
    const scoopBorder = `M 0 ${barTop} L ${cx - curveRadius} ${barTop} C ${cx - 20} ${barTop}, ${cx - 20} ${dipDepth}, ${cx} ${dipDepth} C ${cx + 20} ${dipDepth}, ${cx + 20} ${barTop}, ${cx + curveRadius} ${barTop} L 375 ${barTop}`;

    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-0 inset-x-0 z-40 min-w-0 select-none pointer-events-none">
        <div className="relative max-w-md mx-auto h-[68px]">
          {/* Authentic SVG Scoop Background with smooth curved depression around active circle */}
          <svg
            className="absolute bottom-0 inset-x-0 w-full h-[72px] filter drop-shadow-[0_-3px_12px_rgba(0,0,0,0.08)] pointer-events-auto"
            viewBox="0 0 375 72"
            preserveAspectRatio="none"
          >
            {/* White solid bar with scoop cut-out */}
            <path d={scoopPath} fill="#FFFFFF" />
            {/* Top border following the contour of the scoop */}
            <path d={scoopBorder} stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
          </svg>

          {/* Floating Detached Active Circle - Suspended with clearance in the curved cutout without touching */}
          <div
            className="absolute z-20 pointer-events-auto transition-all duration-300 ease-out"
            style={{
              left: `${(activeIndex * 20) + 10}%`,
              top: '-10px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/35 border-3 border-white transform transition-transform active:scale-95">
              {(() => {
                const ActiveIcon = navItems[activeIndex]?.icon || Home;
                return <ActiveIcon className="w-5 h-5 stroke-[2.5]" />;
              })()}
            </div>
          </div>

          {/* Interactive Navigation Tab Links */}
          <div className="relative z-10 flex items-center justify-around h-full pt-3 px-1 pointer-events-auto">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeIndex === idx;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className="flex-1 flex flex-col items-center justify-end pb-2 h-full text-slate-500 transition-colors"
                >
                  {/* For inactive items: show icon normally. For active item: leave space for floating circle */}
                  <div className={`h-5 flex items-center justify-center transition-opacity duration-200 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <span
                    className={`text-[10px] mt-1 tracking-tight transition-colors duration-200 ${
                      isActive ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </aside>
    );
  }

  /* -------------------------------------------------------------
   * Varian C: Floating Bubble Indicator (Lingkaran Bola Melayang Aktif)
   * ------------------------------------------------------------- */
  if (resolvedVariant === 'floating_bubble') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 min-w-0 select-none">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl py-2 px-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className="relative flex flex-col items-center justify-center flex-1 py-1"
              >
                {isActive ? (
                  <div className="w-10 h-10 -mt-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/35 border-3 border-white transition-all">
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <Icon className="w-5 h-5 text-slate-500" />
                )}
                <span className={`text-[10px] mt-1 transition-colors ${isActive ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </aside>
    );
  }

  /* -------------------------------------------------------------
   * Varian D: Floating Modern Box (Badge Kotak Rounded Melayang)
   * ------------------------------------------------------------- */
  return (
    <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 min-w-0 select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-1.5 flex items-center justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
};

export default MobileBottomNav;
