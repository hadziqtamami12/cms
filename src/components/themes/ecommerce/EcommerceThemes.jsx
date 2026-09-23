import React, { useState } from 'react';
import { ShoppingBag, Star, Check, ArrowRight, ShieldCheck, Truck, RotateCcw, Clock, Sparkles } from 'lucide-react';

export const EcommerceThemeRenderer = ({ themeId, config, onSelectItem }) => {
  const { items = [], features = [], testimonials = [], faqs = [], whatsapp, phone } = config;
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  return (
    <div className="space-y-24 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ----------------- THEME: FLASH SALE MODERN BANNER ----------------- */}
      {themeId === 'flash-sale-modern' && (
        <section className="bg-red-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Flash Deal Terbatas Hari Ini
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Diskon Hingga 50% Seluruh Koleksi</h2>
            <p className="text-red-100 text-xs sm:text-sm">Gunakan voucher FLASH2026 saat checkout untuk gratis ongkir se-Indonesia.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center min-w-[60px]">
              <span className="text-xl font-black block">04</span>
              <span className="text-[10px] text-red-200 uppercase font-semibold">Jam</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center min-w-[60px]">
              <span className="text-xl font-black block">38</span>
              <span className="text-[10px] text-red-200 uppercase font-semibold">Menit</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center min-w-[60px]">
              <span className="text-xl font-black block">15</span>
              <span className="text-[10px] text-red-200 uppercase font-semibold">Detik</span>
            </div>
          </div>
        </section>
      )}

      {/* ----------------- PRODUCT CATALOG GRID (ALL 10 THEMES) ----------------- */}
      <section id="fleet" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Koleksi Eksklusif & Original</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {themeId === 'direct-checkout' ? 'Pilih Produk & Langsung Pesan' :
               themeId === 'organic-grocery' ? 'Produk Segar Organik Dari Kebun' :
               themeId === 'tech-gadget' ? 'Spesifikasi Gadget & Aksesoris Terkini' :
               themeId === 'wholesale-b2b' ? 'Katalog Harga Grosir & Tender B2B' :
               themeId === 'storytelling-artisan' ? 'Karya Artisan Buatan Tangan' :
               'Produk Pilihan Kualitas Terbaik'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
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
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{prod.title}</h3>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-slate-500 ml-1.5 font-medium">(4.9/5)</span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {prod.price}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20mau%20order%20${encodeURIComponent(prod.title)}` : '#contact'}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-sm transition-all"
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
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-slate-200">
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Pengiriman Seluruh Nusantara</h4>
            <p className="text-xs text-slate-500">Packing kayu aman + asuransi kurir kilat.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">100% Produk Original Bergaransi</h4>
            <p className="text-xs text-slate-500">Jaminan uang kembali jika barang terbukti palsu.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">7 Hari Garansi Retur</h4>
            <p className="text-xs text-slate-500">Proses klaim ganti baru mudah dan cepat.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceThemeRenderer;
