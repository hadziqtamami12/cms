import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Plus, Edit2, Trash2, Check, X, RefreshCw, AlertCircle, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { updateAppSettings } from '../../lib/api';
import ImageUploadInput from '../common/ImageUploadInput';

/**
 * FAQ Manager for Admin Dashboard
 * Direct database persistence of FAQ questions, answers, and illustration images
 */
export const FaqManager = ({
  faqs = [],
  adminToken,
  onConfigUpdated,
  showToast,
  onOpenScraper
}) => {
  const [faqList, setFaqList] = useState(faqs);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ q: '', a: '', image: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (faqs) setFaqList(faqs);
  }, [faqs]);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({ q: '', a: '', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index) => {
    setEditingIndex(index);
    const item = faqList[index] || {};
    setFormData({ q: item.q || '', a: item.a || '', image: item.image || '' });
    setIsModalOpen(true);
  };

  const persistFaqs = async (updatedList, message) => {
    setFaqList(updatedList);
    setSaving(true);

    try {
      await updateAppSettings({ faqs: updatedList }, adminToken);
      if (onConfigUpdated) onConfigUpdated({ faqs: updatedList });
      if (showToast) showToast(message || 'FAQ berhasil disimpan ke database!');
    } catch (err) {
      alert('Gagal menyimpan FAQ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.q.trim() || !formData.a.trim()) {
      alert('Pertanyaan dan jawaban wajib diisi');
      return;
    }

    let updatedList;
    if (editingIndex !== null) {
      updatedList = faqList.map((item, idx) => (idx === editingIndex ? formData : item));
    } else {
      updatedList = [...faqList, formData];
    }

    await persistFaqs(updatedList, editingIndex !== null ? 'FAQ berhasil diperbarui!' : 'FAQ baru berhasil ditambahkan!');
    setIsModalOpen(false);
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Yakin ingin menghapus pertanyaan FAQ ini?')) return;
    const updatedList = faqList.filter((_, idx) => idx !== index);
    await persistFaqs(updatedList, 'FAQ berhasil dihapus!');
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Kelola Pertanyaan Umum (FAQ)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Pertanyaan dan jawaban ini ditampilkan pada bagian accordion FAQ di landing page beserta gambar pendukung jika ada.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenScraper && (
              <button
                type="button"
                onClick={() => onOpenScraper('faqs')}
                className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Scrape pertanyaan dan jawaban FAQ dari website kompetitor"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Scrape FAQ</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah FAQ Baru</span>
            </button>
          </div>
        </div>

        {/* FAQ Items List */}
        <div className="divide-y divide-slate-100 mt-4">
          {faqList.map((faq, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 text-[11px] font-mono flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>

                {faq.image && (
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img src={faq.image} alt={faq.q} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {faq.q}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(idx)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Hapus FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {faqList.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              Belum ada FAQ. Klik "Tambah FAQ Baru" atau "Scrape FAQ" untuk menambahkan data.
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                {editingIndex !== null ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Pertanyaan *</label>
                <input
                  type="text"
                  required
                  value={formData.q}
                  onChange={(e) => setFormData({ ...formData, q: e.target.value })}
                  placeholder="Contoh: Apa saja syarat rental mobil lepas kunci?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Jawaban *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.a}
                  onChange={(e) => setFormData({ ...formData, a: e.target.value })}
                  placeholder="Contoh: Cukup siapkan foto KTP asli, SIM A aktif, dan bukti akun media sosial/ID karyawan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed font-medium"
                />
              </div>

              <ImageUploadInput
                label="Gambar / Ilustrasi FAQ (Opsional)"
                value={formData.image || ''}
                onChange={(val) => setFormData({ ...formData, image: val })}
                placeholder="https://images.unsplash.com/... atau /uploads/..."
                helperText="Upload foto penjelas FAQ atau tempel link URL gambar"
              />

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Simpan FAQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqManager;
