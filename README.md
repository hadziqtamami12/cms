# Ultra-Performance Headless CMS & Landing Page Engine

Arsitektur produksi lengkap Headless Modular CMS & Landing Page Builder dengan React.js + Express.js Serverless di Vercel, dioptimasi khusus untuk **Skor Google Lighthouse 100** dan **Core Web Vitals (LCP < 1.2s, INP < 50ms, CLS = 0)**.

---

## Fitur Utama

1. **Decoupled Architecture**:
   - Bundle frontend publik sepenuhnya terpisah dari library editor/admin.
   - Frontend publik hanya memuat modul yang dibutuhkan halaman secara dinamis via `React.lazy`.
2. **Zero CLS 1:1 Pixel-Match Skeleton**:
   - Seluruh blok (Hero, Katalog Armada, Topbar, Navigasi Kurva) memiliki skeleton loader berdimensi geometris identik persis dengan konten asli.
   - Cumulative Layout Shift (CLS) = 0.000.
3. **Dynamic Database Abstraction (`api/lib/db-factory.js`)**:
   - Dynamic lazy loading driver: Cold start < 150ms di Vercel serverless.
   - Mendukung JSON file fallback, Supabase/PostgreSQL, MySQL, dan MongoDB.
4. **Cache-Aside Layer (`api/lib/cache-provider.js`)**:
   - Upstash Redis REST (0ms TCP cold start) / ioredis / Memory Cache.
   - Response time halaman publik < 50ms dengan auto-invalidation saat publikasi.
5. **Interactive Core Web Vitals Components**:
   - `HeroSlider.jsx`: Preload slide 1 prioritas tinggi (`fetchpriority="high"`), touch swipe, autoplay.
   - `DynamicTopbar.jsx`: Transisi transparan ke frosted glass berdasarkan scroll.
   - `CurvedBottomNav.jsx`: Siluet kurva SVG, auto-hide di area hero, dan smart scroll velocity detector.
6. **10 Preset Multi-Niche**:
   - Rental Mobil & Otomotif (Default), E-commerce, Corporate Agency, F&B, SaaS, Property, Wedding, Healthcare, Travel, dan Portfolio.
7. **Direct JSON Importer & WordPress 6.x Visual Builder**:
   - Endpoint `/api/import` menerima payload JSON Block Tree langsung dari scraper / sistem eksternal.

---

## Menjalankan Secara Lokal

### 1. Jalankan Backend Serverless (Express)
```bash
cd api
npm install
npm run dev
# Server berjalan di http://localhost:5000
```

### 2. Jalankan Frontend Client (Vite)
```bash
cd client
npm install
npm run dev
# Akses di http://localhost:5173
```

---

## Struktur Rute URL

- `/`: Halaman Landing Page Publik (Default: Rental Mobil)
- `/?page=:slug`: Halaman Landing Page Publik berdasarkan slug
- `/setup`: Setup Wizard koneksi database dan kredensial admin
- `/admin/login`: Login portal admin CMS
- `/admin`: Dashboard manajemen halaman, visual builder, dan JSON importer
- `/api/sitemap.xml`: Sitemap XML dinamis untuk Google Search Console
- `/api/robots.txt`: File robots.txt dinamis
- `/api/import`: REST endpoint pengimpor JSON Block Tree
