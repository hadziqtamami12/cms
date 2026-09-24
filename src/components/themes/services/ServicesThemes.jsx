import React from 'react';
import { Briefcase, Award, CheckCircle2, Phone, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const ServicesThemeRenderer = ({ themeId, config }) => {
  const { items = [], features = [], testimonials = [], faqs = [], whatsapp, phone } = config;

  return (
    <div className="space-y-28 sm:space-y-36 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ----------------- SERVICE CATALOG / SPECIALIZATIONS ----------------- */}
      <section id="fleet" className="space-y-10 sm:space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Layanan & Solusi Terpercaya</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {themeId === 'legal-law-firm' ? 'Keahlian Hukum Komersial & Litigasi' :
             themeId === 'tech-consulting' ? 'Layanan Transformasi Digital & Cloud' :
             themeId === 'accounting-tax' ? 'Konsultasi Pajak & Audit Keuangan Resmi' :
             themeId === 'beauty-salon-spa' ? 'Treatment Estetika & Relaksasi Eksklusif' :
             themeId === 'medical-dental' ? 'Perawatan Gigi & Kesehatan Keluarga' :
             themeId === 'auto-repair' ? 'Servis Bengkel Cepat & Detailing Nano Keramik' :
             'Layanan Profesional Bersertifikat'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Didukung oleh tim tenaga ahli berlisensi resmi dengan pengalaman puluhan tahun di bidangnya.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {items.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {svc.badge && (
                    <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                      {svc.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{svc.title}</h3>
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    {svc.specs?.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Estimasi Biaya</span>
                  {Array.isArray(svc.pricing_tiers) && svc.pricing_tiers.length > 1 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {svc.pricing_tiers.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                          {t.label}: <span className="font-mono">{t.price}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg sm:text-xl font-black text-blue-600">{svc.price}</div>
                  )}
                </div>

                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20ingin%20konsultasi%20layanan%20${encodeURIComponent(svc.title)}` : '#contact'}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Konsultasi</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- PROFESSIONAL CREDENTIALS / STATS ----------------- */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center sm:text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 shadow-xl">
        <div className="space-y-1.5">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400">15+</div>
          <div className="text-xs sm:text-sm text-slate-300 font-medium">Tahun Pengalaman Industri</div>
        </div>
        <div className="space-y-1.5">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400">2.500+</div>
          <div className="text-xs sm:text-sm text-slate-300 font-medium">Klien Korporat & Individu</div>
        </div>
        <div className="space-y-1.5">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400">100%</div>
          <div className="text-xs sm:text-sm text-slate-300 font-medium">Kerahasiaan Data Terjamin</div>
        </div>
        <div className="space-y-1.5">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400">A+</div>
          <div className="text-xs sm:text-sm text-slate-300 font-medium">Akreditasi & Sertifikasi Resmi</div>
        </div>
      </section>
    </div>
  );
};

export default ServicesThemeRenderer;
