import React, { useEffect } from 'react';

export const SeoHead = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  industry = 'automotive',
  brandName,
  logoUrl,
  pwaIcon,
  pwaShortName,
  phone,
  gscVerification,
  gaMeasurementId,
  gtmId,
  metaPixelId,
  googleAdsId,
  ahrefsVerification,
  faqs = []
}) => {
  useEffect(() => {
    // 1. Dynamic Document Title
    if (title) {
      document.title = title;
    }

    // Dynamic Favicon & Apple Touch Icon from PWA Icon
    if (pwaIcon) {
      let iconLink = document.querySelector("link[rel*='icon']");
      if (iconLink) {
        iconLink.href = pwaIcon;
      }
      let appleIconLink = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleIconLink) {
        appleIconLink = document.createElement('link');
        appleIconLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleIconLink);
      }
      appleIconLink.href = pwaIcon;
    }

    // 2. Helper to set or create meta tag
    const setMeta = (nameOrProperty, value, isProperty = false) => {
      if (!value) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // Standard Meta Tags
    setMeta('description', description);
    if (pwaShortName) {
      setMeta('apple-mobile-web-app-title', pwaShortName);
    }
    if (keywords.length > 0) {
      setMeta('keywords', keywords.join(', '));
    }
    if (gscVerification) {
      setMeta('google-site-verification', gscVerification);
    }
    if (ahrefsVerification) {
      setMeta('ahrefs-site-verification', ahrefsVerification);
    }

    // OpenGraph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    if (canonicalUrl) setMeta('og:url', canonicalUrl, true);
    if (ogImage) setMeta('og:image', ogImage, true);

    // Twitter Cards
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (ogImage) setMeta('twitter:image', ogImage);

    // 3. Dynamic JSON-LD Structured Data Schema
    const schemaOrgId = 'dynamic-jsonld-schema';
    let schemaScript = document.getElementById(schemaOrgId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaOrgId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const currentUrl = canonicalUrl || window.location.href;
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: brandName || 'Enterprise CMS',
        url: currentUrl,
        logo: logoUrl || pwaIcon || `${window.location.origin}/icons/icon-512.svg`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: phone || '+628123456789',
          contactType: 'customer service',
          areaServed: 'ID'
        }
      }
    ];

    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q || f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a || f.answer
          }
        }))
      });
    }

    schemaScript.text = JSON.stringify(schemas);

    // 4. Marketing Scripts: GA4
    if (gaMeasurementId && !document.getElementById('ga4-script')) {
      const gaScript = document.createElement('script');
      gaScript.id = 'ga4-script';
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      document.head.appendChild(gaScript);

      const gaInit = document.createElement('script');
      gaInit.id = 'ga4-init';
      gaInit.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaMeasurementId}');
      `;
      document.head.appendChild(gaInit);
    }

    // GTM Script
    if (gtmId && !document.getElementById('gtm-script')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'gtm-script';
      gtmScript.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(gtmScript);
    }

    // Meta Pixel Script
    if (metaPixelId && !document.getElementById('meta-pixel-script')) {
      const pixelScript = document.createElement('script');
      pixelScript.id = 'meta-pixel-script';
      pixelScript.text = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaPixelId}');
      fbq('track', 'PageView');`;
      document.head.appendChild(pixelScript);
    }
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    industry,
    brandName,
    phone,
    gscVerification,
    gaMeasurementId,
    gtmId,
    metaPixelId,
    googleAdsId,
    ahrefsVerification,
    faqs
  ]);

  return null; // Head elements managed imperatively for React SPA
};

export default SeoHead;
