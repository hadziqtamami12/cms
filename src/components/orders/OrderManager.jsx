import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Filter, MessageCircle, CheckCircle2, Clock,
  XCircle, AlertCircle, Trash2, Edit3, ChevronDown, RefreshCw,
  ExternalLink, Calendar, DollarSign, User, Phone, Mail, FileText,
  X, Check, Copy, SlidersHorizontal, Eye
} from 'lucide-react';
import {
  fetchOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} from '../../lib/api';

export const OrderManager = ({ adminToken, activeThemeName }) => {
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Mobile Filter Drawer & Detail Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const [copiedMap, setCopiedMap] = useState({});

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [activeOrder, setActiveOrder] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    itemName: '',
    itemCategory: activeThemeName || 'Layanan Utama',
    totalAmount: '',
    status: 'pending',
    notes: '',
    transactionDate: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const copyToClipboard = (text, id, label = 'Teks') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedMap(prev => ({ ...prev, [id]: true }));
      showToast(`${label} disalin ke clipboard`);
      setTimeout(() => {
        setCopiedMap(prev => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  const loadOrders = async (overrideSearch) => {
    setLoading(true);
    try {
      const q = overrideSearch !== undefined ? overrideSearch : searchQuery;
      const res = await fetchOrders({
        status: statusFilter,
        search: q
      }, adminToken);

      if (res && res.success) {
        setOrders(res.orders || []);
        if (res.counts) setCounts(res.counts);
        if (res.totalRevenue !== undefined) setTotalRevenue(res.totalRevenue);
      }
    } catch {
      showToast('Gagal memuat daftar pesanan');
    } finally {
      setLoading(false);
    }
  };

  // Instant Debounced Live Search (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      loadOrders(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, adminToken]);

  // Inline Status Change Handler (Optimistic UI Update)
  const handleInlineStatusChange = async (orderId, newStatus) => {
    // Optimistically update local state immediately
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (detailOrder && detailOrder.id === orderId) {
      setDetailOrder(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Status [${orderId}] diubah ke ${newStatus.toUpperCase()}`);

    try {
      const res = await updateOrderStatus(orderId, newStatus, adminToken);
      if (!res || !res.success) {
        loadOrders();
      }
    } catch {
      showToast('Gagal menyinkronkan status ke server');
      loadOrders();
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      itemName: '',
      itemCategory: activeThemeName || 'Layanan Utama',
      totalAmount: '',
      status: 'pending',
      notes: '',
      transactionDate: new Date().toISOString().slice(0, 16)
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (order) => {
    setModalMode('edit');
    setActiveOrder(order);
    const itemName = typeof order.itemDetails === 'object' ? (order.itemDetails.name || '') : String(order.itemDetails);
    const itemCategory = typeof order.itemDetails === 'object' ? (order.itemDetails.category || '') : '';
    setFormData({
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      customerEmail: order.customerEmail || '',
      itemName: itemName,
      itemCategory: itemCategory || activeThemeName || 'Layanan Utama',
      totalAmount: order.totalAmount || '',
      status: order.status || 'pending',
      notes: order.notes || '',
      transactionDate: order.transactionDate ? new Date(order.transactionDate).toISOString().slice(0, 16) : ''
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        itemDetails: {
          name: formData.itemName,
          category: formData.itemCategory
        },
        totalAmount: Number(formData.totalAmount) || 0,
        status: formData.status,
        notes: formData.notes,
        transactionDate: formData.transactionDate ? new Date(formData.transactionDate).toISOString() : new Date().toISOString()
      };

      if (modalMode === 'create') {
        const res = await createOrder(payload, adminToken);
        if (res && res.success) {
          showToast('Pesanan baru berhasil ditambahkan');
          setIsModalOpen(false);
          loadOrders();
        }
      } else {
        const res = await updateOrder(activeOrder.id, payload, adminToken);
        if (res && res.success) {
          showToast(`Pesanan [${activeOrder.id}] berhasil diperbarui`);
          setIsModalOpen(false);
          loadOrders();
        }
      }
    } catch {
      showToast('Gagal menyimpan pesanan');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Order Handler
  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await deleteOrder(orderId, adminToken);
      if (res && res.success) {
        showToast(`Pesanan [${orderId}] berhasil dihapus`);
        setDeleteConfirmId(null);
        if (detailOrder && detailOrder.id === orderId) setDetailOrder(null);
        loadOrders();
      }
    } catch {
      showToast('Gagal menghapus pesanan');
    }
  };

  // WhatsApp Deep-link Helper
  const getWhatsAppUrl = (order) => {
    let cleanPhone = String(order.customerPhone || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);
    
    const itemName = typeof order.itemDetails === 'object' ? (order.itemDetails?.name || 'Pesanan') : String(order.itemDetails);
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(order.totalAmount || 0);

    const msg = `Halo Kak *${order.customerName}*,\n\nKami mengonfirmasi pesanan Anda *[${order.id}]*:\n• Item: *${itemName}*\n• Total: *${formattedPrice}*\n• Status: *${String(order.status).toUpperCase()}*\n• Catatan: ${order.notes || '-'}\n\nTerima kasih telah mempercayai layanan kami!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Badge Status Renderer with Inline Quick Dropdown
  const renderStatusBadge = (status, orderId) => {
    const statusMap = {
      pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
      confirmed: { label: 'Dikonfirmasi', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
      completed: { label: 'Selesai', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      cancelled: { label: 'Dibatalkan', bg: 'bg-rose-50 text-rose-700 border-rose-200' }
    };

    const cfg = statusMap[status] || statusMap.pending;

    return (
      <div className="relative inline-block text-left">
        <select
          value={status}
          onChange={(e) => handleInlineStatusChange(orderId, e.target.value)}
          className={`appearance-none text-xs font-bold px-2.5 py-1 pr-6 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${cfg.bg}`}
          title="Klik untuk mengubah status pesanan secara instan"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Dikonfirmasi</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
        <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-full space-y-6 min-w-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce-in max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Total Pesanan</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{counts.all}</div>
          <span className="text-[11px] text-slate-500 font-medium truncate block">Semua transaksi</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block truncate">Pending Review</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600">{counts.pending}</div>
          <span className="text-[11px] text-amber-700 font-medium truncate block">Perlu konfirmasi</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block truncate">Dikonfirmasi</span>
          <div className="text-xl sm:text-2xl font-black text-blue-600">{counts.confirmed}</div>
          <span className="text-[11px] text-blue-700 font-medium truncate block">Sedang diproses</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block truncate">Total Omset Selesai</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 truncate">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium truncate block">
            {counts.completed} pesanan tuntas
          </span>
        </div>
      </div>

      {/* Main Table & Filter Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header & Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
              Manajemen Data Pesanan (Order Hub)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Pencarian instan debounced, inline status change, dan drawer detail pesanan.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pesanan Baru</span>
          </button>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3 min-w-0">
          {/* DESKTOP TOOLBAR (Screens >= 768px): Wrapped Pills + Search */}
          <div className="hidden md:flex flex-wrap items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Semua', count: counts.all },
                { id: 'pending', label: 'Pending', count: counts.pending },
                { id: 'confirmed', label: 'Dikonfirmasi', count: counts.confirmed },
                { id: 'completed', label: 'Selesai', count: counts.completed },
                { id: 'cancelled', label: 'Dibatalkan', count: counts.cancelled },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    statusFilter === tab.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Instant Debounced Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, ID, WA, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* MOBILE TOOLBAR (Screens < 768px): Full-Width Search + Compact Filter Button */}
          <div className="flex md:hidden items-center gap-2 w-full">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik untuk mencari pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className={`px-3 py-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold shrink-0 transition-colors ${
                statusFilter !== 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {statusFilter !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
          </div>

          {/* Active Filter Indicator on Mobile */}
          {statusFilter !== 'all' && (
            <div className="md:hidden flex items-center justify-between bg-blue-50 px-3 py-1.5 rounded-xl text-xs text-blue-700 font-semibold">
              <span>Filter: <b className="capitalize">{statusFilter}</b></span>
              <button
                onClick={() => setStatusFilter('all')}
                className="text-[11px] underline font-bold"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Orders Content Area */}
        <div className="p-4 sm:p-6 min-w-0">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Belum ada data pesanan</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Pesanan yang masuk dari landing page atau yang dibuat manual akan muncul secara terorganisir di sini.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW (Screens >= 768px) */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">ID & Tanggal</th>
                      <th className="py-3 px-4">Pelanggan</th>
                      <th className="py-3 px-4">Layanan / Item</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => {
                      const itemName = typeof order.itemDetails === 'object' ? (order.itemDetails.name || '-') : String(order.itemDetails);
                      const itemCat = typeof order.itemDetails === 'object' ? order.itemDetails.category : null;
                      const isCopied = copiedMap[order.id];

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-blue-600 font-bold">{order.id}</span>
                              <button
                                onClick={() => copyToClipboard(order.id, order.id, 'ID Pesanan')}
                                className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
                                title="Salin ID Pesanan"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-sans block">
                              {new Date(order.transactionDate).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 min-w-[160px] max-w-[220px]">
                            <div className="font-bold text-slate-900 text-sm truncate" title={order.customerName}>
                              {order.customerName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono truncate flex items-center gap-1">
                              <span>{order.customerPhone}</span>
                              <button
                                onClick={() => copyToClipboard(order.customerPhone, `wa-${order.id}`, 'No WhatsApp')}
                                className="p-0.5 text-slate-400 hover:text-slate-700"
                                title="Salin Nomor WA"
                              >
                                {copiedMap[`wa-${order.id}`] ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                              </button>
                            </div>
                            {order.customerEmail && (
                              <div className="text-[10px] text-slate-400 truncate" title={order.customerEmail}>
                                {order.customerEmail}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 min-w-[200px] max-w-[260px]">
                            <div className="font-semibold text-slate-800 line-clamp-1 truncate" title={itemName}>
                              {itemName}
                            </div>
                            {itemCat && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block truncate max-w-full">
                                {itemCat}
                              </span>
                            )}
                            {order.notes && (
                              <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5 truncate" title={order.notes}>
                                "{order.notes}"
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.totalAmount || 0)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {renderStatusBadge(order.status, order.id)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1">
                            {/* Detail Button */}
                            <button
                              onClick={() => setDetailOrder(order)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                              title="Lihat Detail Lengkap"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                            {/* WhatsApp Button */}
                            <a
                              href={getWhatsAppUrl(order)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                              title="Kirim pesan WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            {/* Edit Button */}
                            <button
                              onClick={() => openEditModal(order)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                              title="Edit Pesanan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => setDeleteConfirmId(order.id)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                              title="Hapus Pesanan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE STACKED CARDS VIEW (Screens < 768px, Strict Zero Horizontal Overflow) */}
              <div className="md:hidden space-y-3 w-full max-w-full min-w-0">
                {orders.map((order) => {
                  const itemName = typeof order.itemDetails === 'object' ? (order.itemDetails.name || '-') : String(order.itemDetails);
                  const isCopied = copiedMap[order.id];

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 w-full min-w-0 break-words"
                    >
                      {/* Card Header: ID, Date, & Status Dropdown */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-blue-600 text-xs truncate">{order.id}</span>
                            <button
                              onClick={() => copyToClipboard(order.id, order.id, 'ID')}
                              className="p-0.5 text-slate-400 hover:text-blue-600"
                              title="Salin ID"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {new Date(order.transactionDate).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {renderStatusBadge(order.status, order.id)}
                        </div>
                      </div>

                      {/* Card Body: Customer & Item */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-sm text-slate-900 truncate" title={order.customerName}>
                            {order.customerName}
                          </span>
                          <span className="font-bold text-xs text-slate-900 whitespace-nowrap shrink-0">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.totalAmount || 0)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium truncate" title={itemName}>
                          {itemName}
                        </div>
                        {order.notes && (
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 italic break-words line-clamp-2" title={order.notes}>
                            "{order.notes}"
                          </div>
                        )}
                      </div>

                      {/* Card Actions: WhatsApp, Detail Drawer, Edit, Delete */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                        <a
                          href={getWhatsAppUrl(order)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs truncate"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          onClick={() => setDetailOrder(order)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0 font-bold text-xs flex items-center gap-1"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => openEditModal(order)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(order.id)}
                          className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 shrink-0"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* DETAIL BOTTOM SHEET DRAWER (Mobile & Desktop) */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            onClick={() => setDetailOrder(null)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative z-50 bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 space-y-4 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto sm:hidden" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Detail Pesanan</span>
                <h4 className="font-extrabold text-slate-900 text-base font-mono truncate">{detailOrder.id}</h4>
              </div>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Pelanggan</span>
                <div className="font-extrabold text-sm text-slate-900">{detailOrder.customerName}</div>
                <div className="text-slate-600 font-mono">{detailOrder.customerPhone}</div>
                {detailOrder.customerEmail && <div className="text-slate-500">{detailOrder.customerEmail}</div>}
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Item / Layanan</span>
                <div className="font-extrabold text-sm text-slate-900">
                  {typeof detailOrder.itemDetails === 'object' ? detailOrder.itemDetails.name : String(detailOrder.itemDetails)}
                </div>
                {typeof detailOrder.itemDetails === 'object' && detailOrder.itemDetails.category && (
                  <span className="inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-semibold">
                    {detailOrder.itemDetails.category}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 border border-blue-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-700 block">Total Transaksi</span>
                  <span className="text-base font-black text-slate-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(detailOrder.totalAmount || 0)}
                  </span>
                </div>
                <div>
                  {renderStatusBadge(detailOrder.status, detailOrder.id)}
                </div>
              </div>

              {detailOrder.notes && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Catatan Pesanan</span>
                  <p className="text-slate-700 italic">"{detailOrder.notes}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={getWhatsAppUrl(detailOrder)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  const o = detailOrder;
                  setDetailOrder(null);
                  openEditModal(o);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET FILTER DRAWER (Strict Vertical Thumb-Friendly) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative z-50 bg-white rounded-t-3xl border-t border-slate-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Filter & Urutkan Pesanan</h4>
                <p className="text-[11px] text-slate-500">Pilih status pesanan untuk menyaring tampilan</p>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Status Pesanan</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'all', label: 'Semua Pesanan', count: counts.all },
                  { id: 'pending', label: 'Pending Review', count: counts.pending },
                  { id: 'confirmed', label: 'Dikonfirmasi', count: counts.confirmed },
                  { id: 'completed', label: 'Selesai', count: counts.completed },
                  { id: 'cancelled', label: 'Dibatalkan', count: counts.cancelled },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setStatusFilter(tab.id);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border ${
                      statusFilter === tab.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PESANAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {modalMode === 'create' ? 'Tambah Pesanan Baru' : `Edit Pesanan [${activeOrder?.id}]`}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Pelanggan *</label>
                <input
                  type="text"
                  required
                  placeholder="Budi Santoso"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="budi@gmail.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Layanan / Produk *</label>
                <input
                  type="text"
                  required
                  placeholder="Toyota Alphard 2026 / Paket Wedding / Villa Bali"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="2500000"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status Awal</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Dikonfirmasi</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Khusus (Opsional)</label>
                <textarea
                  rows="2.5"
                  placeholder="Detail lokasi penjemputan, instruksi khusus, dll."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  {formSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Simpan Pesanan' : 'Perbarui Pesanan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">Hapus Pesanan?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Data pesanan <span className="font-mono font-bold text-slate-800">{deleteConfirmId}</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOrder(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
