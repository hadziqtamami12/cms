import React from 'react';
import { Utensils, Coffee, Clock, MapPin, Sparkles, Star, ArrowRight, Heart } from 'lucide-react';

export const FnbThemeRenderer = ({ themeId, config }) => {
  const { items = [], testimonials = [], faqs = [], whatsapp, phone } = config;

  return (
    <div className="space-y-24 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ----------------- HIGHLIGHT MENU SECTION ----------------- */}
      <section id="fleet" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Menu Spesial Koki</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {themeId === 'coffee-roastery' ? 'Signature Beans & Espresso Bar' :
             themeId === 'bistro-fine-dining' ? 'Chef Degustation & Fine Dining' :
             themeId === 'japanese-omakase' ? 'Fresh Omakase Sushi & Sashimi' :
             themeId === 'artisan-bakery' ? 'Freshly Baked Sourdough & Viennoiserie' :
             themeId === 'catering-banquet' ? 'Pilihan Menu Prasmanan & Catering Resepsi' :
             'Sajian Kuliner Terbaik Dari Bahan Pilihan'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dibuat fresh setiap hari dengan bahan-bahan organik dan resep legendaris koki berpengalaman.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={menu.image}
                    alt={menu.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {menu.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md">
                      {menu.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{menu.title}</h3>
                    <span className="font-extrabold text-amber-600 text-base">{menu.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kombinasi rasa autentik dengan bumbu rempah pilihan, disajikan hangat dan higienis.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20mau%20pesan%20menu%20${encodeURIComponent(menu.title)}` : '#contact'}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-all"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Pesan Sekarang</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- TABLE RESERVATION / CATERING INQUIRY ----------------- */}
      <section className="bg-amber-50/60 rounded-3xl border border-amber-200 p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Reservasi Meja & Catering Acara</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Rayakan Momen Spesial Anda Bersama Kami
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Tersedia ruang privat VIP untuk rapat bisnis, pesta ulang tahun, arisan, dan resepsi intim.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20mau%20reservasi%20meja`}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Hubungi Concierge Reservasi
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default FnbThemeRenderer;
