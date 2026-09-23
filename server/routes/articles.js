/**
 * Dynamic Articles & Programmatic Multi-Location SEO Routes
 */

import { Router } from 'express';
import { query, getDbType } from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { getPublicSettings } from '../services/configService.js';

const router = Router();

// Helper to slugify string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Public: GET /api/articles
 * Returns published articles with pagination and filters
 */
router.get('/public', async (req, res) => {
  try {
    const { category, location, search, limit = 12, offset = 0 } = req.query;
    const dbType = getDbType();

    let sql = `SELECT id, title, slug, excerpt, featured_image, category, location_variable, views_count, created_at, updated_at FROM articles WHERE is_published = TRUE`;
    const params = [];

    if (category) {
      params.push(category);
      sql += dbType === 'postgres' ? ` AND category = $${params.length}` : ` AND category = ?`;
    }

    if (location) {
      params.push(location);
      sql += dbType === 'postgres' ? ` AND location_variable = $${params.length}` : ` AND location_variable = ?`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += dbType === 'postgres' 
        ? ` AND (title ILIKE $${params.length} OR excerpt ILIKE $${params.length})` 
        : ` AND (title LIKE ? OR excerpt LIKE ?)`;
      if (dbType !== 'postgres') params.push(`%${search}%`);
    }

    sql += ` ORDER BY created_at DESC LIMIT ${parseInt(limit, 10) || 12} OFFSET ${parseInt(offset, 10) || 0}`;

    let rows = [];
    try {
      const result = await query(sql, params);
      rows = Array.isArray(result) ? result : (result?.rows || []);
    } catch (dbErr) {
      console.warn('[Articles API] DB query fallback:', dbErr.message);
      // Return empty array if table not found or empty
      rows = [];
    }

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Public: GET /api/articles/:slug
 * Returns single article by slug and increments views_count
 */
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const dbType = getDbType();

    const sql = dbType === 'postgres' 
      ? `SELECT * FROM articles WHERE slug = $1 LIMIT 1` 
      : `SELECT * FROM articles WHERE slug = ? LIMIT 1`;

    const result = await query(sql, [slug]);
    const rows = Array.isArray(result) ? result : (result?.rows || []);
    const article = rows[0];

    if (!article) {
      return res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
    }

    // Increment views asynchronously
    const incSql = dbType === 'postgres'
      ? `UPDATE articles SET views_count = views_count + 1 WHERE id = $1`
      : `UPDATE articles SET views_count = views_count + 1 WHERE id = ?`;
    query(incSql, [article.id]).catch(() => {});

    res.json({
      success: true,
      data: article
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: GET /api/admin/articles
 * Lists all articles for dashboard management
 */
router.get('/manage', adminAuth, async (req, res) => {
  try {
    const sql = `SELECT id, title, slug, excerpt, featured_image, category, location_variable, is_published, views_count, created_at, updated_at FROM articles ORDER BY created_at DESC`;
    let rows = [];
    try {
      const result = await query(sql);
      rows = Array.isArray(result) ? result : (result?.rows || []);
    } catch (e) {
      console.warn('[Articles Manage] Error:', e.message);
    }

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: POST /api/admin/articles
 * Creates a single new article
 */
router.post('/manage', adminAuth, async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      content,
      excerpt,
      featured_image,
      category = 'Umum',
      location_variable = null,
      meta_title,
      meta_description,
      canonical_url,
      schema_markup,
      is_published = true
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Judul dan konten artikel wajib diisi' });
    }

    const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const slug = slugify(customSlug || title);
    const computedExcerpt = excerpt || content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim();
    const dbType = getDbType();

    const insertSql = dbType === 'postgres'
      ? `INSERT INTO articles (id, title, slug, content, excerpt, featured_image, category, location_variable, meta_title, meta_description, canonical_url, schema_markup, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`
      : `INSERT INTO articles (\`id\`, \`title\`, \`slug\`, \`content\`, \`excerpt\`, \`featured_image\`, \`category\`, \`location_variable\`, \`meta_title\`, \`meta_description\`, \`canonical_url\`, \`schema_markup\`, \`is_published\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      id,
      title,
      slug,
      content,
      computedExcerpt,
      featured_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      category,
      location_variable,
      meta_title || title,
      meta_description || computedExcerpt,
      canonical_url || `/artikel/${slug}`,
      JSON.stringify(schema_markup || {}),
      is_published
    ];

    await query(insertSql, params);

    res.status(201).json({
      success: true,
      message: 'Artikel berhasil disimpan',
      data: { id, title, slug }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: PUT /api/admin/articles/:id
 * Updates an existing article
 */
router.put('/manage/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: customSlug,
      content,
      excerpt,
      featured_image,
      category,
      location_variable,
      meta_title,
      meta_description,
      canonical_url,
      schema_markup,
      is_published
    } = req.body;

    const dbType = getDbType();
    const slug = slugify(customSlug || title);
    const computedExcerpt = excerpt || (content ? content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim() : '');

    const updateSql = dbType === 'postgres'
      ? `UPDATE articles SET
          title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          content = COALESCE($3, content),
          excerpt = COALESCE($4, excerpt),
          featured_image = COALESCE($5, featured_image),
          category = COALESCE($6, category),
          location_variable = $7,
          meta_title = COALESCE($8, meta_title),
          meta_description = COALESCE($9, meta_description),
          canonical_url = COALESCE($10, canonical_url),
          schema_markup = COALESCE($11, schema_markup),
          is_published = COALESCE($12, is_published),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $13 RETURNING *`
      : `UPDATE articles SET
          \`title\` = COALESCE(?, \`title\`),
          \`slug\` = COALESCE(?, \`slug\`),
          \`content\` = COALESCE(?, \`content\`),
          \`excerpt\` = COALESCE(?, \`excerpt\`),
          \`featured_image\` = COALESCE(?, \`featured_image\`),
          \`category\` = COALESCE(?, \`category\`),
          \`location_variable\` = ?,
          \`meta_title\` = COALESCE(?, \`meta_title\`),
          \`meta_description\` = COALESCE(?, \`meta_description\`),
          \`canonical_url\` = COALESCE(?, \`canonical_url\`),
          \`schema_markup\` = COALESCE(?, \`schema_markup\`),
          \`is_published\` = COALESCE(?, \`is_published\`)
         WHERE \`id\` = ?`;

    const params = [
      title,
      slug,
      content,
      computedExcerpt,
      featured_image,
      category,
      location_variable,
      meta_title,
      meta_description,
      canonical_url,
      schema_markup ? JSON.stringify(schema_markup) : null,
      is_published,
      id
    ];

    const result = await query(updateSql, params);
    const updatedRows = Array.isArray(result) ? result : (result?.rows || []);

    res.json({
      success: true,
      message: 'Artikel berhasil diperbarui',
      data: updatedRows[0] || { id }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: DELETE /api/admin/articles/:id
 * Deletes an article
 */
router.delete('/manage/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const dbType = getDbType();
    const sql = dbType === 'postgres' ? `DELETE FROM articles WHERE id = $1` : `DELETE FROM articles WHERE id = ?`;
    await query(sql, [id]);

    res.json({
      success: true,
      message: 'Artikel berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: POST /api/admin/articles/generate-programmatic
 * Programmatic SEO Generator: Duplicates master template across a list of target locations
 */
router.post('/generate-programmatic', adminAuth, async (req, res) => {
  try {
    const {
      titleTemplate,
      slugTemplate,
      contentTemplate,
      locations = [],
      category = 'Rental Mobil Daerah',
      featuredImage
    } = req.body;

    if (!titleTemplate || !contentTemplate || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Judul template, konten template, dan daftar lokasi (minimal 1) wajib diisi'
      });
    }

    const appConfig = await getPublicSettings(false);
    const brandName = appConfig.brandName || 'Layanan Rental';
    const dbType = getDbType();

    let createdCount = 0;
    const generatedArticles = [];

    for (const rawLocation of locations) {
      const location = rawLocation.trim();
      if (!location) continue;

      // Replace {lokasi} & {Lokasi}
      const title = titleTemplate.replace(/\{lokasi\}/gi, location);
      const rawSlug = (slugTemplate || 'sewa-mobil-{lokasi}').replace(/\{lokasi\}/gi, location);
      const slug = slugify(rawSlug);
      const content = contentTemplate.replace(/\{lokasi\}/gi, location);
      const excerpt = content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim();

      const metaTitle = `${title} | ${brandName}`;
      const metaDescription = `Layanan ${title} terbaik, armada bersih, terawat, lepas kunci atau dengan sopir berpengalaman. Booking instan 24 jam.`;
      const canonicalUrl = `/artikel/${slug}`;

      // Schema markup for LocalBusiness + Article
      const schemaMarkup = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            'headline': title,
            'description': metaDescription,
            'image': featuredImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            'author': {
              '@type': 'Organization',
              'name': brandName
            }
          },
          {
            '@type': 'LocalBusiness',
            'name': `${brandName} ${location}`,
            'description': `Pusat rental mobil & transportasi terbaik di wilayah ${location}`,
            'areaServed': location,
            'telephone': appConfig.phone || '+6281288990011'
          }
        ]
      };

      const id = `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const image = featuredImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';

      // Insert or Update on conflict slug
      if (dbType === 'postgres') {
        await query(`
          INSERT INTO articles (id, title, slug, content, excerpt, featured_image, category, location_variable, meta_title, meta_description, canonical_url, schema_markup, is_published)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            excerpt = EXCLUDED.excerpt,
            meta_title = EXCLUDED.meta_title,
            meta_description = EXCLUDED.meta_description,
            schema_markup = EXCLUDED.schema_markup,
            updated_at = CURRENT_TIMESTAMP
        `, [id, title, slug, content, excerpt, image, category, location, metaTitle, metaDescription, canonicalUrl, JSON.stringify(schemaMarkup)]);
      } else {
        await query(`
          INSERT INTO articles (\`id\`, \`title\`, \`slug\`, \`content\`, \`excerpt\`, \`featured_image\`, \`category\`, \`location_variable\`, \`meta_title\`, \`meta_description\`, \`canonical_url\`, \`schema_markup\`, \`is_published\`)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
          ON DUPLICATE KEY UPDATE
            \`title\` = VALUES(\`title\`),
            \`content\` = VALUES(\`content\`),
            \`excerpt\` = VALUES(\`excerpt\`),
            \`meta_title\` = VALUES(\`meta_title\`),
            \`meta_description\` = VALUES(\`meta_description\`),
            \`schema_markup\` = VALUES(\`schema_markup\`)
        `, [id, title, slug, content, excerpt, image, category, location, metaTitle, metaDescription, canonicalUrl, JSON.stringify(schemaMarkup)]);
      }

      createdCount++;
      generatedArticles.push({ title, slug, location });
    }

    res.json({
      success: true,
      message: `Berhasil membuat ${createdCount} artikel programmatic SEO untuk ${locations.length} lokasi!`,
      createdCount,
      articles: generatedArticles
    });
  } catch (err) {
    console.error('[Programmatic SEO Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
