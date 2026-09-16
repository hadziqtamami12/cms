import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { fetchPublicPage, checkAuthStatus, getSystemSettings } from './utils/api';
import { getThemePresetData } from './utils/themePresets';
import DynamicTopbar from './components/navigation/DynamicTopbar';
import Footer from './components/navigation/Footer';
import CurvedBottomNav from './components/navigation/CurvedBottomNav';
import ClassicBottomNav from './components/navigation/ClassicBottomNav';
import FloatingWhatsapp from './components/navigation/FloatingWhatsapp';
import BlockRenderer from './components/renderer/BlockRenderer';
import PageSkeleton from './components/skeletons/PageSkeleton';
import SeoHead from './components/seo/SeoHead';
import JsonLd from './components/seo/JsonLd';

// Code-split admin pages so public visitors never load heavy admin chunks
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const PagesManager = lazy(() => import('./admin/pages/PagesManager'));
const PostsManager = lazy(() => import('./admin/pages/PostsManager'));
const ThemeCustomizer = lazy(() => import('./admin/pages/ThemeCustomizer'));
const PageBuilder = lazy(() => import('./admin/pages/PageBuilder'));
const JsonImporter = lazy(() => import('./admin/pages/JsonImporter'));
const SettingsPage = lazy(() => import('./admin/pages/SettingsPage'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const SetupWizard = lazy(() => import('./admin/pages/SetupWizard'));
const PostEditorPage = lazy(() => import('./admin/pages/PostEditorPage'));
const NewPageCreator = lazy(() => import('./admin/pages/NewPageCreator'));
const AppearanceSettings = lazy(() => import('./admin/pages/AppearanceSettings'));
const SeoSettingsPage = lazy(() => import('./admin/pages/SeoSettingsPage'));

// Standalone Article, Contact, and Public GrapesJS Landing Pages
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PublicPage = lazy(() => import('./pages/PublicPage'));
const PublicLanding = lazy(() => import('./pages/PublicLanding'));

class PublicErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Public landing page caught render exception:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      const fallbackPreset = getThemePresetData('astra-clean') || getThemePresetData('twenty-twenty-five');
      return (
        <div className="w-full min-h-screen bg-white text-slate-900 flex flex-col">
          <DynamicTopbar
            header={fallbackPreset?.header}
            siteName={fallbackPreset?.title || 'Ultra CMS'}
            colorMode="light"
          />
          <main className="flex-grow flex flex-col">
            <BlockRenderer blocks={fallbackPreset?.blocks || []} themeId="astra-clean" />
          </main>
          <Footer footer={fallbackPreset?.footer} />
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const slugFromParam = searchParams.get('page');
  const articleFromParam = searchParams.get('article') || (pathname.startsWith('/article/') ? pathname.replace('/article/', '') : null);
  const contactFromParam = searchParams.get('contact') === 'true' || pathname === '/kontak' || pathname === '/contact';

  // Admin View State with URL & LocalStorage Persistence (Supports /wp-admin and /admin)
  const isAdminRoute = pathname.startsWith('/wp-admin') || pathname.startsWith('/admin') || pathname === '/setup';
  const urlTab = searchParams.get('tab');
  const urlDocId = searchParams.get('id');

  const [adminTab, setAdminTab] = useState(
    urlTab || localStorage.getItem('cms_admin_tab') || 'dashboard'
  );
  const [editingPage, setEditingPage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(isAdminRoute);

  // Public Landing Page State
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(!isAdminRoute);

  // Check auth if on admin route
  useEffect(() => {
    if (isAdminRoute) {
      if (pathname === '/admin/login' || pathname === '/setup') {
        setAuthChecking(false);
        return;
      }
      checkAuthStatus().then((authed) => {
        setIsAuthenticated(authed);
        setAuthChecking(false);
      });
    }
  }, [isAdminRoute, pathname]);

  // Load public landing page
  useEffect(() => {
    if (isAdminRoute) return;

    let targetSlug = 'home';
    if (slugFromParam) {
      targetSlug = slugFromParam;
    } else if (pathname !== '/' && pathname.length > 1) {
      targetSlug = pathname.replace(/^\//, '');
    }

    setLoading(true);
    fetchPublicPage(targetSlug)
      .then((data) => {
        if (data) {
          setPageData(data);
        } else {
          // If 404 on requested slug, fallback gracefully to home
          return fetchPublicPage('home').then((homeData) => {
            if (homeData) {
              setPageData(homeData);
            } else {
              setPageData(getThemePresetData('astra-clean') || getThemePresetData('twenty-twenty-five'));
            }
          });
        }
      })
      .catch((err) => {
        console.warn('API error, rendering default preset theme seamlessly:', err);
        setPageData(getThemePresetData('astra-clean') || getThemePresetData('twenty-twenty-five'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAdminRoute, pathname, slugFromParam]);

  const colorMode = 'light';

  // Strictly enforce pure light theme on HTML element (strip any dark mode classes)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Resolve active theme preset fallback so landing page is NEVER empty/kosongan
  // Top-level hooks call (Rules of Hooks: never invoke hooks conditionally or after early returns)
  const activeThemeId = pageData?.themeId || 'astra-clean';
  const defaultThemePreset = useMemo(() => {
    return getThemePresetData(activeThemeId) || getThemePresetData('astra-clean') || getThemePresetData('twenty-twenty-five');
  }, [activeThemeId]);

  const resolvedBlocks = useMemo(() => {
    if (Array.isArray(pageData?.blocks) && pageData.blocks.length > 0) {
      return pageData.blocks;
    }
    if (Array.isArray(pageData?.content) && pageData.content.length > 0) {
      return pageData.content;
    }
    return defaultThemePreset?.blocks || [];
  }, [pageData?.blocks, pageData?.content, defaultThemePreset]);

  const resolvedHeader = pageData?.header || defaultThemePreset?.header;
  const resolvedFooter = pageData?.footer || defaultThemePreset?.footer;
  const resolvedTitle = pageData?.title || defaultThemePreset?.title || 'Astra Store Pro';
  const mobileNavType = pageData?.mobileNavType || 'curved';

  // -------------------------------------------------------------
  // ADMIN ROUTES
  // -------------------------------------------------------------
  if (isAdminRoute) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 text-xs">
          Memverifikasi sesi admin...
        </div>
      );
    }

    if (pathname === '/setup') {
      return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <SetupWizard onComplete={() => (window.location.href = '/admin')} />
        </Suspense>
      );
    }

    if (pathname === '/admin/login' || !isAuthenticated) {
      return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <AdminLogin onLoginSuccess={() => (window.location.href = '/admin')} />
        </Suspense>
      );
    }

    const handleAdminNavigate = (tab, payload = null) => {
      setAdminTab(tab);
      localStorage.setItem('cms_admin_tab', tab);

      let targetUrl = `/admin?tab=${tab}`;
      if (tab === 'edit-post' && payload) {
        setEditingPost(payload);
        if (payload.id) targetUrl += `&id=${encodeURIComponent(payload.id)}`;
      } else if (tab === 'new-post') {
        setEditingPost(null);
      } else if (tab === 'builder' && payload) {
        setEditingPage(payload);
        if (payload.slug || payload.id) targetUrl += `&id=${encodeURIComponent(payload.slug || payload.id)}`;
      } else if (tab === 'new-page') {
        setEditingPage(null);
      } else {
        setEditingPage(null);
        setEditingPost(null);
      }
      window.history.pushState(null, '', targetUrl);
    };

    // Dedicated Page 1: Standalone Post Editor (No Modals)
    if (adminTab === 'new-post' || adminTab === 'edit-post') {
      return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Memuat Editor Pos...</div>}>
          <PostEditorPage
            post={editingPost}
            onBack={() => handleAdminNavigate('posts')}
            onSaved={() => handleAdminNavigate('posts')}
          />
        </Suspense>
      );
    }

    // Dedicated Page 2: Standalone New Page Creator (No Modals)
    if (adminTab === 'new-page') {
      return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Memuat Pembuat Halaman...</div>}>
          <NewPageCreator
            onBack={() => handleAdminNavigate('pages')}
            onCreated={(saved, openBuilder) => {
              if (openBuilder) {
                handleAdminNavigate('builder', saved);
              } else {
                handleAdminNavigate('pages');
              }
            }}
          />
        </Suspense>
      );
    }

    // Standalone Fullscreen Elementor Pro Visual Builder:
    // Renders outside of AdminLayout so it has full screen freedom and returns to Pages onBack()
    if (adminTab === 'builder') {
      return (
        <Suspense fallback={<div className="min-h-screen bg-white text-slate-900 flex items-center justify-center text-xs">Memuat Elementor Studio Pro...</div>}>
          <PageBuilder
            page={editingPage}
            onBack={() => handleAdminNavigate('pages')}
            onSaved={(saved) => setEditingPage(saved)}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <AdminLayout
          currentTab={adminTab}
          onNavigate={(tab) => handleAdminNavigate(tab)}
        >
          {adminTab === 'dashboard' ? (
            <Dashboard
              onEditPage={(p) => handleAdminNavigate('builder', p)}
              onNewPage={() => handleAdminNavigate('new-page')}
              onNavigate={(tab) => handleAdminNavigate(tab)}
            />
          ) : adminTab === 'pages' ? (
            <PagesManager
              onEditPage={(p) => handleAdminNavigate('builder', p)}
              onNewPage={() => handleAdminNavigate('new-page')}
            />
          ) : adminTab === 'posts' ? (
            <PostsManager
              onEditPost={(p) => handleAdminNavigate('edit-post', p)}
              onNewPost={() => handleAdminNavigate('new-post')}
            />
          ) : adminTab === 'seo' ? (
            <SeoSettingsPage />
          ) : adminTab === 'themes' ? (
            <ThemeCustomizer />
          ) : adminTab === 'appearance' ? (
            <AppearanceSettings />
          ) : adminTab === 'import' ? (
            <JsonImporter onImportSuccess={() => handleAdminNavigate('pages')} />
          ) : (
            <SettingsPage />
          )}
        </AdminLayout>
      </Suspense>
    );
  }

  // Standalone Contact Page Route
  if (contactFromParam) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <ContactPage
          header={resolvedHeader}
          footer={resolvedFooter}
          colorMode={colorMode}
        />
      </Suspense>
    );
  }

  // Standalone Article / Post Reader Route
  if (articleFromParam) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <ArticleDetail
          slug={articleFromParam}
          header={resolvedHeader}
          footer={resolvedFooter}
          floatingWhatsapp={pageData?.floatingWhatsapp}
          colorMode={colorMode}
          onBackToHome={() => {
            window.location.href = '/';
          }}
        />
      </Suspense>
    );
  }

  // -------------------------------------------------------------
  // PUBLIC LANDING PAGE
  // -------------------------------------------------------------
  if (loading && !pageData) {
    // 1:1 Pixel-Match Skeleton Loading Engine: ZERO CLS (Pure Light Theme)
    return <PageSkeleton />;
  }

  // Resolve hero and fleet from pageData or block tree
  const heroBlock = resolvedBlocks.find((b) => b.type === 'hero-slider' || b.type === 'hero');
  const fleetBlock = resolvedBlocks.find((b) => b.type === 'fleet-catalog' || b.type === 'catalog' || b.type === 'product-grid');

  const resolvedHero = pageData?.hero || (heroBlock ? {
    mode: 'slideshow',
    slides: (heroBlock.props?.slides && heroBlock.props.slides.length > 0) ? heroBlock.props.slides : [
      {
        id: 's1',
        badge: heroBlock.props?.badge || 'Tema Resmi • Rental Mobil VIP',
        title: heroBlock.props?.title || 'Perjalanan Nyaman & Elegan dengan Armada Terbaik',
        subtitle: heroBlock.props?.subtitle || 'Unit terbaru, interior wangi bersih mewah, supir ramah berpengalaman, dan siap melayani rute dalam maupun luar kota kapan saja.',
        imageUrl: heroBlock.props?.slides?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600',
        ctaPrimaryText: heroBlock.props?.ctaPrimaryText || 'Pilih Armada Mobil',
        ctaPrimaryLink: heroBlock.props?.ctaPrimaryLink || '#fleet',
        ctaSecondaryText: heroBlock.props?.ctaSecondaryText || 'Reservasi WhatsApp 24 Jam',
        ctaSecondaryLink: heroBlock.props?.ctaSecondaryLink || `https://wa.me/${resolvedHeader?.whatsappNumber || '6281234567890'}`,
      }
    ],
  } : null);

  const resolvedFleet = pageData?.fleet || (fleetBlock ? {
    title: fleetBlock.props?.title || 'Daftar Armada Rental Paling Populer',
    subtitle: fleetBlock.props?.subtitle || 'Pilih unit sesuai kebutuhan perjalanan keluarga, wisata, maupun kunjungan bisnis.',
    vehicles: Array.isArray(fleetBlock.props?.vehicles) && fleetBlock.props.vehicles.length > 0 ? fleetBlock.props.vehicles.map((v) => ({
      id: v.id || `car-${Math.random()}`,
      name: v.name,
      category: v.category || 'SUV / Premium',
      priceLepasKunci: v.pricePerDay || v.price || 'Rp 750.000',
      priceWithDriver: v.priceDriver || 'Rp 950.000',
      transmission: v.transmission || 'Matic',
      capacity: v.capacity || '7 Kursi',
      fuel: v.fuel || 'Bensin',
      luggage: v.luggage || '3 Koper',
      rating: v.rating || 5.0,
      badge: v.highlight || v.badge || 'Unit Pilihan',
      imageUrl: v.image || v.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      description: v.description || 'Kenyamanan kelas eksekutif dengan kabin senyap dan prima.',
    })) : null,
  } : null);

  // Apply to dedicated rental landing page routes:
  // - page_rental_mobil_default
  // - category or template rental_mobil
  // - /landing route
  const isRentalCategory =
    pageData?.id === 'page_rental_mobil_default' ||
    pageData?.category === 'rental_mobil' ||
    pageData?.template === 'rental_mobil' ||
    pathname === '/landing' ||
    searchParams.get('landing') === 'true';

  if (isRentalCategory) {
    return (
      <PublicErrorBoundary>
        <Suspense fallback={<PageSkeleton />}>
          <SeoHead seo={pageData?.seo} title={resolvedTitle} />
          <JsonLd type={pageData?.seo?.jsonLdType || 'AutoRental'} data={{ name: resolvedTitle }} />
          <PublicLanding
            hero={resolvedHero}
            fleet={resolvedFleet}
            styling={pageData?.styling}
            header={resolvedHeader}
            footer={resolvedFooter}
            floatingWhatsapp={pageData?.floatingWhatsapp}
          />
        </Suspense>
      </PublicErrorBoundary>
    );
  }

  // If the page has compiled GrapesJS HTML, render via ultra-fast PublicPage with react-helmet-async SEO
  if (pageData?.html) {
    const targetSlug = slugFromParam || (pathname !== '/' && pathname.length > 1 ? pathname.replace(/^\//, '') : 'home');
    return (
      <Suspense fallback={<PageSkeleton />}>
        <PublicPage slug={targetSlug} />
      </Suspense>
    );
  }

  return (
    <PublicErrorBoundary>
      <div className="w-full min-h-screen bg-white text-slate-900 flex flex-col relative overflow-x-hidden selection:bg-slate-900 selection:text-white">
        {/* SEO Engine & Rich Snippets */}
        <SeoHead seo={pageData?.seo} title={resolvedTitle} />
        <JsonLd type={pageData?.seo?.jsonLdType || 'WebSite'} data={{ name: resolvedTitle }} />

        {/* Dynamic Transparent Topbar */}
        <DynamicTopbar
          header={resolvedHeader}
          siteName={resolvedTitle?.split('-')[0]?.trim() || 'Astra Store Pro'}
          colorMode={colorMode}
        />

        {/* Public Dynamic Block Tree Renderer */}
        <main className="flex-grow flex flex-col">
          <BlockRenderer blocks={resolvedBlocks} themeId={activeThemeId} />
        </main>

        {/* Mobile Navigation Variant (Mobile Only) */}
        {mobileNavType === 'curved' && (
          <CurvedBottomNav
            whatsappNumber={resolvedHeader?.whatsappNumber || "6281234567890"}
            brandName={resolvedHeader?.brandName || resolvedTitle || 'Astra Store Pro'}
          />
        )}
        {mobileNavType === 'classic' && (
          <ClassicBottomNav whatsappNumber={resolvedHeader?.whatsappNumber || "6281234567890"} />
        )}

        {/* Floating WhatsApp Action (Editable via CMS) */}
        <FloatingWhatsapp config={pageData?.floatingWhatsapp || {
          enabled: true,
          phoneNumber: resolvedHeader?.whatsappNumber || "6281234567890",
          agentName: "Customer Support",
          agentStatus: "Online",
          greetingMessage: "Halo! Butuh bantuan atau ingin memesan? Hubungi kami langsung.",
          defaultMessage: "Halo Admin, saya ingin bertanya tentang produk Anda.",
          ctaText: "Chat WhatsApp",
        }} />

        {/* Dynamic CMS Configurable Footer */}
        <Footer footer={resolvedFooter} />
      </div>
    </PublicErrorBoundary>
  );
}
