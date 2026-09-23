import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ChevronRight, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar = ({ brandName, phone, whatsapp, tagline }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className={`font-bold text-lg sm:text-xl tracking-tight transition-colors ${
                isScrolled ? 'text-slate-900' : 'text-slate-900 drop-shadow-sm'
              }`}>
                {brandName || 'Royal Fleet'}
              </span>
              <span className="hidden sm:block text-xs text-slate-500 font-medium">
                {tagline || 'Enterprise Service Partner'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#fleet"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Katalog Pilihan
            </a>
            <a
              href="#features"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Keunggulan
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Paket Tarif
            </a>
            <a
              href="#testimonials"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Testimoni
            </a>
            <a
              href="#faq"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Desktop Direct Call & WhatsApp Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100/80 transition-all border border-slate-200"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{phone}</span>
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20tertarik%20dengan%20layanan%20Anda`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat WhatsApp</span>
              </a>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-emerald-600 text-white"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 bg-white rounded-2xl border border-slate-200 shadow-xl p-5 space-y-4">
            <nav className="flex flex-col gap-3">
              <a
                href="#fleet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-2 rounded-lg hover:bg-slate-50"
              >
                <span>Katalog Pilihan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-2 rounded-lg hover:bg-slate-50"
              >
                <span>Keunggulan Layanan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-2 rounded-lg hover:bg-slate-50"
              >
                <span>Paket & Tarif</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-2 rounded-lg hover:bg-slate-50"
              >
                <span>FAQ & Bantuan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </nav>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 font-semibold text-slate-800"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Telepon: {phone}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
