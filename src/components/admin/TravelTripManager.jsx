import React, { useState, useEffect } from 'react';
import {
  Compass, Plus, Edit2, Trash2, Check, X, RefreshCw, Star, Clock,
  Image as ImageIcon, MapPin, LayoutGrid, Table, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import DataTable from '../common/DataTable';
import ImageUploadInput from '../common/ImageUploadInput';

/**
 * Travel Trip Manager for Admin Dashboard
 * Manages tour packages and travel trips in the database with modern DataTable
 */
export const TravelTripManager = ({ adminToken, showToast, onOpenScraper }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [saving, setSaving] = useState(false);

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
      const res = await fetch('/api/admin/travel-trips/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menyimpan');

      if (showToast) showToast('Paket tour berhasil disimpan ke database!');
      setIsModalOpen(false);
      fetchTrips();
    } catch (err) {
      alert('Gagal simpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus paket tour "${title}"?`)) return;
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch(`/api/admin/travel-trips/manage/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menghapus');
      if (showToast) showToast('Paket tour berhasil dihapus');
      fetchTrips();
    } catch (err) {
      alert('Gagal hapus: ' + err.message);
    }
  };

  // Bulk Delete Handler
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
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menghapus paket tour terpilih');

      if (showToast) showToast(json.message || `Berhasil menghapus ${ids.length} paket tour!`);
      fetchTrips();
    } catch (err) {
      alert('Gagal bulk delete: ' + err.message);
    }
  };

  // Bulk Status Update Handler
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
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal mengubah status paket tour');

      if (showToast) showToast(json.message || `Status ${ids.length} paket tour berhasil diperbarui!`);
      fetchTrips();
    } catch (err) {
      alert('Gagal bulk status update: ' + err.message);
    }
  };

  // DataTable Column Definitions
  const tripColumns = [
    {
      key: 'title',
      label: 'Paket Wisata & Destinasi',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <img
              src={Array.isArray(row.images) ? row.images[0] : (row.image || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=400&q=80')}
              alt={val}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 text-xs truncate max-w-xs">{val}</div>
            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              <span>/{row.slug || '-'}</span>
              {row.badge && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-100">
                  {row.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Durasi',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{val || '-'}</span>
        </span>
      )
    },
    {
      key: 'price_per_pax',
      label: 'Tarif Per Pax',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-slate-900 font-mono text-xs">
          {val || '-'}
        </span>
      )
    },
    {
      key: 'price_per_group',
      label: 'Tarif Group',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-emerald-700 font-mono text-xs">
          {val || '-'}
        </span>
      )
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const isActive = val !== false;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            isActive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Aksi',
      sortable: false,
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleDelete(row.id, row.title)}
            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
            title="Hapus paket"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Manajemen Paket Wisata & Tour
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola daftar paket tour wisata, rincian itinerary harian, dan tarif per pax / group.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
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

            {onOpenScraper && (
              <button
                type="button"
                onClick={() => onOpenScraper('travel')}
                className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Scrape paket tour & destinasi wisata dari website kompetitor"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Scrape Paket Wisata</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Paket Wisata</span>
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
              emptyMessage="Belum ada paket wisata. Klik 'Tambah Paket Wisata' untuk membuat paket baru."
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
                    src={Array.isArray(trip.images) ? trip.images[0] : (trip.image || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80')}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  {trip.duration && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[10px]">
                      {trip.duration}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{trip.description}</p>
                    <div className="mt-2 text-xs font-bold text-emerald-700">
                      Pax: {trip.price_per_pax} • Group: {trip.price_per_group}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(trip.id, trip.title)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Trip */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-base text-slate-900">
                Tambah Paket Tour & Wisata Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Judul Paket Tour *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Paket Eksplorasi Kawah Ijen & TN Baluran 2H1M"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Durasi</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Contoh: 2 Hari 1 Malam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Badge Label</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Paling Populer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tarif Per Pax</label>
                  <input
                    type="text"
                    value={formData.price_per_pax}
                    onChange={(e) => setFormData({ ...formData, price_per_pax: e.target.value })}
                    placeholder="Rp 750.000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tarif Group</label>
                  <input
                    type="text"
                    value={formData.price_per_group}
                    onChange={(e) => setFormData({ ...formData, price_per_group: e.target.value })}
                    placeholder="Rp 3.500.000 (Min 5 Pax)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
