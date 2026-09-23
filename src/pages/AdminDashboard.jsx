import React, { useState } from 'react';
import {
  Palette, TrendingUp, Settings, Users, LogOut, CheckCircle2,
  RefreshCw, Globe, Shield, Smartphone, Layers, Save, AlertCircle
} from 'lucide-react';
import SeoScoreChecker from '../components/seo/SeoScoreChecker';
import ResponsiveTableCard from '../components/common/ResponsiveTableCard';
import { switchTheme, updateSeoMarketing, updateAdminSlug } from '../lib/api';

export const AdminDashboard = ({
  config,
  adminToken,
  adminSlug,
  onLogout,
  onConfigUpdated
}) => {
  const [activeTab, setActiveTab] = useState('themes'); // 'themes' | 'seo' | 'leads' | 'settings'
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Local state for theme switching
  const [currentIndustry, setCurrentIndustry] = useState(config?.industry || 'automotive');
  const [currentThemeId, setCurrentThemeId] = useState(config?.themeId || 'fleet-grid');
  const [bottomNavStyle, setBottomNavStyle] = useState(config?.bottomNavStyle || 'dock');

  // Local state for SEO & Marketing
  const [seoState, setSeoState] = useState(config?.seo || {});

  // Local state for dynamic slug
  const [newSlug, setNewSlug] = useState(adminSlug || 'admin');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1-Click Theme Switch Handler
  const handleSwitchTheme = async (ind, thId) => {
    setLoading(true);
    try {
      const res = await switchTheme({
        industry: ind,
        themeId: thId,
        bottomNavStyle,
        token: adminToken
      });
      if (res.success) {
        setCurrentIndustry(ind);
        setCurrentThemeId(thId);
        showToast(`Tema berhasil diubah menjadi [${ind} - ${thId}]`);
        if (onConfigUpdated) onConfigUpdated(res.themeConfig);
      }
    } catch (err) {
      showToast('Gagal mengubah tema');
    } finally {
      setLoading(false);
    }
  };

  // Bottom Nav Switch Handler
  const handleSwitchBottomNav = async (style) => {
    setBottomNavStyle(style);
    try {
      const res = await switchTheme({
        industry: currentIndustry,
        themeId: currentThemeId,
        bottomNavStyle: style,
        token: adminToken
      });
      if (res.success) {
        showToast(`Gaya navigasi mobile diubah ke: ${style}`);
        if (onConfigUpdated) onConfigUpdated(res.themeConfig);
      }
    } catch {}
  };

  // Save SEO & Marketing Configuration
  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateSeoMarketing(seoState, adminToken);
      if (res.success) {
        showToast('Pengaturan SEO & Integrasi Marketing Berhasil Disimpan');
        if (onConfigUpdated) onConfigUpdated({ ...config, seo: res.seo });
      }
    } catch {
      showToast('Gagal menyimpan SEO');
    } finally {
      setLoading(false);
    }
  };

  // Update Dynamic Admin Slug
  const handleSaveSlug = async () => {
    if (!newSlug) return;
    setLoading(true);
    try {
      const res = await updateAdminSlug(newSlug, adminToken);
      if (res.success) {
        showToast(`Slug portal admin berhasil diganti menjadi /${res.newSlug}`);
        window.history.replaceState(null, '', `/${res.newSlug}`);
      }
    } catch {
      showToast('Gagal memperbarui slug admin');
    } finally {
      setLoading(false);
    }
  };

  // Catalog of 50 Themes across 5 Industries
  const industryCatalog = [
    {
      id: 'automotive',
      name: 'Rental & Otomotif',
      themes: [
        { id: 'fleet-grid', name: 'Fleet Showcase Grid' },
        { id: 'booking-bar-hero', name: 'Booking Reservation Bar' },
        { id: 'luxury-chauffeur', name: 'Luxury VIP Chauffeur' },
        { id: 'minimalist-rent', name: 'Minimalist Fast Rent' },
        { id: 'daily-express', name: 'Daily Express Rental' },
        { id: 'offroad-adventure', name: 'Offroad & Tour 4x4' },
        { id: 'executive-van', name: 'Executive Van & Shuttle' },
        { id: 'eco-electric', name: 'Eco Electric EV Fleet' },
        { id: 'airport-shuttle', name: 'Airport Express Transfer' },
        { id: 'bike-scooter', name: 'Urban Bike & Scooter' },
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce & Retail',
      themes: [
        { id: 'direct-checkout', name: 'Direct Funnel Checkout' },
        { id: 'flash-sale-modern', name: 'Flash Sale Modern' },
        { id: 'brand-catalog', name: 'Brand Product Catalog' },
        { id: 'storytelling-artisan', name: 'Artisan Storytelling' },
        { id: 'minimal-boutique', name: 'Editorial Minimal Boutique' },
        { id: 'tech-gadget', name: 'Tech Gadget Specs' },
        { id: 'organic-grocery', name: 'Fresh Organic Grocery' },
        { id: 'wholesale-b2b', name: 'B2B Wholesale Portal' },
        { id: 'fashion-lookbook', name: 'Fashion Lookbook Grid' },
        { id: 'single-product', name: 'Single Product Spotlight' },
      ]
    },
    {
      id: 'fnb',
      name: 'F&B & Kuliner',
      themes: [
        { id: 'bistro-fine-dining', name: 'Fine Dining & Bistro' },
        { id: 'coffee-roastery', name: 'Artisan Coffee Roastery' },
        { id: 'fast-casual', name: 'Fast Casual Burger & Bites' },
        { id: 'artisan-bakery', name: 'Pastry & Artisan Bakery' },
        { id: 'cloud-kitchen', name: 'Cloud Kitchen Delivery Hub' },
        { id: 'japanese-omakase', name: 'Authentic Japanese Omakase' },
        { id: 'street-food-hub', name: 'Modern Street Food Hub' },
        { id: 'catering-banquet', name: 'Catering & Banquet Hall' },
        { id: 'juice-health-bar', name: 'Cold-Pressed Juice Bar' },
        { id: 'dessert-parlour', name: 'Gelato & Dessert Parlour' },
      ]
    },
    {
      id: 'services',
      name: 'Jasa Profesional & Layanan Lokal',
      themes: [
        { id: 'legal-law-firm', name: 'Advocate & Law Firm' },
        { id: 'tech-consulting', name: 'Enterprise IT Consulting' },
        { id: 'accounting-tax', name: 'Tax & Accounting Advisory' },
        { id: 'auto-repair', name: 'Auto Repair & Detailing Lab' },
        { id: 'beauty-salon-spa', name: 'Aesthetic Clinic & Luxury Spa' },
        { id: 'medical-dental', name: 'Dental Care & Health Clinic' },
        { id: 'home-services-hvac', name: 'HVAC & Home Repair Express' },
        { id: 'creative-agency', name: 'Creative Studio & Branding' },
        { id: 'security-safety', name: 'Corporate Security & Guard' },
        { id: 'fitness-personal-trainer', name: 'Gym & Elite Fitness Studio' },
      ]
    },
    {
      id: 'realestate',
      name: 'Properti & Real Estate',
      themes: [
        { id: 'luxury-villa-penthouse', name: 'Luxury Villa & Penthouse' },
        { id: 'suburban-housing', name: 'Suburban Housing Cluster' },
        { id: 'commercial-leasing', name: 'Grade-A Office Leasing' },
        { id: 'high-rise-apartment', name: 'Metropolitan High-Rise' },
        { id: 'land-plots', name: 'Land & Investment Plots' },
        { id: 'co-living-boarding', name: 'Modern Co-Living Residence' },
        { id: 'modern-minimalist-home', name: 'Scandinavian Minimalist Home' },
        { id: 'smart-home-residence', name: 'Smart IoT Eco Residences' },
        { id: 'beachfront-resort', name: 'Tropical Beachfront Resort' },
        { id: 'industrial-warehouse', name: 'Logistics Warehouse Hub' },
      ]
    }
  ];

  // Sample leads data
  const sampleLeads = [
    { id: 'L-101', name: 'Ir. Hendro Kusuma', phone: '081288776655', email: 'hendro@holding.co.id', item: 'Alphard Transformer', status: 'Baru', date: '2026-09-23 10:15' },
    { id: 'L-102', name: 'Amanda Putri', phone: '081399887711', email: 'amanda@agency.com', item: 'Innova Zenix Hybrid', status: 'Dihubungi', date: '2026-09-23 09:30' },
    { id: 'L-103', name: 'Budi Santoso', phone: '085711223344', email: 'budi@trans.co.id', item: 'HiAce Premio VIP', status: 'Selesai', date: '2026-09-22 16:45' }
  ];

  const leadColumns = [
    { key: 'name', label: 'Nama Klien' },
    { key: 'phone', label: 'No. WhatsApp/Telepon' },
    { key: 'item', label: 'Unit / Layanan' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          val === 'Baru' ? 'bg-blue-100 text-blue-800' :
          val === 'Dihubungi' ? 'bg-amber-100 text-amber-800' :
          'bg-emerald-100 text-emerald-800'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'date', label: 'Waktu Masuk' }
  ];

  return (
    <div className="min-h-screen bg-surface-warm pb-24">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
              M
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg">CMS Admin Control Panel</h1>
              <p className="text-xs text-slate-500 font-mono">
                Portal Slug: /{adminSlug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </a>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-4 border-t border-slate-100 overflow-x-auto">
          {[
            { id: 'themes', label: '1-Click Multi-Themes (50 Varian)', icon: Palette },
            { id: 'seo', label: 'SEO #1 & Keyword Engine', icon: TrendingUp },
            { id: 'leads', label: 'Data Pesanan & Leads', icon: Users },
            { id: 'settings', label: 'Pengaturan & Dynamic Slug', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: 1-CLICK THEME SWITCHER (50 THEMES) */}
        {activeTab === 'themes' && (
          <div className="space-y-8">
            {/* Header Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Engine 50 Tema Multi-Industri</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tema aktif saat ini: <strong className="text-blue-600 capitalize">{currentIndustry} - {currentThemeId}</strong>.
                  Klik varian tema mana pun untuk beralih secara instan tanpa merusak data landing page.
                </p>
              </div>

              {/* Mobile Bottom Nav Variation Picker */}
              <div className="w-full md:w-auto">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Varian Navigasi Bawah Mobile
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {[
                    { id: 'dock', label: 'Floating Dock' },
                    { id: 'curved', label: 'Curved Scoop' },
                    { id: 'bubble', label: 'Floating Bubble' },
                    { id: 'box', label: 'Modern Box' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleSwitchBottomNav(style.id)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                        bottomNavStyle === style.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 Industry Categories x 10 Themes Accordion */}
            <div className="space-y-6">
              {industryCatalog.map((ind) => (
                <div key={ind.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <h3 className="font-extrabold text-slate-900 text-base">{ind.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        10 Tema Siap Pakai
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {ind.themes.map((th) => {
                      const isActive = currentIndustry === ind.id && currentThemeId === th.id;
                      return (
                        <div
                          key={th.id}
                          onClick={() => handleSwitchTheme(ind.id, th.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isActive
                              ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-2 ring-blue-600'
                              : 'border-slate-200 bg-surface-warm/40 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-slate-900 leading-snug">{th.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{th.id}</div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                            {isActive ? (
                              <span className="text-blue-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Aktif</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 hover:text-blue-600">Pilih Tema →</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL SEO & MARKETING INTEGRATIONS */}
        {activeTab === 'seo' && (
          <div className="space-y-8">
            {/* Live SEO Score and Keyword Audit Engine */}
            <SeoScoreChecker
              initialKeywords={seoState.targetKeywords || ['sewa mobil jakarta', 'rental alphard', 'mobil lepas kunci']}
              title={seoState.title || ''}
              metaDescription={seoState.metaDescription || ''}
              h1={config?.heroSlides?.[0]?.title || ''}
              slug={seoState.slug || ''}
              content={config?.heroSlides?.[0]?.subtitle || ''}
              onKeywordsChange={(kw) => setSeoState({ ...seoState, targetKeywords: kw })}
            />

            {/* SEO Form & Marketing Tags Configuration */}
            <form onSubmit={handleSaveSeo} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Konfigurasi Tag Meta & Integrasi Analitik Marketing</h3>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan SEO</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Meta Title Tag (Google SERP)
                  </label>
                  <input
                    type="text"
                    value={seoState.title || ''}
                    onChange={(e) => setSeoState({ ...seoState, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoState.metaDescription || ''}
                    onChange={(e) => setSeoState({ ...seoState, metaDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Google Search Console (HTML Verification Meta)
                  </label>
                  <input
                    type="text"
                    placeholder="google-site-verification=SAMPLE_TAG..."
                    value={seoState.gscVerificationTag || ''}
                    onChange={(e) => setSeoState({ ...seoState, gscVerificationTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Google Analytics 4 (Measurement ID)
                  </label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={seoState.gaMeasurementId || ''}
                    onChange={(e) => setSeoState({ ...seoState, gaMeasurementId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Google Tag Manager (GTM ID)
                  </label>
                  <input
                    type="text"
                    placeholder="GTM-XXXXXXX"
                    value={seoState.gtmId || ''}
                    onChange={(e) => setSeoState({ ...seoState, gtmId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Meta / Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    placeholder="123456789012345"
                    value={seoState.metaPixelId || ''}
                    onChange={(e) => setSeoState({ ...seoState, metaPixelId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Google Bisnisku (GMB Embed Map URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.google.com/maps/embed?..."
                    value={seoState.gmbEmbedMapUrl || ''}
                    onChange={(e) => setSeoState({ ...seoState, gmbEmbedMapUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LEADS LIST (RESPONSIVE TABLE WITH ZERO HORIZONTAL SCROLL) */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daftar Permintaan & Pesanan Klien (Leads)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Tampilan otomatis berubah menjadi stacked cards vertikal saat dibuka di layar smartphone/tablet (bebas scroll horizontal).
              </p>
            </div>

            <ResponsiveTableCard
              columns={leadColumns}
              data={sampleLeads}
              emptyMessage="Belum ada pesanan masuk."
            />
          </div>
        )}

        {/* TAB 4: SETTINGS & DYNAMIC SLUG */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Konfigurasi Dynamic Admin Slug</h2>
            <p className="text-xs text-slate-500">
              Ganti slug URL admin panel Anda untuk melindungi rute masuk dari bot pencari default (<code className="text-blue-600">/admin</code>).
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                URL Slug Admin Baru
              </label>
              <div className="flex items-center">
                <span className="px-4 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs text-slate-500 font-mono">
                  https://domain.com/
                </span>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="flex-1 px-4 py-2.5 rounded-r-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSlug}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Slug Baru</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
