import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import WhatsAppChatModal from './WhatsAppChatModal';

/**
 * Compact & Responsive Floating WhatsApp Quick Contact Widget
 * Sized appropriately across mobile and desktop without dominating the screen.
 * Automatically shifts up above mobile bottom nav bar when active.
 */
export const FloatingWhatsApp = ({
  whatsapp = '6281288990011',
  brandName = 'Customer Support',
  messageTemplate = 'Halo, saya ingin bertanya informasi lebih lanjut.',
  welcomeMessage,
  bottomNavVisible = false,
  enabled = true,
  actionType = 'popup' // 'popup' | 'direct'
}) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  if (!enabled || !whatsapp) return null;

  const cleanWaNumber = String(whatsapp).replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(messageTemplate)}`;

  const handleClick = (e) => {
    e.preventDefault();
    if (actionType === 'popup') {
      setIsChatModalOpen(true);
    } else {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div
        className={`fixed right-3 sm:right-6 z-40 transition-all duration-300 ease-in-out flex flex-col items-end pointer-events-auto select-none ${
          bottomNavVisible ? 'bottom-[76px] sm:bottom-6' : 'bottom-4 sm:bottom-6'
        }`}
      >
        {/* Sleek & Compact Proactive Chat Greeting Tooltip */}
        {showTooltip && (
          <div className="relative mb-2 max-w-[185px] sm:max-w-[210px] bg-white/95 backdrop-blur-md text-slate-800 p-2 sm:p-2.5 rounded-xl rounded-br-xs shadow-md border border-slate-200/80 flex items-start gap-1.5 animate-bounce-in">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-extrabold text-[10px] sm:text-[11px] text-slate-900 truncate">
                  {brandName}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5 leading-snug">
                Ada yang bisa kami bantu? Chat kami via WA.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md transition-colors shrink-0"
              title="Tutup pesan"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Compact Responsive Floating Button */}
        <button
          type="button"
          onClick={handleClick}
          aria-label="Hubungi WhatsApp"
          className="group relative flex items-center justify-center gap-2 h-11 w-11 sm:h-auto sm:w-auto sm:px-3.5 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-md shadow-emerald-600/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="relative flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200" />
            </span>
          </span>
          <span className="hidden sm:inline font-bold text-[11px] tracking-tight">
            Chat WA
          </span>
        </button>
      </div>

      {/* WordPress-style Chat Popup Modal */}
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

export default FloatingWhatsApp;
