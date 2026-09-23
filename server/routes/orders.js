/**
 * Order Management Engine Router
 * Provides complete Order CRUD, multi-criteria filtering, inline status update,
 * and direct WhatsApp action notifications.
 */

import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Master in-memory orders store pre-seeded with multi-industry samples
let orders = [
  {
    id: 'ORD-2026-101',
    customerName: 'Budi Pratama',
    customerPhone: '081234567890',
    customerEmail: 'budi.pratama@gmail.com',
    itemDetails: {
      name: 'Toyota Alphard Transformer 2.5G',
      category: 'Rental & Otomotif',
      quantity: 1,
      duration: '1 Hari (All-in Supir & BBM)',
      price: 2500000
    },
    transactionDate: '2026-09-23T09:30:00.000Z',
    totalAmount: 2500000,
    status: 'confirmed',
    notes: 'Penjemputan Bandara Soekarno Hatta Terminal 3 Domestik pkl 14:00.',
    createdAt: '2026-09-23T09:30:00.000Z',
    updatedAt: '2026-09-23T10:15:00.000Z'
  },
  {
    id: 'ORD-2026-102',
    customerName: 'Siti Nurhaliza',
    customerPhone: '085712345678',
    customerEmail: 'siti.nur@outlook.com',
    itemDetails: {
      name: 'Paket Artisan French Croissant & Brioche Box',
      category: 'F&B & Kuliner',
      quantity: 3,
      duration: 'Pengiriman Hari Ini',
      price: 165000
    },
    transactionDate: '2026-09-23T11:15:00.000Z',
    totalAmount: 495000,
    status: 'pending',
    notes: 'Kirim sebelum jam 16:00 sore, kartu ucapan ulang tahun atas nama Rina.',
    createdAt: '2026-09-23T11:15:00.000Z',
    updatedAt: '2026-09-23T11:15:00.000Z'
  },
  {
    id: 'ORD-2026-103',
    customerName: 'Hendro Kusumo, S.H.',
    customerPhone: '082198765432',
    customerEmail: 'hendro@corporatetech.id',
    itemDetails: {
      name: 'Paket Legal Corporate & Pendaftaran HKI Merek',
      category: 'Jasa Profesional',
      quantity: 1,
      duration: 'Proses 14 Hari Kerja',
      price: 4800000
    },
    transactionDate: '2026-09-22T14:00:00.000Z',
    totalAmount: 4800000,
    status: 'completed',
    notes: 'Berkas akta notaris dan surat kuasa lengkap telah diserahkan ke Kemenkumham.',
    createdAt: '2026-09-22T14:00:00.000Z',
    updatedAt: '2026-09-23T08:30:00.000Z'
  },
  {
    id: 'ORD-2026-104',
    customerName: 'Dewi Anggraini',
    customerPhone: '081399887766',
    customerEmail: 'dewi.ang@gmail.com',
    itemDetails: {
      name: 'Villa Private Pool Seminyak 3 Bedroom Luxury',
      category: 'Properti & Real Estate',
      quantity: 1,
      duration: '3 Hari 2 Malam',
      price: 3850000
    },
    transactionDate: '2026-09-21T16:20:00.000Z',
    totalAmount: 7700000,
    status: 'confirmed',
    notes: 'Check-in tanggal 28 September, request early check-in pkl 12:00 dan floating breakfast.',
    createdAt: '2026-09-21T16:20:00.000Z',
    updatedAt: '2026-09-22T10:00:00.000Z'
  },
  {
    id: 'ORD-2026-105',
    customerName: 'Rizky Ramadhan',
    customerPhone: '087811223344',
    customerEmail: 'rizky.rmd@yahoo.com',
    itemDetails: {
      name: 'Wireless Noise-Cancelling Headphones Pro Gen 2',
      category: 'E-Commerce & Retail',
      quantity: 2,
      duration: 'Pengiriman Kurir Instan',
      price: 1250000
    },
    transactionDate: '2026-09-20T10:05:00.000Z',
    totalAmount: 2500000,
    status: 'cancelled',
    notes: 'Dibatalkan oleh pelanggan karena salah memilih varian warna.',
    createdAt: '2026-09-20T10:05:00.000Z',
    updatedAt: '2026-09-20T11:00:00.000Z'
  }
];

/**
 * Format Indonesian Phone to WhatsApp International Format
 */
export const formatPhoneForWa = (phone = '') => {
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
};

/**
 * Helper to build WhatsApp Message Template
 */
