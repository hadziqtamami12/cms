import React, { Suspense, lazy } from 'react';
import HeroSliderSkeleton from '../skeletons/HeroSliderSkeleton';
import FleetCatalogSkeleton from '../skeletons/FleetCatalogSkeleton';
import { getThemePresetData } from '../../utils/themePresets';

// Code-split blocks: Only downloaded when present in the page's block tree
const HeroSlider = lazy(() => import('../blocks/HeroSlider'));
const FleetCatalog = lazy(() => import('../blocks/FleetCatalog'));
const FeaturesGrid = lazy(() => import('../blocks/FeaturesGrid'));
const PricingTable = lazy(() => import('../blocks/PricingTable'));
const Testimonials = lazy(() => import('../blocks/Testimonials'));
const FaqAccordion = lazy(() => import('../blocks/FaqAccordion'));
const CtaBanner = lazy(() => import('../blocks/CtaBanner'));
const ArticlesSection = lazy(() => import('../blocks/ArticlesSection'));

// Map block types and common aliases to components
const BLOCK_COMPONENTS = {
  'hero-slider': HeroSlider,
  'hero': HeroSlider,
  'fleet-catalog': FleetCatalog,
  'catalog': FleetCatalog,
  'product-grid': FleetCatalog,
  'features': FeaturesGrid,
  'services': FeaturesGrid,
  'pricing': PricingTable,
  'pricing-table': PricingTable,
  'testimonials': Testimonials,
  'faq': FaqAccordion,
  'faq-accordion': FaqAccordion,
  'cta': CtaBanner,
  'cta-banner': CtaBanner,
  'articles': ArticlesSection,
  'post-list': ArticlesSection,
};

// Generic lightweight block skeleton for non-hero blocks
function GenericBlockSkeleton({ type }) {
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto w-full" aria-hidden="true">
      <div className="text-center max-w-xl mx-auto mb-10 flex flex-col items-center">
        <div className="w-24 h-5 rounded-full skeleton-shimmer mb-4" />
        <div className="w-72 h-8 rounded-lg skeleton-shimmer mb-3" />
        <div className="w-48 h-4 rounded skeleton-shimmer" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 rounded-3xl skeleton-shimmer" />
        <div className="h-64 rounded-3xl skeleton-shimmer" />
        <div className="h-64 rounded-3xl skeleton-shimmer" />
      </div>
    </div>
  );
}

// Select matching 1:1 skeleton per block type
function getBlockSkeleton(type) {
  switch (type) {
    case 'hero-slider':
      return <HeroSliderSkeleton />;
    case 'fleet-catalog':
      return <FleetCatalogSkeleton />;
    default:
      return <GenericBlockSkeleton type={type} />;
  }
}

class BlockErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error(`[BlockErrorBoundary] Block ${this.props.blockId || 'unknown'} error:`, error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

/**
 * Public Dynamic Block Renderer
 * Recursively renders JSON Block Tree with zero-crash fallbacks and Zero CLS Suspense
 */
export default function BlockRenderer({ blocks = [], themeId = 'twenty-twenty-five' }) {
  const activeBlocks = (Array.isArray(blocks) && blocks.length > 0)
    ? blocks
    : (getThemePresetData(themeId)?.blocks || getThemePresetData('astra-clean')?.blocks || getThemePresetData('twenty-twenty-five')?.blocks || []);

  if (!Array.isArray(activeBlocks) || activeBlocks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {activeBlocks.map((block) => {
        if (!block || !block.type) return null;
        const Component = BLOCK_COMPONENTS[block.type];

        // Safe graceful fallback for unknown block types (Never crashes the public app)
        if (!Component) {
          console.warn(`[BlockRenderer] Unknown block type: "${block.type}"`);
          return null;
        }

        return (
          <BlockErrorBoundary key={block.id || Math.random()} blockId={block.id}>
            <Suspense fallback={getBlockSkeleton(block.type)}>
              <Component props={block.props || {}} styles={block.styles || {}} />
              {/* Recursive rendering for nested children if present */}
              {Array.isArray(block.children) && block.children.length > 0 && (
                <BlockRenderer blocks={block.children} />
              )}
            </Suspense>
          </BlockErrorBoundary>
        );
      })}
    </div>
  );
}
