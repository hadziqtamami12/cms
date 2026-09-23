import React from 'react';
import { Home, Building2, MapPin, Maximize2, BedDouble, Bath, ArrowRight, ShieldCheck, Phone } from 'lucide-react';

export const RealEstateThemeRenderer = ({ themeId, config }) => {
  const { items = [], features = [], testimonials = [], faqs = [], whatsapp, phone } = config;

  return (
    <div className="space-y-24 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ----------------- PROPERTY LISTINGS GRID ----------------- */}
      <section id="fleet" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Listing Pilihan & Investasi Unggulan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {themeId === 'luxury-villa-penthouse' ? 'Koleksi Villa Mewah & Penthouse Eksklusif' :
             themeId === 'suburban-housing' ? 'Klaster Hunian Asri & Ramah Keluarga' :
             themeId === 'commercial-leasing' ? 'Sewa Ruang Kantor Grade-A & Ruko Strategis' :
             themeId === 'high-rise-apartment' ? 'Apartemen Modern di Jantung Kota' :
             themeId === 'smart-home-residence' ? 'Hunian Pintar Berteknologi IoT & Eco-Green' :
             themeId === 'industrial-warehouse' ? 'Kawasan Pergudangan Modern & Logistik' :
             'Properti Pilihan Nilai Investasi Terbaik'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Legalitas sertifikat SHM terjamin aman, siap huni, dan berlokasi di kawasan dengan apresiasi kapital tertinggi.
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {prop.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                      {prop.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold">
                    {prop.category || 'SHM / Hak Milik'}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{prop.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2">
                    {prop.specs?.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Harga Penawaran</span>
                  <div className="text-lg font-extrabold text-blue-600">{prop.price}</div>
                </div>

                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20tertarik%20dengan%20properti%20${encodeURIComponent(prop.title)}` : '#contact'}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Survey Lokasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- PROPERTY CONSULTATION BANNER ----------------- */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            Layanan Konsultasi Properti Gratis
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold">Konsultasikan KPR & Simulasi Cicilan Rumah Impian Anda</h3>
          <p className="text-slate-300 text-xs sm:text-sm">Bantuan pengurusan berkas ke bank rekanan hingga serah terima kunci tanpa biaya tersembunyi.</p>
        </div>
        <div className="shrink-0">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20ingin%20konsultasi%20KPR%20properti`}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all block text-center"
            >
              Hubungi Konsultan KPR
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default RealEstateThemeRenderer;