export const buildWhatsAppUrl = (order, type = 'status_update') => {
  const phone = formatPhoneForWa(order.customerPhone);
  const itemName = typeof order.itemDetails === 'object' 
    ? (order.itemDetails?.name || 'Layanan / Produk') 
    : String(order.itemDetails);
  
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(order.totalAmount || 0);

  let msg = '';
  if (type === 'confirmed') {
    msg = `Halo Kak *${order.customerName}*,\n\nPesanan Anda *[${order.id}]* untuk *${itemName}* telah kami *DIKONFIRMASI*.\nTotal: *${formattedPrice}*.\n\nDetail/Catatan: ${order.notes || '-'}\n\nTerima kasih atas kepercayaan Anda!`;
  } else if (type === 'completed') {
    msg = `Halo Kak *${order.customerName}*,\n\nPesanan Anda *[${order.id}]* untuk *${itemName}* telah *SELESAI* dikerjakan/diantar.\n\nTerima kasih banyak telah memilih layanan kami. Sampai jumpa di pesanan berikutnya!`;
  } else if (type === 'cancelled') {
    msg = `Halo Kak *${order.customerName}*,\n\nMohon maaf, pesanan *[${order.id}]* untuk *${itemName}* saat ini berstatus *DIBATALKAN*.\nKeterangan: ${order.notes || '-'}\n\nSilakan hubungi kami kembali jika ada pertanyaan.`;
  } else {
    msg = `Halo Kak *${order.customerName}*,\n\nKami menginformasikan status pesanan *[${order.id}]*:\n• Item: *${itemName}*\n• Total: *${formattedPrice}*\n• Status: *${String(order.status).toUpperCase()}*\n• Catatan: ${order.notes || '-'}\n\nAda yang dapat kami bantu lebih lanjut?`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

/**
 * GET /api/admin/orders
 * Supports multi-criteria filter: status, search (name/id/phone/email), dateFrom, dateTo
 */
router.get('/', adminAuth, (req, res) => {
  try {
    const { status, search, dateFrom, dateTo } = req.query;

    let filtered = [...orders];

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }

    // Filter by search query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(o => {
        const itemName = typeof o.itemDetails === 'object' ? (o.itemDetails.name || '') : String(o.itemDetails);
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
          itemName.toLowerCase().includes(q)
        );
      });
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(o => new Date(o.transactionDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(o => new Date(o.transactionDate) <= endDate);
    }

    // Calculate status counts
    const counts = {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    // Calculate total revenue from confirmed & completed
    const totalRevenue = orders
      .filter(o => o.status === 'confirmed' || o.status === 'completed')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    res.json({
      success: true,
      orders: filtered,
      total: filtered.length,
      counts,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/orders
 * Manual Order Creation by Admin
 */
router.post('/', adminAuth, (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      itemDetails,
      totalAmount,
      status,
      notes,
      transactionDate
    } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Nama pelanggan dan nomor telepon/WhatsApp wajib diisi.'
      });
    }

    const newId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: newId,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: String(customerEmail || '').trim(),
      itemDetails: typeof itemDetails === 'object' ? itemDetails : { name: String(itemDetails || 'Pesanan Manual'), price: Number(totalAmount) || 0 },
      transactionDate: transactionDate ? new Date(transactionDate).toISOString() : new Date().toISOString(),
      totalAmount: Number(totalAmount) || 0,
      status: status || 'pending',
      notes: String(notes || '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: `Pesanan ${newId} berhasil dibuat`,
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/admin/orders/:id/status
 * Inline 1-Click Status Update
 */
router.patch('/:id/status', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status tidak valid. Harus salah satu dari: ${validStatuses.join(', ')}`
      });
    }

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    const updated = orders[orderIndex];
    const waUrl = buildWhatsAppUrl(updated, status);

    res.json({
      success: true,
      message: `Status pesanan ${id} berhasil diubah ke ${status}`,
      order: updated,
      whatsAppUrl: waUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/orders/:id
 * Full Update Order Details
 */
router.put('/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerPhone,
      customerEmail,
      itemDetails,
      totalAmount,
      status,
      notes,
      transactionDate
    } = req.body;

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan' });
    }

    const existing = orders[orderIndex];
    orders[orderIndex] = {
      ...existing,
      customerName: customerName ? String(customerName).trim() : existing.customerName,
      customerPhone: customerPhone ? String(customerPhone).trim() : existing.customerPhone,
      customerEmail: customerEmail !== undefined ? String(customerEmail).trim() : existing.customerEmail,
      itemDetails: itemDetails !== undefined ? itemDetails : existing.itemDetails,
      totalAmount: totalAmount !== undefined ? Number(totalAmount) : existing.totalAmount,
      status: status || existing.status,
      notes: notes !== undefined ? String(notes).trim() : existing.notes,
      transactionDate: transactionDate ? new Date(transactionDate).toISOString() : existing.transactionDate,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: `Pesanan ${id} berhasil diperbarui`,
      order: orders[orderIndex]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/orders/:id
 * Delete Order
 */
router.delete('/:id', adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan' });
    }

    const deleted = orders.splice(orderIndex, 1)[0];
    res.json({
      success: true,
      message: `Pesanan ${id} berhasil dihapus`,
      deletedId: id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Public Order Submission Endpoint (e.g. from customer checkout / booking modal)
 */
export const createPublicOrder = (orderData) => {
  const newId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
  const newOrder = {
    id: newId,
    customerName: String(orderData.name || 'Pelanggan Web').trim(),
    customerPhone: String(orderData.phone || '').trim(),
    customerEmail: String(orderData.email || '').trim(),
    itemDetails: orderData.itemDetails || { name: String(orderData.message || 'Pemesanan Web'), price: orderData.totalAmount || 0 },
    transactionDate: new Date().toISOString(),
    totalAmount: Number(orderData.totalAmount) || 0,
    status: 'pending',
    notes: String(orderData.message || '').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  return newOrder;
};

export const getOrdersStore = () => orders;
export default router;
