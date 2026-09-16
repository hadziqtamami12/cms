import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDbDriver } from '../lib/db-factory.js';
import { getCacheClient } from '../lib/cache-provider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_FILE = path.join(__dirname, '../data/posts.json');

const router = Router();

function escapeXml(unsafe = '') {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

async function readPosts() {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function getBaseUrl(req) {
  const host = req.get('host') || 'localhost:5173';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  return `${protocol}://${host}`;
}

/**
 * GET /sitemap.xml & /api/sitemap.xml
 * Standard Google Search Console Sitemap Index linking to page.xml and post.xml
 */
router.get(['/sitemap.xml', '/api/sitemap.xml'], async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/page.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/post.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += `</sitemapindex>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex'); // sitemap index doesn't need to be indexed as a webpage itself
  res.send(xml);
});

/**
 * GET /page.xml & /api/page.xml
 * XML Sitemap listing all published pages for Google Rich Snippets & Search Console
 */
router.get(['/page.xml', '/api/page.xml', '/pages.xml', '/api/pages.xml'], async (req, res) => {
  try {
    const db = await getDbDriver();
    const pages = await db.getPages();
    const baseUrl = getBaseUrl(req);
    const published = pages.filter((p) => p.status === 'published' || !p.status);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    for (const page of published) {
      const isHome = page.slug === 'home' || page.slug === '';
      const url = isHome ? `${baseUrl}/` : `${baseUrl}/?page=${encodeURIComponent(page.slug)}`;
      const lastMod = page.updatedAt ? new Date(page.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const priority = isHome ? '1.0' : '0.8';

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>${isHome ? 'daily' : 'weekly'}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      if (page.seo?.ogImage) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(page.seo.ogImage)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(page.title)}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    console.error('[Page Sitemap Error]', err);
    res.status(500).send('Error generating page.xml');
  }
});

/**
 * GET /post.xml & /api/post.xml
 * XML Sitemap listing all published articles/posts for Google Search Console & News
 */
router.get(['/post.xml', '/api/post.xml', '/posts.xml', '/api/posts.xml'], async (req, res) => {
  try {
    const posts = await readPosts();
    const baseUrl = getBaseUrl(req);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    for (const post of posts) {
      const url = `${baseUrl}/?article=${encodeURIComponent(post.slug || post.id)}`;
      const lastMod = post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      if (post.imageUrl) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(post.imageUrl)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(post.title)}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    console.error('[Post Sitemap Error]', err);
    res.status(500).send('Error generating post.xml');
  }
});

/**
 * GET /robots.txt & /api/robots.txt
 */
router.get(['/robots.txt', '/api/robots.txt'], (req, res) => {
  const baseUrl = getBaseUrl(req);
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /setup

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/page.xml
Sitemap: ${baseUrl}/post.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

export default router;
