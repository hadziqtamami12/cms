import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

export default function FloatingWhatsapp({ config = {}, isCanvasPreview = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(isCanvasPreview);

  useEffect(() => {
    if (isCanvasPreview) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      // Appear synchronously as soon as scrolling starts past hero (> 30px)
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentScrollY > 30) {
        setVisible(true);
      } else {
        setVisible(false);
        setIsOpen(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCanvasPreview]);

  const isExcludedRoute =
    !isCanvasPreview &&
    typeof window !== 'undefined' &&
    (window.location.pathname.includes('/builder') ||
      window.location.pathname.includes('/wp-admin') ||
      window.location.pathname.includes('/admin') ||
      window.location.pathname.includes('/setup') ||
      window.location.search.includes('builder='));

  if (config?.enabled === false || isExcludedRoute) return null;

  const phoneNumber = config.phoneNumber || '6281234567890';
  const agentName = config.agentName || 'Customer Care Ultra';
  const agentStatus = config.agentStatus || 'Online (Respon Cepat)';
  const greetingMessage = config.greetingMessage || 'Halo! Ada yang bisa kami bantu seputar sewa mobil atau informasi armada?';
  const defaultMessage = config.defaultMessage || 'Halo Admin, saya ingin reservasi/tanya ketersediaan armada mobil.';

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end transition-all duration-300 ${
        !visible ? 'translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      {/* Sleek Compact Chat Window */}
      {isOpen && (
        <div className="mb-2.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header WhatsApp Green */}
          <div className="bg-[#075E54] px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                  WA
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white leading-tight">{agentName}</h4>
                <p className="text-[10px] text-emerald-200 mt-0.5">{agentStatus}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-3.5 bg-[#ECE5DD]/40 space-y-2">
            <div className="bg-white p-3 rounded-xl rounded-tl-xs shadow-xs text-xs text-slate-800 leading-relaxed border border-slate-100">
              <p>{greetingMessage}</p>
              <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">Baru saja</span>
            </div>
          </div>

          {/* Chat Action Button */}
          <div className="p-2.5 bg-white border-t border-slate-100">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs py-2.5 px-3.5 rounded-xl shadow-xs transition-colors active:scale-98"
            >
              <Send className="w-3.5 h-3.5 fill-white" />
              <span>Buka Chat WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button - Compact Refined Official WhatsApp Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group relative border-2 border-white"
        aria-label="Chat WhatsApp"
        title="Chat WhatsApp 24 Jam"
      >
        {/* Subtle Online Badge */}
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></span>

        {/* WhatsApp Official SVG Icon */}
        <svg
          className="w-6 h-6 fill-white"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.3-.776.978-.952 1.178-.176.2-.352.226-.653.075s-1.27-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.15-.176.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.676-1.63-.927-2.233-.244-.587-.492-.508-.676-.517l-.576-.01c-.2 0-.527.075-.803.377-.276.3-1.054 1.03-1.054 2.512 0 1.482 1.079 2.913 1.229 3.114.15.2 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.086 1.78-.727 2.03-1.43.25-.703.25-1.305.175-1.43-.075-.126-.276-.201-.577-.351zM12.04 2c-5.464 0-9.91 4.446-9.91 9.91 0 1.75.457 3.456 1.325 4.965L2 22l5.253-1.378c1.455.794 3.093 1.213 4.787 1.213 5.464 0 9.91-4.446 9.91-9.91 0-5.464-4.446-9.91-9.91-9.91zm0 18.15c-1.487 0-2.946-.4-4.22-1.157l-.303-.18-3.136.823.837-3.056-.197-.314a8.19 8.19 0 01-1.258-4.356c0-4.542 3.695-8.237 8.237-8.237 4.542 0 8.237 3.695 8.237 8.237 0 4.542-3.695 8.237-8.237 8.237z" />
        </svg>
      </button>
    </div>
  );
}
