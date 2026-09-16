import React, { useState, useMemo } from 'react';
import {
  Users, Fuel, Briefcase, Zap, Star, MessageSquare, Check, Search,
  SlidersHorizontal, Car, ShoppingBag, Package, Sparkles, Download, ArrowRight, ShieldCheck
} from 'lucide-react';

const DEFAULT_CAR_ITEMS = [
  {
    id: 'car-1',
    name: 'Toyota Alphard Transformer VIP',
    category: 'SUV / Premium',
    price: 'Rp 2.500.000',
    pricePerDay: 'Rp 2.500.000',
    priceDriver: 'Rp 2.800.000',
    transmission: 'Matic',
    capacity: '6 Kursi VIP',
    luggage: '4 Koper',
    fuel: 'Bensin',
    rating: 5.0,
    reviewsCount: 180,
    badge: 'Tamu VIP',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    specs: ['Pilot Leather Seat', 'Sunroof & Ambient Light', 'Supir Jas Berdasi'],
    description: 'Kenyamanan kelas eksekutif dengan kabin senyap, captain seat mewah, dan privasi maksimal.',
  },
  {
    id: 'car-2',
    name: 'Toyota Innova Zenix Hybrid',
    category: 'MPV Keluarga',
    price: 'Rp 750.000',
    pricePerDay: 'Rp 750.000',
    priceDriver: 'Rp 950.000',
    transmission: 'Matic',
    capacity: '7 Kursi',
    luggage: '3 Koper',
    fuel: 'Hybrid Irit',
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Paling Laris',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    specs: ['Panoramic Roof', 'Suspensi Empuk TNGA', 'Kabin Ekstra Senyap'],
    description: 'Pilihan favorit keluarga Indonesia. Kabin lega, AC sejuk dobel blower, dan bahan bakar sangat irit.',
  },
  {
    id: 'car-3',
    name: 'Toyota Fortuner 2.8 GR Sport',
    category: 'SUV / Premium',
    price: 'Rp 1.200.000',
    pricePerDay: 'Rp 1.200.000',
    priceDriver: 'Rp 1.450.000',
    transmission: 'Matic',
    capacity: '7 Kursi',
    luggage: '4 Koper',
    fuel: 'Diesel Turbo',
    rating: 4.9,
    reviewsCount: 95,
    badge: 'Gagah & Kuat',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    specs: ['Mesin 2800cc Turbo', 'Jok Kulit Sporty GR', 'Siap Luar Kota'],
    description: 'SUV tangguh bertenaga tinggi untuk perjalanan dinas, proyek, atau liburan keluarga segala medan.',
  },
  {
    id: 'car-4',
    name: 'Mitsubishi Xpander Ultimate',
    category: 'MPV Keluarga',
    price: 'Rp 450.000',
    pricePerDay: 'Rp 450.000',
    priceDriver: 'Rp 700.000',
    transmission: 'Matic',
    capacity: '7 Kursi',
    luggage: '3 Koper',
    fuel: 'Bensin Irit',
    rating: 4.9,
    reviewsCount: 168,
    badge: 'Best Value',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
    specs: ['Ground Clearance Tinggi', 'AC Digital Dingin', 'Kabin Lapang'],
    description: 'Kombinasi kenyamanan MPV dan ketangguhan SUV dengan efisiensi konsumsi BBM prima.',
  },
  {
    id: 'car-5',
    name: 'Toyota HiAce Premio Luxury',
    category: 'Minibus',
    price: 'Rp 1.500.000',
    pricePerDay: 'Rp 1.500.000',
    priceDriver: 'Rp 1.800.000',
    transmission: 'Manual',
    capacity: '10 Kursi',
    luggage: '6 Koper',
    fuel: 'Diesel Turbo',
    rating: 4.9,
    reviewsCount: 78,
    badge: 'Rombongan VIP',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
    specs: ['Captain Seat Khusus', 'Audio Smart TV', 'Legroom Sangat Luas'],
    description: 'Kapasitas besar dengan kenyamanan VIP untuk rombongan keluarga besar atau delegasi kantor.',
  },
  {
    id: 'car-6',
    name: 'Honda Brio RS Urban',
    category: 'City Car',
    price: 'Rp 350.000',
    pricePerDay: 'Rp 350.000',
    priceDriver: 'Rp 550.000',
    transmission: 'Matic',
    capacity: '5 Kursi',
    luggage: '2 Koper',
    fuel: 'Bensin Hemat',
    rating: 4.8,
    reviewsCount: 110,
    badge: 'Hemat & Gesit',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    specs: ['Lincah di Kemacetan', 'Mudah Parkir', 'BBM Super Hemat'],
    description: 'City car lincah dan gesit untuk mobilitas harian dalam kota dengan kepraktisan maksimal.',
  }
];

