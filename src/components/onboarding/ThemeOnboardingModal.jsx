import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Briefcase, 
  Car, 
  Newspaper, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Palette,
  ShieldCheck,
  Zap,
  Layers,
  X
} from 'lucide-react';

export const THEME_OPTIONS = [
  {
    id: 'ecommerce',
    title: 'Toko Online / E-Commerce',
    badge: 'Katalog & Penjualan',
    tagline: 'Optimal untuk jual produk fisik, diskon, variasi produk & checkout WhatsApp.',
    icon: ShoppingCart,
    accentColor: 'from-amber-500 to-orange-600',
    borderActive: 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30',
    features: [
      'Katalog produk lengkap dengan diskon & rating',
      'Tombol Beli Langsung ke WhatsApp',
      'Manajemen variasi ukuran/warna & stok',
      'Schema SEO Google: Product & Store'
    ],
    sampleBrand: 'LuxeStore Indonesia',
    sampleItems: 'Gadget, Fashion, Aksesoris'
  },
  {
    id: 'services',
    title: 'Company Profile & Jasa',
    badge: 'Korporat & Profesional',
    tagline: 'Sempurna untuk profil perusahaan, konsultan, agensi, dan jasa profesional.',
    icon: Briefcase,
    accentColor: 'from-blue-600 to-indigo-700',
    borderActive: 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/30',
    features: [
      'Showcase portfolio proyek & studi kasus',
      'Daftar layanan korporat & penawaran',
      'Testimoni mitra & profil direksi',
      'Schema SEO Google: ProfessionalService & Org'
    ],
    sampleBrand: 'Apex Global Consulting',
    sampleItems: 'Legalitas PT, IT & Cloud, Audit'
  },
  {
    id: 'automotive',
    title: 'Rental & Transportasi',
    badge: 'Armada & Reservasi',
    tagline: 'Ideal untuk rental mobil, motor, paket wisata, lepas kunci dan supir.',
    icon: Car,
    accentColor: 'from-emerald-500 to-teal-700',
    borderActive: 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/30',
    features: [
      'Katalog armada lengkap dengan spesifikasi unit',
      'Pilihan tarif Lepas Kunci vs Dengan Sopir',
      'Paket tour wisata terintegrasi',
      'Schema SEO Google: AutoRental & LocalBusiness'
    ],
    sampleBrand: 'Royal Fleet Premiere',
    sampleItems: 'Alphard, Innova Zenix, Fortuner'
  },
  {
    id: 'news',
    title: 'Blog & Portal Berita',
    badge: 'Media & Publikasi',
    tagline: 'Dirancang untuk publikasi artikel, majalah digital, portal berita & SEO blog.',
    icon: Newspaper,
    accentColor: 'from-purple-600 to-violet-800',
    borderActive: 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30',
    features: [
      'Layout majalah modern dengan trending topics',
      'Author profile, waktu baca & artikel terkait',
      'Optimalisasi Core Web Vitals super cepat',
      'Schema SEO Google: NewsMediaOrganization & Article'
    ],
    sampleBrand: 'WartaNusantara Digital',
    sampleItems: 'Liputan Bisnis, Gaya Hidup, Sains'
  }
];

export const ThemeOnboardingModal = ({ isOpen, onClose, onSelectTheme, isDismissible = true }) => {
  const [selectedId, setSelectedId] = useState('automotive');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/theme/apply-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: selectedId })
      });
      const json = await res.json();
      if (json.success) {
        if (onSelectTheme) onSelectTheme(json.data);
      } else {
        setError(json.error || 'Gagal menerapkan tema.');
      }
    } catch (err) {
      setError('Koneksi server gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const selectedTheme = THEME_OPTIONS.find(t => t.id === selectedId) || THEME_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          {isDismissible && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Onboarding CMS Otomatis</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pilih Kategori & Tema CMS Anda
          </h2>
          <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
            Sistem kami akan langsung mengaktifkan modul, mengatur tata letak (layout), 
            dan memuat data percontohan (seeder) secara instan sesuai bidang usaha Anda.
          </p>
        </div>

        {/* Body Selection */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEME_OPTIONS.map((theme) => {
              const Icon = theme.icon;
              const isSelected = theme.id === selectedId;

              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedId(theme.id)}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? theme.borderActive + ' shadow-md scale-[1.01]'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.accentColor} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {theme.badge}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 animate-scaleIn" />
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {theme.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {theme.tagline}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {theme.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Preset: <strong className="text-slate-600">{theme.sampleBrand}</strong></span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{theme.sampleItems}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2 text-center sm:text-left">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Tema terpilih: <strong className="text-slate-900">{selectedTheme.title}</strong> (dapat diganti kapan saja dari Panel Admin).
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isDismissible && (
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-white transition-colors"
              >
                Nanti Saja
              </button>
            )}
            <button
              type="button"
              onClick={handleApply}
              disabled={loading}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengaktifkan Modul & Layout...</span>
                </>
              ) : (
                <>
                  <span>Terapkan Tema Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeOnboardingModal;
