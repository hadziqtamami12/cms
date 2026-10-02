import React, { useState } from 'react';
import { X, Send, CheckCheck, Sparkles } from 'lucide-react';

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
 * Authentic WhatsApp Web Interactive Chat Popup Modal
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
            {/* CS Avatar */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-base text-white shadow-inner">
                <WhatsAppOfficialIcon className="w-6 h-6 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
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
