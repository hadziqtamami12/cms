import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';

export default function CtaBanner({ props = {} }) {
  const {
    badge = 'Booking Sekarang',
    title = 'Siap Menikmati Perjalanan Terbaik Anda?',
    subtitle = 'Dapatkan penawaran harga spesial untuk reservasi hari ini. Konsultasikan armada Anda bersama tim kami via WhatsApp.',
    buttonText = 'Chat WhatsApp Sekarang (24 Jam)',
    buttonLink = 'https://wa.me/6281234567890',
    phoneText = '0812-3456-7890',
  } = props;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden transition-colors duration-200">
      <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-14 bg-white border border-slate-200 shadow-sm text-center relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold mb-6">
          {badge}
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 max-w-2xl mx-auto leading-tight">
          {title}
        </h2>

        <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm transition-all duration-200 shadow-xs flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-current text-white" />
            <span>{buttonText}</span>
          </a>

          {phoneText && (
            <a
              href={`tel:${phoneText.replace(/[^0-9]/g, '')}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-slate-700" />
              <span>{phoneText}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
