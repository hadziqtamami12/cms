import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Modern Harmonic Color Palettes (Rich, Flat, Linear Gradient, Duotone, Monochromatic)
 */
export const COLOR_HARMONIES = {
  gold: {
    name: 'Obsidian & Imperial Gold',
    from: '#FFF3C4',
    mid1: '#FCD34D',
    mid2: '#F59E0B',
    to: '#B45309',
    accent: '#FEF08A',
    badgeFill: '#1E1B18'
  },
  azure: {
    name: 'Electric Azure & Royal Blue',
    from: '#BAE6FD',
    mid1: '#38BDF8',
    mid2: '#0284C7',
    to: '#0369A1',
    accent: '#E0F2FE',
    badgeFill: '#0C1B2B'
  },
  emerald: {
    name: 'Emerald Jade & Neo Mint',
    from: '#A7F3D0',
    mid1: '#34D399',
    mid2: '#059669',
    to: '#065F46',
    accent: '#D1FAE5',
    badgeFill: '#0B2019'
  },
  coral: {
    name: 'Sunset Rose & Radiant Coral',
    from: '#FFE4E6',
    mid1: '#FB7185',
    mid2: '#E11D48',
    to: '#9F1239',
    accent: '#FFF1F2',
    badgeFill: '#240F15'
  },
  violet: {
    name: 'Cyber Violet & Royal Amethyst',
    from: '#DDD6FE',
    mid1: '#A78BFA',
    mid2: '#7C3AED',
    to: '#5B21B6',
    accent: '#EDE9FE',
    badgeFill: '#1A0E2E'
  },
  duotone: {
    name: 'Teal & Amber Duotone',
    from: '#CCFBF1',
    mid1: '#2DD4BF',
    mid2: '#F59E0B',
    to: '#B45309',
    accent: '#FEF3C7',
    badgeFill: '#0D2329'
  },
  obsidian: {
    name: 'Monochrome Titanium Slate',
    from: '#F8FAFC',
    mid1: '#94A3B8',
    mid2: '#475569',
    to: '#0F172A',
    accent: '#FFFFFF',
    badgeFill: '#0A0E17'
  }
};

/**
 * Industry-tailored color themes and graphic motifs
 */
export const INDUSTRY_THEMES = {
  automotive: {
    name: 'Automotive & VIP Rental',
    palette: 'gold',
    symbol: 'car'
  },
  travel: {
    name: 'Travel, Tour & Trip',
    palette: 'azure',
    symbol: 'compass'
  },
  ecommerce: {
    name: 'E-Commerce & Retail',
    palette: 'violet',
    symbol: 'tag'
  },
  fnb: {
    name: 'F&B & Kuliner',
    palette: 'coral',
    symbol: 'cup'
  },
  services: {
    name: 'Jasa & Konsultan',
    palette: 'emerald',
    symbol: 'prism'
  },
  realestate: {
    name: 'Properti & Real Estate',
    palette: 'gold',
    symbol: 'building'
  }
};

/**
 * Extracts 1-2 letter clean initials from an app name
 */
export const getAppInitials = (name = 'Omni CMS') => {
  if (!name) return 'M';
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'M';
};

/**
 * Generates vector iconography motif based on category
 */
const getCategoryMotif = (industry = 'automotive') => {
  switch (industry) {
    case 'travel':
      return `
        <!-- Compass Star Apex -->
        <path d="M256 84 L268 128 L312 140 L268 152 L256 196 L244 152 L200 140 L244 128 Z" fill="url(#brandGrad)" />
        <circle cx="256" cy="140" r="5" fill="#FFFFFF" />
      `;
    case 'ecommerce':
      return `
        <!-- Diamond Tag -->
        <path d="M256 90 L298 132 L256 174 L214 132 Z" fill="url(#brandGrad)" />
        <circle cx="256" cy="124" r="6" fill="#FFFFFF" opacity="0.9" />
      `;
    case 'fnb':
      return `
        <!-- Culinary Steam Crest -->
        <path d="M246 156 C242 130 258 116 252 96" stroke="url(#brandGrad)" stroke-width="8" stroke-linecap="round" fill="none" />
        <path d="M266 156 C262 130 278 116 272 96" stroke="url(#brandGrad)" stroke-width="8" stroke-linecap="round" fill="none" />
      `;
    case 'realestate':
      return `
        <!-- Architecture Roof Apex -->
        <path d="M216 156 L256 104 L296 156 Z" fill="none" stroke="url(#brandGrad)" stroke-width="12" stroke-linejoin="round" stroke-linecap="round" />
        <circle cx="256" cy="136" r="6" fill="url(#brandGrad)" />
      `;
    case 'services':
      return `
        <!-- Corporate Prism Node -->
        <polygon points="256,92 292,142 220,142" fill="url(#brandGrad)" />
        <circle cx="256" cy="126" r="5" fill="#FFFFFF" />
      `;
    case 'automotive':
    default:
      return `
        <!-- Minimalist VIP Crown Accent -->
        <path d="M256 82 L268 112 L298 123 L268 134 L256 164 L244 134 L214 123 L244 112 Z" fill="url(#brandGrad)" />
        <circle cx="214" cy="123" r="4" fill="url(#accentGrad)" />
        <circle cx="256" cy="82" r="4.5" fill="url(#accentGrad)" />
        <circle cx="298" cy="123" r="4" fill="url(#accentGrad)" />
      `;
  }
};

