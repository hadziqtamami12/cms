import React from 'react';
import { Briefcase, Award, CheckCircle2, Phone, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const ServicesThemeRenderer = ({ themeId, config }) => {
  const { items = [], features = [], testimonials = [], faqs = [], whatsapp, phone } = config;

  return (
    <div className="space-y-24 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ----------------- SERVICE CATALOG / SPECIALIZATIONS ----------------- */}
      <section id="fleet" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Layanan & Solusi Terpercaya</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {themeId === 'legal-law-firm' ? 'Keahlian Hukum Komersial & Litigasi' :
             themeId === 'tech-consulting' ? 'Layanan Transformasi Digital & Cloud' :
             themeId === 'accounting-tax' ? 'Konsultasi Pajak & Audit Keuangan Resmi' :
             themeId === 'beauty-salon-spa' ? 'Treatment Estetika & Relaksasi Eksklusif' :
             themeId === 'medical-dental' ? 'Perawatan Gigi & Kesehatan Keluarga' :
             themeId === 'auto-repair' ? 'Servis Bengkel Cepat & Detailing Nano Keramik' :
             'Layanan Profesional Bersertifikat'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Didukung oleh tim tenaga ahli berlisensi resmi dengan pengalaman puluhan tahun di bidangnya.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
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
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                      {svc.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{svc.title}</h3>
                  <div className="space-y-1.5 pt-2">
                    {svc.specs?.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Estimasi Biaya</span>
                  <div className="text-base font-extrabold text-blue-600">{svc.price}</div>
                </div>

                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20ingin%20konsultasi%20layanan%20${encodeURIComponent(svc.title)}` : '#contact'}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Konsultasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- PROFESSIONAL CREDENTIALS / STATS ----------------- */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-3xl sm:text-4xl font-black text-blue-400">15+</div>
          <div className="text-xs sm:text-sm text-slate-300 mt-1">Tahun Pengalaman Industri</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black text-blue-400">2.500+</div>
          <div className="text-xs sm:text-sm text-slate-300 mt-1">Klien Korporat & Individu</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black text-blue-400">100%</div>
          <div className="text-xs sm:text-sm text-slate-300 mt-1">Kerahasiaan Data Terjamin</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black text-blue-400">A+</div>
          <div className="text-xs sm:text-sm text-slate-300 mt-1">Akreditasi & Sertifikasi Resmi</div>
        </div>
      </section>
    </div>
  );
};

export default ServicesThemeRenderer;
