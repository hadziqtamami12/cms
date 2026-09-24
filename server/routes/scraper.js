/**
 * Competitor Scraper & Content Extraction Route
 * Extracts product, vehicle, and service data from external URLs
 */

import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getPublicSettings, saveSettings } from '../services/configService.js';
import { query, getDbType } from '../config/db.js';

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
  'venturer': [
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
  'xenia': [
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
  'rush': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
  ],
  'terios': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
  ],
  'brv': [
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'br-v': [
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'hrv': [
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'hr-v': [
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'crv': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
  ],
  'cr-v': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
  ],
  'stargazer': [
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ],
  'creta': [
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
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
  'agya': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
  ],
  'ayla': [
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
  'wuling': [
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
  ],
  'luxio': [
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  ],
  'gran max': [
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  ],
  'apv': [
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
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

// Distinct fallback pool so every item in a large 18+ fleet gets an individual high-res photo
const DIVERSE_VEHICLE_FALLBACKS = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
];

// Curated travel & tour destination images bank (indexed by normalized destination keywords)
const TRAVEL_DESTINATION_STOCK_IMAGES = {
  'bromo': [
    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80'
  ],
  'ijen': [
    'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
  ],
  'baluran': [
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
  ],
  'bali': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
  ],
  'jogja': [
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80'
  ],
  'borobudur': [
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80'
  ],
  'labuan bajo': [
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80'
  ],
  'komodo': [
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80'
  ],
  'lombok': [
    'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80'
  ],
  'malang': [
    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'
  ],
  'dieng': [
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Fallback pools for Travel, Slideshows, and Articles
const DIVERSE_TRAVEL_FALLBACKS = [
  'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80'
];

const DIVERSE_SLIDESHOW_FALLBACKS = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1920&q=80'
];

const DIVERSE_ARTICLE_FALLBACKS = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'
];

// Helper to extract detailed image objects with URL, alt, title, and filename for semantic matching
function extractAllDetailedImages(html, baseUrl) {
  if (!html) return [];
  const results = [];
  const seenUrls = new Set();

  const addImage = (rawUrl, alt = '', title = '') => {
    const resolved = resolveUrl(baseUrl, rawUrl);
    if (!resolved || seenUrls.has(resolved)) return;

    const lower = resolved.toLowerCase();
    // Exclude trackers, small system icons, badges, payment icons, logos, banners
    if (lower.includes('favicon') || lower.includes('pixel') || lower.includes('spacer') ||
        lower.endsWith('.svg') || lower.includes('/wp-includes/') || lower.includes('gravatar') ||
        lower.includes('badge') || lower.includes('payment') || lower.includes('wa-icon') ||
        lower.includes('logo') || lower.includes('banner') || lower.includes('footer') ||
        lower.includes('peta') || lower.includes('map') || lower.includes('mandiri') ||
        lower.includes('bca') || lower.includes('bri') || lower.includes('bni')) {
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

  // Step 1: Explicit images from item's DOM container (if they are genuine product images)
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

  // Step 4: If still no image, assign an unused distinct vehicle photo from DIVERSE_VEHICLE_FALLBACKS
  if (matchedImages.length === 0) {
    const fallbackPhoto = DIVERSE_VEHICLE_FALLBACKS[itemIndex % DIVERSE_VEHICLE_FALLBACKS.length];
    matchedImages.push(fallbackPhoto);
    usedImagesTracker.add(fallbackPhoto);
  }

  // Step 5: Expand gallery with additional angles (never push unrelated site logos or banners)
  const additionalOptions = DIVERSE_VEHICLE_FALLBACKS.filter(p => !matchedImages.includes(p));
  for (const opt of additionalOptions) {
    if (matchedImages.length >= 4) break;
    matchedImages.push(opt);
  }

  return {
    primaryImage: matchedImages[0],
    gallery: matchedImages.slice(0, 6)
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

// Dynamic Knowledge-Base of Authentic Vehicle Specifications for Smart Tagging
const VEHICLE_SPECS_KNOWLEDGE_BASE = {
  'innova zenix': ['7 Kursi Nyaman', 'Matic CVT', 'Hybrid Super Irit', 'Sunroof Panoramic'],
  'innova reborn': ['7 Kursi Nyaman', 'Matic / Manual', 'Diesel 2.4L Turbo', 'AC Double Blower'],
  'venturer': ['Captain Seat Mewah', 'Matic', 'Diesel 2.4L', 'Ambient Light'],
  'innova': ['7 Kursi Nyaman', 'Matic / Manual', 'Bensin / Diesel', 'AC Dingin Merata'],
  'avanza veloz': ['7 Kursi Modern', 'Matic CVT', 'Bensin Irit', 'Wireless Charger'],
  'veloz': ['7 Kursi Modern', 'Matic CVT', 'Bensin Irit', 'Tampilan Sporty'],
  'avanza': ['7 Kursi', 'Matic / Manual', 'Bensin Super Irit', 'AC Double Blower'],
  'xenia': ['7 Kursi', 'Matic / Manual', 'Bensin Irit 1.3L/1.5L', 'Kabin Lega'],
  'xpander cross': ['7 Kursi SUV', 'Matic CVT', 'Ground Clearance 225mm', 'Suspensi Empuk'],
  'xpander': ['7 Kursi Nyaman', 'Matic CVT', 'Kabin Senyap', 'Bagasi Luas'],
  'fortuner': ['7 Kursi Tangguh', 'Matic 4x2', 'Diesel Turbo 2.8L', 'Tangguh Segala Medan'],
  'pajero': ['7 Kursi Gagah', 'Matic 4x2', 'Diesel MIVEC Turbo', 'Sunroof Available'],
  'rush': ['7 Kursi SUV', 'Matic / Manual', 'Ground Clearance Tinggi', 'Tangguh Luar Kota'],
  'terios': ['7 Kursi SUV', 'Matic / Manual', 'Bensin Irit', 'Kamera 360 Available'],
  'hiace premio': ['9-14 Captain Seat', 'Manual 6-Speed', 'Diesel Turbo', 'Karaoke On-Board'],
  'hiace commuter': ['14-16 Kursi Luas', 'Manual', 'Diesel', 'AC Ducting Tiap Baris'],
  'hiace': ['14 Kursi Luas', 'Manual', 'Diesel Turbo', 'Kenyamanan Rombongan'],
  'alphard': ['7 Kursi Captain Seat', 'Matic', 'Bensin Mewah', 'VIP Chauffeur & All-In'],
  'vellfire': ['7 Kursi Captain Seat', 'Matic', 'Bensin', 'VIP Executive Style'],
  'brio': ['5 Kursi Lincah', 'Matic CVT', 'Super Irit BBM', 'Mudah Parkir City Tour'],
  'agya': ['5 Kursi Lincah', 'Matic / Manual', 'Hemat BBM', 'Lincah Dalam Kota'],
  'ayla': ['5 Kursi Lincah', 'Matic / Manual', 'Bensin Irit', 'City Tour'],
  'calya': ['7 Kursi Ekonomis', 'Matic / Manual', 'Super Irit BBM', 'Keluarga Hemat'],
  'sigra': ['7 Kursi Ekonomis', 'Matic / Manual', 'Bensin Irit', 'Ekonomis Praktis'],
  'ertiga': ['7 Kursi Nyaman', 'Matic / Manual', 'Smart Hybrid', 'Kabin Lega'],
  'xl7': ['7 Kursi SUV Crossover', 'Matic / Manual', 'Smart Hybrid', 'Ground Clearance 200mm'],
  'raize': ['5 Kursi Turbo', 'Matic CVT', 'Bensin 1.0L Turbo', 'Desain Modern'],
  'rocky': ['5 Kursi SUV', 'Matic CVT', 'Bensin Turbo', 'Lincah Bertenaga'],
  'yaris': ['5 Kursi Sporty', 'Matic CVT', 'Bensin 1.5L', 'Handling Mantap'],
  'jazz': ['5 Kursi Hatchback', 'Matic CVT', 'Ultra Seat Fleksibel', 'Kabin Lapang'],
  'mobilio': ['7 Kursi Lapang', 'Matic CVT', 'Bensin Irit', 'Bagasi Ekstra'],
  'camry': ['5 Kursi Mewah', 'Matic', 'Sedan Eksekutif', 'Standar Diplomatik VIP'],
  'wuling': ['Interior Modern', 'Electric / Bensin', 'Fitur Canggih', 'AC Dingin'],
  'luxio': ['8 Kursi Luas', 'Sliding Door', 'Bensin', 'Kabin Lapang'],
  'gran max': ['Muatan Luas', 'Manual', 'Bensin', 'Tangguh Niaga'],
  'apv': ['8 Kursi Luas', 'Manual / Matic', 'Bensin', 'Keluarga & Muatan'],
  'elf': ['16-19 Kursi', 'Diesel Tangguh', 'Full AC Tiap Baris', 'Pariwisata Nyaman'],
  'bus': ['30-50 Kursi', 'Reclining Seat', 'Full AC & Karaoke', 'Bagasi Ekstra Luas']
};

// Helper to extract specs / feature tags from HTML container or Model Knowledge Base
function extractSpecsAndTags(containerHtml = '', title = '') {
  const normTitle = (title || '').toLowerCase();
  const extractedTags = [];

  if (containerHtml) {
    // 1. Match <li> tags
    const liMatches = [...containerHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)];
    for (const m of liMatches) {
      const clean = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean && clean.length >= 2 && clean.length <= 40 && !clean.toLowerCase().includes('http')) {
        if (!extractedTags.includes(clean)) extractedTags.push(clean);
      }
    }

    // 2. Match tags or specs classes e.g. class="*spec*" or class="*tag*" or class="*badge*"
    const tagMatches = [...containerHtml.matchAll(/<(?:span|div|p|small)\b[^>]*class=["'][^"']*(?:spec|tag|feature|attr|item-spec|badge-pill|fasilitas|fitur)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|div|p|small)>/gi)];
    for (const m of tagMatches) {
      const clean = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean && clean.length >= 2 && clean.length <= 40 && !clean.toLowerCase().includes('http')) {
        if (!extractedTags.includes(clean)) extractedTags.push(clean);
      }
    }

    // 3. Match keyword patterns: "X Kursi / Seater", "Matic / Manual", "Bensin / Diesel / Hybrid / EV"
    const seatMatch = containerHtml.match(/\b([1-9][0-9]?\s*(?:kursi|seat|seater|penumpang))\b/i);
    if (seatMatch && !extractedTags.some(t => t.toLowerCase().includes('kursi') || t.toLowerCase().includes('seat'))) {
      extractedTags.push(seatMatch[1].trim());
    }

    const transmisiMatch = containerHtml.match(/\b(manual|matic|automatic|at\b|mt\b|cvt)\b/i);
    if (transmisiMatch && !extractedTags.some(t => t.toLowerCase().includes('matic') || t.toLowerCase().includes('manual'))) {
      const tVal = transmisiMatch[1].toUpperCase();
      extractedTags.push(tVal === 'AT' || tVal === 'MATIC' || tVal === 'AUTOMATIC' || tVal === 'CVT' ? 'Transmisi Matic' : 'Transmisi Manual');
    }

    const bbmMatch = containerHtml.match(/\b(bensin|diesel|solar|hybrid|electric|listrik)\b/i);
    if (bbmMatch && !extractedTags.some(t => /bensin|diesel|hybrid|electric/.test(t.toLowerCase()))) {
      extractedTags.push(bbmMatch[1].charAt(0).toUpperCase() + bbmMatch[1].slice(1).toLowerCase());
    }
  }

  // If HTML provided good specs, return them up to 5 items
  if (extractedTags.length >= 2) {
    return extractedTags.slice(0, 5);
  }

  // Otherwise, match against authentic vehicle knowledge base
  for (const [key, specsArr] of Object.entries(VEHICLE_SPECS_KNOWLEDGE_BASE)) {
    const keyParts = key.split(' ');
    if (keyParts.every(part => normTitle.includes(part))) {
      return specsArr;
    }
  }

  // Default clean specs
  return ['Kapasitas 5-7 Kursi', 'Transmisi Matic / Manual', 'AC Dingin & Bersih', 'Layanan 24 Jam'];
}

// Helper to extract or derive high-converting badge
function extractBadge(containerHtml = '', title = '') {
  const normTitle = (title || '').toLowerCase();
  
  if (containerHtml) {
    // Search for promo / discount / badge elements
    const badgeMatch = containerHtml.match(/<(?:span|div|b|strong)\b[^>]*class=["'][^"']*(?:badge|ribbon|promo|label|tag|diskon)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|div|b|strong)>/i);
    if (badgeMatch) {
      const clean = badgeMatch[1].replace(/<[^>]+>/g, '').trim();
      if (clean && clean.length <= 25) return clean;
    }

    // Search keywords
    if (/best\s*seller|terlaris|paling\s*laku/i.test(containerHtml)) return 'Paling Laris';
    if (/favorit|unggulan|rekomendasi/i.test(containerHtml)) return 'Rekomendasi';
    if (/promo|diskon|hemat|termurah/i.test(containerHtml)) return 'Harga Promo';
    if (/vip|luxury|premium/i.test(containerHtml)) return 'Favorit VIP';
  }

  // Derive by vehicle model class
  if (/alphard|vellfire|camry|mercedes|bmw|lexus/i.test(normTitle)) return 'Favorit VIP';
  if (/zenix|brio|calya|sigra|electric|ioniq|air ev/i.test(normTitle)) return 'Paling Irit';
  if (/avanza|veloz|xenia|xpander|ertiga/i.test(normTitle)) return 'Paling Laris';
  if (/fortuner|pajero|rush|terios|crv/i.test(normTitle)) return 'Gagah & Bertenaga';
  if (/hiace|elf|bus|coaster/i.test(normTitle)) return 'Rombongan Nyaman';

  return 'Unit Pilihan';
}

// Helper to determine exact vehicle category tag
function extractCategory(containerHtml = '', title = '') {
  const normTitle = (title || '').toLowerCase();

  if (/alphard|vellfire|camry|mercedes|bmw|lexus/i.test(normTitle)) return 'Luxury MPV / VIP';
  if (/fortuner|pajero|rush|terios|creta|cr-?v|hr-?v|br-?v|raize|rocky/i.test(normTitle)) return 'Premium SUV';
  if (/innova|avanza|veloz|xenia|xpander|ertiga|xl7|stargazer|calya|sigra|mobilio/i.test(normTitle)) return 'Family MPV';
  if (/brio|agya|ayla|yaris|jazz/i.test(normTitle)) return 'City Car';
  if (/hiace|elf|luxio|gran max|apv/i.test(normTitle)) return 'Executive Van';
  if (/bus|coaster|pariwisata/i.test(normTitle)) return 'Bus Pariwisata';
  if (/electric|ioniq|air ev|binguo|wuling ev/i.test(normTitle)) return 'Electric Vehicle';

  return 'Rental Mobil';
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

// Assign distinct, semantically matched images for Travel Trips
function assignImagesToTravel(title, blockImages = [], allDetailedImages = [], usedImagesTracker = new Set(), itemIndex = 0) {
  const normTitle = (title || '').toLowerCase();
  const matchedImages = [];

  if (Array.isArray(blockImages) && blockImages.length > 0) {
    for (const img of blockImages) {
      if (img && !matchedImages.includes(img)) {
        matchedImages.push(img);
        usedImagesTracker.add(img);
      }
    }
  }

  // Semantic keyword match from destination bank
  for (const [key, stockArr] of Object.entries(TRAVEL_DESTINATION_STOCK_IMAGES)) {
    if (normTitle.includes(key)) {
      for (const stockImg of stockArr) {
        if (!matchedImages.includes(stockImg)) {
          matchedImages.push(stockImg);
        }
      }
      break;
    }
  }

  // Fallback if no images found
  if (matchedImages.length === 0) {
    const fb = DIVERSE_TRAVEL_FALLBACKS[itemIndex % DIVERSE_TRAVEL_FALLBACKS.length];
    matchedImages.push(fb);
    usedImagesTracker.add(fb);
  }

  const extraFbs = DIVERSE_TRAVEL_FALLBACKS.filter(p => !matchedImages.includes(p));
  for (const opt of extraFbs) {
    if (matchedImages.length >= 3) break;
    matchedImages.push(opt);
  }

  return {
    primaryImage: matchedImages[0],
    gallery: matchedImages.slice(0, 4)
  };
}

// Extractor for Travel Trips / Tour Packages
function extractTravelTripsFromHtml(html, url, allDetailedImages) {
  const parsedTrips = [];
  const usedImagesTracker = new Set();
  let itemIndex = 0;

  // 1. JSON-LD extraction
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const entities = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
      for (const entity of entities) {
        if (['TouristTrip', 'Trip', 'Product', 'Offer'].includes(entity['@type']) ||
            (entity.name && /paket|tour|trip|wisata|liburan/i.test(entity.name))) {
          const rawImages = Array.isArray(entity.image)
            ? entity.image.map(img => resolveUrl(url, typeof img === 'string' ? img : img?.url)).filter(Boolean)
            : [resolveUrl(url, entity.image?.url || entity.image)].filter(Boolean);
          
          parsedTrips.push({
            title: entity.name,
            description: entity.description || `${entity.name} pengalaman tour terbaik dan tak terlupakan.`,
            images: rawImages,
            price_per_pax: entity.offers?.price ? `Rp ${Number(entity.offers.price).toLocaleString('id-ID')}` : 'Rp 650.000',
            duration: '1 Hari'
          });
        }
      }
    } catch (e) {}
  }

  // 2. Card / Section DOM Extraction
  const cardRegex = /<(?:div|article|section|li)[^>]*class=["'][^"']*(?:tour|trip|paket|wisata|package|travel|itinerary|card|col-)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|article|section|li)>/gi;
  const cardMatches = [...html.matchAll(cardRegex)];

  for (const card of cardMatches.slice(0, 30)) {
    const cardHtml = card[1];
    const titleMatch = matchRegex(cardHtml, /<(?:h2|h3|h4|h5|strong|a)[^>]*>([^<]{4,90})<\/(?:h2|h3|h4|h5|strong|a)>/i, 1);
    if (!titleMatch) continue;

    const cleanTitle = titleMatch.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const hasTourKeyword = /paket|tour|trip|wisata|liburan|bromo|ijen|baluran|bali|jogja|dieng|lombok|bajo|komodo|city\s*tour/i.test(cleanTitle) ||
      /paket|tour|trip|wisata|itinerary/i.test(cardHtml);

    if (hasTourKeyword && cleanTitle.length > 5 && !cleanTitle.toLowerCase().includes('nav') && !cleanTitle.toLowerCase().includes('footer')) {
      const cardImages = extractAllImagesFromHtml(cardHtml, url);
      
      const durationMatch = cardHtml.match(/([1-9]\s*(?:hari|day|h\b|malam|night|jam|hour)(?:\s*[0-9]\s*(?:malam|hari|h|m))?)/i);
      const duration = durationMatch ? durationMatch[1].trim() : '1 Hari (Full Day)';

      const prices = extractPricingInfo(cardHtml);
      const paxPrice = cardHtml.match(/(?:pax|orang|peserta)[\s\S]{0,25}?(?:Rp\.?|IDR)?\s*([0-9.,]{3,12})/i) ||
        cardHtml.match(/(?:Rp\.?|IDR)\s*([0-9.,]{3,12})/i);
      const groupPrice = cardHtml.match(/(?:group|rombongan|keluarga|mobil)[\s\S]{0,25}?(?:Rp\.?|IDR)?\s*([0-9.,]{3,12})/i);

      const highlights = [];
      const liMatches = [...cardHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)];
      for (const m of liMatches.slice(0, 4)) {
        const cleanLi = m[1].replace(/<[^>]+>/g, '').trim();
        if (cleanLi && cleanLi.length >= 3 && cleanLi.length <= 40) highlights.push(cleanLi);
      }
      if (highlights.length === 0) {
        highlights.push('Pemandu Wisata Ramah', 'Armada Nyaman & AC', 'Dokumentasi & Tiket Masuk');
      }

      const itineraryLines = [];
      for (const m of liMatches.slice(0, 5)) {
        const cleanLi = m[1].replace(/<[^>]+>/g, '').trim();
        if (cleanLi && cleanLi.length > 10) itineraryLines.push(cleanLi);
      }
      if (itineraryLines.length === 0) {
        itineraryLines.push(
          `Hari 1: Penjemputan di meeting point, perjalanan menuju destinasi utama ${cleanTitle}, makan siang kuliner khas.`,
          `Hari 2: Menikmati sunrise & spot foto terbaik, belanja oleh-oleh lokal, pengantaran kembali ke stasiun/bandara.`
        );
      }

      parsedTrips.push({
        title: cleanTitle,
        description: `${cleanTitle} dengan itinerary lengkap, armada eksekutif, dan pendampingan guide profesional.`,
        duration,
        price_per_pax: paxPrice ? `Rp ${paxPrice[1]}` : (prices.selfDrive || 'Rp 650.000'),
        price_per_group: groupPrice ? `Rp ${groupPrice[1]}` : 'Rp 2.800.000 (Min 5 Pax)',
        highlights,
        route_itinerary: itineraryLines,
        included: ['Kendaraan AC + Driver + BBM', 'Tiket Masuk Semua Objek Wisata', 'Air Mineral & Snack Perjalanan'],
        excluded: ['Tiket Transportasi ke Meeting Point', 'Pengeluaran Pribadi', 'Tipping Driver/Guide'],
        badge: /populer|favorite|unggulan/i.test(cardHtml) ? 'Paling Populer' : 'Best Seller',
        images: cardImages
      });
    }
  }

  const uniqueMap = new Map();
  const results = [];

  for (const trip of parsedTrips) {
    const norm = trip.title.trim().toLowerCase();
    if (!norm || uniqueMap.has(norm)) continue;
    uniqueMap.set(norm, true);

    const { primaryImage, gallery } = assignImagesToTravel(
      trip.title,
      trip.images,
      allDetailedImages,
      usedImagesTracker,
      itemIndex++
    );

    const slug = trip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

    results.push({
      id: `scraped_trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: trip.title,
      slug,
      description: trip.description,
      duration: trip.duration,
      price_per_pax: trip.price_per_pax,
      price_per_group: trip.price_per_group,
      images: gallery,
      image: primaryImage,
      highlights: trip.highlights,
      route_itinerary: trip.route_itinerary,
      included: trip.included,
      excluded: trip.excluded,
      badge: trip.badge || 'Paling Populer',
      is_active: true
    });
  }

  if (results.length === 0) {
    const defaultDests = ['Sunrise Bromo & Kaldera Tengger', 'Eksplorasi Blue Fire Kawah Ijen', 'Exotic Bali Selatan & Sunset Tour', 'City Tour Jogja & Candi Borobudur'];
    for (let i = 0; i < defaultDests.length; i++) {
      const dTitle = defaultDests[i];
      const { primaryImage, gallery } = assignImagesToTravel(dTitle, [], allDetailedImages, usedImagesTracker, i);
      results.push({
        id: `scraped_trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: dTitle,
        slug: dTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Paket liburan eksklusif ${dTitle} dengan fasilitas all-in dan pelayanan ramah 24 jam.`,
        duration: i % 2 === 0 ? '1 Hari (Full Day)' : '2 Hari 1 Malam',
        price_per_pax: `Rp ${(550000 + i * 100000).toLocaleString('id-ID')}`,
        price_per_group: `Rp ${(2500000 + i * 500000).toLocaleString('id-ID')} (Min 5 Pax)`,
        images: gallery,
        image: primaryImage,
        highlights: ['Armada Ternyaman', 'Tiket Masuk & Asuransi', 'Spot Foto Eksotis'],
        route_itinerary: [
          `Hari 1: Penjemputan di lokasi yang disepakati, menuju objek wisata utama ${dTitle}, makan siang kuliner khas.`,
          `Hari 2: Eksplorasi spot panorama, belanja oleh-oleh, kembali ke meeting point.`
        ],
        included: ['Armada AC + Driver + BBM', 'Tiket Wisata', 'Air Mineral'],
        excluded: ['Keperluan Pribadi', 'Tipping Sukarela'],
        badge: i === 0 ? 'Paling Populer' : 'Pilihan Utama',
        is_active: true
      });
    }
  }

  return results;
}

// Extractor for Slideshow & Hero Banners
function extractSlideshowFromHtml(html, url, allDetailedImages) {
  const slides = [];

  const heroRegex = /<(?:section|div|header)[^>]*class=["'][^"']*(?:hero|slider|carousel|banner|swiper|slick)[^"']*["'][^>]*>([\s\S]*?)<\/(?:section|div|header)>/gi;
  const heroMatches = [...html.matchAll(heroRegex)];

  for (const block of heroMatches.slice(0, 5)) {
    const blockHtml = block[1];
    const h1Match = matchRegex(blockHtml, /<(?:h1|h2)[^>]*>([^<]{5,100})<\/(?:h1|h2)>/i, 1);
    const pMatch = matchRegex(blockHtml, /<(?:p|span)[^>]*class=["'][^"']*(?:sub|desc|lead|text)[^"']*["'][^>]*>([^<]{10,180})<\/(?:p|span)>/i, 1) ||
      matchRegex(blockHtml, /<p[^>]*>([^<]{10,180})<\/p>/i, 1);
    const btnMatch = matchRegex(blockHtml, /<a\b[^>]*class=["'][^"']*(?:btn|button|cta)[^"']*["'][^>]*>([\s\S]*?)<\/a>/i, 1);
    const btnText = btnMatch ? btnMatch.replace(/<[^>]+>/g, '').trim() : 'Lihat Layanan';
    const blockImages = extractAllImagesFromHtml(blockHtml, url);

    if (h1Match) {
      const cleanTitle = h1Match.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
      const cleanSub = pMatch ? pMatch.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() : 'Layanan transportasi terbaik dan terpercaya dengan harga kompetitif.';
      const img = blockImages[0] || DIVERSE_SLIDESHOW_FALLBACKS[slides.length % DIVERSE_SLIDESHOW_FALLBACKS.length];

      slides.push({
        id: `slide_${Date.now()}_${slides.length}`,
        title: cleanTitle,
        subtitle: cleanSub,
        badge: 'Promo Unggulan',
        ctaText: btnText.slice(0, 25) || 'Pesan Sekarang',
        ctaLink: '#fleet',
        image: img
      });
    }
  }

  if (slides.length < 2) {
    const pageTitle = getMetaContent(html, 'title') || matchRegex(html, /<h1[^>]*>([^<]+)<\/h1>/i, 1) || 'Layanan Sewa Mobil & Transportasi Terpercaya';
    const pageDesc = getMetaContent(html, 'description') || 'Armada terlengkap, kondisi prima, pelayanan sopir profesional dan lepas kunci 24 jam siap melayani Anda.';
    const ogImg = resolveUrl(url, getMetaContent(html, 'image'));

    const primaryImg = ogImg || DIVERSE_SLIDESHOW_FALLBACKS[0];
    slides.unshift({
      id: `slide_${Date.now()}_1`,
      title: pageTitle.slice(0, 70),
      subtitle: pageDesc.slice(0, 160),
      badge: 'Solusi Terbaik',
      ctaText: 'Lihat Armada',
      ctaLink: '#fleet',
      image: primaryImg
    });

    slides.push({
      id: `slide_${Date.now()}_2`,
      title: 'Perjalanan Nyaman & Aman Bersama Kami',
      subtitle: 'Tersedia pilihan lepas kunci 24 jam dan paket sewa mobil plus driver berpengalaman.',
      badge: 'Promo Spesial',
      ctaText: 'Hubungi WhatsApp',
      ctaLink: '#whatsapp',
      image: DIVERSE_SLIDESHOW_FALLBACKS[1]
    });
  }

  return slides.slice(0, 5);
}

// Helper to replace competitor brand names / domain names with our own brand name in text
function rebrandArticleText(text, competitorDomain, competitorTitle, ourBrandName) {
  if (!text || typeof text !== 'string') return '';
  if (!ourBrandName) return text;
  let result = text;

  const replaceTargets = new Set();

  if (competitorDomain) {
    try {
      const cleanHost = competitorDomain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0].toLowerCase();
      if (cleanHost && cleanHost.length >= 3) {
        replaceTargets.add(cleanHost);
        const hostWithoutTld = cleanHost.replace(/\.(com|co\.id|id|net|org|biz|info|site|online|tech|io)$/i, '');
        if (hostWithoutTld.length >= 3) {
          replaceTargets.add(hostWithoutTld);
          replaceTargets.add(hostWithoutTld.replace(/[-_]/g, ' '));
          replaceTargets.add(hostWithoutTld.replace(/([a-z])([A-Z])/g, '$1 $2'));
        }
      }
    } catch (_) {}
  }

  if (competitorTitle && typeof competitorTitle === 'string') {
    const parts = competitorTitle.split(/[-|•–—]/);
    for (const part of parts) {
      const p = part.trim();
      if (p.length >= 3 && p.length <= 40) {
        if (!/^(sewa mobil|rental mobil|sewa bus|sewa hiace|rental terpercaya|harga sewa|beranda|home|artikel|blog|indonesia|jakarta|bali)$/i.test(p)) {
          replaceTargets.add(p);
        }
      }
    }
  }

  const genericWords = new Set(['mobil', 'rental', 'rent', 'car', 'sewa', 'travel', 'tour', 'wisata', 'jakarta', 'indonesia', 'online', 'web', 'app', 'terpercaya', 'terbaik', 'murah']);

  for (const target of replaceTargets) {
    const trimmed = target.trim();
    if (!trimmed || trimmed.length < 3) continue;
    if (genericWords.has(trimmed.toLowerCase())) continue;

    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    result = result.replace(regex, ourBrandName);
  }

  return result;
}

// Extractor for Articles & Blog Posts
function extractArticlesFromHtml(html, url, allDetailedImages) {
  const articles = [];
  let itemIndex = 0;

  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const entities = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
      for (const entity of entities) {
        if (['Article', 'NewsArticle', 'BlogPosting'].includes(entity['@type'])) {
          const img = resolveUrl(url, entity.image?.url || entity.image);
          articles.push({
            title: entity.headline || entity.name,
            content: entity.articleBody || entity.description || '',
            excerpt: entity.description || '',
            category: entity.articleSection || 'Artikel',
            featured_image: img || DIVERSE_ARTICLE_FALLBACKS[0]
          });
        }
      }
    } catch (e) {}
  }

  const articleRegex = /<(?:article|div)[^>]*class=["'][^"']*(?:post|blog|article|entry|news)[^"']*["'][^>]*>([\s\S]*?)<\/(?:article|div)>/gi;
  const articleMatches = [...html.matchAll(articleRegex)];

  for (const block of articleMatches.slice(0, 20)) {
    const blockHtml = block[1];
    const titleMatch = matchRegex(blockHtml, /<(?:h2|h3|h4)[^>]*>([^<]{6,100})<\/(?:h2|h3|h4)>/i, 1) ||
      matchRegex(blockHtml, /<a\b[^>]*title=["']([^"']{6,100})["']/i, 1);
    if (!titleMatch) continue;

    const cleanTitle = titleMatch.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (cleanTitle.toLowerCase().includes('nav') || cleanTitle.toLowerCase().includes('menu') || cleanTitle.length < 6) continue;

    const pMatches = [...blockHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(p => p.length > 20);
    const excerpt = pMatches[0] || `${cleanTitle}. Simak informasi selengkapnya mengenai tips dan panduan perjalanan terbaik untuk Anda.`;
    const fullContent = pMatches.length > 0
      ? pMatches.join('\n\n')
      : `${cleanTitle}\n\n${excerpt}\n\nLayanan rental mobil dan transportasi terpercaya selalu mengutamakan kenyamanan, kebersihan unit, dan kepuasan pelanggan dalam setiap perjalanan dinas maupun wisata keluarga.`;

    const blockImages = extractAllImagesFromHtml(blockHtml, url);
    const assignedImage = blockImages[0] || DIVERSE_ARTICLE_FALLBACKS[itemIndex % DIVERSE_ARTICLE_FALLBACKS.length];

    articles.push({
      title: cleanTitle,
      content: fullContent,
      excerpt: excerpt.slice(0, 200),
      category: 'Tips & Berita',
      featured_image: assignedImage
    });
    itemIndex++;
  }

  const uniqueMap = new Map();
  const results = [];

  for (const art of articles) {
    const norm = art.title.toLowerCase().trim();
    if (!norm || uniqueMap.has(norm)) continue;
    uniqueMap.set(norm, true);

    const slug = art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
    results.push({
      id: `scraped_art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: art.title,
      slug,
      excerpt: art.excerpt,
      content: art.content,
      category: art.category || 'Umum',
      featured_image: art.featured_image,
      image: art.featured_image,
      views_count: Math.floor(Math.random() * 250) + 50,
      is_published: true
    });
  }

  if (results.length === 0) {
    const fallbackArticles = [
      {
        title: 'Tips Memilih Rental Mobil yang Aman dan Terpercaya untuk Liburan',
        category: 'Tips Rental',
        excerpt: 'Panduan lengkap memilih armada sewa mobil yang tepat, mulai dari pengecekan kondisi mesin, asuransi, hingga transparansi harga.',
        content: `Memilih jasa rental mobil yang tepat adalah kunci utama kelancaran perjalanan liburan maupun dinas Anda.\n\nBerikut beberapa tips esensial sebelum menyewa mobil:\n1. Pastikan Perusahaan Memiliki Reputasi Terpercaya\nPilihlah penyedia jasa yang memiliki legalitas jelas, kantor fisik yang dapat diverifikasi, dan ulasan positif dari pelanggan sebelumnya.\n\n2. Cek Kondisi Fisik & Mesin Kendaraan\nLakukan inspeksi singkat sebelum serah terima kunci. Periksa kondisi ban, rem, AC, serta kelengkapan dokumen STNK.\n\n3. Pahami Syarat & Ketentuan Sewa\nTanyakan secara mendalam mengenai ketentuan asuransi, deposit, batas waktu pemakaian, dan kebijakan bahan bakar.`
      },
      {
        title: 'Keuntungan Sewa Mobil Plus Driver untuk Perjalanan Dinas & Keluarga',
        category: 'Panduan Wisata',
        excerpt: 'Mengapa menyewa mobil dengan sopir profesional lebih efisien dan bebas stres dibandingkan menyetir sendiri.',
        content: `Bagi Anda yang berencana melakukan perjalanan di kota yang belum familiar, menyewa mobil plus sopir adalah pilihan terbaik.\n\nKeuntungan utama:\n1. Tidak Lelah Menyetir\nAnda dapat beristirahat atau tetap produktif menyelesaikan pekerjaan di dalam perjalanan.\n2. Menguasai Rute Terbaik\nSopir berpengalaman mengetahui rute tercepat dan alternatif menghindari kemacetan.\n3. Tanggung Jawab Kendaraan Terjamin\nDriver bertanggung jawab penuh atas keamanan parkir dan unit di jalan.`
      },
      {
        title: 'Daftar Destinasi Wisata Paling Hits yang Wajib Dikunjungi Tahun Ini',
        category: 'Destinasi Favorit',
        excerpt: 'Rangkuman spot wisata terbaik yang cocok dijelajahi bersama keluarga menggunakan armada rental yang nyaman.',
        content: `Menjelajahi keindahan nusantara kini semakin mudah dengan beragam pilihan armada wisata yang siap mengantar ke berbagai penjuru destinasi impian.\n\nMulai dari keindahan alam pegunungan, pantai pasir putih, hingga wisata kuliner khas daerah, pastikan Anda memesan kendaraan jauh-jauh hari terutama saat akhir pekan atau musim liburan panjang.`
      }
    ];

    for (let i = 0; i < fallbackArticles.length; i++) {
      const fa = fallbackArticles[i];
      const slug = fa.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
      results.push({
        id: `scraped_art_${Date.now()}_${i}`,
        title: fa.title,
        slug,
        excerpt: fa.excerpt,
        content: fa.content,
        category: fa.category,
        featured_image: DIVERSE_ARTICLE_FALLBACKS[i % DIVERSE_ARTICLE_FALLBACKS.length],
        image: DIVERSE_ARTICLE_FALLBACKS[i % DIVERSE_ARTICLE_FALLBACKS.length],
        views_count: 120 + i * 45,
        is_published: true
      });
    }
  }

  return results;
}

// Extractor for FAQ (Questions & Answers + Images)
function extractFaqsFromHtml(html, url, allDetailedImages) {
  const parsedFaqs = [];

  // 1. JSON-LD FAQPage extraction
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const entities = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
      for (const entity of entities) {
        if (entity['@type'] === 'FAQPage' && Array.isArray(entity.mainEntity)) {
          for (const qna of entity.mainEntity) {
            if (qna.name && (qna.acceptedAnswer?.text || qna.acceptedAnswer)) {
              const qText = qna.name.trim();
              const aText = (typeof qna.acceptedAnswer === 'string' ? qna.acceptedAnswer : qna.acceptedAnswer.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              if (qText && aText) {
                const img = resolveUrl(url, qna.image?.url || qna.image);
                parsedFaqs.push({
                  q: qText,
                  a: aText,
                  image: img || ''
                });
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  // 2. DOM extraction: accordion items, dl, faq cards
  const faqBlockRegex = /<(?:div|li|details|article)[^>]*class=["'][^"']*(?:faq|accordion|question|collapse|qna|tanya)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|li|details|article)>/gi;
  const faqMatches = [...html.matchAll(faqBlockRegex)];

  for (const block of faqMatches.slice(0, 20)) {
    const bHtml = block[1];
    const qMatch = matchRegex(bHtml, /<(?:h2|h3|h4|h5|summary|button|strong)[^>]*>([\s\S]*?)<\/(?:h2|h3|h4|h5|summary|button|strong)>/i, 1);
    const aMatch = matchRegex(bHtml, /<(?:div|p|span)[^>]*class=["'][^"']*(?:answer|content|body|desc|collapse|text)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|p|span)>/i, 1) ||
      matchRegex(bHtml, /<p[^>]*>([\s\S]*?)<\/p>/i, 1);

    if (qMatch) {
      const cleanQ = qMatch.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
      const cleanA = aMatch ? aMatch.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() : '';
      const bImages = extractAllImagesFromHtml(bHtml, url);

      if (cleanQ.length >= 8 && cleanQ.includes('?') || cleanQ.length >= 10 && cleanA.length >= 15) {
        parsedFaqs.push({
          q: cleanQ,
          a: cleanA || 'Informasi selengkapnya mengenai layanan ini dapat ditanyakan langsung kepada tim customer support kami.',
          image: bImages[0] || ''
        });
      }
    }
  }

  const uniqueMap = new Map();
  const results = [];

  for (const faq of parsedFaqs) {
    const norm = faq.q.toLowerCase().trim();
    if (!norm || uniqueMap.has(norm)) continue;
    uniqueMap.set(norm, true);

    results.push({
      id: `scraped_faq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      q: faq.q,
      a: faq.a,
      image: faq.image || ''
    });
  }

  if (results.length === 0) {
    results.push(
      {
        id: `scraped_faq_${Date.now()}_1`,
        q: 'Apa saja syarat dan ketentuan untuk sewa mobil lepas kunci?',
        a: 'Syarat sewa lepas kunci cukup melampirkan foto KTP asli, SIM A aktif, bukti akun media sosial atau ID karyawan, serta deposit jaminan keamanan yang dikembalikan setelah masa sewa berakhir.',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: `scraped_faq_${Date.now()}_2`,
        q: 'Apakah harga sewa sudah termasuk BBM dan sopir?',
        a: 'Tersedia dua opsi paket: paket Lepas Kunci (hanya unit) dan paket Dengan Sopir (termasuk unit + jasa driver berpengalaman). Biaya BBM, tol, dan parkir dapat disesuaikan dengan kebutuhan perjalanan Anda.',
        image: ''
      },
      {
        id: `scraped_faq_${Date.now()}_3`,
        q: 'Bagaimana prosedur pemesanan dan metode pembayaran?',
        a: 'Pemesanan dapat dilakukan langsung via WhatsApp atau formulir website. Kami menerima pembayaran transfer bank, QRIS, dan kartu kredit dengan tanda jadi (DP) minimal untuk konfirmasi jadwal unit.',
        image: ''
      },
      {
        id: `scraped_faq_${Date.now()}_4`,
        q: 'Apakah ada layanan antar-jemput unit ke stasiun atau bandara?',
        a: 'Ya, kami melayani antar-jemput armada ke bandara, stasiun kereta, hotel, maupun alamat rumah Anda tepat waktu sesuai kesepakatan jadwal.',
        image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80'
      }
    );
  }

  return results;
}

/**
 * POST /api/admin/scraper/analyze
 * Scrapes target URL and returns extracted products/services with preview data
 */
router.post('/analyze', adminAuth, async (req, res) => {
  const { url, type = 'products' } = req.body;

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

    // Branch extraction based on requested target type:
    if (type === 'travel') {
      const travelTrips = extractTravelTripsFromHtml(html, url, allDetailedImages);
      return res.json({
        success: true,
        type: 'travel',
        meta: {
          pageTitle: ogTitle,
          pageDescription: ogDescription,
          sourceUrl: url,
          detectedCount: travelTrips.length,
          availableImagesCount: allPageImages.length
        },
        data: travelTrips
      });
    }

    if (type === 'slideshow') {
      const heroSlides = extractSlideshowFromHtml(html, url, allDetailedImages);
      return res.json({
        success: true,
        type: 'slideshow',
        meta: {
          pageTitle: ogTitle,
          pageDescription: ogDescription,
          sourceUrl: url,
          detectedCount: heroSlides.length,
          availableImagesCount: allPageImages.length
        },
        data: heroSlides
      });
    }

    if (type === 'articles') {
      const settings = await getPublicSettings(false);
      const ourBrandName = settings.brandName || settings.pwa_name || 'Royal Fleet';
      let siteHost = '';
      try { siteHost = new URL(url).hostname; } catch (_) {}

      const blogArticles = extractArticlesFromHtml(html, url, allDetailedImages);
      const rebrandedArticles = blogArticles.map(art => ({
        ...art,
        title: rebrandArticleText(art.title, siteHost, ogTitle, ourBrandName),
        excerpt: rebrandArticleText(art.excerpt, siteHost, ogTitle, ourBrandName),
        content: rebrandArticleText(art.content, siteHost, ogTitle, ourBrandName),
      }));

      return res.json({
        success: true,
        type: 'articles',
        meta: {
          pageTitle: ogTitle,
          pageDescription: ogDescription,
          sourceUrl: url,
          sourceDomain: siteHost,
          detectedCount: rebrandedArticles.length,
          availableImagesCount: allPageImages.length
        },
        data: rebrandedArticles
      });
    }

    if (type === 'faqs') {
      const faqList = extractFaqsFromHtml(html, url, allDetailedImages);
      return res.json({
        success: true,
        type: 'faqs',
        meta: {
          pageTitle: ogTitle,
          pageDescription: ogDescription,
          sourceUrl: url,
          detectedCount: faqList.length,
          availableImagesCount: allPageImages.length
        },
        data: faqList
      });
    }

    // Default: 'products'
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
            category: extractCategory(rowHtml, potentialName),
            badge: extractBadge(rowHtml, potentialName),
            specs: extractSpecsAndTags(rowHtml, potentialName),
            rawHtml: rowHtml
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
            category: extractCategory(cardHtml, cleanTitle),
            badge: extractBadge(cardHtml, cleanTitle),
            specs: extractSpecsAndTags(cardHtml, cleanTitle),
            rawHtml: cardHtml
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
          category: extractCategory('', headerTitle),
          badge: extractBadge('', headerTitle),
          specs: extractSpecsAndTags('', headerTitle),
          rawHtml: ''
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

      // Intelligently assign distinct, semantically-matched photos (never identical, up to 6 gallery photos)
      const { primaryImage, gallery } = assignImagesToItem(
        normalizedTitle,
        directImages,
        allDetailedImages,
        usedImagesTracker,
        itemIndex++
      );

      const resolvedCategory = item.category || extractCategory(item.rawHtml || '', normalizedTitle);
      const resolvedBadge = item.badge || extractBadge(item.rawHtml || '', normalizedTitle);
      const resolvedSpecs = (Array.isArray(item.specs) && item.specs.length >= 2)
        ? item.specs
        : extractSpecsAndTags(item.rawHtml || '', normalizedTitle);

      formattedResults.push({
        id: `scraped_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: normalizedTitle,
        category: resolvedCategory,
        price: selfDrivePrice,
        price_self_drive: selfDrivePrice,
        price_with_driver: withDriverPrice,
        period: '/hari',
        badge: resolvedBadge,
        specs: resolvedSpecs,
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
    const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
    return res.status(isTimeout ? 408 : 500).json({
      success: false,
      error: isTimeout
        ? 'Waktu koneksi ke website target habis (Timeout 15s). Website kompetitor lambat merespons atau mengaktifkan proteksi bot.'
        : `Gagal memproses scraping: ${err.message}`
    });
  }
});

// Helper function to download an image and save to local storage (fast with 2.5s timeout)
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
    const timer = setTimeout(() => controller.abort(), 2500);
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

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    return imageUrl;
  }
}

/**
 * POST /api/admin/scraper/import
 * Imports selected scraped items directly into app_config.items,
 * quickly saving primary images without blocking or timing out.
 */
router.post('/import', adminAuth, async (req, res) => {
  try {
    const { items: newItems } = req.body;
    if (!Array.isArray(newItems) || newItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada item yang dipilih untuk diimpor' });
    }

    // Process and download primary images with quick timeout
    const processedItems = await Promise.all(
      newItems.map(async (item) => {
        let savedMainImage = item.image;
        if (item.image && item.image.startsWith('http')) {
          savedMainImage = await saveScrapedImage(item.image, item.title, item.id);
        }

        const gallery = Array.isArray(item.images) && item.images.length > 0
          ? [savedMainImage, ...item.images.filter(img => img !== item.image)]
          : [savedMainImage];

        return {
          ...item,
          image: savedMainImage,
          images: gallery,
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

/**
 * POST /api/admin/scraper/import-travel
 * Imports scraped tour packages into the travel_trips table
 */
router.post('/import-travel', adminAuth, async (req, res) => {
  try {
    const { trips } = req.body;
    if (!Array.isArray(trips) || trips.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada paket tour yang dipilih untuk diimpor' });
    }

    const dbType = getDbType();
    let importedCount = 0;

    for (const trip of trips) {
      let savedMainImage = trip.image || (Array.isArray(trip.images) ? trip.images[0] : '');
      if (savedMainImage && savedMainImage.startsWith('http')) {
        savedMainImage = await saveScrapedImage(savedMainImage, trip.title, trip.id);
      }

      const imagesArray = Array.isArray(trip.images) && trip.images.length > 0
        ? [savedMainImage, ...trip.images.filter(img => img !== trip.image).slice(0, 4)]
        : [savedMainImage];

      const id = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const finalSlug = (trip.slug || trip.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

      const insertSql = dbType === 'postgres'
        ? `INSERT INTO travel_trips (id, title, slug, description, route_itinerary, duration, price_per_pax, price_per_group, images, highlights, included, excluded, badge, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`
        : `INSERT INTO travel_trips (\`id\`, \`title\`, \`slug\`, \`description\`, \`route_itinerary\`, \`duration\`, \`price_per_pax\`, \`price_per_group\`, \`images\`, \`highlights\`, \`included\`, \`excluded\`, \`badge\`, \`is_active\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        id,
        trip.title,
        finalSlug,
        trip.description || `${trip.title} paket wisata eksklusif dan nyaman.`,
        JSON.stringify(Array.isArray(trip.route_itinerary) ? trip.route_itinerary : []),
        trip.duration || '1 Hari',
        trip.price_per_pax || 'Rp 500.000',
        trip.price_per_group || 'Rp 2.500.000',
        JSON.stringify(imagesArray),
        JSON.stringify(Array.isArray(trip.highlights) ? trip.highlights : []),
        JSON.stringify(Array.isArray(trip.included) ? trip.included : ['Kendaraan AC + Driver + BBM', 'Tiket Objek Wisata']),
        JSON.stringify(Array.isArray(trip.excluded) ? trip.excluded : ['Pengeluaran Pribadi', 'Tipping']),
        trip.badge || 'Paling Populer',
        trip.is_active !== false
      ];

      try {
        await query(insertSql, params);
        importedCount++;
      } catch (err) {
        console.warn('[Scraper Import Travel Item Error]:', err.message);
      }
    }

    res.json({
      success: true,
      message: `Berhasil mengimpor ${importedCount} paket wisata ke database!`,
      importedCount
    });
  } catch (err) {
    console.error('[Import Travel Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/scraper/import-slideshow
 * Merges scraped banners into app_config.heroSlides
 */
router.post('/import-slideshow', adminAuth, async (req, res) => {
  try {
    const { slides: newSlides } = req.body;
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada slide banner yang dipilih untuk diimpor' });
    }

    const processedSlides = await Promise.all(
      newSlides.map(async (slide, idx) => {
        let savedImage = slide.image;
        if (slide.image && slide.image.startsWith('http')) {
          savedImage = await saveScrapedImage(slide.image, slide.title || `slide-${idx}`, `slide-${idx}`);
        }
        return {
          id: `slide_${Date.now()}_${idx}`,
          title: slide.title || 'Promo Sewa Mobil & Layanan Transportasi',
          subtitle: slide.subtitle || 'Unit prima, bersih, dan pelayanan profesional 24 jam.',
          badge: slide.badge || 'Promo Terbaru',
          ctaText: slide.ctaText || 'Lihat Katalog',
          ctaLink: slide.ctaLink || '#fleet',
          image: savedImage
        };
      })
    );

    const currentConfig = await getPublicSettings(false);
    const existingSlides = Array.isArray(currentConfig.heroSlides) ? currentConfig.heroSlides : [];

    const mergedSlides = [...existingSlides, ...processedSlides];

    await saveSettings({
      ...currentConfig,
      heroSlides: mergedSlides
    });

    res.json({
      success: true,
      message: `Berhasil mengimpor ${processedSlides.length} slide banner ke hero landing page!`,
      importedCount: processedSlides.length,
      slides: mergedSlides
    });
  } catch (err) {
    console.error('[Import Slideshow Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/scraper/import-articles
 * Inserts scraped articles into articles table with automatic brand re-labeling
 */
router.post('/import-articles', adminAuth, async (req, res) => {
  try {
    const { articles: newArticles, competitorUrl, competitorDomain, competitorTitle } = req.body;
    if (!Array.isArray(newArticles) || newArticles.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada artikel yang dipilih untuk diimpor' });
    }

    const dbType = getDbType();
    const settings = await getPublicSettings(false);
    const ourBrandName = settings.brandName || settings.pwa_name || 'Royal Fleet';

    let resolvedCompDomain = competitorDomain || '';
    if (!resolvedCompDomain && competitorUrl) {
      try {
        resolvedCompDomain = new URL(competitorUrl).hostname;
      } catch (_) {}
    }

    let importedCount = 0;

    for (const art of newArticles) {
      let savedImage = art.featured_image || art.image || '';
      if (savedImage && savedImage.startsWith('http')) {
        savedImage = await saveScrapedImage(savedImage, art.title, art.id);
      }

      const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      
      const rebrandedTitle = rebrandArticleText(art.title, resolvedCompDomain, competitorTitle, ourBrandName);
      const rawContent = art.content || `${rebrandedTitle}\n\nInformasi penting mengenai layanan transportasi dan rental terpercaya bersama ${ourBrandName}.`;
      const rebrandedContent = rebrandArticleText(rawContent, resolvedCompDomain, competitorTitle, ourBrandName);
      const rawExcerpt = art.excerpt || rawContent.substring(0, 160).replace(/<[^>]*>?/gm, '').trim();
      const rebrandedExcerpt = rebrandArticleText(rawExcerpt, resolvedCompDomain, competitorTitle, ourBrandName);
      const finalSlug = (rebrandedTitle || art.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

      const insertSql = dbType === 'postgres'
        ? `INSERT INTO articles (id, title, slug, content, excerpt, featured_image, category, location_variable, meta_title, meta_description, canonical_url, schema_markup, is_published)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`
        : `INSERT INTO articles (\`id\`, \`title\`, \`slug\`, \`content\`, \`excerpt\`, \`featured_image\`, \`category\`, \`location_variable\`, \`meta_title\`, \`meta_description\`, \`canonical_url\`, \`schema_markup\`, \`is_published\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        id,
        rebrandedTitle,
        finalSlug,
        rebrandedContent,
        rebrandedExcerpt,
        savedImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        art.category || 'Umum',
        null,
        rebrandArticleText(art.meta_title || rebrandedTitle, resolvedCompDomain, competitorTitle, ourBrandName),
        rebrandArticleText(art.meta_description || rebrandedExcerpt, resolvedCompDomain, competitorTitle, ourBrandName),
        `/artikel/${finalSlug}`,
        JSON.stringify({}),
        art.is_published !== false
      ];

      try {
        await query(insertSql, params);
        importedCount++;
      } catch (err) {
        console.warn('[Scraper Import Article Item Error]:', err.message);
      }
    }

    res.json({
      success: true,
      message: `Berhasil mengimpor ${importedCount} artikel dan otomatis disesuaikan ke brand ${ourBrandName}!`,
      importedCount
    });
  } catch (err) {
    console.error('[Import Articles Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/scraper/import-faqs
 * Merges scraped FAQ questions & answers into app_config.faqs
 */
router.post('/import-faqs', adminAuth, async (req, res) => {
  try {
    const { faqs: newFaqs } = req.body;
    if (!Array.isArray(newFaqs) || newFaqs.length === 0) {
      return res.status(400).json({ success: false, error: 'Tidak ada FAQ yang dipilih untuk diimpor' });
    }

    const processedFaqs = await Promise.all(
      newFaqs.map(async (faq, idx) => {
        let savedImage = faq.image || '';
        if (savedImage && savedImage.startsWith('http')) {
          savedImage = await saveScrapedImage(savedImage, `faq-${idx}`, `faq-${idx}`);
        }
        return {
          q: faq.q,
          a: faq.a,
          image: savedImage
        };
      })
    );

    const currentConfig = await getPublicSettings(false);
    const existingFaqs = Array.isArray(currentConfig.faqs) ? currentConfig.faqs : [];

    const mergedFaqs = [...existingFaqs, ...processedFaqs];

    await saveSettings({
      ...currentConfig,
      faqs: mergedFaqs
    });

    res.json({
      success: true,
      message: `Berhasil mengimpor ${processedFaqs.length} pertanyaan FAQ ke database!`,
      importedCount: processedFaqs.length,
      faqs: mergedFaqs
    });
  } catch (err) {
    console.error('[Import FAQs Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
