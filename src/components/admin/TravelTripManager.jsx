import React, { useState, useEffect } from 'react';
import {
  Compass, Plus, Edit2, Trash2, Check, X, RefreshCw, Star, Clock,
  Image as ImageIcon, MapPin, LayoutGrid, Table, CheckCircle2, AlertCircle,
  Sparkles, Search, Globe, ExternalLink, ArrowRight
} from 'lucide-react';
import DataTable from '../common/DataTable';
import ImageUploadInput from '../common/ImageUploadInput';

/**
 * Travel Trip Manager for Admin Dashboard
 * Manages tour packages and travel trips in the database with modern DataTable,
 * and automated Google destination search & article generator.
 */
export const TravelTripManager = ({ adminToken, showToast, onOpenScraper }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [saving, setSaving] = useState(false);

  // Auto-Generate Destination Modal state
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [autoDestInput, setAutoDestInput] = useState('');
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoResult, setAutoResult] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    duration: '1 Hari',
    price_per_pax: 'Rp 500.000',
    price_per_group: 'Rp 2.500.000',
    badge: 'Paket Populer',
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    highlights: 'Kawah Ijen, Blue Fire, Baluran',
    itinerary: 'Hari 1: Penjemputan di Stasiun / Bandara\nHari 2: Wisata sunrise dan drop-off'
  });

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/travel-trips/manage', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (json.success && Array.isArray(json.data)) {
        setTrips(json.data);
      }
    } catch (err) {
      console.warn('[TravelTripManager] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    const handleTripsUpdated = () => {
      fetchTrips();
    };
    window.addEventListener('cms:travel_updated', handleTripsUpdated);
    return () => window.removeEventListener('cms:travel_updated', handleTripsUpdated);
  }, []);

  const handleOpenAdd = () => {
    setEditingTrip(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      duration: '1 Hari',
      price_per_pax: 'Rp 500.000',
      price_per_group: 'Rp 2.500.000',
      badge: 'Paket Populer',
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      highlights: 'Spot Wisata 1, Spot Wisata 2',
      itinerary: 'Hari 1: Penjemputan dan tour\nHari 2: Selesai'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title || '',
      slug: trip.slug || '',
      description: trip.description || '',
      duration: trip.duration || '1 Hari',
      price_per_pax: trip.price_per_pax || 'Rp 500.000',
      price_per_group: trip.price_per_group || 'Rp 2.500.000',
      badge: trip.badge || 'Paket Populer',
      image: Array.isArray(trip.images) && trip.images[0] ? trip.images[0] : (trip.images || ''),
      highlights: Array.isArray(trip.highlights) ? trip.highlights.join(', ') : (trip.highlights || ''),
      itinerary: Array.isArray(trip.route_itinerary) ? trip.route_itinerary.join('\n') : (trip.route_itinerary || '')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul paket tour wajib diisi');
      return;
    }

    setSaving(true);
    const highlightsArr = formData.highlights.split(',').map(s => s.trim()).filter(Boolean);
    const itineraryArr = formData.itinerary.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      duration: formData.duration.trim(),
      price_per_pax: formData.price_per_pax.trim(),
      price_per_group: formData.price_per_group.trim(),
      badge: formData.badge.trim(),
      images: [formData.image.trim()],
      highlights: highlightsArr,
      route_itinerary: itineraryArr
    };

    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const endpoint = editingTrip
        ? `/api/admin/travel-trips/manage/${editingTrip.id}`
        : '/api/admin/travel-trips/manage';
      const method = editingTrip ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menyimpan paket tour');

      if (showToast) showToast(editingTrip ? 'Paket tour berhasil diperbarui' : 'Paket tour baru berhasil dibuat');
      setIsModalOpen(false);
      fetchTrips();
    } catch (err) {
      alert('Gagal: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Automated Google Search Destination & Article Generator Handler
  const handleAutoGenerateTrip = async (destinationName) => {
    const targetDest = destinationName || autoDestInput;
    if (!targetDest || targetDest.trim().length < 3) {
      alert('Masukkan nama objek wisata atau destinasi minimal 3 karakter.');
      return;
    }

    setIsAutoGenerating(true);
    setAutoResult(null);

    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/travel-trips/auto-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ destination: targetDest.trim() })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal mencari dan membuat paket wisata');
      }

      setAutoResult(json.data);
      if (showToast) {
        showToast(`Paket Wisata & Halaman Artikel untuk "${targetDest}" berhasil digenerate!`, 'success');
      }
      fetchTrips();
    } catch (err) {
      alert('Gagal otomasi: ' + err.message);
    } finally {
      setIsAutoGenerating(false);
    }
  };

  const handleDeleteTrip = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus paket tour "${title}"?`)) return;

    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch(`/api/admin/travel-trips/manage/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menghapus');

      if (showToast) showToast('Paket tour berhasil dihapus');
      fetchTrips();
    } catch (err) {
      alert('Gagal: ' + err.message);
    }
  };

  const handleBulkDeleteTrips = async (ids) => {
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/travel-trips/batch-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ ids })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menghapus');
      if (showToast) showToast(json.message);
      fetchTrips();
    } catch (err) {
      alert('Gagal bulk delete: ' + err.message);
    }
  };

  const handleBulkStatusTrips = async (ids, status) => {
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/travel-trips/batch-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ ids, status })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal update status');
      if (showToast) showToast(json.message);
      fetchTrips();
    } catch (err) {
      alert('Gagal bulk status: ' + err.message);
    }
  };

  // Table Columns Definition
  const tripColumns = [
    {
      key: 'images',
      label: 'Foto Destinasi',
      sortable: false,
      render: (val, row) => {
        const imgUrl = Array.isArray(val) && val[0] ? val[0] : (val || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=200&q=80');
        return (
          <div className="w-14 h-11 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200 shadow-2xs shrink-0">
            <img src={imgUrl} alt={row.title} className="w-full h-full object-cover" />
          </div>
        );
      }
    },
    {
      key: 'title',
      label: 'Nama Paket & Rute',
      sortable: true,
      render: (val, row) => (
        <div className="space-y-0.5 max-w-sm">
          <div className="font-bold text-xs text-slate-900 line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1">{row.description}</div>
          {row.badge && (
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              {row.badge}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Durasi',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{val || '1 Hari'}</span>
        </span>
      )
    },
    {
      key: 'price_per_pax',
      label: 'Tarif / Pax',
      sortable: true,
      render: (val, row) => (
        <div className="space-y-0.5">
          <div className="font-mono text-xs font-bold text-emerald-600">{val || '-'}</div>
          {row.price_per_group && (
            <div className="text-[10px] text-slate-400 font-mono">Grup: {row.price_per_group}</div>
          )}
        </div>
      )
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          val !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {val !== false ? 'Aktif' : 'Nonaktif'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      sortable: false,
      className: 'text-right',
      render: (_, trip) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenEdit(trip)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
            title="Edit Paket"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteTrip(trip.id, trip.title)}
            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Hapus Paket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-xs">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Paket Wisata & Tour
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola penawaran paket perjalanan, rute wisata, tarif rombongan, atau generate konten paket otomatis via pencarian Google.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Tabel Modern"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Grid Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Otomasi via Google Search Button */}
            <button
              type="button"
              onClick={() => {
                setAutoResult(null);
                setIsAutoModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
              title="Cari data destinasi di Google & buat paket tour serta artikel otomatis"
            >
              <Search className="w-4 h-4 text-blue-200" />
              <span>Otomasi Google</span>
            </button>

            {onOpenScraper && (
              <button
                type="button"
                onClick={() => onOpenScraper('travel')}
                className="px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Scrape paket tour & destinasi wisata dari website kompetitor"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Scrape Web</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Manual</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Memuat paket tour...</div>
        ) : viewMode === 'table' ? (
          <div className="mt-6">
            <DataTable
              columns={tripColumns}
              data={trips}
              rowKey="id"
              searchPlaceholder="Cari nama paket, durasi, atau harga..."
              emptyMessage="Belum ada paket wisata. Klik 'Otomasi via Google Search' atau 'Tambah Manual' untuk membuat paket baru."
              onBulkDelete={handleBulkDeleteTrips}
              onBulkStatusUpdate={handleBulkStatusTrips}
              bulkStatusOptions={[
                { label: 'Set Aktif (Tampil)', value: 'active', color: 'emerald' },
                { label: 'Set Nonaktif (Sembunyi)', value: 'inactive', color: 'amber' }
              ]}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  <img
                    src={Array.isArray(trip.images) && trip.images[0] ? trip.images[0] : (trip.images || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80')}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  {trip.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {trip.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2 flex-1">
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{trip.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{trip.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">{trip.duration}</span>
                    <span className="font-bold font-mono text-emerald-600">{trip.price_per_pax}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(trip)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-white text-xs font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTrip(trip.id, trip.title)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-white text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: OTOMASI PAKET WISATA VIA GOOGLE SEARCH */}
      {isAutoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Search className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    Otomasi Paket Wisata via Google Search
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cari data objek wisata otomatis, lalu buat paket tour & halaman artikel lengkap.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAutoModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Target Destinasi */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Nama Objek Wisata atau Destinasi Target *
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={autoDestInput}
                    onChange={(e) => setAutoDestInput(e.target.value)}
                    placeholder="Contoh: Kawah Ijen, Gunung Bromo, Candi Borobudur, Pantai Melasti"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAutoGenerateTrip();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoGenerateTrip()}
                  disabled={isAutoGenerating || !autoDestInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isAutoGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mencari Google...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Cari & Buat</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  Atau klik rekomendasi destinasi populer:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    'Kawah Ijen Banyuwangi',
                    'Gunung Bromo Tengger',
                    'Candi Borobudur Magelang',
                    'Pantai Melasti Bali',
                    'Taman Nasional Baluran',
                    'Dieng Plateau Wonosobo',
                    'Labuan Bajo Komodo'
                  ].map((destChip) => (
                    <button
                      key={destChip}
                      type="button"
                      onClick={() => {
                        setAutoDestInput(destChip);
                        handleAutoGenerateTrip(destChip);
                      }}
                      disabled={isAutoGenerating}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                    >
                      {destChip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Success Preview */}
            {autoResult && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Paket Wisata & Artikel Berhasil Dibuat di Database!</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <p><strong>Judul:</strong> {autoResult.title}</p>
                  <p><strong>Durasi:</strong> {autoResult.duration} | <strong>Tarif:</strong> {autoResult.price_per_pax}</p>
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-emerald-200">
                  <a
                    href={autoResult.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    <span>Buka Halaman Artikel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsAutoModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
                  >
                    Tutup & Lihat di Daftar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Compass className="w-5 h-5" />
                </span>
                <h3 className="font-black text-lg text-slate-900">
                  {editingTrip ? 'Edit Paket Tour' : 'Tambah Paket Tour Manual'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Nama Paket Tour *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Paket Eksplorasi Kawah Ijen & TN Baluran 2H1M"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Durasi Trip</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Contoh: 2 Hari 1 Malam atau 10 Jam"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Badge / Label</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Paling Populer, Promo"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tarif per Orang (Pax)</label>
                  <input
                    type="text"
                    value={formData.price_per_pax}
                    onChange={(e) => setFormData({ ...formData, price_per_pax: e.target.value })}
                    placeholder="Contoh: Rp 650.000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tarif per Rombongan / Grup</label>
                  <input
                    type="text"
                    value={formData.price_per_group}
                    onChange={(e) => setFormData({ ...formData, price_per_group: e.target.value })}
                    placeholder="Contoh: Rp 3.000.000 (Min 5 Pax)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi pengalaman wisata dan keunggulan paket..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <ImageUploadInput
                label="Foto Objek Wisata / Paket Tour"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                placeholder="https://images.unsplash.com/... atau /uploads/..."
                helperText="Upload foto destinasi wisata beresolusi tinggi atau tempel link URL"
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Highlights (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Contoh: Blue Fire Ijen, Savana Baluran, Pantai Bama"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Rute / Itinerary (1 baris per tahap)</label>
                <textarea
                  rows={3}
                  value={formData.itinerary}
                  onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                  placeholder="Hari 1: Penjemputan stasiun, ke Baluran&#10;Hari 2: Dini hari ke Kawah Ijen, drop bandara"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold text-center cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-center"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Simpan Paket Tour</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelTripManager;
