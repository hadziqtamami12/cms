import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Settings,
  Plus,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
  Search,
  Bell,
  CheckCircle2,
  FolderOpen,
  Layers,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';
import { logoutAdmin } from '../utils/api';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'pages',
    label: 'Pages (Halaman)',
    icon: FileText,
    badge: 'Builder',
  },
  {
    id: 'media',
    label: 'Media Library',
    icon: ImageIcon,
    badge: 'R2/S3',
  },
  {
    id: 'builder',
    label: 'Visual Builder',
    icon: Sparkles,
  },
  {
    id: 'themes',
    label: 'Tampilan (Themes)',
    icon: Palette,
  },
  {
    id: 'settings',
    label: 'Pengaturan (Settings)',
    icon: Settings,
  },
];

export default function AdminLayout({
  currentTab = 'dashboard',
  onNavigate,
  children,
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Proceed even if network error
    }
    localStorage.removeItem('ultra_admin_token');
    window.location.href = '/admin/login';
  };

  const handleNavClick = (tabId) => {
    onNavigate(tabId);
    setMobileDrawerOpen(false);
  };

  // Human friendly tab labels for breadcrumb
  const currentNav = NAV_ITEMS.find((n) => n.id === currentTab) || {
    label: currentTab.charAt(0).toUpperCase() + currentTab.slice(1),
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Bar: WordPress Modern Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-14 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left: Mobile Drawer Trigger + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden p-1.5 hover:bg-slate-100 text-slate-600 rounded-md transition-colors"
            title="Buka Navigasi"
            aria-label="Toggle Navigation"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* WP Modern Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs shadow-xs tracking-tight">
              W
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight hidden sm:inline">
              Ultra<span className="text-indigo-600">CMS</span>
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block mx-1" />

          {/* Breadcrumb Navigation */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Admin
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">{currentNav.label}</span>
          </nav>
        </div>

        {/* Right: Quick Action Button + Site Preview + User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Quick Action: + Buat Halaman Baru */}
          <button
            onClick={() => handleNavClick('new-page')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Buat Halaman Baru</span>
            <span className="sm:hidden">Baru</span>
          </button>

          {/* Visit Live Website */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors"
            title="Kunjungi Website Publik"
          >
            <span>Lihat Situs</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block mx-1" />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-xs text-slate-700"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-500/20">
                A
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="font-semibold text-slate-900 text-xs">Admin</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Administrator</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-xs"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-xs">Super Administrator</div>
                  <div className="text-[11px] text-slate-500 truncate">admin@ultracms.local</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Pengaturan Sistem</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('media')}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-slate-400" />
                    <span>Cloud Object Storage</span>
                  </button>
                </div>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Layout Body: Slim Deep Slate Sidebar + Clean Slate Canvas */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Mobile Backdrop */}
        {mobileDrawerOpen && (
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Sidebar Ramping Kiri: Deep Slate (#0f172a) dengan Aksen Indigo (#6366f1) */}
        <aside
          className={`fixed inset-y-0 left-0 top-14 z-40 w-64 md:static md:w-60 bg-[#0f172a] text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800 transition-transform duration-200 ${
            mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Main Navigation Items */}
          <div className="p-3 flex-grow overflow-y-auto space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-indigo-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between px-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Serverless Active
              </span>
              <span className="text-slate-400 font-mono text-[10px]">v2.0</span>
            </div>
          </div>
        </aside>

        {/* 3. Main Content Area: Background Neutral Slate (#f8fafc) + Content Card */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-56px)] bg-[#f8fafc] w-full">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