const ALL_STYLES = [
  'minimalist',
  'abstract-lines',
  'badge',
  'monogram-shape',
  'typography',
  'geometric',
  'pictorial',
  'horizontal'
];

/**
 * Generates an ultra-clean, elegant, unique transparent SVG logo & favicon.
 * Completely non-monotonous: supports 8 distinct archetypes, dynamic color harmonies,
 * and font pairing rotations.
 */
export const generateLogoSvg = ({
  appName = 'Royal Fleet',
  industry = 'automotive',
  style = 'badge',
  colorPalette = null
}) => {
  // Resolve Style (Auto-rotate if 'random' or not specified)
  let resolvedStyle = style;
  if (!resolvedStyle || resolvedStyle === 'random') {
    const randomIdx = Math.floor(Math.random() * ALL_STYLES.length);
    resolvedStyle = ALL_STYLES[randomIdx];
  }

  // Resolve Color Palette
  const indConfig = INDUSTRY_THEMES[industry] || INDUSTRY_THEMES.automotive;
  const paletteKey = colorPalette || indConfig.palette || 'gold';
  const theme = COLOR_HARMONIES[paletteKey] || COLOR_HARMONIES.gold;

  const initials = getAppInitials(appName);
  const categoryMotif = getCategoryMotif(industry);
  const isTwoLetters = initials.length >= 2;
  const fontFam = "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

  // Common SVG Defs
  const defs = `
  <defs>
    <!-- Brand Metallic Gradient -->
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.from}" />
      <stop offset="30%" stop-color="${theme.mid1}" />
      <stop offset="70%" stop-color="${theme.mid2}" />
      <stop offset="100%" stop-color="${theme.to}" />
    </linearGradient>

    <!-- Accent Shimmer Highlight -->
    <linearGradient id="accentGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="${theme.mid2}" />
      <stop offset="50%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="${theme.to}" />
    </linearGradient>

    <!-- Inverse Linear Gradient -->
    <linearGradient id="invBrandGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.to}" />
      <stop offset="100%" stop-color="${theme.mid1}" />
    </linearGradient>

    <!-- Soft Depth Filter -->
    <filter id="softDepth" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#090D16" flood-opacity="0.25" />
    </filter>
  </defs>
  `;

  // 1. MINIMALIST (Clean concentric circles with modern geometric horizon)
  if (resolvedStyle === 'minimalist') {
    const fontSize = isTwoLetters ? 155 : 190;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
      ${defs}
      <g filter="url(#softDepth)">
        <circle cx="256" cy="256" r="210" stroke="url(#brandGrad)" stroke-width="12" stroke-linecap="round" fill="none" />
        <circle cx="256" cy="256" r="185" stroke="url(#accentGrad)" stroke-width="3" stroke-dasharray="10 8" opacity="0.45" fill="none" />
        <g transform="translate(0, 10)">
          ${categoryMotif}
        </g>
        <text
          x="256"
          y="330"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="${fontSize}"
          font-weight="900"
          letter-spacing="${isTwoLetters ? '-4' : '0'}"
          fill="url(#brandGrad)"
          style="text-transform: uppercase;"
        >${initials}</text>
        <path d="M190 380 L322 380" stroke="url(#accentGrad)" stroke-width="5" stroke-linecap="round" />
        <circle cx="256" cy="380" r="4.5" fill="url(#brandGrad)" />
      </g>
    </svg>`;
  }

  // 2. ABSTRACT DYNAMIC LINES (Aero vector ribbons, speed waves)
  if (resolvedStyle === 'abstract-lines') {
    const fontSize = isTwoLetters ? 150 : 180;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
      ${defs}
      <g filter="url(#softDepth)">
        <!-- Swooping Aero Dynamic Line 1 -->
        <path d="M60 256 C100 100, 360 80, 452 200 C472 230, 440 280, 390 280 C270 280, 180 390, 240 450 C260 470, 310 470, 360 440" stroke="url(#brandGrad)" stroke-width="14" stroke-linecap="round" fill="none" />
        <!-- Complementary Wave Line 2 -->
        <path d="M140 130 C220 70, 380 120, 400 240 C420 360, 280 430, 180 410" stroke="url(#accentGrad)" stroke-width="4" stroke-dasharray="12 8" stroke-linecap="round" fill="none" opacity="0.6" />
        <!-- Center Floating Monogram -->
        <text
          x="256"
          y="325"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="${fontSize}"
          font-weight="900"
          letter-spacing="${isTwoLetters ? '-4' : '0'}"
          fill="url(#brandGrad)"
          style="text-transform: uppercase;"
        >${initials}</text>
        <!-- Orbit accent spheres -->
        <circle cx="452" cy="200" r="7" fill="url(#accentGrad)" />
        <circle cx="60" cy="256" r="6" fill="url(#brandGrad)" />
      </g>
    </svg>`;
  }

  // 3. MODERN BADGE / LUXURY CREST (Heraldic shield with fine trim & stars)
  if (resolvedStyle === 'badge') {
    const fontSize = isTwoLetters ? 150 : 185;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
      ${defs}
      <g filter="url(#softDepth)">
        <!-- Shield Contour Outer -->
        <path
          d="M256 46 C370 70 430 92 430 230 C430 350 340 430 256 470 C172 430 82 350 82 230 C82 92 142 70 256 46 Z"
          stroke="url(#brandGrad)"
          stroke-width="12"
          stroke-linejoin="round"
          fill="none"
        />
        <!-- Inner Fine Accent Trim -->
        <path
          d="M256 72 C350 94 402 112 402 230 C402 334 326 406 256 442 C186 406 110 334 110 230 C110 112 162 94 256 72 Z"
          stroke="url(#accentGrad)"
          stroke-width="3"
          stroke-linejoin="round"
          stroke-dasharray="10 8"
          opacity="0.45"
          fill="none"
        />
        <!-- Category Motif -->
        <g transform="translate(0, 18)">
          ${categoryMotif}
        </g>
        <!-- Monogram Initials -->
        <text
          x="256"
          y="335"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="${fontSize}"
          font-weight="900"
          letter-spacing="${isTwoLetters ? '-4' : '0'}"
          fill="url(#brandGrad)"
          style="text-transform: uppercase;"
        >${initials}</text>
        <!-- Bottom Star Notches -->
        <path d="M216 390 L256 405 L296 390" stroke="url(#accentGrad)" stroke-width="4" stroke-linecap="round" fill="none" />
      </g>
    </svg>`;
  }

  // 4. MONOGRAM SHAPE (Integrated lettermark inside solid/gradient geometric silhouette)
  if (resolvedStyle === 'monogram-shape') {
    const fontSize = isTwoLetters ? 170 : 210;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
      ${defs}
      <g filter="url(#softDepth)">
        <!-- Rounded Stadium / Squircle Container -->
        <rect x="76" y="76" width="360" height="360" rx="90" fill="url(#brandGrad)" />
        <!-- Inner Cutout Outline -->
        <rect x="96" y="96" width="320" height="320" rx="74" stroke="#FFFFFF" stroke-width="4" stroke-opacity="0.35" fill="none" />
        <!-- Top White Motif -->
        <g transform="translate(0, 10)">
          <circle cx="256" cy="146" r="6" fill="#FFFFFF" opacity="0.9" />
          <path d="M240 146 L272 146" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8" />
        </g>
        <!-- Crisp White Lettermark Monogram -->
        <text
          x="256"
          y="325"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="${fontSize}"
          font-weight="900"
          letter-spacing="${isTwoLetters ? '-4' : '0'}"
          fill="#FFFFFF"
          style="text-transform: uppercase; text-shadow: 0 4px 12px rgba(0,0,0,0.25);"
        >${initials}</text>
      </g>
    </svg>`;
  }

  // 5. TYPOGRAPHY FIRST (Tilted diamond with precision negative space)
  if (resolvedStyle === 'typography') {
    const fontSize = isTwoLetters ? 175 : 215;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
      ${defs}
      <g filter="url(#softDepth)">
        <!-- Rounded Diamond / Tilted Square Outline -->
        <rect x="110" y="110" width="292" height="292" rx="48" transform="rotate(45 256 256)" stroke="url(#brandGrad)" stroke-width="12" fill="none" />
        <rect x="135" y="135" width="242" height="242" rx="36" transform="rotate(45 256 256)" stroke="url(#accentGrad)" stroke-width="3" stroke-dasharray="8 6" opacity="0.45" fill="none" />
        <g transform="translate(0, -10)">
          ${categoryMotif}
        </g>
        <text
          x="256"
          y="335"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="${fontSize}"
          font-weight="900"
          letter-spacing="${isTwoLetters ? '-5' : '0'}"
          fill="url(#brandGrad)"
          style="text-transform: uppercase;"
        >${initials}</text>
        <polygon points="256,410 266,420 256,430 246,420" fill="url(#accentGrad)" />
      </g>
    </svg>`;
  }

  // 6. GEOMETRIC (Hexagonal Prism / High-tech emblem)
  if (resolvedStyle === 'geometric') {
    const fontSize = isTwoLetters ? 150 : 185;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
      ${defs}
      <g filter="url(#softDepth)">
        <polygon points="256,45 440,150 440,362 256,467 72,362 72,150" stroke="url(#brandGrad)" stroke-width="14" stroke-linejoin="round" fill="none" />
        <polygon points="256,75 410,165 410,347 256,437 102,347 102,165" stroke="url(#accentGrad)" stroke-width="3" stroke-dasharray="12 8" opacity="0.45" stroke-linejoin="round" fill="none" />
        <g transform="translate(0, 15)">
          ${categoryMotif}
        </g>
        <text
          x="256"
          y="335"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="${fontSize}"
          font-weight="900"
          letter-spacing="${isTwoLetters ? '-4' : '0'}"
          fill="url(#brandGrad)"
          style="text-transform: uppercase;"
        >${initials}</text>
        <path d="M196 385 L256 405 L316 385" stroke="url(#accentGrad)" stroke-width="4" stroke-linecap="round" fill="none" />
      </g>
    </svg>`;
  }

  // 7. PICTORIAL VECTOR (Prominent Industry Vector Hero Motif)
  if (resolvedStyle === 'pictorial') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
      ${defs}
      <g filter="url(#softDepth)">
        <!-- Outer Soft Circle -->
        <circle cx="256" cy="256" r="215" stroke="url(#brandGrad)" stroke-width="10" fill="none" />
        <!-- Large Hero Graphic Motif Scaled in Center -->
        <g transform="translate(0, 0)">
          <!-- Crown / Apex Wings -->
          <path d="M160 210 L256 120 L352 210 L300 220 L256 180 L212 220 Z" fill="url(#brandGrad)" />
          <circle cx="256" cy="115" r="9" fill="url(#accentGrad)" />
          <circle cx="160" cy="210" r="7" fill="url(#accentGrad)" />
          <circle cx="352" cy="210" r="7" fill="url(#accentGrad)" />
        </g>
        <!-- Brand Monogram sitting grounded below hero symbol -->
        <text
          x="256"
          y="360"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="${isTwoLetters ? 140 : 170}"
          font-weight="900"
          letter-spacing="${isTwoLetters ? '-4' : '0'}"
          fill="url(#brandGrad)"
          style="text-transform: uppercase;"
        >${initials}</text>
        <path d="M180 400 L332 400" stroke="url(#accentGrad)" stroke-width="4" stroke-linecap="round" />
      </g>
    </svg>`;
  }

  // 8. HORIZONTAL HEADER LOCKUP (Icon on left + Brand Typography on right)
  // Aspect ratio 512x140
  const shortBrand = (appName || 'Royal Fleet').slice(0, 18);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 140" width="512" height="140" fill="none">
    ${defs}
    <g filter="url(#softDepth)">
      <!-- Left Circular Emblem Icon -->
      <g transform="translate(10, 5)">
        <circle cx="65" cy="65" r="58" stroke="url(#brandGrad)" stroke-width="6" fill="none" />
        <circle cx="65" cy="65" r="48" stroke="url(#accentGrad)" stroke-width="2" stroke-dasharray="6 4" opacity="0.5" fill="none" />
        <text
          x="65"
          y="85"
          text-anchor="middle"
          font-family="${fontFam}"
          font-size="44"
          font-weight="900"
          fill="url(#brandGrad)"
          style="text-transform: uppercase;"
        >${initials}</text>
      </g>
      <!-- Right Brand Typography -->
      <text
        x="155"
        y="65"
        font-family="${fontFam}"
        font-size="34"
        font-weight="900"
        letter-spacing="-1"
        fill="url(#brandGrad)"
      >${shortBrand}</text>
      <text
        x="155"
        y="95"
        font-family="${fontFam}"
        font-size="14"
        font-weight="700"
        letter-spacing="2"
        fill="url(#accentGrad)"
        style="text-transform: uppercase; opacity: 0.9;"
      >${indConfig.name}</text>
      <path d="M155 110 L380 110" stroke="url(#brandGrad)" stroke-width="2" stroke-linecap="round" opacity="0.4" />
    </g>
  </svg>`;
};

