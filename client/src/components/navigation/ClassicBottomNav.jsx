import React, { useState, useEffect } from 'react';
import { Home, Grid, Phone, MessageSquare } from 'lucide-react';

export default function ClassicBottomNav({ whatsappNumber = '6281234567890' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      // Hide only when at the top of beranda (<= 30px). As soon as user scrolls, show immediately!
      setVisible(currentScrollY > 30);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHidden = !visible;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-xl pb-safe transition-all duration-300 transform ${
        isHidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      <nav className="flex items-center justify-around h-14 px-2 text-[10px]">
        <a href="/" className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition-colors">
          <Home className="w-5 h-5" />
          <span className="mt-1 font-medium">Beranda</span>
        </a>
        <a href="#features" className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition-colors">
          <Grid className="w-5 h-5" />
          <span className="mt-1 font-medium">Layanan</span>
        </a>
        <a href="/?contact=true" className="flex flex-col items-center text-slate-900 font-bold transition-colors">
          <Phone className="w-5 h-5" />
          <span className="mt-1 font-medium">Kontak</span>
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="mt-1 font-medium">WhatsApp</span>
        </a>
      </nav>
    </div>
  );
}
