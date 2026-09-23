import React, { useState } from 'react';
import {
  Palette, TrendingUp, Settings, Users, LogOut, CheckCircle2,
  RefreshCw, Globe, Shield, Smartphone, Layers, Save, AlertCircle,
  Menu, X, ChevronLeft, ChevronRight, ExternalLink, Activity, Sparkles, Check,
  Lock, Key, ShieldCheck, Eye, EyeOff, UserCheck, AlertTriangle
} from 'lucide-react';
import OrderManager from '../components/orders/OrderManager';
import InteractiveSeoDashboard from '../components/seo/InteractiveSeoDashboard';
import {
  switchTheme,
  updateSeoMarketing,
  updateAdminSlug,
  updateAdminSecurity,
  revokeAdminSessions
} from '../lib/api';

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

  // Local state for dynamic slug
  const [newSlug, setNewSlug] = useState(adminSlug || 'admin');

  // Admin Security & Credentials Form State
  const [securityForm, setSecurityForm] = useState({
    username: 'admin',
    email: 'admin@multicms.id',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

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

  // Save SEO & Marketing Configuration from InteractiveSeoDashboard
  const handleSaveSeoData = async (seoData) => {
    setLoading(true);
    try {
      const res = await updateSeoMarketing(seoData, adminToken);
      if (res.success) {
        showToast('Pengaturan SEO & Integrasi Google Berhasil Disimpan');
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

  // Password Strength Meter
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Belum diisi', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Terlalu Lemah (<6 karakter)', color: 'bg-red-500' };
    let score = 1;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score === 2) return { score: 2, label: 'Cukup', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Kuat', color: 'bg-blue-600' };
    return { score: 4, label: 'Sangat Kuat & Aman', color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength(securityForm.newPassword);

  // Save Security & Credentials Handler
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (!securityForm.currentPassword) {
      showToast('Password saat ini wajib diisi untuk verifikasi keamanan');
      return;
    }
    if (securityForm.newPassword) {
      if (securityForm.newPassword.length < 6) {
        showToast('Password baru minimal 6 karakter');
        return;
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        showToast('Konfirmasi password tidak cocok');
        return;
      }
    }

    setSecurityLoading(true);
    try {
      const res = await updateAdminSecurity({
        currentPassword: securityForm.currentPassword,
        newUsername: securityForm.username,
        newEmail: securityForm.email,
        newPassword: securityForm.newPassword || undefined,
        confirmPassword: securityForm.confirmPassword || undefined
      }, adminToken);

      if (res && res.success) {
        showToast('Kredensial profil & keamanan admin berhasil diperbarui!');
        setSecurityForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        showToast(res.error || 'Gagal memperbarui keamanan admin');
      }
    } catch {
      showToast('Gagal terhubung ke server');
    } finally {
      setSecurityLoading(false);
    }
  };

  // Revoke All Active Sessions ("Logout dari Semua Perangkat")
  const handleRevokeSessions = async () => {
    if (!window.confirm('Apakah Anda yakin ingin logout dari semua perangkat? Semua sesi aktif akan dicabut dan Anda harus login kembali.')) {
      return;
    }
    try {
      const res = await revokeAdminSessions(adminToken);
      if (res && res.success) {
        alert('Semua sesi aktif berhasil dicabut. Halaman akan dialihkan ke layar login.');
        onLogout();
      }
    } catch {
      showToast('Gagal mencabut sesi aktif');
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
        { id: 'flash-sale-modern', name: 'Modern Flash Sale Countdown' },
        { id: 'brand-catalog', name: 'Brand Collection Catalog' },
        { id: 'storytelling-artisan', name: 'Artisan Storytelling Brand' },
        { id: 'minimal-boutique', name: 'Minimalist Boutique' },
        { id: 'tech-gadget', name: 'Tech & Gadget Launch' },
        { id: 'organic-grocery', name: 'Organic Grocery Market' },
        { id: 'wholesale-b2b', name: 'B2B Wholesale Portal' },
        { id: 'fashion-lookbook', name: 'Fashion Lookbook Studio' },
        { id: 'single-product', name: 'Single Product Hero Focus' },
      ]
    },
    {
      id: 'fnb',
      name: 'F&B & Kuliner',
      icon: '🍽️',
      themes: [
        { id: 'bistro-fine-dining', name: 'Bistro Fine Dining' },
        { id: 'coffee-roastery', name: 'Artisan Coffee Roastery' },
        { id: 'fast-casual', name: 'Fast Casual Quick Order' },
        { id: 'artisan-bakery', name: 'Artisan French Bakery' },
        { id: 'cloud-kitchen', name: 'Cloud Kitchen Multi-Brand' },
        { id: 'japanese-omakase', name: 'Japanese Sushi & Omakase' },
        { id: 'street-food-hub', name: 'Street Food Modern Hub' },
        { id: 'catering-banquet', name: 'Catering & Banquet Service' },
        { id: 'juice-health-bar', name: 'Juice & Organic Health Bar' },
        { id: 'dessert-parlour', name: 'Dessert Parlour & Gelato' },
      ]
    },
    {
      id: 'services',
      name: 'Jasa Profesional & Lokal',
      icon: '💼',
      themes: [
        { id: 'legal-law-firm', name: 'Corporate Legal & Law Firm' },
        { id: 'tech-consulting', name: 'Tech Consulting & Cloud' },
        { id: 'accounting-tax', name: 'Accounting & Tax Advisory' },
        { id: 'auto-repair', name: 'Auto Repair & Tuning' },
        { id: 'beauty-salon-spa', name: 'Luxury Salon & Wellness' },
        { id: 'medical-dental', name: 'Dental Clinic & Specialist' },
        { id: 'home-services-hvac', name: 'Home Services HVAC & Repair' },
        { id: 'creative-agency', name: 'Creative Agency Portfolio' },
        { id: 'security-safety', name: 'Security & Surveillance' },
        { id: 'fitness-personal-trainer', name: 'Fitness Gym & Trainer' },
      ]
    },
    {
      id: 'realestate',
      name: 'Properti & Real Estate',
      icon: '🏢',
      themes: [
        { id: 'luxury-villa-penthouse', name: 'Luxury Villa & Penthouse' },
        { id: 'suburban-housing', name: 'Suburban Housing Cluster' },
        { id: 'commercial-leasing', name: 'Commercial Office Leasing' },
        { id: 'high-rise-apartment', name: 'High-Rise Modern Apartment' },
        { id: 'land-plots', name: 'Land Plots & Development' },
        { id: 'co-living-boarding', name: 'Co-Living & Boarding Space' },
        { id: 'modern-minimalist-home', name: 'Modern Minimalist Living' },
        { id: 'smart-home-residence', name: 'Smart Home Green Residence' },
        { id: 'beachfront-resort', name: 'Beachfront Resort Estates' },
        { id: 'industrial-warehouse', name: 'Industrial Logistics & Warehouse' },
      ]
    }
  ];

  const navMenuItems = [
    { id: 'themes', label: 'Tema & Tampilan', icon: Palette, badge: '50 Tema' },
    { id: 'seo', label: 'SEO & Performance Hub', icon: TrendingUp, badge: 'Live #1' },
    { id: 'leads', label: 'Manajemen Pesanan', icon: Users, badge: 'Order CRUD' },
    { id: 'settings', label: 'Keamanan & Portal', icon: Settings },
  ];

  const filteredIndustries = selectedIndustryTab === 'all'
    ? industryCatalog
    : industryCatalog.filter(ind => ind.id === selectedIndustryTab);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased min-w-0">
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
      <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3.5 flex items-center justify-between shadow-xs w-full max-w-full">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:outline-none flex items-center gap-2 shadow-xs transition-colors shrink-0"
            aria-label="Toggle Sidebar Mobile"
            id="mobile-sidebar-toggle"
          >
            <Menu className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Menu</span>
          </button>
          <div className="flex items-center gap-2 truncate min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
              M
            </div>
            <div className="truncate">
              <span className="font-extrabold text-sm text-slate-900 block leading-tight truncate">Admin CMS</span>
              <span className="text-[10px] text-slate-400 font-mono block truncate">/{adminSlug}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20 shrink-0">
              M
            </div>
            <div className="truncate">
              <span className="font-extrabold text-base text-slate-900 block leading-tight truncate">MultiCMS Engine</span>
              <span className="text-xs text-blue-600 font-semibold font-mono bg-blue-50 px-1.5 py-0.5 rounded-md mt-0.5 inline-block truncate">
                /{adminSlug}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
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
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                SA
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate">Superadmin</span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
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
      <main className={`flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
        desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
      }`}>
        {/* Desktop Sticky Header with Toggle Sidebar Button */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4 items-center justify-between shadow-xs w-full max-w-full">
          <div className="flex items-center gap-4 min-w-0">
            {/* Desktop Toggle Button */}
            <button
              type="button"
              onClick={() => setDesktopSidebarOpen(prev => !prev)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 flex items-center gap-2 shadow-xs transition-colors shrink-0"
              title={desktopSidebarOpen ? "Sembunyikan Sidebar" : "Buka Sidebar"}
              aria-label="Toggle Sidebar Desktop"
              id="desktop-sidebar-toggle"
            >
              <Menu className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-slate-700">
                {desktopSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
              </span>
            </button>

            <div className="h-6 w-px bg-slate-200 shrink-0" />

            <div className="truncate">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-0.5">
                <span>Admin Portal</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="text-blue-600 font-bold capitalize">{activeTab}</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight truncate">
                {activeTab === 'themes' && 'Engine 50 Tema Multi-Industri'}
                {activeTab === 'seo' && 'SEO & Performance Hub #1'}
                {activeTab === 'leads' && 'Manajemen Pesanan & Leads (Order CRUD)'}
                {activeTab === 'settings' && 'Pengaturan Keamanan & Dynamic Slug'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
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

        {/* Dashboard Content Container (Strict Zero Overflow & Generous Breathing Room) */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full max-w-full mx-auto pb-24 min-w-0 overflow-x-hidden">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Tema Aktif</span>
              <div className="text-base sm:text-lg font-black text-slate-900 capitalize truncate">
                {currentIndustry}
              </div>
              <div className="text-xs text-blue-600 font-mono truncate">{currentThemeId}</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Status Lisensi</span>
              <div className="text-base sm:text-lg font-black text-emerald-600 flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Aktif Terverifikasi</span>
              </div>
              <div className="text-xs text-slate-400 truncate">Enterprise Cloud Engine</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Audit PageSpeed</span>
              <div className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1 truncate">
                <span>98</span>
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <div className="text-xs text-emerald-600 font-semibold truncate">TTFB &lt; 50ms (Edge Cache)</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">Total Varian Tema</span>
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                50 Varian
              </div>
              <div className="text-xs text-blue-600 font-medium truncate">5 Kategori Industri Siap Pakai</div>
            </div>
          </div>

          {/* ========================================================
           * TAB 1: THEMES SELECTION & NAVIGATION CONFIG
           * ======================================================== */}
          {activeTab === 'themes' && (
            <div className="space-y-8 min-w-0">
              {/* Bottom Nav Style Selector */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <span>Gaya Mobile Bottom Navigation</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih dari 4 variasi navigasi bawah untuk perangkat mobile dan aplikasi PWA.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono">Aktif: {bottomNavStyle}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'dock', label: 'Floating Dock Pill', desc: 'Dock melayang modern rounded-full' },
                    { id: 'curved', label: 'Curved Scoop Solid', desc: 'Dock solid melengkung dinamis' },
                    { id: 'bubble', label: 'Floating Bubble', desc: 'Lingkaran bubble aktif mengambang' },
                    { id: 'modern-box', label: 'Modern Box Badge', desc: 'Badge kotak rounded melayang' },
                  ].map((style) => (
                    <div
                      key={style.id}
                      onClick={() => handleSwitchBottomNav(style.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        bottomNavStyle === style.id
                          ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">{style.label}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{style.desc}</div>
                      </div>
                      <div className="pt-2 flex items-center text-xs font-semibold">
                        {bottomNavStyle === style.id ? (
                          <span className="text-blue-600 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Terpilih
                          </span>
                        ) : (
                          <span className="text-slate-400 hover:text-slate-600">Pilih Gaya →</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedIndustryTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedIndustryTab === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Semua Industri (50 Tema)</span>
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
           * TAB 2: TECHNICAL SEO & INTERACTIVE PERFORMANCE DASHBOARD
           * ======================================================== */}
          {activeTab === 'seo' && (
            <InteractiveSeoDashboard
              seoConfig={config?.seo || {}}
              adminToken={adminToken}
              onSaveSeo={handleSaveSeoData}
              activeThemeName={currentThemeId}
            />
          )}

          {/* ========================================================
           * TAB 3: ORDER MANAGEMENT ENGINE (FULL ORDER CRUD & WHATSAPP)
           * ======================================================== */}
          {activeTab === 'leads' && (
            <OrderManager
              adminToken={adminToken}
              activeThemeName={currentThemeId}
            />
          )}

          {/* ========================================================
           * TAB 4: SETTINGS, DYNAMIC SLUG & ADMIN SECURITY
           * ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl min-w-0">
              {/* Box 1: Dynamic Admin Slug Configuration */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Konfigurasi Dynamic Admin Slug</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ubah URL rute akses portal admin Anda (misal: dari <code className="text-blue-600 font-mono">/admin</code> menjadi <code className="text-blue-600 font-mono">/portal-khusus</code> atau <code className="text-blue-600 font-mono">/sys-panel</code>) untuk mengamankan akses dari bot scanner default.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    URL Slug Admin Aktif
                  </label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-2xl text-xs text-slate-500 font-mono shrink-0">
                      https://domain.com/
                    </span>
                    <input
                      type="text"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className="flex-1 px-4 py-3 rounded-r-2xl border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-0"
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
                  <span>Simpan & Terapkan Slug Baru</span>
                </button>
              </div>

              {/* Box 2: Admin Profile & Credentials Management */}
              <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Manajemen Profil & Kredensial Keamanan Admin</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Ubah username, email pemulihan, dan password akun admin dengan verifikasi keamanan ketat.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Username Admin *
                    </label>
                    <input
                      type="text"
                      required
                      value={securityForm.username}
                      onChange={(e) => setSecurityForm({ ...securityForm, username: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Admin / Notifikasi *
                    </label>
                    <input
                      type="email"
                      required
                      value={securityForm.email}
                      onChange={(e) => setSecurityForm({ ...securityForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Password Saat Ini (Verifikasi Keamanan) *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        placeholder="Masukkan password admin saat ini"
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 focus:outline-none"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Password Baru (Kosongkan jika tidak diganti)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          placeholder="Minimal 6 karakter"
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 focus:outline-none"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {securityForm.newPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-500">Kekuatan Password:</span>
                            <span className={passStrength.score >= 3 ? 'text-emerald-600' : 'text-amber-600'}>
                              {passStrength.label}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full ${passStrength.color}`} style={{ width: `${passStrength.score * 25}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          placeholder="Ketik ulang password baru"
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 focus:outline-none"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={securityLoading}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
                  >
                    {securityLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Perbarui Kredensial Admin</span>
                  </button>
                </div>
              </form>

              {/* Box 3: Session Revocation ("Logout dari Semua Perangkat") */}
              <div className="bg-white rounded-3xl border border-red-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Cabut Sesi & Logout dari Semua Perangkat</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gunakan fitur ini jika Anda merasa kredensial Anda bocor atau ingin mereset seluruh sesi aktif di browser lain secara instan.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRevokeSessions}
                    className="px-5 py-2.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout dari Semua Perangkat Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
