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

    // Dynamic Favicon & Apple Touch Icon (Transparent Emblem)
    const activeFavicon = pwaIcon || logoUrl || '/icons/icon-192.svg';
    if (activeFavicon) {
      const isSvg = activeFavicon.toLowerCase().endsWith('.svg');
      const iconLinks = document.querySelectorAll("link[rel*='icon']");
      if (iconLinks.length > 0) {
        iconLinks.forEach(link => {
          if (link.getAttribute('type') === 'image/svg+xml') {
            link.href = isSvg ? activeFavicon : '/icons/icon-192.svg';
          } else {
            link.href = activeFavicon;
          }
        });
      } else {
        const newIcon = document.createElement('link');
        newIcon.rel = 'icon';
        newIcon.type = isSvg ? 'image/svg+xml' : 'image/png';
        newIcon.href = activeFavicon;
        document.head.appendChild(newIcon);
      }

      let appleIconLink = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleIconLink) {
        appleIconLink = document.createElement('link');
        appleIconLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleIconLink);
      }
      appleIconLink.href = activeFavicon;
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

    // Canonical URL Link
    const cleanCanonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0].split('#')[0] : '/');
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', cleanCanonical);

    // Standard Meta Tags
    setMeta('description', description);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
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
    setMeta('og:url', cleanCanonical, true);
    if (ogImage) setMeta('og:image', ogImage, true);

    // Twitter Cards
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (ogImage) setMeta('twitter:image', ogImage);

    // 3. Dynamic JSON-LD Structured Data Schema based on active CMS Category/Industry
    const schemaOrgId = 'dynamic-jsonld-schema';
    let schemaScript = document.getElementById(schemaOrgId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaOrgId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const currentUrl = cleanCanonical;
    const resolvedLogo = logoUrl || pwaIcon || (typeof window !== 'undefined' ? `${window.location.origin}/icons/icon-512.png` : '/icons/icon-512.png');
    const schemas = [];

    // Category-specific Main Schema
    if (industry === 'ecommerce') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: brandName || 'LuxeStore Official',
        url: currentUrl,
        logo: resolvedLogo,
        image: ogImage || resolvedLogo,
        description: description,
        telephone: phone || '+6281233445566',
        priceRange: 'Rp 50.000 - Rp 10.000.000',
        paymentAccepted: 'Cash, Credit Card, Bank Transfer, QRIS',
        currenciesAccepted: 'IDR'
      });

      if (items && items.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: items.slice(0, 10).map((prod, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'Product',
              name: prod.title,
              image: prod.image,
              description: prod.specs?.join(', ') || prod.badge || prod.title,
              offers: {
                '@type': 'Offer',
                price: (prod.price || '').replace(/[^0-9]/g, '') || '100000',
                priceCurrency: 'IDR',
                availability: 'https://schema.org/InStock',
                url: currentUrl
              }
            }
          }))
        });
      }
    } else if (industry === 'services') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: brandName || 'Apex Global Consulting',
        url: currentUrl,
        logo: resolvedLogo,
        image: ogImage || resolvedLogo,
        description: description,
        telephone: phone || '+6282199887711',
        areaServed: 'Indonesia',
        serviceType: 'Konsultasi Manajemen Bisnis, Legalitas, & IT Solution'
      });
    } else if (industry === 'news') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'NewsMediaOrganization',
        name: brandName || 'WartaNusantara Digital',
        url: currentUrl,
        logo: resolvedLogo,
        description: description,
        publishingPrinciples: `${currentUrl}/artikel`
      });
    } else {
      // Default: Automotive / Rental Mobil
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: brandName || 'Royal Fleet Premiere',
        url: currentUrl,
        logo: resolvedLogo,
        image: ogImage || resolvedLogo,
        description: description,
        telephone: phone || '+6281288990011',
        priceRange: 'Rp 450.000 - Rp 2.500.000',
        areaServed: 'Jabodetabek & Bali',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: phone || '+6281288990011',
          contactType: 'reservations',
          areaServed: 'ID'
        }
      });
    }

    // Universal WebSite Schema with Sitelinks Search
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: brandName || 'Enterprise CMS Platform',
      url: currentUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${currentUrl}/artikel?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });

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
