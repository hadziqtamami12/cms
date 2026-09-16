import React from 'react';
import { ShieldCheck, Clock, UserCheck, Percent, Zap, Award } from 'lucide-react';

const iconMap = {
  'shield-check': ShieldCheck,
  clock: Clock,
  'user-check': UserCheck,
  'badge-percent': Percent,
  zap: Zap,
  award: Award,
};

export default function FeaturesGrid({ props = {} }) {
  const {
    badge = 'Keunggulan Kami',
    title = 'Mengapa Ribuan Pelanggan Memilih Kami?',
    subtitle = 'Standar pelayanan prima dengan fokus pada kepuasan, keamanan, dan transparansi harga.',
    items = [],
  } = props;

  return (
    <section id="features" className="py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8 scroll-mt-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex flex-col items-start shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 mb-5">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
