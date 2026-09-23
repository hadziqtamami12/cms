/**
 * Competitor Scraper & Content Extraction Route
 * Extracts product, vehicle, and service data from external URLs
 */

import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getPublicSettings, saveSettings } from '../services/configService.js';

const router = Router();

// Helper to sanitize and resolve relative image URLs to high-resolution assets
function resolveUrl(baseUrl, relativeOrAbsolute) {
  if (!relativeOrAbsolute || typeof relativeOrAbsolute !== 'string') return '';
  let cleaned = relativeOrAbsolute.trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned || cleaned.startsWith('data:') || cleaned.includes('spacer.gif') || cleaned.includes('1x1.')) return '';

  // Handle protocol-relative URL
  if (cleaned.startsWith('//')) {
    cleaned = 'https:' + cleaned;
  }

  try {
    const parsed = new URL(cleaned, baseUrl);

    // Try to remove thumbnail downscalers to get full-res image (WordPress, CDN resizers)
    let pathname = parsed.pathname;
    // e.g. -300x200.jpg -> .jpg
    const unscaledPath = pathname.replace(/-\d{2,4}x\d{2,4}(\.(?:jpg|jpeg|png|webp|avif))$/i, '$1');
    if (unscaledPath !== pathname) {
      parsed.pathname = unscaledPath;
    }

    // Strip thumbnail resizing params
    parsed.searchParams.delete('w');
    parsed.searchParams.delete('h');
    parsed.searchParams.delete('resize');
    parsed.searchParams.delete('fit');

    return parsed.href;
  } catch (e) {
    return relativeOrAbsolute;
  }
}

// Curated high-definition vehicle stock images bank (indexed by normalized model keywords)
const CAR_MODEL_STOCK_IMAGES = {
  'innova zenix': [
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ],
  'innova reborn': [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
  ],
  'innova': [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
  ],
  'avanza veloz': [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'veloz': [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'avanza': [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'xpander cross': [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ],
  'xpander': [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ],
  'fortuner': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
  ],
  'pajero': [
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
  ],
  'hiace premio': [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
  ],
  'hiace commuter': [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
  ],
  'hiace': [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
  ],
  'alphard': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
  ],
  'vellfire': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
  ],
  'brio': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
  ],
  'calya': [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
  ],
  'sigra': [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
  ],
  'ertiga': [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ],
  'xl7': [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
  ],
  'raize': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'rocky': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'yaris': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
  ],
  'jazz': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
  ],
  'mobilio': [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ],
  'camry': [
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ],
  'elf': [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
  ],
  'bus': [
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Helper to extract detailed image objects with URL, alt, title, and filename for semantic matching
function extractAllDetailedImages(html, baseUrl) {
  if (!html) return [];
  const results = [];
  const seenUrls = new Set();

  const addImage = (rawUrl, alt = '', title = '') => {
    const resolved = resolveUrl(baseUrl, rawUrl);
    if (!resolved || seenUrls.has(resolved)) return;

    const lower = resolved.toLowerCase();
    // Exclude trackers, small system icons, badges, payment icons
    if (lower.includes('favicon') || lower.includes('pixel') || lower.includes('spacer') ||
        lower.endsWith('.svg') || lower.includes('/wp-includes/') || lower.includes('gravatar') ||
        lower.includes('badge') || lower.includes('payment') || lower.includes('wa-icon')) {
      return;
    }

    seenUrls.add(resolved);
    let filename = '';
    try {
      filename = new URL(resolved).pathname.split('/').pop() || '';
    } catch (e) {}

    results.push({
      url: resolved,
      alt: (alt || '').trim(),
      title: (title || '').trim(),
      filename: filename.toLowerCase()
    });
  };

  // 1. Match <img> tags and all attributes (src, data-src, data-original, srcset, data-zoom, etc.)
  const imgTagRegex = /<img\b([^>]+)>/gi;
  let imgMatch;
  while ((imgMatch = imgTagRegex.exec(html)) !== null) {
    const attrs = imgMatch[1];
    const alt = matchRegex(attrs, /\balt=["']([^"']*)["']/i, 1);
    const title = matchRegex(attrs, /\btitle=["']([^"']*)["']/i, 1);

    const srcRegex = /\b(?:data-src|data-original|data-lazy-src|data-lazy|data-url|data-image|data-zoom-image|data-highres|data-large_image|data-orig-file|src)=["']([^"']+)["']/gi;
    let srcM;
    while ((srcM = srcRegex.exec(attrs)) !== null) {
      addImage(srcM[1], alt, title);
    }

    const srcsetRegex = /\b(?:srcset|data-srcset)=["']([^"']+)["']/gi;
    let setM;
    while ((setM = srcsetRegex.exec(attrs)) !== null) {
      const candidates = setM[1].split(',').map(s => s.trim().split(/\s+/)[0]);
      for (const cand of candidates.reverse()) {
        addImage(cand, alt, title);
      }
    }
  }

  // 2. Match <source> in <picture>
  const sourceTagRegex = /<source\b([^>]+)>/gi;
  let sourceMatch;
  while ((sourceMatch = sourceTagRegex.exec(html)) !== null) {
    const attrs = sourceMatch[1];
    const srcsetRegex = /\b(?:srcset|data-srcset)=["']([^"']+)["']/gi;
    let setM;
    while ((setM = srcsetRegex.exec(attrs)) !== null) {
      const candidates = setM[1].split(',').map(s => s.trim().split(/\s+/)[0]);
      for (const cand of candidates.reverse()) {
        addImage(cand);
      }
    }
  }

  // 3. Match CSS background-image
  const bgRegex = /background(?:-image)?:\s*url\(['"]?([^'")\s]+)['"]?\)/gi;
  let bgMatch;
  while ((bgMatch = bgRegex.exec(html)) !== null) {
    addImage(bgMatch[1]);
  }

  // 4. Match <a> links to images (lightbox / zoom gallery pattern)
  const aTagRegex = /<a\b[^>]*\bhref=["']([^"']+\.(?:jpe?g|png|webp|avif)(?:\?[^"']*)?)["'][^>]*>/gi;
  let aMatch;
  while ((aMatch = aTagRegex.exec(html)) !== null) {
    addImage(aMatch[1]);
  }

  return results;
}

