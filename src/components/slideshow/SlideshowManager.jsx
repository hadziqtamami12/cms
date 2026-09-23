import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Image,
  ExternalLink,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { updateAppSettings } from '../../lib/api';

/**
 * Slideshow & Hero Banner CRUD Manager
 * Allows managing landing page hero slides:
 * - Add new slide with title, subtitle, badge, image, and CTA
 * - Edit existing slide
 * - Delete slide
 * - Reorder slides (up / down)
 * - Persist changes directly to the database
 */
export const SlideshowManager = ({
  slides = [],
  adminToken,
  onConfigUpdated,
  showToast
}) => {
  const [slideList, setSlideList] = useState(slides || []);
  const [editingSlide, setEditingSlide] = useState(null); // null or slide object
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: '',
    ctaText: 'Pesan Sekarang',
    ctaLink: '#fleet',
    image: ''
  });

  const openAddModal = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      badge: 'Promo Terbaru',
      ctaText: 'Lihat Katalog',
      ctaLink: '#fleet',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide, index) => {
    setEditingSlide({ ...slide, index });
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      badge: slide.badge || '',
      ctaText: slide.ctaText || 'Lihat Katalog',
      ctaLink: slide.ctaLink || '#fleet',
      image: slide.image || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      alert('Judul slide dan URL gambar wajib diisi.');
      return;
    }

    let updated = [];
    if (editingSlide !== null && editingSlide.index !== undefined) {
      // Edit existing
      updated = slideList.map((item, idx) => (idx === editingSlide.index ? { ...formData } : item));
    } else {
      // Add new
      updated = [...slideList, { ...formData }];
    }

    await persistSlides(updated);
    setIsModalOpen(false);
  };

  const handleDelete = async (indexToDelete) => {
    if (slideList.length <= 1) {
      alert('Minimal harus ada 1 slide banner aktif di landing page.');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus slide banner ini?')) return;

    const updated = slideList.filter((_, idx) => idx !== indexToDelete);
    await persistSlides(updated);
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slideList.length) return;

    const updated = [...slideList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    await persistSlides(updated);
  };

  const persistSlides = async (newSlides) => {
    setSlideList(newSlides);
    setSaving(true);
    try {
      const res = await updateAppSettings({ heroSlides: newSlides }, adminToken);
      if (res && res.success) {
        if (showToast) showToast('Slideshow berhasil diperbarui & tersimpan!');
        if (onConfigUpdated) onConfigUpdated({ heroSlides: newSlides });
      } else {
        if (showToast) showToast('Gagal menyimpan slideshow ke server');
      }
    } catch {
      if (showToast) showToast('Gagal menghubungi database');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-blue-100 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" /> Hero Slideshow Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Manajemen Slideshow & Hero Banner (CRUD)
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm">
            Tambah, edit, ubah urutan, dan hapus slide banner utama landing page dengan penyimpanan otomatis ke database.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="self-start sm:self-auto py-3 px-5 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Slide Baru</span>
        </button>
      </div>

      {/* Slide Count & Status */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>Total Slide Aktif:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
            {slideList.length} Slide
          </span>
        </div>
        {saving && (
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Menyimpan ke database...
          </span>
        )}
      </div>

      {/* Slide Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {slideList.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Left: Thumbnail & Content */}
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="relative w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-mono font-bold">
                  #{idx + 1}
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                {item.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-blue-600">CTA: {item.ctaText}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400 truncate">{item.ctaLink}</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
              {/* Move Up */}
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMove(idx, -1)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
                title="Pindah ke Atas"
              >
                <MoveUp className="w-4 h-4" />
              </button>

              {/* Move Down */}
              <button
                type="button"
                disabled={idx === slideList.length - 1}
                onClick={() => handleMove(idx, 1)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
                title="Pindah ke Bawah"
              >
                <MoveDown className="w-4 h-4" />
              </button>

              {/* Edit */}
              <button
                type="button"
                onClick={() => openEditModal(item, idx)}
                className="p-2 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit Slide"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="p-2 px-3 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hapus Slide"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Slide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-5 animate-bounce-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingSlide !== null ? 'Edit Slide Banner' : 'Tambah Slide Banner Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Judul Slide (Headline H1):
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Solusi Sewa Mobil Mewah Terlengkap"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Deskripsi Singkat / Subtitle:
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Contoh: Armada tahun terbaru, jaminan bersih wangi, sopir profesional berpengalaman..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Label Lencana / Badge:
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Promo Spesial 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teks Tombol CTA:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Contoh: Pesan Sekarang"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Link Tujuan Tombol CTA:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="#fleet atau #pricing"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    URL Foto / Gambar Banner:
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Live Preview Image in Modal */}
              {formData.image && (
                <div className="rounded-xl overflow-hidden h-28 w-full bg-slate-100 border border-slate-200 relative">
                  <img
                    src={formData.image}
                    alt="Pratinjau Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                    Pratinjau Foto
                  </span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideshowManager;
