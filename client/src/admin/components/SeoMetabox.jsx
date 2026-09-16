import React, { useState } from 'react';
import {
  Search, Globe, Share2, Smartphone, Monitor, CheckCircle,
  AlertTriangle, XCircle, Sliders, Sparkles, ExternalLink
} from 'lucide-react';

export default function SeoMetabox({
  seo = {},
  onChange = () => {},
  defaultTitle = '',
  defaultDescription = '',
  slug = '',
  siteDomain = 'example.com',
}) {
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'
  const [activeTab, setActiveTab] = useState('snippet'); // 'snippet' | 'social' | 'advanced'

  const focusKeyphrase = seo.focusKeyphrase || '';
  const metaTitle = seo.metaTitle || defaultTitle || '';
  const metaDescription = seo.metaDescription || defaultDescription || '';
  const canonicalUrl = seo.canonicalUrl || '';
  const robots = seo.robots || 'index, follow';
  const ogTitle = seo.ogTitle || metaTitle;
  const ogDescription = seo.ogDescription || metaDescription;
  const ogImage = seo.ogImage || '';

  // Yoast Title Length Rating (Optimal: 40 - 60 chars)
  const titleLength = metaTitle.length;
  let titleScore = 'short'; // 'short' | 'good' | 'long'
  let titleProgress = Math.min(100, (titleLength / 60) * 100);
  let titleColor = 'bg-amber-500';
  if (titleLength >= 40 && titleLength <= 60) {
    titleScore = 'good';
    titleColor = 'bg-emerald-500';
  } else if (titleLength > 60) {
    titleScore = 'long';
    titleColor = 'bg-red-500';
  }

  // Yoast Description Length Rating (Optimal: 120 - 160 chars)
  const descLength = metaDescription.length;
  let descScore = 'short';
  let descProgress = Math.min(100, (descLength / 160) * 100);
  let descColor = 'bg-amber-500';
  if (descLength >= 120 && descLength <= 160) {
    descScore = 'good';
    descColor = 'bg-emerald-500';
  } else if (descLength > 160) {
    descScore = 'long';
    descColor = 'bg-red-500';
  }

  // Keyphrase Presence Check
  const keyphraseWords = focusKeyphrase.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const keyphraseInTitle =
    focusKeyphrase && metaTitle.toLowerCase().includes(focusKeyphrase.toLowerCase());
  const keyphraseInDesc =
    focusKeyphrase && metaDescription.toLowerCase().includes(focusKeyphrase.toLowerCase());

  const handleUpdate = (field, value) => {
    onChange({
      ...seo,
      [field]: value,
    });
  };

  const previewUrl = `https://${siteDomain}/${slug ? `${slug}/` : ''}`;

  return (
    <div className="bg-white rounded-[4px] border border-[#c3c4c7] overflow-hidden shadow-none">
      {/* Yoast Style Header */}
      <div className="p-3.5 bg-[#f6f7f7] border-b border-[#c3c4c7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-[#a4286a] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            Y
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1d2327] flex items-center gap-1.5">
              <span>Yoast SEO</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[3px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                Aktif
              </span>
            </h3>
            <p className="text-[11px] text-[#646970]">Optimasi mesin pencari Google Search Console & Snippet</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#dcdcde] p-0.5 rounded-[3px] text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('snippet')}
            className={`px-3 py-1 rounded-[2px] transition-colors ${
              activeTab === 'snippet' ? 'bg-white text-[#1d2327] shadow-xs' : 'text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            Google Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1 rounded-[2px] transition-colors ${
              activeTab === 'social' ? 'bg-white text-[#1d2327] shadow-xs' : 'text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            Social Share
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`px-3 py-1 rounded-[2px] transition-colors ${
              activeTab === 'advanced' ? 'bg-white text-[#1d2327] shadow-xs' : 'text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            Lanjutan (Robots)
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Focus Keyphrase */}
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1.5">
            Focus Keyphrase (Kata Kunci Utama)
          </label>
          <div className="relative">
            <input
              type="text"
              value={focusKeyphrase}
              onChange={(e) => handleUpdate('focusKeyphrase', e.target.value)}
              placeholder="contoh: sewa mobil lepas kunci jakarta"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Kata kunci target yang ingin Anda optimalkan untuk menempati ranking top pencarian Google.
          </p>
        </div>

        {activeTab === 'snippet' && (
          <>
            {/* Real-time Google SERP Snippet Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-700" />
                  <span>Google Snippet Preview</span>
                </span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                    title="Pratinjau Hasil Pencarian Seluler (Mobile)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                    title="Pratinjau Hasil Pencarian Komputer (Desktop)"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* SERP Mockup */}
              <div className={`p-4 bg-white rounded-lg border border-slate-200 font-sans shadow-xs ${previewDevice === 'mobile' ? 'max-w-md' : 'w-full'}`}>
                {/* Google Result URL Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-700 mb-1 leading-none">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600 border border-slate-200">
                    G
                  </div>
                  <span className="truncate">{siteDomain}</span>
                  {slug && <span className="text-slate-400">&rsaquo; {slug}</span>}
                </div>

                {/* Google Result Title */}
                <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2 mb-1">
                  {metaTitle || 'Judul Halaman Belum Diatur'}
                </h4>

                {/* Google Result Snippet Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {metaDescription || 'Deskripsi penelusuran belum diatur. Tambahkan meta description menarik untuk meningkatkan Click-Through Rate (CTR).'}
                </p>
              </div>
            </div>

            {/* SEO Title Input + Dynamic Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Judul SEO (SEO Title)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {titleLength} / 60 karakter
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => handleUpdate('metaTitle', e.target.value)}
                placeholder="Judul Halaman Spesifik - Brand"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none"
              />
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${titleColor}`}
                  style={{ width: `${titleProgress}%` }}
                />
              </div>
            </div>

            {/* Meta Description Input + Dynamic Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Deskripsi Meta (Meta Description)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {descLength} / 160 karakter
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => handleUpdate('metaDescription', e.target.value)}
                placeholder="Ringkasan informatif dengan call-to-action jelas untuk menarik klik pengunjung..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none"
              />
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${descColor}`}
                  style={{ width: `${descProgress}%` }}
                />
              </div>
            </div>

            {/* SEO Analysis Checklist */}
            <div className="p-4 rounded-[4px] bg-[#f6f7f7] border border-[#dcdcde] space-y-2 text-xs">
              <div className="font-bold text-[#1d2327] text-[11px] uppercase tracking-wider mb-2">
                Pemeriksaan Skor SEO
              </div>
              <div className="flex items-center gap-2">
                {titleScore === 'good' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="text-[#2c3338]">
                  Panjang Judul SEO: {titleScore === 'good' ? 'Ideal (40-60 karakter)' : 'Kurang optimal'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {descScore === 'good' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="text-[#2c3338]">
                  Panjang Deskripsi: {descScore === 'good' ? 'Sempurna (120-160 karakter)' : 'Terlalu pendek atau melebihi batas'}
                </span>
              </div>
              {focusKeyphrase && (
                <>
                  <div className="flex items-center gap-2">
                    {keyphraseInTitle ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="text-[#2c3338]">
                      Kata kunci di Judul: {keyphraseInTitle ? 'Ditemukan' : 'Belum tercantum di judul SEO'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {keyphraseInDesc ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="text-[#2c3338]">
                      Kata kunci di Deskripsi: {keyphraseInDesc ? 'Ditemukan' : 'Belum tercantum di deskripsi'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Social Share Tab */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Gambar Berbagi Sosial (Facebook OpenGraph / Twitter Card)
              </label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => handleUpdate('ogImage', e.target.value)}
                placeholder="https://example.com/assets/banner.jpg"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Ukuran rekomendasi: 1200x630 piksel untuk tampilan thumbnail jernih di WhatsApp, Facebook, dan X.
              </p>
            </div>

            {ogImage && (
              <div className="aspect-[12/6] max-w-sm rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img src={ogImage} alt="Social preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}

        {/* Advanced Tab: Robots & Canonical */}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Robots Meta (Petunjuk Bot Pencari)
              </label>
              <select
                value={robots}
                onChange={(e) => handleUpdate('robots', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              >
                <option value="index, follow">Index, Follow (Bisa dicari dan tautan diikuti - Direkomendasikan)</option>
                <option value="noindex, follow">NoIndex, Follow (Sembunyikan dari Google, ikuti tautan)</option>
                <option value="noindex, nofollow">NoIndex, NoFollow (Sembunyikan total dari mesin pencari)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => handleUpdate('canonicalUrl', e.target.value)}
                placeholder="https://example.com/halaman-asli/"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Gunakan jika konten ini menduplikasi URL utama lain untuk menghindari penalti duplikat konten.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
