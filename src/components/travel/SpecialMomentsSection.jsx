import React from 'react';
import { Sparkles, Heart, Crown, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

/**
 * Special Moments & Private Trips Section
 * Caters to Wedding Car, Corporate VIP delegations, and Private luxury convos
 */
export const SpecialMomentsSection = ({
  specialMoments = [],
  whatsapp = '6281288990011',
  brandName = 'Royal Fleet'
}) => {
  if (!specialMoments || specialMoments.length === 0) return null;

  const cleanWa = String(whatsapp).replace(/[^0-9]/g, '');

  return (
    <section id="special-moments" className="space-y-10 sm:space-y-14">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Layanan Momen Spesial & VVIP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Sempurnakan Hari Istimewa Anda dengan Layanan Armada Eksklusif
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Dari mobil pengantin bertabur bunga hingga delegasi korporasi bertaraf internasional, nikmati standar layanan premium bergaransi kenyamanan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {specialMoments.map((moment, idx) => {
          const bookingUrl = `https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(brandName)},%20saya%20tertarik%20konsultasi%20layanan%20${encodeURIComponent(moment.title)}.`;

          return (
            <div
              key={moment.id || idx}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
            >
              {/* Media Container */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={moment.image}
                  alt={moment.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{moment.badge || 'Layanan Eksklusif'}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-amber-300 font-mono text-xs font-bold block mb-1">
                    {moment.starting_price}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {moment.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800">
                    {moment.subtitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {moment.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Driver Berjas Resmi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dekorasi Bunga Segar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Standar Kebersihan 100%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Jaminan Tepat Waktu</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Estimasi Biaya</span>
                    <span className="text-base font-extrabold text-slate-900">{moment.starting_price}</span>
                  </div>

                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
                  >
                    <span>{moment.ctaText || 'Konsultasi Sekarang'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpecialMomentsSection;
