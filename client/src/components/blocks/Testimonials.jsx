import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials({ props = {} }) {
  const {
    badge = 'Ulasan Pelanggan',
    title = 'Apa Kata Mereka yang Telah Menggunakan Layanan Kami?',
    subtitle = 'Ratusan ulasan bintang 5 dari pelanggan perorangan, pebisnis, hingga instansi.',
    reviews = [],
  } = props;

  return (
    <section id="testimonials" className="py-20 bg-white border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-3">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between relative hover:border-slate-400 transition-all duration-300 shadow-xs"
            >
              <Quote className="w-8 h-8 text-slate-200 absolute top-6 right-6" />

              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(Math.min(5, Math.max(1, Math.round(Number(rev.rating) || 5))))].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] text-slate-500">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
