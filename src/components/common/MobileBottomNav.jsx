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
   * Varian B: Fixed Curved Scoop (Menempel Solid di Dasar Layar)
   * ------------------------------------------------------------- */
  if (resolvedVariant === 'fixed_curved') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-xl min-w-0 select-none">
        <div className="relative flex items-center justify-around py-2 px-2 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className="relative flex flex-col items-center justify-center flex-1 py-1 text-slate-500 transition-colors"
              >
                {isActive && (
                  <div className="absolute -top-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-4 border-white transition-all transform scale-105">
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                <div className={isActive ? 'opacity-0 h-5' : 'flex flex-col items-center'}>
                  <Icon className="w-5 h-5 text-slate-500" />
                </div>
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
