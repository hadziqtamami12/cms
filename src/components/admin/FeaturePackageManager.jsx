import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Headphones,
  Heart,
  Star,
  Compass,
  ArrowRight,
  RefreshCw,
  Tag
} from 'lucide-react';
import { updateAppSettings } from '../../lib/api';

const AVAILABLE_ICONS = [
  { id: 'ShieldCheck', label: 'Keamanan / Shield', Icon: ShieldCheck },
  { id: 'Award', label: 'Prestasi / Award', Icon: Award },
  { id: 'Zap', label: 'Kecepatan / Kilat', Icon: Zap },
  { id: 'CheckCircle2', label: 'Centang / Checklist', Icon: CheckCircle2 },
  { id: 'Clock', label: 'Waktu / 24 Jam', Icon: Clock },
  { id: 'Headphones', label: 'Support / CS', Icon: Headphones },
  { id: 'Heart', label: 'Pelayanan / Cinta', Icon: Heart },
  { id: 'Star', label: 'Bintang / Kualitas', Icon: Star },
  { id: 'Sparkles', label: 'Premium / Kilau', Icon: Sparkles },
  { id: 'Compass', label: 'Eksplorasi / Navigasi', Icon: Compass }
];

export const FeaturePackageManager = ({
  config = {},
  adminToken,
  onConfigUpdated,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState('features'); // 'features' | 'packages'
  const [features, setFeatures] = useState(config.features || []);
  const [pricing, setPricing] = useState(config.pricing || []);
  const [saving, setSaving] = useState(false);

  // Feature Edit/Create Modal state
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
  const [featureForm, setFeatureForm] = useState({
    title: '',
    desc: '',
    icon: 'ShieldCheck'
  });

  // Package Edit/Create Modal state
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageIndex, setEditingPackageIndex] = useState(null);
  const [packageForm, setPackageForm] = useState({
    title: '',
    price: '',
    period: '/bulan',
    badge: '',
    popular: false,
    featuresText: ''
  });

  // Persist changes to database
  const saveAllChanges = async (newFeatures, newPricing) => {
    setSaving(true);
    const targetFeatures = newFeatures !== undefined ? newFeatures : features;
    const targetPricing = newPricing !== undefined ? newPricing : pricing;

    const payload = {
      features: targetFeatures,
      pricing: targetPricing
    };

    // Optimistic update
    setFeatures(targetFeatures);
    setPricing(targetPricing);
    if (onConfigUpdated) onConfigUpdated(payload);

    try {
      const res = await updateAppSettings(payload, adminToken);
      if (res && res.success) {
        showToast?.('Data Fitur & Paket Layanan berhasil disimpan ke database!', 'success');
      } else {
        showToast?.('Gagal menyimpan ke database', 'error');
      }
    } catch (err) {
      console.error('[FeaturePackageManager Error]', err);
      showToast?.('Terjadi kesalahan jaringan', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- FEATURES CRUD ---
  const handleOpenCreateFeature = () => {
    setEditingFeatureIndex(null);
    setFeatureForm({
      title: '',
      desc: '',
      icon: 'ShieldCheck'
    });
    setFeatureModalOpen(true);
  };

  const handleOpenEditFeature = (index) => {
    setEditingFeatureIndex(index);
    setFeatureForm({ ...features[index] });
    setFeatureModalOpen(true);
  };

  const handleDeleteFeature = (index) => {
    if (!window.confirm(`Hapus fitur "${features[index].title}"?`)) return;
    const updated = features.filter((_, i) => i !== index);
    saveAllChanges(updated, pricing);
  };

  const handleSubmitFeature = (e) => {
    e.preventDefault();
    let updated;
    if (editingFeatureIndex !== null) {
      updated = features.map((f, i) => (i === editingFeatureIndex ? featureForm : f));
    } else {
      updated = [...features, featureForm];
    }
    setFeatureModalOpen(false);
    saveAllChanges(updated, pricing);
  };

  // --- PACKAGES CRUD ---
  const handleOpenCreatePackage = () => {
    setEditingPackageIndex(null);
    setPackageForm({
      title: '',
      price: 'Rp 500.000',
      period: '/layanan',
      badge: '',
      popular: false,
      featuresText: 'Layanan Terverifikasi\nKonsultasi Gratis\nGaransi Kepuasan'
    });
    setPackageModalOpen(true);
  };

  const handleOpenEditPackage = (index) => {
    setEditingPackageIndex(index);
    const pkg = pricing[index];
    setPackageForm({
      ...pkg,
      featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : ''
    });
    setPackageModalOpen(true);
  };

  const handleDeletePackage = (index) => {
    if (!window.confirm(`Hapus paket produk "${pricing[index].title}"?`)) return;
    const updated = pricing.filter((_, i) => i !== index);
    saveAllChanges(features, updated);
  };

  const handleSubmitPackage = (e) => {
    e.preventDefault();
    const pkgPayload = {
      title: packageForm.title,
      price: packageForm.price,
      period: packageForm.period,
      badge: packageForm.badge,
      popular: Boolean(packageForm.popular),
      features: (packageForm.featuresText || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
    };

    let updated;
    if (editingPackageIndex !== null) {
      updated = pricing.map((p, i) => (i === editingPackageIndex ? pkgPayload : p));
    } else {
      updated = [...pricing, pkgPayload];
    }
    setPackageModalOpen(false);
    saveAllChanges(features, updated);
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-xs">
        {/* Header & Subtabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Manajemen Fitur & Paket Layanan
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola daftar keunggulan fitur dan paket harga khusus untuk kategori produk/layanan bisnis Anda.
            </p>
          </div>

          {/* Subtab Toggle Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                activeTab === 'features'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Fitur Keunggulan ({features.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                activeTab === 'packages'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Paket Produk / Harga ({pricing.length})
            </button>
          </div>
        </div>

        {/* TAB 1: FITUR KEUNGGULAN */}
        {activeTab === 'features' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Daftar Fitur & Nilai Unggul</h3>
                <p className="text-xs text-slate-400">Muncul pada landing page untuk meyakinkan calon pelanggan.</p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateFeature}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Fitur Baru</span>
              </button>
            </div>

            {features.length === 0 ? (
              <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                Belum ada fitur keunggulan. Klik "Tambah Fitur Baru" di atas.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feat, idx) => {
                  const iconObj = AVAILABLE_ICONS.find(i => i.id === feat.icon) || AVAILABLE_ICONS[0];
                  const IconComp = iconObj.Icon;

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <IconComp className="w-5 h-5" />
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditFeature(idx)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Edit Fitur"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(idx)}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Fitur"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{feat.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">{feat.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAKET PRODUK / HARGA */}
        {activeTab === 'packages' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Daftar Paket Produk / Penawaran</h3>
                <p className="text-xs text-slate-400">Pilihan paket fleksibel untuk memudahkan pengunjung memilih layanan.</p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreatePackage}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Paket Baru</span>
              </button>
            </div>

            {pricing.length === 0 ? (
              <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                Belum ada paket produk. Klik "Tambah Paket Baru" di atas.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pricing.map((pkg, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                      pkg.popular
                        ? 'border-purple-500 bg-gradient-to-b from-purple-50/50 to-white shadow-md ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        {pkg.badge ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-2xs">
                            {pkg.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">Paket Reguler</span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPackage(idx)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit Paket"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePackage(idx)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Paket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-lg font-black text-slate-900">{pkg.title}</h4>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">{pkg.price}</span>
                        <span className="text-xs text-slate-500 font-medium">{pkg.period}</span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                        {Array.isArray(pkg.features) && pkg.features.map((item, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: CREATE / EDIT FEATURE */}
      {featureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleSubmitFeature}
            className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <h3 className="text-base font-black text-slate-900">
              {editingFeatureIndex !== null ? 'Edit Fitur Keunggulan' : 'Tambah Fitur Keunggulan'}
            </h3>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Judul Fitur *</label>
              <input
                type="text"
                required
                value={featureForm.title}
                onChange={e => setFeatureForm({ ...featureForm, title: e.target.value })}
                placeholder="Contoh: Garansi Resmi & Bersertifikat"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Pilihan Ikon</label>
              <select
                value={featureForm.icon}
                onChange={e => setFeatureForm({ ...featureForm, icon: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
              >
                {AVAILABLE_ICONS.map(i => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat</label>
              <textarea
                rows={3}
                required
                value={featureForm.desc}
                onChange={e => setFeatureForm({ ...featureForm, desc: e.target.value })}
                placeholder="Jelaskan nilai tambah dan kelebihan fitur ini bagi pelanggan..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFeatureModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 text-center"
              >
                Simpan Fitur
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CREATE / EDIT PACKAGE */}
      {packageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleSubmitPackage}
            className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-base font-black text-slate-900">
              {editingPackageIndex !== null ? 'Edit Paket Produk' : 'Tambah Paket Produk Baru'}
            </h3>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Nama Paket *</label>
              <input
                type="text"
                required
                value={packageForm.title}
                onChange={e => setPackageForm({ ...packageForm, title: e.target.value })}
                placeholder="Contoh: Paket Bisnis Pro / Paket Hemat"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Harga *</label>
                <input
                  type="text"
                  required
                  value={packageForm.price}
                  onChange={e => setPackageForm({ ...packageForm, price: e.target.value })}
                  placeholder="Rp 750.000"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Satuan / Periode</label>
                <input
                  type="text"
                  value={packageForm.period}
                  onChange={e => setPackageForm({ ...packageForm, period: e.target.value })}
                  placeholder="/bulan atau /layanan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Badge Label (Opsional)</label>
                <input
                  type="text"
                  value={packageForm.badge}
                  onChange={e => setPackageForm({ ...packageForm, badge: e.target.value })}
                  placeholder="Contoh: Terpopuler / Diskon 20%"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div className="flex items-center gap-2 pt-2 sm:pt-6">
                <input
                  type="checkbox"
                  id="chk-pop"
                  checked={packageForm.popular}
                  onChange={e => setPackageForm({ ...packageForm, popular: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <label htmlFor="chk-pop" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Sorot Sebagai Paling Populer
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Daftar Fitur Paket (1 baris per fitur) *
              </label>
              <textarea
                rows={4}
                required
                value={packageForm.featuresText}
                onChange={e => setPackageForm({ ...packageForm, featuresText: e.target.value })}
                placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed font-mono"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPackageModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 text-center"
              >
                Simpan Paket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeaturePackageManager;
