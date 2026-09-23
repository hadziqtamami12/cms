import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCheck, Sparkles } from 'lucide-react';

/**
 * Authentic WordPress-style WhatsApp Web Interactive Chat Popup Modal
 * Features:
 * - Verified CS avatar with pulsing online indicator
 * - Official WhatsApp doodle wallpaper chat body
 * - Authentic incoming chat bubble with double blue tick
 * - Quick-reply conversation starter chips
 * - Direct dispatch to WhatsApp official API (wa.me)
 */
export const WhatsAppChatModal = ({
  isOpen = false,
  onClose,
  phone = '6281288990011',
  brandName = 'Customer Support Official',
  welcomeMessage = 'Halo kak! Ada yang bisa kami bantu seputar produk, armada, atau reservasi Anda hari ini? Silakan pilih opsi cepat di bawah atau ketik pesan Anda 😊',
  quickReplies = [
    '🚗 Cek ketersediaan unit hari ini',
    '💰 Info daftar tarif & promo terbaru',
    '📋 Cara booking / pemesanan instan',
    '📍 Lokasi kantor & jam operasional'
  ]
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [selectedQuickReply, setSelectedQuickReply] = useState('');

  if (!isOpen) return null;

  const cleanPhone = String(phone).replace(/[^0-9]/g, '');

  const handleSendMessage = (textToSend) => {
    const message = textToSend || customMessage || selectedQuickReply || 'Halo, saya ingin bertanya informasi lebih lanjut.';
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (onClose) onClose();
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 pointer-events-auto w-full max-w-full overflow-x-hidden">
      {/* Backdrop on Mobile & Desktop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Main Chat Popup Container */}
      <div
        className="relative w-full sm:w-[380px] max-w-full bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 animate-bounce-in min-w-0"
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header: WhatsApp Official Green Theme */}
        <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden select-none">
          <div className="flex items-center gap-3 min-w-0">
            {/* CS Avatar with pulsing online badge */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-base text-white shadow-inner">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#075E54] rounded-full animate-pulse" />
            </div>

            {/* CS Details */}
            <div className="min-w-0 truncate">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white truncate leading-tight">
                  {brandName}
                </h3>
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-100/90 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                <span className="truncate">Online • Biasanya membalas cepat</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0 ml-2"
            aria-label="Tutup jendela chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body: Authentic WhatsApp Pattern Background */}
        <div
          className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[220px] max-h-[360px] bg-[#ECE5DD] relative"
          style={{
            backgroundImage: `radial-gradient(#cfc6bc 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        >
          {/* Date stamp pill */}
          <div className="flex justify-center select-none">
            <span className="bg-white/80 backdrop-blur-xs text-slate-500 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200/50">
              Hari Ini
            </span>
          </div>

          {/* Official Incoming Chat Bubble */}
          <div className="flex items-start gap-2 max-w-[88%]">
            <div className="bg-white text-slate-800 rounded-2xl rounded-tl-xs p-3 shadow-md border border-slate-100 relative text-xs leading-relaxed">
              <span className="block font-bold text-[11px] text-[#075E54] mb-1">
                {brandName}
              </span>
              <p className="text-slate-700 whitespace-pre-line text-xs">
                {welcomeMessage}
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1 select-none">
                <span>{currentTime}</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Quick-reply chip recommendations */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-600 block flex items-center gap-1 select-none">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Pilih Pertanyaan Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedQuickReply(reply);
                    setCustomMessage(reply);
                  }}
                  className={`text-[11px] font-medium py-1.5 px-3 rounded-full text-left transition-all border ${
                    selectedQuickReply === reply
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200 shadow-2xs'
                  }`}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Input and Dispatch Button */}
        <div className="p-3 bg-white border-t border-slate-100 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Ketik pesan Anda di sini..."
              className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 transition-all shrink-0"
              title="Kirim ke WhatsApp"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

          {/* Quick Dispatch CTA Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:scale-98 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mulai Chat Sekarang via WhatsApp</span>
          </button>

          <p className="text-[10px] text-center text-slate-400">
            🔒 Terhubung langsung ke WhatsApp Layanan Pelanggan tanpa perantara.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatModal;
