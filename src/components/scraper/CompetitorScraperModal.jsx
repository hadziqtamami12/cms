import React, { useState, useEffect } from 'react';
import {
  Globe, Search, Download, Check, X, AlertCircle, RefreshCw,
  ExternalLink, Sparkles, Image as ImageIcon, Tag, KeyRound, UserCheck,
  Plus, Edit2, Trash2, CheckCircle2, ChevronRight, Layers, SlidersHorizontal,
  ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';

/**
 * Competitor Scraper & Content Extraction Modal
 * Extracts product/unit data, images, prices, and specs from competitor websites
 * with multi-stage animated loading screen, custom manual product creation,
 * inline editing, image gallery switching, and one-click import into catalog.
 */
export const CompetitorScraperModal = ({
  isOpen,
  onClose,
  adminToken,
  onImportSuccess,
  showToast
}) => {
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [importing, setImporting] = useState(false);

  // Multi-step Loading Animation State
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  // Manual / Custom Product Creation & Editing State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    category: 'Rental Mobil',
    price_self_drive: 'Rp 450.000',
    price_with_driver: 'Rp 650.000',
    image: '',
    specs: 'Matic / Manual, 7 Penumpang, AC Bersih'
  });

  const loadingSteps = [
    { title: 'Menghubungi Server Target', desc: 'Melakukan handshake HTTP dan mengabaikan bot protection...' },
    { title: 'Mengekstrak DOM & Tabel', desc: 'Membaca struktur tabel sewa, JSON-LD, dan metadata halaman...' },
    { title: 'Mendeteksi Skema Tarif', desc: 'Memetakan harga Lepas Kunci, tarif Sopir, dan format multi-tier...' },
    { title: 'Mengidentifikasi Aset Gambar', desc: 'Menemukan foto resolusi tinggi, srcset, dan lazy-load images...' },
    { title: 'Menyusun Katalog Siap Pakai', desc: 'Menghilangkan duplikat dan menyiapkan pratinjau impor...' }
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      setProgressStep(0);
      setProgressPercent(15);
      interval = setInterval(() => {
        setProgressPercent(prev => {
          if (prev < 92) {
            const next = prev + Math.floor(Math.random() * 10) + 4;
            const stepIdx = Math.min(loadingSteps.length - 1, Math.floor((next / 100) * loadingSteps.length));
            setProgressStep(stepIdx);
            return Math.min(next, 94);
          }
          return prev;
        });
      }, 650);
    } else {
      setProgressPercent(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!targetUrl.trim() || !targetUrl.startsWith('http')) {
      setError('Masukkan URL web yang valid (diawali dengan http:// atau https://)');
      return;
    }

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/scraper/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        throw new Error(
          res.status === 504 || res.status === 408
            ? 'Waktu koneksi ke website target habis (Timeout). Website kompetitor lambat merespons atau mengaktifkan bot protection.'
            : `Respons server tidak valid (HTTP ${res.status}): ${text.slice(0, 150) || 'Koneksi terputus'}`
        );
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || `Gagal menganalisis URL kompetitor (HTTP ${res.status})`);
      }

      setParsedData(json);
      // Select all by default
      setSelectedItems((json.data || []).map(item => item.id));
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memproses URL');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (!parsedData?.data) return;
    if (selectedItems.length === parsedData.data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(parsedData.data.map(i => i.id));
    }
  };

  // Open Add Manual Form ("Bisa Bikin Sendiri")
  const handleOpenAddManual = () => {
    setEditingItem(null);
    setItemForm({
      title: '',
      category: 'Rental Mobil',
      price_self_drive: 'Rp 450.000',
      price_with_driver: 'Rp 650.000',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      specs: 'Matic, 7 Seat, AC Dingin, Audio Bluetooth'
    });
    setIsFormOpen(true);
  };

  // Open Edit Item Form
  const handleOpenEditItem = (item, e) => {
    e?.stopPropagation();
    setEditingItem(item);
    setItemForm({
      title: item.title || '',
      category: item.category || 'Rental Mobil',
      price_self_drive: item.price_self_drive || item.price || 'Rp 450.000',
      price_with_driver: item.price_with_driver || 'Rp 650.000',
      image: item.image || '',
      specs: Array.isArray(item.specs) ? item.specs.join(', ') : (item.specs || '')
    });
    setIsFormOpen(true);
  };

  // Save Manual / Edited Item
  const handleSaveItemForm = (e) => {
    e.preventDefault();
    if (!itemForm.title.trim()) {
      alert('Nama produk / armada wajib diisi');
      return;
    }

    const specsArr = itemForm.specs.split(',').map(s => s.trim()).filter(Boolean);
    const selfDrivePrice = itemForm.price_self_drive || 'Rp 450.000';
    const withDriverPrice = itemForm.price_with_driver || 'Rp 650.000';
    const mainImg = itemForm.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

    if (editingItem) {
      // Update existing item
      const updatedList = (parsedData?.data || []).map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            title: itemForm.title.trim(),
            category: itemForm.category,
            price: selfDrivePrice,
            price_self_drive: selfDrivePrice,
            price_with_driver: withDriverPrice,
            image: mainImg,
            specs: specsArr.length > 0 ? specsArr : ['Unit Nyaman', 'AC Dingin', 'Layanan Prima'],
            pricing_tiers: [
              { label: 'Lepas Kunci', price: selfDrivePrice, unit: '/24 jam', is_default: true },
              { label: 'Dengan Sopir', price: withDriverPrice, unit: '/12 jam', is_default: false }
            ]
          };
        }
        return item;
      });

      setParsedData(prev => ({
        ...prev,
        data: updatedList
      }));
    } else {
      // Add new item
      const newItemId = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const newItem = {
        id: newItemId,
        title: itemForm.title.trim(),
        category: itemForm.category,
        price: selfDrivePrice,
        price_self_drive: selfDrivePrice,
        price_with_driver: withDriverPrice,
        period: '/hari',
        badge: 'Unit Kustom',
        specs: specsArr.length > 0 ? specsArr : ['Unit Nyaman', 'AC Dingin', 'Layanan Prima'],
        image: mainImg,
        images: [mainImg],
        pricing_tiers: [
          { label: 'Lepas Kunci', price: selfDrivePrice, unit: '/24 jam', is_default: true },
          { label: 'Dengan Sopir', price: withDriverPrice, unit: '/12 jam', is_default: false }
        ],
        description: `${itemForm.title.trim()} kondisi prima, siap pakai dengan pelayanan terbaik.`
      };

      setParsedData(prev => ({
        ...(prev || { meta: { sourceUrl: 'Manual Input' } }),
        data: [newItem, ...(prev?.data || [])]
      }));

      setSelectedItems(prev => [newItemId, ...prev]);
    }

    setIsFormOpen(false);
  };

  // Remove single item from parsed results
  const handleRemoveItem = (id, e) => {
    e?.stopPropagation();
    setParsedData(prev => ({
      ...prev,
      data: (prev?.data || []).filter(item => item.id !== id)
    }));
    setSelectedItems(prev => prev.filter(i => i !== id));
  };

  // Switch image thumbnail on a scraped card
  const handleSelectImageForCard = (itemId, newImageUrl, e) => {
    e?.stopPropagation();
    setParsedData(prev => ({
      ...prev,
      data: (prev?.data || []).map(item =>
        item.id === itemId ? { ...item, image: newImageUrl } : item
      )
    }));
  };

  // Final Import Handler
  const handleImport = async () => {
    if (!parsedData?.data || selectedItems.length === 0) {
      alert('Pilih minimal satu item untuk diimpor');
      return;
    }

    const itemsToImport = parsedData.data.filter(item => selectedItems.includes(item.id));
    setImporting(true);

    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      const res = await fetch('/api/admin/scraper/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ items: itemsToImport })
      });

      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        throw new Error(`Respons server tidak valid saat impor (HTTP ${res.status}): ${text.slice(0, 150) || 'Koneksi terputus'}`);
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || `Gagal mengimpor produk (HTTP ${res.status})`);
      }

      if (showToast) {
        showToast(`Berhasil mengimpor ${itemsToImport.length} produk ke katalog aplikasi!`);
      }
      if (onImportSuccess) {
        onImportSuccess(itemsToImport);
      }
      onClose();
    } catch (err) {
      alert(`Gagal impor: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden max-h-[92vh] flex flex-col min-w-0">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>Alat Analisis & Ekstraksi Data Kompetitor</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  AI & DOM Scraper
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Ekstrak otomatis seluruh harga, gambar HD, spesifikasi dari web target atau buat unit kustom sendiri
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* URL Input Bar & Action Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              URL Website Target (Kompetitor / Sumber Data)
            </label>
            <button
              type="button"
              onClick={handleOpenAddManual}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input / Bikin Sendiri Manual</span>
            </button>
          </div>

          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                disabled={loading}
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Contoh: https://rentalmobil-kompetitor.com/armada atau https://travel.com/paket"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memindai...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Mulai Ekstraksi URL</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Dynamic Content Area: Loading Screen / Initial State / Results Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* 1. DEDICATED HIGH-TECH ANIMATED LOADING SCREEN */}
          {loading && (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              {/* Radar Scanner Animation */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/15 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-blue-400 border-dashed animate-spin duration-1000" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 animate-pulse text-blue-100" />
                </div>
              </div>

              {/* Status Header */}
              <div className="space-y-1.5 max-w-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[260px]">{targetUrl.replace(/^https?:\/\//, '')}</span>
                </span>
                <h4 className="text-lg font-black text-slate-900 tracking-tight">
                  {loadingSteps[progressStep]?.title || 'Sedang Mengekstrak Konten Web...'}
                </h4>
                <p className="text-xs text-slate-500">
                  {loadingSteps[progressStep]?.desc || 'Memindai seluruh struktur halaman dan harga...'}
                </p>
              </div>

              {/* Progress Bar & Percentage */}
              <div className="w-full max-w-md space-y-2">
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Tahap {progressStep + 1} dari {loadingSteps.length}</span>
                  <span className="font-bold text-blue-600">{progressPercent}%</span>
                </div>
              </div>

              {/* Scraper Highlights / Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-lg text-[11px] text-slate-500 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="font-bold text-slate-800 block">✓ Lazy-Loaded Images</span>
                  <span>Mengambil aset HD & srcset</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="font-bold text-slate-800 block">✓ Skema Dual-Tarif</span>
                  <span>Lepas Kunci & Sopir</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="font-bold text-slate-800 block">✓ Tabel & Kartu DOM</span>
                  <span>Mendeteksi seluruh baris data</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. INITIAL EMPTY STATE */}
          {!parsedData && !loading && (
            <div className="py-14 text-center text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
                <Globe className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-800">
                  Siap Mengekstrak Produk & Tarif Kompetitor
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Ketik atau tempel URL website kompetitor di atas, lalu klik <strong>Mulai Ekstraksi URL</strong>.
                  Atau klik <strong>"Input / Bikin Sendiri Manual"</strong> untuk membuat unit sendiri secara cepat.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenAddManual}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bikin Produk Sendiri Manual</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. PARSED RESULTS LIST */}
          {parsedData && !loading && (
            <div className="space-y-4">
              {/* Toolbar Summary & Selection Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Hasil Deteksi: {parsedData.data.length} Unit / Produk Ditemukan
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Siap Diimpor
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-lg">
                    Sumber: {parsedData.meta?.pageTitle || targetUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    {selectedItems.length === parsedData.data.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddManual}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Manual</span>
                  </button>

                  <div className="text-xs font-semibold text-slate-600 pl-2">
                    <strong>{selectedItems.length}</strong>/{parsedData.data.length} dipilih
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedData.data.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelectItem(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/30 shadow-sm ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex gap-3.5">
                        {/* Checkbox */}
                        <div className="pt-0.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                              isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Thumbnail Image */}
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative group">
                          <img
                            src={item.image}
                            alt={item.title}
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'; }}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {Array.isArray(item.images) && item.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono font-bold flex items-center gap-0.5">
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>{item.images.length}</span>
                            </span>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold truncate max-w-[130px]">
                              {item.category || 'Rental Mobil'}
                            </span>

                            {/* Card Actions: Edit & Remove */}
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => handleOpenEditItem(item, e)}
                                className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white"
                                title="Edit data unit ini"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveItem(item.id, e)}
                                className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-white"
                                title="Hapus dari daftar ini"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <h5 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2" title={item.title}>
                            {item.title}
                          </h5>

                          {/* Dual Pricing Preview */}
                          <div className="grid grid-cols-2 gap-1 text-[11px] bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Lepas Kunci</span>
                              <span className="font-black text-slate-900 font-mono text-xs">{item.price_self_drive}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-600 block font-bold uppercase tracking-wider">+ Sopir</span>
                              <span className="font-black text-blue-700 font-mono text-xs">{item.price_with_driver}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Gallery Switcher (if multiple images found) */}
                      {Array.isArray(item.images) && item.images.length > 1 && (
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0">Pilih Foto ({item.images.length}):</span>
                          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
                            {item.images.slice(0, 8).map((imgUrl, iIdx) => (
                              <button
                                key={iIdx}
                                type="button"
                                title={`Pilih foto varian ${iIdx + 1}`}
                                onClick={(e) => handleSelectImageForCard(item.id, imgUrl, e)}
                                className={`w-7 h-7 rounded-md overflow-hidden border transition-all shrink-0 cursor-pointer ${
                                  item.image === imgUrl ? 'border-blue-600 ring-2 ring-blue-500/50 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img src={imgUrl} alt={`Thumbnail option ${iIdx + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Specs tags */}
                      {Array.isArray(item.specs) && item.specs.length > 0 && (
                        <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-100">
                          {item.specs.join(' • ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {parsedData && !loading && (
          <footer className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-600">
              <strong className="font-bold text-slate-900">{selectedItems.length}</strong> dari {parsedData.data.length} produk siap dimasukkan ke katalog
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={importing || selectedItems.length === 0}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan & Mengunduh Foto...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Impor ke Produk ({selectedItems.length})</span>
                  </>
                )}
              </button>
            </div>
          </footer>
        )}
      </div>

      {/* MODAL: INPUT / BIKIN SENDIRI MANUAL & EDIT FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h4 className="font-extrabold text-sm text-slate-900">
                {editingItem ? 'Edit Data Unit Sebelum Impor' : 'Bikin / Tambah Unit Sendiri'}
              </h4>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleSaveItemForm} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Nama Produk / Unit Armada *</label>
                <input
                  type="text"
                  required
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="Contoh: Toyota All New Avanza 2024"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Kategori</label>
                  <input
                    type="text"
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    placeholder="Rental Mobil"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">URL Gambar</label>
                  <input
                    type="url"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Tarif Lepas Kunci</label>
                  <input
                    type="text"
                    value={itemForm.price_self_drive}
                    onChange={(e) => setItemForm({ ...itemForm, price_self_drive: e.target.value })}
                    placeholder="Rp 450.000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-blue-700">Tarif Dengan Sopir</label>
                  <input
                    type="text"
                    value={itemForm.price_with_driver}
                    onChange={(e) => setItemForm({ ...itemForm, price_with_driver: e.target.value })}
                    placeholder="Rp 650.000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-blue-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Spesifikasi (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={itemForm.specs}
                  onChange={(e) => setItemForm({ ...itemForm, specs: e.target.value })}
                  placeholder="Matic, 7 Seat, AC Dingin, Bensin Irit"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Daftar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorScraperModal;