const DEFAULT_CATALOG_ITEMS = [
  {
    id: 'prod-1',
    name: 'Kemeja Minimalis Oxford Premium',
    category: 'Pakaian Pria',
    price: 'Rp 249.000',
    pricePerDay: 'Rp 249.000',
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Best Seller',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    specs: ['Bahan Katun 100%', 'Jahitan Ganda Rapi', 'Anti Kusut & Sejuk'],
  },
  {
    id: 'prod-2',
    name: 'Sneakers Urban Leather Comfort',
    category: 'Sepatu & Alas Kaki',
    price: 'Rp 489.000',
    pricePerDay: 'Rp 489.000',
    rating: 5.0,
    reviewsCount: 98,
    badge: 'Koleksi Baru',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    specs: ['Insole Memory Foam', 'Outsole Anti Slip', 'Kulit Sintetis Premium'],
  },
  {
    id: 'prod-3',
    name: 'Jam Tangan Chrono Elite Stainless',
    category: 'Aksesoris & Jam',
    price: 'Rp 699.000',
    pricePerDay: 'Rp 699.000',
    rating: 4.8,
    reviewsCount: 86,
    badge: 'Garansi 2 Tahun',
    format: 'Limited',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    specs: ['Water Resistant 50M', 'Kaca Sapphire Crystal', 'Mesin Quartz Jepang'],
  },
  {
    id: 'prod-4',
    name: 'Ransel Laptop Waterproof Urban',
    category: 'Tas & Koper',
    price: 'Rp 329.000',
    pricePerDay: 'Rp 329.000',
    rating: 4.9,
    reviewsCount: 115,
    badge: 'Diskon 20%',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    specs: ['Slot Laptop 15.6 Inch', 'Port Charger USB', 'Bahan Cordura Tahan Air'],
  },
  {
    id: 'prod-5',
    name: 'Kacamata Polarized Titanium Frame',
    category: 'Aksesoris & Jam',
    price: 'Rp 199.000',
    pricePerDay: 'Rp 199.000',
    rating: 4.7,
    reviewsCount: 64,
    badge: 'UV400 Protected',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    specs: ['Lensa Polarized Asli', 'Frame Titanium Ringan', 'Gratis Hardcase & Lap'],
  },
  {
    id: 'prod-6',
    name: 'Dompet Kulit Bifold Minimalis',
    category: 'Tas & Koper',
    price: 'Rp 159.000',
    pricePerDay: 'Rp 159.000',
    rating: 4.9,
    reviewsCount: 132,
    badge: 'Best Value',
    format: 'Ready Stock',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    specs: ['RFID Blocking Protection', '8 Slot Kartu + Uang Kertas', 'Kulit Crazy Horse'],
  }
];

