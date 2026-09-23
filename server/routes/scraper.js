/**
 * Competitor Scraper & Content Extraction Route
 * Extracts product, vehicle, and service data from external URLs
 */

import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getPublicSettings, saveSettings } from '../services/configService.js';

const router = Router();

// Helper to sanitize and resolve relative image URLs
function resolveUrl(baseUrl, relativeOrAbsolute) {
  if (!relativeOrAbsolute) return '';
  try {
    return new URL(relativeOrAbsolute, baseUrl).href;
  } catch (e) {
    return relativeOrAbsolute;
  }
}

// Helper to extract regex matches
function matchRegex(html, regex, groupIndex = 1) {
  const match = html.match(regex);
  return match && match[groupIndex] ? match[groupIndex].trim() : '';
}

// Helper to find all meta tag values
function getMetaContent(html, propertyOrName) {
  const patterns = [
    new RegExp(`<meta[^>]*property=["'](?:og:|twitter:)?${propertyOrName}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["'](?:og:|twitter:)?${propertyOrName}["']`, 'i'),
    new RegExp(`<meta[^>]*name=["'](?:og:|twitter:)?${propertyOrName}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["'](?:og:|twitter:)?${propertyOrName}["']`, 'i')
  ];

  for (const pattern of patterns) {
    const val = matchRegex(html, pattern, 1);
    if (val) return val;
  }
  return '';
}

/**
 * POST /api/admin/scraper/analyze
 * Scrapes target URL and returns extracted products/services with preview data
 */
