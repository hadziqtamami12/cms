import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, ExternalLink, Trash2, Edit, Sparkles,
  CheckCircle, Globe, Layers, AlertCircle, RefreshCw, Search
} from 'lucide-react';
import { fetchAdminPages, deleteAdminPage } from '../../utils/api';
import {
  Button,
  Input,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell
} from '../../components/ui';

export default function PagesManager({ onEditPage, onNewPage }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadPages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminPages();
      setPages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (id, title, slug) => {
    if (slug === 'home') {
      alert('Halaman Beranda Utama (home) tidak dapat dihapus.');
      return;
    }
    if (!window.confirm(`Yakin ingin memindahkan halaman "${title}" ke tong sampah?`)) return;
    try {
      await deleteAdminPage(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || (p.status || 'published') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countPublished = pages.filter((p) => (p.status || 'published') === 'published').length;

  return (
    <div className="space-y-6">
      {/* Header Bar: Title + Add New Page Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-900 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                Halaman & Builder
              </h1>
              <Button
                variant="secondary"
                size="sm"
                onClick={onNewPage}
                icon={Plus}
              >
                Tambah Halaman
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola landing page, halaman statis, dan visual blocks website
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadPages}
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

      {/* Status Filter */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium border-b border-slate-200 pb-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors text-xs ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white font-medium shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Semua <span className="opacity-75">({pages.length})</span>
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
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Daftar Halaman Visual Builder Terdaftar
        </div>
        <div className="relative flex-grow sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari halaman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-colors duration-150 shadow-xs"
          />
        </div>
      </div>

      {/* Pages Table */}
      {loading ? (
        <Card className="p-12 text-center text-xs text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-600" />
          <span>Memuat data halaman...</span>
        </Card>
      ) : filteredPages.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-semibold text-slate-800">Tidak ada halaman ditemukan</div>
          <Button
            onClick={onNewPage}
            icon={Plus}
          >
            Buat Halaman Baru Sekarang
          </Button>
        </Card>
      ) : (
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Judul Halaman & Aksi Cepat</TableHeader>
              <TableHeader>Slug / URL</TableHeader>
              <TableHeader>Blok Desain</TableHeader>
              <TableHeader>Tema & Warna</TableHeader>
              <TableHeader className="text-center">Status</TableHeader>
              <TableHeader className="text-right">Aksi Editor</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {filteredPages.map((page) => {
              const isHome = page.slug === 'home' || page.id === 'page_rental_mobil_default';
              return (
                <TableRow
                  key={page.id}
                  className="group"
                >
                  {/* Title & Quick Actions */}
                  <TableCell className="min-w-[280px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditPage(page)}
                        className="font-semibold text-slate-900 hover:text-slate-700 text-left text-sm line-clamp-1 transition-colors"
                        title="Buka Halaman ini di Visual Page Builder"
                      >
                        {page.title}
                      </button>
                      {isHome && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold uppercase tracking-wider">
                          Beranda Utama
                        </span>
                      )}
                    </div>

                    {/* Row hover actions */}
                    <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-slate-400 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditPage(page)}
                        className="text-slate-900 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-slate-700" />
                        <span>Visual Builder</span>
                      </button>
                      {!isHome && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => handleDelete(page.id, page.title, page.slug)}
                            className="text-rose-600 hover:underline"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                      <span>•</span>
                      <a
                        href={isHome ? '/' : `/?page=${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-0.5"
                      >
                        <span>Lihat</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>

                  {/* Slug */}
                  <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                    {isHome ? '/' : `/?page=${page.slug}`}
                  </TableCell>

                  {/* Block count */}
                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>{page.blocks?.length || 0} Blok</span>
                    </span>
                  </TableCell>

                  {/* Theme and Mode */}
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium text-slate-800 capitalize text-xs">
                      {page.themeId || 'business-modern'}
                    </div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      {page.colorMode || 'light'} Mode
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {page.status || 'Diterbitkan'}
                    </span>
                  </TableCell>

                  {/* Right Action Button */}
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      onClick={() => onEditPage(page)}
                      icon={Sparkles}
                    >
                      Buka Studio
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      )}

      <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-500">
        <span>Menampilkan {filteredPages.length} dari {pages.length} halaman</span>
        <span className="font-medium text-slate-700">CMS Page Architecture</span>
      </div>
    </div>
  );
}
