import React, { useState, useEffect } from 'react';
import {
  Newspaper, Plus, Edit, Trash2, ExternalLink, Calendar,
  Clock, User, Tag, Image, RefreshCw, AlertCircle, Eye, Search, Filter
} from 'lucide-react';
import { fetchAdminPosts, deleteAdminPost } from '../../utils/api';
import {
  Button,
  Input,
  Select,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell
} from '../../components/ui';

export default function PostsManager({ onEditPost, onNewPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDeletePost = async (id, postTitle) => {
    if (!window.confirm(`Yakin ingin memindahkan pos "${postTitle}" ke tong sampah?`)) return;
    try {
      await deleteAdminPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  // Categories list
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' || (p.status || 'published') === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const countPublished = posts.filter((p) => (p.status || 'published') === 'published').length;
  const countDraft = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header Bar: Title + Add New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-900 shadow-xs">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                Pos & Artikel
              </h1>
              <Button
                variant="secondary"
                size="sm"
                onClick={onNewPost}
                icon={Plus}
              >
                Tambah Pos
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola artikel blog, wawasan, panduan, dan konten SEO
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadPosts}
          disabled={loading}
          icon={RefreshCw}
          className={loading ? 'animate-pulse' : ''}
        >
          Segarkan
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Post Status Sub-nav Filter */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium border-b border-slate-200 pb-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors text-xs ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white font-medium shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Semua <span className="opacity-75">({posts.length})</span>
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setStatusFilter('published')}
          className={`px-3 py-1.5 rounded-lg transition-colors text-xs ${
            statusFilter === 'published'
              ? 'bg-slate-900 text-white font-medium shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Diterbitkan <span className="opacity-75">({countPublished})</span>
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setStatusFilter('draft')}
          className={`px-3 py-1.5 rounded-lg transition-colors text-xs ${
            statusFilter === 'draft'
              ? 'bg-slate-900 text-white font-medium shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Draf <span className="opacity-75">({countDraft})</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel / pos..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
          />
        </div>
      </div>

      {/* Standard Post List Table */}
      {loading ? (
        <Card className="p-12 text-center text-xs text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-600" />
          <span>Memuat data pos...</span>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-semibold text-slate-800">Tidak ada pos yang cocok</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ditemukan artikel berdasarkan filter atau pencarian saat ini.
          </p>
          <Button
            onClick={onNewPost}
            icon={Plus}
          >
            Tulis Pos Pertama Anda
          </Button>
        </Card>
      ) : (
        <Table>
          <TableHead>
            <tr>
              <TableHeader className="w-16">Banner</TableHeader>
              <TableHeader>Judul Pos & Aksi Cepat</TableHeader>
              <TableHeader>Penulis</TableHeader>
              <TableHeader>Kategori</TableHeader>
              <TableHeader>Tanggal</TableHeader>
              <TableHeader className="text-center">Status</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {filteredPosts.map((post) => (
              <TableRow
                key={post.id}
                className="group"
              >
                {/* Featured Thumbnail */}
                <TableCell>
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200';
                      }}
                    />
                  </div>
                </TableCell>

                {/* Title and Quick Hover Actions */}
                <TableCell className="min-w-[260px]">
                  <button
                    onClick={() => onEditPost(post)}
                    className="font-semibold text-slate-900 hover:text-slate-700 text-left block line-clamp-1 text-sm transition-colors"
                    title="Klik untuk membuka Halaman Editor Pos"
                  >
                    {post.title}
                  </button>

                  {/* Slug permalink preview */}
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    /?article={post.slug}
                  </div>

                  {/* Row hover actions */}
                  <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-slate-400 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditPost(post)}
                      className="text-slate-900 hover:underline font-semibold"
                    >
                      Sunting
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                    <span>•</span>
                    <a
                      href={`/?article=${encodeURIComponent(post.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-0.5"
                    >
                      <span>Lihat</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </TableCell>

                {/* Author */}
                <TableCell className="whitespace-nowrap text-slate-600">
                  {post.author || 'Admin'}
                </TableCell>

                {/* Category Badge */}
                <TableCell className="whitespace-nowrap">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                    {post.category || 'Umum'}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell className="whitespace-nowrap">
                  <div className="font-medium text-slate-800">
                    {post.date || 'Hari ini'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {post.readTime || '4 mnt'}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (post.status || 'published') === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {(post.status || 'published') === 'published' ? 'Diterbitkan' : 'Draf'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}

      {/* Table footer with total post summary */}
      <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-500">
        <span>Menampilkan {filteredPosts.length} dari {posts.length} pos artikel</span>
        <span className="font-medium text-slate-700">CMS Article Engine</span>
      </div>
    </div>
  );
}