router.post('/analyze', adminAuth, async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({
      success: false,
      error: 'URL eksternal tidak valid. Pastikan diawali dengan http:// atau https://'
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Gagal mengakses URL tujuan (HTTP ${response.status}: ${response.statusText})`
      });
    }

    const html = await response.text();

    // 1. Meta / OpenGraph Extraction
    const ogTitle = getMetaContent(html, 'title') || matchRegex(html, /<title[^>]*>([^<]*)<\/title>/i, 1);
    const ogDescription = getMetaContent(html, 'description');
    const ogImage = resolveUrl(url, getMetaContent(html, 'image'));
    const ogPrice = getMetaContent(html, 'price:amount') || getMetaContent(html, 'price');

    // 2. JSON-LD parsing
    let jsonLdProducts = [];
    const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1].trim());
        const entities = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
        for (const entity of entities) {
          if (entity['@type'] === 'Product' || entity['@type'] === 'Vehicle' || entity['@type'] === 'Car' || entity['@type'] === 'Service') {
            jsonLdProducts.push({
              title: entity.name || ogTitle,
              description: entity.description || ogDescription,
              image: resolveUrl(url, (Array.isArray(entity.image) ? entity.image[0] : (entity.image?.url || entity.image)) || ogImage),
              price: entity.offers?.price ? `Rp ${Number(entity.offers.price).toLocaleString('id-ID')}` : (ogPrice || 'Rp 500.000'),
              category: entity.category || 'Rental Mobil'
            });
          }
        }
      } catch (e) {
        // Continue if json parsing fails
      }
    }

    // 3. Heuristic Product / Card detection if JSON-LD didn't yield multiple items
    const parsedItems = [...jsonLdProducts];

    // If no JSON-LD products or single product, search HTML cards
    // Look for common card structures: article, .car-item, .card, etc.
    const cardRegex = /<(?:div|article|section)[^>]*class=["'][^"']*(?:card|product|item|fleet|armada|mobil|unit)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|article|section)>/gi;
    const cardMatches = [...html.matchAll(cardRegex)];

    for (const card of cardMatches.slice(0, 12)) {
      const cardHtml = card[1];
      const titleMatch = matchRegex(cardHtml, /<(?:h2|h3|h4|h5|strong|a)[^>]*>([^<]{3,80})<\/(?:h2|h3|h4|h5|strong|a)>/i, 1);
      const imgMatch = matchRegex(cardHtml, /<img[^>]*src=["']([^"']+)["']/i, 1);
      const priceMatch = matchRegex(cardHtml, /(?:Rp\.?|IDR)\s*([\d.,]{3,15})/i, 0);

      if (titleMatch && (imgMatch || priceMatch)) {
        // Clean title
        const cleanTitle = titleMatch.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        // Skip obvious navigation or footer links
        if (!cleanTitle.toLowerCase().includes('menu') && !cleanTitle.toLowerCase().includes('nav') && cleanTitle.length > 3) {
          parsedItems.push({
            title: cleanTitle,
            description: cleanTitle,
            image: resolveUrl(url, imgMatch),
            price: priceMatch ? priceMatch.trim() : 'Rp 500.000',
            category: 'Armada Pilihan'
          });
        }
      }
    }

    // Heuristic Fallback: at least return the page itself as a high-quality product/service
    if (parsedItems.length === 0) {
      // Find prominent price
      const priceRegex = /(?:Rp\.?|IDR)\s*([0-9.,]{3,12})/i;
      const detectedPrice = matchRegex(html, priceRegex, 0) || 'Rp 750.000';

      parsedItems.push({
        title: ogTitle ? ogTitle.split(/[-|–]/)[0].trim() : 'Layanan Unit Rental',
        description: ogDescription || 'Unit kendaraan prima, bersih terawat dan siap pakai.',
        image: ogImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        price: detectedPrice,
        category: 'Armada'
      });
    }

    // Deduplicate and enrich items with CMS format
    const uniqueMap = new Map();
    const formattedResults = [];

    for (const item of parsedItems) {
      const normalizedTitle = item.title?.trim();
      if (!normalizedTitle || uniqueMap.has(normalizedTitle.toLowerCase())) continue;
      uniqueMap.set(normalizedTitle.toLowerCase(), true);

      // Guess dual pricing if not available
      const baseNum = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 500000;
      const selfDrivePrice = `Rp ${(baseNum).toLocaleString('id-ID')}`;
      const withDriverPrice = `Rp ${(baseNum + 250000).toLocaleString('id-ID')}`;

      formattedResults.push({
        id: `scraped_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: normalizedTitle,
        category: item.category || 'Rental Mobil',
        price: selfDrivePrice,
        price_self_drive: selfDrivePrice,
        price_with_driver: withDriverPrice,
        period: '/hari',
        badge: 'Unit Pilihan',
        specs: ['Kapasitas 5-7 Penumpang', 'Transmisi Matic / Manual', 'AC Dingin & Bersih', 'Layanan 24 Jam'],
        image: item.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        description: item.description || ''
      });
    }

    return res.json({
      success: true,
      meta: {
        pageTitle: ogTitle,
        pageDescription: ogDescription,
        sourceUrl: url,
        detectedCount: formattedResults.length
      },
      data: formattedResults
    });

  } catch (err) {
    console.error('[Scraper Error]', err);
    return res.status(500).json({
      success: false,
      error: `Gagal memproses scraping: ${err.message}`
    });
  }
});

/**
 * POST /api/admin/scraper/import
 * Imports selected scraped items directly into app_config.items
 */
router.post('/import', adminAuth, async (req, res) => {
  try {
    const { items: newItems } = req.body;
    if (!Array.isArray(newItems) || newItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada item yang dipilih untuk diimpor' });
    }

    const currentConfig = await getPublicSettings(false);
    const existingItems = Array.isArray(currentConfig.items) ? currentConfig.items : [];

    // Append new items
    const mergedItems = [...existingItems, ...newItems];

    await saveSettings({
      ...currentConfig,
      items: mergedItems
    });

    res.json({
      success: true,
      message: `Berhasil mengimpor ${newItems.length} produk/layanan ke katalog!`,
      importedCount: newItems.length,
      totalCount: mergedItems.length
    });
  } catch (err) {
    console.error('[Import Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
