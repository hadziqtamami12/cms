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
 * Auto-ensure dynamic columns in database schema
 */
async function ensureArticlesSchema() {
  try {
    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_dynamic BOOLEAN DEFAULT FALSE;`);
      await query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS dynamic_config JSONB DEFAULT '{}'::jsonb;`);
    } else if (dbType === 'mysql') {
      try {
        await query(`ALTER TABLE articles ADD COLUMN is_dynamic BOOLEAN DEFAULT FALSE;`);
      } catch (_) {}
      try {
        await query(`ALTER TABLE articles ADD COLUMN dynamic_config JSON;`);
      } catch (_) {}
    }
  } catch (err) {
    console.warn('[Articles Schema Notice]:', err.message);
  }
}
setTimeout(() => {
  ensureArticlesSchema().catch(() => {});
}, 1000);

/**
 * Universal dynamic template string replacer
 * Replaces {lokasi}, {Lokasi}, {LOKASI}, {keyword}, {Keyword}, {slug}, {nama_web}
 */
function resolveDynamicText(text, variables = {}) {
  if (!text || typeof text !== 'string') return text || '';
  let result = text;
  const { lokasi = '', keyword = '', slug = '', brandName = '' } = variables;

  const locRaw = String(lokasi || '').trim();
  const locLower = locRaw.toLowerCase();
  const locTitle = locRaw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  const locUpper = locRaw.toUpperCase();

  const kwRaw = String(keyword || '').trim();
  const kwLower = kwRaw.toLowerCase();
  const kwTitle = kwRaw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  const kwUpper = kwRaw.toUpperCase();

  // 1. Lokasi Placeholders
  result = result.replace(/\{lokasi\}/g, locLower);
  result = result.replace(/\{Lokasi\}/g, locTitle);
  result = result.replace(/\{LOKASI\}/g, locUpper);

  // 2. Keyword Placeholders
  result = result.replace(/\{keyword\}/g, kwLower);
  result = result.replace(/\{Keyword\}/g, kwTitle);
  result = result.replace(/\{KEYWORD\}/g, kwUpper);

  // 3. Slug & Brand Placeholders
  result = result.replace(/\{slug\}/g, slug);
  result = result.replace(/\{nama_web\}/gi, brandName);
  result = result.replace(/\{brand\}/gi, brandName);

  return result;
}

/**
 * Public: GET /api/articles/public
 * Returns published articles with pagination and filters
 */
