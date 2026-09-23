import React from 'react';
import AutomotiveThemeRenderer from './automotive/AutomotiveThemes';
import EcommerceThemeRenderer from './ecommerce/EcommerceThemes';
import FnbThemeRenderer from './fnb/FnbThemes';
import ServicesThemeRenderer from './services/ServicesThemes';
import RealEstateThemeRenderer from './realestate/RealEstateThemes';

/**
 * Universal Theme Registry & Dynamic Dispatcher
 * Resolves (industry, themeId) to the appropriate modular layout component
 */
export const ThemeRegistry = ({ industry = 'automotive', themeId = 'fleet-grid', config }) => {
  switch (industry) {
    case 'ecommerce':
      return <EcommerceThemeRenderer themeId={themeId} config={config} />;
    case 'fnb':
      return <FnbThemeRenderer themeId={themeId} config={config} />;
    case 'services':
      return <ServicesThemeRenderer themeId={themeId} config={config} />;
    case 'realestate':
      return <RealEstateThemeRenderer themeId={themeId} config={config} />;
    case 'automotive':
    default:
      return <AutomotiveThemeRenderer themeId={themeId} config={config} />;
  }
};

export default ThemeRegistry;
