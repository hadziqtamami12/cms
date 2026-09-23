import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Edit2, Trash2, Check, X, RefreshCw, Sparkles,
  MapPin, Eye, ExternalLink, Globe, Layers, ArrowRight
} from 'lucide-react';
import DataTable from '../common/DataTable';

/**
 * Article & Programmatic Multi-Location SEO Manager
 */
export const ArticleManager = ({ adminToken, showToast }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' | 'create' | 'programmatic'
  const [editingArticle, setEditingArticle] = useState(null);
  const [saving, setSaving] = useState(false);

  // Standard Article Form
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Rental Mobil',
    location_variable: '',
    featured_image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    content: '',
    meta_title: '',
    meta_description: ''
  });

  // Programmatic Generator Form
  const [progForm, setProgForm] = useState({
    titleTemplate: 'Sewa Mobil {lokasi} Murah & Terpercaya 24 Jam',
    slugTemplate: 'sewa-mobil-{lokasi}',
    category: 'Rental Mobil Daerah',
    locationsText: 'Banyuwangi, Rogojampi, Genteng, Ketapang, Songgon, Glenmore, Muncar, Kalibaru, Wongsorejo',
    featuredImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    contentTemplate: `Mencari layanan sewa mobil terpercaya di wilayah {lokasi}? Kami hadir menyediakan unit armada terlengkap tahun terbaru untuk keperluan dinas, perjalanan bisnis, liburan keluarga, maupun acara pernikahan di daerah {lokasi} dan sekitarnya.\n\nKeunggulan Rental Mobil {lokasi}:\n1. Armada selalu bersih, wangi, dan diservis berkala di bengkel terpercaya.\n2. Pilihan tarif fleksibel: Tersedia opsi Lepas Kunci 24 jam maupun dengan sopir berpengalaman yang menguasai rute {lokasi}.\n3. Siap antar-jemput unit tepat waktu ke hotel, stasiun, bandara, atau alamat rumah Anda di area {lokasi}.\n4. Layanan customer service 24 jam responsif untuk memudahkan reservasi instan kapan saja Anda butuhkan.\n\nHubungi kontak customer service kami hari ini untuk konsultasi jadwal ketersediaan unit di {lokasi} dan nikmati promo tarif terbaik!`
  });
  const [generating, setGenerating] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/articles/manage', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (json.success && Array.isArray(json.data)) {
        setArticles(json.data);
      }
    } catch (err) {
      console.warn('[ArticleManager] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Rental Mobil',
      location_variable: '',
      featured_image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      content: '',
      meta_title: '',
      meta_description: ''
    });
    setActiveSubTab('create');
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title || '',
      slug: art.slug || '',
      category: art.category || 'Umum',
      location_variable: art.location_variable || '',
      featured_image: art.featured_image || '',
      content: art.content || '',
      meta_title: art.meta_title || '',
      meta_description: art.meta_description || ''
    });
    setActiveSubTab('create');
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Judul dan isi konten artikel wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const url = editingArticle
        ? `/api/admin/articles/manage/${editingArticle.id}`
        : `/api/admin/articles/manage`;
      const method = editingArticle ? 'PUT' : 'POST';

      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(formData)
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menyimpan artikel');

      if (showToast) showToast('Artikel berhasil disimpan!');
      setActiveSubTab('list');
      fetchArticles();
    } catch (err) {
      alert('Gagal simpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Hapus artikel "${title}"?`)) return;
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch(`/api/admin/articles/manage/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menghapus artikel');
      if (showToast) showToast('Artikel berhasil dihapus');
      fetchArticles();
    } catch (err) {
      alert('Gagal hapus: ' + err.message);
    }
  };

  // Bulk Delete Articles
  const handleBulkDeleteArticles = async (ids) => {
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/articles/batch-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ ids })
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menghapus batch artikel');
      if (showToast) showToast(json.message);
      fetchArticles();
    } catch (err) {
      alert('Gagal bulk delete: ' + err.message);
    }
  };

  // Bulk Status Update Articles (Publish / Draft)
  const handleBulkStatusArticles = async (ids, status) => {
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/articles/batch-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ ids, status })
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal update status batch');
      if (showToast) showToast(json.message);
      fetchArticles();
    } catch (err) {
      alert('Gagal bulk status: ' + err.message);
    }
  };

  const handleRunProgrammatic = async (e) => {
    e.preventDefault();
    const locs = progForm.locationsText.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    if (locs.length === 0) {
      alert('Masukkan minimal 1 nama lokasi target');
      return;
    }

    setGenerating(true);
    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/articles/generate-programmatic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          titleTemplate: progForm.titleTemplate,
          slugTemplate: progForm.slugTemplate,
          contentTemplate: progForm.contentTemplate,
          locations: locs,
          category: progForm.category,
          featuredImage: progForm.featuredImage
        })
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal generate');

      if (showToast) showToast(json.message);
      setActiveSubTab('list');
      fetchArticles();
    } catch (err) {
      alert('Gagal generate programmatic SEO: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // DataTable Column Definitions
  const articleColumns = [
    {
      key: 'title',
      label: 'Judul Artikel & Slug',
      sortable: true,
      render: (val, row) => (
        <div className="space-y-0.5 max-w-sm">
          <div className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1" title={row.title}>
            {row.title}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            /artikel/{row.slug}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Kategori',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
          {val || 'Umum'}
        </span>
      )
    },
    {
      key: 'location_variable',
      label: 'Lokasi Target',
      sortable: true,
      render: (val) => val ? (
        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{val}</span>
        </span>
      ) : (
        <span className="text-slate-400 text-[10px]">-</span>
      )
    },
    {
      key: 'views_count',
      label: 'Pembaca',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-xs font-bold text-slate-700">
          {(Number(val) || 0).toLocaleString('id-ID')}
        </span>
      )
    },
    {
      key: 'is_published',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          val !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {val !== false ? 'Terbit' : 'Draf'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Tanggal Dibuat',
      sortable: true,
      render: (val) => (
        <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
          {val ? new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      sortable: false,
      className: 'text-right',
      render: (_, art) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`/artikel/${art.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Buka Halaman Publik"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={() => handleOpenEdit(art)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Edit Artikel"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteArticle(art.id, art.title)}
            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Hapus Artikel"
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
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Artikel & Generator Programmatic SEO
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                {articles.length} Artikel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola artikel blog reguler atau duplikasi master artikel ke puluhan lokasi target secara otomatis dengan fitur DataTable modern.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'list'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Daftar Artikel
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'create'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Artikel</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('programmatic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'programmatic'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Programmatic SEO</span>
            </button>
          </div>
        </div>

        {/* SUBTAB 1: ARTICLES LIST (POWERED BY MODERN DATATABLE) */}
        {activeSubTab === 'list' && (
          <div className="mt-6">
            {loading ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                <p className="text-xs font-medium">Memuat data artikel...</p>
              </div>
            ) : (
              <DataTable
                columns={articleColumns}
                data={articles}
                rowKey="id"
                searchPlaceholder="Cari judul artikel, kategori, atau lokasi target..."
                emptyMessage="Belum ada artikel. Klik 'Tulis Artikel' atau gunakan 'Programmatic SEO'."
                onBulkDelete={handleBulkDeleteArticles}
                onBulkStatusUpdate={handleBulkStatusArticles}
                bulkStatusOptions={[
                  { label: 'Set Terbit (Aktif)', value: 'active', color: 'emerald' },
                  { label: 'Set Draf (Nonaktif)', value: 'inactive', color: 'amber' }
                ]}
              />
            )}
          </div>
        )}

        {/* SUBTAB 2: CREATE / EDIT ARTICLE */}
        {activeSubTab === 'create' && (
          <form onSubmit={handleSaveArticle} className="mt-6 space-y-4 max-w-3xl">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Judul Artikel *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Tips Memilih Rental Mobil Nyaman Untuk Liburan Keluarga"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Custom Slug (Opsional)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="tips-rental-mobil-keluarga"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Tips Rental / Berita"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Lokasi (Opsional)</label>
                <input
                  type="text"
                  value={formData.location_variable}
                  onChange={(e) => setFormData({ ...formData, location_variable: e.target.value })}
                  placeholder="Contoh: Jakarta Selatan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">URL Gambar Utama (Featured Image)</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Konten Artikel Lengkap *</label>
              <textarea
                rows={10}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tuliskan isi artikel Anda di sini..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 leading-relaxed font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Simpan Artikel</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('list')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* SUBTAB 3: PROGRAMMATIC SEO GENERATOR */}
        {activeSubTab === 'programmatic' && (
          <form onSubmit={handleRunProgrammatic} className="mt-6 space-y-5 max-w-3xl">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs text-emerald-800">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Multi-Location SEO Automation Engine</span>
              </div>
              <p>
                Fitur ini menduplikasi satu master template menjadi puluhan halaman landing artikel unik untuk tiap kecamatan, kota, atau daerah tujuan dengan automated slug, canonical URL, dan Schema Markup.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Master Judul Template (Gunakan placeholder {'{lokasi}'}) *
              </label>
              <input
                type="text"
                required
                value={progForm.titleTemplate}
                onChange={(e) => setProgForm({ ...progForm, titleTemplate: e.target.value })}
                placeholder="Sewa Mobil {lokasi} Murah & Terpercaya 24 Jam"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-[11px] text-slate-400">Contoh hasil: "Sewa Mobil Genteng Murah & Terpercaya 24 Jam"</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Slug Template</label>
                <input
                  type="text"
                  value={progForm.slugTemplate}
                  onChange={(e) => setProgForm({ ...progForm, slugTemplate: e.target.value })}
                  placeholder="sewa-mobil-{lokasi}"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Kategori</label>
                <input
                  type="text"
                  value={progForm.category}
                  onChange={(e) => setProgForm({ ...progForm, category: e.target.value })}
                  placeholder="Rental Mobil Daerah"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Daftar Lokasi Target (Pisahkan dengan koma atau baris baru) *
              </label>
              <textarea
                rows={3}
                required
                value={progForm.locationsText}
                onChange={(e) => setProgForm({ ...progForm, locationsText: e.target.value })}
                placeholder="Banyuwangi, Rogojampi, Genteng, Ketapang, Songgon, Glenmore, Muncar, Kalibaru, Wongsorejo"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 font-mono"
              />
              <span className="text-[11px] text-slate-400">
                Total lokasi terdeteksi: {progForm.locationsText.split(/[\n,]/).map(s => s.trim()).filter(Boolean).length} daerah
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Master Konten Template (Gunakan placeholder {'{lokasi}'}) *
              </label>
              <textarea
                rows={8}
                required
                value={progForm.contentTemplate}
                onChange={(e) => setProgForm({ ...progForm, contentTemplate: e.target.value })}
                placeholder="Tulis artikel dengan menyisipkan kata {lokasi}..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 leading-relaxed font-mono text-[11px]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={generating}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menghasilkan Puluhan Artikel...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Generate Multi-Location Articles</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ArticleManager;
