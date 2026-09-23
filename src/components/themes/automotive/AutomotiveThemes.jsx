import React, { useState } from 'react';
import {
  Car, Shield, Check, Star, Fuel, Users, Calendar, ArrowRight,
  Clock, MapPin, Zap, Navigation, Award, ChevronRight, Phone
} from 'lucide-react';

/**
 * 10 Modular Themes for Automotive & Rental Industry:
 * 1. fleet-grid: Clean grid with category filters
 * 2. booking-bar-hero: Prominent reservation bar right under hero
 * 3. luxury-chauffeur: VIP executive chauffeur concierge styling
 * 4. minimalist-rent: Clean ultra-fast booking cards
 * 5. daily-express: Low daily rate highlight and instant reservation
 * 6. offroad-adventure: 4x4 & tour explorer badges
 * 7. executive-van: Group transport and spacious seating
 * 8. eco-electric: Electric vehicle specs, battery range, carbon saved
 * 9. airport-shuttle: Flight arrival pickup scheduler focus
 * 10. bike-scooter: Daily and hourly city micro-rental
 */

export const AutomotiveThemeRenderer = ({ themeId, config, onSelectItem }) => {
  const { items = [], features = [], pricing = [], testimonials = [], faqs = [], whatsapp, phone } = config;
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];
  const filteredItems = selectedCategory === 'Semua' 
    ? items 
    : items.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-28 sm:space-y-36 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ----------------- THEME 2 SPECIFIC: BOOKING BAR HERO ----------------- */}
      {themeId === 'booking-bar-hero' && (
        <section id="booking-bar" className="mt-4 sm:-mt-24 relative z-30 bg-white rounded-3xl border border-slate-200 shadow-elevated p-6 sm:p-8 lg:p-10 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Lokasi Penjemputan</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <input type="text" placeholder="Bandara Soetta / Hotel / Rumah" className="w-full bg-transparent text-sm focus:outline-none text-slate-800 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Tanggal Mulai Sewa</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-transparent text-sm focus:outline-none text-slate-800 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Jenis Layanan</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all">
                <option>Lepas Kunci 24 Jam</option>
                <option>Include Driver Profesional</option>
                <option>VIP Chauffeur & All-In</option>
                <option>Antar Jemput Bandara</option>
              </select>
            </div>
            <div className="flex items-end">
              <a
                href="#fleet"
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Cari Unit Tersedia</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ----------------- THEME 3 SPECIFIC: LUXURY CHAUFFEUR BANNER ----------------- */}
      {themeId === 'luxury-chauffeur' && (
        <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 shadow-xl">
          <div className="max-w-xl space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Executive Chauffeur Service
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Layanan Sopir Eksekutif Berstandar Korporat Bintang Lima
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Pengemudi berpengalaman, menguasai etika protokoler diplomatik, fasih berbahasa Inggris, dan mengutamakan kerahasiaan Anda.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-4">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20tertarik%20dengan%20Executive%20Chauffeur`}
                className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base shadow-md transition-all text-center"
              >
                Booking VIP Chauffeur
              </a>
            )}
          </div>
        </section>
      )}

      {/* ----------------- THEME 4 SPECIFIC: MINIMALIST FAST RENT ----------------- */}
      {themeId === 'minimalist-rent' && (
        <section className="bg-blue-50/70 border border-blue-200/80 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider">
              ⚡ Minimalist Fast Rent
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Sewa Kilat Tanpa Ribet - Lepas Kunci Siap 10 Menit
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Cukup upload foto KTP dan SIM via WhatsApp, armada langsung diantarkan ke lokasi Anda.
            </p>
          </div>
          <a
            href="#fleet"
            className="shrink-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Pilih Unit Kilat</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      )}

      {/* ----------------- THEME 5 SPECIFIC: DAILY EXPRESS ----------------- */}
      {themeId === 'daily-express' && (
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              🚀 Daily Express Low-Rate
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Tarif Harian Termurah dengan Jaminan Unit Bersih Wangi
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Diskon spesial 15% untuk pemakaian sewa 3 hari atau lebih berturut-turut.
            </p>
          </div>
          <a
            href="#pricing"
            className="shrink-0 px-7 py-3.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-lg transition-all"
          >
            Cek Promo Harian
          </a>
        </section>
      )}

      {/* ----------------- THEME 6 SPECIFIC: OFFROAD ADVENTURE ----------------- */}
      {themeId === 'offroad-adventure' && (
        <section className="bg-amber-950 text-white rounded-3xl p-8 sm:p-12 border border-amber-900/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-amber-600/30 text-amber-400 border border-amber-600/40 text-xs font-bold uppercase tracking-wider">
              🏔️ 4x4 & Tour Adventure Explorer
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Armada Tangguh untuk Jelajah Alam, Bromo & Medan Ekstrem
            </h3>
            <p className="text-amber-200/80 text-xs sm:text-sm">
              Dilengkapi winch, ban all-terrain, recovery gear, dan opsi sopir pemandu medan berpengalaman.
            </p>
          </div>
          <a
            href="#fleet"
            className="shrink-0 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all"
          >
            Pilih Mobil 4x4
          </a>
        </section>
      )}

      {/* ----------------- THEME 7 SPECIFIC: EXECUTIVE VAN ----------------- */}
      {themeId === 'executive-van' && (
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
              🚐 Executive Van & VIP Group Shuttle
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Kenyamanan Maksimal Rombongan VIP dengan HiAce Premio Luxury
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Kabin senyap dengan 9 captain seat ergonomis, karaoke on-board, meja lipat, dan ambient lighting.
            </p>
          </div>
          <a
            href="#fleet"
            className="shrink-0 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
          >
            Lihat Unit Van
          </a>
        </section>
      )}

      {/* ----------------- THEME 8 SPECIFIC: ECO ELECTRIC ----------------- */}
      {themeId === 'eco-electric' && (
        <section className="bg-teal-900 text-white rounded-3xl p-8 sm:p-12 border border-teal-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
              🌱 Eco Electric EV Fleet
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Perjalanan Senyap, Ramah Lingkungan dengan Zero Emission
            </h3>
            <p className="text-teal-200/80 text-xs sm:text-sm">
              Unit Ioniq 5 & BYD terbaru dengan jarak tempuh hingga 450 km per pengisian dan gratis charging card.
            </p>
          </div>
          <a
            href="#fleet"
            className="shrink-0 px-7 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all"
          >
            Sewa Mobil Listrik
          </a>
        </section>
      )}

      {/* ----------------- FLEET CATALOG SECTION ----------------- */}
      <section id="fleet" className="space-y-10 sm:space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Car className="w-4 h-4" />
              <span>Armada Terpilih & Terawat • Layout: {themeId}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {themeId === 'eco-electric' ? 'Katalog Armada Listrik (EV)' :
               themeId === 'executive-van' ? 'Pilihan Armada Van & Shuttle Mewah' :
               themeId === 'offroad-adventure' ? 'Armada SUV & 4x4 Adventure Tour' :
               themeId === 'airport-shuttle' ? 'Armada Antar Jemput Bandara Nyaman' :
               themeId === 'bike-scooter' ? 'Armada Rental Motor & Skuter Kota' :
               themeId === 'minimalist-rent' ? 'Katalog Sewa Kilat Minimalis' :
               themeId === 'daily-express' ? 'Pilihan Unit Harian Hemat' :
               'Katalog Pilihan Unit Terbaru Siap Jalan'}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Vehicle Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {item.badge && (
                  <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold">
                  {item.category}
                </span>
              </div>

              {/* Vehicle Info */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2 sm:gap-2.5">
                    {item.specs?.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{spec}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-5 mt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Mulai Dari</span>
                    <div className="text-lg sm:text-xl font-black text-blue-600">
                      {item.price}
                      <span className="text-xs font-normal text-slate-500 ml-1">{item.period || '/hari'}</span>
                    </div>
                  </div>

                  <a
                    href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20mau%20sewa%20${encodeURIComponent(item.title)}` : '#contact'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>Pesan Unit</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- FEATURES SECTION ----------------- */}
      {features.length > 0 && (
        <section id="features" className="space-y-12 sm:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Mengapa Memilih Kami</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Standar Kualitas & Kenyamanan Terbaik Tanpa Kompromi
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 space-y-4 hover:border-blue-300 hover:shadow-card transition-all">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------- PRICING PACKAGES SECTION ----------------- */}
      {pricing.length > 0 && (
        <section id="pricing" className="space-y-12 sm:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Paket Tarif Transparan</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Pilihan Paket Sewa Fleksibel Sesuai Kebutuhan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all space-y-8 ${
                  p.popular
                    ? 'bg-blue-600 text-white shadow-xl ring-2 ring-blue-600 scale-100 md:scale-105'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-subtle'
                }`}
              >
                <div className="space-y-6">
                  {p.badge && (
                    <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold ${
                      p.popular ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {p.badge}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{p.title}</h3>
                  <div className="text-3xl sm:text-4xl font-extrabold">
                    {p.price}
                    <span className={`text-xs font-normal ml-1.5 ${p.popular ? 'text-blue-100' : 'text-slate-500'}`}>{p.period}</span>
                  </div>
                  <ul className="space-y-3.5 pt-6 border-t border-slate-200/40 text-sm">
                    {p.features?.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3">
                        <Check className={`w-4 h-4 shrink-0 ${p.popular ? 'text-white' : 'text-blue-600'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4">
                  <a
                    href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20mau%20ambil%20${encodeURIComponent(p.title)}` : '#contact'}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-center block transition-all ${
                      p.popular
                        ? 'bg-white text-blue-700 hover:bg-slate-100 shadow-md'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Pilih Paket Ini
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------- TESTIMONIALS ----------------- */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="space-y-12 sm:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Testimoni Klien</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Kepercayaan Ratusan Klien Korporat & Wisatawan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-subtle flex flex-col justify-between">
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">"{t.comment}"</p>
                <div className="flex items-center gap-3.5 pt-6 mt-2 border-t border-slate-100">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------- FAQ SECTION ----------------- */}
      {faqs.length > 0 && (
        <section id="faq" className="space-y-10 sm:space-y-12 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">FAQ</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Pertanyaan yang Sering Diajukan</h2>
          </div>
          <div className="space-y-5">
            {faqs.map((f, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-subtle space-y-3">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">{f.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AutomotiveThemeRenderer;
