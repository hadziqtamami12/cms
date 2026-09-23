/**
 * Technical SEO & Keyword Density Audit Service
 * Evaluates Title, Meta Description, H1/H2, Alt Images, and Slug against Target Keywords
 * Generates dynamic JSON-LD structured schemas and OpenGraph metadata
 */

export const analyzeKeywordDensity = ({
  keywords = [],
  title = '',
  metaDescription = '',
  h1 = '',
  headings = [],
  bodyText = '',
  altTexts = [],
  slug = ''
}) => {
  const normalizedKeywords = (Array.isArray(keywords) ? keywords : [keywords])
    .map(k => k.trim().toLowerCase())
    .filter(Boolean);

  if (normalizedKeywords.length === 0) {
    return {
      score: 50,
      grade: 'C',
      targetKeywords: [],
      overallStatus: 'No target keywords provided',
      checklist: [],
      densityResults: {},
      recommendations: ['Tambahkan minimal 1-3 target keyword utama untuk menganalisis skor SEO on-page.']
    };
  }

  const cleanTitle = (title || '').toLowerCase();
  const cleanMeta = (metaDescription || '').toLowerCase();
  const cleanH1 = (h1 || '').toLowerCase();
  const allHeadings = headings.join(' ').toLowerCase();
  const fullContent = `${cleanTitle} ${cleanMeta} ${cleanH1} ${allHeadings} ${(bodyText || '').toLowerCase()}`;
  const totalWords = fullContent.split(/\s+/).filter(Boolean).length || 1;

  let checklist = [];
  let recommendations = [];
  let points = 0;
  const maxPoints = 100;
  const densityResults = {};

  normalizedKeywords.forEach(kw => {
    // Regex for exact keyword matches
    const kwRegex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const matches = fullContent.match(kwRegex) || [];
    const count = matches.length;
    const density = ((count / totalWords) * 100).toFixed(2);

    densityResults[kw] = {
      count,
      density: `${density}%`,
      isOptimal: density >= 0.8 && density <= 2.5
    };

    // 1. Title Check (20 pts)
    const inTitle = cleanTitle.includes(kw);
    checklist.push({
      item: `Keyword "${kw}" pada Title Tag`,
      passed: inTitle,
      weight: 20,
      details: inTitle ? `Ditemukan pada Title (${cleanTitle.length} karakter)` : 'Kata kunci belum ada di Title tag'
    });
    if (inTitle) points += 20 / normalizedKeywords.length;
    else recommendations.push(`Sertakan kata kunci "${kw}" di awal Title Tag.`);

    // 2. Meta Description Check (15 pts)
    const inMeta = cleanMeta.includes(kw);
    checklist.push({
      item: `Keyword "${kw}" pada Meta Description`,
      passed: inMeta,
      weight: 15,
      details: inMeta ? `Ditemukan pada Meta Description (${cleanMeta.length} karakter)` : 'Kata kunci belum ada di Meta Description'
    });
    if (inMeta) points += 15 / normalizedKeywords.length;
    else recommendations.push(`Sertakan kata kunci "${kw}" di dalam Meta Description.`);

    // 3. H1 / Main Heading Check (20 pts)
    const inH1 = cleanH1.includes(kw);
    checklist.push({
      item: `Keyword "${kw}" pada H1 Heading`,
      passed: inH1,
      weight: 20,
      details: inH1 ? 'Ditemukan tepat di H1 utama' : 'H1 belum memuat keyword target'
    });
    if (inH1) points += 20 / normalizedKeywords.length;
    else recommendations.push(`Gunakan kata kunci "${kw}" pada H1 utama hero section.`);

    // 4. URL Slug Check (15 pts)
    const slugNormalized = (slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const kwClean = kw.replace(/[^a-z0-9]/g, '');
    const inSlug = slugNormalized.includes(kwClean);
    checklist.push({
      item: `Keyword "${kw}" pada URL Slug`,
      passed: inSlug,
      weight: 15,
      details: inSlug ? `Slug ramah SEO memuat kata kunci` : 'Slug URL belum memuat target keyword'
    });
    if (inSlug) points += 15 / normalizedKeywords.length;
    else recommendations.push(`Buat URL slug yang memuat keyword "${kw}".`);

    // 5. Image Alt Text Check (15 pts)
    const inAlt = altTexts.some(alt => alt.toLowerCase().includes(kw));
    checklist.push({
      item: `Keyword "${kw}" pada Alt Text Gambar`,
      passed: inAlt,
      weight: 15,
      details: inAlt ? 'Alt text gambar memuat keyword relevan' : 'Belum ada gambar dengan alt text memuat keyword'
    });
    if (inAlt) points += 15 / normalizedKeywords.length;
    else recommendations.push(`Tambahkan atribut alt="${kw}" pada minimal satu gambar hero/produk.`);

    // 6. Optimal Keyword Density (15 pts)
    const isOptimalDensity = parseFloat(density) >= 0.8 && parseFloat(density) <= 2.5;
    checklist.push({
      item: `Kepadatan (Density) "${kw}" (0.8% - 2.5%)`,
      passed: isOptimalDensity,
      weight: 15,
      details: `Kepadatan saat ini: ${density}% (${count} kemunculan)`
    });
    if (isOptimalDensity) points += 15 / normalizedKeywords.length;
    else if (parseFloat(density) < 0.8) recommendations.push(`Tingkatkan penggunaan kata kunci "${kw}" dalam teks konten (saat ini ${density}%).`);
    else recommendations.push(`Kurangi frekuensi kata kunci "${kw}" agar terhindar dari penalti keyword stuffing (saat ini ${density}%).`);
  });

  // Length checks
  if (cleanTitle.length < 30 || cleanTitle.length > 65) {
    recommendations.push(`Panjang Title (${cleanTitle.length} karakter) sebaiknya antara 45-60 karakter untuk hasil optimal di SERP Google.`);
  }
  if (cleanMeta.length < 120 || cleanMeta.length > 160) {
    recommendations.push(`Panjang Meta Description (${cleanMeta.length} karakter) sebaiknya antara 130-155 karakter.`);
  }

  const score = Math.min(100, Math.round(points));
  let grade = 'A+';
  if (score < 50) grade = 'D';
  else if (score < 65) grade = 'C';
  else if (score < 80) grade = 'B';
  else if (score < 90) grade = 'A';

  return {
    score,
    grade,
    targetKeywords: normalizedKeywords,
    totalWords,
    densityResults,
    checklist,
    recommendations
  };
};

/**
 * Generate Dynamic JSON-LD Structured Data Schema based on active Industry & Theme
 */
export const generateJsonLdSchema = ({
  industry = 'automotive',
  siteUrl = 'https://yourdomain.com',
  businessName = 'Enterprise Pro',
  description = 'Solusi Layanan Terpercaya',
  phone = '+6281234567890',
  address = { street: 'Jl. Sudirman Kav 21', city: 'Jakarta', country: 'ID' },
  items = [],
  faqs = []
}) => {
  const schemas = [];

  // 1. Organization Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: businessName,
    url: siteUrl,
    logo: `${siteUrl}/icons/icon-512.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: ['Indonesian', 'English']
    }
  });

  // 2. Specific Industry / LocalBusiness Schema
  if (industry === 'automotive') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'AutoRental',
      name: businessName,
      description,
      url: siteUrl,
      telephone: phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressCountry: address.country
      },
      priceRange: '$$',
      openingHours: 'Mo-Su 00:00-23:59'
    });
  } else if (industry === 'fnb') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: businessName,
      description,
      url: siteUrl,
      telephone: phone,
      servesCuisine: 'Indonesian, Contemporary',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressCountry: address.country
      }
    });
  } else if (industry === 'realestate') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: businessName,
      description,
      url: siteUrl,
      telephone: phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressCountry: address.country
      }
    });
  } else if (industry === 'ecommerce') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: businessName,
      description,
      url: siteUrl
    });
  } else {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: businessName,
      description,
      url: siteUrl,
      telephone: phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressCountry: address.country
      }
    });
  }

  // 3. FAQPage Schema
  if (faqs && faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q || faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a || faq.answer
        }
      }))
    });
  }

  // 4. BreadcrumbList Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: businessName,
        item: `${siteUrl}/#main-content`
      }
    ]
  });

  return schemas;
};

export default { analyzeKeywordDensity, generateJsonLdSchema };
