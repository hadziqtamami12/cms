import React, { useState } from 'react';
import WhatsAppChatModal from './WhatsAppChatModal';

/**
 * Official WhatsApp SVG Icon Component
 */
const WhatsAppOfficialIcon = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.49 7.02 9.71C7.02 10.93 7.91 12.11 8.03 12.27C8.16 12.44 9.77 14.92 12.23 15.98C12.82 16.23 13.27 16.38 13.63 16.5C14.22 16.68 14.76 16.66 15.19 16.6C15.67 16.53 16.67 15.99 16.88 15.41C17.09 14.82 17.09 14.32 17.02 14.21C16.96 14.1 16.8 14.04 16.55 13.92C16.31 13.79 15.11 13.2 14.89 13.12C14.66 13.04 14.5 13 14.33 13.25C14.17 13.5 13.7 14.1 13.56 14.26C13.42 14.43 13.28 14.45 13.03 14.33C12.79 14.2 12.01 13.95 11.08 13.12C10.36 12.47 9.87 11.67 9.73 11.43C9.59 11.18 9.71 11.05 9.84 10.92C9.95 10.81 10.08 10.64 10.21 10.49C10.34 10.33 10.38 10.22 10.46 10.05C10.54 9.89 10.5 9.74 10.44 9.62C10.38 9.5 9.91 8.34 9.71 7.86C9.52 7.39 9.32 7.45 9.17 7.44C9.03 7.43 8.87 7.43 8.7 7.43C8.53 7.43 8.37 7.33 8.53 7.33Z" />
  </svg>
);

/**
 * Clean & Professional Floating WhatsApp Contact Button
 * Always visible, static clean design with smooth hover elevation.
 */
export const FloatingWhatsApp = ({
  whatsapp = '6281288990011',
  brandName = 'Customer Support',
  messageTemplate = 'Halo, saya ingin bertanya seputar armada dan reservasi.',
  welcomeMessage,
  bottomNavVisible = false,
  enabled = true,
  actionType = 'popup' // 'popup' | 'direct'
}) => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // If explicitly disabled, don't render
  if (enabled === false) return null;

  const rawPhone = typeof whatsapp === 'string' ? whatsapp : (whatsapp?.phone || '6281288990011');
  const cleanWaNumber = String(rawPhone).replace(/[^0-9]/g, '') || '6281288990011';
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(messageTemplate || 'Halo, saya ingin bertanya seputar reservasi.')}`;

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
        className={`fixed right-4 sm:right-6 z-50 transition-all duration-300 ease-in-out flex flex-col items-end pointer-events-auto select-none ${
          bottomNavVisible ? 'bottom-[88px] sm:bottom-6' : 'bottom-5 sm:bottom-6'
        }`}
      >
        <button
          type="button"
          onClick={handleClick}
          aria-label="Hubungi WhatsApp"
          className="group flex items-center justify-center gap-2.5 h-13 w-13 sm:h-auto sm:w-auto p-3 sm:px-4.5 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-950/25 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ring-2 ring-white/20"
        >
          <WhatsAppOfficialIcon className="w-6 h-6 shrink-0 fill-white drop-shadow-sm" />
          <span className="hidden sm:inline font-semibold text-xs tracking-wide">
            Chat WhatsApp
          </span>
        </button>
      </div>

      {/* WhatsApp Chat Popup Modal */}
      <WhatsAppChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        phone={cleanWaNumber}
        brandName={brandName}
        welcomeMessage={welcomeMessage}
      />
    </>
  );
};

export default FloatingWhatsApp;
