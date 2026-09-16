import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Save, Eye, CheckCircle, Image as ImageIcon,
  Tag, Clock, User, Calendar, AlertCircle, Trash2, ExternalLink
} from 'lucide-react';
import { saveAdminPost, deleteAdminPost } from '../../utils/api';
import SeoMetabox from '../components/SeoMetabox';

const GENERIC_CATEGORIES = [
  'Teknologi',
  'Bisnis & Manajemen',
  'Wawasan & Panduan',
  'Berita & Pengumuman',
  'Tips & Trik',
  'Opini & Cerita',
];

export default function PostEditorPage({ post = null, onBack, onSaved }) {
  const isEditing = Boolean(post?.id);

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [category, setCategory] = useState(post?.category || 'Wawasan & Panduan');
  const [author, setAuthor] = useState(post?.author || 'Tim Editorial');
  const [imageUrl, setImageUrl] = useState(
    post?.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80'
  );
  const [readTime, setReadTime] = useState(post?.readTime || '3 menit baca');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [status, setStatus] = useState(post?.status || 'published');
  const [seo, setSeo] = useState(
    post?.seo || {
      metaTitle: post?.title || '',
      metaDescription: post?.excerpt || '',
      focusKeyphrase: '',
      robots: 'index, follow',
      canonicalUrl: '',
    }
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  // Auto-slug from title if creating new
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSave = async (publishStatus = status) => {
    if (!title.trim()) {
      setError('Judul artikel wajib diisi.');
      return;
    }

    setSaving(true);
    setError('');
    setSavedSuccess(false);

    const postPayload = {
      id: post?.id || `post_${Date.now()}`,
      title,
      slug: slug || `post-${Date.now()}`,
      category,
      author,
      imageUrl,
      readTime,
      excerpt: excerpt || title,
      content: content || excerpt || title,
      status: publishStatus,
      seo: {
        ...seo,
        metaTitle: seo.metaTitle || title,
        metaDescription: seo.metaDescription || excerpt || title,
      },
      date: post?.date || new Date().toISOString().split('T')[0],
      createdAt: post?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const saved = await saveAdminPost(postPayload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      if (onSaved) {
        onSaved(saved);
      }
    } catch (err) {
      setError(`Gagal menyimpan artikel: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!window.confirm(`Yakin ingin menghapus artikel "${title}"?`)) return;
    try {
      await deleteAdminPost(post.id);
      if (onBack) onBack();
    } catch (err) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] flex flex-col font-sans">
      {/* WordPress-Style Post Editor Top Toolbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#c3c4c7] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-[3px] bg-[#f0f0f1] hover:bg-[#e2e2e4] text-[#2271b1] border border-[#2271b1] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            title="Kembali ke Semua Pos"
          >
            <ArrowLeft className="w-4 h-4 text-[#2271b1]" />
            <span>Semua Pos</span>
          </button>

          <span className="text-xs font-bold text-[#c3c4c7] hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1d2327]">
              {isEditing ? 'Sunting Pos' : 'Tambah Pos Baru'}
            </span>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[3px] border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Tersimpan!</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {slug && (
            <a
              href={`/?article=${encodeURIComponent(slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border border-[#8c8f94] hover:bg-[#f6f7f7] text-[#2271b1] text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#2271b1]" />
              <span>Pratinjau Pos</span>
            </a>
          )}

          {isEditing && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-[3px] text-red-600 hover:bg-red-50 transition-colors"
              title="Pindahkan ke Tong Sampah"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleSave(status)}
            disabled={saving}
            className="px-4 py-1.5 rounded-[3px] bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{saving ? 'Menyimpan...' : 'Terbitkan / Perbarui'}</span>
          </button>
        </div>
      </header>

      {/* Editor Main Content: Two Columns layout (Writing Canvas + Meta Boxes) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex flex-col lg:flex-row gap-6">
        {/* Left Column: Title, Permalink, Excerpt, Full Content, and Yoast SEO */}
        <div className="flex-1 space-y-6">
          {error && (
            <div className="p-3.5 rounded-[3px] bg-red-50 border-l-4 border-red-600 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Judul Artikel / Pos
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Tambahkan judul pos di sini..."
              className="w-full text-lg sm:text-xl font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none placeholder-slate-400"
            />

            {/* Permalink Editor */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span className="font-semibold text-slate-600 font-sans">Permalink:</span>
              <span className="text-slate-400">/?article=</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 font-medium focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt Box */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Kutipan / Ringkasan Singkat (Excerpt)
            </label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Tulis ringkasan singkat 1-2 kalimat untuk preview di kartu beranda dan hasil pencarian Google..."
              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Main Article Content Editor */}
          <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Isi Konten Artikel Lengkap
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Mendukung paragraf ganda & pemformatan teks
              </span>
            </div>
            <textarea
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mulai menulis atau ketik isi artikel selengkap mungkin. Gunakan baris baru untuk memisahkan paragraf..."
              className="w-full p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 leading-relaxed focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none font-normal placeholder-slate-400"
            />
          </div>

          {/* Yoast-grade SEO Metabox */}
          <SeoMetabox
            seo={seo}
            onChange={setSeo}
            defaultTitle={title}
            defaultDescription={excerpt}
            slug={slug}
          />
        </div>

        {/* Right Column: Meta Boxes (Publish, Featured Image, Category, Author) */}
        <div className="w-full lg:w-80 space-y-5 shrink-0">
          {/* Box 1: Status & Publikasi */}
          <div className="bg-white p-5 rounded-[4px] border border-[#c3c4c7] shadow-none space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#1d2327] border-b border-[#dcdcde] pb-2.5">
              Status & Penerbitan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-none"
                >
                  <option value="published">Diterbitkan (Publik)</option>
                  <option value="draft">Konsep (Draft)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Penulis:</span>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 text-right w-36 focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Estimasi Baca:</span>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 text-right w-28 focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Box 2: Gambar Unggulan (Featured Image) */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>Gambar Unggulan</span>
              <ImageIcon className="w-4 h-4 text-slate-400" />
            </h3>

            {imageUrl && (
              <div className="relative aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={imageUrl}
                  alt="Featured Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                URL Gambar Banner:
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Box 3: Kategori Pos */}
          <div className="bg-white p-5 rounded-[4px] border border-[#c3c4c7] shadow-none space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#1d2327] border-b border-[#dcdcde] pb-2.5 flex items-center justify-between">
              <span>Kategori</span>
              <Tag className="w-4 h-4 text-[#50575e]" />
            </h3>

            <div className="space-y-1.5">
              {GENERIC_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-xs text-[#2c3338] cursor-pointer p-1 rounded-[3px] hover:bg-[#f6f7f7]"
                >
                  <input
                    type="radio"
                    name="post_category"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="text-[#2271b1] focus:ring-[#2271b1]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
