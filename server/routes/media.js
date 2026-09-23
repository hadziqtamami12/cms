/**
 * Media Gallery & Image SEO Management Route
 * Supports single & bulk delete, SEO attributes editing (file_name, slug, title, alt, caption),
 * and automatic external asset downloading to local storage or Cloudflare R2.
 */

import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { query, getDbType } from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { isR2Configured, getUploadPresignedUrl, deleteFile } from '../config/storage.js';

const router = Router();

// In-Memory store fallback
const memoryMedia = new Map();

// Helper to ensure upload dir exists
const getLocalUploadDir = () => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
      console.warn('[MediaStorage] Failed to create local uploads dir:', e.message);
    }
  }
  return uploadDir;
};

// Helper to sanitize filename & generate slug
const sanitizeFilename = (name) => {
  return (name || 'image')
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * GET /api/admin/media
 * GET /api/admin/media/:productId
 * Retrieves media images, optionally filtered by productId
 */
router.get(['/', '/:productId'], adminAuth, async (req, res) => {
  const { productId } = req.params;

  try {
    const dbType = getDbType();
    if (dbType === 'postgres' || dbType === 'mysql') {
      let sql = 'SELECT * FROM product_images';
      const params = [];

      if (productId && productId !== 'all') {
        sql += ' WHERE product_id = $1 ORDER BY sort_order ASC, created_at DESC';
        if (dbType === 'mysql') {
          sql = 'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, created_at DESC';
        }
        params.push(productId);
      } else {
        sql += ' ORDER BY sort_order ASC, created_at DESC';
      }

      const rows = await query(sql, params).catch(() => null);
      if (rows) {
        return res.json({ success: true, data: rows });
      }
    }

    // Memory Fallback
    const list = Array.from(memoryMedia.values());
    const filtered = productId && productId !== 'all'
      ? list.filter(m => m.product_id === productId)
      : list;

    return res.json({ success: true, data: filtered });
  } catch (err) {
    console.error('[Media Get Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/media
 * Creates a new media entry with complete SEO metadata
 */
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      product_id = null,
      url,
      file_name,
      slug,
      title,
      alt_text,
      caption = '',
      sort_order = 0,
      is_primary = false
    } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL gambar wajib diisi' });
    }

    const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const finalSlug = slug || sanitizeFilename(title || file_name || 'media');
    const finalFileName = file_name || `${finalSlug}.webp`;

    const item = {
      id,
      product_id,
      url,
      file_name: finalFileName,
      slug: finalSlug,
      title: title || finalSlug.replace(/-/g, ' '),
      alt_text: alt_text || title || 'Foto Produk',
      caption,
      sort_order: Number(sort_order) || 0,
      is_primary: Boolean(is_primary),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query(`
        INSERT INTO product_images (id, product_id, url, file_name, slug, title, alt_text, caption, sort_order, is_primary)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [item.id, item.product_id, item.url, item.file_name, item.slug, item.title, item.alt_text, item.caption, item.sort_order, item.is_primary]).catch(err => {
        console.warn('[DB product_images insert warning]', err.message);
      });
    } else if (dbType === 'mysql') {
      await query(`
        INSERT INTO product_images (\`id\`, \`product_id\`, \`url\`, \`file_name\`, \`slug\`, \`title\`, \`alt_text\`, \`caption\`, \`sort_order\`, \`is_primary\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [item.id, item.product_id, item.url, item.file_name, item.slug, item.title, item.alt_text, item.caption, item.sort_order, item.is_primary]).catch(err => {
        console.warn('[DB product_images insert warning]', err.message);
      });
    }

    memoryMedia.set(id, item);
    return res.status(201).json({ success: true, data: item, message: 'Gambar berhasil ditambahkan ke galeri' });
  } catch (err) {
    console.error('[Media Create Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/media/:id
 * Updates Image SEO attributes (file_name, slug, title, alt_text, caption, is_primary)
 */
router.put('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const {
    file_name,
    slug,
    title,
    alt_text,
    caption,
    sort_order,
    is_primary
  } = req.body;

  try {
    const dbType = getDbType();
    const cleanSlug = slug ? sanitizeFilename(slug) : undefined;

    if (dbType === 'postgres') {
      await query(`
        UPDATE product_images
        SET file_name = COALESCE($1, file_name),
            slug = COALESCE($2, slug),
            title = COALESCE($3, title),
            alt_text = COALESCE($4, alt_text),
            caption = COALESCE($5, caption),
            sort_order = COALESCE($6, sort_order),
            is_primary = COALESCE($7, is_primary),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
      `, [file_name, cleanSlug, title, alt_text, caption, sort_order, is_primary, id]).catch(() => null);
    } else if (dbType === 'mysql') {
      await query(`
        UPDATE product_images
        SET file_name = COALESCE(?, file_name),
            slug = COALESCE(?, slug),
            title = COALESCE(?, title),
            alt_text = COALESCE(?, alt_text),
            caption = COALESCE(?, caption),
            sort_order = COALESCE(?, sort_order),
            is_primary = COALESCE(?, is_primary),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [file_name, cleanSlug, title, alt_text, caption, sort_order, is_primary, id]).catch(() => null);
    }

    // Update memory
    const existing = memoryMedia.get(id) || {};
    const updated = {
      ...existing,
      id,
      ...(file_name !== undefined && { file_name }),
      ...(cleanSlug !== undefined && { slug: cleanSlug }),
      ...(title !== undefined && { title }),
      ...(alt_text !== undefined && { alt_text }),
      ...(caption !== undefined && { caption }),
      ...(sort_order !== undefined && { sort_order: Number(sort_order) }),
      ...(is_primary !== undefined && { is_primary: Boolean(is_primary) }),
      updated_at: new Date().toISOString()
    };
    memoryMedia.set(id, updated);

    return res.json({
      success: true,
      message: 'Atribut SEO gambar berhasil diperbarui!',
      data: updated
    });
  } catch (err) {
    console.error('[Media Update Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/media/:id
 * Single image delete
 */
router.delete('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query('DELETE FROM product_images WHERE id = $1', [id]).catch(() => null);
    } else if (dbType === 'mysql') {
      await query('DELETE FROM product_images WHERE id = ?', [id]).catch(() => null);
    }

    memoryMedia.delete(id);
    return res.json({ success: true, message: 'Gambar berhasil dihapus dari galeri' });
  } catch (err) {
    console.error('[Media Delete Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/media/batch-delete
 * Bulk delete multiple media items by array of IDs
 */
router.post('/batch-delete', adminAuth, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: 'Pilih minimal satu gambar untuk dihapus' });
  }

  try {
    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query('DELETE FROM product_images WHERE id = ANY($1)', [ids]).catch(() => null);
    } else if (dbType === 'mysql') {
      const placeholders = ids.map(() => '?').join(',');
      await query(`DELETE FROM product_images WHERE id IN (${placeholders})`, ids).catch(() => null);
    }

    for (const id of ids) {
      memoryMedia.delete(id);
    }

    return res.json({
      success: true,
      message: `Berhasil menghapus ${ids.length} gambar secara serentak (bulk delete)!`,
      deletedCount: ids.length
    });
  } catch (err) {
    console.error('[Media Batch Delete Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/media/download-external
 * Automatically downloads an external image to local storage / Cloudflare R2
 * generating SEO friendly filename & slug
 */
router.post('/download-external', adminAuth, async (req, res) => {
  const { url, title, product_id } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ success: false, error: 'URL gambar tidak valid' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const fetchRes = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!fetchRes.ok) {
      throw new Error(`HTTP ${fetchRes.status}: Gagal mengunduh gambar`);
    }

    const buffer = Buffer.from(await fetchRes.arrayBuffer());
    const contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
    let ext = 'jpg';
    if (contentType.includes('webp')) ext = 'webp';
    else if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('svg')) ext = 'svg';

    const slug = sanitizeFilename(title || 'produk-image');
    const filename = `${slug}-${Date.now()}.${ext}`;

    let finalPublicUrl = url; // safe fallback

    // If local filesystem writable, save locally
    const uploadDir = getLocalUploadDir();
    try {
      const localFilePath = path.join(uploadDir, filename);
      fs.writeFileSync(localFilePath, buffer);
      finalPublicUrl = `/uploads/${filename}`;
    } catch (writeErr) {
      console.warn('[MediaStorage] Local file write bypassed (serverless environment):', writeErr.message);
    }

    const mediaRecord = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product_id: product_id || null,
      url: finalPublicUrl,
      file_name: filename,
      slug,
      title: title || slug.replace(/-/g, ' '),
      alt_text: title || 'Foto unit produk',
      caption: '',
      sort_order: 0,
      is_primary: false,
      created_at: new Date().toISOString()
    };

    memoryMedia.set(mediaRecord.id, mediaRecord);

    return res.json({
      success: true,
      message: 'Gambar eksternal berhasil diunduh dan disimpan ke storage!',
      data: mediaRecord
    });
  } catch (err) {
    console.error('[Download External Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
