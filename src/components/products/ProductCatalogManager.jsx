import React, { useState } from 'react';
import {
  Package, Plus, Search, Edit2, Trash2, Check, X,
  Image as ImageIcon, Sparkles, RefreshCw, AlertCircle, Eye, Tag
} from 'lucide-react';
import { updateAppSettings } from '../../lib/api';
import { getPresetForIndustry } from '../../lib/industryCatalogs';

/**
 * Product Catalog Manager (Product Card CRUD Studio)
 * Full Create, Read, Update, Delete for landing page product/unit cards
 * with instant single-source-of-truth database persistence.
 */
export const ProductCatalogManager = ({
  items = [],
  currentIndustry = 'automotive',
  adminToken,
  onConfigUpdated,
  showToast
}) => {
  const [productList, setProductList] = useState(items);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    price_self_drive: '',
    price_with_driver: '',
    period: '/hari',
    badge: '',
    image: '',
    specs: ''
  });

  // Extract categories
  const categories = ['Semua', ...Array.from(new Set(productList.map(i => i.category).filter(Boolean)))];

  // Filtered Products
  const filteredProducts = productList.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: categories[1] || 'Umum',
      price: 'Rp 500.000',
      price_self_drive: 'Rp 450.000',
      price_with_driver: 'Rp 650.000',
      period: currentIndustry === 'automotive' ? '/hari' : currentIndustry === 'fnb' ? '/porsi' : '/unit',
      badge: '',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      specs: 'Spesifikasi 1, Fitur 2, Kondisi Prima'
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || '',
      price: item.price || '',
      price_self_drive: item.price_self_drive || '',
      price_with_driver: item.price_with_driver || '',
      period: item.period || '',
      badge: item.badge || '',
      image: item.image || '',
      specs: Array.isArray(item.specs) ? item.specs.join(', ') : (item.specs || '')
    });
    setIsModalOpen(true);
  };

  // Save changes to state, localStorage, and database
  const persistProducts = async (updatedItems, successMessage) => {
    setProductList(updatedItems);
    setSaving(true);

    try {
      // 1. Save to Database
      const res = await updateAppSettings({ items: updatedItems }, adminToken);

      // 2. Update context state
      if (onConfigUpdated) {
        onConfigUpdated({ items: updatedItems });
      }

      if (showToast) {
        showToast(successMessage || 'Katalog produk berhasil disinkronisasi ke landing page!');
      }
    } catch (err) {
      console.error('[ProductCatalogManager] Save error:', err);
      if (showToast) {
        showToast('Gagal menyimpan produk ke database');
      }
    } finally {
      setSaving(false);
    }
  };

  // Submit Form (Add or Edit)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Nama / judul produk wajib diisi.');
      return;
    }

    const formattedSpecs = formData.specs
      ? formData.specs.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    let updatedList;
    if (editingItem) {
      // Update existing
      updatedList = productList.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: formData.title,
              category: formData.category,
              price: formData.price,
              price_self_drive: formData.price_self_drive || formData.price,
              price_with_driver: formData.price_with_driver || formData.price,
              period: formData.period,
              badge: formData.badge,
              image: formData.image,
              specs: formattedSpecs
            }
          : item
      );
    } else {
      // Create new
      const newItem = {
        id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: formData.title,
        category: formData.category,
        price: formData.price,
        price_self_drive: formData.price_self_drive || formData.price,
        price_with_driver: formData.price_with_driver || formData.price,
        period: formData.period,
        badge: formData.badge,
        image: formData.image,
        specs: formattedSpecs
      };
      updatedList = [newItem, ...productList];
    }

    await persistProducts(
      updatedList,
      editingItem ? `Produk "${formData.title}" berhasil diperbarui!` : `Produk baru "${formData.title}" berhasil ditambahkan!`
    );

    setIsModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${title}" dari katalog?`)) {
      return;
    }
    const updatedList = productList.filter(item => item.id !== id);
    await persistProducts(updatedList, `Produk "${title}" berhasil dihapus dari katalog.`);
  };

  // Reset to industry default presets
  const handleResetPresets = async () => {
    if (!window.confirm(`Reset katalog ke produk default industri ${currentIndustry.toUpperCase()}? Seluruh item saat ini akan diganti dengan preset default.`)) {
      return;
    }
    const preset = getPresetForIndustry(currentIndustry);
    await persistProducts(preset.items, `Katalog di-reset ke default industri [${currentIndustry}]`);
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Top Banner & Action Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs w-full max-w-full min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Package className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                Manajemen Armada & Produk
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                {productList.length} Produk
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola daftar unit/produk kartu di landing page (tambah baru, edit tarif lepas kunci & sopir, spesifikasi, dan foto).
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            <button
              type="button"
              onClick={handleResetPresets}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Reset ke preset bawaan industri saat ini"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Preset</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau spesifikasi..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full min-w-0">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-card hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            {/* Image & Badges */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {item.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                  {item.badge}
                </span>
              )}
              {item.category && (
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {item.category}
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2" title={item.title}>
                  {item.title}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-blue-600">{item.price}</span>
                  <span className="text-xs text-slate-400 font-medium">{item.period}</span>
                </div>

                {/* Specs tags */}
                {Array.isArray(item.specs) && item.specs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.specs.slice(0, 4).map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                    {item.specs.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-medium">
                        +{item.specs.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Produk</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteProduct(item.id, item.title)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-red-300 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shadow-2xs"
                  title="Hapus produk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-base">Belum Ada Produk Tersedia</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada produk yang cocok dengan pencarian Anda. Klik tombol Tambah Produk Baru di atas untuk mulai menambahkan item.
          </p>
        </div>
      )}

      {/* Modal Add / Edit Product Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col min-w-0">
            {/* Modal Header */}
            <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                  <Package className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingItem ? 'Edit Produk / Unit' : 'Tambah Produk Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Nama / Judul Produk *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Toyota Alphard Transformer Facelift"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Category & Badge Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Contoh: Luxury MPV, Family, Gadget"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Badge Promosi (Opsional)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Favorit VIP, Terlaris, Promo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Dual Pricing Row (Rental Mobil / Armada) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Tarif Lepas Kunci (Self-Drive)</label>
                  <input
                    type="text"
                    value={formData.price_self_drive}
                    onChange={(e) => setFormData({ ...formData, price_self_drive: e.target.value })}
                    placeholder="Contoh: Rp 450.000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <span className="text-[10px] text-slate-500">Opsi sewa tanpa driver</span>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Tarif Dengan Sopir (Chauffeur)</label>
                  <input
                    type="text"
                    value={formData.price_with_driver}
                    onChange={(e) => setFormData({ ...formData, price_with_driver: e.target.value })}
                    placeholder="Contoh: Rp 650.000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <span className="text-[10px] text-slate-500">Include sopir berpengalaman</span>
                </div>
              </div>

              {/* Price & Period Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tarif Standar / Mulai Dari *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Contoh: Rp 450.000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Periode / Satuan</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="Contoh: /hari, /unit, /porsi, /bulan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">URL Gambar / Foto</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 h-24 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Specs (Comma separated) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Spesifikasi / Fitur (Pisahkan dengan koma)</label>
                <textarea
                  rows={2}
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="Contoh: 7 Kursi Captain Seat, Matic, Bensin, Driver Included"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-1.5"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  )}
                  <span>Simpan Produk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalogManager;
