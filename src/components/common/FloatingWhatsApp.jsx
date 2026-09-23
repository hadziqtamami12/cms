import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

/**
 * High-Conversion Floating WhatsApp Quick Contact Widget
 * Automatically harmonizes with Mobile Bottom Nav by dynamically
 * shifting upwards (bottom-20 / mb-16) when the bottom nav is active.
 */
export const FloatingWhatsApp = ({
  whatsapp = '6281288990011',
  brandName = 'Customer Support',
  messageTemplate = 'Halo, saya ingin bertanya informasi lebih lanjut.',
  bottomNavVisible = false,
  enabled = true
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  if (!enabled || !whatsapp) return null;

  const cleanWaNumber = String(whatsapp).replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(messageTemplate)}`;

  return (
    <div
      className={`fixed right-4 z-40 transition-all duration-300 ease-in-out flex flex-col items-end pointer-events-auto ${
        bottomNavVisible ? 'bottom-20 md:bottom-6' : 'bottom-6'
      }`}
    >
      {/* Optional Proactive Chat Greeting Tooltip */}
      {showTooltip && (
        <div className="relative mb-2.5 max-w-[240px] bg-white text-slate-800 p-3 rounded-2xl rounded-br-xs shadow-xl border border-slate-100 flex items-start gap-2 animate-bounce-in">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-[11px] text-slate-900 truncate">
                {brandName}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Ada yang bisa kami bantu? Chat kami via WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md transition-colors"
            title="Tutup pesan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp"
        className="group relative flex items-center gap-2.5 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-600/35 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200" />
          </span>
        </span>
        <span className="hidden sm:inline font-bold text-xs tracking-tight">
          Chat WhatsApp
        </span>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
