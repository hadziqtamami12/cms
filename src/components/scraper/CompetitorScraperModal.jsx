import React, { useState, useEffect } from 'react';
import {
  Globe, Search, Download, Check, X, AlertCircle, RefreshCw,
  ExternalLink, Sparkles, Image as ImageIcon, Tag, KeyRound, UserCheck,
  Plus, Edit2, Trash2, CheckCircle2, ChevronRight, Layers, SlidersHorizontal,
  ArrowRight, ShieldCheck, HelpCircle, Package, Compass, Sliders, FileText,
  Clock, MapPin
} from 'lucide-react';

/**
 * Competitor Scraper & Content Extraction Modal
 * Supports:
 * - Produk / Armada ('products')
 * - Paket Wisata ('travel') [Automotive / Rental Mobil only]
 * - Slideshow & Banner ('slideshow')
 * - Artikel & Berita ('articles')
 * - Pertanyaan FAQ ('faqs') [with images]
 */
export const CompetitorScraperModal = ({
  isOpen,
  onClose,
  adminToken,
  initialTargetType = 'products',
  isAutomotive = true,
  onImportSuccess,
  showToast
}) => {
  const [targetType, setTargetType] = useState(initialTargetType || 'products');
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [importing, setImporting] = useState(false);

  // Multi-step Loading Animation State
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  // Manual / Custom Creation & Editing State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    category: 'Rental Mobil',
    badge: 'Pilihan Utama',
    price_self_drive: 'Rp 450.000',
    price_with_driver: 'Rp 650.000',
    duration: '1 Hari',
    price_per_pax: 'Rp 650.000',
    price_per_group: 'Rp 3.000.000',
    highlights: 'Pemandu Ramah, Armada AC, Dokumentasi',
    itinerary: 'Hari 1: Penjemputan dan eksplorasi destinasi\nHari 2: Sunrise dan transfer kembali',
    subtitle: 'Layanan transportasi terbaik dan terpercaya dengan harga kompetitif.',
    ctaText: 'Lihat Layanan',
    ctaLink: '#fleet',
    excerpt: 'Panduan lengkap perjalanan wisata dan tips rental mobil aman terpercaya.',
    content: 'Informasi selengkapnya mengenai tips perjalanan wisata dan transportasi terpercaya.',
    q: '',
    a: '',
    image: '',
    specs: 'Matic / Manual, 7 Penumpang, AC Bersih'
  });

  // Sync targetType whenever initialTargetType changes
  useEffect(() => {
    if (initialTargetType) {
      setTargetType(initialTargetType);
      setParsedData(null);
      setError(null);
    }
  }, [initialTargetType]);

  // Lock body background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  const loadingSteps = [
    { title: 'Menghubungi Server Target', desc: 'Melakukan handshake HTTP dan mengabaikan bot protection...' },
    { title: 'Mengekstrak DOM & Data Terstruktur', desc: 'Membaca schema.org JSON-LD, metadata OG, dan elemen konten...' },
    { title: 'Memetakan Format & Tarif', desc: 'Mengidentifikasi tarif, paket rute, atau tanya-jawab...' },
    { title: 'Mengidentifikasi Aset Gambar HD', desc: 'Mencocokkan foto resolusi tinggi, srcset, dan lazy-load images...' },
    { title: 'Menyusun Pratinjau Siap Impor', desc: 'Membersihkan duplikat dan menyiapkan data siap disimpan...' }
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
        body: JSON.stringify({ url: targetUrl.trim(), type: targetType })
      });

      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        throw new Error(
          res.status === 504 || res.status === 408
            ? 'Waktu koneksi ke website target habis (Timeout). Website kompetitor lambat merespons.'
            : `Respons server tidak valid (HTTP ${res.status}): ${text.slice(0, 150) || 'Koneksi terputus'}`
        );
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || `Gagal menganalisis URL kompetitor (HTTP ${res.status})`);
      }

      setParsedData(json);
      // Select all by default
      setSelectedItems((json.data || []).map((item, idx) => item.id || `item_${idx}`));
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
      setSelectedItems(parsedData.data.map((i, idx) => i.id || `item_${idx}`));
    }
  };

  // Open Add Manual Form
  const handleOpenAddManual = () => {
    setEditingItem(null);
    setFormValues({
      title: targetType === 'faqs' ? '' : (targetType === 'travel' ? 'Paket Eksplorasi Wisata Bromo 2H1M' : targetType === 'slideshow' ? 'Sewa Mobil & Layanan Transportasi Terpercaya' : targetType === 'articles' ? 'Tips Memilih Rental Mobil yang Aman untuk Liburan' : 'Toyota All New Avanza 2024'),
      category: targetType === 'articles' ? 'Tips Rental' : 'Rental Mobil',
      badge: 'Pilihan Utama',
      price_self_drive: 'Rp 450.000',
      price_with_driver: 'Rp 650.000',
      duration: '1 Hari (Full Day)',
      price_per_pax: 'Rp 650.000',
      price_per_group: 'Rp 2.800.000',
      highlights: 'Pemandu Ramah, Armada AC, Dokumentasi',
      itinerary: 'Hari 1: Penjemputan di meeting point, menuju destinasi utama\nHari 2: Menikmati sunrise, belanja oleh-oleh, kembali pulang',
      subtitle: 'Armada terlengkap, kondisi prima, pelayanan sopir profesional dan lepas kunci 24 jam.',
      ctaText: 'Pesan Sekarang',
      ctaLink: '#fleet',
      excerpt: 'Panduan lengkap dan informasi penting untuk kelancaran perjalanan Anda.',
      content: 'Layanan sewa mobil dan pariwisata profesional dengan armada terawat dan supir handal.',
      q: 'Apa saja syarat rental mobil lepas kunci?',
      a: 'Syarat sewa lepas kunci cukup melampirkan foto KTP asli, SIM A aktif, bukti akun media sosial/ID karyawan, serta deposit jaminan keamanan yang dikembalikan saat masa sewa berakhir.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      specs: 'Matic / Manual, 7 Penumpang, AC Bersih'
    });
    setIsFormOpen(true);
  };

  // Open Edit Item Form
  const handleOpenEditItem = (item, e) => {
    e?.stopPropagation();
    setEditingItem(item);
    setFormValues({
      title: item.title || item.q || '',
      category: item.category || 'Rental Mobil',
      badge: item.badge || 'Pilihan Utama',
      price_self_drive: item.price_self_drive || item.price || 'Rp 450.000',
      price_with_driver: item.price_with_driver || 'Rp 650.000',
      duration: item.duration || '1 Hari',
      price_per_pax: item.price_per_pax || 'Rp 500.000',
      price_per_group: item.price_per_group || 'Rp 2.500.000',
      highlights: Array.isArray(item.highlights) ? item.highlights.join(', ') : (item.highlights || ''),
      itinerary: Array.isArray(item.route_itinerary) ? item.route_itinerary.join('\n') : (item.itinerary || ''),
      subtitle: item.subtitle || '',
      ctaText: item.ctaText || 'Lihat Layanan',
      ctaLink: item.ctaLink || '#fleet',
      excerpt: item.excerpt || '',
      content: item.content || '',
      q: item.q || item.title || '',
      a: item.a || item.description || '',
      image: item.image || item.featured_image || '',
      specs: Array.isArray(item.specs) ? item.specs.join(', ') : (item.specs || '')
    });
    setIsFormOpen(true);
  };

  // Save Manual / Edited Item
  const handleSaveForm = (e) => {
    e.preventDefault();
    const itemId = editingItem ? editingItem.id : `manual_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const mainImg = formValues.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

    let newItem = {};

    if (targetType === 'travel') {
      const highlightsArr = formValues.highlights.split(',').map(s => s.trim()).filter(Boolean);
      const itineraryArr = formValues.itinerary.split('\n').map(s => s.trim()).filter(Boolean);
      newItem = {
        id: itemId,
        title: formValues.title.trim(),
        slug: formValues.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80),
        duration: formValues.duration,
        price_per_pax: formValues.price_per_pax,
        price_per_group: formValues.price_per_group,
        badge: formValues.badge,
        highlights: highlightsArr,
        route_itinerary: itineraryArr,
        description: `${formValues.title} perjalanan tour wisata dengan pelayanan prima.`,
        image: mainImg,
        images: [mainImg],
        is_active: true
      };
    } else if (targetType === 'slideshow') {
      newItem = {
        id: itemId,
        title: formValues.title.trim(),
        subtitle: formValues.subtitle.trim(),
        badge: formValues.badge,
        ctaText: formValues.ctaText || 'Pesan Sekarang',
        ctaLink: formValues.ctaLink || '#fleet',
        image: mainImg
      };
    } else if (targetType === 'articles') {
      newItem = {
        id: itemId,
        title: formValues.title.trim(),
        slug: formValues.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80),
        category: formValues.category,
        excerpt: formValues.excerpt.trim(),
        content: formValues.content.trim(),
        featured_image: mainImg,
        image: mainImg,
        is_published: true
      };
    } else if (targetType === 'faqs') {
      newItem = {
        id: itemId,
        q: (formValues.q || formValues.title).trim(),
        a: (formValues.a || formValues.content).trim(),
        image: formValues.image.trim()
      };
    } else {
      // Default: products
      const specsArr = formValues.specs.split(',').map(s => s.trim()).filter(Boolean);
      newItem = {
        id: itemId,
        title: formValues.title.trim(),
        category: formValues.category,
        badge: formValues.badge,
        price: formValues.price_self_drive,
        price_self_drive: formValues.price_self_drive,
        price_with_driver: formValues.price_with_driver,
        period: '/hari',
        specs: specsArr.length > 0 ? specsArr : ['Unit Nyaman', 'AC Dingin'],
        image: mainImg,
        images: [mainImg],
        pricing_tiers: [
          { label: 'Lepas Kunci', price: formValues.price_self_drive, unit: '/24 jam', is_default: true },
          { label: 'Dengan Sopir', price: formValues.price_with_driver, unit: '/12 jam', is_default: false }
        ],
        description: `${formValues.title.trim()} kondisi prima, siap pakai.`
      };
    }

    if (editingItem) {
      setParsedData(prev => ({
        ...prev,
        data: (prev?.data || []).map(it => it.id === editingItem.id ? newItem : it)
      }));
    } else {
      setParsedData(prev => ({
        ...(prev || { meta: { sourceUrl: 'Manual Input' } }),
        data: [newItem, ...(prev?.data || [])]
      }));
      setSelectedItems(prev => [itemId, ...prev]);
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
        item.id === itemId ? { ...item, image: newImageUrl, featured_image: newImageUrl } : item
      )
    }));
  };

  // Final Import Handler
  const handleImport = async () => {
    if (!parsedData?.data || selectedItems.length === 0) {
      alert('Pilih minimal satu item untuk diimpor');
      return;
    }

    const itemsToImport = parsedData.data.filter((item, idx) =>
      selectedItems.includes(item.id || `item_${idx}`)
    );

    setImporting(true);

    try {
      const activeToken = adminToken || localStorage.getItem('cms_admin_token') || 'cms_admin_session_active';
      let endpoint = '/api/admin/scraper/import';
      let payload = { items: itemsToImport };

      if (targetType === 'travel') {
        endpoint = '/api/admin/scraper/import-travel';
        payload = { trips: itemsToImport };
      } else if (targetType === 'slideshow') {
        endpoint = '/api/admin/scraper/import-slideshow';
        payload = { slides: itemsToImport };
      } else if (targetType === 'articles') {
        endpoint = '/api/admin/scraper/import-articles';
        payload = {
          articles: itemsToImport,
          competitorUrl: url,
          competitorDomain: parsedData?.meta?.sourceDomain || '',
          competitorTitle: parsedData?.meta?.pageTitle || ''
        };
      } else if (targetType === 'faqs') {
        endpoint = '/api/admin/scraper/import-faqs';
        payload = { faqs: itemsToImport };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        throw new Error(`Respons server tidak valid saat impor (HTTP ${res.status}): ${text.slice(0, 150) || 'Koneksi terputus'}`);
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || `Gagal mengimpor data (HTTP ${res.status})`);
      }

      if (showToast) {
        showToast(json.message || `Berhasil mengimpor ${itemsToImport.length} data ke database!`);
      }
      if (onImportSuccess) {
        onImportSuccess(itemsToImport, targetType);
      }
      onClose();
    } catch (err) {
      alert(`Gagal impor: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const getTypeLabel = () => {
    switch (targetType) {
      case 'travel': return 'Paket Wisata';
      case 'slideshow': return 'Slideshow & Banner';
      case 'articles': return 'Artikel & Berita';
      case 'faqs': return 'Pertanyaan FAQ';
      default: return 'Produk / Armada';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-hidden">
      <div className={`bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col min-w-0 transition-all ${
        parsedData ? 'max-h-[88vh] h-[88vh]' : 'max-h-[90vh] h-auto'
      }`}>
        {/* Header */}
        <header className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Alat Analisis & Ekstraksi Data Kompetitor</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  AI & Web Scraper
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Ekstrak otomatis harga, foto HD, spesifikasi, atau buat data sendiri secara manual
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

        {/* Target Type Tab Switcher (No Horizontal Scrollbar) */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-2 bg-slate-50 border-b border-slate-200 shrink-0 flex-wrap overflow-x-hidden">
          <button
            type="button"
            onClick={() => { setTargetType('products'); setParsedData(null); setError(null); }}
            className={`px-3 py-1.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x cursor-pointer ${
              targetType === 'products'
                ? 'bg-white text-blue-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produk / Armada</span>
          </button>

          {isAutomotive && (
            <button
              type="button"
              onClick={() => { setTargetType('travel'); setParsedData(null); setError(null); }}
              className={`px-3 py-1.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x cursor-pointer ${
                targetType === 'travel'
                  ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Paket Wisata</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => { setTargetType('slideshow'); setParsedData(null); setError(null); }}
            className={`px-3 py-1.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x cursor-pointer ${
              targetType === 'slideshow'
                ? 'bg-white text-indigo-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Slideshow & Banner</span>
          </button>

          <button
            type="button"
            onClick={() => { setTargetType('articles'); setParsedData(null); setError(null); }}
            className={`px-3 py-1.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x cursor-pointer ${
              targetType === 'articles'
                ? 'bg-white text-violet-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Artikel & Berita</span>
          </button>

          <button
            type="button"
            onClick={() => { setTargetType('faqs'); setParsedData(null); setError(null); }}
            className={`px-3 py-1.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x cursor-pointer ${
              targetType === 'faqs'
                ? 'bg-white text-amber-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pertanyaan FAQ</span>
          </button>
        </div>

        {/* URL Input Bar & Action Toolbar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-white space-y-2.5 shrink-0 overflow-x-hidden">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              URL Website Target ({getTypeLabel()})
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
                placeholder={
                  targetType === 'travel'
                    ? 'Contoh: https://kompetitor-travel.com/paket-wisata atau /tour'
                    : targetType === 'slideshow'
                    ? 'Contoh: https://website-kompetitor.com/ (Landing Page Utama)'
                    : targetType === 'articles'
                    ? 'Contoh: https://website-kompetitor.com/blog atau /artikel'
                    : targetType === 'faqs'
                    ? 'Contoh: https://website-kompetitor.com/faq atau /tanya-jawab'
                    : 'Contoh: https://rentalmobil-kompetitor.com/armada atau /unit'
                }
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memindai...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Mulai Ekstraksi</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Dynamic Content Area (Zero scroll when empty/loading, smooth vertical scroll when parsedData) */}
        <div className={`p-4 sm:p-5 flex-1 min-w-0 overflow-x-hidden ${
          parsedData ? 'overflow-y-auto space-y-4' : 'overflow-hidden flex flex-col justify-center'
        }`}>
          {/* 1. DEDICATED HIGH-TECH ANIMATED LOADING SCREEN */}
          {loading && (
            <div className="py-6 sm:py-8 px-4 flex flex-col items-center justify-center text-center space-y-3.5 animate-fade-in max-w-md mx-auto">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/15 animate-ping" />
                <div className="absolute inset-1.5 rounded-full border-2 border-blue-400 border-dashed animate-spin duration-1000" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 animate-pulse text-blue-100" />
                </div>
              </div>

              <div className="space-y-1 max-w-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold">
                  <Globe className="w-3 h-3" />
                  <span className="truncate max-w-[240px]">{targetUrl.replace(/^https?:\/\//, '')}</span>
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  {loadingSteps[progressStep]?.title || 'Sedang Mengekstrak Konten Web...'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {loadingSteps[progressStep]?.desc || 'Memindai seluruh struktur halaman dan harga...'}
                </p>
              </div>

              <div className="w-full space-y-1">
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Tahap {progressStep + 1} dari {loadingSteps.length}</span>
                  <span className="font-bold text-blue-600">{progressPercent}%</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. INITIAL EMPTY STATE (Compact & Zero Scroll) */}
          {!parsedData && !loading && (
            <div className="py-6 sm:py-8 text-center text-slate-400 space-y-3 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                  Siap Mengekstrak {getTypeLabel()} Kompetitor
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Ketik atau tempel URL website target di atas, lalu klik <strong>Mulai Ekstraksi</strong>.
                  Atau klik <strong>"Input / Bikin Sendiri Manual"</strong> untuk membuat data baru.
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleOpenAddManual}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bikin {getTypeLabel()} Sendiri Manual</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. PARSED RESULTS LIST */}
          {parsedData && !loading && (
            <div className="space-y-4">
              {/* Summary Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Hasil Deteksi: {parsedData.data.length} {getTypeLabel()} Ditemukan
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
                {parsedData.data.map((item, idx) => {
                  const itemId = item.id || `item_${idx}`;
                  const isSelected = selectedItems.includes(itemId);

                  return (
                    <div
                      key={itemId}
                      onClick={() => toggleSelectItem(itemId)}
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
                        {(item.image || item.featured_image) ? (
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative group">
                            <img
                              src={item.image || item.featured_image}
                              alt={item.title || item.q}
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
                        ) : null}

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold truncate max-w-[120px]">
                                {item.category || (targetType === 'travel' ? 'Paket Wisata' : targetType === 'slideshow' ? 'Slide' : targetType === 'faqs' ? 'FAQ' : 'Rental Mobil')}
                              </span>
                              {item.badge && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-extrabold truncate">
                                  {item.badge}
                                </span>
                              )}
                              {item.duration && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-bold">
                                  {item.duration}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => handleOpenEditItem(item, e)}
                                className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white"
                                title="Edit item ini"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveItem(itemId, e)}
                                className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-white"
                                title="Hapus dari daftar ini"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <h5 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2" title={item.title || item.q}>
                            {item.title || item.q}
                          </h5>

                          {/* Specific Views by Target Type */}
                          {targetType === 'products' && (
                            <div className="grid grid-cols-2 gap-1 text-[11px] bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                              <div>
                                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Lepas Kunci</span>
                                <span className="font-black text-slate-900 font-mono text-xs">{item.price_self_drive || item.price}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-blue-600 block font-bold uppercase tracking-wider">+ Sopir</span>
                                <span className="font-black text-blue-700 font-mono text-xs">{item.price_with_driver}</span>
                              </div>
                            </div>
                          )}

                          {targetType === 'travel' && (
                            <div className="grid grid-cols-2 gap-1 text-[11px] bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                              <div>
                                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Tarif Per Pax</span>
                                <span className="font-black text-slate-900 font-mono text-xs">{item.price_per_pax}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-emerald-600 block font-bold uppercase tracking-wider">Tarif Group</span>
                                <span className="font-black text-emerald-700 font-mono text-xs">{item.price_per_group}</span>
                              </div>
                            </div>
                          )}

                          {targetType === 'slideshow' && item.subtitle && (
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {item.subtitle}
                            </p>
                          )}

                          {targetType === 'articles' && item.excerpt && (
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {item.excerpt}
                            </p>
                          )}

                          {targetType === 'faqs' && item.a && (
                            <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              {item.a}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Image Gallery Switcher (if multiple images found) */}
                      {Array.isArray(item.images) && item.images.length > 1 && (
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0">Pilihan Foto ({item.images.length}):</span>
                          <div className="flex items-center gap-1 flex-wrap py-0.5 max-w-full">
                            {item.images.slice(0, 8).map((imgUrl, iIdx) => (
                              <button
                                key={iIdx}
                                type="button"
                                title={`Pilih foto ${iIdx + 1}`}
                                onClick={(e) => handleSelectImageForCard(itemId, imgUrl, e)}
                                className={`w-7 h-7 rounded-md overflow-hidden border transition-all shrink-0 cursor-pointer ${
                                  (item.image === imgUrl || item.featured_image === imgUrl)
                                    ? 'border-blue-600 ring-2 ring-blue-500/50 scale-105'
                                    : 'border-slate-200 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img src={imgUrl} alt={`Thumbnail ${iIdx + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Travel Highlights */}
                      {targetType === 'travel' && Array.isArray(item.highlights) && item.highlights.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                          {item.highlights.map((hl, hIdx) => (
                            <span key={hIdx} className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-100">
                              ✓ {hl}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Product Specs */}
                      {targetType === 'products' && Array.isArray(item.specs) && item.specs.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                          {item.specs.map((spec, sIdx) => (
                            <span key={sIdx} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {spec}
                            </span>
                          ))}
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
              <strong className="font-bold text-slate-900">{selectedItems.length}</strong> dari {parsedData.data.length} {getTypeLabel()} siap diimpor
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
                    <span>Impor ke {getTypeLabel()} ({selectedItems.length})</span>
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h4 className="font-extrabold text-sm text-slate-900">
                {editingItem ? `Edit ${getTypeLabel()}` : `Bikin ${getTypeLabel()} Sendiri Manual`}
              </h4>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 overflow-y-auto flex-1">
              {targetType === 'faqs' ? (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Pertanyaan FAQ *</label>
                    <input
                      type="text"
                      required
                      value={formValues.q}
                      onChange={(e) => setFormValues({ ...formValues, q: e.target.value })}
                      placeholder="Contoh: Apa saja syarat sewa mobil lepas kunci?"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Jawaban FAQ *</label>
                    <textarea
                      rows={3}
                      required
                      value={formValues.a}
                      onChange={(e) => setFormValues({ ...formValues, a: e.target.value })}
                      placeholder="Jawaban rinci untuk pertanyaan ini..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {targetType === 'travel' ? 'Nama Paket Wisata *' : targetType === 'slideshow' ? 'Judul Slide Banner *' : targetType === 'articles' ? 'Judul Artikel *' : 'Nama Produk / Unit *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.title}
                    onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                    placeholder="Masukkan judul..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              {targetType === 'products' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Kategori</label>
                      <input
                        type="text"
                        value={formValues.category}
                        onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Badge</label>
                      <input
                        type="text"
                        value={formValues.badge}
                        onChange={(e) => setFormValues({ ...formValues, badge: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Harga Lepas Kunci</label>
                      <input
                        type="text"
                        value={formValues.price_self_drive}
                        onChange={(e) => setFormValues({ ...formValues, price_self_drive: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Harga Plus Sopir</label>
                      <input
                        type="text"
                        value={formValues.price_with_driver}
                        onChange={(e) => setFormValues({ ...formValues, price_with_driver: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Spesifikasi (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={formValues.specs}
                      onChange={(e) => setFormValues({ ...formValues, specs: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </>
              )}

              {targetType === 'travel' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Durasi</label>
                      <input
                        type="text"
                        value={formValues.duration}
                        onChange={(e) => setFormValues({ ...formValues, duration: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Tarif / Pax</label>
                      <input
                        type="text"
                        value={formValues.price_per_pax}
                        onChange={(e) => setFormValues({ ...formValues, price_per_pax: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Tarif Group</label>
                      <input
                        type="text"
                        value={formValues.price_per_group}
                        onChange={(e) => setFormValues({ ...formValues, price_per_group: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Highlights Wisata (Pisahkan koma)</label>
                    <input
                      type="text"
                      value={formValues.highlights}
                      onChange={(e) => setFormValues({ ...formValues, highlights: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Itinerary Harian (Satu baris per jadwal)</label>
                    <textarea
                      rows={3}
                      value={formValues.itinerary}
                      onChange={(e) => setFormValues({ ...formValues, itinerary: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </>
              )}

              {targetType === 'slideshow' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Subjudul / Deskripsi Pendek</label>
                    <textarea
                      rows={2}
                      value={formValues.subtitle}
                      onChange={(e) => setFormValues({ ...formValues, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Teks Tombol CTA</label>
                      <input
                        type="text"
                        value={formValues.ctaText}
                        onChange={(e) => setFormValues({ ...formValues, ctaText: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Link Tombol CTA</label>
                      <input
                        type="text"
                        value={formValues.ctaLink}
                        onChange={(e) => setFormValues({ ...formValues, ctaLink: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </>
              )}

              {targetType === 'articles' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Ringkasan / Excerpt</label>
                    <textarea
                      rows={2}
                      value={formValues.excerpt}
                      onChange={(e) => setFormValues({ ...formValues, excerpt: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Konten Artikel</label>
                    <textarea
                      rows={4}
                      value={formValues.content}
                      onChange={(e) => setFormValues({ ...formValues, content: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {targetType === 'faqs' ? 'URL Gambar / Ilustrasi FAQ (Opsional)' : 'URL Gambar Utama *'}
                </label>
                <input
                  type="url"
                  value={formValues.image}
                  onChange={(e) => setFormValues({ ...formValues, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
                >
                  Simpan & Tambahkan
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
