import React, { useState } from 'react';
import { ShoppingBag, Star, Check, ArrowRight, ShieldCheck, Truck, RotateCcw, Clock, Sparkles } from 'lucide-react';

export const EcommerceThemeRenderer = ({ themeId, config, onSelectItem }) => {
  const { items = [], features = [], testimonials = [], faqs = [], whatsapp, phone } = config;
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  return (
    <div className="space-y-28 sm:space-y-36 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ----------------- THEME: FLASH SALE MODERN BANNER ----------------- */}
      {themeId === 'flash-sale-modern' && (
        <section className="bg-red-600 rounded-3xl p-8 sm:p-12 lg:p-14 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Flash Deal Terbatas Hari Ini
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">Diskon Hingga 50% Seluruh Koleksi</h2>
            <p className="text-red-100 text-sm sm:text-base leading-relaxed">Gunakan voucher FLASH2026 saat checkout untuk gratis ongkir se-Indonesia.</p>
          </div>
          <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-center min-w-[70px] sm:min-w-[76px]">
              <span className="text-2xl sm:text-3xl font-black block">04</span>
              <span className="text-[11px] text-red-200 uppercase font-bold tracking-wider mt-0.5 block">Jam</span>
            </div>
            <span className="text-2xl sm:text-3xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-center min-w-[70px] sm:min-w-[76px]">
              <span className="text-2xl sm:text-3xl font-black block">38</span>
              <span className="text-[11px] text-red-200 uppercase font-bold tracking-wider mt-0.5 block">Menit</span>
            </div>
            <span className="text-2xl sm:text-3xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-center min-w-[70px] sm:min-w-[76px]">
              <span className="text-2xl sm:text-3xl font-black block">15</span>
              <span className="text-[11px] text-red-200 uppercase font-bold tracking-wider mt-0.5 block">Detik</span>
            </div>
          </div>
        </section>
      )}

      {/* ----------------- PRODUCT CATALOG GRID (ALL 10 THEMES) ----------------- */}
      <section id="fleet" className="space-y-10 sm:space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <ShoppingBag className="w-4 h-4" />
              <span>Koleksi Eksklusif & Original</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {themeId === 'direct-checkout' ? 'Pilih Produk & Langsung Pesan' :
               themeId === 'organic-grocery' ? 'Produk Segar Organik Dari Kebun' :
               themeId === 'tech-gadget' ? 'Spesifikasi Gadget & Aksesoris Terkini' :
               themeId === 'wholesale-b2b' ? 'Katalog Harga Grosir & Tender B2B' :
               themeId === 'storytelling-artisan' ? 'Karya Artisan Buatan Tangan' :
               'Produk Pilihan Kualitas Terbaik'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {items.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {prod.badge && (
                    <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{prod.title}</h3>
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs sm:text-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-slate-500 ml-2 font-medium">(4.9/5)</span>
                  </div>
                  {Array.isArray(prod.pricing_tiers) && prod.pricing_tiers.length > 1 ? (
                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pilihan Tarif:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {prod.pricing_tiers.map((t, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              t.is_default ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {t.label}: <span className="font-mono">{t.price}</span>
                            {t.unit && <span className="text-[10px] font-normal opacity-70"> {t.unit}</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xl sm:text-2xl font-black text-slate-900 pt-1">
                      {prod.price}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-2">
                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20mau%20order%20${encodeURIComponent(prod.title)}` : '#contact'}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2.5 shadow-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- SHOP GUARANTEES / FEATURES ----------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 py-10 sm:py-14 border-y border-slate-200">
        <div className="flex items-center gap-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Pengiriman Seluruh Nusantara</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Packing kayu aman + asuransi kurir kilat.</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-base">100% Produk Original Bergaransi</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Jaminan uang kembali jika barang terbukti palsu.</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-base">7 Hari Garansi Retur</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Proses klaim ganti baru mudah dan cepat.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceThemeRenderer;
