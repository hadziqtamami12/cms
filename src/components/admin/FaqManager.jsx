import React, { useState } from 'react';
import {
  HelpCircle, Plus, Edit2, Trash2, Check, X, RefreshCw, AlertCircle
} from 'lucide-react';
import { updateAppSettings } from '../../lib/api';

/**
 * FAQ Manager for Admin Dashboard
 * Direct database persistence of FAQ questions and answers
 */
export const FaqManager = ({
  faqs = [],
  adminToken,
  onConfigUpdated,
  showToast
}) => {
  const [faqList, setFaqList] = useState(faqs);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ q: '', a: '' });
  const [saving, setSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({ q: '', a: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index) => {
    setEditingIndex(index);
    setFormData({ ...faqList[index] });
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
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                {faqList.length} Item
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Pertanyaan dan jawaban ini ditampilkan pada bagian accordion FAQ di landing page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah FAQ Baru</span>
          </button>
        </div>

        {/* FAQ Items List */}
        <div className="divide-y divide-slate-100 mt-4">
          {faqList.map((faq, idx) => (
            <div key={idx} className="py-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">{faq.a}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(idx)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  title="Hapus FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {faqList.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              Belum ada FAQ. Klik "Tambah FAQ Baru" untuk membuat pertanyaan pertama.
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit */}
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
                className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700"
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
