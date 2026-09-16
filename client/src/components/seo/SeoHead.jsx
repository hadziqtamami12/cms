import React, { useEffect } from 'react';

export default function SeoHead({ seo = {}, title = '' }) {
  const metaTitle = seo.metaTitle || title || 'Ultra CMS Engine';
  const metaDescription = seo.metaDescription || 'Ultra-Performance Headless CMS & Landing Page Engine';
  const ogImage = seo.ogImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200';
  const canonical = seo.canonical || window.location.href;

  useEffect(() => {
    // Dynamically update document head tags for client-side navigation
    document.title = metaTitle;

    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', metaDescription);
    setMeta('og:title', metaTitle, true);
    setMeta('og:description', metaDescription, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:url', canonical, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', metaTitle);
    setMeta('twitter:description', metaDescription);
    setMeta('twitter:image', ogImage);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);
  }, [metaTitle, metaDescription, ogImage, canonical]);

  return null;
}
