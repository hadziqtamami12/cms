import React from 'react';

export default function JsonLd({ type = 'AutoRental', data = {} }) {
  let schema = null;

  switch (type) {
    case 'AutoRental':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: data.name || 'Ultra Rent Car Executive',
        image: data.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
        telephone: data.phone || '+6281234567890',
        priceRange: 'IDR 300.000 - 2.500.000',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jl. Utama No. 123',
          addressLocality: 'Jakarta',
          addressCountry: 'ID',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      };
      break;

    case 'Product':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name || 'Product Item',
        image: data.image,
        description: data.description,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'IDR',
          price: data.price || '100000',
          availability: 'https://schema.org/InStock',
        },
      };
      break;

    case 'Organization':
    default:
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name || 'Ultra Enterprise',
        url: window.location.origin,
      };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
