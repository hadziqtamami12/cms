import React, { useState, useEffect } from 'react';
import { Home, Layers, Tag, PhoneCall, MessageCircle } from 'lucide-react';

export const MobileBottomNav = ({
  styleVariant = 'dock', // 'dock' | 'curved' | 'bubble' | 'box'
  whatsapp,
  phone
}) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Emerges dynamically after scrolling down 150px
      if (window.scrollY > 150) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
   * OPSI A: Floating Dock (Melayang dengan padding rounded-full)
   * ------------------------------------------------------------- */
  if (styleVariant === 'dock') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-bounce-in">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-dock py-2 px-3 flex items-center justify-around">
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
   * OPSI B: Fixed Solid Curved (Menempel di bawah dengan curved scoop)
   * ------------------------------------------------------------- */
  if (styleVariant === 'curved') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-elevated">
        <div className="relative flex items-center justify-around py-2 px-2">
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
   * OPSI C: Floating Bubble Indicator (Lingkaran bubble naik ke atas)
   * ------------------------------------------------------------- */
  if (styleVariant === 'bubble') {
    return (
      <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-dock py-2 px-2 flex items-center justify-around">
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
                  <div className="w-10 h-10 -mt-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all bubble-active-circle">
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
   * OPSI D: Floating Modern Box (Badge kotak rounded mengambang)
   * ------------------------------------------------------------- */
  return (
    <aside aria-label="Navigasi Bawah Mobile" className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-dock p-1.5 flex items-center justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all ${
                item.isPrimary
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : isActive
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
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
