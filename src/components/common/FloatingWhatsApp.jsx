import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
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
          bottomNavVisible ? 'bottom-[92px] sm:bottom-6' : 'bottom-5 sm:bottom-6'
        }`}
      >
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