export default function FleetCatalog({ props = {} }) {
  const {
    badge = 'Koleksi & Produk Pilihan',
    title = 'Katalog Produk & Layanan Unggulan',
    subtitle = 'Koleksi berkualitas tinggi dengan spesifikasi lengkap, jaminan kualitas, dan pemesanan instan.',
    vehicles = [],
    products = [],
    items = [],
    catalogType = 'auto', // 'auto' | 'ecommerce' | 'digital' | 'rental'
  } = props;

  const catalogItems = useMemo(() => {
    if (vehicles && vehicles.length > 0) return vehicles;
    if (products && products.length > 0) return products;
    if (items && items.length > 0) return items;
    if (catalogType === 'rental') return DEFAULT_CAR_ITEMS;
    return DEFAULT_CATALOG_ITEMS;
  }, [vehicles, products, items, catalogType]);

  const [activeFilter, setActiveFilter] = useState('Semua');
  const [subFilter, setSubFilter] = useState('Semua');

  const categories = useMemo(() => {
    return ['Semua', ...new Set(catalogItems.map((item) => item.category).filter(Boolean))];
  }, [catalogItems]);

  // Detect if catalog items are cars vs digital products vs general goods
  const isCarCatalog = useMemo(() => {
    if (catalogType === 'rental') return true;
    if (catalogType === 'ecommerce' || catalogType === 'digital') return false;
    return catalogItems.some((i) => i.transmission || i.priceDriver || i.capacity);
  }, [catalogItems, catalogType]);

  const isDigitalProduct = useMemo(() => {
    if (catalogType === 'digital') return true;
    return catalogItems.some((i) => i.fileFormat || i.format || i.version || i.license);
  }, [catalogItems, catalogType]);

  const subFilters = useMemo(() => {
    if (isCarCatalog) return ['Semua', 'Matic', 'Manual'];
    if (isDigitalProduct) return ['Semua', 'Figma', 'React', 'HTML/CSS'];
    return ['Semua', 'Terpopuler', 'Promo'];
  }, [isCarCatalog, isDigitalProduct]);

  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchCategory = activeFilter === 'Semua' || item.category === activeFilter;
      if (subFilter === 'Semua') return matchCategory;

      if (isCarCatalog) {
        return matchCategory && (item.transmission || '').toLowerCase().includes(subFilter.toLowerCase());
      }
      if (isDigitalProduct) {
        const fmt = (item.format || item.fileFormat || '').toLowerCase();
        return matchCategory && fmt.includes(subFilter.toLowerCase());
      }
      return matchCategory;
    });
  }, [catalogItems, activeFilter, subFilter, isCarCatalog, isDigitalProduct]);

  return (
    <section id="fleet" className="py-20 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold mb-4 shadow-xs">
          {isCarCatalog ? (
            <Car className="w-4 h-4 text-slate-900" />
          ) : isDigitalProduct ? (
            <Sparkles className="w-4 h-4 text-emerald-600" />
          ) : (
            <ShoppingBag className="w-4 h-4 text-slate-900" />
          )}
          <span>{badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Category & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub Filter */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <span className="text-xs font-semibold text-slate-500 mr-1">
              {isCarCatalog ? 'Transmisi:' : isDigitalProduct ? 'Format:' : 'Koleksi:'}
            </span>
            {subFilters.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSubFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  subFilter === t
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 p-8">
          <p className="text-slate-500 text-sm">Tidak ada produk atau item untuk kategori ini.</p>
          <button
            type="button"
            onClick={() => { setActiveFilter('Semua'); setSubFilter('Semua'); }}
            className="mt-3 text-xs text-slate-900 font-bold hover:underline"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <article
              key={item.id || item.name}
              className="group rounded-2xl border border-slate-200/90 bg-white hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden shadow-xs"
            >
              {/* Image Container with 16:10 Aspect Ratio */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl || item.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Tag / Badge */}
                {(item.featuredTag || item.badge || item.highlight) && (
                  <div className="absolute top-4 left-4 bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs">
                    {item.featuredTag || item.badge || item.highlight}
                  </div>
                )}

                {/* Card Corner Spec Tag */}
                <div className="absolute bottom-3 right-3 bg-white/95 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-200/90 shadow-xs">
                  {isCarCatalog
                    ? `${item.transmission || 'Matic'} • ${item.capacity || '7 Kursi'}`
                    : item.format || item.version || item.category || 'Tersedia'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-slate-800 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  {item.description && (
                    <p className="text-slate-600 text-xs mb-4 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* CAR SPECS GRID */}
                  {isCarCatalog && (
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-700">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                        <Zap className="w-4 h-4 text-slate-700 shrink-0" />
                        <span className="truncate">{item.transmission || 'Matic'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                        <Users className="w-4 h-4 text-slate-700 shrink-0" />
                        <span className="truncate">{item.capacity || '7 Kursi'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                        <Briefcase className="w-4 h-4 text-slate-700 shrink-0" />
                        <span className="truncate">{item.luggage || '3 Koper'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                        <Fuel className="w-4 h-4 text-slate-700 shrink-0" />
                        <span className="truncate">{item.fuel || 'Bensin Irit'}</span>
                      </div>
                    </div>
                  )}

                  {/* DIGITAL / E-COMMERCE SPECS */}
                  {!isCarCatalog && (
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-700">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.format || item.transmission || 'Original'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.license || item.fuel || 'Garansi Resmi'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing Box & Action Button */}
                <div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-medium">
                        {isCarCatalog ? 'Lepas Kunci (24 Jam)' : 'Harga'}
                      </span>
                      <span className="font-black text-slate-900 text-sm">
                        {item.pricePerDay || item.priceDaily || item.price || 'Rp 250.000'}
                      </span>
                    </div>

                    {isCarCatalog && item.priceDriver && (
                      <div className="border-l border-slate-200 pl-3 text-right">
                        <span className="text-[10px] text-slate-500 block font-medium">+ Supir Ramah</span>
                        <span className="font-extrabold text-slate-900 text-sm">{item.priceDriver}</span>
                      </div>
                    )}

                    {!isCarCatalog && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Siap Kirim / Unduh
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <a
                    href={`https://wa.me/${props.whatsappNumber || '6281234567890'}?text=${encodeURIComponent(
                      isCarCatalog
                        ? `Halo, saya ingin reservasi sewa mobil ${item.name} (${item.transmission || 'Matic'}). Apakah unit tersedia?`
                        : `Halo, saya tertarik dengan produk ${item.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-transform active:scale-95 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-white" />
                    <span>{isCarCatalog ? `Sewa ${item.name}` : `Pesan ${item.name}`}</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
