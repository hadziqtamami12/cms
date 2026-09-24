import fs from 'fs';
import path from 'path';

/**
 * Industry-tailored color themes and graphic motifs
 */
const INDUSTRY_THEMES = {
  automotive: {
    name: 'Automotive & VIP Rental',
    gradient: {
      from: '#FFF3C4',
      mid1: '#FCD34D',
      mid2: '#F59E0B',
      to: '#B45309'
    },
    accent: '#FEF08A',
    symbol: 'car'
  },
  travel: {
    name: 'Travel, Tour & Trip',
    gradient: {
      from: '#BAE6FD',
      mid1: '#38BDF8',
      mid2: '#0284C7',
      to: '#0369A1'
    },
    accent: '#E0F2FE',
    symbol: 'compass'
  },
  ecommerce: {
    name: 'E-Commerce & Retail',
    gradient: {
      from: '#DDD6FE',
      mid1: '#A78BFA',
      mid2: '#7C3AED',
      to: '#5B21B6'
    },
    accent: '#EDE9FE',
    symbol: 'tag'
  },
  fnb: {
    name: 'F&B & Kuliner',
    gradient: {
      from: '#FFEDD5',
      mid1: '#FB923C',
      mid2: '#EA580C',
      to: '#9A3412'
    },
    accent: '#FFF7ED',
    symbol: 'cup'
  },
  services: {
    name: 'Jasa & Konsultan',
    gradient: {
      from: '#A7F3D0',
      mid1: '#34D399',
      mid2: '#059669',
      to: '#065F46'
    },
    accent: '#D1FAE5',
    symbol: 'prism'
  },
  realestate: {
    name: 'Properti & Real Estate',
    gradient: {
      from: '#FDE68A',
      mid1: '#F59E0B',
      mid2: '#D97706',
      to: '#78350F'
    },
    accent: '#FEF3C7',
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
 * Generates clean, modern vector iconography motif based on category
 */
const getCategoryMotif = (industry = 'automotive') => {
  switch (industry) {
    case 'travel':
      // Minimalist 4-point compass star / diamond apex
      return `
        <!-- Compass Star Apex -->
        <path d="M256 90 L268 132 L310 144 L268 156 L256 198 L244 156 L202 144 L244 132 Z" fill="url(#brandGrad)" />
        <circle cx="256" cy="144" r="5" fill="#FFFFFF" />
      `;
    case 'ecommerce':
      // Geometric diamond tag fold
      return `
        <!-- E-Commerce Diamond Badge -->
        <path d="M256 94 L296 134 L256 174 L216 134 Z" fill="url(#brandGrad)" />
        <circle cx="256" cy="126" r="6" fill="#FFFFFF" opacity="0.9" />
      `;
    case 'fnb':
      // Minimalist steam & aroma curve
      return `
        <!-- Culinary Steam Crest -->
        <path d="M246 160 C242 135 258 120 252 100" stroke="url(#brandGrad)" stroke-width="8" stroke-linecap="round" fill="none" />
        <path d="M266 160 C262 135 278 120 272 100" stroke="url(#brandGrad)" stroke-width="8" stroke-linecap="round" fill="none" />
      `;
    case 'realestate':
      // Modern architectural roof apex
      return `
        <!-- Architecture Roof Apex -->
        <path d="M216 160 L256 108 L296 160 Z" fill="none" stroke="url(#brandGrad)" stroke-width="12" stroke-linejoin="round" stroke-linecap="round" />
        <circle cx="256" cy="140" r="6" fill="url(#brandGrad)" />
      `;
    case 'services':
      // Geometric dynamic node
      return `
        <!-- Corporate Prism Node -->
        <polygon points="256,96 288,144 224,144" fill="url(#brandGrad)" />
        <circle cx="256" cy="128" r="5" fill="#FFFFFF" />
      `;
    case 'automotive':
    default:
      // Minimalist VIP Crown + Aerodynamic Apex
      return `
        <!-- Minimalist VIP Crown Accent -->
        <path d="M256 86 L267 114 L295 125 L267 136 L256 164 L245 136 L217 125 L245 114 Z" fill="url(#brandGrad)" />
        <circle cx="217" cy="125" r="4" fill="url(#accentGrad)" />
        <circle cx="256" cy="86" r="4.5" fill="url(#accentGrad)" />
        <circle cx="295" cy="125" r="4" fill="url(#accentGrad)" />
      `;
  }
};

/**
 * Generates an ultra-clean, elegant, simple yet beautiful transparent SVG logo & favicon
 */
export const generateLogoSvg = ({ appName = 'Royal Fleet', industry = 'automotive' }) => {
  const theme = INDUSTRY_THEMES[industry] || INDUSTRY_THEMES.automotive;
  const initials = getAppInitials(appName);
  const categoryMotif = getCategoryMotif(industry);

  // Single-letter or two-letter monogram positioning
  const isTwoLetters = initials.length >= 2;
  const fontSize = isTwoLetters ? 150 : 185;
  const letterSpacing = isTwoLetters ? '-4' : '0';
  const textY = isTwoLetters ? 335 : 340;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <!-- Brand Metallic Gradient -->
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.gradient.from}" />
      <stop offset="30%" stop-color="${theme.gradient.mid1}" />
      <stop offset="70%" stop-color="${theme.gradient.mid2}" />
      <stop offset="100%" stop-color="${theme.gradient.to}" />
    </linearGradient>

    <!-- Accent Shimmer Highlight -->
    <linearGradient id="accentGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="${theme.gradient.mid2}" />
      <stop offset="50%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="${theme.gradient.to}" />
    </linearGradient>

    <!-- Soft Depth Filter -->
    <filter id="softDepth" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#090D16" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Graphic Composition (100% Transparent Background) -->
  <g filter="url(#softDepth)">
    <!-- 1. Sleek Outer Shield Contour (Refined Geometric Precision) -->
    <path
      d="M256 36
         C330 36, 420 54, 436 120
         C448 174, 452 284, 386 380
         C342 444, 280 472, 256 480
         C232 472, 170 444, 126 380
         C60 284, 64 174, 76 120
         C92 54, 182 36, 256 36 Z"
      stroke="url(#brandGrad)"
      stroke-width="14"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- 2. Delicate Inner Inset Arc -->
    <path
      d="M256 60
         C315 60, 395 76, 408 132
         C418 178, 422 268, 366 352
         C328 408, 276 434, 256 442
         C236 434, 184 408, 146 352
         C90 268, 94 178, 104 132
         C117 76, 197 60, 256 60 Z"
      stroke="url(#accentGrad)"
      stroke-width="3"
      stroke-dasharray="14 10"
      opacity="0.45"
      fill="none"
    />

    <!-- 3. Category Motif / Crest Top -->
    ${categoryMotif}

    <!-- 4. Dynamic Monogram Initials -->
    <text
      x="256"
      y="${textY}"
      text-anchor="middle"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', 'Montserrat', sans-serif"
      font-size="${fontSize}"
      font-weight="900"
      letter-spacing="${letterSpacing}"
      fill="url(#brandGrad)"
      style="text-transform: uppercase;"
    >${initials}</text>

    <!-- 5. Bottom Aerodynamic Speed Wing / Horizon Curve -->
    <path
      d="M176 390
         C210 404, 240 408, 256 408
         C272 408, 302 404, 336 390
         C310 400, 280 404, 256 404
         C232 404, 202 400, 176 390 Z"
      fill="url(#accentGrad)"
    />
  </g>
</svg>`;
};

/**
 * Writes the generated simple transparent SVG to public icon & logo files
 */
export const syncAndSaveBrandAssets = async ({
  appName = 'Royal Fleet',
  industry = 'automotive',
  publicDir = path.join(process.cwd(), 'public')
}) => {
  const svgContent = generateLogoSvg({ appName, industry });

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

  return {
    success: true,
    logoUrl: '/icons/icon-192.svg',
    pwaIcon: '/icons/icon-192.svg',
    faviconUrl: '/favicon.svg',
    initials: getAppInitials(appName)
  };
};