// Helper to extract flat array of all image URLs (for backward compatibility)
function extractAllImagesFromHtml(html, baseUrl) {
  return extractAllDetailedImages(html, baseUrl).map(item => item.url);
}

// Assign distinct, semantically matched images to a specific item
function assignImagesToItem(title, blockImages = [], allDetailedImages = [], usedImagesTracker = new Set(), itemIndex = 0) {
  const normTitle = (title || '').toLowerCase();
  const matchedImages = [];

  // Step 1: Explicit images from item's DOM container
  if (Array.isArray(blockImages) && blockImages.length > 0) {
    for (const img of blockImages) {
      if (img && !matchedImages.includes(img)) {
        matchedImages.push(img);
        usedImagesTracker.add(img);
      }
    }
  }

  // Step 2: Semantic matching from all page images based on vehicle / product keywords
  const titleKeywords = normTitle
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !['sewa', 'rental', 'mobil', 'kota', 'jogja', 'jakarta', 'bali', 'surabaya', 'murah', 'harian', 'paket', 'dengan', 'tanpa', 'sopir', 'lepas', 'kunci', 'unit', 'harga', 'tarif'].includes(w));

  if (titleKeywords.length > 0) {
    for (const imgMeta of allDetailedImages) {
      const haystack = `${imgMeta.filename} ${imgMeta.alt} ${imgMeta.title}`.toLowerCase();
      const hasKeyword = titleKeywords.some(k => haystack.includes(k));
      if (hasKeyword && !matchedImages.includes(imgMeta.url)) {
        matchedImages.push(imgMeta.url);
        usedImagesTracker.add(imgMeta.url);
      }
    }
  }

  // Step 3: Match against Curated Vehicle Stock Images if this is an automotive rental item
  for (const [key, stockArr] of Object.entries(CAR_MODEL_STOCK_IMAGES)) {
    const keyParts = key.split(' ');
    const isModelMatch = keyParts.every(part => normTitle.includes(part));
    if (isModelMatch) {
      for (const stockImg of stockArr) {
        if (!matchedImages.includes(stockImg)) {
          matchedImages.push(stockImg);
        }
      }
      break;
    }
  }

  // Step 4: If still no image, assign an unused distinct image from page images
  if (matchedImages.length === 0) {
    const unused = allDetailedImages.find(item => !usedImagesTracker.has(item.url));
    if (unused) {
      matchedImages.push(unused.url);
      usedImagesTracker.add(unused.url);
    } else if (allDetailedImages.length > 0) {
      // Rotate through page images so different items don't all get the same index 0
      const rotated = allDetailedImages[itemIndex % allDetailedImages.length];
      if (rotated) matchedImages.push(rotated.url);
    }
  }

  // Step 5: Reliable default vehicle photo if page had literally zero images
  if (matchedImages.length === 0) {
    matchedImages.push('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
  }

  // Step 6: Expand gallery options (up to 8 images) from page images or model variations
  for (const item of allDetailedImages) {
    if (matchedImages.length >= 8) break;
    if (!matchedImages.includes(item.url)) {
      matchedImages.push(item.url);
    }
  }

  return {
    primaryImage: matchedImages[0],
    gallery: matchedImages.slice(0, 8) // Expanded to up to 8 images!
  };
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

// Helper to extract dual pricing and flexible rate formats
function extractPricingInfo(text) {
  if (!text) return { basePrice: 'Rp 450.000', selfDrive: 'Rp 450.000', withDriver: 'Rp 650.000' };

  // Format number to Indonesian Rupiah standard
  const formatRupiah = (num) => `Rp ${Number(num).toLocaleString('id-ID')}`;

  // 1. Search for Lepas Kunci / Self Drive
  const selfDriveRegex = /(?:lepas\s*kunci|self\s*drive|tanpa\s*sopir|unit\s*only)[\s\S]{0,40}?(?:Rp\.?|IDR)?\s*([0-9.,]{3,12})/i;
  const selfMatch = text.match(selfDriveRegex);

  // 2. Search for Dengan Sopir / Driver / All-In
  const withDriverRegex = /(?:dengan\s*sopir|sopir|driver|all\s*in|plus\s*sopir)[\s\S]{0,40}?(?:Rp\.?|IDR)?\s*([0-9.,]{3,12})/i;
  const driverMatch = text.match(withDriverRegex);

  // 3. Search general price occurrences
  const generalPriceMatches = [...text.matchAll(/(?:Rp\.?|IDR)\s*([0-9.,]{3,12})/gi)].map(m => m[1]);
  // Also look for standalone dot-separated thousands like 350.000 or 400.000
  const dotThousandsMatches = [...text.matchAll(/\b([1-9][0-9]{1,3}\.000)\b/g)].map(m => m[1]);

  let selfPriceNum = 0;
  let driverPriceNum = 0;

  if (selfMatch && selfMatch[1]) {
    selfPriceNum = parseInt(selfMatch[1].replace(/[^\d]/g, ''), 10) || 0;
  }
  if (driverMatch && driverMatch[1]) {
    driverPriceNum = parseInt(driverMatch[1].replace(/[^\d]/g, ''), 10) || 0;
  }

  // Fallbacks if specific keywords not found
  const allCandidateNumbers = [...generalPriceMatches, ...dotThousandsMatches]
    .map(p => parseInt(p.replace(/[^\d]/g, ''), 10))
    .filter(n => n >= 50000 && n <= 50000000);

  if (!selfPriceNum && allCandidateNumbers.length > 0) {
    selfPriceNum = allCandidateNumbers[0];
  }
  if (!driverPriceNum && allCandidateNumbers.length > 1) {
    driverPriceNum = allCandidateNumbers[1];
  }

  // If driver price still not detected, compute realistic companion tier
  if (!selfPriceNum) selfPriceNum = 450000;
  if (!driverPriceNum) {
    driverPriceNum = selfPriceNum >= 1000000 ? selfPriceNum + 350000 : selfPriceNum + 200000;
  }

  return {
    basePrice: formatRupiah(selfPriceNum),
    selfDrive: formatRupiah(selfPriceNum),
    withDriver: formatRupiah(driverPriceNum)
  };
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
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache'
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

    // Global collection of high-resolution images across entire page with metadata
    const allDetailedImages = extractAllDetailedImages(html, url);
    const allPageImages = allDetailedImages.map(img => img.url);

    const parsedItems = [];

    // 2. Next.js __NEXT_DATA__ or Nuxt state detection (Often gives 100% clean structured data)
    const nextDataMatch = html.match(/<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      try {
        const nextJson = JSON.parse(nextDataMatch[1]);
        const pageProps = nextJson?.props?.pageProps;
        // Search deeply for product arrays
        const candidateArrays = [
          pageProps?.products, pageProps?.items, pageProps?.fleet, pageProps?.cars,
          pageProps?.vehicles, pageProps?.data, pageProps?.catalog
        ].filter(Array.isArray);

        for (const arr of candidateArrays) {
          for (const item of arr) {
            if (item && (item.name || item.title || item.car_name)) {
              const itemTitle = item.name || item.title || item.car_name;
              const itemImages = (Array.isArray(item.images) ? item.images : [item.image || item.thumbnail || item.photo])
                .map(img => resolveUrl(url, typeof img === 'string' ? img : img?.url))
                .filter(Boolean);

              const priceStr = String(item.price || item.rate || item.harga || item.price_per_day || '');
              const prices = extractPricingInfo(priceStr);

              parsedItems.push({
                title: itemTitle,
                description: item.description || item.desc || `${itemTitle} kondisi prima siap jalan.`,
                image: itemImages[0] || '',
                images: itemImages,
                price: prices.basePrice,
                price_self_drive: prices.selfDrive,
                price_with_driver: prices.withDriver,
                category: item.category || 'Rental Mobil'
              });
            }
          }
        }
      } catch (e) {
        // Silently continue
      }
    }

    // 3. JSON-LD parsing (schema.org)
    const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1].trim());
        const entities = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
        for (const entity of entities) {
          if (['Product', 'Vehicle', 'Car', 'Service', 'IndividualProduct', 'RentalCar'].includes(entity['@type'])) {
            const rawImages = Array.isArray(entity.image)
              ? entity.image.map(img => resolveUrl(url, typeof img === 'string' ? img : img?.url)).filter(Boolean)
              : [resolveUrl(url, (entity.image?.url || entity.image) || ogImage)].filter(Boolean);

            const entityPrice = entity.offers?.price ? String(entity.offers.price) : (entity.price || '');
            const pricing = extractPricingInfo(entityPrice);

            parsedItems.push({
              title: entity.name || ogTitle,
              description: entity.description || ogDescription || '',
              image: rawImages[0] || '',
              images: rawImages,
              price: pricing.basePrice,
              price_self_drive: pricing.selfDrive,
              price_with_driver: pricing.withDriver,
              category: entity.category || 'Rental Mobil'
            });
          }
        }
      } catch (e) {}
    }

    // 4. HTML Table Parsing (Crucial for Rental companies listing rates in tables)
    const tableRowMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    for (const tr of tableRowMatches) {
      const rowHtml = tr[1];
      // Check if row has multiple cells with vehicle names and prices
      const cells = [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c => c[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      if (cells.length >= 2) {
        // Find car or product name in first 1-2 cells
        const potentialName = cells[0];
        const isHeader = potentialName.toLowerCase().includes('tipe') || potentialName.toLowerCase().includes('mobil') || potentialName.toLowerCase().includes('nama');
        const hasCarKeyword = /avanza|innova|hiace|brio|xpander|fortuner|alphard|pajero|sigra|calya|ertiga|mobilio|jazz|yaris|raize|rocky|camry|sedan|bus|elf/i.test(potentialName);

        if (!isHeader && (hasCarKeyword || potentialName.length > 3 && potentialName.length < 50)) {
          const rowText = cells.join(' ');
          const pricing = extractPricingInfo(rowText);
          const rowImages = extractAllImagesFromHtml(rowHtml, url);

          parsedItems.push({
            title: potentialName,
            description: `Unit ${potentialName} nyaman, terawat, dan siap pakai.`,
            image: rowImages[0] || '',
            images: rowImages,
            price: pricing.basePrice,
            price_self_drive: pricing.selfDrive,
            price_with_driver: pricing.withDriver,
            category: 'Rental Mobil'
          });
        }
      }
    }

    // 5. Card / Grid / List Extraction (Heuristic DOM)
    const cardRegex = /<(?:div|article|section|li)[^>]*class=["'][^"']*(?:card|product|item|fleet|armada|mobil|unit|rental|package|vehicle|col-|box)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|article|section|li)>/gi;
    const cardMatches = [...html.matchAll(cardRegex)];

    for (const card of cardMatches.slice(0, 30)) {
      const cardHtml = card[1];
      const titleMatch = matchRegex(cardHtml, /<(?:h2|h3|h4|h5|strong|a)[^>]*>([^<]{3,80})<\/(?:h2|h3|h4|h5|strong|a)>/i, 1);
      const cardImages = extractAllImagesFromHtml(cardHtml, url);
      const pricing = extractPricingInfo(cardHtml);

      if (titleMatch && (cardImages.length > 0 || cardHtml.match(/Rp|IDR|\.000/i))) {
        const cleanTitle = titleMatch.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        // Skip generic links
        if (!cleanTitle.toLowerCase().includes('menu') && !cleanTitle.toLowerCase().includes('nav') && cleanTitle.length > 3) {
          parsedItems.push({
            title: cleanTitle,
            description: cleanTitle,
            image: cardImages[0] || '',
            images: cardImages,
            price: pricing.basePrice,
            price_self_drive: pricing.selfDrive,
            price_with_driver: pricing.withDriver,
            category: 'Armada Pilihan'
          });
        }
      }
    }

    // 6. Comprehensive Fallback: match all headers and car keywords with page images
    if (parsedItems.length === 0) {
      const headerMatches = [...html.matchAll(/<(?:h2|h3|h4)[^>]*>([^<]{4,60})<\/(?:h2|h3|h4)>/gi)]
        .map(m => m[1].replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(t => !t.toLowerCase().includes('menu') && !t.toLowerCase().includes('kontak') && !t.toLowerCase().includes('footer') && !t.toLowerCase().includes('tentang'));

      for (let i = 0; i < Math.min(headerMatches.length, 8); i++) {
        const headerTitle = headerMatches[i];
        const pricing = extractPricingInfo(html);

        parsedItems.push({
          title: headerTitle,
          description: ogDescription || `${headerTitle} kualitas terbaik, fasilitas lengkap, dan bergaransi kepuasan.`,
          image: '',
          images: [],
          price: pricing.basePrice,
          price_self_drive: pricing.selfDrive,
          price_with_driver: pricing.withDriver,
          category: 'Katalog Unit'
        });
      }
    }

    // Deduplicate, perform intelligent semantic image assignment, and structure results
    const uniqueMap = new Map();
    const formattedResults = [];
    const usedImagesTracker = new Set();
    let itemIndex = 0;

    for (const item of parsedItems) {
      const normalizedTitle = item.title?.trim();
      if (!normalizedTitle || uniqueMap.has(normalizedTitle.toLowerCase())) continue;
      uniqueMap.set(normalizedTitle.toLowerCase(), true);

      const pricing = extractPricingInfo(`${item.price} ${item.price_self_drive || ''} ${item.price_with_driver || ''}`);
      const selfDrivePrice = item.price_self_drive || pricing.selfDrive;
      const withDriverPrice = item.price_with_driver || pricing.withDriver;

      // Collect any directly extracted images for this specific item
      const directImages = [
        item.image,
        ...(Array.isArray(item.images) ? item.images : [])
      ].filter(Boolean);

      // Intelligently assign distinct, semantically-matched photos (never identical, up to 8 gallery photos)
      const { primaryImage, gallery } = assignImagesToItem(
        normalizedTitle,
        directImages,
        allDetailedImages,
        usedImagesTracker,
        itemIndex++
      );

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
        image: primaryImage,
        images: gallery,
        pricing_tiers: [
          { label: 'Lepas Kunci', price: selfDrivePrice, unit: '/24 jam', is_default: true },
          { label: 'Dengan Sopir', price: withDriverPrice, unit: '/12 jam', is_default: false }
        ],
        description: item.description || `${normalizedTitle} prima, bersih dan siap pakai.`
      });
    }

    return res.json({
      success: true,
      meta: {
        pageTitle: ogTitle,
        pageDescription: ogDescription,
        sourceUrl: url,
        detectedCount: formattedResults.length,
        availableImagesCount: allPageImages.length
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

// Helper function to download an image and save to local storage
async function saveScrapedImage(imageUrl, title, productId) {
  if (!imageUrl || !imageUrl.startsWith('http')) return imageUrl;
  try {
    const fs = await import('fs');
    const path = await import('path');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const resp = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (!resp.ok) return imageUrl;
    const buffer = Buffer.from(await resp.arrayBuffer());
    const contentType = resp.headers.get('content-type') || 'image/jpeg';
    let ext = 'jpg';
    if (contentType.includes('webp')) ext = 'webp';
    else if (contentType.includes('png')) ext = 'png';

    const slug = (title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const filename = `${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    try {
      fs.writeFileSync(filePath, buffer);
      return `/uploads/${filename}`;
    } catch (writeErr) {
      return imageUrl;
    }
  } catch (err) {
    return imageUrl;
  }
}

/**
 * POST /api/admin/scraper/import
 * Imports selected scraped items directly into app_config.items,
 * saving external images to storage automatically.
 */
router.post('/import', adminAuth, async (req, res) => {
  try {
    const { items: newItems } = req.body;
    if (!Array.isArray(newItems) || newItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada item yang dipilih untuk diimpor' });
    }

    // Process and download images for each imported item
    const processedItems = await Promise.all(
      newItems.map(async (item) => {
        let savedMainImage = item.image;
        if (item.image && item.image.startsWith('http')) {
          savedMainImage = await saveScrapedImage(item.image, item.title, item.id);
        }

        let savedGallery = [savedMainImage];
        if (Array.isArray(item.images) && item.images.length > 0) {
          savedGallery = await Promise.all(
            item.images.map(imgUrl => saveScrapedImage(imgUrl, item.title, item.id))
          );
        }

        return {
          ...item,
          image: savedMainImage,
          images: savedGallery,
          pricing_tiers: Array.isArray(item.pricing_tiers) && item.pricing_tiers.length > 0
            ? item.pricing_tiers
            : [
                { label: 'Lepas Kunci', price: item.price_self_drive || item.price, unit: '/24 jam', is_default: true },
                { label: 'Dengan Sopir', price: item.price_with_driver || 'Rp 650.000', unit: '/12 jam', is_default: false }
              ]
        };
      })
    );

    const currentConfig = await getPublicSettings(false);
    const existingItems = Array.isArray(currentConfig.items) ? currentConfig.items : [];

    // Append new items
    const mergedItems = [...existingItems, ...processedItems];

    await saveSettings({
      ...currentConfig,
      items: mergedItems
    });

    res.json({
      success: true,
      message: `Berhasil mengimpor ${processedItems.length} produk ke katalog & mengunduh gambar ke storage!`,
      importedCount: processedItems.length,
      totalCount: mergedItems.length,
      items: processedItems
    });
  } catch (err) {
    console.error('[Import Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
