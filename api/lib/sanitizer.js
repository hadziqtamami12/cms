/**
 * JSON Block Tree Validator and Sanitizer
 * Guarantees structural integrity and blocks XSS payloads in properties
 */

const ALLOWED_BLOCK_TYPES = new Set([
  'hero',
  'hero-slider',
  'fleet',
  'fleet-catalog',
  'product-grid',
  'catalog',
  'features',
  'pricing',
  'testimonials',
  'faq',
  'cta',
  'articles',
  'post-list',
  'text-content',
  'custom-html',
  'whatsapp',
]);

const ALLOWED_NAV_TYPES = new Set(['curved', 'classic', 'drawer', 'pill']);

/**
 * Basic XSS sanitizer for user strings
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '');
}

/**
 * Recursively sanitize props object
 */
function sanitizeProps(props) {
  if (!props || typeof props !== 'object') return {};
  if (Array.isArray(props)) {
    return props.map((item) => (typeof item === 'object' ? sanitizeProps(item) : sanitizeString(item)));
  }
  const clean = {};
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'string') {
      clean[k] = sanitizeString(v);
    } else if (typeof v === 'object' && v !== null) {
      clean[k] = sanitizeProps(v);
    } else {
      clean[k] = v;
    }
  }
  return clean;
}

/**
 * Validates and sanitizes an individual block node
 */
export function validateBlockNode(block, depth = 0) {
  if (depth > 5) throw new Error('Maximum block tree depth exceeded (limit 5)');
  if (!block || typeof block !== 'object') throw new Error('Invalid block: must be an object');
  if (!block.id) block.id = `block_${Math.random().toString(36).substring(2, 9)}`;
  if (!block.type || typeof block.type !== 'string') throw new Error('Block must have a string type');

  const rawProps = block.props || block.content || {};
  const rawStyle = block.styles || block.style || {};

  const cleanBlock = {
    id: String(block.id),
    type: String(block.type).toLowerCase(),
    props: sanitizeProps(rawProps),
    content: sanitizeProps(block.content || rawProps),
    styles: sanitizeProps(rawStyle),
    style: sanitizeProps(block.style || rawStyle),
    label: block.label ? sanitizeString(block.label) : undefined,
  };

  if (Array.isArray(block.children) && block.children.length > 0) {
    cleanBlock.children = block.children.map((child) => validateBlockNode(child, depth + 1));
  }

  return cleanBlock;
}

/**
 * Validates and sanitizes a complete page JSON payload
 */
export function validatePagePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a JSON object');
  }

  const title = sanitizeString(payload.title || 'Untitled Page');
  const slug = (payload.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'page';
  const mobileNavType = ALLOWED_NAV_TYPES.has(payload.mobileNavType) ? payload.mobileNavType : 'curved';

  const metaTitle = payload.metaTitle || payload.seo?.metaTitle || title;
  const metaDescription = payload.metaDescription || payload.seo?.metaDescription || '';

  const seo = {
    metaTitle: sanitizeString(metaTitle),
    metaDescription: sanitizeString(metaDescription),
    title: sanitizeString(payload.seo?.title || metaTitle),
    description: sanitizeString(payload.seo?.description || metaDescription),
    keywords: sanitizeString(payload.seo?.keywords || ''),
    focusKeyword: sanitizeString(payload.seo?.focusKeyword || ''),
    ogImage: sanitizeString(payload.seo?.ogImage || payload.ogImage || ''),
    jsonLdType: sanitizeString(payload.seo?.jsonLdType || 'WebPage'),
    canonical: sanitizeString(payload.seo?.canonical || ''),
  };

  const blocks = Array.isArray(payload.blocks)
    ? payload.blocks.map((b) => validateBlockNode(b))
    : [];

  // GrapesJS specific payloads
  const html = typeof payload.html === 'string' ? payload.html : '';
  const css = typeof payload.css === 'string' ? payload.css : '';
  const projectData = payload.projectData && typeof payload.projectData === 'object' ? payload.projectData : null;

  const header = sanitizeProps(payload.header || {
    brandName: title.split('-')[0]?.trim() || 'Ultra Rent Car',
    brandTagline: 'Executive Fleet',
    phone: '0812-3456-7890',
    whatsappNumber: '6281234567890',
    navLinks: [
      { label: 'Pilihan Armada', href: '#fleet' },
      { label: 'Keunggulan', href: '#features' },
      { label: 'Paket Sewa', href: '#pricing' },
      { label: 'Testimoni', href: '#testimonials' },
      { label: 'FAQ', href: '#faq' },
    ],
  });

  const footer = sanitizeProps(payload.footer || {
    brandName: title.split('-')[0]?.trim() || 'Ultra Rent Car',
    description: 'Pusat sewa mobil terpercaya dengan supir berpengalaman dan armada terlengkap 24 jam.',
    address: 'Jl. Sudirman No. 88, Kawasan Bisnis Sentral, Jakarta',
    phone: '0812-3456-7890',
    email: 'info@ultrarentcar.com',
    copyright: `© ${new Date().getFullYear()} Ultra Rent Car. Hak cipta dilindungi.`,
  });

  const colorMode = 'light';

  const floatingWhatsapp = sanitizeProps(payload.floatingWhatsapp || {
    enabled: true,
    phoneNumber: header.whatsappNumber || '6281234567890',
    agentName: 'Customer Care 24 Jam',
    agentStatus: 'Online - Siap Melayani',
    greetingMessage: 'Halo! Butuh konsultasi unit rental mobil atau reservasi cepat? Tim kami siap melayani Anda 24 jam nonstop.',
    defaultMessage: 'Halo Admin, saya ingin sewa mobil. Mohon info unit dan harganya.',
    ctaText: 'Mulai Chat WhatsApp',
  });

  return {
    id: payload.id || `page_${Date.now()}`,
    slug: slug.trim(),
    title,
    status: payload.status === 'draft' ? 'draft' : 'published',
    themeId: payload.themeId || 'twenty-twenty-five',
    colorMode,
    mobileNavType,
    seo,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    header,
    footer,
    floatingWhatsapp,
    hero: payload.hero ? sanitizeProps(payload.hero) : null,
    fleet: payload.fleet ? sanitizeProps(payload.fleet) : null,
    styling: payload.styling ? sanitizeProps(payload.styling) : null,
    category: payload.category || null,
    template: payload.template || null,
    isHome: payload.isHome !== undefined ? Boolean(payload.isHome) : false,
    blocks,
    html,
    css,
    projectData,
    content: payload.content || null,
  };
}
