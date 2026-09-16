import React from 'react';
import { Check, MessageSquare } from 'lucide-react';

export default function PricingTable({ props = {} }) {
  const {
    badge = 'Paket Layanan',
    title = 'Pilihan Paket Sesuai Kebutuhan Anda',
    subtitle = 'Transparan, fleksibel, tanpa biaya tersembunyi dengan dukungan teknis penuh.',
    plans = [],
  } = props;

  return (
    <section id="pricing" className="py-20 bg-white px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold mb-3">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 flex flex-col transition-all duration-300 relative bg-white ${
                plan.highlight
                  ? 'border-2 border-slate-900 shadow-md md:-translate-y-1 ring-1 ring-slate-900/10'
                  : 'border border-slate-200/80 hover:border-slate-400 shadow-xs'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Paling Populer
                </span>
              )}

              <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-xs text-slate-500 mb-5">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6 pb-5 border-b border-slate-100">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{plan.price}</span>
                <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features?.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20tertarik%20paket%20${encodeURIComponent(plan.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
                  plan.highlight
                    ? 'bg-slate-900 hover:bg-black text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{plan.buttonText || 'Pilih Paket'}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
