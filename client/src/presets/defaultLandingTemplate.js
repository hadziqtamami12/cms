/**
 * Default Landing Page Starter Template
 * Engineered for GrapesJS & Headless Fast Renderer
 * Guaranteed bug-proof, zero-crash, with beautiful Elementor Pro modern industrial design.
 */

export const defaultLandingTemplate = {
  id: 'page_default_landing',
  slug: 'home',
  title: 'Ultra Launch - Modern High-Converting Landing Page',
  status: 'published',
  metaTitle: 'Ultra Launch | Platform CMS & Visual Web Builder Tercepat',
  metaDescription: 'Bangun landing page performa tinggi dengan drag-and-drop visual builder secepat kilat, siap SEO, dan terintegrasi Cloud Object Storage.',
  seo: {
    metaTitle: 'Ultra Launch | Platform CMS & Visual Web Builder Tercepat',
    metaDescription: 'Bangun landing page performa tinggi dengan drag-and-drop visual builder secepat kilat, siap SEO, dan terintegrasi Cloud Object Storage.',
    ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    canonical: 'https://example.com/',
  },
  projectData: {
    assets: [],
    pages: [
      {
        id: 'page-home',
        name: 'Home',
        component: {
          type: 'wrapper',
          stylable: ['background', 'background-color', 'background-image', 'background-size', 'background-position'],
          components: [
            {
              type: 'hero-section',
              classes: ['hero-section'],
            },
            {
              type: 'social-proof-section',
              classes: ['social-proof-section'],
            },
            {
              type: 'features-section',
              classes: ['features-section'],
            },
            {
              type: 'video-section',
              classes: ['video-section'],
            },
            {
              type: 'cta-section',
              classes: ['cta-section'],
            }
          ]
        }
      }
    ]
  },
  css: `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    /* Hero Section */
    .hero-section {
      padding: 96px 20px 80px;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
      text-align: center;
      border-bottom: 1px solid #f1f5f9;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 9999px;
      background-color: #eef2ff;
      color: #4f46e5;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
      border: 1px solid #e0e7ff;
    }
    .hero-headline {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.15;
      color: #0f172a;
      max-width: 860px;
      margin: 0 auto 20px;
      letter-spacing: -0.02em;
    }
    .hero-subheadline {
      font-size: 19px;
      color: #475569;
      max-width: 680px;
      margin: 0 auto 36px;
      line-height: 1.6;
    }
    .hero-cta-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 14px;
      margin-bottom: 48px;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
      background-color: #4f46e5;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.35);
    }
    .btn-primary:hover {
      background-color: #4338ca;
      transform: translateY(-1px);
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 600;
      color: #334155;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }
    .hero-mockup-wrapper {
      max-width: 1040px;
      margin: 0 auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
      border: 1px solid #e2e8f0;
      background: #0f172a;
    }
    .hero-mockup-img {
      width: 100%;
      height: auto;
      display: block;
    }
    /* Social Proof Section */
    .social-proof-section {
      padding: 48px 20px;
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
      text-align: center;
    }
    .social-proof-title {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .social-proof-logos {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 36px;
      opacity: 0.7;
    }
    .social-logo-item {
      font-weight: 700;
      font-size: 18px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    /* Features Section */
    .features-section {
      padding: 88px 20px;
      background-color: #f8fafc;
    }
    .section-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 56px;
    }
    .section-tag {
      font-size: 13px;
      font-weight: 700;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 34px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }
    .section-desc {
      font-size: 16px;
      color: #64748b;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 28px;
      max-width: 1160px;
      margin: 0 auto;
    }
    .feature-card {
      background: #ffffff;
      padding: 32px 28px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.08);
    }
    .feature-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background-color: #eef2ff;
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 20px;
    }
    .feature-card h3 {
      font-size: 19px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 10px;
    }
    .feature-card p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      line-height: 1.6;
    }
    /* Video Section */
    .video-section {
      padding: 88px 20px;
      background-color: #ffffff;
      text-align: center;
    }
    .video-container {
      max-width: 900px;
      margin: 0 auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12);
      border: 1px solid #e2e8f0;
      aspect-ratio: 16 / 9;
      background-color: #000;
    }
    .video-container iframe,
    .video-container video {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
    /* CTA Section */
    .cta-section {
      padding: 88px 20px;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #ffffff;
      text-align: center;
    }
    .cta-content {
      max-width: 680px;
      margin: 0 auto;
    }
    .cta-headline {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 18px;
      color: #ffffff;
    }
    .cta-subtext {
      font-size: 17px;
      color: #cbd5e1;
      margin-bottom: 36px;
      line-height: 1.6;
    }
    .cta-form {
      display: flex;
      gap: 10px;
      max-width: 480px;
      margin: 0 auto 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .cta-input {
      flex: 1 1 240px;
      padding: 14px 18px;
      border-radius: 8px;
      border: 1px solid #334155;
      background-color: #1e293b;
      color: #ffffff;
      font-size: 15px;
      outline: none;
    }
    .cta-input:focus {
      border-color: #6366f1;
    }
    .cta-btn {
      padding: 14px 26px;
      background-color: #4f46e5;
      color: #ffffff;
      border: 0;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .cta-btn:hover {
      background-color: #4338ca;
    }
    /* Footer Note */
    .landing-footer {
      padding: 32px 20px;
      background-color: #0b0f19;
      color: #64748b;
      text-align: center;
      font-size: 13px;
      border-top: 1px solid #1e293b;
    }
    @media (max-width: 768px) {
      .hero-headline { font-size: 32px; }
      .hero-subheadline { font-size: 16px; }
      .section-title { font-size: 26px; }
      .cta-headline { font-size: 28px; }
    }
  `,
  html: `
    <main>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-badge">
            <span>✨ Versi 2.0 Kini Hadir dengan Object Storage R2 & S3</span>
          </div>
          <h1 class="hero-headline">Bangun Landing Page Konversi Tinggi dengan Visual Builder Ringan</h1>
          <p class="hero-subheadline">
            Platform modern berbasis React Vite dan Express Serverless Vercel. Edit visual mirip Elementor Pro, simpan data terstruktur, dan rasakan kecepatan load halaman kurang dari 50 milidetik.
          </p>
          <div class="hero-cta-group">
            <a href="#demo" class="btn-primary">Mulai Sekarang Gratis</a>
            <a href="#fitur" class="btn-secondary">Lihat Dokumentasi</a>
          </div>
          <div class="hero-mockup-wrapper">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
              alt="Dashboard Preview Mockup"
              class="hero-mockup-img"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <!-- Social Proof Logos -->
      <section class="social-proof-section">
        <div class="container">
          <div class="social-proof-title">Dipercaya oleh ribuan developer & brand terkemuka</div>
          <div class="social-proof-logos">
            <div class="social-logo-item">⚡ VERCEL</div>
            <div class="social-logo-item">🌐 CLOUDFLARE</div>
            <div class="social-logo-item">⚛️ REACT VITE</div>
            <div class="social-logo-item">🛡️ TAILWIND</div>
            <div class="social-logo-item">🚀 SUPABASE</div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="fitur" class="features-section">
        <div class="container">
          <div class="section-header">
            <div class="section-tag">Arsitektur Modern</div>
            <h2 class="section-title">Fitur Unggulan Tanpa Batas</h2>
            <p class="section-desc">Kombinasi fleksibilitas visual builder dan performa serverless kelas dunia.</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon-box">🎨</div>
              <h3>Drag-and-Drop Visual Builder</h3>
              <p>Pengalaman menyusun komponen interaktif ala Elementor Pro yang terstruktur rapi dan bebas dari DOM bloat.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon-box">⚡</div>
              <h3>Direct S3 / R2 Upload</h3>
              <p>Unggah file gambar dan video berukuran besar langsung ke Cloud Storage via Presigned URL tanpa hambatan limit Vercel.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon-box">🚀</div>
              <h3>Performa Render Publik Kilat</h3>
              <p>Halaman pengunjung dirender dengan HTML statis murni tanpa memuat bundle editor yang berat untuk skor Lighthouse 100.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Video Preview Section -->
      <section id="demo" class="video-section">
        <div class="container">
          <div class="section-header">
            <div class="section-tag">Demo Langsung</div>
            <h2 class="section-title">Lihat Bagaimana Cara Kerjanya</h2>
            <p class="section-desc">Saksikan bagaimana pembuatan landing page dilakukan hanya dalam hitungan menit.</p>
          </div>
          <div class="video-container">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0"
              title="Demo Video Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <!-- Call To Action Banner -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-headline">Siap Luncurkan Halaman Impian Anda Hari Ini?</h2>
            <p class="cta-subtext">Daftarkan email Anda sekarang untuk mendapatkan akses instan ke seluruh komponen premium kami.</p>
            <form class="cta-form" onsubmit="event.preventDefault(); alert('Terima kasih! Kami akan segera menghubungi Anda.');">
              <input type="email" placeholder="Masukkan alamat email Anda..." class="cta-input" required />
              <button type="submit" class="cta-btn">Dapatkan Akses</button>
            </form>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container">
          <p>© 2026 Ultra CMS Engine. Dibuat dengan arsitektur React Vite + Express Vercel Serverless.</p>
        </div>
      </footer>
    </main>
  `
};

export default defaultLandingTemplate;