// Global in-memory cache to guarantee zero-filesystem runtime delivery in Serverless/Vercel
let currentGeneratedSvg = null;

export const getLastGeneratedLogoSvg = () => {
  if (currentGeneratedSvg) return currentGeneratedSvg;
  if (globalThis.__CMS_CACHED_LOGO_SVG) return globalThis.__CMS_CACHED_LOGO_SVG;

  // Fallback to /tmp if present
  try {
    const tmpFile = path.join(os.tmpdir(), 'cms_brand_logo.svg');
    if (fs.existsSync(tmpFile)) {
      return fs.readFileSync(tmpFile, 'utf-8');
    }
  } catch (_) {}

  return null;
};

export const setLastGeneratedLogoSvg = (svg) => {
  currentGeneratedSvg = svg;
  globalThis.__CMS_CACHED_LOGO_SVG = svg;
};

import { isSupabaseConfigured, uploadToSupabaseStorage } from '../config/supabase.js';

/**
 * Saves and synchronizes brand logo SVG with complete EROFS serverless safety
 * and uploads permanently to Supabase Storage as single source of truth.
 */
export const syncAndSaveBrandAssets = async ({
  appName = 'Royal Fleet',
  industry = 'automotive',
  style = 'badge',
  colorPalette = null,
  publicDir = path.join(process.cwd(), 'public')
}) => {
  const svgContent = generateLogoSvg({ appName, industry, style, colorPalette });
  setLastGeneratedLogoSvg(svgContent);

  const base64Data = Buffer.from(svgContent, 'utf-8').toString('base64');
  const dataUri = `data:image/svg+xml;base64,${base64Data}`;
  globalThis.__CMS_CACHED_LOGO_DATA_URI = dataUri;

  // 1. Upload directly to Supabase Storage bucket (Primary Single Source of Truth)
  let cloudLogoUrl = null;
  if (isSupabaseConfigured()) {
    try {
      const svgBuffer = Buffer.from(svgContent, 'utf-8');
      const filename = `brand/logo-${Date.now()}.svg`;
      const uploadRes = await uploadToSupabaseStorage({
        filePath: filename,
        buffer: svgBuffer,
        contentType: 'image/svg+xml',
        upsert: true
      });
      if (uploadRes && uploadRes.publicUrl) {
        cloudLogoUrl = uploadRes.publicUrl;
      }
    } catch (storageErr) {
      console.warn('[LogoGenerator] Supabase Storage upload notice:', storageErr.message);
    }
  }

  // 2. Safe write to /tmp (always writable in AWS Lambda / Vercel Serverless)
  try {
    const tmpFile = path.join(os.tmpdir(), 'cms_brand_logo.svg');
    fs.writeFileSync(tmpFile, svgContent, 'utf-8');
  } catch (_) {}

  // 3. Attempt local filesystem write to public/ (safe in local dev / standard VPS)
  let diskWriteSuccess = false;
  try {
    const targetFiles = [
      path.join(publicDir, 'icons', 'icon-192.svg'),
      path.join(publicDir, 'icons', 'icon-512.svg'),
      path.join(publicDir, 'favicon.svg'),
      path.join(publicDir, 'images', 'logo.svg'),
      path.join(publicDir, 'images', 'logo-emblem.svg')
    ];

    for (const file of targetFiles) {
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(file, svgContent, 'utf-8');
    }
    diskWriteSuccess = true;
  } catch (fsErr) {
    diskWriteSuccess = false;
  }

  // Primary URL is Supabase Storage public CDN URL if available, falling back to dynamic API route
  const primaryUrl = cloudLogoUrl || '/api/brand/logo.svg';

  return {
    success: true,
    logoUrl: primaryUrl,
    pwaIcon: primaryUrl,
    faviconUrl: primaryUrl,
    dataUri,
    svgContent,
    initials: getAppInitials(appName),
    style,
    diskWriteSuccess,
    cloudDriver: cloudLogoUrl ? 'supabase' : 'local'
  };
};

export default {
  COLOR_HARMONIES,
  INDUSTRY_THEMES,
  getAppInitials,
  generateLogoSvg,
  syncAndSaveBrandAssets,
  getLastGeneratedLogoSvg,
  setLastGeneratedLogoSvg
};
