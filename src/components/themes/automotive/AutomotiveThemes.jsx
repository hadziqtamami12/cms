import React, { useState } from 'react';
import {
  Car, Shield, Check, Star, Fuel, Users, Calendar, ArrowRight,
  Clock, MapPin, Zap, Navigation, Award, ChevronRight, Phone, Plane
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
    <div className="w-full max-w-full overflow-x-hidden min-w-0 space-y-28 sm:space-y-36 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Theme-Adaptive Vehicle Cards Grid */}
        <div className={`grid gap-6 sm:gap-8 ${
          themeId === 'minimalist-rent'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'
            : themeId === 'bike-scooter'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5'
            : themeId === 'executive-van'
            ? 'grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
        }`}>
          {filteredItems.map((item) => {
            const waBookingUrl = whatsapp
              ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20saya%20mau%20sewa%20${encodeURIComponent(item.title)}`
              : '#contact';

            // 1. LUXURY CHAUFFEUR: VIP Dark Obsidian & Gold Metallic
            if (themeId === 'luxury-chauffeur') {
              return (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-b from-slate-900 via-slate-900 to-black rounded-3xl border border-amber-500/25 hover:border-amber-400/60 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
                    <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{item.badge || 'VIP Chauffeur'}</span>
                    </span>
                    <span className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-200 text-[11px] font-semibold border border-amber-500/20">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 text-white">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Layanan VIP • Standar Diplomatik</span>
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.specs || ['Driver Jas Rapi', 'BBM Termasuk', 'Air Mineral VIP']).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-200 text-xs border border-slate-700/50"
                          >
                            <Shield className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">VIP Rate</span>
                        <div className="text-xl font-black text-amber-400">
                          {item.price}
                          <span className="text-xs font-normal text-slate-400 ml-1">{item.period || '/hari'}</span>
                        </div>
                      </div>
                      <a
                        href={waBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                      >
                        <span>Book VIP</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // 2. ECO ELECTRIC: Futuristic Cyber Teal & Range Metrics
            if (themeId === 'eco-electric') {
              return (
                <div
                  key={item.id}
                  className="group bg-slate-900/95 rounded-3xl border border-teal-500/30 hover:border-teal-400 shadow-xl overflow-hidden transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>100% Electric EV</span>
                      </span>
                    </div>
                    <span className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-teal-300 text-[11px] font-mono border border-teal-500/20">
                      🔋 450 km Range
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 text-white">
                    <div>
                      <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        <span>Zero Carbon Emission Fleet</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.specs || ['Fast Charging 80%', 'Free Charging Card', 'Sunroof Panoramic']).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-950/60 text-teal-200 text-xs border border-teal-800/50"
                          >
                            <Zap className="w-3 h-3 text-teal-400 shrink-0" />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-teal-400/80 font-mono block">Tarif EV / Hari</span>
                        <div className="text-xl font-black text-teal-300">
                          {item.price}
                          <span className="text-xs font-normal text-slate-400 ml-1">{item.period || '/hari'}</span>
                        </div>
                      </div>
                      <a
                        href={waBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5"
                      >
                        <span>Sewa EV</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // 3. EXECUTIVE VAN: Wide Horizontal Card with Spacious Seating
            if (themeId === 'executive-van') {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl border border-purple-100 shadow-md hover:shadow-xl hover:border-purple-300 transition-all overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="sm:w-5/12 relative aspect-[16/10] sm:aspect-auto overflow-hidden bg-slate-100 min-h-[200px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-700 text-white text-xs font-bold shadow-md">
                      {item.badge || 'Executive Van'}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[11px] font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 sm:w-7/12 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Kapasitas Rombongan & VIP Shuttle</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Captain Seat Ergonomis, Kabin Senyap, AC Dingin Merata & Audio Entertainment</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.specs || ['9-14 Captain Seats', 'Bagasi Luas', 'Smart Android TV']).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 text-xs font-medium"
                          >
                            <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Tarif Van / Hari</span>
                        <div className="text-xl font-black text-purple-700">
                          {item.price}
                          <span className="text-xs font-normal text-slate-500 ml-1">{item.period || '/hari'}</span>
                        </div>
                      </div>
                      <a
                        href={waBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span>Booking Van</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // 4. OFFROAD ADVENTURE: Rugged Stone & 4WD Expedition
            if (themeId === 'offroad-adventure') {
              return (
                <div
                  key={item.id}
                  className="group bg-stone-900 border border-stone-800 hover:border-amber-600/50 rounded-3xl shadow-xl overflow-hidden transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-600 text-stone-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{item.badge || '4x4 Adventure'}</span>
                    </span>
                    <span className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md text-amber-300 text-[11px] font-mono border border-stone-700">
                      Terrain Ready
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 text-stone-100">
                    <div>
                      <div className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>All-Terrain & Mountain Tour</span>
                      </div>
                      <h3 className="text-xl font-black text-white">{item.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.specs || ['4WD High/Low Gear', 'Ban Mud-Terrain', 'Recovery Winch']).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-stone-200 text-xs border border-stone-700"
                          >
                            <Check className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-5 border-t border-stone-800 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Tarif Ekspedisi</span>
                        <div className="text-xl font-black text-amber-400">
                          {item.price}
                          <span className="text-xs font-normal text-stone-400 ml-1">{item.period || '/hari'}</span>
                        </div>
                      </div>
                      <a
                        href={waBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5"
                      >
                        <span>Sewa 4x4</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // 5. MINIMALIST RENT: Ultra-Clean Scandinavian 4-Col Monochrome Cards
            if (themeId === 'minimalist-rent') {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-900 p-4 transition-all shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950 text-white text-[10px] font-bold tracking-tight">
                        {item.badge || 'Kilat 10 Menit'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{item.category}</div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug mt-0.5">{item.title}</h3>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {item.specs?.slice(0, 2).map((spec, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Harga</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{item.price}</span>
                    </div>
                    <a
                      href={waBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
                    >
                      Pilih
                    </a>
                  </div>
                </div>
              );
            }

            // 6. DAILY EXPRESS: Promo Badge & Discount Highlight
            if (themeId === 'daily-express') {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl border-2 border-rose-100 hover:border-rose-300 shadow-md transition-all overflow-hidden flex flex-col justify-between relative"
                >
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black tracking-wide shadow-sm">
                    🔥 Diskon Promo
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-rose-50/50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Unit Bersih Wangi Siap Jalan
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">{item.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.specs?.map((spec, sIdx) => (
                          <span key={sIdx} className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-rose-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through block">Tarif Normal</span>
                        <div className="text-lg sm:text-xl font-black text-rose-600">
                          {item.price}
                          <span className="text-xs font-normal text-slate-500 ml-0.5">{item.period || '/hari'}</span>
                        </div>
                      </div>
                      <a
                        href={waBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
                      >
                        <span>Ambil Promo</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // 7. AIRPORT SHUTTLE: Travel & Luggage Airport Tag
            if (themeId === 'airport-shuttle') {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl border border-sky-200 hover:border-sky-400 shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-sky-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-sky-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5" />
                      <span>{item.badge || 'Airport Shuttle'}</span>
                    </span>
                    <span className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-slate-900/80 text-white text-[11px] font-semibold">
                      Terminal 1, 2 & 3
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="text-sky-700 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Meet & Greet Papan Nama di Pintu Kedatangan</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.specs || ['Gratis Tol & Parkir', 'Flight Delay Guarantee', 'Muat 4 Koper Besar']).map((spec, sIdx) => (
                          <span key={sIdx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs font-medium">
                            <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-sky-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Tarif All-In Tol</span>
                        <div className="text-xl font-black text-sky-700">
                          {item.price}
                          <span className="text-xs font-normal text-slate-500 ml-1">{item.period || '/trip'}</span>
                        </div>
                      </div>
                      <a
                        href={waBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span>Jemput Bandara</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // 8. BIKE SCOOTER: Compact Micro-Rental Card
            if (themeId === 'bike-scooter') {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-lime-200 hover:border-lime-400 shadow-sm p-4 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-lime-50 mb-2.5">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-lime-600 text-white text-[10px] font-black uppercase">
                        🛵 {item.badge || 'Rental Motor'}
                      </span>
                    </div>
                    <h3 className="font-black text-slate-900 text-base">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Free 2 Helm SNI + Jas Hujan + BBM Penuh</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(item.specs?.slice(0, 2) || ['Matic Irit', 'Helm + Jas Hujan']).map((spec, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-lime-50 text-lime-800 text-[11px] font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tarif Harian</span>
                      <div className="font-black text-slate-900 text-sm">
                        {item.price}
                        <span className="text-[10px] font-normal text-slate-500 ml-0.5">{item.period || '/hari'}</span>
                      </div>
                    </div>
                    <a
                      href={waBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold text-xs transition-all"
                    >
                      Sewa
                    </a>
                  </div>
                </div>
              );
            }

            // 9. BOOKING BAR HERO & 10. FLEET GRID (Standard Default Card)
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
              >
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

                  <div className="pt-5 mt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Mulai Dari</span>
                      <div className="text-lg sm:text-xl font-black text-blue-600">
                        {item.price}
                        <span className="text-xs font-normal text-slate-500 ml-1">{item.period || '/hari'}</span>
                      </div>
                    </div>

                    <a
                      href={waBookingUrl}
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
            );
          })}
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
