import React, { useState, useEffect } from 'react';
import {
  Database, Shield, Key, Sparkles, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, CloudUpload, Zap, Eye, EyeOff, Server, Globe, AlertCircle,
  RefreshCw, Lock, Check, Radio
} from 'lucide-react';
import { fetchSetupEnvStatus, testSetupConnection, initializeSetup } from '../../lib/api';
import { formatLicenseKey, generateClientLicenseKey } from '../../lib/licenseUtils';

/**
 * Enterprise Setup Installer Wizard (/setup atau /install)
 * - Auto-Detection & Smart Pre-fill from .env (Database, Storage, Branding, License)
 * - User-Defined Overrides for Admin Credentials & Dynamic URL Slug
 * - Database Finalization: atomic persistence to app_settings & admin_users
 * - Strict Zero Horizontal Overflow across all resolutions
 */
export const SetupWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [finalRedirectUrl, setFinalRedirectUrl] = useState('');

  // Password visibility & confirmations
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto-detection tracking
  const [envLoaded, setEnvLoaded] = useState(false);
  const [detectedFromEnv, setDetectedFromEnv] = useState({
    databaseUrl: false,
    appName: false,
    appTagline: false,
    licenseKey: false,
    storage: false
  });

  // DB Connection Testing State
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState(null); // { success: boolean, message: string }

  // Step 1: Database & Storage Configuration
  const [dbConfig, setDbConfig] = useState({
    db_type: 'postgres', // 'postgres' | 'mysql' | 'mongodb' | 'sqlite' | 'cloudflare'
    database_url: '',
    db_host: '',
    db_port: '5432',
    db_user: '',
    db_name: '',
    storage_driver: 'local',
    has_storage_keys: false
  });

  // Database Drivers Definition
  const dbDrivers = [
    {
      id: 'postgres',
      name: 'PostgreSQL / Supabase',
      badge: 'Direkomendasikan',
      desc: 'Mendukung Supabase Pooler (port 6543/5432), Neon, RDS, & PostgreSQL Server.',
      defaultPort: '5432',
      placeholder: 'postgresql://postgres.xxx:pass@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'
    },
    {
      id: 'mysql',
      name: 'MySQL / MariaDB',
      badge: 'Native Pool',
      desc: 'Driver mysql2 berkecepatan tinggi dengan auto-reconnect dan pooling.',
      defaultPort: '3306',
      placeholder: 'mysql://root:password@127.0.0.1:3306/cms_db'
    },
    {
      id: 'mongodb',
      name: 'MongoDB Atlas',
      badge: 'Document DB',
      desc: 'Driver mongodb native untuk clustering dokumen multi-region.',
      defaultPort: '27017',
      placeholder: 'mongodb+srv://user:password@cluster0.mongodb.net/cms_db'
    },
    {
      id: 'sqlite',
      name: 'SQLite / Zero-Config',
      badge: 'Standalone',
      desc: 'Berjalan instan di server lokal / file JSON tanpa setup server database eksternal.',
      defaultPort: '',
      placeholder: 'memory://zero-config-standalone'
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare D1 / Hyperdrive',
      badge: 'Edge Cloud',
      desc: 'Koneksi Cloudflare Hyperdrive Postgres & D1 REST Database.',
      defaultPort: '5432',
      placeholder: 'postgres://user:pass@hyperdrive.cloudflare.com/d1_db'
    }
  ];

  // Step 2: Branding & Industry Configuration
  const [brandingConfig, setBrandingConfig] = useState({
    app_name: 'Royal Fleet Premiere',
    app_tagline: 'Sewa Mobil & Armada Premium Terpercaya No. 1',
    default_industry: 'automotive',
    bottom_nav_variant: 'floating_dock'
  });

  // Step 3: Admin Account, Slug & License Configuration
  const [adminConfig, setAdminConfig] = useState({
    admin_slug: 'admin',
    admin_username: '',
    admin_password: '',
    confirm_password: '',
    plan_type: 'trial', // 'trial' | 'custom'
    license_key: ''
  });

  // Industry Options
  const industries = [
    { id: 'automotive', name: 'Rental & Otomotif', icon: '🚗', desc: 'Sewa mobil, motor, armada luxury tour & chauffeur VIP' },
    { id: 'ecommerce', name: 'E-Commerce & Retail', icon: '🛍️', desc: 'Toko online, flash sale katalog & brand official store' },
    { id: 'fnb', name: 'F&B & Kuliner', icon: '☕', desc: 'Resto, kafe, coffee bistro & catering express delivery' },
    { id: 'services', name: 'Jasa Profesional', icon: '💼', desc: 'Konsultan, klinik kecantikan, hukum & corporate services' },
    { id: 'realestate', name: 'Properti & Real Estate', icon: '🏢', desc: 'Perumahan elit, villa, apartemen & ruko komersial' }
  ];

  // Mobile Bottom Nav Options
  const bottomNavStyles = [
    { id: 'floating_dock', label: 'Floating Dock' },
    { id: 'fixed_curved', label: 'Fixed Curved Scoop' },
    { id: 'floating_bubble', label: 'Floating Bubble' },
    { id: 'floating_box', label: 'Modern Box' }
  ];

  // 1. Auto-Fetch Runtime .env Status on Mount
  useEffect(() => {
    document.title = 'Instalasi CMS Enterprise Multi-Industri | Setup Wizard';

    const loadEnvStatus = async () => {
      try {
        const res = await fetchSetupEnvStatus();
        if (res && res.success && res.data) {
          const d = res.data;
          setDbConfig({
            db_type: d.db_type || (d.database_url?.startsWith('mysql') ? 'mysql' : d.database_url?.startsWith('mongodb') ? 'mongodb' : 'postgres'),
            database_url: d.database_url || '',
            db_host: d.db_host || '',
            db_port: d.db_port || (d.db_type === 'mysql' ? '3306' : d.db_type === 'mongodb' ? '27017' : '5432'),
            db_user: d.db_user || '',
            db_name: d.db_name || '',
            storage_driver: d.storage_driver || 'local',
            has_storage_keys: Boolean(d.has_storage_keys)
          });

          setBrandingConfig(prev => ({
            ...prev,
            app_name: d.app_name || prev.app_name,
            app_tagline: d.app_tagline || prev.app_tagline
          }));

          setAdminConfig(prev => ({
            ...prev,
            admin_slug: d.default_admin_slug || prev.admin_slug,
            admin_username: d.default_admin_user || '',
            license_key: d.license_key || '',
            plan_type: d.license_key ? 'custom' : 'trial'
          }));

          setDetectedFromEnv({
            databaseUrl: Boolean(d.database_url),
            appName: Boolean(d.app_name),
            appTagline: Boolean(d.app_tagline),
            licenseKey: Boolean(d.license_key),
            storage: Boolean(d.has_storage_keys)
          });
        }
      } catch (err) {
        console.warn('[SetupWizard] Failed to auto-fetch env status:', err.message);
      } finally {
        setEnvLoaded(true);
      }
    };

    loadEnvStatus();
  }, []);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Kosong', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Lemah', color: 'bg-red-500', text: 'text-red-600' };
    if (score <= 3) return { score: 2, label: 'Sedang', color: 'bg-amber-500', text: 'text-amber-600' };
    return { score: 3, label: 'Kuat & Aman', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const passwordStrength = getPasswordStrength(adminConfig.admin_password);

  // Test Database Connection Action
  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    setErrorMessage('');

    try {
      const res = await testSetupConnection({
        db_type: dbConfig.db_type,
        database_url: dbConfig.database_url,
        host: dbConfig.db_host,
        port: dbConfig.db_port,
        user: dbConfig.db_user,
        database: dbConfig.db_name
      });

      if (res && res.success) {
        setDbTestResult({
          success: true,
          message: res.message || `Koneksi ke database ${dbConfig.db_type.toUpperCase()} berhasil!`
        });
      } else {
        setDbTestResult({
          success: false,
          message: res?.error || 'Gagal menghubungi database. Pastikan connection string benar.'
        });
      }
    } catch (err) {
      setDbTestResult({
        success: false,
        message: err.message || 'Koneksi jaringan database terputus.'
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  // Step 1 Validation
  const handleProceedStep1 = () => {
    if (dbConfig.db_type !== 'sqlite' && dbConfig.db_type !== 'static' && !dbConfig.database_url.trim()) {
      setErrorMessage('URL koneksi basis data (DATABASE_URL) tidak boleh kosong.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleProceedStep2 = () => {
    if (!brandingConfig.app_name.trim()) {
      setErrorMessage('Nama aplikasi / bisnis wajib diisi.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(3);
  };

  // Step 3 Validation & Finalization (POST /api/setup/initialize)
  const handleFinalizeSetup = async () => {
    // 1. Validation
    const cleanSlug = adminConfig.admin_slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanUser = adminConfig.admin_username.trim();
    const cleanPass = adminConfig.admin_password.trim();
    const confirmPass = adminConfig.confirm_password.trim();

    if (!cleanSlug) {
      setErrorMessage('Dynamic Admin Slug wajib diisi.');
      return;
    }
    if (!cleanUser || cleanUser.length < 3) {
      setErrorMessage('Username admin wajib diisi minimal 3 karakter.');
      return;
    }
    if (!cleanPass || cleanPass.length < 5) {
      setErrorMessage('Password admin wajib diisi minimal 5 karakter demi keamanan.');
      return;
    }
    if (cleanPass !== confirmPass) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }
    if (adminConfig.plan_type === 'custom' && (!adminConfig.license_key || adminConfig.license_key.length < 19)) {
      setErrorMessage('Format lisensi tidak valid (Wajib 16 karakter: XXXX-XXXX-XXXX-XXXX) atau pilih Trial 30 Hari.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const payload = {
      database_url: dbConfig.database_url,
      app_name: brandingConfig.app_name,
      app_tagline: brandingConfig.app_tagline,
      admin_slug: cleanSlug,
      admin_username: cleanUser,
      admin_password: cleanPass,
      license_key: adminConfig.plan_type === 'custom' ? adminConfig.license_key : '',
      default_industry: brandingConfig.default_industry
    };

    try {
      const res = await initializeSetup(payload);

      if (res && res.success) {
        const targetUrl = res.data?.redirectUrl || '/';
        setFinalRedirectUrl(targetUrl);
        setSuccessAnimation(true);

        // Save local setup state synchronously for immediate client-side ground truth
        try {
          const clientSetupState = {
            isInstalled: true,
            adminSlug: cleanSlug,
            adminUser: cleanUser,
            adminPassword: cleanPass,
            appName: brandingConfig.app_name,
            appTagline: brandingConfig.app_tagline,
            selectedIndustry: brandingConfig.default_industry,
            licenseKey: res.data?.licenseKey || adminConfig.license_key || 'TRIAL-PREACTIVE-2026',
            installedAt: new Date().toISOString()
          };
          localStorage.setItem('cms_setup_state', JSON.stringify(clientSetupState));
          localStorage.setItem('cms_active_theme_config', JSON.stringify({
            brandName: brandingConfig.app_name,
            tagline: brandingConfig.app_tagline,
            industry: brandingConfig.default_industry,
            bottom_nav_variant: brandingConfig.bottom_nav_variant,
            adminSlug: cleanSlug,
            is_installed: true
          }));
        } catch {}

        setTimeout(() => {
          if (onComplete) {
            onComplete(res);
          } else {
            window.location.href = targetUrl;
          }
        }, 1800);
      } else {
        setErrorMessage(res?.error || 'Gagal menginisialisasi sistem ke database.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menghubungi server untuk inisialisasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden min-w-0 bg-surface-warm flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full min-w-0">
        
        {/* Main Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-600/30 mb-3.5 transform hover:scale-105 transition-transform">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Setup Installer Wizard
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Inisialisasi sistem Web PWA Landing Page Generator & CMS Multi-Industri dengan integrasi database instan.
          </p>
        </div>

        {/* 3-Step Interactive Stepper Indicator */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 mb-6 shadow-xs w-full max-w-full">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {[
              { num: 1, label: 'Koneksi Database', sub: 'Postgres & Storage', icon: Database },
              { num: 2, label: 'Identitas & Industri', sub: 'Branding Bisnis', icon: Globe },
              { num: 3, label: 'Admin & Keamanan', sub: 'Slug & Kredensial', icon: Shield },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100 scale-105'
                        : isPast
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs sm:text-sm mt-2 font-bold transition-colors ${
                    isActive ? 'text-blue-600' : isPast ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                  <span className="hidden sm:block text-[11px] text-slate-400 font-medium">
                    {step.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Form Container with Zero Horizontal Overflow */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-elevated p-6 sm:p-10 w-full max-w-full overflow-x-hidden min-w-0">
          
          {/* ========================================================
           * LANGKAH 1: KONEKSI BASIS DATA & STORAGE
           * ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 w-full max-w-full">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <span>Langkah 1: Pilih Driver & Konfigurasi Basis Data</span>
                  </h2>
                  {detectedFromEnv.databaseUrl && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Terdeteksi dari .env
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Pilih driver basis data yang Anda gunakan dan sistem otomatis mengisi konfigurasi dari file lingkungan (.env).
                </p>
              </div>

              {/* Driver Database Selector Cards */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Pilih Jenis Database Engine:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dbDrivers.map((driver) => {
                    const isSelected = dbConfig.db_type === driver.id;
                    return (
                      <button
                        key={driver.id}
                        type="button"
                        onClick={() => {
                          setDbConfig(prev => ({
                            ...prev,
                            db_type: driver.id,
                            db_port: driver.defaultPort || prev.db_port
                          }));
                          setDbTestResult(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-full ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                              {driver.name}
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {driver.desc}
                          </p>
                        </div>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                          isSelected ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {driver.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discrete Fields or Full Connection String */}
              {dbConfig.db_type !== 'sqlite' && dbConfig.db_type !== 'static' && (
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Connection String / URI:
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Bisa diedit langsung</span>
                    </div>
                    <input
                      type="text"
                      value={dbConfig.database_url}
                      onChange={(e) => {
                        setDbConfig({ ...dbConfig, database_url: e.target.value });
                        setDbTestResult(null);
                      }}
                      placeholder={dbDrivers.find(d => d.id === dbConfig.db_type)?.placeholder || 'URI database...'}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-slate-800 text-xs sm:text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
                      required
                    />
                  </div>

                  {/* Discrete Host / Port / User indicators if available */}
                  {(dbConfig.db_host || dbConfig.db_name) && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Host</span>
                        <span className="font-mono text-slate-700 truncate block">{dbConfig.db_host || 'localhost'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Port</span>
                        <span className="font-mono text-slate-700 truncate block">{dbConfig.db_port || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">User</span>
                        <span className="font-mono text-slate-700 truncate block">{dbConfig.db_user || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Database</span>
                        <span className="font-mono text-slate-700 truncate block">{dbConfig.db_name || '-'}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Standalone Zero-Config Notice */}
              {(dbConfig.db_type === 'sqlite' || dbConfig.db_type === 'static') && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                  <span className="font-bold block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Mode Zero-Config Siap Tanpa Database Eksternal
                  </span>
                  <p className="text-emerald-700 leading-relaxed text-[11px]">
                    Sistem akan menggunakan memori dan file lokal secara otomatis. Anda tidak perlu mengkonfigurasi server database tambahan.
                  </p>
                </div>
              )}

              {/* Tombol Interaktif: Uji Koneksi Basis Data */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                      Verifikasi Keterjangkauan Driver:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Uji koneksi ke host database sebelum pembuatan tabel dan inisialisasi.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestDatabase}
                    disabled={isTestingDb || (dbConfig.db_type !== 'sqlite' && dbConfig.db_type !== 'static' && !dbConfig.database_url.trim())}
                    className="h-11 px-5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isTestingDb ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Menguji Host...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>Uji Koneksi Basis Data</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Hasil Uji Koneksi */}
                {dbTestResult && (
                  <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fadeIn ${
                    dbTestResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {dbTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span className="leading-snug">{dbTestResult.message}</span>
                  </div>
                )}
              </div>

              {/* Status Storage CDN */}
              <div className="pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <CloudUpload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Penyimpanan Media & Aset:</span>
                      <span className="text-[11px] text-slate-500">
                        {dbConfig.has_storage_keys ? 'Terhubung via Supabase Storage / Cloudflare R2' : 'Driver Lokal Siap Pakai'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    dbConfig.has_storage_keys ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {dbConfig.has_storage_keys ? 'Siap CDN' : 'Default Ready'}
                  </span>
                </div>
              </div>

              {/* Navigasi Step 1 */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleProceedStep1}
                  className="h-12 px-7 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <span>Lanjutkan ke Identitas Bisnis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
           * LANGKAH 2: BRANDING & KATEGORI INDUSTRI AWAL
           * ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 w-full max-w-full">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>Langkah 2: Identitas Bisnis & Kategori Industri</span>
                  </h2>
                  {detectedFromEnv.appName && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Nama Terisi dari .env
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tentukan nama aplikasi/bisnis dan pilih template industri pertama yang ingin langsung aktif.
                </p>
              </div>

              {/* Form Input Branding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Nama Bisnis / Judul Aplikasi:
                  </label>
                  <input
                    type="text"
                    value={brandingConfig.app_name}
                    onChange={(e) => setBrandingConfig({ ...brandingConfig, app_name: e.target.value })}
                    placeholder="Royal Fleet Premiere"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Tagline / Slogan Bisnis:
                  </label>
                  <input
                    type="text"
                    value={brandingConfig.app_tagline}
                    onChange={(e) => setBrandingConfig({ ...brandingConfig, app_tagline: e.target.value })}
                    placeholder="Sewa Mobil Mewah & Armada Bisnis Terpercaya"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pilihan Radio Kartu Industri */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Pilih Kategori Industri Awal:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {industries.map((ind) => {
                    const isSelected = brandingConfig.default_industry === ind.id;
                    return (
                      <div
                        key={ind.id}
                        onClick={() => setBrandingConfig({ ...brandingConfig, default_industry: ind.id })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/30 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-white shadow-xs border border-slate-100">
                          {ind.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 block truncate">
                              {ind.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 leading-tight block mt-0.5 line-clamp-2">
                            {ind.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pilihan Gaya Bottom Nav */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Gaya Mobile Bottom Navigation Bar:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {bottomNavStyles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setBrandingConfig({ ...brandingConfig, bottom_nav_variant: style.id })}
                      className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all ${
                        brandingConfig.bottom_nav_variant === style.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigasi Step 2 */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="h-12 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedStep2}
                  className="h-12 px-7 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <span>Lanjutkan ke Akun Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
           * LANGKAH 3: AKUN ADMINISTRATOR, SLUG & LISENSI
           * ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 w-full max-w-full">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Langkah 3: Akun Administrator & Kustomisasi Akses</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Atur URL portal login admin, username, dan kata sandi baru. Kredensial ini akan langsung disimpan ke database dengan enkripsi Bcrypt.
                </p>
              </div>

              {/* Dynamic Admin Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    URL Portal Admin Khusus (Dynamic Admin Slug):
                  </label>
                  <span className="text-[11px] text-blue-600 font-mono font-bold">
                    /{adminConfig.admin_slug || 'admin'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-2xl text-slate-500 text-xs sm:text-sm font-mono shrink-0 select-none">
                    https://domain.com/
                  </span>
                  <input
                    type="text"
                    value={adminConfig.admin_slug}
                    onChange={(e) => setAdminConfig({
                      ...adminConfig,
                      admin_slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                    })}
                    placeholder="admin"
                    className="flex-1 px-4 py-3 rounded-r-2xl border border-slate-300 text-slate-800 text-xs sm:text-sm font-mono font-black focus:ring-2 focus:ring-blue-600 focus:outline-hidden min-w-0"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Ganti <code className="text-blue-600 font-bold">admin</code> dengan rute tersembunyi seperti <code className="text-blue-600 font-bold">panel-utama</code>, <code className="text-blue-600 font-bold">sys-portal</code>, atau <code className="text-blue-600 font-bold">cms-secure</code> untuk mengamankan portal dari bot crawler.
                </p>
              </div>

              {/* Kredensial Administrator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Username Superadmin:
                  </label>
                  <input
                    type="text"
                    value={adminConfig.admin_username}
                    onChange={(e) => setAdminConfig({ ...adminConfig, admin_username: e.target.value })}
                    placeholder="Contoh: superadmin"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Password Baru */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Password Superadmin Baru:
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminConfig.admin_password}
                      onChange={(e) => setAdminConfig({ ...adminConfig, admin_password: e.target.value })}
                      placeholder="Minimal 5 karakter"
                      className="w-full pl-4 pr-11 py-3 rounded-2xl border border-slate-300 text-slate-800 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg focus:outline-hidden transition-colors"
                      title={showAdminPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {adminConfig.admin_password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Kekuatan Sandi:</span>
                        <span className={`font-bold ${passwordStrength.text}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Konfirmasi Password:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={adminConfig.confirm_password}
                    onChange={(e) => setAdminConfig({ ...adminConfig, confirm_password: e.target.value })}
                    placeholder="Ketik ulang password baru Anda"
                    className="w-full pl-4 pr-11 py-3 rounded-2xl border border-slate-300 text-slate-800 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg focus:outline-hidden transition-colors"
                    title={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {adminConfig.confirm_password && adminConfig.admin_password !== adminConfig.confirm_password && (
                  <span className="text-[11px] text-red-600 font-semibold block mt-1">
                    Password konfirmasi tidak cocok.
                  </span>
                )}
              </div>

              {/* Opsi Lisensi */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Aktivasi Lisensi Sistem:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setAdminConfig({ ...adminConfig, plan_type: 'trial' })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      adminConfig.plan_type === 'trial'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">Trial Gratis 30 Hari</span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Aktif instan tanpa perlu kode serial lisensi.
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setAdminConfig({ ...adminConfig, plan_type: 'custom' })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      adminConfig.plan_type === 'custom'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Key className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">Lisensi Enterprise Resmi</span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Masukkan kunci 16-karakter resmi.
                      </span>
                    </div>
                  </div>
                </div>

                {adminConfig.plan_type === 'custom' && (
                  <div>
                    <input
                      type="text"
                      value={adminConfig.license_key}
                      onChange={(e) => setAdminConfig({
                        ...adminConfig,
                        license_key: formatLicenseKey(e.target.value)
                      })}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-slate-800 text-sm font-mono tracking-widest uppercase font-bold text-center focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                )}
              </div>

              {/* Navigasi Step 3 & Eksekusi Finalisasi */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={isSubmitting}
                  className="h-12 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalizeSetup}
                  disabled={isSubmitting}
                  className="h-12 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Selesaikan & Pasang Sistem</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Modal Animation Overlay */}
        {successAnimation && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Instalasi Berhasil Diselesaikan!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tabel database telah diinisialisasi, akun superadmin berhasil disimpan, dan lisensi Anda telah aktif. Mengalihkan ke URL portal admin...
              </p>
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-mono font-bold">
                {finalRedirectUrl}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Membuka Portal Admin...</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-3">
          <span>Enterprise MultiCMS Setup</span>
          <span>•</span>
          <a
            href="/keygen"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Halaman Generator Lisensi (/keygen) ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
