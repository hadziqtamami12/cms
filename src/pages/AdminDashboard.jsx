import React, { useState } from 'react';
import {
  Palette, TrendingUp, Settings, Users, LogOut, CheckCircle2,
  RefreshCw, Globe, Shield, Smartphone, Layers, Save, AlertCircle,
  Menu, X, ChevronLeft, ChevronRight, ExternalLink, Activity, Sparkles, Check
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Local state for theme switching
  const [currentIndustry, setCurrentIndustry] = useState(config?.industry || 'automotive');
  const [currentThemeId, setCurrentThemeId] = useState(config?.themeId || 'fleet-grid');
  const [bottomNavStyle, setBottomNavStyle] = useState(config?.bottomNavStyle || 'dock');

  // Filter state for themes tab
  const [selectedIndustryTab, setSelectedIndustryTab] = useState('all');

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
      icon: '🚗',
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
      icon: '🛍️',
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
      icon: '🍽️',
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
      name: 'Jasa & Konsultasi',
      icon: '💼',
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
      icon: '🏢',
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
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
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

  const navMenuItems = [
    { id: 'themes', label: 'Tema & Tampilan', icon: Palette, badge: '50 Tema' },
    { id: 'seo', label: 'SEO & Marketing', icon: TrendingUp, badge: 'Engine #1' },
    { id: 'leads', label: 'Pesanan & Leads', icon: Users, badge: '3 Baru' },
    { id: 'settings', label: 'Pengaturan Portal', icon: Settings },
  ];

  const filteredIndustries = selectedIndustryTab === 'all'
    ? industryCatalog
    : industryCatalog.filter(ind => ind.id === selectedIndustryTab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
       * MOBILE TOP BAR (Only visible on screens < 1024px)
       * ======================================================== */}
      <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:outline-none flex items-center gap-2 shadow-xs transition-colors"
            aria-label="Toggle Sidebar Mobile"
            id="mobile-sidebar-toggle"
          >
            <Menu className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              M
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 block leading-tight">Admin CMS</span>
              <span className="text-[10px] text-slate-400 font-mono">/{adminSlug}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Lihat Website"
          >
            <Globe className="w-4 h-4 text-blue-600" />
          </a>
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================
       * MOBILE BACKDROP OVERLAY
       * ======================================================== */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* ========================================================
       * SIDEBAR (Responsive: Drawer on mobile, Toggleable on desktop)
       * ======================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } ${
          desktopSidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20">
              M
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 block leading-tight">MultiCMS Engine</span>
              <span className="text-xs text-blue-600 font-semibold font-mono bg-blue-50 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                /{adminSlug}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Desktop Collapse / Hide Button */}
            <button
              onClick={() => setDesktopSidebarOpen(false)}
              className="hidden lg:flex p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Tutup / Sembunyikan Sidebar"
              aria-label="Tutup Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
              aria-label="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Kontrol Utama
          </div>
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 font-bold'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: System Status & User Action */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          {/* Public Web Quick Link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Lihat Halaman Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </a>

          {/* User Profile & Logout */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Superadmin</span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Floating Re-Open Sidebar Button for Desktop when closed */}
      {!desktopSidebarOpen && (
        <button
          onClick={() => setDesktopSidebarOpen(true)}
          className="hidden lg:flex fixed bottom-6 left-6 z-40 px-4 py-3 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95"
          title="Buka Sidebar"
          id="floating-open-sidebar"
        >
          <Menu className="w-4 h-4" />
          <span>Buka Sidebar</span>
        </button>
      )}

      {/* ========================================================
       * MAIN CONTENT AREA (Offset by sidebar on desktop if open)
       * ======================================================== */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
      }`}>
        {/* Desktop Sticky Header with Toggle Sidebar Button */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4 items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            {/* Desktop Toggle Button */}
            <button
              type="button"
              onClick={() => setDesktopSidebarOpen(prev => !prev)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 flex items-center gap-2 shadow-xs transition-colors"
              title={desktopSidebarOpen ? "Sembunyikan Sidebar" : "Buka Sidebar"}
              aria-label="Toggle Sidebar Desktop"
              id="desktop-sidebar-toggle"
            >
              <Menu className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-slate-700">
                {desktopSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
              </span>
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-0.5">
                <span>Admin Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-blue-600 font-bold capitalize">{activeTab}</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === 'themes' && 'Engine 50 Tema Multi-Industri'}
                {activeTab === 'seo' && 'SEO #1 Audit & Keyword Engine'}
                {activeTab === 'leads' && 'Data Pesanan & Leads Masuk'}
                {activeTab === 'settings' && 'Pengaturan Portal & Dynamic Slug'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Core Web Vitals 98+</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Lihat Website</span>
            </a>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tema Aktif</span>
              <div className="text-base sm:text-lg font-black text-slate-900 capitalize truncate">
                {currentIndustry}
              </div>
              <div className="text-xs text-blue-600 font-mono truncate">{currentThemeId}</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status Lisensi</span>
              <div className="text-base sm:text-lg font-black text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Aktif Terverifikasi</span>
              </div>
              <div className="text-xs text-slate-400">Enterprise Cloud Engine</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Leads Masuk</span>
              <div className="text-base sm:text-lg font-black text-slate-900">{sampleLeads.length} Klien</div>
              <div className="text-xs text-emerald-600 font-medium">+100% responsif</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dynamic Slug</span>
              <div className="text-base sm:text-lg font-mono font-bold text-slate-900 truncate">/{adminSlug}</div>
              <div className="text-xs text-slate-400">Proteksi Anti-Bot</div>
            </div>
          </div>

          {/* ========================================================
           * TAB 1: 1-CLICK THEME SWITCHER (50 THEMES)
           * ======================================================== */}
          {activeTab === 'themes' && (
            <div className="space-y-8">
              {/* Theme Settings & Mobile Nav Bar */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Instant Switch</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">Koleksi 50 Tema & Navigasi Mobile</h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Tema aktif: <strong className="text-blue-600 capitalize font-bold">{currentIndustry} - {currentThemeId}</strong>.
                    Pilih tema mana pun untuk beralih secara langsung tanpa mengubah konten Anda.
                  </p>
                </div>

                {/* Mobile Bottom Nav Variation Picker */}
                <div className="w-full md:w-auto shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Gaya Navigasi Bawah Smartphone
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'dock', label: 'Floating Dock' },
                      { id: 'curved', label: 'Curved Scoop' },
                      { id: 'bubble', label: 'Floating Bubble' },
                      { id: 'box', label: 'Modern Box' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleSwitchBottomNav(style.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          bottomNavStyle === style.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Industry Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedIndustryTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    selectedIndustryTab === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Semua Industri (50)
                </button>
                {industryCatalog.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setSelectedIndustryTab(ind.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                      selectedIndustryTab === ind.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{ind.icon}</span>
                    <span>{ind.name}</span>
                  </button>
                ))}
              </div>

              {/* Industries Themes Accordions / Cards */}
              <div className="space-y-8">
                {filteredIndustries.map((ind) => (
                  <div key={ind.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ind.icon}</span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-lg">{ind.name}</h3>
                          <span className="text-xs text-slate-400">10 Varian Layout Siap Pakai</span>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        Multi-Layout
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {ind.themes.map((th) => {
                        const isActive = currentIndustry === ind.id && currentThemeId === th.id;
                        return (
                          <div
                            key={th.id}
                            onClick={() => handleSwitchTheme(ind.id, th.id)}
                            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                              isActive
                                ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-600'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-card'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-sm text-slate-900 leading-snug">{th.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono mt-1">{th.id}</div>
                            </div>
                            <div className="pt-2 flex items-center justify-between text-xs font-semibold border-t border-slate-100">
                              {isActive ? (
                                <span className="text-blue-600 font-bold flex items-center gap-1">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>Aktif</span>
                                </span>
                              ) : (
                                <span className="text-slate-500 hover:text-blue-600 font-medium">Gunakan Tema →</span>
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

          {/* ========================================================
           * TAB 2: TECHNICAL SEO & MARKETING INTEGRATIONS
           * ======================================================== */}
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
              <form onSubmit={handleSaveSeo} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Konfigurasi Tag Meta & Integrasi Analitik Marketing</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Integrasikan Google Analytics, Search Console, Meta Pixel, dan GTM</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 shrink-0 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan SEO</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Meta Title Tag (Google SERP)
                    </label>
                    <input
                      type="text"
                      value={seoState.title || ''}
                      onChange={(e) => setSeoState({ ...seoState, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={seoState.metaDescription || ''}
                      onChange={(e) => setSeoState({ ...seoState, metaDescription: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Google Search Console (HTML Verification Meta)
                    </label>
                    <input
                      type="text"
                      placeholder="google-site-verification=SAMPLE_TAG..."
                      value={seoState.gscVerificationTag || ''}
                      onChange={(e) => setSeoState({ ...seoState, gscVerificationTag: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Google Analytics 4 (Measurement ID)
                    </label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX"
                      value={seoState.gaMeasurementId || ''}
                      onChange={(e) => setSeoState({ ...seoState, gaMeasurementId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Google Tag Manager (GTM ID)
                    </label>
                    <input
                      type="text"
                      placeholder="GTM-XXXXXXX"
                      value={seoState.gtmId || ''}
                      onChange={(e) => setSeoState({ ...seoState, gtmId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Meta / Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      placeholder="123456789012345"
                      value={seoState.metaPixelId || ''}
                      onChange={(e) => setSeoState({ ...seoState, metaPixelId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Google Bisnisku (GMB Embed Map URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.google.com/maps/embed?..."
                      value={seoState.gmbEmbedMapUrl || ''}
                      onChange={(e) => setSeoState({ ...seoState, gmbEmbedMapUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
           * TAB 3: LEADS LIST (RESPONSIVE TABLE WITH ZERO HORIZONTAL SCROLL)
           * ======================================================== */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Daftar Permintaan & Pesanan Klien (Leads)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Tampilan otomatis berubah menjadi stacked cards vertikal saat dibuka di layar smartphone/tablet (bebas scroll horizontal).
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold self-start sm:self-auto">
                    {sampleLeads.length} Leads Terdaftar
                  </span>
                </div>
              </div>

              <ResponsiveTableCard
                columns={leadColumns}
                data={sampleLeads}
                emptyMessage="Belum ada pesanan masuk."
              />
            </div>
          )}

          {/* ========================================================
           * TAB 4: SETTINGS & DYNAMIC SLUG
           * ======================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Konfigurasi Dynamic Admin Slug</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ganti slug URL admin panel Anda untuk melindungi rute masuk dari bot pencari default (<code className="text-blue-600 font-mono">/admin</code>).
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  URL Slug Admin Baru
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-2xl text-xs text-slate-500 font-mono">
                    https://domain.com/
                  </span>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="flex-1 px-4 py-3 rounded-r-2xl border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSlug}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Slug Baru</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
