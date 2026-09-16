import React, { useState, useEffect } from 'react';
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
  SearchCheck,
  HelpCircle,
  Command,
  Sliders,
  FileCode,
  Share2,
  ArrowUpRight
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
    label: 'Halaman (Pages)',
    icon: FileText,
    badge: 'Builder',
  },
  {
    id: 'posts',
    label: 'Artikel (Blog)',
    icon: FileCode,
    badge: 'SEO',
  },
  {
    id: 'themes',
    label: 'Pengaturan Tema',
    icon: Palette,
    badge: 'Live Preview',
  },
  {
    id: 'appearance',
    label: 'Header & Navigasi',
    icon: Sliders,
  },
  {
    id: 'seo',
    label: 'SEO & SERP Engine',
    icon: SearchCheck,
    badge: 'Yoast',
  },
  {
    id: 'media',
    label: 'Media Library',
    icon: ImageIcon,
    badge: 'Cloud',
  },
  {
    id: 'import',
    label: 'Impor & Migrasi',
    icon: UploadCloud,
  },
  {
    id: 'settings',
    label: 'Pengaturan Sistem',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Proceed on network failure
    }
    localStorage.removeItem('ultra_admin_token');
    window.location.href = '/admin/login';
  };

  const handleNavClick = (tabId) => {
    if (onNavigate) onNavigate(tabId);
    setMobileDrawerOpen(false);
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('admin-quick-search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentNav = NAV_ITEMS.find((n) => n.id === currentTab) || {
    label: currentTab.charAt(0).toUpperCase() + currentTab.slice(1),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* 1. TOP NAVBAR ADMIN (Enterprise Linear/Vercel Standard) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-14 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left: Mobile Toggle + Brand + Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
            title="Buka Navigasi"
            aria-label="Toggle Navigation"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Identity */}
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('dashboard');
            }}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-indigo-600 transition-colors">
              <Command className="w-4 h-4" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-extrabold text-slate-950 text-sm tracking-tight block">
                Ultra<span className="text-indigo-600">CMS</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                Enterprise Studio
              </span>
            </div>
          </a>

          <div className="h-4 w-[1px] bg-slate-200 hidden md:block mx-1" />

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Admin
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate">{currentNav.label}</span>
          </nav>
        </div>

        {/* Center: Command Palette Quick Search Bar Mockup */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
          <div
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
              searchFocused
                ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/10 shadow-xs'
                : 'bg-slate-100/80 border-slate-200/90 text-slate-500 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              id="admin-quick-search-input"
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu, halaman, fitur..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-white text-[10px] border border-slate-200 text-slate-400 font-mono shadow-xs shrink-0">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right: Actions, Notification, Public Site & User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Action: + Buat Halaman */}
          <button
            onClick={() => handleNavClick('new-page')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Buat Halaman</span>
            <span className="sm:hidden">Baru</span>
          </button>

          {/* Action: Lihat Situs Publik */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 text-slate-700 hover:text-slate-950 hover:bg-slate-100 text-xs font-semibold transition-colors"
            title="Buka Website Publik di Tab Baru"
          >
            <span className="hidden sm:inline">Lihat Situs</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </a>

          {/* Notification Bell */}
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            title="Notifikasi Sistem"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors text-xs text-slate-700"
              aria-label="User Menu"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-500/20">
                A
              </div>
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="font-bold text-slate-900 text-xs">Administrator</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Super Admin</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-xs"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-xs">Super Administrator</div>
                  <div className="text-[11px] text-slate-500 truncate">admin@ultracms.local</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleNavClick('themes')}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Palette className="w-4 h-4 text-slate-400" />
                    <span>Kelola Tema & Hero</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('seo')}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <SearchCheck className="w-4 h-4 text-slate-400" />
                    <span>Yoast SEO Engine</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Pengaturan Sistem</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY SHELL: Sleek Collapsible Sidebar + Canvas Area */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {mobileDrawerOpen && (
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Sidebar Kiri: Modern Deep Slate (#090d16 / bg-slate-950) */}
        <aside
          className={`fixed inset-y-0 left-0 top-14 z-40 w-64 lg:static lg:w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-850 transition-transform duration-200 ${
            mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Main Navigation List */}
          <div className="p-3 flex-grow overflow-y-auto space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigasi Admin
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-indigo-500/80 text-white'
                          : 'bg-slate-900 text-indigo-400 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Profile Switcher & System Status Bar */}
          <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between px-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Node & DB Ready</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">v2.4 Pro</span>
            </div>
          </div>
        </aside>

        {/* 3. MAIN CONTENT CANVAS */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-56px)] bg-slate-50 w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
