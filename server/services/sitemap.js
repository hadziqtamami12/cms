/**
 * Automated XML Sitemap Engine
 * Generates Yoast/RankMath-grade XML Sitemaps:
 * - /sitemap_index.xml (Index)
 * - /page-sitemap.xml (Pages)
 * - /post-sitemap.xml (Posts)
 */

import { getDatabase } from '../config/db.js';

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

function getBaseUrl(req) {
  const host = req.get('host') || 'localhost:5173';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  return `${protocol}://${host}`;
}

export async function generateSitemapIndex(req) {
  const baseUrl = getBaseUrl(req);
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/page-sitemap.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/post-sitemap.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += `</sitemapindex>`;
  return xml;
}

export async function generatePageSitemap(req) {
  const db = await getDatabase();
  const pages = await db.getPages();
  const baseUrl = getBaseUrl(req);

  // Filter out drafts and pages with noindex
  const published = pages.filter((p) => {
    const isPublished = p.status === 'published' || !p.status;
    const isNoIndex = p.seo?.robots?.includes('noindex');
    return isPublished && !isNoIndex;
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  for (const page of published) {
    const isHome = page.slug === 'home' || page.slug === '';
    const url = isHome ? `${baseUrl}/` : `${baseUrl}/?page=${encodeURIComponent(page.slug)}`;
    const lastMod = page.updatedAt ? new Date(page.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const priority = isHome ? '1.0' : (page.seo?.priority || '0.8');
    const changefreq = isHome ? 'daily' : (page.seo?.changefreq || 'weekly');

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(url)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;

    const img = page.seo?.ogImage || page.featuredImage;
    if (img) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(img)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(page.title || 'Page')}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export async function generatePostSitemap(req) {
  const db = await getDatabase();
  const posts = await db.getPosts();
  const baseUrl = getBaseUrl(req);

  // Filter out drafts and noindex
  const published = posts.filter((p) => {
    const isPublished = p.status === 'published' || !p.status;
    const isNoIndex = p.seo?.robots?.includes('noindex');
    return isPublished && !isNoIndex;
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  for (const post of published) {
    const url = `${baseUrl}/?article=${encodeURIComponent(post.slug || post.id)}`;
    const lastMod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : (post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const priority = post.seo?.priority || '0.9';
    const changefreq = post.seo?.changefreq || 'weekly';

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(url)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;

    const img = post.imageUrl || post.seo?.ogImage;
    if (img) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(img)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(post.title || 'Article')}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export async function generateRobotsTxt(req) {
  const baseUrl = getBaseUrl(req);
  return `User-agent: *
Allow: /
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /builder/
Disallow: /setup

Sitemap: ${baseUrl}/sitemap_index.xml
Sitemap: ${baseUrl}/page-sitemap.xml
Sitemap: ${baseUrl}/post-sitemap.xml
`;
}
