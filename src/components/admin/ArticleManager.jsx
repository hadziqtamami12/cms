import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Edit2, Trash2, Check, X, RefreshCw, Sparkles,
  MapPin, Eye, ExternalLink, Globe, Layers, ArrowRight
} from 'lucide-react';
import DataTable from '../common/DataTable';
import ImageUploadInput from '../common/ImageUploadInput';

/**
 * Article & Programmatic Multi-Location SEO Manager
 */
export const ArticleManager = ({ adminToken, showToast, onOpenScraper }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' | 'create' | 'programmatic'
  const [editingArticle, setEditingArticle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [locationTagInput, setLocationTagInput] = useState('');

  // Standard / Dynamic Article Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Rental Mobil',
    location_variable: '',
    featured_image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    content: '',
    meta_title: '',
    meta_description: '',
    is_dynamic: false,
    slug_pattern: 'sewa-mobil-{lokasi}',
    focus_keyword_template: 'sewa mobil {lokasi}',
    locationsText: 'Banyuwangi, Rogojampi, Genteng, Ketapang, Songgon, Glenmore, Muncar, Kalibaru, Wongsorejo'
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

  const handleOpenCreate = (isDynamic = false) => {
    setEditingArticle(null);
    setFormData({
      title: isDynamic ? 'Sewa Mobil {Lokasi} Termurah & Terpercaya 24 Jam' : '',
      slug: isDynamic ? 'sewa-mobil-banyuwangi' : '',
      category: 'Rental Mobil',
      location_variable: '',
      featured_image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      content: isDynamic ? `Mencari layanan rental mobil terbaik dan terpercaya di wilayah {Lokasi}? Kami hadir menyediakan unit armada terlengkap tahun terbaru untuk keperluan dinas, perjalanan bisnis, liburan keluarga, maupun acara pernikahan di daerah {Lokasi} dan sekitarnya.\n\nKeunggulan Rental Mobil {Lokasi}:\n1. Armada selalu bersih, wangi, dan diservis berkala di bengkel resmi.\n2. Pilihan tarif fleksibel: Tersedia opsi Lepas Kunci 24 jam maupun dengan sopir berpengalaman yang menguasai rute {Lokasi}.\n3. Siap antar-jemput unit tepat waktu ke hotel, stasiun, bandara, atau alamat rumah Anda di area {Lokasi}.\n4. Layanan customer service 24 jam responsif untuk memudahkan reservasi instan kapan saja Anda butuhkan.\n\nHubungi tim customer service kami sekarang untuk konsultasi jadwal ketersediaan unit di {Lokasi} dan dapatkan promo tarif terbaik!` : '',
      meta_title: isDynamic ? 'Sewa Mobil {Lokasi} Murah 24 Jam - Unit Lengkap & Nyaman' : '',
      meta_description: isDynamic ? 'Pusat sewa mobil {Lokasi} lepas kunci & dengan sopir. Unit bersih terawat, pelayanan profesional, tarif termurah di {Lokasi}.' : '',
      is_dynamic: isDynamic,
      slug_pattern: 'sewa-mobil-{lokasi}',
      focus_keyword_template: 'sewa mobil {lokasi}',
      locationsText: 'Banyuwangi, Rogojampi, Genteng, Ketapang, Songgon, Glenmore, Muncar, Kalibaru, Wongsorejo'
    });
    setActiveSubTab('create');
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    let dynCfg = art.dynamic_config;
    if (typeof dynCfg === 'string') {
      try { dynCfg = JSON.parse(dynCfg); } catch (_) { dynCfg = {}; }
    }
    dynCfg = dynCfg || {};

    const locationsArr = Array.isArray(dynCfg.locations)
      ? dynCfg.locations
      : (typeof dynCfg.locations === 'string' ? dynCfg.locations.split(/[\n,]/).map(s => s.trim()).filter(Boolean) : []);

    setFormData({
      title: art.title || '',
      slug: art.slug || '',
      category: art.category || 'Umum',
      location_variable: art.location_variable || '',
      featured_image: art.featured_image || '',
      content: art.content || '',
      meta_title: art.meta_title || '',
      meta_description: art.meta_description || '',
      is_dynamic: Boolean(art.is_dynamic),
      slug_pattern: dynCfg.slug_pattern || 'sewa-mobil-{lokasi}',
      focus_keyword_template: dynCfg.focus_keyword_template || 'sewa mobil {lokasi}',
      locationsText: locationsArr.length > 0 ? locationsArr.join(', ') : 'Banyuwangi, Rogojampi, Genteng, Ketapang, Songgon'
    });
    setActiveSubTab('create');
  };

  const handleApplyDynamicPreset = () => {
    setFormData(prev => ({
      ...prev,
      is_dynamic: true,
      title: 'Sewa Mobil {Lokasi} Termurah & Terpercaya 24 Jam',
      slug: prev.slug || 'sewa-mobil-banyuwangi',
      slug_pattern: 'sewa-mobil-{lokasi}',
      focus_keyword_template: 'sewa mobil {lokasi}',
      category: 'Rental Mobil Daerah',
      locationsText: 'Banyuwangi, Rogojampi, Genteng, Ketapang, Songgon, Glenmore, Muncar, Kalibaru, Wongsorejo',
      content: `Sedang membutuhkan jasa rental mobil terpercaya di wilayah {Lokasi}? Kami siap melayani kebutuhan rental mobil {Lokasi} lepas kunci maupun dengan sopir berpengalaman untuk keperluan dinas, perjalanan wisata, perjalanan keluarga, maupun kebutuhan bisnis.\n\nKeunggulan Sewa Mobil {Lokasi} Bersama Kami:\n1. Unit Kendaraan Lengkap: Mulai dari Avanza, Xenia, Innova Reborn, Innova Zenix Hybrid, Fortuner, hingga Hiace Luxury.\n2. Kondisi Unit Prima & Bersih: Semua armada selalu dicek dan diservis berkala sebelum diserahkan ke pelanggan.\n3. Driver Profesional & Ramah: Sopir kami sangat menguasai rute jalan di {Lokasi} dan sekitarnya.\n4. Tarif Paling Bersahabat: Nikmati penawaran harga rental termurah se-{Lokasi} dengan opsi sewa harian, mingguan, atau bulanan.\n\nJangan ragu untuk menghubungi layanan pelanggan kami kapan saja untuk reservasi armada favorit Anda di area {Lokasi}!`,
      meta_title: 'Sewa Mobil {Lokasi} Murah 24 Jam - Armada Bersih & Sopir Ahli',
      meta_description: 'Pusat rental mobil di {Lokasi} terlengkap lepas kunci & dengan sopir. Booking mudah 24 jam dengan tarif termurah di {Lokasi}.'
    }));
    if (showToast) showToast('Template Dynamic Article diterapkan!');
  };

  const insertPlaceholder = (tag, targetField = 'title') => {
    setFormData(prev => ({
      ...prev,
      [targetField]: (prev[targetField] || '') + tag
    }));
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

      const parsedLocations = formData.locationsText
        ? formData.locationsText.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        location_variable: formData.location_variable,
        featured_image: formData.featured_image,
        content: formData.content,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        is_dynamic: Boolean(formData.is_dynamic),
        dynamic_config: formData.is_dynamic ? {
          slug_pattern: formData.slug_pattern || 'sewa-mobil-{lokasi}',
          focus_keyword_template: formData.focus_keyword_template || 'sewa mobil {lokasi}',
          locations: parsedLocations
        } : {}
      };

      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menyimpan artikel');

      if (showToast) showToast(json.message || 'Artikel berhasil disimpan!');
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
      render: (val, row) => {
        let dynCfg = row.dynamic_config;
        if (typeof dynCfg === 'string') {
          try { dynCfg = JSON.parse(dynCfg); } catch (_) { dynCfg = {}; }
        }
        dynCfg = dynCfg || {};
        const locs = Array.isArray(dynCfg.locations) ? dynCfg.locations : [];
        const slugPattern = dynCfg.slug_pattern || 'sewa-mobil-{lokasi}';

        return (
          <div className="space-y-1 max-w-sm">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1" title={row.title}>
                {row.title}
              </span>
              {row.is_dynamic && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black shrink-0">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Dynamic ({locs.length > 0 ? `${locs.length} Kota` : 'Multi-Slug'})</span>
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1">
              <span>{row.is_dynamic ? `/artikel/${slugPattern}` : `/artikel/${row.slug}`}</span>
            </div>
          </div>
        );
      }
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
      render: (val, row) => {
        if (row.is_dynamic) {
          let dynCfg = row.dynamic_config;
          if (typeof dynCfg === 'string') {
            try { dynCfg = JSON.parse(dynCfg); } catch (_) { dynCfg = {}; }
          }
          const locs = Array.isArray(dynCfg?.locations) ? dynCfg.locations : [];
          return (
            <div className="space-y-0.5">
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold inline-flex items-center gap-1">
                <Globe className="w-3 h-3 text-purple-500" />
                <span>{locs.length} Wilayah Target</span>
              </span>
              {locs.length > 0 && (
                <div className="text-[9px] text-slate-400 truncate max-w-[130px]" title={locs.join(', ')}>
                  {locs.slice(0, 3).join(', ')}{locs.length > 3 ? '...' : ''}
                </div>
              )}
            </div>
          );
        }
        return val ? (
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{val}</span>
          </span>
        ) : (
          <span className="text-slate-400 text-[10px]">-</span>
        );
      }
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
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${val !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
      render: (_, art) => {
        let viewSlug = art.slug;
        if (art.is_dynamic) {
          let dynCfg = art.dynamic_config;
          if (typeof dynCfg === 'string') {
            try { dynCfg = JSON.parse(dynCfg); } catch (_) { dynCfg = {}; }
          }
          const locs = Array.isArray(dynCfg?.locations) ? dynCfg.locations : [];
          const pattern = dynCfg?.slug_pattern || 'sewa-mobil-{lokasi}';
          if (locs.length > 0) {
            const firstLocSlug = locs[0].toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
            viewSlug = pattern.replace(/\{lokasi\}/gi, firstLocSlug);
          }
        }

        return (
          <div className="flex items-center justify-end gap-1.5">
            <a
              href={`/artikel/${viewSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title={art.is_dynamic ? 'Buka Contoh Slug Halaman Publik' : 'Buka Halaman Publik'}
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
        );
      }
    }
  ];

  // Helper preview list of generated slugs for current dynamic form
  const previewLocations = (formData.locationsText || '')
    .split(/[\n,]/)
    .map(s => s.trim())
    .filter(Boolean);

  const handleAddLocationTag = (tagToAdd) => {
    if (!tagToAdd) return;
    const splitTags = String(tagToAdd)
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean);
    if (splitTags.length === 0) return;

    const currentArr = (formData.locationsText || '')
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean);

    const merged = [...currentArr];
    splitTags.forEach(t => {
      if (!merged.some(existing => existing.toLowerCase() === t.toLowerCase())) {
        merged.push(t);
      }
    });

    setFormData(prev => ({
      ...prev,
      locationsText: merged.join(', ')
    }));
    setLocationTagInput('');
  };

  const handleRemoveLocationTag = (indexToRemove) => {
    const currentArr = (formData.locationsText || '')
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean);
    const updated = currentArr.filter((_, idx) => idx !== indexToRemove);
    setFormData(prev => ({
      ...prev,
      locationsText: updated.join(', ')
    }));
  };

  const handleClearAllLocations = () => {
    setFormData(prev => ({
      ...prev,
      locationsText: ''
    }));
    setLocationTagInput('');
  };

  const previewSlugs = previewLocations.slice(0, 10).map(loc => {
    const locSlug = loc.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    const pat = formData.slug_pattern || 'sewa-mobil-{lokasi}';
    return pat.replace(/\{lokasi\}/gi, locSlug);
  });

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
                Artikel & Generator SEO
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola artikel blog reguler atau buat 1 <strong>Dynamic Article</strong> multi-slug yang otomatis melahirkan puluhan halaman per daerah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'list'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              Daftar Artikel
            </button>
            {onOpenScraper && (
              <button
                type="button"
                onClick={() => onOpenScraper('articles')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 shadow-xs"
                title="Scrape artikel berita dari website kompetitor"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Scrape Artikel</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleOpenCreate(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'create' && !formData.is_dynamic
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Artikel Biasa</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreate(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'create' && formData.is_dynamic
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Dynamic Article</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('programmatic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'programmatic'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bulk Generator</span>
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
                emptyMessage="Belum ada artikel. Klik 'Tulis Artikel' atau '+ Dynamic Article'."
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

        {/* SUBTAB 2: CREATE / EDIT ARTICLE (WITH DYNAMIC ARTICLE TOGGLE) */}
        {activeSubTab === 'create' && (
          <form onSubmit={handleSaveArticle} className="mt-6 space-y-5 max-w-3xl">
            {/* TOGGLE DYNAMIC ARTICLE */}
            <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
              formData.is_dynamic
                ? 'bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-blue-50/80 border-indigo-200 shadow-xs'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${
                    formData.is_dynamic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>Dynamic Article (Multi-Slug Programmatic SEO)</span>
                      {formData.is_dynamic ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                          AKTIF
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                          NONAKTIF (Artikel Standar)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                      {formData.is_dynamic
                        ? '1 artikel master ini otomatis merender puluhan URL, judul, isi, dan fokus keyword berbeda per daerah.'
                        : 'Aktifkan toggle ini jika Anda ingin 1 artikel master bisa otomatis diakses lewat banyak slug daerah (misal: sewa-mobil-banyuwangi, sewa-mobil-rogojampi, sewa-mobil-genteng).'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_dynamic: !prev.is_dynamic }))}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    formData.is_dynamic ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                  title="Toggle Dynamic Article"
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      formData.is_dynamic ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* DYNAMIC ARTICLE CONTROLS */}
              {formData.is_dynamic && (
                <div className="mt-5 pt-4 border-t border-indigo-100/80 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-indigo-900">
                      Pengaturan Variasi & Pola Slug Daerah
                    </span>
                    <button
                      type="button"
                      onClick={handleApplyDynamicPreset}
                      className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Isi Rekomendasi Template Sewa Mobil</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Format Pola Slug Template *
                      </label>
                      <input
                        type="text"
                        value={formData.slug_pattern}
                        onChange={(e) => setFormData({ ...formData, slug_pattern: e.target.value })}
                        placeholder="sewa-mobil-{lokasi}"
                        className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
                      />
                      <span className="text-[10px] text-slate-400">Gunakan tag <code className="text-indigo-600 font-bold">{'{lokasi}'}</code> di slug.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Template Fokus Keyword *
                      </label>
                      <input
                        type="text"
                        value={formData.focus_keyword_template}
                        onChange={(e) => setFormData({ ...formData, focus_keyword_template: e.target.value })}
                        placeholder="sewa mobil {lokasi}"
                        className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
                      />
                      <span className="text-[10px] text-slate-400">Contoh: sewa mobil {'{lokasi}'}</span>
                    </div>
                  </div>

                  {/* MULTI-TAG LOCATION INPUT */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Multi-Tag Target Wilayah / Kota (Tekan Enter atau Koma) *
                      </label>
                      <div className="flex items-center gap-2">
                        {previewLocations.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllLocations}
                            className="text-[10px] font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            Hapus Semua
                          </button>
                        )}
                        <span className="text-[11px] font-mono font-bold text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
                          {previewLocations.length} Kota Terdaftar
                        </span>
                      </div>
                    </div>

                    {/* Tag Chips + Inline Input */}
                    <div className="p-2 sm:p-2.5 rounded-2xl border border-indigo-200 bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent transition-all flex flex-wrap items-center gap-1.5 min-h-[56px]">
                      {previewLocations.map((loc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold shadow-2xs animate-fade-in"
                        >
                          <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>{loc}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLocationTag(idx)}
                            className="p-0.5 rounded-full text-indigo-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Hapus ${loc}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      <input
                        type="text"
                        value={locationTagInput}
                        onChange={(e) => setLocationTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            handleAddLocationTag(locationTagInput);
                          }
                        }}
                        onBlur={() => {
                          if (locationTagInput.trim()) {
                            handleAddLocationTag(locationTagInput);
                          }
                        }}
                        onPaste={(e) => {
                          const pasteData = e.clipboardData.getData('text');
                          if (pasteData && (pasteData.includes(',') || pasteData.includes('\n'))) {
                            e.preventDefault();
                            handleAddLocationTag(pasteData);
                          }
                        }}
                        placeholder={previewLocations.length === 0 ? "Ketik nama kota lalu tekan Enter atau koma (contoh: Banyuwangi)..." : "Tambah kota lagi..."}
                        className="flex-1 min-w-[160px] px-2 py-1 text-xs text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
                      />

                      {locationTagInput.trim() && (
                        <button
                          type="button"
                          onClick={() => handleAddLocationTag(locationTagInput)}
                          className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah</span>
                        </button>
                      )}
                    </div>

                    {/* Quick Preset City Chips */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Preset Kota Cepat (Klik untuk menambah):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {['Banyuwangi', 'Rogojampi', 'Genteng', 'Ketapang', 'Songgon', 'Surabaya', 'Malang', 'Bali', 'Jakarta', 'Bandung', 'Yogyakarta'].map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleAddLocationTag(city)}
                            disabled={previewLocations.some(l => l.toLowerCase() === city.toLowerCase())}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                              previewLocations.some(l => l.toLowerCase() === city.toLowerCase())
                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                            }`}
                          >
                            + {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW GENERATED SLUGS CHIPS */}
                  {previewSlugs.length > 0 && (
                    <div className="space-y-1.5 bg-white/70 p-3.5 rounded-2xl border border-indigo-100">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>Preview Contoh URL Slug yang Terbentuk Otomatis:</span>
                        <span className="text-[10px] text-indigo-600 font-mono">Total {previewLocations.length} Halaman Siap Akses</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {previewSlugs.map((slugStr, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-[10px]"
                          >
                            /artikel/{slugStr}
                          </span>
                        ))}
                        {previewLocations.length > 10 && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono text-[10px]">
                            +{previewLocations.length - 10} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* VARIABLE CHEATSHEET */}
                  <div className="p-3 rounded-2xl bg-indigo-100/50 border border-indigo-200/60 text-xs space-y-1.5">
                    <span className="font-bold text-indigo-900 block text-[11px]">
                      Pintasan Tag Placeholder (Klik untuk sisipkan):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => insertPlaceholder('{Lokasi}', 'title')}
                        className="px-2 py-0.5 rounded-md bg-white text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200 hover:bg-indigo-50"
                        title="Nama Kota Title Case (Contoh: Banyuwangi)"
                      >
                        + {'{Lokasi}'} (Banyuwangi)
                      </button>
                      <button
                        type="button"
                        onClick={() => insertPlaceholder('{lokasi}', 'content')}
                        className="px-2 py-0.5 rounded-md bg-white text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200 hover:bg-indigo-50"
                        title="Nama Kota huruf kecil (Contoh: banyuwangi)"
                      >
                        + {'{lokasi}'} (banyuwangi)
                      </button>
                      <button
                        type="button"
                        onClick={() => insertPlaceholder('{keyword}', 'content')}
                        className="px-2 py-0.5 rounded-md bg-white text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200 hover:bg-indigo-50"
                        title="Fokus Keyword"
                      >
                        + {'{keyword}'}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertPlaceholder('{nama_web}', 'title')}
                        className="px-2 py-0.5 rounded-md bg-white text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200 hover:bg-indigo-50"
                        title="Nama Brand / Website Kita"
                      >
                        + {'{nama_web}'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* JUDUL ARTIKEL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Judul Artikel * {formData.is_dynamic && <span className="text-indigo-600 font-normal">(Gunakan tag {'{Lokasi}'})</span>}
                </label>
                {formData.is_dynamic && (
                  <button
                    type="button"
                    onClick={() => insertPlaceholder(' {Lokasi}', 'title')}
                    className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    + Sisipkan {'{Lokasi}'}
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={formData.is_dynamic ? "Contoh: Sewa Mobil {Lokasi} Termurah & Terpercaya 24 Jam" : "Contoh: Tips Memilih Rental Mobil Nyaman Untuk Liburan Keluarga"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {formData.is_dynamic ? 'Master Slug Ref' : 'Custom Slug (Opsional)'}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={formData.is_dynamic ? "sewa-mobil-banyuwangi" : "tips-rental-mobil-keluarga"}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Rental Mobil Daerah"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {formData.is_dynamic ? 'Status Lokasi' : 'Lokasi Spesifik'}
                </label>
                <input
                  type="text"
                  disabled={formData.is_dynamic}
                  value={formData.is_dynamic ? 'Otomatis Sesuai Slug Target' : formData.location_variable}
                  onChange={(e) => setFormData({ ...formData, location_variable: e.target.value })}
                  placeholder="Contoh: Banyuwangi"
                  className={`w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    formData.is_dynamic ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            <ImageUploadInput
              label="Foto Sampul Artikel (Featured Image)"
              value={formData.featured_image}
              onChange={(val) => setFormData({ ...formData, featured_image: val })}
              placeholder="https://images.unsplash.com/... atau /uploads/..."
              helperText="Upload gambar sampul artikel resolusi tinggi atau tempel link URL"
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Konten Artikel Lengkap * {formData.is_dynamic && <span className="text-indigo-600 font-normal">(Tag {'{Lokasi}'} akan diganti otomatis)</span>}
                </label>
                {formData.is_dynamic && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => insertPlaceholder(' {Lokasi}', 'content')}
                      className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      + {'{Lokasi}'}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholder(' {keyword}', 'content')}
                      className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      + {'{keyword}'}
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={10}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={formData.is_dynamic ? "Tulis isi artikel dengan menyisipkan {Lokasi} di kalimat yang ingin dinamiskan..." : "Tuliskan isi artikel Anda di sini..."}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 leading-relaxed font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Meta Title SEO (Opsional)</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder={formData.is_dynamic ? "Sewa Mobil {Lokasi} Murah 24 Jam" : "Meta Title"}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Meta Description SEO (Opsional)</label>
                <input
                  type="text"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder={formData.is_dynamic ? "Layanan sewa mobil {Lokasi} terpercaya dengan unit prima dan tarif termurah." : "Meta Description"}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{formData.is_dynamic ? 'Simpan Dynamic Article' : 'Simpan Artikel'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('list')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
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
