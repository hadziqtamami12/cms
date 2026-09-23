import React, { useState } from 'react';
import {
  Palette, TrendingUp, Settings, Users, LogOut, CheckCircle2,
  RefreshCw, Globe, Shield, Smartphone, Layers, Save, AlertCircle,
  Menu, X, ChevronLeft, ChevronRight, ExternalLink, Activity, Sparkles, Check,
  Lock, Key, ShieldCheck, Eye, EyeOff, UserCheck, AlertTriangle, Copy,
  PanelLeftClose, PanelLeftOpen, Package, MessageCircle, Sliders, LayoutDashboard, ArrowRight
} from 'lucide-react';
import OrderManager from '../components/orders/OrderManager';
import InteractiveSeoDashboard from '../components/seo/InteractiveSeoDashboard';
import { ThemeShowcase } from '../components/themes/ThemeShowcase';
import { InteractiveBottomNavSelector } from '../components/themes/InteractiveBottomNavSelector';
import { ProductCatalogManager } from '../components/products/ProductCatalogManager';
import { SlideshowManager } from '../components/slideshow/SlideshowManager';
import { WhatsAppStudio } from '../components/whatsapp/WhatsAppStudio';
import { SiteIdentityManager } from '../components/settings/SiteIdentityManager';
import { getPresetForIndustry } from '../lib/industryCatalogs';
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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'themes' | 'slideshow' | 'products' | 'whatsapp' | 'seo' | 'leads' | 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Desktop Sidebar Mode: 'expanded' (w-64) or 'rail' (w-20 mini icon rail)
  const [desktopSidebarMode, setDesktopSidebarMode] = useState('expanded');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Local state for theme switching
  const [currentIndustry, setCurrentIndustry] = useState(config?.industry || 'automotive');
  const [currentThemeId, setCurrentThemeId] = useState(config?.themeId || 'fleet-grid');
  const [bottomNavStyle, setBottomNavStyle] = useState(config?.bottomNavStyle || 'dock');

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
  const [securitySaved, setSecuritySaved] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const copyToClipboard = (text, label = 'Teks') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      showToast(`${label} disalin ke clipboard`);
    }
  };


  // Optimistic Instant Theme Switch Handler
  const handleSwitchTheme = async (ind, thId) => {
    // 1. Instant optimistic update
    setCurrentIndustry(ind);
    setCurrentThemeId(thId);

    // If changing industry, load industry preset products and branding
    const isNewIndustry = ind !== currentIndustry;
    const preset = getPresetForIndustry(ind);

    const updatedConfig = {
      ...config,
      industry: ind,
      themeId: thId,
      bottomNavStyle,
      bottom_nav_variant: config?.bottom_nav_variant || bottomNavStyle,
      ...(isNewIndustry ? {
        brandName: preset.brandName,
        tagline: preset.tagline,
        heroSlides: preset.heroSlides,
        items: preset.items
      } : {})
    };

    if (onConfigUpdated) onConfigUpdated(updatedConfig);
    showToast(`Tema aktif diubah ke [${thId}] (${ind})`);
    setLoading(true);

    try {
      const [resTheme] = await Promise.all([
        switchTheme({
          industry: ind,
          themeId: thId,
          bottomNavStyle,
          bottom_nav_variant: config?.bottom_nav_variant || bottomNavStyle,
          token: adminToken
        }),
        updateAppSettings(updatedConfig, adminToken)
      ]);
      if (resTheme && resTheme.success) {
        if (onConfigUpdated) {
          onConfigUpdated({
            ...updatedConfig,
            ...(resTheme.themeConfig || {})
          });
        }
      }
    } catch {
      showToast('Gagal menyinkronkan tema ke server');
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
        setSecuritySaved(true);
        showToast('Kredensial profil & keamanan admin berhasil diperbarui!');
        setSecurityForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setTimeout(() => setSecuritySaved(false), 2500);
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
    { id: 'dashboard', label: 'Dashboard Ringkasan', icon: LayoutDashboard, badge: 'Utama' },
    { id: 'branding', label: 'Identitas & Judul Situs', icon: Globe, badge: 'Situs' },
    { id: 'themes', label: 'Tema & Tampilan', icon: Palette, badge: '50' },
    { id: 'slideshow', label: 'Slideshow Hero (CRUD)', icon: Sliders, badge: (config?.heroSlides || []).length || 'Slide' },
    { id: 'products', label: 'Katalog Produk (CRUD)', icon: Package, badge: (config?.items || []).length || 'Unit' },
    { id: 'whatsapp', label: 'Floating WhatsApp', icon: MessageCircle, badge: 'Studio' },
    { id: 'seo', label: 'SEO & Performance', icon: TrendingUp, badge: 'Live' },
    { id: 'leads', label: 'Manajemen Pesanan', icon: Users, badge: 'CRUD' },
    { id: 'settings', label: 'Keamanan & Portal', icon: Settings },
  ];


  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased min-w-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce-in max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
       * MOBILE TOP BAR (<1024px, Touch-Optimized 44x44px Button)
       * ======================================================== */}
      <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-xs w-full max-w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Hamburger button with micro-animation */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors shrink-0"
            aria-label={mobileSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            id="mobile-sidebar-toggle"
          >
            {mobileSidebarOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-blue-600" />
            )}
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
            className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Lihat Website"
          >
            <Globe className="w-4 h-4 text-blue-600" />
          </a>
          <button
            onClick={onLogout}
            className="h-11 w-11 flex items-center justify-center rounded-xl text-red-600 hover:bg-red-50 border border-red-200"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================
       * MOBILE OFF-CANVAS SLIDE DRAWER (<1024px)
       * ======================================================== */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-out shadow-2xl lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              M
            </div>
            <div className="truncate">
              <span className="font-extrabold text-sm text-slate-900 block leading-tight truncate">MultiCMS Engine</span>
              <span className="text-[11px] text-blue-600 font-mono block truncate">/{adminSlug}</span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 shrink-0"
            aria-label="Tutup Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Utama
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
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

        {/* Mobile Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Lihat Halaman Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </a>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                SA
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 block truncate">Superadmin</span>
                <span className="text-[10px] text-emerald-600 font-medium">Online</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
       * DESKTOP ERGONOMIC SIDEBAR (Expanded w-64 vs Mini Rail w-20)
       * ======================================================== */}
      <aside
        className={`hidden lg:flex fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200 flex-col justify-between transition-all duration-300 ease-in-out ${
          desktopSidebarMode === 'rail' ? 'w-20' : 'w-64'
        }`}
      >
        {/* Desktop Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {desktopSidebarMode === 'expanded' ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                M
              </div>
              <div className="truncate">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight truncate">MultiCMS</span>
                <span className="text-[10px] text-blue-600 font-mono truncate block">/{adminSlug}</span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-sm">
                M
              </div>
            </div>
          )}

          {desktopSidebarMode === 'expanded' && (
            <button
              onClick={() => setDesktopSidebarMode('rail')}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              title="Perkecil ke Mini Icon Rail"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="p-3 space-y-2 flex-1 overflow-y-auto">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (desktopSidebarMode === 'rail') {
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                  {/* Floating Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Footer */}
        <div className="p-3 border-t border-slate-100 space-y-3 bg-slate-50/50">
          {desktopSidebarMode === 'expanded' ? (
            <>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="truncate">Halaman Publik</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
              </a>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    SA
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-900 block truncate">Superadmin</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Online</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <button
                onClick={() => setDesktopSidebarMode('expanded')}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                title="Perluas Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-blue-600 hover:bg-slate-50"
                title="Lihat Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <button
                onClick={onLogout}
                className="w-10 h-10 rounded-xl text-red-600 hover:bg-red-50 flex items-center justify-center"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================
       * MAIN CONTENT AREA (Smoothly offsets based on desktopSidebarMode)
       * ======================================================== */}
      <main
        className={`flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
          desktopSidebarMode === 'rail' ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Desktop Sticky Header (Clean Top Bar without Toggle Button) */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 sticky top-0 z-30 px-6 sm:px-8 py-3.5 items-center justify-between shadow-xs w-full max-w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="truncate">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-0.5">
                <span>Admin</span>
                <ChevronRight className="w-3 h-3 shrink-0" />
                <span className="text-blue-600 font-bold capitalize">{activeTab}</span>
              </div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight truncate">
                {activeTab === 'dashboard' && 'Dashboard Ringkasan & Status Sistem'}
                {activeTab === 'branding' && 'Identitas Aplikasi & Pengaturan Judul Situs'}
                {activeTab === 'themes' && 'Engine 50 Tema Multi-Industri'}
                {activeTab === 'slideshow' && 'Manajemen Slideshow & Hero Banner (CRUD)'}
                {activeTab === 'products' && 'Manajemen Produk & Unit (CRUD)'}
                {activeTab === 'whatsapp' && 'Studio WhatsApp & Floating Contact'}
                {activeTab === 'seo' && 'SEO & Performance Hub #1'}
                {activeTab === 'leads' && 'Manajemen Pesanan (Order CRUD)'}
                {activeTab === 'settings' && 'Pengaturan Keamanan & Slug'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Core Web Vitals 98+</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </a>
          </div>
        </header>

        {/* Dashboard Content Container (Strict Zero Overflow & Breathing Room) */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full max-w-full mx-auto pb-24 min-w-0 overflow-x-hidden">
          {/* ========================================================
           * TAB 0: DASHBOARD RINGKASAN & OVERVIEW
           * ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 min-w-0">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-blue-100 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> MultiCMS Enterprise Hub
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Ringkasan Sistem & Performa
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                    Pantau tema aktif, status lisensi, audit PageSpeed Google Search Console, dan status database PostgreSQL Supabase secara realtime.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Buka Landing Page</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </a>
                </div>
              </div>

              {/* 4 Cards: Tema Aktif, Status Lisensi, Audit PageSpeed (GSC conditional), Koleksi Tema */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Card 1: Tema Aktif */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Tema Aktif</span>
                      <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <Palette className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="text-lg font-black text-slate-900 capitalize truncate" title={currentIndustry}>
                      {currentIndustry}
                    </div>
                    <div className="text-xs text-blue-600 font-mono font-bold truncate" title={currentThemeId}>
                      ID: {currentThemeId}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('themes')}
                    className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Ganti Tema</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 2: Status Lisensi */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Status Lisensi</span>
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="text-lg font-black text-emerald-600 flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Aktif Terverifikasi</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono truncate">
                      <span>MULTICMS-2026-PRO</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('MULTICMS-2026-PRO', 'Token Lisensi')}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors shrink-0"
                        title="Salin Token Lisensi"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                    Lisensi Enterprise Seumur Hidup
                  </div>
                </div>

                {/* Card 3: Audit PageSpeed (Hanya Muncul jika Terhubung GSC) */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Audit PageSpeed</span>
                      <span className={`p-2 rounded-xl ${
                        Boolean(config?.seo?.gscConnected || config?.seo?.gscVerificationTag)
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                      </span>
                    </div>

                    {Boolean(config?.seo?.gscConnected || config?.seo?.gscVerificationTag) ? (
                      <>
                        <div className="text-lg font-black text-slate-900 flex items-center gap-1 truncate">
                          <span className="text-2xl text-emerald-600 font-black">98</span>
                          <span className="text-xs text-slate-400 font-normal">/100 Core Web Vitals</span>
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold truncate flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>GSC Terhubung • TTFB &lt; 50ms</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-black text-amber-600 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Belum Terhubung GSC</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Audit PageSpeed baru muncul setelah Google Search Console terverifikasi.
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>{Boolean(config?.seo?.gscConnected || config?.seo?.gscVerificationTag) ? 'Cek Analitik SEO' : 'Hubungkan GSC'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 4: Koleksi Tema */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-purple-300 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Koleksi Tema</span>
                      <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                        <Layers className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="text-lg font-black text-slate-900 truncate">
                      50 Varian Desain
                    </div>
                    <div className="text-xs text-purple-600 font-medium truncate">
                      5 Industri Siap Pakai
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('themes')}
                    className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Buka Koleksi Tema</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Navigation Studio Grid */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Pusat Kendali Cepat (Shortcuts)</h3>
                    <p className="text-xs text-slate-500">Akses langsung ke seluruh modul konfigurasi website tanpa reload.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('branding')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <span className="p-2.5 rounded-xl bg-blue-100 text-blue-700 group-hover:scale-105 transition-transform shrink-0">
                      <Globe className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600">Identitas & Judul Situs</div>
                      <div className="text-xs text-slate-500 mt-0.5">Ubah nama app, judul SEO, tagline, hotline, dan kontak.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('themes')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <span className="p-2.5 rounded-xl bg-blue-100 text-blue-700 group-hover:scale-105 transition-transform shrink-0">
                      <Palette className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600">Tema & Bottom Nav</div>
                      <div className="text-xs text-slate-500 mt-0.5">50 pilihan layout tema & 4 gaya navigasi mobile.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('slideshow')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <span className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 group-hover:scale-105 transition-transform shrink-0">
                      <Sliders className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">Hero Slideshow (CRUD)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Kelola banner utama, judul H1, dan CTA link.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform shrink-0">
                      <Package className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">Katalog Produk (CRUD)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Tambah & perbarui harga mobil, menu, atau unit.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('whatsapp')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <span className="p-2.5 rounded-xl bg-teal-100 text-teal-700 group-hover:scale-105 transition-transform shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-teal-600">Floating WhatsApp Studio</div>
                      <div className="text-xs text-slate-500 mt-0.5">Atur nomor CS, pesan sambutan, dan modal chat popup.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800 group-hover:scale-105 transition-transform shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-amber-800">SEO & Google Site Kit</div>
                      <div className="text-xs text-slate-500 mt-0.5">Verifikasi GSC, GA4, Google Ads, dan kata kunci.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('leads')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <span className="p-2.5 rounded-xl bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform shrink-0">
                      <Users className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600">Manajemen Pesanan (CRUD)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Daftar booking masuk dan status konfirmasi pelanggan.</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
           * TAB: IDENTITAS SITUS, APP NAME, TITLE & KONTAK
           * ======================================================== */}
          {activeTab === 'branding' && (
            <SiteIdentityManager
              config={config}
              adminToken={adminToken}
              onConfigUpdated={onConfigUpdated}
              showToast={showToast}
            />
          )}

          {/* ========================================================
           * TAB 1: THEMES SELECTION & NAVIGATION CONFIG
           * ======================================================== */}
          {activeTab === 'themes' && (
            <div className="space-y-6 min-w-0">
              {/* Interactive Bottom Nav Selector Studio (4 Variants + Phone Preview + Direct DB Persistence) */}
              <InteractiveBottomNavSelector
                currentVariant={config?.bottom_nav_variant || bottomNavStyle}
                currentIndustry={currentIndustry}
                currentThemeId={currentThemeId}
                config={config}
                adminToken={adminToken}
                onConfigUpdated={(newCfg) => {
                  if (newCfg.bottomNavStyle) setBottomNavStyle(newCfg.bottomNavStyle);
                  if (onConfigUpdated) onConfigUpdated(newCfg);
                }}
                showToast={showToast}
              />

              {/* Interactive Theme Showcase Studio (Ala WordPress Theme Directory) */}
              <ThemeShowcase
                industries={industryCatalog}
                currentIndustry={currentIndustry}
                currentThemeId={currentThemeId}
                onSwitchTheme={handleSwitchTheme}
                config={config}
                loading={loading}
                showToast={showToast}
              />
            </div>
          )}

          {/* ========================================================
           * TAB: SLIDESHOW & HERO BANNER MANAGER (FULL HERO CRUD)
           * ======================================================== */}
          {activeTab === 'slideshow' && (
            <SlideshowManager
              slides={config?.heroSlides || []}
              adminToken={adminToken}
              onConfigUpdated={(newCfg) => {
                if (onConfigUpdated) onConfigUpdated(newCfg);
              }}
              showToast={showToast}
            />
          )}

          {/* ========================================================
           * TAB 2: PRODUCT & UNIT CATALOG MANAGER (FULL PRODUCT CRUD)
           * ======================================================== */}
          {activeTab === 'products' && (
            <ProductCatalogManager
              items={config?.items || []}
              currentIndustry={currentIndustry}
              adminToken={adminToken}
              onConfigUpdated={(newCfg) => {
                if (onConfigUpdated) onConfigUpdated(newCfg);
              }}
              showToast={showToast}
            />
          )}

          {/* ========================================================
           * TAB: WHATSAPP & FLOATING NAV STUDIO
           * ======================================================== */}
          {activeTab === 'whatsapp' && (
            <WhatsAppStudio
              config={config}
              adminToken={adminToken}
              onConfigUpdated={(newCfg) => {
                if (onConfigUpdated) onConfigUpdated(newCfg);
              }}
              showToast={showToast}
            />
          )}

          {/* ========================================================
           * TAB 3: TECHNICAL SEO & INTERACTIVE PERFORMANCE DASHBOARD
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
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Konfigurasi Dynamic Admin Slug</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ubah URL rute akses portal admin Anda (misal: dari <code className="text-blue-600 font-mono">/admin</code> menjadi <code className="text-blue-600 font-mono">/portal-khusus</code>) untuk mengamankan akses dari bot scanner default.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    URL Slug Admin Aktif
                  </label>
                  <div className="flex items-center min-w-0">
                    <span className="px-3.5 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-2xl text-xs text-slate-500 font-mono shrink-0">
                      https://domain.com/
                    </span>
                    <input
                      type="text"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className="flex-1 px-3.5 py-2.5 rounded-r-2xl border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${window.location.origin}/${newSlug}`, 'URL Admin')}
                      className="ml-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
                      title="Salin URL Admin"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSlug}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Terapkan Slug</span>
                </button>
              </div>

              {/* Box 2: Admin Profile & Credentials Management */}
              <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Manajemen Profil & Kredensial Keamanan</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ubah username, email pemulihan, dan password akun admin.
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
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
                        className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                        Password Baru (Opsional)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          placeholder="Minimal 6 karakter"
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                        <div className="mt-1.5 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-500">Kekuatan:</span>
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
                          className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
                  >
                    {securityLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : securitySaved ? (
                      <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {securityLoading ? 'Menyimpan...' : securitySaved ? 'Tersimpan!' : 'Perbarui Kredensial Admin'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Box 3: Session Revocation ("Logout dari Semua Perangkat") */}
              <div className="bg-white rounded-3xl border border-red-200 p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">Cabut Sesi & Logout dari Semua Perangkat</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gunakan fitur ini jika kredensial Anda dicurigai bocor untuk mereset seluruh sesi login.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleRevokeSessions}
                    className="px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout dari Semua Perangkat</span>
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
