import React, { useState } from 'react';
import {
  Globe, Search, Download, Check, X, AlertCircle, RefreshCw,
  ExternalLink, Sparkles, Image as ImageIcon, Tag, KeyRound, UserCheck
} from 'lucide-react';

/**
 * Competitor Scraper & Content Extraction Modal
 * Extracts product/unit data, images, prices, and specs from competitor websites
 * with preview and one-click import into catalog.
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
      const res = await fetch('/api/admin/scraper/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menganalisis URL kompetitor');
      }

      setParsedData(json);
      // Select all by default
      setSelectedItems(json.data.map(item => item.id));
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

  const handleImport = async () => {
    if (!parsedData?.data || selectedItems.length === 0) {
      alert('Pilih minimal satu item untuk diimpor');
      return;
    }

    const itemsToImport = parsedData.data.filter(item => selectedItems.includes(item.id));
    setImporting(true);

    try {
      const res = await fetch('/api/admin/scraper/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        },
        body: JSON.stringify({ items: itemsToImport })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal mengimpor produk');
      }

      if (showToast) {
        showToast(`Berhasil mengimpor ${itemsToImport.length} produk ke katalog!`);
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
              <h3 className="font-extrabold text-base text-slate-900">
                Alat Analisis & Ekstraksi Data Eksternal
              </h3>
              <p className="text-[11px] text-slate-500">
                Ekstrak produk, harga dual-pricing, spesifikasi, dan foto langsung dari URL eksternal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* URL Input Form */}
        <div className="p-6 border-b border-slate-100 bg-white space-y-3 shrink-0">
          <label className="block text-xs font-bold text-slate-700">
            URL Website Target (Kompetitor / Sumber Data)
          </label>
          <form onSubmit={handleAnalyze} className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://rentalmobil-contoh.com/armada atau https://travel-wisata.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Mulai Analisis URL</span>
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

        {/* Content Preview & Selection Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!parsedData && !loading && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Globe className="w-12 h-12 mx-auto stroke-1 opacity-50" />
              <p className="text-sm font-medium">Masukkan URL eksternal di atas lalu klik "Mulai Analisis URL".</p>
              <p className="text-xs text-slate-400">Sistem akan otomatis mengekstrak unit, spesifikasi, dan estimasi tarif sewa.</p>
            </div>
          )}

          {parsedData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Hasil Deteksi: {parsedData.data.length} Unit / Produk Ditemukan
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-lg">
                    Sumber: {parsedData.meta?.pageTitle || targetUrl}
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  {selectedItems.length} dari {parsedData.data.length} dipilih
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
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/30 shadow-sm ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="pt-1">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={(e) => { e.currentTarget.src = '/images/fleet/car-default.svg'; }}
                          className="w-full h-full object-cover"
                        />
                        {Array.isArray(item.images) && item.images.length > 1 && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold font-mono">
                            +{item.images.length}
                          </span>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {item.category}
                          </span>
                          <h5 className="font-extrabold text-sm text-slate-900 truncate mt-1">
                            {item.title}
                          </h5>
                        </div>

                        {/* Dual Pricing Preview */}
                        <div className="grid grid-cols-2 gap-1 text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-medium">Lepas Kunci</span>
                            <span className="font-bold text-slate-900">{item.price_self_drive}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-medium">+ Sopir</span>
                            <span className="font-bold text-slate-900">{item.price_with_driver}</span>
                          </div>
                        </div>

                        {/* Specs snippet */}
                        <div className="text-[10px] text-slate-500 truncate">
                          {item.specs?.join(' • ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {parsedData && (
          <footer className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500">
              {selectedItems.length} produk siap dimasukkan ke katalog aplikasi
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={importing || selectedItems.length === 0}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengimpor ke Katalog...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Import to Products ({selectedItems.length})</span>
                  </>
                )}
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default CompetitorScraperModal;
