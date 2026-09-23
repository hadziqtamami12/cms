import React, { useState, useEffect } from 'react';
import { Home, Layers, Tag, PhoneCall, MessageCircle } from 'lucide-react';

/**
 * Normalizes bottom nav variant values
 */
const normalizeVariant = (val) => {
  if (!val) return 'floating_dock';
  const clean = String(val).toLowerCase().trim();
  if (clean === 'dock' || clean === 'floating_dock') return 'floating_dock';
  if (clean === 'curved' || clean === 'fixed_curved') return 'fixed_curved';
  if (clean === 'bubble' || clean === 'floating_bubble') return 'floating_bubble';
  if (clean === 'box' || clean === 'modern-box' || clean === 'floating_box') return 'floating_box';
  return 'floating_dock';
};

export const MobileBottomNav = ({
  styleVariant = 'floating_dock', // 'floating_dock' | 'fixed_curved' | 'floating_bubble' | 'floating_box'
  variant, // Alias
  whatsapp,
  phone,
  isAlwaysVisible = false, // When used inside admin mobile preview mockup
  onVisibilityChange
}) => {
  const [visible, setVisible] = useState(isAlwaysVisible);
  const [activeTab, setActiveTab] = useState('home');

  const resolvedVariant = normalizeVariant(variant || styleVariant);

  useEffect(() => {
    if (isAlwaysVisible) {
      setVisible(true);
      if (onVisibilityChange) onVisibilityChange(true);
      return;
    }

    const handleScroll = () => {
      // Emerges dynamically after scrolling down 120px
      const isScrolled = window.scrollY > 120;
      setVisible(isScrolled);
      if (onVisibilityChange) onVisibilityChange(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAlwaysVisible, onVisibilityChange]);

  if (!visible) return null;

  const navItems = [
    { id: 'home', label: 'Utama', icon: Home, href: '#' },
    { id: 'catalog', label: 'Katalog', icon: Layers, href: '#fleet' },
    { id: 'rates', label: 'Tarif', icon: Tag, href: '#pricing' },
    { id: 'call', label: 'Telepon', icon: PhoneCall, href: phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#contact' },
    {
      id: 'wa',
      label: 'WhatsApp',
      icon: MessageCircle,
      href: whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#contact',
      isPrimary: true
    }
  ];

  /* -------------------------------------------------------------
   * Varian A: Floating Dock (Melayang dengan padding rounded-full)
   * Dock melayang dengan padding kapsul (rounded-full), berjarak dari tepi bawah
   * (bottom-4 inset-x-4 max-w-md mx-auto), berlatar putih bersih dengan bayangan lembut (shadow-lg).
   * ------------------------------------------------------------- */
  if (resolvedVariant === 'floating_dock') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 animate-bounce-in min-w-0">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-lg py-2 px-3 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
                  item.isPrimary
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30 px-4'
                    : isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive && !item.isPrimary ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </a>
            );
          })}
        </div>
      </aside>
    );
  }

  /* -------------------------------------------------------------
   * Varian B: Fixed Curved (Menempel penuh di dasar layar bottom-0 inset-x-0)
   * Berlatar putih dengan lengkungan halus ke atas (curved scoop) khusus di atas ikon tab aktif.
   * ------------------------------------------------------------- */
  if (resolvedVariant === 'fixed_curved') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-xl min-w-0">
        <div className="relative flex items-center justify-around py-2 px-2 max-w-md mx-auto">
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
                {isActive && (
                  <div className="absolute -top-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-4 border-white transition-all transform scale-110">
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                <div className={isActive ? 'opacity-0 h-5' : 'flex flex-col items-center'}>
                  <Icon className="w-5 h-5 text-slate-500" />
                </div>
                <span
                  className={`text-[10px] mt-1 transition-colors ${
                    isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
                  }`}
                >
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
   * Varian C: Floating Bubble Indicator (Lingkaran bola mengambang terangkat)
   * Bar bawah putih bersih di mana item aktif memiliki indikator lingkaran bola mengambang (floating bubble)
   * yang terangkat sedikit keluar dari garis bar navigasi.
   * ------------------------------------------------------------- */
  if (resolvedVariant === 'floating_bubble') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 min-w-0">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg py-2 px-2 flex items-center justify-around">
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
                  <div className="w-10 h-10 -mt-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/35 transition-all bubble-active-circle border-2 border-white">
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className="w-5 h-5 text-slate-500" />
                )}
                <span
                  className={`text-[10px] mt-1 transition-colors ${
                    isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
                  }`}
                >
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
   * Varian D: Floating Modern Box (Badge kotak rounded mengambang)
   * Bar bawah modern di mana menu aktif ditandai kotak rounded mengambang dengan aksen warna primer.
   * ------------------------------------------------------------- */
  return (
    <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 min-w-0">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg p-1.5 flex items-center justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                item.isPrimary
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
};

export default MobileBottomNav;
