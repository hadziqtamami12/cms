import React, { useState, useEffect } from 'react';
import { Home, Layers, ShoppingBag, Car, Briefcase, Building2, HelpCircle, PhoneCall, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import WhatsAppChatModal from './WhatsAppChatModal';

/**
 * Normalizes bottom nav variant values
 */
const normalizeVariant = (val) => {
  if (!val) return 'floating_dock';
  const clean = String(val).toLowerCase().trim();
  if (clean === 'dock' || clean === 'floating_dock') return 'floating_dock';
  if (clean === 'curved' || clean === 'fixed_curved') return 'fixed_curved';
  if (clean === 'detached_bubble' || clean === 'detached_floating_bubble') return 'detached_floating_bubble';
  if (clean === 'bubble' || clean === 'floating_bubble') return 'floating_bubble';
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

export const MobileBottomNav = ({
  styleVariant = 'floating_dock', // 'floating_dock' | 'fixed_curved' | 'floating_bubble' | 'detached_floating_bubble' | 'floating_box'
  variant, // Alias
  whatsapp = '6281288990011',
  phone = '+62 812-8899-0011',
  brandName = 'Customer Support Official',
  welcomeMessage,
  industry = 'automotive',
  waPosition = 'center', // 'center' | 'right'
  waAction = 'popup', // 'popup' | 'direct'
  isAlwaysVisible = false, // When used inside admin mobile preview mockup
  onVisibilityChange,
  showPulseBadge = true
}) => {
  const [visible, setVisible] = useState(isAlwaysVisible);
  const [activeTab, setActiveTab] = useState('home');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

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

  const cleanWaNumber = String(whatsapp || '').replace(/[^0-9]/g, '') || '6281288990011';
  const waDirectUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`Halo ${brandName}, saya ingin bertanya informasi lebih lanjut.`)}`;

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    if (waAction === 'popup') {
      setIsChatModalOpen(true);
    } else {
      window.open(waDirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!visible) return null;

  // Standardized 5 nav items: Home, Catalog, Center/WA, FAQ/How-to, Location/Contact
  const baseItems = [
    { id: 'home', label: 'Beranda', icon: Home, href: '#' },
    { id: 'catalog', label: catalogMeta.label, icon: catalogMeta.icon, href: catalogMeta.href },
    { id: 'faq', label: 'Cara Pesan', icon: HelpCircle, href: '#contact' },
    { id: 'location', label: 'Lokasi', icon: MapPin, href: '#contact' }
  ];

  const waItem = {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    isWhatsApp: true,
    onClick: handleWhatsAppClick
  };

  // Reorder items according to waPosition ('center' vs 'right')
  let itemsToRender = [];
  if (waPosition === 'center') {
    // 5 items: Home, Catalog, [WHATSAPP CENTER ACTION], FAQ, Location
    itemsToRender = [
      baseItems[0],
      baseItems[1],
      waItem,
      baseItems[2],
      baseItems[3]
    ];
  } else {
    // 5 items: Home, Catalog, FAQ, Location, [WHATSAPP RIGHT ACTION]
    itemsToRender = [
      baseItems[0],
      baseItems[1],
      baseItems[2],
      baseItems[3],
      waItem
    ];
  }

  return (
    <>
      {/* ========================================================
       * VARIANT: DETACHED CENTER FLOATING BUBBLE (FAB)
       * WA Button floats freely detached 14px-18px above the nav bar
       * with vibrant WhatsApp green (#25D366) and soft shadow glow
       * ======================================================== */}
      {resolvedVariant === 'detached_floating_bubble' && (
        <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 min-w-0 w-auto select-none">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl py-2 px-1 flex items-center justify-around">
            {itemsToRender.map((item) => {
              if (item.isWhatsApp) {
                return (
                  <div key="wa-center-fab" className="relative flex flex-col items-center justify-center flex-1">
                    {/* Detached Raised FAB */}
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="group -mt-8 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-xl shadow-emerald-600/35 border-4 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer relative"
                      aria-label="Hubungi WhatsApp CS"
                      title="Hubungi WhatsApp CS"
                    >
                      <MessageCircle className="w-6 h-6 stroke-[2.5]" />
                      {showPulseBadge && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-700 text-[9px] font-black text-white items-center justify-center border border-white">
                            1
                          </span>
                        </span>
                      )}
                    </button>
                    <span className="text-[10px] mt-1 font-bold text-emerald-700 tracking-tight">
                      Chat WA
                    </span>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
                  <span className={`text-[10px] mt-1 transition-colors ${isActive ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </aside>
      )}

      {/* ========================================================
       * VARIANT A: FLOATING DOCK (Capsule Pill Melayang)
       * ======================================================== */}
      {resolvedVariant === 'floating_dock' && (
        <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 min-w-0 w-auto select-none animate-bounce-in">
          <div className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-lg py-2 px-2.5 flex items-center justify-around">
            {itemsToRender.map((item) => {
              if (item.isWhatsApp) {
                return (
                  <button
                    key="wa-dock"
                    type="button"
                    onClick={item.onClick}
                    className="relative flex flex-col items-center justify-center py-1 px-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                    aria-label="Chat WhatsApp"
                  >
                    <div className="relative">
                      <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                      {showPulseBadge && (
                        <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-white animate-ping" />
                      )}
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight font-black">Chat WA</span>
                  </button>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all ${
                    isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </a>
              );
            })}
          </div>
        </aside>
      )}

      {/* ========================================================
       * VARIANT B: FIXED CURVED (Menempel Penuh dengan Notch Lengkung)
       * ======================================================== */}
      {resolvedVariant === 'fixed_curved' && (
        <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-xl min-w-0 select-none">
          <div className="relative flex items-center justify-around py-2 px-2 max-w-md mx-auto">
            {itemsToRender.map((item) => {
              if (item.isWhatsApp) {
                return (
                  <div key="wa-curved" className="relative flex flex-col items-center justify-center flex-1 py-1">
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="absolute -top-6 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 border-4 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                      aria-label="Chat WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                      {showPulseBadge && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white text-emerald-700 text-[8px] font-black rounded-full flex items-center justify-center shadow-xs">
                          !
                        </span>
                      )}
                    </button>
                    <div className="h-5" />
                    <span className="text-[10px] mt-1 text-emerald-700 font-black">
                      WhatsApp
                    </span>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className="relative flex flex-col items-center justify-center flex-1 py-1 text-slate-500"
                >
                  {isActive && (
                    <div className="absolute -top-5 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-3 border-white transition-all">
                      <Icon className="w-4 h-4" />
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
      )}

      {/* ========================================================
       * VARIANT C: FLOATING BUBBLE INDICATOR
       * ======================================================== */}
      {resolvedVariant === 'floating_bubble' && (
        <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 min-w-0 select-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg py-2 px-2 flex items-center justify-around">
            {itemsToRender.map((item) => {
              if (item.isWhatsApp) {
                return (
                  <button
                    key="wa-bubble"
                    type="button"
                    onClick={item.onClick}
                    className="relative flex flex-col items-center justify-center flex-1 py-1 text-emerald-700 font-bold cursor-pointer"
                  >
                    <div className="w-10 h-10 -mt-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 border-2 border-white transition-transform active:scale-95">
                      <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] mt-1 font-bold text-emerald-700">Chat WA</span>
                  </button>
                );
              }

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
                    <div className="w-9 h-9 -mt-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/35 border-2 border-white transition-all">
                      <Icon className="w-4 h-4" />
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
      )}

      {/* ========================================================
       * VARIANT D: FLOATING MODERN BOX
       * ======================================================== */}
      {resolvedVariant === 'floating_box' && (
        <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 min-w-0 select-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg p-1.5 flex items-center justify-between gap-1">
            {itemsToRender.map((item) => {
              if (item.isWhatsApp) {
                return (
                  <button
                    key="wa-box"
                    type="button"
                    onClick={item.onClick}
                    className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] mt-0.5 tracking-tight font-black">Chat WA</span>
                  </button>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                    isActive
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
      )}

      {/* Interactive WordPress-style WhatsApp Chat Popup Modal */}
      <WhatsAppChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        phone={whatsapp}
        brandName={brandName}
        welcomeMessage={welcomeMessage}
      />
    </>
  );
};

export default MobileBottomNav;