router.get('/public', async (req, res) => {
  try {
    const { category, location, search, limit = 12, offset = 0 } = req.query;
    const dbType = getDbType();
    const appConfig = await getPublicSettings(false);
    const brandName = appConfig.brandName || appConfig.pwa_name || 'MultiCMS';

    let sql = `SELECT id, title, slug, excerpt, featured_image, category, location_variable, is_dynamic, dynamic_config, views_count, created_at, updated_at FROM articles WHERE is_published = TRUE`;
    const params = [];

    if (category && category !== 'Semua') {
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
        ? ` AND (title ILIKE $${params.length} OR excerpt ILIKE $${params.length} OR location_variable ILIKE $${params.length} OR dynamic_config::text ILIKE $${params.length})` 
        : ` AND (title LIKE ? OR excerpt LIKE ? OR location_variable LIKE ? OR dynamic_config LIKE ?)`;
      if (dbType !== 'postgres') {
        params.push(`%${search}%`);
        params.push(`%${search}%`);
        params.push(`%${search}%`);
      }
    }

    sql += ` ORDER BY created_at DESC LIMIT ${parseInt(limit, 10) || 12} OFFSET ${parseInt(offset, 10) || 0}`;

    let rows = [];
    try {
      const result = await query(sql, params);
      rows = Array.isArray(result) ? result : (result?.rows || []);
    } catch (dbErr) {
      console.warn('[Articles API] DB query fallback:', dbErr.message);
      rows = [];
    }

    // Process dynamic articles for public listing preview
    const processedRows = rows.map(art => {
      if (!art.is_dynamic) return art;

      let cfg = art.dynamic_config;
      if (typeof cfg === 'string') {
        try { cfg = JSON.parse(cfg); } catch (_) { cfg = {}; }
      }
      cfg = cfg || {};

      const locations = Array.isArray(cfg.locations)
        ? cfg.locations
        : (typeof cfg.locations === 'string' ? cfg.locations.split(/[\n,]/).map(s => s.trim()).filter(Boolean) : []);
      const slugPattern = (cfg.slug_pattern || 'sewa-mobil-{lokasi}').trim();
      const focusKeywordTemplate = (cfg.focus_keyword_template || 'sewa mobil {lokasi}').trim();

      // If user is searching a specific city that matches one of our locations, dynamically tune title & slug
      let previewLoc = locations[0] || 'Utama';
      if (search) {
        const found = locations.find(l => l.toLowerCase().includes(search.toLowerCase()));
        if (found) previewLoc = found;
      }

      const previewSlug = slugify(slugPattern.replace(/\{lokasi\}/gi, slugify(previewLoc)));
      const previewTitle = resolveDynamicText(art.title, {
        lokasi: previewLoc,
        keyword: resolveDynamicText(focusKeywordTemplate, { lokasi: previewLoc, brandName }),
        slug: previewSlug,
        brandName
      });
      const previewExcerpt = resolveDynamicText(art.excerpt, {
        lokasi: previewLoc,
        keyword: resolveDynamicText(focusKeywordTemplate, { lokasi: previewLoc, brandName }),
        slug: previewSlug,
        brandName
      });

      return {
        ...art,
        title: previewTitle,
        slug: previewSlug,
        excerpt: previewExcerpt,
        location_variable: previewLoc,
        is_dynamic: true,
        dynamic_locations_count: locations.length,
        dynamic_locations: locations.slice(0, 8),
        dynamic_slug_pattern: slugPattern
      };
    });

    res.json({
      success: true,
      data: processedRows,
      count: processedRows.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Public: GET /api/articles/public/:slug
 * Dynamic Multi-Slug Router: Returns article by slug and supports dynamic templating
 */
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const dbType = getDbType();
    const appConfig = await getPublicSettings(false);
    const brandName = appConfig.brandName || appConfig.pwa_name || 'MultiCMS';

    // 1. Direct query by exact slug
    const sql = dbType === 'postgres' 
      ? `SELECT * FROM articles WHERE slug = $1 LIMIT 1` 
      : `SELECT * FROM articles WHERE slug = ? LIMIT 1`;

    const result = await query(sql, [slug]);
    const rows = Array.isArray(result) ? result : (result?.rows || []);
    const exactArticle = rows[0];

    // If exact match found and it is NOT dynamic, return standard article
    if (exactArticle && !exactArticle.is_dynamic) {
      const incSql = dbType === 'postgres'
        ? `UPDATE articles SET views_count = views_count + 1 WHERE id = $1`
        : `UPDATE articles SET views_count = views_count + 1 WHERE id = ?`;
      query(incSql, [exactArticle.id]).catch(() => {});

      return res.json({
        success: true,
        data: exactArticle
      });
    }

    // 2. Query all published dynamic articles to find a match for this slug
    const dynSql = `SELECT * FROM articles WHERE is_dynamic = TRUE AND is_published = TRUE`;
    let dynArticles = [];
    try {
      const dynRes = await query(dynSql);
      dynArticles = Array.isArray(dynRes) ? dynRes : (dynRes?.rows || []);
    } catch (_) {}

    // Put exact article first if it was flagged dynamic
    const candidates = exactArticle && exactArticle.is_dynamic
      ? [exactArticle, ...dynArticles.filter(a => a.id !== exactArticle.id)]
      : dynArticles;

    let matchedArticle = null;
    let resolvedLocation = '';
    let resolvedKeyword = '';
    let allRelatedLocations = [];

    for (const cand of candidates) {
      let cfg = cand.dynamic_config;
      if (typeof cfg === 'string') {
        try { cfg = JSON.parse(cfg); } catch (_) { cfg = {}; }
      }
      cfg = cfg || {};

      const slugPattern = (cfg.slug_pattern || 'sewa-mobil-{lokasi}').trim();
      const focusKeywordTemplate = (cfg.focus_keyword_template || 'sewa mobil {lokasi}').trim();
      const locations = Array.isArray(cfg.locations)
        ? cfg.locations
        : (typeof cfg.locations === 'string' ? cfg.locations.split(/[\n,]/).map(s => s.trim()).filter(Boolean) : []);
      const customSlugs = cfg.custom_slug_mapping || {};

      // A. Check custom slug mapping
      if (customSlugs[slug]) {
        matchedArticle = cand;
        resolvedLocation = customSlugs[slug].lokasi || customSlugs[slug].location || slug;
        resolvedKeyword = customSlugs[slug].keyword || resolveDynamicText(focusKeywordTemplate, { lokasi: resolvedLocation, brandName });
        allRelatedLocations = locations.map(l => ({
          location: l,
          slug: slugify(slugPattern.replace(/\{lokasi\}/gi, slugify(l)))
        }));
        break;
      }

      // B. Check each location against the slug pattern
      for (const loc of locations) {
        const locSlug = slugify(loc);
        const expectedSlug = slugify(slugPattern.replace(/\{lokasi\}/gi, locSlug));

        if (expectedSlug === slug || locSlug === slug) {
          matchedArticle = cand;
          resolvedLocation = loc;
          resolvedKeyword = resolveDynamicText(focusKeywordTemplate, { lokasi: loc, brandName });
          allRelatedLocations = locations.map(l => ({
            location: l,
            slug: slugify(slugPattern.replace(/\{lokasi\}/gi, slugify(l)))
          }));
          break;
        }
      }

      if (matchedArticle) break;

      // C. Check Regex pattern matching if slug matches the pattern
      if (slugPattern.includes('{lokasi}')) {
        const regexStr = '^' + slugPattern
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace('\\{lokasi\\}', '([a-z0-9-]+)') + '$';
        const match = slug.match(new RegExp(regexStr, 'i'));
        if (match && match[1]) {
          const rawLoc = match[1];
          const autoLoc = rawLoc.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          matchedArticle = cand;
          resolvedLocation = autoLoc;
          resolvedKeyword = resolveDynamicText(focusKeywordTemplate, { lokasi: autoLoc, brandName });
          allRelatedLocations = locations.map(l => ({
            location: l,
            slug: slugify(slugPattern.replace(/\{lokasi\}/gi, slugify(l)))
          }));
          break;
        }
      }
    }

    if (!matchedArticle) {
      return res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
    }

    // Resolve dynamic variables
    const vars = {
      lokasi: resolvedLocation,
      keyword: resolvedKeyword,
      slug,
      brandName
    };

    const finalTitle = resolveDynamicText(matchedArticle.title, vars);
    const finalContent = resolveDynamicText(matchedArticle.content, vars);
    const rawExcerpt = matchedArticle.excerpt || matchedArticle.content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim();
    const finalExcerpt = resolveDynamicText(rawExcerpt, vars);
    const finalMetaTitle = resolveDynamicText(matchedArticle.meta_title || `${finalTitle} | ${brandName}`, vars);
    const finalMetaDesc = resolveDynamicText(matchedArticle.meta_description || finalExcerpt, vars);

    // Dynamic Schema Markup
    const dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": finalTitle,
      "description": finalMetaDesc,
      "image": [matchedArticle.featured_image],
      "datePublished": matchedArticle.created_at,
      "dateModified": matchedArticle.updated_at || matchedArticle.created_at,
      "author": [{
        "@type": "Organization",
        "name": brandName
      }],
      "publisher": {
        "@type": "Organization",
        "name": brandName
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `/artikel/${slug}`
      }
    };

    // Increment views on master article
    const incSql = dbType === 'postgres'
      ? `UPDATE articles SET views_count = views_count + 1 WHERE id = $1`
      : `UPDATE articles SET views_count = views_count + 1 WHERE id = ?`;
    query(incSql, [matchedArticle.id]).catch(() => {});

    return res.json({
      success: true,
      data: {
        ...matchedArticle,
        title: finalTitle,
        content: finalContent,
        excerpt: finalExcerpt,
        meta_title: finalMetaTitle,
        meta_description: finalMetaDesc,
        slug,
        location_variable: resolvedLocation,
        focus_keyword: resolvedKeyword,
        canonical_url: `/artikel/${slug}`,
        schema_markup: dynamicSchema,
        is_dynamic: true,
        related_locations: allRelatedLocations.filter(item => item.slug !== slug)
      }
    });
  } catch (err) {
    console.error('[Articles Detail Dynamic Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: GET /api/admin/articles/manage
 * Lists all articles for dashboard management
 */
router.get('/manage', adminAuth, async (req, res) => {
  try {
    const sql = `SELECT id, title, slug, excerpt, featured_image, category, location_variable, is_dynamic, dynamic_config, is_published, views_count, created_at, updated_at FROM articles ORDER BY created_at DESC`;
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
 * Admin: POST /api/admin/articles/manage
 * Creates a single new article (Standard or Dynamic Article)
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
      is_published = true,
      is_dynamic = false,
      dynamic_config = {}
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Judul dan konten artikel wajib diisi' });
    }

    const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const slug = slugify(customSlug || title);
    const computedExcerpt = excerpt || content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim();
    const dbType = getDbType();

    const insertSql = dbType === 'postgres'
      ? `INSERT INTO articles (id, title, slug, content, excerpt, featured_image, category, location_variable, meta_title, meta_description, canonical_url, schema_markup, is_published, is_dynamic, dynamic_config)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`
      : `INSERT INTO articles (\`id\`, \`title\`, \`slug\`, \`content\`, \`excerpt\`, \`featured_image\`, \`category\`, \`location_variable\`, \`meta_title\`, \`meta_description\`, \`canonical_url\`, \`schema_markup\`, \`is_published\`, \`is_dynamic\`, \`dynamic_config\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
      Boolean(is_published),
      Boolean(is_dynamic),
      typeof dynamic_config === 'object' ? JSON.stringify(dynamic_config) : (dynamic_config || '{}')
    ];

    await query(insertSql, params);

    res.status(201).json({
      success: true,
      message: is_dynamic ? 'Dynamic Article multi-slug berhasil disimpan!' : 'Artikel berhasil disimpan',
      data: { id, title, slug, is_dynamic }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: PUT /api/admin/articles/manage/:id
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
      is_published,
      is_dynamic,
      dynamic_config
    } = req.body;

    const dbType = getDbType();
    const slug = slugify(customSlug || title);
    const computedExcerpt = excerpt || (content ? content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim() : '');

    const isDynamicVal = typeof is_dynamic === 'boolean' ? is_dynamic : null;
    const dynamicConfigVal = dynamic_config !== undefined
      ? (typeof dynamic_config === 'object' ? JSON.stringify(dynamic_config) : String(dynamic_config))
      : null;

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
          is_dynamic = COALESCE($13, is_dynamic),
          dynamic_config = COALESCE($14, dynamic_config),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $15 RETURNING *`
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
          \`is_published\` = COALESCE(?, \`is_published\`),
          \`is_dynamic\` = COALESCE(?, \`is_dynamic\`),
          \`dynamic_config\` = COALESCE(?, \`dynamic_config\`)
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
      typeof is_published === 'boolean' ? is_published : null,
      isDynamicVal,
      dynamicConfigVal,
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

/**
 * Admin: POST /api/admin/articles/batch-delete
 * Bulk delete articles by ID array
 */
router.post('/batch-delete', adminAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Pilih minimal satu artikel untuk dihapus' });
    }

    const dbType = getDbType();
    if (dbType === 'postgres') {
      await query('DELETE FROM articles WHERE id = ANY($1)', [ids]);
    } else if (dbType === 'mysql') {
      const placeholders = ids.map(() => '?').join(',');
      await query(`DELETE FROM articles WHERE id IN (${placeholders})`, ids);
    }

    res.json({
      success: true,
      message: `Berhasil menghapus ${ids.length} artikel secara serentak (bulk delete)!`,
      deletedCount: ids.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Admin: POST /api/admin/articles/batch-status
 * Bulk update article publication status
 */
router.post('/batch-status', adminAuth, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Pilih minimal satu artikel' });
    }

    const isPublished = status === 'active' || status === true || status === 'published';
    const dbType = getDbType();

    if (dbType === 'postgres') {
      await query('UPDATE articles SET is_published = $1, updated_at = CURRENT_TIMESTAMP WHERE id = ANY($2)', [isPublished, ids]);
    } else if (dbType === 'mysql') {
      const placeholders = ids.map(() => '?').join(',');
      await query(`UPDATE articles SET is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`, [isPublished, ...ids]);
    }

    res.json({
      success: true,
      message: `Berhasil memperbarui status ${ids.length} artikel menjadi ${isPublished ? 'Terbit/Aktif' : 'Draf/Nonaktif'}!`,
      updatedCount: ids.length,
      is_published: isPublished
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
