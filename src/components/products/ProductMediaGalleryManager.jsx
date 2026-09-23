import React, { useState } from 'react';
import {
  Image as ImageIcon, Plus, Trash2, Edit3, Check, X,
  CheckSquare, Square, Tag, FileText, Globe, AlertCircle, RefreshCw
} from 'lucide-react';

/**
 * Product Media Gallery & Image SEO Manager
 * Supports:
 * - Multi-image gallery per product
 * - Image SEO attributes editing (slug, file name, Title, Alt Text, Caption)
 * - Single delete & Bulk delete with multi-select checkboxes
 */
export const ProductMediaGalleryManager = ({
  productId,
  productTitle,
  initialImages = [],
  adminToken,
  onGalleryUpdated,
  showToast
}) => {
  // Normalize images into structured objects
  const normalizeImages = (imgs) => {
    if (!Array.isArray(imgs)) return [];
    return imgs.map((item, idx) => {
      if (typeof item === 'string') {
        const parts = item.split('/');
        const fname = parts[parts.length - 1] || `image-${idx + 1}.webp`;
        const slug = fname.split('.')[0] || `foto-${idx + 1}`;
        return {
          id: `img-${idx}-${Date.now()}`,
          url: item,
          file_name: fname,
          slug: slug,
          title: `${productTitle || 'Unit'} - Foto ${idx + 1}`,
          alt_text: `Foto ${productTitle || 'Produk'} tampak ${idx === 0 ? 'depan' : 'samping'}`,
          caption: '',
          is_primary: idx === 0
        };
      }
      return {
        id: item.id || `img-${idx}-${Date.now()}`,
        url: item.url || item.image || '',
        file_name: item.file_name || `image-${idx + 1}.webp`,
        slug: item.slug || `foto-${idx + 1}`,
        title: item.title || `${productTitle || 'Unit'} Foto ${idx + 1}`,
        alt_text: item.alt_text || `Foto ${productTitle || 'Produk'}`,
        caption: item.caption || '',
        is_primary: Boolean(item.is_primary || idx === 0)
      };
    });
  };

  const [gallery, setGallery] = useState(() => normalizeImages(initialImages));
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync upward
  const syncGallery = (updated) => {
    setGallery(updated);
    if (onGalleryUpdated) {
      onGalleryUpdated(updated.map(i => i.url));
    }
  };

  // Toggle selection for bulk delete
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select all or deselect all
  const handleSelectAll = () => {
    if (selectedIds.length === gallery.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(gallery.map(i => i.id));
    }
  };

  // Single delete
  const handleDeleteSingle = async (img) => {
    if (!window.confirm(`Hapus gambar "${img.title || img.file_name}" dari galeri?`)) return;

    try {
      if (adminToken && img.id && !img.id.startsWith('img-')) {
        await fetch(`/api/admin/media/${img.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        }).catch(() => {});
      }
      const updated = gallery.filter(i => i.id !== img.id);
      syncGallery(updated);
      setSelectedIds(prev => prev.filter(i => i !== img.id));
      if (showToast) showToast('Gambar berhasil dihapus dari galeri');
    } catch (err) {
      alert('Gagal menghapus gambar: ' + err.message);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Yakin ingin menghapus ${selectedIds.length} gambar terpilih secara serentak?`)) return;

    try {
      if (adminToken) {
        await fetch('/api/admin/media/batch-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({ ids: selectedIds })
        }).catch(() => {});
      }

      const updated = gallery.filter(i => !selectedIds.includes(i.id));
      syncGallery(updated);
      setSelectedIds([]);
      if (showToast) showToast(`Berhasil menghapus ${selectedIds.length} gambar secara serentak!`);
    } catch (err) {
      alert('Gagal menghapus gambar: ' + err.message);
    }
  };

  // Add new image
  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !newImageUrl.startsWith('http')) {
      alert('Masukkan URL gambar yang valid (diawali http:// atau https://)');
      return;
    }

    const idx = gallery.length;
    const parts = newImageUrl.split('/');
    const fname = parts[parts.length - 1]?.split('?')[0] || `foto-${idx + 1}.webp`;
    const slug = (productTitle || 'foto').toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${idx + 1}`;

    const newObj = {
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: newImageUrl.trim(),
      file_name: fname,
      slug: slug,
      title: `${productTitle || 'Unit'} - Foto Galeri ${idx + 1}`,
      alt_text: `Foto ${productTitle || 'Produk'} kualitas HD`,
      caption: '',
      is_primary: gallery.length === 0
    };

    const updated = [...gallery, newObj];
    syncGallery(updated);
    setNewImageUrl('');
    setIsAddOpen(false);
    if (showToast) showToast('Gambar baru berhasil ditambahkan ke galeri!');
  };

  // Save SEO attributes edit
  const handleSaveSeoEdit = async (e) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      if (adminToken && editingImage.id && !editingImage.id.startsWith('img-')) {
        await fetch(`/api/admin/media/${editingImage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(editingImage)
        }).catch(() => {});
      }

      const updated = gallery.map(item =>
        item.id === editingImage.id ? editingImage : item
      );
      syncGallery(updated);
      setEditingImage(null);
      if (showToast) showToast('Atribut SEO gambar berhasil diperbarui!');
    } catch (err) {
      alert('Gagal menyimpan atribut SEO: ' + err.message);
    }
  };

  // Set primary image
  const handleSetPrimary = (imgId) => {
    const updated = gallery.map(i => ({
      ...i,
      is_primary: i.id === imgId
    }));
    syncGallery(updated);
    if (showToast) showToast('Gambar utama produk berhasil diubah!');
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Gallery Header & Bulk Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {selectedIds.length > 0 && selectedIds.length === gallery.length ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Pilih Semua ({gallery.length})</span>
          </button>

          {selectedIds.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
              {selectedIds.length} dipilih
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer animate-fade-in"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedIds.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Foto</span>
          </button>
        </div>
      </div>

      {/* Add New Image Drawer / Form */}
      {isAddOpen && (
        <form onSubmit={handleAddImage} className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h5 className="font-extrabold text-xs text-blue-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Tambah Foto Baru ke Galeri</span>
            </h5>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="p-1 rounded-lg hover:bg-blue-100 text-blue-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Masukkan URL foto: https://images.unsplash.com/... atau /uploads/..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 cursor-pointer"
            >
              Simpan ke Galeri
            </button>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="py-8 text-center text-slate-400 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <ImageIcon className="w-8 h-8 mx-auto opacity-50" />
          <p className="text-xs font-medium">Belum ada foto tambahan di galeri produk ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {gallery.map((img) => {
            const isSelected = selectedIds.includes(img.id);

            return (
              <div
                key={img.id}
                className={`relative rounded-2xl border overflow-hidden bg-white shadow-xs transition-all ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Checkbox Overlay */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <button
                    type="button"
                    onClick={() => toggleSelect(img.id)}
                    className="p-1 rounded-lg bg-white/90 backdrop-blur-xs shadow-md border border-slate-200 cursor-pointer text-slate-700"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Primary Badge */}
                {img.is_primary && (
                  <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md">
                    Foto Utama
                  </span>
                )}

                {/* Image Thumbnail */}
                <div className="h-36 w-full bg-slate-100 overflow-hidden relative group">
                  <img
                    src={img.url}
                    alt={img.alt_text || img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Image SEO Info Card */}
                <div className="p-3 space-y-2">
                  <div className="space-y-0.5">
                    <h6 className="font-extrabold text-xs text-slate-900 truncate" title={img.title}>
                      {img.title || img.file_name}
                    </h6>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      alt: "{img.alt_text || '-'}"
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      file: {img.file_name}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingImage(img)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-slate-500" />
                      <span>Edit SEO</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {!img.is_primary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          className="px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 text-[11px] font-bold cursor-pointer"
                          title="Jadikan Foto Utama"
                        >
                          Set Utama
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteSingle(img)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Hapus Gambar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEO Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                  <Globe className="w-4 h-4" />
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Edit Atribut SEO Gambar
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleSaveSeoEdit} className="p-6 space-y-3.5 text-xs">
              <div className="h-28 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                <img src={editingImage.url} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Image Title (Judul Gambar)</label>
                <input
                  type="text"
                  required
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  placeholder="Contoh: Toyota Alphard Transformer 2026 Hitam"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Alt Text (Atribut &lt;img alt="..."&gt; untuk Google Image SEO)</label>
                <input
                  type="text"
                  required
                  value={editingImage.alt_text}
                  onChange={(e) => setEditingImage({ ...editingImage, alt_text: e.target.value })}
                  placeholder="Contoh: Sewa mobil Alphard luxury Bali lepas kunci"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">File Name / Nama File</label>
                  <input
                    type="text"
                    value={editingImage.file_name}
                    onChange={(e) => setEditingImage({ ...editingImage, file_name: e.target.value })}
                    placeholder="alphard-hitam-bali.webp"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Image Slug / URL</label>
                  <input
                    type="text"
                    value={editingImage.slug}
                    onChange={(e) => setEditingImage({ ...editingImage, slug: e.target.value })}
                    placeholder="alphard-transformer-vip"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Caption / Deskripsi Gambar (Opsional)</label>
                <textarea
                  rows={2}
                  value={editingImage.caption}
                  onChange={(e) => setEditingImage({ ...editingImage, caption: e.target.value })}
                  placeholder="Keterangan foto atau variasi interior..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Simpan Atribut SEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMediaGalleryManager;
