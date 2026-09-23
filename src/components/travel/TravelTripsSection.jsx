import React, { useState, useEffect } from 'react';
import {
  Compass, MapPin, Clock, Users, Check, ArrowRight, Star,
  Calendar, Shield, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';

/**
 * Travel Trips & Tour Packages Catalog Component
 */
export const TravelTripsSection = ({ whatsapp = '6281288990011', brandName = 'Royal Travel' }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTripId, setExpandedTripId] = useState(null);

  useEffect(() => {
    fetch('/api/travel-trips/public')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setTrips(json.data);
        }
      })
      .catch(err => {
        console.warn('[TravelTrips] Fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 mt-2 font-medium">Memuat paket tour & travel...</p>
      </div>
    );
  }

  if (trips.length === 0) return null;

  const cleanWa = String(whatsapp).replace(/[^0-9]/g, '');

  return (
    <section id="travel-trips" className="space-y-12 sm:space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Paket Wisata & Private Trip</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Eksplorasi Destinasi Terbaik Tanpa Repot Bersama {brandName}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pilihan paket tour all-in dengan armada prima, itinerary fleksibel, pemandu lokal ramah, dan jaminan kenyamanan bintang lima.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {trips.map((trip) => {
          const isExpanded = expandedTripId === trip.id;
          const coverImage = Array.isArray(trip.images) && trip.images.length > 0
            ? trip.images[0]
            : 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80';
          const bookingUrl = `https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(brandName)},%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(trip.title)}.%20Boleh%20minta%20info%20jadwal%20dan%20ketersediaan?`;

          return (
            <div
              key={trip.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-subtle hover:shadow-card transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={coverImage}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {trip.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
                    {trip.badge}
                  </span>
                )}
                {trip.duration && (
                  <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{trip.duration}</span>
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {trip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {trip.description}
                  </p>

                  {/* Highlights */}
                  {Array.isArray(trip.highlights) && trip.highlights.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {trip.highlights.map((h, hIdx) => (
                        <span
                          key={hIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100"
                        >
                          <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                          <span>{h}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Itinerary Accordion Dropdown */}
                  {Array.isArray(trip.route_itinerary) && trip.route_itinerary.length > 0 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Tutup Rincian Itinerary' : 'Lihat Rincian Itinerary'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700 animate-fade-in">
                          {trip.route_itinerary.map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-2 items-start leading-relaxed">
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pricing & CTA */}
                <div className="pt-5 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Per Orang (Pax)</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {trip.price_per_pax || 'Hubungi CS'}
                      </span>
                    </div>
                    <div className="border-l border-slate-200 pl-2.5">
                      <span className="text-[10px] text-slate-500 font-semibold block">Private Group</span>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {trip.price_per_group || 'Hubungi CS'}
                      </span>
                    </div>
                  </div>

                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Booking Paket Tour</span>
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

export default TravelTripsSection;
