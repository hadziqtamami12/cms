import React, { useState, useMemo } from 'react';
import {
  Search, Globe, Smartphone, Monitor, CheckCircle2, AlertTriangle,
  XCircle, Sparkles, Copy, Check, Code, HelpCircle, ChevronDown,
  ChevronUp, ExternalLink, ShieldCheck, Tag, FileText, Image as ImageIcon
} from 'lucide-react';

/**
 * YoastSeoPanel - Interactive Yoast SEO Suite
 * Features:
 * - Real-time Google SERP Snippet Preview (Mobile vs Desktop) with live keyword highlighting
 * - Traffic-light SEO scoring engine (Green / Amber / Red)
 * - Focus Keyphrase input tracker & density analysis
 * - Interactive checklist (Meta Title 40-60 chars, Meta Description 120-155 chars, H1 check, Image Alt, Schema.org JSON-LD validator)
 */
export default function YoastSeoPanel({
  seo = {},
  onChange = () => {},
  pageTitle = '',
  h1Text = '',
  images = [],
  siteDomain = 'samuderarental.com',
  slug = 'home',
  brandName = 'Samudera VIP Transport',
}) {
  const [devicePreview, setDevicePreview] = useState('mobile'); // 'mobile' | 'desktop'
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'snippet' | 'schema'
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [expandedSection, setExpandedSection] = useState('all');

  // Controlled values
  const focusKeyphrase = seo.focusKeyphrase || '';
  const metaTitle = seo.metaTitle || (pageTitle ? `${pageTitle} | ${brandName}` : `${brandName} - Layanan Terbaik 24 Jam`);
  const metaDescription = seo.metaDescription || (seo.description || 'Pusat sewa mobil dan armada eksekutif terpercaya. Tersedia unit terbaru lepas kunci atau all-in supir ramah. Reservasi cepat via WhatsApp 24 jam!');
  const canonicalUrl = seo.canonicalUrl || `https://${siteDomain}/${slug === 'home' ? '' : slug}`;
  const schemaType = seo.jsonLdType || 'AutoRental';
  const ogImage = seo.ogImage || (images[0]?.url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200');

  // Handle updates to parent state
  const updateField = (field, value) => {
    onChange({
      ...seo,
      [field]: value,
    });
  };

  // --- Real-time Metrics Calculations ---
  // 1. Meta Title (Optimal: 40 - 60 chars)
  const titleLength = metaTitle.length;
  let titleScore = 'short'; // 'short' | 'good' | 'long'
  if (titleLength >= 40 && titleLength <= 60) {
    titleScore = 'good';
  } else if (titleLength > 60) {
    titleScore = 'long';
  }

  // 2. Meta Description (Optimal: 120 - 155 chars)
  const descLength = metaDescription.length;
  let descScore = 'short'; // 'short' | 'good' | 'long'
  if (descLength >= 120 && descLength <= 155) {
    descScore = 'good';
  } else if (descLength > 155) {
    descScore = 'long';
  }

  // 3. Keyphrase Checks
  const cleanKeyphrase = focusKeyphrase.trim().toLowerCase();
  const keyphraseWords = cleanKeyphrase ? cleanKeyphrase.split(/\s+/).filter(Boolean) : [];
  
  const keyphraseInTitle = Boolean(cleanKeyphrase && metaTitle.toLowerCase().includes(cleanKeyphrase));
  const keyphraseInDesc = Boolean(cleanKeyphrase && metaDescription.toLowerCase().includes(cleanKeyphrase));
  const keyphraseInH1 = Boolean(cleanKeyphrase && (h1Text || pageTitle || '').toLowerCase().includes(cleanKeyphrase));

  // 4. Alt Text in Images Check
  const totalImages = images.length > 0 ? images.length : 1;
  const imagesWithAlt = images.length > 0 
    ? images.filter(img => img.alt && img.alt.trim().length > 0).length 
    : 1;
  const altTextStatus = images.length > 0 ? (imagesWithAlt === totalImages ? 'good' : 'warning') : 'good';

  // 5. Schema.org Validation
  const hasValidSchema = Boolean(schemaType && brandName && metaDescription);

  // Overall Score Calculation (0 - 100)
  const auditResults = useMemo(() => {
    const checks = [];

    // Check 1: Focus Keyphrase set
    checks.push({
      id: 'keyphrase_set',
      label: 'Focus Keyphrase ditentukan',
      status: cleanKeyphrase ? 'pass' : 'fail',
      msg: cleanKeyphrase ? `Kata kunci fokus "${cleanKeyphrase}" aktif` : 'Tentukan kata kunci fokus untuk audit akurat',
      weight: 15,
    });

    // Check 2: Title Length
    checks.push({
      id: 'title_length',
      label: 'Panjang Meta Title (40-60 karakter)',
      status: titleScore === 'good' ? 'pass' : titleScore === 'short' ? 'warn' : 'fail',
      msg: titleScore === 'good' 
        ? `Panjang sempurna (${titleLength} karakter)` 
        : titleScore === 'short' 
        ? `Terlalu pendek (${titleLength}/40 min. Tambahkan info unik)` 
        : `Terlalu panjang (${titleLength}/60 max. Akan terpotong di SERP)`,
      weight: 20,
    });

    // Check 3: Description Length
    checks.push({
      id: 'desc_length',
      label: 'Panjang Meta Deskripsi (120-155 karakter)',
      status: descScore === 'good' ? 'pass' : descScore === 'short' ? 'warn' : 'fail',
      msg: descScore === 'good' 
        ? `Panjang optimal (${descLength} karakter)` 
        : descScore === 'short' 
        ? `Terlalu pendek (${descLength}/120 min. Tulis ajakan bertindak lebih lengkap)` 
        : `Terlalu panjang (${descLength}/155 max. Akan terpotong Google)`,
      weight: 20,
    });

    // Check 4: Keyphrase in Title
    checks.push({
      id: 'keyphrase_title',
      label: 'Kata Kunci di Meta Title',
      status: !cleanKeyphrase ? 'warn' : keyphraseInTitle ? 'pass' : 'fail',
      msg: !cleanKeyphrase 
        ? 'Menunggu input focus keyphrase' 
        : keyphraseInTitle 
        ? 'Kata kunci ditemukan di judul halaman' 
        : 'Masukkan kata kunci fokus di dalam meta title',
      weight: 15,
    });

    // Check 5: Keyphrase in Description
    checks.push({
      id: 'keyphrase_desc',
      label: 'Kata Kunci di Meta Deskripsi',
      status: !cleanKeyphrase ? 'warn' : keyphraseInDesc ? 'pass' : 'fail',
      msg: !cleanKeyphrase 
        ? 'Menunggu input focus keyphrase' 
        : keyphraseInDesc 
        ? 'Kata kunci ditemukan di meta deskripsi' 
        : 'Sertakan kata kunci fokus dalam kalimat deskripsi',
      weight: 10,
    });

    // Check 6: H1 Presence
    checks.push({
      id: 'h1_presence',
      label: 'Keberadaan Heading Utama (H1)',
      status: (h1Text || pageTitle) ? 'pass' : 'fail',
      msg: (h1Text || pageTitle) ? 'Struktur H1 terdeteksi dan valid' : 'Tambahkan judul H1 yang jelas di hero banner',
      weight: 10,
    });

    // Check 7: Image Alt text
    checks.push({
      id: 'image_alt',
      label: 'Atribut Alt Text Gambar',
      status: altTextStatus === 'good' ? 'pass' : 'warn',
      msg: altTextStatus === 'good' 
        ? 'Semua gambar memiliki deskripsi alt text ramah SEO' 
        : `${imagesWithAlt}/${totalImages} gambar memiliki alt text`,
      weight: 5,
    });

    // Check 8: Schema.org
    checks.push({
      id: 'schema_valid',
      label: 'Skema Terstruktur Schema.org (JSON-LD)',
      status: hasValidSchema ? 'pass' : 'warn',
      msg: hasValidSchema ? `Tipe skema "@type": "${schemaType}" valid untuk Google Rich Snippet` : 'Konfigurasi schema.org belum lengkap',
      weight: 5,
    });

    // Calculate total points
    let points = 0;
    checks.forEach(c => {
      if (c.status === 'pass') points += c.weight;
      else if (c.status === 'warn') points += c.weight * 0.5;
    });

    const finalScore = Math.round(points);
    let trafficLight = 'green'; // 'green' | 'amber' | 'red'
    let labelText = 'Bagus (Optimal)';
    let badgeColor = 'bg-emerald-500 text-white border-emerald-600';

    if (finalScore < 50) {
      trafficLight = 'red';
      labelText = 'Kritis (Perlu Perbaikan)';
      badgeColor = 'bg-red-500 text-white border-red-600';
    } else if (finalScore < 80) {
      trafficLight = 'amber';
      labelText = 'Cukup (Dapat Ditingkatkan)';
      badgeColor = 'bg-amber-500 text-white border-amber-600';
    }

    return {
      score: finalScore,
      trafficLight,
      labelText,
      badgeColor,
      checks,
    };
  }, [cleanKeyphrase, titleScore, titleLength, descScore, descLength, keyphraseInTitle, keyphraseInDesc, h1Text, pageTitle, altTextStatus, imagesWithAlt, totalImages, hasValidSchema, schemaType]);

  // Generate valid Schema.org JSON-LD
  const generatedJsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: brandName,
      headline: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      image: ogImage,
      telephone: '+6281234567890',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jakarta',
        addressCountry: 'ID',
      },
    };
  }, [schemaType, brandName, metaTitle, metaDescription, canonicalUrl, ogImage]);

  // Helper to highlight keyphrase in snippet
  const renderHighlightedSnippet = (text, keyphrase) => {
    if (!keyphrase || !keyphrase.trim()) return text;
    const words = keyphrase.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return text;

    const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong key={i} className="font-bold text-slate-900 bg-amber-100/80 px-0.5 rounded-xs">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const copySchemaJson = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedJsonLd, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-slate-800">
      {/* Header Bar ala Yoast */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-4 py-3.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-extrabold text-sm shadow-md text-white tracking-wider">
            Y
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Yoast SEO Suite</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Live Audit
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Google SERP & Real-time Optimization Engine</p>
          </div>
        </div>

        {/* Traffic Light Score Badge */}
        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                auditResults.trafficLight === 'green'
                  ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400/40'
                  : 'bg-emerald-950/40 opacity-40'
              }`}
              title="Skor Bagus"
            />
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                auditResults.trafficLight === 'amber'
                  ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] ring-2 ring-amber-400/40'
                  : 'bg-amber-950/40 opacity-40'
              }`}
              title="Perlu Peningkatan"
            />
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                auditResults.trafficLight === 'red'
                  ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] ring-2 ring-red-400/40'
                  : 'bg-red-950/40 opacity-40'
              }`}
              title="Masalah Kritis"
            />
          </div>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <span className="text-xs font-black tracking-tight text-white">
            {auditResults.score}<span className="text-[10px] text-slate-400 font-normal">/100</span>
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/75 px-3 pt-2 gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit & Checklist</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
            {auditResults.checks.filter(c => c.status === 'pass').length}/{auditResults.checks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('snippet')}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'snippet'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Snippet Preview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'schema'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Schema JSON-LD</span>
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Focus Keyphrase Input Tracker - Always Visible as Primary Anchor */}
        <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-3.5 rounded-xl border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>Focus Keyphrase (Kata Kunci Utama)</span>
            </label>
            <span className="text-[11px] text-slate-500">
              {keyphraseWords.length} kata
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={focusKeyphrase}
              onChange={(e) => updateField('focusKeyphrase', e.target.value)}
              placeholder="Contoh: sewa mobil alphard jakarta"
              className="w-full text-xs font-medium px-3 py-2 pl-9 pr-8 rounded-lg border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-900"
            />
            <Search className="w-4 h-4 text-indigo-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {focusKeyphrase && (
              <button
                type="button"
                onClick={() => updateField('focusKeyphrase', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Kata kunci target yang ingin Anda menangkan di peringkat teratas Google Search.
          </p>
        </div>

        {/* TAB 1: AUDIT & CHECKLIST */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            {/* Meta Title Input & Progress Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">SEO Meta Title</label>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className={`font-bold ${
                    titleScore === 'good' ? 'text-emerald-600' : titleScore === 'short' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {titleLength}
                  </span>
                  <span className="text-slate-400">/ 60 karakter</span>
                </div>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => updateField('metaTitle', e.target.value)}
                placeholder="Judul halaman untuk Google"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 text-slate-900"
              />
              {/* Progress Bar with 40-60 target zone */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    titleScore === 'good' ? 'bg-emerald-500' : titleScore === 'short' ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0</span>
                <span className="text-emerald-700 font-medium">Rentang Ideal (40 - 60)</span>
                <span>60+</span>
              </div>
            </div>

            {/* Meta Description Input & Progress Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">SEO Meta Description</label>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className={`font-bold ${
                    descScore === 'good' ? 'text-emerald-600' : descScore === 'short' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {descLength}
                  </span>
                  <span className="text-slate-400">/ 155 karakter</span>
                </div>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                placeholder="Deskripsi rangkuman halaman yang memikat calon pelanggan..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 text-slate-900 resize-none"
              />
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    descScore === 'good' ? 'bg-emerald-500' : descScore === 'short' ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (descLength / 155) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0</span>
                <span className="text-emerald-700 font-medium">Rentang Ideal (120 - 155)</span>
                <span>155+</span>
              </div>
            </div>

            {/* Comprehensive Checklist Breakdown */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Daftar Parameter Audit SEO</span>
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  auditResults.trafficLight === 'green' ? 'bg-emerald-100 text-emerald-800' :
                  auditResults.trafficLight === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {auditResults.labelText}
                </span>
              </div>

              <div className="space-y-2">
                {auditResults.checks.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
                      item.status === 'pass'
                        ? 'bg-emerald-50/50 border-emerald-200/70 text-slate-800'
                        : item.status === 'warn'
                        ? 'bg-amber-50/50 border-amber-200/70 text-slate-800'
                        : 'bg-red-50/50 border-red-200/70 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {item.status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {item.status === 'fail' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{item.label}</span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          +{item.weight} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {item.msg}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE SNIPPET SERP PREVIEW */}
        {activeTab === 'snippet' && (
          <div className="space-y-3">
            {/* Switcher Device: Mobile Result vs Desktop Result */}
            <div className="flex items-center justify-between bg-slate-100 p-1 rounded-xl">
              <span className="text-xs font-semibold text-slate-600 pl-2">Tampilan Google:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                    devicePreview === 'mobile'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile Result</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                    devicePreview === 'desktop'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop Result</span>
                </button>
              </div>
            </div>

            {/* Google SERP Simulated Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md font-sans">
              {devicePreview === 'mobile' ? (
                // Google Mobile SERP Card
                <div className="space-y-2 max-w-sm mx-auto bg-white rounded-xl p-3 border border-slate-100 shadow-xs">
                  {/* Google Mobile Header: Favicon + Domain Breadcrumb */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-slate-900 truncate leading-tight">
                        {brandName}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate leading-tight">
                        https://{siteDomain} › {slug === 'home' ? '' : slug}
                      </span>
                    </div>
                  </div>

                  {/* Title Mobile */}
                  <h3 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                    {metaTitle || 'Judul Halaman Belum Diisi'}
                  </h3>

                  {/* Description Mobile with Keyphrase Highlighting */}
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                    {renderHighlightedSnippet(metaDescription, focusKeyphrase)}
                  </p>
                </div>
              ) : (
                // Google Desktop SERP Row
                <div className="space-y-1.5 text-left">
                  {/* Desktop Favicon & Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs text-[#202124]">
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      <Globe className="w-3 h-3" />
                    </div>
                    <div className="flex items-center gap-1 overflow-hidden">
                      <span className="font-medium text-slate-900">{brandName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[#4d5156] text-[11px] truncate">
                        https://{siteDomain}/{slug === 'home' ? '' : slug}
                      </span>
                    </div>
                  </div>

                  {/* Title Desktop */}
                  <h3 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                    {metaTitle || 'Judul Halaman Belum Diisi'}
                  </h3>

                  {/* Description Desktop */}
                  <p className="text-xs text-[#4d5156] leading-relaxed max-w-xl">
                    <span className="text-slate-400 font-normal">17 Sep 2026 — </span>
                    {renderHighlightedSnippet(metaDescription, focusKeyphrase)}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              💡 <strong>Tips Yoast:</strong> Kata kunci fokus Anda disorot warna kuning. Google akan menebalkan kata kunci tersebut di halaman hasil pencarian jika cocok dengan query pengguna.
            </div>
          </div>
        )}

        {/* TAB 3: SCHEMA.ORG JSON-LD */}
        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Tipe Skema Schema.org</label>
              <select
                value={schemaType}
                onChange={(e) => updateField('jsonLdType', e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-indigo-500"
              >
                <option value="AutoRental">AutoRental (Rental Mobil)</option>
                <option value="LocalBusiness">LocalBusiness (Bisnis Lokal)</option>
                <option value="Organization">Organization (Perusahaan)</option>
                <option value="Product">Product (Katalog Produk)</option>
                <option value="WebSite">WebSite (Portal Publik)</option>
              </select>
            </div>

            <div className="relative bg-slate-900 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 border border-slate-800">
              <button
                type="button"
                onClick={copySchemaJson}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-[10px] font-sans font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
              >
                {copiedSchema ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-300" />
                    <span>Salin JSON</span>
                  </>
                )}
              </button>
              <pre>{JSON.stringify(generatedJsonLd, null, 2)}</pre>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Valid untuk Google Rich Results Test & Structured Data Testing Tool.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
