import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import SetupPage from './pages/SetupPage';
import LockoutPage from './pages/LockoutPage';
import ProgrammerPortalPage from './pages/ProgrammerPortalPage';
import LandingPageSkeleton from './components/common/LandingPageSkeleton';
import SplashScreen from './components/common/SplashScreen';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import { adminLogin } from './lib/api';
import { ShieldCheck, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export const App = () => {
  const {
    config,
    loading,
    adminToken,
    adminSlug,
    setAdminSlug,
    licenseStatus,
    setLicenseStatus,
    updateConfigLocally,
    handleAdminLogin,
    handleAdminLogout,
    reloadConfig
  } = useApp();

  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [loginUser, setLoginUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cms_setup_state') || '{}');
      return saved.adminUser || 'admin';
    } catch {
      return 'admin';
    }
  });
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  // Route Guard: Pengecekan Akses Installer vs Landing Page
  const isInstalled = Boolean(licenseStatus?.isInstalled);
  const isInstallerRoute = currentPath === '/install' || currentPath === '/setup';

  // 1. Loading State Handler (Splash Screen or Shimmer Skeleton)
  if (loading) {
    const cleanPath = currentPath.replace(/^\/+|\/+$/g, '');
    const activeSlug = (adminSlug || 'admin').replace(/^\/+|\/+$/g, '');
    const isAdminRoute = cleanPath === activeSlug || cleanPath.startsWith(`${activeSlug}/`);

    // If splash screen is active and on public landing page
    if (!isAdminRoute && !isInstallerRoute && config.splash_screen?.enabled !== false && !splashFinished) {
      return (
        <SplashScreen
          brandName={config.brandName || 'Royal Fleet Premiere'}
          tagline={config.tagline || 'Sewa Mobil & Armada Terpercaya'}
          duration={config.splash_screen?.duration || 1.2}
          onFinish={() => setSplashFinished(true)}
        />
      );
    }

    // High-fidelity Shimmer Landing Page Skeleton while fetching data
    if (!isAdminRoute && !isInstallerRoute && currentPath !== '/keygen' && currentPath !== '/secret-keygen') {
      return <LandingPageSkeleton />;
    }

    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-wider">Memuat CMS Engine...</span>
        </div>
      </div>
    );
  }

  // 2. Secret Programmer Keygen Portal Route
  if (currentPath === '/keygen' || currentPath === '/secret-keygen') {
    return <ProgrammerPortalPage />;
  }

  // 3. Installation Route Guard Logic
  // A. Jika sistem SUDAH TERINSTAL tapi mencoba buka /install atau /setup:
  // Arahkan kembali ke root (/)
  if (isInstalled && isInstallerRoute) {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
    setCurrentPath('/');
  }

  // B. Hanya render SetupPage jika pengguna SECARA EKSPLISIT mengakses rute /install atau /setup saat belum terinstal
  if (isInstallerRoute && !isInstalled) {
    return (
      <SetupPage
        onComplete={(res) => {
          setLicenseStatus(prev => ({ ...prev, isInstalled: true, isLocked: false, status: 'active' }));
          const slug = res?.data?.adminSlug || res?.adminSlug || adminSlug || 'admin';
          if (setAdminSlug) setAdminSlug(slug);
          navigate('/');
        }}
      />
    );
  }


  // 3. Subscription Hold / Token Lockout State
  if (currentPath === '/subscription-hold' || (licenseStatus && licenseStatus.isLocked)) {
    return (
      <LockoutPage
        onRenewSuccess={() => {
          reloadConfig();
          navigate('/');
        }}
      />
    );
  }

  // 4. Dynamic Admin Route (e.g. /admin, /sys-portal, /cms-panel)
  const cleanPath = currentPath.replace(/^\/+|\/+$/g, '');
  const activeSlug = (adminSlug || 'admin').replace(/^\/+|\/+$/g, '');

  if (cleanPath === activeSlug || cleanPath.startsWith(`${activeSlug}/`)) {
    // Keep URL in address bar strictly /${activeSlug} (e.g. /admin)
    if (typeof window !== 'undefined' && (currentPath !== `/${activeSlug}` || window.location.search || window.location.hash)) {
      window.history.replaceState(null, '', `/${activeSlug}`);
    }

    // If not authenticated, render Clean Admin Login form
    if (!adminToken) {
      const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
          const res = await adminLogin(loginUser, loginPass);
          if (res.success && res.token) {
            handleAdminLogin(res.token, res.adminSlug);
          } else {
            setLoginError(res.error || 'Username atau password salah.');
          }
        } catch (err) {
          setLoginError('Gagal terhubung ke server autentikasi.');
        } finally {
          setLoginLoading(false);
        }
      };

      return (
        <div className="min-h-screen bg-surface-warm flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal Login</h2>
              <p className="text-xs text-slate-500 mt-1 font-mono">Dynamic Route: /{activeSlug}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-8">
              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Masukkan password admin"
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg focus:outline-none transition-colors"
                      title={showLoginPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Masuk Panel Admin</span>
                </button>

                <p className="text-[11px] text-slate-500 text-center pt-2 leading-relaxed">
                  💡 Kredensial default: <code className="text-blue-600 font-mono font-bold bg-blue-50 px-1 py-0.5 rounded">admin</code> / <code className="text-blue-600 font-mono font-bold bg-blue-50 px-1 py-0.5 rounded">admin123</code> (atau kredensial yang dibuat saat instalasi).
                </p>
              </form>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminDashboard
        config={config}
        adminToken={adminToken}
        adminSlug={adminSlug}
        onLogout={handleAdminLogout}
        onConfigUpdated={(newCfg) => updateConfigLocally(newCfg)}
      />
    );
  }

  // 5. Public Articles & SEO Blog Routes
  if (currentPath === '/artikel' || currentPath === '/artikel/') {
    return <ArticlesPage />;
  }
  if (currentPath.startsWith('/artikel/')) {
    const slug = currentPath.replace(/^\/artikel\/?/, '').replace(/\/$/, '');
    return <ArticleDetailPage slug={slug} />;
  }

  // 6. Default Public Landing Page
  return (
    <>
      {config.splash_screen?.enabled !== false && !splashFinished && (
        <SplashScreen
          brandName={config.brandName || 'Royal Fleet Premiere'}
          tagline={config.tagline || 'Sewa Mobil & Armada Terpercaya'}
          duration={config.splash_screen?.duration || 1.2}
          onFinish={() => setSplashFinished(true)}
        />
      )}
      <LandingPage config={config} />
    </>
  );
};

export default App;
