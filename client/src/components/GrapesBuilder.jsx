import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import {
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Layers,
  Palette,
  LayoutGrid,
  Settings2,
  Sparkles,
  Upload,
} from 'lucide-react';
import { saveAdminPage } from '../utils/api';
import { defaultLandingTemplate } from '../presets/defaultLandingTemplate';

/**
 * GrapesBuilder - Visual Drag-and-Drop Page Builder (Elementor Pro Style)
 * Built on GrapesJS with custom pre-styled blocks, responsive device modes,
 * direct S3/R2 presigned upload handler, and pure JSON/HTML persistence.
 */
export default function GrapesBuilder({
  page,
  onBack,
  onSaved,
}) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [activeTab, setActiveTab] = useState('blocks'); // 'blocks' | 'styles' | 'layers' | 'traits'
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');
  const [metaTitle, setMetaTitle] = useState(page?.metaTitle || page?.seo?.metaTitle || page?.title || '');
  const [metaDescription, setMetaDescription] = useState(page?.metaDescription || page?.seo?.metaDescription || '');

  // Pre-load existing page data or fallback to the bug-proof default starter template
  const initialHtml = page?.html || defaultLandingTemplate.html;
  const initialCss = page?.css || defaultLandingTemplate.css;
  const initialProjectData = page?.projectData || defaultLandingTemplate.projectData;

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize GrapesJS instance
    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: '100%',
      width: 'auto',
      storageManager: false, // We handle saving to Express API explicitly
      showDevices: false, // We control device switcher via custom top bar
      panels: { defaults: [] }, // Custom control panels for a sleek, modern look
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
        ],
      },
      assetManager: {
        upload: false, // Disables default direct form upload so we can hook custom S3 presigned URL
        autoAdd: 1,
        embedAsBase64: false,
        custom: {
          open(props) {
            // Trigger browser file picker
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/mp4';
            input.onchange = async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                // 1. Request S3 / R2 presigned URL from Express Backend
                const token = localStorage.getItem('ultra_admin_token');
                const presignRes = await fetch('/api/media/presigned-url', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                  body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                  }),
                });

                if (!presignRes.ok) {
                  const errJson = await presignRes.json().catch(() => ({}));
                  throw new Error(errJson.error || 'Gagal meminta URL upload S3/R2');
                }

                const { uploadUrl, publicFileUrl, key } = await presignRes.json();

                // 2. Direct upload to Cloudflare R2 / AWS S3 via HTTP PUT (Zero Vercel Serverless payload!)
                const uploadRes = await fetch(uploadUrl, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': file.type,
                  },
                  body: file,
                });

                if (!uploadRes.ok) {
                  throw new Error('Gagal mengunggah file langsung ke Cloud Storage');
                }

                // 3. Save metadata to CMS database
                await fetch('/api/media/save', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                  body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    url: publicFileUrl,
                    key,
                  }),
                });

                // 4. Add uploaded asset into GrapesJS canvas
                props.am.add(publicFileUrl);
                props.select(publicFileUrl);
                props.close();
              } catch (uploadErr) {
                console.error('[Asset Upload Error]:', uploadErr);
                alert(`Upload error: ${uploadErr.message}`);
              }
            };
            input.click();
          },
          close() {},
        },
      },
      blockManager: {
        appendTo: '#gjs-blocks-container',
      },
      styleManager: {
        appendTo: '#gjs-styles-container',
        sectors: [
          {
            name: 'Typography',
            open: true,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
          },
          {
            name: 'Dimensions & Spacing',
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
          },
          {
            name: 'Decoration & Background',
            open: false,
            buildProps: ['background-color', 'background-image', 'border', 'border-radius', 'box-shadow', 'opacity'],
          },
          {
            name: 'Flexbox Layout',
            open: false,
            buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'flex-wrap'],
          },
        ],
      },
      layerManager: {
        appendTo: '#gjs-layers-container',
      },
      traitManager: {
        appendTo: '#gjs-traits-container',
      },
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Desktop', width: '' },
          { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
          { id: 'mobile', name: 'Mobile', width: '375px', widthMedia: '480px' },
        ],
      },
    });

    // Register Modern Elementor-Style Pre-Built Blocks
    const bm = editor.BlockManager;

    // 1. Hero Section
    bm.add('hero-section', {
      label: `
        <div class="gjs-block-custom">
          <div class="gjs-block-icon">🚀</div>
          <div class="gjs-block-title">Hero Section</div>
          <div class="gjs-block-desc">Headline, CTA ganda & mockup</div>
        </div>
      `,
      category: 'Sections',
      content: `
        <section style="padding: 80px 24px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); text-align: center; border-bottom: 1px solid #f1f5f9;">
          <div style="max-width: 900px; margin: 0 auto;">
            <span style="display: inline-block; padding: 6px 16px; background-color: #eef2ff; color: #4f46e5; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; border: 1px solid #e0e7ff;">
              ✨ Rilis Fitur Baru
            </span>
            <h1 style="font-size: 44px; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 18px; letter-spacing: -0.02em;">
              Tingkatkan Penjualan dengan Landing Page Konversi Tinggi
            </h1>
            <p style="font-size: 18px; color: #475569; max-width: 650px; margin: 0 auto 32px; line-height: 1.6;">
              Visual page builder super ringan, cepat, dan terhubung langsung ke Cloudflare R2 atau AWS S3.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px;">
              <a href="#cta" style="padding: 14px 28px; background-color: #4f46e5; color: #ffffff; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block;">
                Mulai Sekarang
              </a>
              <a href="#fitur" style="padding: 14px 28px; background-color: #ffffff; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block;">
                Pelajari Fitur
              </a>
            </div>
            <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.15); border: 1px solid #e2e8f0;">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" style="width: 100%; display: block;" alt="Preview Mockup" />
            </div>
          </div>
        </section>
      `,
    });

    // 2. 3-Column Features Grid
    bm.add('features-grid', {
      label: `
        <div class="gjs-block-custom">
          <div class="gjs-block-icon">⚡</div>
          <div class="gjs-block-title">3-Column Grid</div>
          <div class="gjs-block-desc">3 kartu fitur dengan icon</div>
        </div>
      `,
      category: 'Sections',
      content: `
        <section style="padding: 72px 24px; background-color: #f8fafc;">
          <div style="max-width: 1140px; margin: 0 auto;">
            <div style="text-align: center; max-width: 600px; margin: 0 auto 48px;">
              <span style="color: #4f46e5; font-weight: 700; font-size: 13px; text-transform: uppercase;">Keunggulan</span>
              <h2 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 8px 0 12px;">Solusi Lengkap untuk Bisnis Anda</h2>
              <p style="color: #64748b; font-size: 15px;">Didesain khusus untuk kecepatan dan kemudahan kustomisasi.</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
              <div style="background: #ffffff; padding: 32px 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="width: 44px; height: 44px; border-radius: 8px; background: #eef2ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px;">🎨</div>
                <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Drag & Drop Visual</h3>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">Susun layout dengan fleksibilitas total tanpa perlu menyentuh baris kode.</p>
              </div>
              <div style="background: #ffffff; padding: 32px 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="width: 44px; height: 44px; border-radius: 8px; background: #eef2ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px;">⚡</div>
                <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Direct Cloud Storage</h3>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">Upload gambar dan video MP4 tanpa limit ukuran serverless Vercel.</p>
              </div>
              <div style="background: #ffffff; padding: 32px 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="width: 44px; height: 44px; border-radius: 8px; background: #eef2ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px;">🚀</div>
                <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Ultra Cepat & Ramah SEO</h3>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">Output HTML statis murni dengan dynamic meta tag untuk peringkat Google teratas.</p>
              </div>
            </div>
          </div>
        </section>
      `,
    });

    // 3. Media Player (Video MP4 & YouTube Embed)
    bm.add('media-player', {
      label: `
        <div class="gjs-block-custom">
          <div class="gjs-block-icon">🎬</div>
          <div class="gjs-block-title">Media Player</div>
          <div class="gjs-block-desc">Video YouTube / MP4 responsif</div>
        </div>
      `,
      category: 'Media',
      content: `
        <section style="padding: 64px 24px; background-color: #ffffff; text-align: center;">
          <div style="max-width: 860px; margin: 0 auto;">
            <h2 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">Saksikan Demo Singkat</h2>
            <p style="color: #64748b; font-size: 15px; margin-bottom: 32px;">Pelajari bagaimana platform ini membantu bisnis Anda berkembang.</p>
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12); border: 1px solid #e2e8f0; background: #000;">
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </section>
      `,
    });

    // 4. Testimonial Card & Social Proof
    bm.add('testimonial-card', {
      label: `
        <div class="gjs-block-custom">
          <div class="gjs-block-icon">⭐</div>
          <div class="gjs-block-title">Testimonial</div>
          <div class="gjs-block-desc">Ulasan bintang 5 & profil</div>
        </div>
      `,
      category: 'Social Proof',
      content: `
        <section style="padding: 72px 24px; background-color: #f8fafc;">
          <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            <div style="color: #f59e0b; font-size: 24px; margin-bottom: 16px;">★★★★★</div>
            <blockquote style="font-size: 22px; font-weight: 600; color: #0f172a; line-height: 1.5; margin: 0 0 24px;">
              "Pengalaman menggunakan CMS ini sangat luar biasa. Page load-nya instan dan builder-nya sangat mudah dioperasikan layaknya Elementor Pro!"
            </blockquote>
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" style="width: 48px; height: 48px; border-radius: 9999px; object-fit: cover;" alt="Reviewer Avatar" />
              <div style="text-align: left;">
                <div style="font-weight: 700; color: #0f172a; font-size: 15px;">Sarah Wijaya</div>
                <div style="color: #64748b; font-size: 13px;">Head of Marketing, Digital Growth</div>
              </div>
            </div>
          </div>
        </section>
      `,
    });

    // 5. CTA Banner & Lead Form
    bm.add('cta-banner', {
      label: `
        <div class="gjs-block-custom">
          <div class="gjs-block-icon">📣</div>
          <div class="gjs-block-title">CTA & Form</div>
          <div class="gjs-block-desc">Banner konversi & input lead</div>
        </div>
      `,
      category: 'Forms & CTA',
      content: `
        <section style="padding: 80px 24px; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; text-align: center;">
          <div style="max-width: 650px; margin: 0 auto;">
            <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 16px; color: #ffffff;">Mulai Langkah Anda Hari Ini</h2>
            <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 32px; line-height: 1.6;">
              Dapatkan akses gratis selama 14 hari ke semua fitur premium tanpa kartu kredit.
            </p>
            <form style="display: flex; gap: 10px; max-width: 460px; margin: 0 auto; flex-wrap: wrap; justify-content: center;">
              <input type="email" placeholder="Masukkan email Anda..." style="flex: 1 1 240px; padding: 14px 16px; border-radius: 8px; border: 1px solid #334155; background-color: #1e293b; color: #ffffff; font-size: 14px;" />
              <button type="button" style="padding: 14px 24px; background-color: #4f46e5; color: #ffffff; border: 0; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
                Daftar Gratis
              </button>
            </form>
          </div>
        </section>
      `,
    });

    // Load initial content (projectData if available, else html + css)
    if (initialProjectData && initialProjectData.pages && initialProjectData.pages.length > 0) {
      try {
        editor.loadProjectData(initialProjectData);
      } catch (e) {
        editor.setComponents(initialHtml);
        editor.setStyle(initialCss);
      }
    } else {
      editor.setComponents(initialHtml);
      editor.setStyle(initialCss);
    }

    editorRef.current = editor;
    setEditorInstance(editor);

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  // Switch device viewports (Desktop / Tablet / Mobile)
  const handleDeviceChange = (mode) => {
    if (!editorInstance) return;
    setDeviceMode(mode);
    editorInstance.setDevice(mode);
  };

  // Undo / Redo
  const handleUndo = () => editorInstance?.runCommand('core:undo');
  const handleRedo = () => editorInstance?.runCommand('core:redo');
  const handleClear = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh canvas?')) {
      editorInstance?.DomComponents.clear();
    }
  };

  // Toggle Preview Mode
  const handleTogglePreview = () => {
    if (!editorInstance) return;
    const isPreview = editorInstance.Commands.isActive('preview');
    if (isPreview) {
      editorInstance.stopCommand('preview');
    } else {
      editorInstance.runCommand('preview');
    }
  };

  // Save to Backend REST API
  const handleSave = async () => {
    if (!editorInstance) return;

    setSaving(true);
    setSaveStatus(null);
    setStatusMessage('');

    try {
      const projectData = editorInstance.getProjectData();
      const html = editorInstance.getHtml();
      const css = editorInstance.getCss();

      const payload = {
        ...(page || {}),
        id: page?.id || `page_${Date.now()}`,
        title: page?.title || metaTitle || 'Untitled Landing Page',
        slug: page?.slug || 'home',
        status: 'published',
        metaTitle: metaTitle || page?.title || 'Landing Page',
        metaDescription: metaDescription || '',
        seo: {
          ...(page?.seo || {}),
          metaTitle: metaTitle || page?.title,
          metaDescription: metaDescription,
        },
        projectData,
        html,
        css,
      };

      const saved = await saveAdminPage(payload);

      setSaveStatus('success');
      setStatusMessage('Halaman berhasil disimpan dan dipublikasikan!');
      if (onSaved) onSaved(saved);

      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      console.error('[GrapesBuilder Save Error]:', err);
      setSaveStatus('error');
      setStatusMessage(err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* 1. Top Bar Navigation (Elementor Pro Style) */}
      <header className="h-14 bg-[#0f172a] border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Back Button + Page Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            title="Kembali ke Daftar Halaman"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white">
                {page?.title || 'Visual Builder'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                /{page?.slug || 'home'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Responsive Device Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => handleDeviceChange('desktop')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              deviceMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mode Desktop (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeviceChange('tablet')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              deviceMode === 'tablet'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mode Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeviceChange('mobile')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              deviceMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mode Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: History, Preview & Save */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Urungkan (Undo)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Ulangi (Redo)"
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Kosongkan Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* Preview Toggle */}
          <button
            onClick={handleTogglePreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            title="Mode Pratinjau Bersih"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pratinjau</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Menyimpan...' : 'Simpan Halaman'}</span>
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {saveStatus && (
        <div
          className={`absolute top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border animate-in slide-in-from-top-2 duration-200 ${
            saveStatus === 'success'
              ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
              : 'bg-rose-950 border-rose-800 text-rose-300'
          }`}
        >
          {saveStatus === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 2. Main Workspace: Canvas Area + Elementor Control Sidebar */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left / Center: Interactive Canvas Container */}
        <div className="flex-grow bg-[#1e293b] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden relative">
          <div
            id="gjs-canvas-wrapper"
            className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            <div ref={containerRef} className="w-full h-full" />
          </div>
        </div>

        {/* Right Sidebar: Elementor Style Manager Panel */}
        <div className="w-80 bg-[#0f172a] border-l border-slate-800 flex flex-col shrink-0 z-20">
          {/* Panel Selector Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs">
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-3 flex flex-col items-center gap-1 font-semibold border-b-2 transition-colors ${
                activeTab === 'blocks'
                  ? 'border-indigo-500 text-indigo-400 bg-[#0f172a]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              title="Komponen & Blok"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Blok</span>
            </button>
            <button
              onClick={() => setActiveTab('styles')}
              className={`flex-1 py-3 flex flex-col items-center gap-1 font-semibold border-b-2 transition-colors ${
                activeTab === 'styles'
                  ? 'border-indigo-500 text-indigo-400 bg-[#0f172a]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              title="Gaya CSS & Typography"
            >
              <Palette className="w-4 h-4" />
              <span>Gaya</span>
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-3 flex flex-col items-center gap-1 font-semibold border-b-2 transition-colors ${
                activeTab === 'layers'
                  ? 'border-indigo-500 text-indigo-400 bg-[#0f172a]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              title="Struktur Layer DOM"
            >
              <Layers className="w-4 h-4" />
              <span>Layer</span>
            </button>
            <button
              onClick={() => setActiveTab('traits')}
              className={`flex-1 py-3 flex flex-col items-center gap-1 font-semibold border-b-2 transition-colors ${
                activeTab === 'traits'
                  ? 'border-indigo-500 text-indigo-400 bg-[#0f172a]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              title="Pengaturan SEO & Atribut"
            >
              <Settings2 className="w-4 h-4" />
              <span>SEO</span>
            </button>
          </div>

          {/* Panel Contents Container */}
          <div className="flex-grow overflow-y-auto p-3.5 space-y-4">
            {/* Tab 1: Block Manager */}
            <div className={activeTab === 'blocks' ? 'block' : 'hidden'}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pilih Komponen
              </div>
              <div id="gjs-blocks-container" className="gjs-custom-blocks-grid" />
            </div>

            {/* Tab 2: Style Manager */}
            <div className={activeTab === 'styles' ? 'block' : 'hidden'}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Editor Visual (Pilih Elemen di Canvas)
              </div>
              <div id="gjs-styles-container" className="text-xs text-slate-300" />
            </div>

            {/* Tab 3: Layer Manager */}
            <div className={activeTab === 'layers' ? 'block' : 'hidden'}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Hierarki Elemen
              </div>
              <div id="gjs-layers-container" />
            </div>

            {/* Tab 4: SEO Metadata & Traits */}
            <div className={activeTab === 'traits' ? 'block' : 'hidden'}>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Meta Title (Google Preview)
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Judul SEO halaman..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Deskripsi singkat yang tampil di hasil pencarian..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Atribut Elemen (Traits)
                  </div>
                  <div id="gjs-traits-container" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS Overrides for GrapesJS in Dark Theme */}
      <style>{`
        .gjs-custom-blocks-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .gjs-block {
          width: 100% !important;
          min-height: auto !important;
          padding: 12px 14px !important;
          border-radius: 10px !important;
          border: 1px solid #1e293b !important;
          background-color: #1e293b !important;
          color: #f8fafc !important;
          cursor: grab !important;
          transition: all 0.15s ease !important;
          text-align: left !important;
          box-shadow: none !important;
        }
        .gjs-block:hover {
          border-color: #6366f1 !important;
          background-color: #27354f !important;
          transform: translateY(-1px);
        }
        .gjs-block-custom {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .gjs-block-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }
        .gjs-block-title {
          font-weight: 700;
          font-size: 13px;
          color: #ffffff;
        }
        .gjs-block-desc {
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.4;
        }
        .gjs-one-bg {
          background-color: #0f172a !important;
        }
        .gjs-two-color {
          color: #cbd5e1 !important;
        }
        .gjs-four-color, .gjs-four-color-h:hover {
          color: #818cf8 !important;
        }
        .gjs-sm-sector-title {
          background-color: #1e293b !important;
          border-radius: 6px !important;
          color: #e2e8f0 !important;
          font-weight: 600 !important;
          font-size: 12px !important;
        }
        .gjs-field {
          background-color: #0f172a !important;
          border: 1px solid #334155 !important;
          border-radius: 6px !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
