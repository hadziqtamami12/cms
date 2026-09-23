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
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3.5'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3.5 group focus:outline-none">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className={`font-extrabold text-lg sm:text-xl tracking-tight transition-colors ${
                isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'
              }`}>
                {brandName || 'Royal Fleet'}
              </span>
              <span className={`hidden sm:block text-xs font-medium transition-colors ${
                isScrolled ? 'text-slate-500' : 'text-slate-200/90 drop-shadow-sm'
              }`}>
                {tagline || 'Enterprise Service Partner'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#fleet"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white drop-shadow-sm'
              }`}
            >
              Katalog Pilihan
            </a>
            <a
              href="#features"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white drop-shadow-sm'
              }`}
            >
              Keunggulan
            </a>
            <a
              href="#pricing"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white drop-shadow-sm'
              }`}
            >
              Paket Tarif
            </a>
            <a
              href="#testimonials"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white drop-shadow-sm'
              }`}
            >
              Testimoni
            </a>
            <a
              href="#faq"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white drop-shadow-sm'
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* Desktop Direct Call & WhatsApp Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  isScrolled
                    ? 'text-slate-700 hover:bg-slate-100/80 border-slate-200'
                    : 'text-white hover:bg-white/20 border-white/30 bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Phone className={`w-4 h-4 ${isScrolled ? 'text-slate-500' : 'text-white'}`} />
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
              className={`p-2 rounded-lg border transition-all focus:outline-none ${
                isScrolled
                  ? 'border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50'
                  : 'border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-5">
            <nav className="flex flex-col gap-2">
              <a
                href="#fleet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-3.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>Katalog Pilihan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-3.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>Keunggulan Layanan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-3.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>Paket & Tarif</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-slate-800 p-3.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>FAQ & Bantuan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl border border-slate-200 font-semibold text-slate-800 hover:bg-slate-50 transition-all"
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
