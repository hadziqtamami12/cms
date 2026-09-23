import React, { useState, useEffect } from 'react';
import { Search, Tag, CheckCircle2, AlertTriangle, XCircle, TrendingUp, Sparkles, X } from 'lucide-react';
import { calculateLiveSeoScore } from '../../lib/seoEngine';

export const SeoScoreChecker = ({
  initialKeywords = ['sewa mobil jakarta', 'rental alphard', 'mobil lepas kunci'],
  title = '',
  metaDescription = '',
  h1 = '',
  slug = '',
  content = '',
  onKeywordsChange = null
}) => {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [keywordInput, setKeywordInput] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const result = calculateLiveSeoScore({
      keywords,
      title,
      metaDescription,
      h1,
      slug,
      content,
      hasImageAlt: true
    });
    setAnalysis(result);
  }, [keywords, title, metaDescription, h1, slug, content]);

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmed = keywordInput.trim().toLowerCase();
      if (trimmed && !keywords.includes(trimmed)) {
        const next = [...keywords, trimmed];
        setKeywords(next);
        setKeywordInput('');
        if (onKeywordsChange) onKeywordsChange(next);
      }
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    const next = keywords.filter(k => k !== kwToRemove);
    setKeywords(next);
    if (onKeywordsChange) onKeywordsChange(next);
  };

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-6">
      {/* Title & Overall Score Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">SEO Score & On-Page Keyword Density Checker</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit waktu nyata kata kunci pada Title, Meta Description, H1 Hero, URL Slug, dan Alt Image.
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold block">SKOR SEO</span>
            <span className="text-2xl font-black text-slate-900 leading-none">
              {analysis.score}<span className="text-sm font-normal text-slate-400">/100</span>
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-sm ${
              analysis.score >= 85
                ? 'bg-emerald-600'
                : analysis.score >= 70
                ? 'bg-blue-600'
                : analysis.score >= 50
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
          >
            {analysis.grade}
          </div>
        </div>
      </div>

      {/* Multi-Tag Keyword Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Target Keywords Multi-Tag Input
        </label>
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100/80 text-blue-800 text-xs font-semibold"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                className="hover:text-blue-950 focus:outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <div className="flex-1 flex items-center min-w-[180px]">
            <input
              type="text"
              placeholder="Ketik target keyword lalu tekan Enter..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              className="w-full bg-transparent px-2 py-1 text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Density Analysis Results */}
      {Object.keys(analysis.densityMap).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(analysis.densityMap).map(([kw, data]) => {
            const densityVal = parseFloat(data.density);
            const isOptimal = densityVal >= 0.8 && densityVal <= 2.5;
            return (
              <div
                key={kw}
                className="p-3.5 rounded-xl border border-slate-200 bg-surface-warm/50 flex flex-col justify-between"
              >
                <div className="text-xs font-bold text-slate-800 truncate" title={kw}>
                  "{kw}"
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Kepadatan:</span>
                  <span className={`font-mono font-bold ${isOptimal ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {data.density} ({data.count}x)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Checklist Audit */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Checklist On-Page Audit Google #1
        </h4>
        <div className="space-y-2">
          {analysis.checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
            >
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span>{item.label}</span>
              </div>
              <span className={`text-[11px] font-semibold ${item.passed ? 'text-emerald-700' : 'text-slate-500'}`}>
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Rekomendasi Optimasi Instan Menuju Peringkat 1:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800 font-medium pl-1">
            {analysis.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SeoScoreChecker;
