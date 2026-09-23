/**
 * Real-Time Client SEO Engine
 * Live keyword density calculator and actionable on-page score estimator
 */

export const calculateLiveSeoScore = ({
  keywords = [],
  title = '',
  metaDescription = '',
  h1 = '',
  slug = '',
  content = '',
  hasImageAlt = true
}) => {
  const kwList = (Array.isArray(keywords) ? keywords : [keywords])
    .map(k => k.trim().toLowerCase())
    .filter(Boolean);

  if (kwList.length === 0) {
    return {
      score: 45,
      grade: 'C',
      densityMap: {},
      checklist: [
        { label: 'Target Keyword Didefinisikan', passed: false, detail: 'Belum ada target kata kunci yang dimasukkan' }
      ],
      recommendations: ['Tambahkan minimal 1 keyword target untuk mengaktifkan audit SEO live.']
    };
  }

  const cleanTitle = (title || '').toLowerCase();
  const cleanMeta = (metaDescription || '').toLowerCase();
  const cleanH1 = (h1 || '').toLowerCase();
  const cleanContent = `${cleanTitle} ${cleanMeta} ${cleanH1} ${(content || '').toLowerCase()}`;
  const totalWords = cleanContent.split(/\s+/).filter(Boolean).length || 1;

  let checklist = [];
  let recommendations = [];
  let points = 0;
  const densityMap = {};

  kwList.forEach(kw => {
    const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const matches = cleanContent.match(regex) || [];
    const count = matches.length;
    const density = ((count / totalWords) * 100).toFixed(2);

    densityMap[kw] = { count, density: `${density}%` };

    // 1. Title Tag Check (20 pts)
    const inTitle = cleanTitle.includes(kw);
    checklist.push({
      label: `Title Tag memuat "${kw}"`,
      passed: inTitle,
      detail: inTitle ? `Ditemukan di Title (${cleanTitle.length} char)` : 'Belum termuat di Title Tag'
    });
    if (inTitle) points += 20 / kwList.length;
    else recommendations.push(`Sertakan keyword "${kw}" pada Title Tag.`);

    // 2. Meta Description Check (15 pts)
    const inMeta = cleanMeta.includes(kw);
    checklist.push({
      label: `Meta Description memuat "${kw}"`,
      passed: inMeta,
      detail: inMeta ? `Ditemukan di Meta (${cleanMeta.length} char)` : 'Belum termuat di Meta Description'
    });
    if (inMeta) points += 15 / kwList.length;
    else recommendations.push(`Sertakan keyword "${kw}" dalam Meta Description.`);

    // 3. H1 Heading Check (20 pts)
    const inH1 = cleanH1.includes(kw);
    checklist.push({
      label: `H1 Hero memuat "${kw}"`,
      passed: inH1,
      detail: inH1 ? 'H1 optimal memuat keyword target' : 'H1 utama belum memuat target keyword'
    });
    if (inH1) points += 20 / kwList.length;
    else recommendations.push(`Gunakan keyword "${kw}" di H1 hero landing page.`);

    // 4. URL Slug Check (15 pts)
    const cleanSlug = (slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const inSlug = cleanSlug.includes(kw.replace(/[^a-z0-9]/g, ''));
    checklist.push({
      label: `URL Slug ramah SEO memuat "${kw}"`,
      passed: inSlug,
      detail: inSlug ? 'Slug URL ramah mesin pencari' : 'Slug URL belum memuat keyword'
    });
    if (inSlug) points += 15 / kwList.length;
    else recommendations.push(`Gunakan URL slug yang memuat keyword "${kw}".`);

    // 5. Density Check (15 pts)
    const densityVal = parseFloat(density);
    const isOptimal = densityVal >= 0.8 && densityVal <= 2.5;
    checklist.push({
      label: `Kepadatan (Density) optimal "${kw}"`,
      passed: isOptimal,
      detail: `Density: ${density}% (${count}x)`
    });
    if (isOptimal) points += 15 / kwList.length;
    else if (densityVal < 0.8) recommendations.push(`Kepadatan "${kw}" rendah (${density}%). Sebutkan lebih natural dalam paragraf.`);
    else recommendations.push(`Kepadatan "${kw}" terlalu tinggi (${density}%). Kurangi agar aman dari Google spam filter.`);
  });

  // 6. Image Alt Tag Check (15 pts)
  checklist.push({
    label: 'Atribut Image Alt Terisi',
    passed: hasImageAlt,
    detail: hasImageAlt ? 'Gambar memiliki deskripsi Alt ramah Google Image' : 'Beberapa gambar belum memiliki Alt text'
  });
  if (hasImageAlt) points += 15;
  else recommendations.push('Pastikan semua gambar memiliki tag Alt deskriptif.');

  const score = Math.min(100, Math.round(points));
  let grade = 'A+';
  if (score < 50) grade = 'D';
  else if (score < 65) grade = 'C';
  else if (score < 80) grade = 'B';
  else if (score < 90) grade = 'A';

  return {
    score,
    grade,
    densityMap,
    checklist,
    recommendations,
    wordCount: totalWords
  };
};

export default { calculateLiveSeoScore };
