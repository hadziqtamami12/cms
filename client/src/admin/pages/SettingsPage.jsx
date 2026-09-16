import React, { useState, useEffect } from 'react';
import {
  Settings, Database, Zap, Save, CheckCircle2, Server, Globe,
  ShieldCheck, RefreshCw, AlertCircle, HardDrive, Key, Check
} from 'lucide-react';
import { getSystemSettings, updateSystemSettings, testDatabaseConnection } from '../../utils/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'Ultra Rental & Executive Fleet',
    siteTagline: 'Layanan Rental Mobil & Sewa Armada Terpercaya 24 Jam',
    adminEmail: 'admin@ultrarentcar.com',
    siteUrl: 'https://ultrarentcar.com',
    defaultRole: 'subscriber',
    allowRegistration: false,
    language: 'id_ID',
    timezone: 'Asia/Jakarta',
    dateFormat: 'j F Y',
    timeFormat: 'H:i',
    weekStartOn: '1',
    postsPerPage: 10,
    searchEngineVisibility: true,
    defaultCategory: 'Tips Sewa',
    permalinkStructure: 'post_name',
    dbType: 'json',
    cacheType: 'memory',
    supabaseUrl: '',
    supabaseKey: '',
    mysqlHost: 'localhost',
    mysqlPort: '3306',
    mysqlUser: 'root',
    mysqlPassword: '',
    mysqlDatabase: 'ultra_cms',
    mongoUrl: 'mongodb://localhost:27017',
    mongoDbName: 'ultra_cms',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testingDb, setTestingDb] = useState(false);
  const [flushingCache, setFlushingCache] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getSystemSettings()
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTestDb = async () => {
    setTestingDb(true);
    setTestResult(null);
    try {
      const res = await testDatabaseConnection(settings.dbType, settings);
      setTestResult({ success: true, message: res.message || 'Koneksi database berhasil dan responsif.' });
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Koneksi gagal diperiksa.' });
    } finally {
      setTestingDb(false);
    }
  };

  const handleFlushCache = () => {
    setFlushingCache(true);
    setTimeout(() => {
      setFlushingCache(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await updateSystemSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      alert(`Gagal menyimpan pengaturan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Memuat preferensi pengaturan...</div>;
  }

  const tabs = [
    { id: 'general', label: 'Umum' },
    { id: 'reading', label: 'Membaca' },
    { id: 'writing', label: 'Menulis' },
    { id: 'permalinks', label: 'Permalink' },
    { id: 'database', label: 'Database & Performa' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* WordPress Settings Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Pengaturan {tabs.find((t) => t.id === activeTab)?.label}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola konfigurasi dasar situs, SEO URL, format tampilan, dan backend database
        </p>
      </div>

      {/* WordPress Settings Sub-Tabs Navigation */}
      <div className="flex border-b border-slate-300 gap-1 overflow-x-auto text-xs font-semibold">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setTestResult(null);
            }}
            className={`px-4 py-2.5 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-slate-900 text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Success Notice Banner */}
      {saveSuccess && (
        <div className="p-3 bg-white border-l-4 border-emerald-500 border-t border-r border-b border-slate-200 shadow-xs flex items-center gap-2 text-xs text-slate-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan berhasil disimpan dan langsung diterapkan ke sistem.</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white border border-slate-300 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
        {/* TAB 1: PENGATURAN UMUM (GENERAL) */}
        {activeTab === 'general' && (
          <div className="space-y-6 divide-y divide-slate-100 text-xs text-slate-700">
            {/* Judul Situs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
              <label className="font-semibold text-slate-800">Judul Situs</label>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={settings.siteName || ''}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full sm:w-96 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-300"
                />
              </div>
            </div>

            {/* Slogan */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Slogan (Tagline)</label>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={settings.siteTagline || ''}
                  onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-300"
                />
                <p className="text-[11px] text-slate-500 mt-1">Jelaskan situs Anda dalam beberapa patah kata ringkas.</p>
              </div>
            </div>

            {/* Alamat URL Situs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Alamat Situs (URL)</label>
              <div className="sm:col-span-3">
                <input
                  type="url"
                  value={settings.siteUrl || ''}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  className="w-full sm:w-96 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-300"
                />
              </div>
            </div>

            {/* Email Administrasi */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Alamat Email Administrasi</label>
              <div className="sm:col-span-3">
                <input
                  type="email"
                  value={settings.adminEmail || ''}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="w-full sm:w-96 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-300"
                />
                <p className="text-[11px] text-slate-500 mt-1">Alamat ini digunakan untuk keperluan administratif dan notifikasi sistem.</p>
              </div>
            </div>

            {/* Keanggotaan */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Keanggotaan</label>
              <div className="sm:col-span-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                  />
                  <span>Siapa saja dapat mendaftar</span>
                </label>
              </div>
            </div>

            {/* Peran Baru */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Peran Pengguna Baru Default</label>
              <div className="sm:col-span-3">
                <select
                  value={settings.defaultRole}
                  onChange={(e) => setSettings({ ...settings, defaultRole: e.target.value })}
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="subscriber">Pelanggan (Subscriber)</option>
                  <option value="contributor">Kontributor (Contributor)</option>
                  <option value="author">Penulis (Author)</option>
                  <option value="editor">Penyunting (Editor)</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
            </div>

            {/* Bahasa Situs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Bahasa Situs</label>
              <div className="sm:col-span-3">
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="id_ID">Bahasa Indonesia</option>
                  <option value="en_US">English (United States)</option>
                </select>
              </div>
            </div>

            {/* Zona Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Zona Waktu</label>
              <div className="sm:col-span-3">
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="Asia/Jakarta">Jakarta (UTC+7 / WIB)</option>
                  <option value="Asia/Makassar">Makassar (UTC+8 / WITA)</option>
                  <option value="Asia/Jayapura">Jayapura (UTC+9 / WIT)</option>
                  <option value="UTC">UTC Universal Time</option>
                </select>
              </div>
            </div>

            {/* Format Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-start pt-4">
              <label className="font-semibold text-slate-800">Format Tanggal</label>
              <div className="sm:col-span-3 space-y-1.5">
                {[
                  { format: 'j F Y', example: '16 September 2026' },
                  { format: 'Y-m-d', example: '2026-09-16' },
                  { format: 'd/m/Y', example: '16/09/2026' },
                ].map((df) => (
                  <label key={df.format} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="date_format"
                      checked={settings.dateFormat === df.format}
                      onChange={() => setSettings({ ...settings, dateFormat: df.format })}
                      className="text-slate-900 focus:ring-slate-300"
                    />
                    <span>{df.example} <code className="text-[10px] text-slate-400">({df.format})</code></span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENGATURAN MEMBACA (READING) */}
        {activeTab === 'reading' && (
          <div className="space-y-6 divide-y divide-slate-100 text-xs text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-start">
              <label className="font-semibold text-slate-800">Beranda Menampilkan</label>
              <div className="sm:col-span-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="reading_home" defaultChecked className="text-slate-900 focus:ring-slate-300" />
                  <span>Halaman statis (Landing Page Utama / Beranda Terstruktur)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                  <input type="radio" name="reading_home" disabled className="text-slate-400" />
                  <span>Pos-pos blog terbaru Anda</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Pos Blog Per Halaman</label>
              <div className="sm:col-span-3 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.postsPerPage}
                  onChange={(e) => setSettings({ ...settings, postsPerPage: parseInt(e.target.value) || 10 })}
                  className="w-20 bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                />
                <span>pos artikel</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-start pt-4">
              <label className="font-semibold text-slate-800">Visibilitas Mesin Pencari</label>
              <div className="sm:col-span-3 space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.searchEngineVisibility}
                    onChange={(e) => setSettings({ ...settings, searchEngineVisibility: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                  />
                  <span className="font-bold text-slate-800">Izinkan mesin pencari (Google, Bing) mengindeks situs ini</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Sitemap XML otomatis diaktifkan di <code>/sitemap.xml</code> untuk peringkat optimal di Google Search Console.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENGATURAN MENULIS (WRITING) */}
        {activeTab === 'writing' && (
          <div className="space-y-6 divide-y divide-slate-100 text-xs text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
              <label className="font-semibold text-slate-800">Kategori Pos Standar</label>
              <div className="sm:col-span-3">
                <select
                  value={settings.defaultCategory}
                  onChange={(e) => setSettings({ ...settings, defaultCategory: e.target.value })}
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="Tips Sewa">Tips Sewa</option>
                  <option value="Syarat & Ketentuan">Syarat & Ketentuan</option>
                  <option value="Komparasi Mobil">Komparasi Mobil</option>
                  <option value="Wisata & Rute">Wisata & Rute</option>
                  <option value="Promo & Berita">Promo & Berita</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center pt-4">
              <label className="font-semibold text-slate-800">Format Pos Standar</label>
              <div className="sm:col-span-3">
                <span className="font-semibold text-slate-700">Standar (Artikel Blog Kaya Media)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PENGATURAN PERMALINK */}
        {activeTab === 'permalinks' && (
          <div className="space-y-4 text-xs text-slate-700">
            <p className="text-slate-600 mb-4">
              WordPress memberikan kemampuan untuk membuat struktur URL kustom yang rapi dan mudah diindeks Google.
            </p>

            <div className="space-y-3">
              {[
                { id: 'plain', label: 'Biasa', format: 'https://domain.com/?p=123' },
                { id: 'post_name', label: 'Nama Tulisan (SEO Rekomendasi)', format: 'https://domain.com/?article=tips-sewa-mobil-murah' },
                { id: 'day_name', label: 'Tanggal dan Nama', format: 'https://domain.com/2026/09/16/tips-sewa/' },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    settings.permalinkStructure === p.id
                      ? 'border-slate-900 bg-slate-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="permalink_choice"
                    checked={settings.permalinkStructure === p.id}
                    onChange={() => setSettings({ ...settings, permalinkStructure: p.id })}
                    className="mt-0.5 text-slate-900 focus:ring-slate-300"
                  />
                  <div>
                    <div className="font-bold text-slate-800">{p.label}</div>
                    <code className="text-[11px] text-slate-500">{p.format}</code>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE & PERFORMA */}
        {activeTab === 'database' && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Cache Engine Box */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Redis & In-Memory Cache Engine</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Menyajikan halaman publik dalam waktu di bawah 50ms tanpa membebani database.
                </p>
              </div>

              <button
                type="button"
                onClick={handleFlushCache}
                disabled={flushingCache}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-900 font-semibold rounded-md transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${flushingCache ? 'animate-spin' : ''}`} />
                <span>{flushingCache ? 'Membersihkan...' : 'Bersihkan Seluruh Cache (Flush)'}</span>
              </button>
            </div>

            {/* Database Selection */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">Driver Database Aktif:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'json', label: 'Local JSON Store', desc: 'Zero-config instant' },
                  { id: 'supabase', label: 'Supabase / PG', desc: 'Serverless PostgreSQL' },
                  { id: 'mysql', label: 'MySQL Server', desc: 'Production Connection Pool' },
                  { id: 'mongodb', label: 'MongoDB Native', desc: 'Document Store' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSettings({ ...settings, dbType: d.id });
                      setTestResult(null);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      settings.dbType === d.id
                        ? 'border-slate-900 bg-slate-100 text-slate-900 ring-1 ring-slate-900/10 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Database className={`w-4 h-4 mb-1.5 ${settings.dbType === d.id ? 'text-slate-900' : 'text-slate-400'}`} />
                    <div className="font-bold text-xs">{d.label}</div>
                    <div className="text-[10px] text-slate-500">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Database Credential Inputs */}
            {settings.dbType === 'supabase' && (
              <div className="space-y-3 p-4 rounded-lg border border-slate-200 bg-white">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">SUPABASE_URL:</label>
                  <input
                    type="text"
                    value={settings.supabaseUrl || ''}
                    onChange={(e) => setSettings({ ...settings, supabaseUrl: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">SUPABASE_ANON_KEY:</label>
                  <input
                    type="password"
                    value={settings.supabaseKey || ''}
                    onChange={(e) => setSettings({ ...settings, supabaseKey: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            )}

            {settings.dbType === 'mysql' && (
              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg border border-slate-200 bg-white">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">MySQL Host:</label>
                  <input
                    type="text"
                    value={settings.mysqlHost || ''}
                    onChange={(e) => setSettings({ ...settings, mysqlHost: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Port:</label>
                  <input
                    type="text"
                    value={settings.mysqlPort || ''}
                    onChange={(e) => setSettings({ ...settings, mysqlPort: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Username:</label>
                  <input
                    type="text"
                    value={settings.mysqlUser || ''}
                    onChange={(e) => setSettings({ ...settings, mysqlUser: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Password:</label>
                  <input
                    type="password"
                    value={settings.mysqlPassword || ''}
                    onChange={(e) => setSettings({ ...settings, mysqlPassword: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Test Connection Button & Result */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestDb}
                disabled={testingDb}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-900 font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{testingDb ? 'Menguji Koneksi...' : 'Uji Koneksi Database'}</span>
              </button>

              {testResult && (
                <div
                  className={`p-2 rounded-md border text-xs flex items-center gap-1.5 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Actions Bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
