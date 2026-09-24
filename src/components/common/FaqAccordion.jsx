import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

/**
 * Interactive FAQ Accordion Component
 * Displays dynamic FAQ with smooth animation and WhatsApp inquiry fallback.
 */
export const FaqAccordion = ({
  faqs = [],
  whatsapp = '6281288990011',
  brandName = 'Customer Support'
}) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  const cleanWa = String(whatsapp).replace(/[^0-9]/g, '');

  const toggleItem = (idx) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="space-y-10 sm:space-y-14">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Pertanyaan Umum (FAQ)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Hal yang Kerap Ditanyakan Seputar Layanan Kami
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Temukan jawaban instan seputar syarat rental lepas kunci, durasi pemakaian, asuransi, hingga cara pembayaran.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'border-blue-500 bg-white shadow-sm ring-1 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`p-1.5 rounded-xl border transition-transform duration-200 shrink-0 ${
                    isOpen
                      ? 'border-blue-200 bg-blue-50 text-blue-600 rotate-180'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-fade-in space-y-3">
                  <p>{faq.a}</p>
                  {faq.image && (
                    <div className="mt-3 rounded-xl overflow-hidden max-w-md border border-slate-200 shadow-2xs">
                      <img
                        src={faq.image}
                        alt={faq.q}
                        className="w-full h-auto object-cover max-h-64"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help CTA Box */}
      <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
            Punya Pertanyaan Khusus Lainnya?
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Tim customer service kami siap membantu Anda 24 jam setiap hari melalui chat WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(brandName)},%20saya%20ingin%20bertanya%20seputar%20layanan`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Tanya via WhatsApp</span>
        </a>
      </div>
    </section>
  );
};

export default FaqAccordion;
