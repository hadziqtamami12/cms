import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Monitor, Tablet, Smartphone, Save, ArrowLeft, Eye, Undo2, Redo2,
  Sparkles, Layers, Sliders, Palette, Search, Check, ChevronDown,
  ChevronRight, Plus, Trash2, Image, Type, Car, CheckCircle2,
  AlertCircle, RefreshCw, ExternalLink, HelpCircle, Shield, Globe,
  MessageCircle, Copy, ArrowUp, ArrowDown, Move, Settings, CheckCheck,
  ShoppingBag, Star, DollarSign, Award, SlidersHorizontal, EyeOff,
  SearchCheck, AlignLeft, AlignCenter, AlignRight, Tag, Fuel,
  Users, Briefcase, Zap, Phone, CheckSquare, Grid, Folder, Menu,
  X, CheckCircle, Layout, MousePointer, Paintbrush, SlidersVertical
} from 'lucide-react';
import ThemePreviewCanvas from '../components/ThemePreviewCanvas';
import { fetchAdminPages, saveAdminPage } from '../../utils/api';
import { WP_THEMES } from './ThemeCustomizer';
import { getThemePresetData } from '../../utils/themePresets';

const DEFAULT_BLOCKS = [
  {
    id: 'block-hero',
    type: 'hero',
    label: 'Hero Slideshow Dinamis',
    icon: Sparkles,
    content: {
      mode: 'slideshow',
      autoplayInterval: 5,
      overlayOpacity: 50,
      activeSlideIdx: 0,
      slides: [
        {
          id: 's1',
          badge: 'Layanan VIP Rental 24 Jam • #1 Terpercaya',
          title: 'Perjalanan Mewah & Berkelas dengan Armada Terbaik',
          subtitle: 'Armada tahun terbaru, kabin bersih wangi berkelas, siap lepas kunci atau supir eksekutif ramah berpengalaman.',
          imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
          ctaPrimaryText: 'Pilih Armada Mobil',
          ctaPrimaryLink: '#fleet',
          ctaSecondaryText: 'Chat WhatsApp 24 Jam',
          ctaSecondaryLink: 'https://wa.me/6281234567890',
        },
        {
          id: 's2',
          badge: 'Armada Eksekutif • Antar Jemput Bandara VIP',
          title: 'Toyota Alphard Transformer & Vellfire VIP',
          subtitle: 'Kenyamanan kelas bisnis dengan captain seat mewah, privasi maksimal, dan fasilitas bintang lima untuk tamu kehormatan.',
          imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600&auto=format&fit=crop',
          ctaPrimaryText: 'Booking Alphard VIP',
          ctaPrimaryLink: '#fleet',
          ctaSecondaryText: 'Konsultasi Gratis',
          ctaSecondaryLink: 'https://wa.me/6281234567890',
        },
      ],
    },
    style: {
      paddingY: 'py-20',
      bgColor: '#090d16',
      textColor: '#ffffff',
      textAlign: 'text-left',
    },
  },
  {
    id: 'block-features',
    type: 'features',
    label: 'Bento Feature Showcase',
    icon: Award,
    content: {
      tagline: 'Standar Layanan VIP',
      title: 'Mengapa Memilih Layanan Kami?',
      subtitle: 'Komitmen kami menjamin kenyamanan, keamanan, dan kepastian perjalanan Anda tanpa kompromi.',
      items: [
        { title: 'Unit Bersih & Higienis', desc: 'Dibersihkan dan disterilkan secara menyeluruh sebelum keberangkatan.' },
        { title: 'Supir VIP Berpengalaman', desc: 'Driver ramah, bersertifikat, menguasai rute, dan berpakaian formal rapi.' },
        { title: 'Asuransi All-Risk Penuh', desc: 'Perlindungan menyeluruh untuk ketenangan perjalanan Anda dan keluarga.' },
        { title: 'Bebas Antar Jemput Bandara', desc: 'Pengantaran tepat waktu di Bandara Soetta, Halim, stasiun, atau hotel.' },
      ],
    },
    style: {
      paddingY: 'py-16',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      textAlign: 'text-center',
    },
  },
  {
    id: 'block-fleet',
    type: 'fleet',
    label: 'Katalog Produk & Armada',
    icon: Car,
    content: {
      tagline: 'Katalog Armada Tersedia',
      title: 'Pilihan Kendaraan Mewah & Keluarga',
      subtitle: 'Unit tahun 2024-2025 dengan kondisi prima, siap diberangkatkan hari ini.',
      vehicles: [
        {
          id: 'v1',
          name: 'Toyota Alphard Transformer VIP',
          category: 'VIP Luxury',
          priceLepasKunci: 'Rp 2.500.000 / hari',
          priceWithDriver: 'Rp 2.800.000 / hari',
          transmission: 'Matic TNGA',
          capacity: '6 Kursi VIP',
          fuel: 'Bensin',
          badge: 'Paling Populer',
          image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
          description: 'Pilihan utama tamu VIP, direksi, dan perjalanan bisnis mewah.',
        },
        {
          id: 'v2',
          name: 'Toyota Innova Zenix Hybrid',
          category: 'MPV Keluarga',
          priceLepasKunci: 'Rp 750.000 / hari',
          priceWithDriver: 'Rp 950.000 / hari',
          transmission: 'Matic CVT',
          capacity: '7 Penumpang',
          fuel: 'Hybrid Irit',
          badge: 'Paling Laris',
          image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
          description: 'Kombinasi kenyamanan keluarga dan efisiensi bahan bakar maksimal.',
        },
        {
          id: 'v3',
          name: 'Toyota Fortuner 2.8 GR Sport',
          category: 'SUV Tangguh',
          priceLepasKunci: 'Rp 1.200.000 / hari',
          priceWithDriver: 'Rp 1.450.000 / hari',
          transmission: 'Matic 4x2',
          capacity: '7 Penumpang',
          fuel: 'Diesel Turbo',
          badge: 'Gagah & Kuat',
          image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
          description: 'SUV tangguh untuk perjalanan dinas, proyek, atau wisata medan berliku.',
        },
      ],
    },
    style: {
      paddingY: 'py-16',
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      textAlign: 'text-left',
    },
  },
  {
    id: 'block-faq',
    type: 'faq',
    label: 'FAQ Accordion Interaktif',
    icon: HelpCircle,
    content: {
      tagline: 'Informasi Rental Mobil',
      title: 'Pertanyaan yang Sering Diajukan',
      subtitle: 'Panduan lengkap syarat, ketentuan lepas kunci, dan layanan sewa mobil kami.',
      faqs: [
        { q: 'Apa saja syarat untuk sewa mobil lepas kunci?', a: 'Cukup melampirkan foto e-KTP, SIM A aktif, bukti reservasi tiket/hotel, dan akun media sosial aktif.' },
        { q: 'Apakah melayani penjemputan di Bandara 24 jam?', a: 'Ya! Tim kami siaga 24 jam di Bandara Soekarno Hatta (Terminal 1, 2, 3) dan Bandara Halim Perdanakusuma.' },
        { q: 'Bagaimana jika terjadi kendala pada kendaraan di jalan?', a: 'Layanan road assistance 24/7 kami siap membantu, termasuk pergantian unit pengganti setara tanpa biaya tambahan.' },
      ],
    },
    style: {
      paddingY: 'py-16',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      textAlign: 'text-left',
    },
  },
];

const WIDGET_CATEGORIES = [
  {
    title: 'CMS Otomotif & Rental',
    items: [
      { type: 'fleet', label: 'Katalog Armada Mobil', desc: 'Grid kartu mobil dengan filter harga & lepas kunci', icon: Car },
      { type: 'faq', label: 'FAQ Accordion', desc: 'Tanya jawab interaktif syarat rental', icon: HelpCircle },
      { type: 'pricing', label: 'Tabel Paket Tarif', desc: 'Kalkulator sewa harian, 24 jam, dan bulanan', icon: DollarSign },
      { type: 'whatsapp', label: 'Sticky WhatsApp Bar', desc: 'Tombol kontak melayang 24 jam CS', icon: MessageCircle },
    ],
  },
  {
    title: 'Pro Widgets',
    items: [
      { type: 'hero', label: 'Hero Slideshow', desc: 'Banner slideshow visual dengan tombol CTA ganda', icon: Sparkles },
      { type: 'features', label: 'Bento Feature Showcase', desc: 'Bento grid kartu standar layanan VIP', icon: Award },
      { type: 'testimonials', label: 'Testimonial Klien', desc: 'Review bintang lima dari pelanggan eksekutif', icon: Star },
    ],
  },
  {
    title: 'Basic Elements',
    items: [
      { type: 'heading', label: 'Heading Teks', desc: 'Judul H1-H4 dengan kustomisasi tipografi', icon: Type },
      { type: 'image', label: 'Kotak Gambar', desc: 'Tampilkan gambar showcase responsif', icon: Image },
    ],
  },
];

export default function AdminThemeManager({ onBack = null }) {
  // --- Page Data & Loading State ---
  const [homePage, setHomePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveNotification, setSaveNotification] = useState('');

  // --- Elementor Blocks State ---
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState('block-hero');
  const [panelView, setPanelView] = useState('inspector'); // 'inspector' | 'widgets'
  const [inspectorTab, setInspectorTab] = useState('content'); // 'content' | 'style' | 'advanced'

  // Sub-item active tabs (e.g. active slide, active car)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeCarIndex, setActiveCarIndex] = useState(0);

  // --- Theme Preset Library Modal ---
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('oceanwp-store');
  const [themeSearch, setThemeSearch] = useState('');

  // --- Global Styling & Tokens ---
  const [globalTokens, setGlobalTokens] = useState({
    primaryColor: '#4f46e5',
    accentColor: '#f59e0b',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardRadius: 'rounded-2xl',
  });

  // --- Brand & SEO State ---
  const [brandName, setBrandName] = useState('Samudera VIP Transport');
  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');
  const [seoTitle, setSeoTitle] = useState('Rental Mobil Mewah Jakarta 24 Jam');
  const [seoDesc, setSeoDesc] = useState('Sewa Alphard, Innova Zenix, dan Hiace Premio terbaik.');

  // --- Canvas Device & Zoom State ---
  const [canvasDevice, setCanvasDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  // --- History (Undo / Redo) ---
  const [history, setHistory] = useState([DEFAULT_BLOCKS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Load active homepage data
  useEffect(() => {
    fetchAdminPages()
      .then((pages) => {
        const home = pages.find((p) => p.isHome || p.slug === 'home') || pages[0];
        if (home) {
          setHomePage(home);
          if (home.themeId) setActiveThemeId(home.themeId);
          if (home.header?.brandName) setBrandName(home.header.brandName);
          if (home.header?.whatsappNumber) setWhatsappNumber(home.header.whatsappNumber);
          if (home.seo?.title) setSeoTitle(home.seo.title);
          if (home.seo?.description) setSeoDesc(home.seo.description);

          if (home.styling) {
            setGlobalTokens((prev) => ({ ...prev, ...home.styling }));
          }

          if (home.blocks && home.blocks.length > 0) {
            const normalized = home.blocks.map((b) => ({
              ...b,
              content: b.content || b.props || {},
              style: b.style || b.styles || {},
            }));
            setBlocks(normalized);
            setHistory([normalized]);
            setSelectedBlockId(normalized[0]?.id || null);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Update blocks with history stack
  const updateBlocksWithHistory = (newBlocks) => {
    setBlocks(newBlocks);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setBlocks(history[prev]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setBlocks(history[next]);
    }
  };

  // Select Block
  const handleSelectBlock = (id) => {
    setSelectedBlockId(id);
    setPanelView('inspector');
    setInspectorTab('content');
  };

  // Add Widget from Catalog
  const handleAddWidget = (type) => {
    const newId = `block-${type}-${Date.now()}`;
    let newBlock;

    if (type === 'hero') {
      newBlock = {
        id: newId,
        type: 'hero',
        label: 'Hero Slideshow',
        icon: Sparkles,
        content: {
          mode: 'slideshow',
          autoplayInterval: 5,
          overlayOpacity: 50,
          slides: [
            {
              id: `s-${Date.now()}`,
              badge: 'Armada Baru 2025 • Siap Jalan',
              title: 'Kemewahan Perjalanan Tanpa Kompromi',
              subtitle: 'Kabin bersih, unit terawat, supir ramah berpengalaman.',
              imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600&auto=format&fit=crop',
              ctaPrimaryText: 'Pilih Armada Mobil',
              ctaPrimaryLink: '#fleet',
              ctaSecondaryText: 'WhatsApp 24 Jam',
              ctaSecondaryLink: `https://wa.me/${whatsappNumber}`,
            },
          ],
        },
        style: { paddingY: 'py-20', bgColor: '#090d16', textColor: '#ffffff', textAlign: 'text-left' },
      };
    } else if (type === 'fleet') {
      newBlock = {
        id: newId,
        type: 'fleet',
        label: 'Katalog Armada Mobil',
        icon: Car,
        content: {
          tagline: 'Katalog Armada Tersedia',
          title: 'Pilihan Kendaraan Mewah & Keluarga',
          subtitle: 'Unit tahun 2024-2025 dengan kondisi prima, siap jalan.',
          vehicles: [
            {
              id: `v-${Date.now()}`,
              name: 'Toyota Innova Zenix Hybrid',
              category: 'MPV Keluarga',
              priceLepasKunci: 'Rp 750.000 / hari',
              priceWithDriver: 'Rp 950.000 / hari',
              transmission: 'Matic CVT',
              capacity: '7 Penumpang',
              fuel: 'Hybrid Irit',
              badge: 'Paling Laris',
              image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
              description: 'Kenyamanan keluarga dan efisiensi bahan bakar maksimal.',
            },
          ],
        },
        style: { paddingY: 'py-16', bgColor: '#f8fafc', textColor: '#0f172a', textAlign: 'text-left' },
      };
    } else if (type === 'faq') {
      newBlock = {
        id: newId,
        type: 'faq',
        label: 'FAQ Accordion',
        icon: HelpCircle,
        content: {
          tagline: 'Informasi Rental',
          title: 'Pertanyaan yang Sering Diajukan',
          subtitle: 'Panduan lengkap syarat dan ketentuan sewa mobil.',
          faqs: [
            { q: 'Apa saja syarat sewa mobil lepas kunci?', a: 'Cukup e-KTP asli, SIM A aktif, bukti reservasi tiket/hotel, dan akun medsos aktif.' },
          ],
        },
        style: { paddingY: 'py-16', bgColor: '#ffffff', textColor: '#0f172a', textAlign: 'text-left' },
      };
    } else if (type === 'features') {
      newBlock = {
        id: newId,
        type: 'features',
        label: 'Keunggulan Layanan',
        icon: Award,
        content: {
          tagline: 'Standar Layanan VIP',
          title: 'Mengapa Memilih Layanan Kami?',
          subtitle: 'Kenyamanan, keamanan, dan kepastian perjalanan Anda terjamin.',
          items: [
            { title: 'Unit Bersih & Terawat', desc: 'Dibersihkan dan disterilkan secara menyeluruh sebelum keberangkatan.' },
            { title: 'Supir VIP Berpengalaman', desc: 'Driver ramah, bersertifikat, dan menguasai rute.' },
          ],
        },
        style: { paddingY: 'py-16', bgColor: '#ffffff', textColor: '#0f172a', textAlign: 'text-center' },
      };
    } else {
      newBlock = {
        id: newId,
        type,
        label: `Section ${type.toUpperCase()}`,
        icon: Layers,
        content: { title: `Judul Bagian ${type}`, subtitle: 'Deskripsi bagian ini dapat diubah di panel inspector kiri.' },
        style: { paddingY: 'py-16', bgColor: '#ffffff', textColor: '#0f172a', textAlign: 'text-left' },
      };
    }

    const updated = [...blocks, newBlock];
    updateBlocksWithHistory(updated);
    handleSelectBlock(newId);
  };

  const handleMoveBlock = (index, direction, e) => {
    e?.stopPropagation();
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    updateBlocksWithHistory(updated);
  };

  const handleDuplicateBlock = (index, e) => {
    e?.stopPropagation();
    const target = blocks[index];
    const copy = JSON.parse(JSON.stringify(target));
    copy.id = `block-${copy.type}-${Date.now()}`;
    copy.label = `${copy.label} (Salinan)`;
    const updated = [...blocks];
    updated.splice(index + 1, 0, copy);
    updateBlocksWithHistory(updated);
  };

  const handleDeleteBlock = (index, e) => {
    e?.stopPropagation();
    if (blocks.length <= 1) {
      alert('Minimal harus ada 1 section di dalam halaman.');
      return;
    }
    const updated = blocks.filter((_, i) => i !== index);
    updateBlocksWithHistory(updated);
    if (selectedBlockId === blocks[index]?.id) {
      setSelectedBlockId(updated[0]?.id || null);
    }
  };

  // Currently Selected Block
  const selectedBlock = useMemo(() => blocks.find((b) => b.id === selectedBlockId), [blocks, selectedBlockId]);

  const handleUpdateSelectedContent = (key, val) => {
    if (!selectedBlockId) return;
    const updated = blocks.map((b) => {
      if (b.id === selectedBlockId) {
        const newContent = { ...b.content, [key]: val };
        return {
          ...b,
          content: newContent,
          props: newContent,
        };
      }
      return b;
    });
    setBlocks(updated);
  };

  const handleUpdateSelectedStyle = (key, val) => {
    if (!selectedBlockId) return;
    const updated = blocks.map((b) => {
      if (b.id === selectedBlockId) {
        const newStyle = { ...b.style, [key]: val };
        return {
          ...b,
          style: newStyle,
          styles: newStyle,
        };
      }
      return b;
    });
    setBlocks(updated);
  };

  // --- Sub-Item Handlers (Vehicles, Slides, FAQs, Features) ---
  const handleAddVehicle = () => {
    if (!selectedBlock || selectedBlock.type !== 'fleet') return;
    const currentCars = selectedBlock.content.vehicles || [];
    const newCar = {
      id: `v-${Date.now()}`,
      name: 'Toyota All New Avanza 2024',
      category: 'MPV Keluarga',
      priceLepasKunci: 'Rp 450.000 / hari',
      priceWithDriver: 'Rp 650.000 / hari',
      transmission: 'Matic CVT',
      capacity: '7 Kursi',
      fuel: 'Bensin',
      badge: 'Unit Baru',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      description: 'Pilihan hemat dan nyaman untuk perjalanan keluarga.',
    };
    const updated = [...currentCars, newCar];
    handleUpdateSelectedContent('vehicles', updated);
    setActiveCarIndex(updated.length - 1);
  };

  const handleUpdateVehicle = (idx, field, value) => {
    if (!selectedBlock || selectedBlock.type !== 'fleet') return;
    const currentCars = [...(selectedBlock.content.vehicles || [])];
    if (currentCars[idx]) {
      currentCars[idx] = { ...currentCars[idx], [field]: value };
      handleUpdateSelectedContent('vehicles', currentCars);
    }
  };

  const handleDeleteVehicle = (idx, e) => {
    e?.stopPropagation();
    if (!selectedBlock || selectedBlock.type !== 'fleet') return;
    const currentCars = selectedBlock.content.vehicles || [];
    if (currentCars.length <= 1) {
      alert('Minimal harus ada 1 mobil di armada.');
      return;
    }
    const updated = currentCars.filter((_, i) => i !== idx);
    handleUpdateSelectedContent('vehicles', updated);
    if (activeCarIndex >= updated.length) {
      setActiveCarIndex(updated.length - 1);
    }
  };

  const handleAddSlide = () => {
    if (!selectedBlock || selectedBlock.type !== 'hero') return;
    const currentSlides = selectedBlock.content.slides || [];
    const newSlide = {
      id: `s-${Date.now()}`,
      badge: 'Armada Baru 2025 • Siap Jalan',
      title: 'Perjalanan Nyaman Tanpa Kompromi',
      subtitle: 'Pilihan tepat untuk kenyamanan keluarga dan perjalanan bisnis Anda.',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop',
      ctaPrimaryText: 'Pilih Armada Mobil',
      ctaPrimaryLink: '#fleet',
      ctaSecondaryText: 'Chat WhatsApp 24 Jam',
      ctaSecondaryLink: `https://wa.me/${whatsappNumber}`,
    };
    const updated = [...currentSlides, newSlide];
    handleUpdateSelectedContent('slides', updated);
    setActiveSlideIndex(updated.length - 1);
  };

  const handleUpdateSlide = (idx, field, value) => {
    if (!selectedBlock || selectedBlock.type !== 'hero') return;
    const currentSlides = [...(selectedBlock.content.slides || [])];
    if (currentSlides[idx]) {
      currentSlides[idx] = { ...currentSlides[idx], [field]: value };
      handleUpdateSelectedContent('slides', currentSlides);
    }
  };

  const handleDeleteSlide = (idx, e) => {
    e?.stopPropagation();
    if (!selectedBlock || selectedBlock.type !== 'hero') return;
    const currentSlides = selectedBlock.content.slides || [];
    if (currentSlides.length <= 1) {
      alert('Minimal harus ada 1 slide hero.');
      return;
    }
    const updated = currentSlides.filter((_, i) => i !== idx);
    handleUpdateSelectedContent('slides', updated);
    if (activeSlideIndex >= updated.length) {
      setActiveSlideIndex(updated.length - 1);
    }
  };

  const handleAddFaq = () => {
    if (!selectedBlock || selectedBlock.type !== 'faq') return;
    const currentFaqs = selectedBlock.content.faqs || [];
    const newFaq = {
      q: 'Bagaimana cara booking sewa mobil?',
      a: 'Cukup klik tombol WhatsApp atau pilih mobil di katalog untuk reservasi 24 jam.',
    };
    handleUpdateSelectedContent('faqs', [...currentFaqs, newFaq]);
  };

  const handleUpdateFaq = (idx, field, value) => {
    if (!selectedBlock || selectedBlock.type !== 'faq') return;
    const currentFaqs = [...(selectedBlock.content.faqs || [])];
    if (currentFaqs[idx]) {
      currentFaqs[idx] = { ...currentFaqs[idx], [field]: value };
      handleUpdateSelectedContent('faqs', currentFaqs);
    }
  };

  const handleDeleteFaq = (idx, e) => {
    e?.stopPropagation();
    if (!selectedBlock || selectedBlock.type !== 'faq') return;
    const currentFaqs = selectedBlock.content.faqs || [];
    if (currentFaqs.length <= 1) return;
    handleUpdateSelectedContent('faqs', currentFaqs.filter((_, i) => i !== idx));
  };

  // Apply Theme Preset
  const handleApplyThemePreset = (theme) => {
    setActiveThemeId(theme.id);
    const preset = getThemePresetData(theme.id);
    if (preset?.blocks && preset.blocks.length > 0) {
      const normalized = preset.blocks.map((b) => ({
        ...b,
        content: b.content || b.props || {},
        style: b.style || b.styles || {},
      }));
      updateBlocksWithHistory(normalized);
      setSelectedBlockId(normalized[0]?.id || null);
    }
    if (preset?.title) {
      setBrandName(preset.title.split('-')[0]?.trim() || brandName);
    }
    if (theme.primaryColor) {
      setGlobalTokens((prev) => ({ ...prev, primaryColor: theme.primaryColor }));
    }
    setThemeModalOpen(false);
    setSaveNotification(`Tema "${theme.name}" diterapkan ke kanvas! Klik "Update" untuk menyimpan.`);
    setTimeout(() => setSaveNotification(''), 4500);
  };

  // Save / Update to Database
  const handleSaveAndPublish = async () => {
    setSaving(true);
    setSaveNotification('');
    try {
      const heroB = blocks.find((b) => b.type === 'hero' || b.type === 'hero-slider');
      const fleetB = blocks.find((b) => b.type === 'fleet' || b.type === 'fleet-catalog');
      const faqB = blocks.find((b) => b.type === 'faq');

      const payload = {
        ...homePage,
        id: homePage?.id || 'page_rental_mobil_default',
        slug: homePage?.slug || 'home',
        title: brandName ? `${brandName} - Rental Mobil Mewah` : 'Samudera VIP Transport',
        themeId: activeThemeId,
        header: {
          ...homePage?.header,
          brandName,
          whatsappNumber,
        },
        styling: globalTokens,
        seo: {
          ...homePage?.seo,
          title: seoTitle,
          description: seoDesc,
        },
        blocks: blocks.map((b) => ({
          ...b,
          props: b.content,
          styles: b.style,
        })),
        hero: heroB ? {
          mode: heroB.content.mode || 'slideshow',
          autoplayInterval: heroB.content.autoplayInterval || 5,
          overlayOpacity: heroB.content.overlayOpacity || 50,
          slides: heroB.content.slides || [],
        } : homePage?.hero,
        fleet: fleetB ? {
          title: fleetB.content.title || 'Pilihan Armada Rental',
          subtitle: fleetB.content.subtitle || '',
          vehicles: (fleetB.content.vehicles || []).map((v) => ({
            id: v.id,
            name: v.name,
            category: v.category,
            priceLepasKunci: v.priceLepasKunci || v.price || 'Rp 750.000',
            priceWithDriver: v.priceWithDriver || 'Rp 950.000',
            transmission: v.transmission || 'Matic',
            capacity: v.capacity || '7 Kursi',
            fuel: v.fuel || 'Bensin',
            badge: v.badge || 'Unit Pilihan',
            imageUrl: v.image || v.imageUrl,
            image: v.image || v.imageUrl,
            description: v.description,
          })),
        } : homePage?.fleet,
        faqs: faqB?.content?.faqs || homePage?.faqs || [],
      };

      const saved = await saveAdminPage(payload);
      setHomePage(saved);
      setSaveNotification('Halaman & Tema Berhasil Diperbarui!');
      setTimeout(() => setSaveNotification(''), 4000);
    } catch (err) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#12141a] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. ELEMENTOR PRO TOP BAR                                                  */}
      {/* ========================================================================= */}
      <header className="h-14 bg-[#181a20] border-b border-[#262933] px-4 flex items-center justify-between shrink-0 z-30 shadow-lg">
        {/* Left: Elementor Pro Logo & Page Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else window.location.href = '/admin?tab=dashboard';
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Kembali ke Dashboard Admin"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-rose-600/30">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight leading-tight">
                  Elementor Pro Studio
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                  Theme &amp; Page Builder
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                Tema Aktif: <span className="text-indigo-400 font-semibold">{activeThemeId}</span> • /{homePage?.slug || 'home'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Device Mode & History Controls */}
        <div className="flex items-center gap-4">
          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-1 bg-[#12141a] p-1 rounded-xl border border-[#262933]">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e222b] disabled:opacity-30 disabled:pointer-events-none"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e222b] disabled:opacity-30 disabled:pointer-events-none"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Responsive Device Switcher */}
          <div className="flex items-center bg-[#12141a] p-1 rounded-xl border border-[#262933] text-xs">
            <button
              type="button"
              onClick={() => setCanvasDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                canvasDevice === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setCanvasDevice('tablet')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                canvasDevice === 'tablet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setCanvasDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                canvasDevice === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Theme Preset Library & Update / Publish Button */}
        <div className="flex items-center gap-3">
          {saveNotification && (
            <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{saveNotification}</span>
            </span>
          )}

          {/* Theme Preset Library Modal Trigger */}
          <button
            type="button"
            onClick={() => setThemeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-[#262933] bg-[#12141a] hover:bg-[#1e222b] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Folder className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pilih Tema Preset</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Elementor Pro Green Update Button */}
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAndPublish}
            className="px-5 py-2 rounded-xl bg-[#39b54a] hover:bg-[#2fa03f] text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60"
          >
            <Check className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Memperbarui...' : 'Update (Publish)'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE (Left: Elementor Panel, Right: Live Canvas)             */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* --------------------------------------------------------------------- */}
        {/* LEFT DOCKED ELEMENTOR PANEL (Width 360px)                             */}
        {/* --------------------------------------------------------------------- */}
        <aside className="w-88 sm:w-96 bg-[#181a20] border-r border-[#262933] flex flex-col shrink-0 z-20 overflow-hidden shadow-2xl">
          {/* Panel Top Switcher: 9-Dots Elements vs Active Inspector */}
          <div className="h-12 bg-[#12141a] px-3 border-b border-[#262933] flex items-center justify-between text-xs font-bold text-slate-300 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPanelView('widgets')}
                className={`p-2 rounded-lg transition-colors ${
                  panelView === 'widgets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1e222b]'
                }`}
                title="Katalog Elemen & Widget"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setPanelView('inspector')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  panelView === 'inspector' ? 'bg-[#1e222b] text-white border border-[#333745]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edit Blok</span>
              </button>
            </div>

            {selectedBlock && (
              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                {selectedBlock.label}
              </span>
            )}
          </div>

          {/* Panel Inner Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ----------------------------------------------------------------- */}
            {/* VIEW A: WIDGET DRAWER (CATALOG ELEMEN)                            */}
            {/* ----------------------------------------------------------------- */}
            {panelView === 'widgets' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Widget Elementor Pro</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Klik salah satu widget untuk menambahkannya ke kanvas.</p>
                </div>

                <div className="space-y-4">
                  {WIDGET_CATEGORIES.map((cat, catIdx) => (
                    <div key={catIdx} className="space-y-2">
                      <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                        {cat.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {cat.items.map((widget) => {
                          const Icon = widget.icon;
                          return (
                            <div
                              key={widget.type}
                              onClick={() => handleAddWidget(widget.type)}
                              className="p-3 rounded-xl border border-[#262933] bg-[#12141a]/80 hover:bg-[#1e222b] hover:border-indigo-500/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-slate-200 group-hover:text-white leading-tight">
                                {widget.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* VIEW B: ELEMENTOR 3-TABS INSPECTOR (Content, Style, Advanced)     */}
            {/* ----------------------------------------------------------------- */}
            {panelView === 'inspector' && (
              <div className="space-y-4">
                {selectedBlock ? (
                  <>
                    {/* The Iconic Elementor 3-Tabs Header */}
                    <div className="grid grid-cols-3 bg-[#12141a] p-1 rounded-xl border border-[#262933] text-xs font-bold">
                      {[
                        { id: 'content', label: 'Konten' },
                        { id: 'style', label: 'Gaya' },
                        { id: 'advanced', label: 'Lanjutan' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setInspectorTab(t.id)}
                          className={`py-1.5 rounded-lg text-center transition-all ${
                            inspectorTab === t.id
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* --------------------------------------------------------- */}
                    {/* INSPECTOR TAB 1: KONTEN (CONTENT)                         */}
                    {/* --------------------------------------------------------- */}
                    {inspectorTab === 'content' && (
                      <div className="space-y-4 text-xs">
                        {/* 1. HERO SLIDESHOW INSPECTOR */}
                        {selectedBlock.type === 'hero' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">Daftar Slide Hero</span>
                              <button
                                type="button"
                                onClick={handleAddSlide}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Tambah Slide</span>
                              </button>
                            </div>

                            {/* Slide Tabs */}
                            <div className="flex gap-1.5 overflow-x-auto pb-1">
                              {(selectedBlock.content.slides || []).map((s, sIdx) => (
                                <button
                                  key={s.id || sIdx}
                                  type="button"
                                  onClick={() => setActiveSlideIndex(sIdx)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border transition-all ${
                                    activeSlideIndex === sIdx
                                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                      : 'bg-[#12141a] text-slate-400 border-[#262933] hover:text-white'
                                  }`}
                                >
                                  Slide #{sIdx + 1}
                                </button>
                              ))}
                            </div>

                            {/* Active Slide Form */}
                            {selectedBlock.content.slides?.[activeSlideIndex] && (
                              <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#262933] space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                                    Slide #{activeSlideIndex + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteSlide(activeSlideIndex, e)}
                                    className="text-rose-400 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Hapus</span>
                                  </button>
                                </div>

                                <div>
                                  <label className="text-slate-300 font-semibold block mb-1">Badge Teks</label>
                                  <input
                                    type="text"
                                    value={selectedBlock.content.slides[activeSlideIndex].badge || ''}
                                    onChange={(e) => handleUpdateSlide(activeSlideIndex, 'badge', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white"
                                  />
                                </div>

                                <div>
                                  <label className="text-slate-300 font-semibold block mb-1">Judul Headline (H1)</label>
                                  <textarea
                                    rows={2}
                                    value={selectedBlock.content.slides[activeSlideIndex].title || ''}
                                    onChange={(e) => handleUpdateSlide(activeSlideIndex, 'title', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white font-bold"
                                  />
                                </div>

                                <div>
                                  <label className="text-slate-300 font-semibold block mb-1">Deskripsi Subjudul</label>
                                  <textarea
                                    rows={2}
                                    value={selectedBlock.content.slides[activeSlideIndex].subtitle || ''}
                                    onChange={(e) => handleUpdateSlide(activeSlideIndex, 'subtitle', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-slate-300 leading-relaxed"
                                  />
                                </div>

                                <div>
                                  <label className="text-slate-300 font-semibold block mb-1">URL Foto Background</label>
                                  <input
                                    type="text"
                                    value={selectedBlock.content.slides[activeSlideIndex].imageUrl || ''}
                                    onChange={(e) => handleUpdateSlide(activeSlideIndex, 'imageUrl', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white font-mono text-[11px]"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Tombol Utama</label>
                                    <input
                                      type="text"
                                      value={selectedBlock.content.slides[activeSlideIndex].ctaPrimaryText || ''}
                                      onChange={(e) => handleUpdateSlide(activeSlideIndex, 'ctaPrimaryText', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Link URL</label>
                                    <input
                                      type="text"
                                      value={selectedBlock.content.slides[activeSlideIndex].ctaPrimaryLink || ''}
                                      onChange={(e) => handleUpdateSlide(activeSlideIndex, 'ctaPrimaryLink', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white font-mono text-[11px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. FLEET / ARMADA MOBIL INSPECTOR */}
                        {selectedBlock.type === 'fleet' && (
                          <div className="space-y-4">
                            <div className="space-y-2 pb-3 border-b border-[#262933]">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Tagline Section</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.tagline || ''}
                                  onChange={(e) => handleUpdateSelectedContent('tagline', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-[#12141a] border border-[#262933] text-white"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Judul Katalog</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.title || ''}
                                  onChange={(e) => handleUpdateSelectedContent('title', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-[#12141a] border border-[#262933] text-white font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Deskripsi Singkat</label>
                                <textarea
                                  rows={2}
                                  value={selectedBlock.content.subtitle || ''}
                                  onChange={(e) => handleUpdateSelectedContent('subtitle', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-[#12141a] border border-[#262933] text-slate-300 leading-relaxed"
                                />
                              </div>
                            </div>

                            {/* Vehicles Repeater Manager */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">
                                  Daftar Mobil ({selectedBlock.content.vehicles?.length || 0} Unit)
                                </span>
                                <button
                                  type="button"
                                  onClick={handleAddVehicle}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Tambah Mobil</span>
                                </button>
                              </div>

                              {/* Horizontal Vehicle Selector Tabs */}
                              <div className="flex gap-1.5 overflow-x-auto pb-1">
                                {(selectedBlock.content.vehicles || []).map((v, vIdx) => (
                                  <button
                                    key={v.id || vIdx}
                                    type="button"
                                    onClick={() => setActiveCarIndex(vIdx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border transition-all ${
                                      activeCarIndex === vIdx
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                        : 'bg-[#12141a] text-slate-400 border-[#262933] hover:text-white'
                                    }`}
                                  >
                                    {v.name?.split(' ')[1] || `Mobil #${vIdx + 1}`}
                                  </button>
                                ))}
                              </div>

                              {/* Active Vehicle Form */}
                              {selectedBlock.content.vehicles?.[activeCarIndex] && (
                                <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#262933] space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                                      Unit #{activeCarIndex + 1}: {selectedBlock.content.vehicles[activeCarIndex].name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteVehicle(activeCarIndex, e)}
                                      className="text-rose-400 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Hapus</span>
                                    </button>
                                  </div>

                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Nama Mobil Lengkap</label>
                                    <input
                                      type="text"
                                      value={selectedBlock.content.vehicles[activeCarIndex].name || ''}
                                      onChange={(e) => handleUpdateVehicle(activeCarIndex, 'name', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white font-bold"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Kategori</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeCarIndex].category || ''}
                                        onChange={(e) => handleUpdateVehicle(activeCarIndex, 'category', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Badge Highlight</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeCarIndex].badge || ''}
                                        onChange={(e) => handleUpdateVehicle(activeCarIndex, 'badge', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Tarif Lepas Kunci</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeCarIndex].priceLepasKunci || selectedBlock.content.vehicles[activeCarIndex].price || ''}
                                        onChange={(e) => handleUpdateVehicle(activeCarIndex, 'priceLepasKunci', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-emerald-400 font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Tarif + Supir</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeCarIndex].priceWithDriver || ''}
                                        onChange={(e) => handleUpdateVehicle(activeCarIndex, 'priceWithDriver', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-indigo-400 font-bold"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Transmisi</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeCarIndex].transmission || ''}
                                        onChange={(e) => handleUpdateVehicle(activeCarIndex, 'transmission', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Kapasitas</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeCarIndex].capacity || ''}
                                        onChange={(e) => handleUpdateVehicle(activeCarIndex, 'capacity', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Bahan Bakar</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeCarIndex].fuel || ''}
                                        onChange={(e) => handleUpdateVehicle(activeCarIndex, 'fuel', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white text-[11px]"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">URL Foto Mobil</label>
                                    <input
                                      type="text"
                                      value={selectedBlock.content.vehicles[activeCarIndex].image || selectedBlock.content.vehicles[activeCarIndex].imageUrl || ''}
                                      onChange={(e) => handleUpdateVehicle(activeCarIndex, 'image', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white font-mono text-[11px]"
                                    />
                                    {selectedBlock.content.vehicles[activeCarIndex].image && (
                                      <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-[#262933] bg-[#181a20]">
                                        <img
                                          src={selectedBlock.content.vehicles[activeCarIndex].image}
                                          alt="Preview"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 3. FAQ ACCORDION INSPECTOR */}
                        {selectedBlock.type === 'faq' && (
                          <div className="space-y-4">
                            <div className="space-y-2 pb-3 border-b border-[#262933]">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Tagline</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.tagline || ''}
                                  onChange={(e) => handleUpdateSelectedContent('tagline', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-[#12141a] border border-[#262933] text-white"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Judul FAQ</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.title || ''}
                                  onChange={(e) => handleUpdateSelectedContent('title', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-[#12141a] border border-[#262933] text-white font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">
                                  Daftar Tanya Jawab ({selectedBlock.content.faqs?.length || 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={handleAddFaq}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Tambah FAQ</span>
                                </button>
                              </div>

                              {(selectedBlock.content.faqs || []).map((faq, qIdx) => (
                                <div key={qIdx} className="p-3 rounded-xl bg-[#12141a] border border-[#262933] space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-indigo-400 text-xs">FAQ #{qIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteFaq(qIdx, e)}
                                      className="text-rose-400 hover:text-rose-300 text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={faq.q || ''}
                                    onChange={(e) => handleUpdateFaq(qIdx, 'q', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-white font-semibold"
                                    placeholder="Pertanyaan..."
                                  />
                                  <textarea
                                    rows={2}
                                    value={faq.a || ''}
                                    onChange={(e) => handleUpdateFaq(qIdx, 'a', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-[#181a20] border border-[#262933] text-slate-300 text-xs"
                                    placeholder="Jawaban..."
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* --------------------------------------------------------- */}
                    {/* INSPECTOR TAB 2: GAYA (STYLE)                             */}
                    {/* --------------------------------------------------------- */}
                    {inspectorTab === 'style' && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-slate-300 font-semibold block mb-1.5">Penjajaran Teks (Alignment)</label>
                          <div className="grid grid-cols-3 gap-1 bg-[#12141a] p-1 rounded-xl border border-[#262933]">
                            {[
                              { id: 'text-left', icon: AlignLeft, label: 'Kiri' },
                              { id: 'text-center', icon: AlignCenter, label: 'Tengah' },
                              { id: 'text-right', icon: AlignRight, label: 'Kanan' },
                            ].map((align) => {
                              const Icon = align.icon;
                              const isCur = (selectedBlock.style?.textAlign || 'text-left') === align.id;
                              return (
                                <button
                                  key={align.id}
                                  type="button"
                                  onClick={() => handleUpdateSelectedStyle('textAlign', align.id)}
                                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 font-bold ${
                                    isCur ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">{align.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-300 font-semibold block mb-1">Padding Vertikal</label>
                          <select
                            value={selectedBlock.style?.paddingY || 'py-16'}
                            onChange={(e) => handleUpdateSelectedStyle('paddingY', e.target.value)}
                            className="w-full p-2 rounded-lg bg-[#12141a] border border-[#262933] text-white"
                          >
                            <option value="py-8">Kompak (py-8)</option>
                            <option value="py-14">Sedang (py-14)</option>
                            <option value="py-16">Standar (py-16)</option>
                            <option value="py-20">Lega (py-20)</option>
                            <option value="py-28">Ekstra Lega (py-28)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-300 font-semibold block mb-1.5">Warna Latar Section</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedBlock.style?.bgColor || '#ffffff'}
                              onChange={(e) => handleUpdateSelectedStyle('bgColor', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              value={selectedBlock.style?.bgColor || '#ffffff'}
                              onChange={(e) => handleUpdateSelectedStyle('bgColor', e.target.value)}
                              className="flex-1 p-2 rounded-lg bg-[#12141a] border border-[#262933] text-white font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --------------------------------------------------------- */}
                    {/* INSPECTOR TAB 3: LANJUTAN (ADVANCED)                      */}
                    {/* --------------------------------------------------------- */}
                    {inspectorTab === 'advanced' && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-slate-300 font-semibold block mb-1">CSS Class Tambahan</label>
                          <input
                            type="text"
                            placeholder="my-custom-section"
                            className="w-full p-2 rounded-lg bg-[#12141a] border border-[#262933] text-white font-mono text-xs"
                          />
                        </div>
                        <div className="p-3 rounded-xl bg-[#12141a] border border-[#262933] space-y-2">
                          <span className="font-bold text-slate-200 block">Visibilitas Responsif</span>
                          <label className="flex items-center gap-2 text-slate-300">
                            <input type="checkbox" className="rounded bg-slate-800" defaultChecked />
                            <span>Tampilkan di Desktop</span>
                          </label>
                          <label className="flex items-center gap-2 text-slate-300">
                            <input type="checkbox" className="rounded bg-slate-800" defaultChecked />
                            <span>Tampilkan di Tablet</span>
                          </label>
                          <label className="flex items-center gap-2 text-slate-300">
                            <input type="checkbox" className="rounded bg-slate-800" defaultChecked />
                            <span>Tampilkan di Mobile</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-16 text-center space-y-2">
                    <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-300">Pilih Salah Satu Section</h4>
                    <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                      Klik bagian apa saja di kanvas tengah untuk langsung mengedit konten dan gayanya.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* --------------------------------------------------------------------- */}
        {/* CENTER LIVE INTERACTIVE ELEMENTOR CANVAS                              */}
        {/* --------------------------------------------------------------------- */}
        <main className="flex-1 bg-[#12141a] p-4 lg:p-6 overflow-hidden flex flex-col justify-between">
          <ThemePreviewCanvas
            defaultDevice={canvasDevice}
            onDeviceChange={setCanvasDevice}
            title="Elementor Canvas Studio"
            customHeight="h-[calc(100vh-140px)] max-h-[88vh]"
          >
            {/* Dynamic Page Blocks Renderer with Elementor Hover Outlines */}
            <div
              style={{ fontFamily: globalTokens.fontFamily }}
              className="w-full bg-white text-slate-900 relative"
            >
              {blocks.map((block, idx) => {
                const isSelected = selectedBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    onClick={() => handleSelectBlock(block.id)}
                    className={`relative group cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-500 ring-inset shadow-xl'
                        : 'hover:ring-1 hover:ring-blue-400 hover:ring-inset'
                    }`}
                  >
                    {/* Elementor Iconic Top Center Section Handle Pill: [ + ] [ ::: ] [ ✕ ] */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-blue-600 rounded-full px-3 py-1 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPanelView('widgets');
                        }}
                        className="hover:scale-125 transition-transform"
                        title="Tambah Section Baru"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="cursor-grab hover:scale-110 transition-transform" title="Pilih Section">
                        <Grid className="w-3.5 h-3.5" />
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteBlock(idx, e)}
                        className="hover:scale-125 text-rose-200 hover:text-white transition-transform"
                        title="Hapus Section Ini"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Top Right Quick Edit Pencil Icon */}
                    <div className="absolute top-2 right-4 z-40 bg-blue-600 rounded-lg p-1.5 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Paintbrush className="w-3.5 h-3.5" />
                    </div>

                    {/* 1. HERO BLOCK */}
                    {block.type === 'hero' && (() => {
                      const curSlide = block.content.slides?.[activeSlideIndex] || block.content.slides?.[0] || {
                        badge: 'Layanan VIP Rental 24 Jam',
                        title: 'Perjalanan Mewah & Berkelas',
                        subtitle: 'Armada tahun terbaru siap melayani Anda.',
                        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600',
                        ctaPrimaryText: 'Pilih Armada',
                        ctaSecondaryText: 'WhatsApp',
                      };

                      return (
                        <section
                          className={`relative min-h-[500px] flex flex-col justify-center text-white px-6 sm:px-12 ${block.style?.paddingY || 'py-20'} overflow-hidden`}
                          style={{ backgroundColor: block.style?.bgColor || '#090d16' }}
                        >
                          <img
                            src={curSlide.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600'}
                            alt={curSlide.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-transparent"
                            style={{ opacity: (block.content.overlayOpacity || 50) / 100 }}
                          />
                          <div className={`relative z-10 max-w-2xl space-y-4 ${block.style?.textAlign || 'text-left'}`}>
                            {curSlide.badge && (
                              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-xs font-bold text-white shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>{curSlide.badge}</span>
                              </div>
                            )}
                            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
                              {curSlide.title}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow-sm">
                              {curSlide.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                              <button
                                type="button"
                                className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-xl flex items-center gap-2"
                                style={{ backgroundColor: globalTokens.primaryColor }}
                              >
                                <span>{curSlide.ctaPrimaryText || 'Pilih Armada Mobil'}</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              {curSlide.ctaSecondaryText && (
                                <button
                                  type="button"
                                  className="px-6 py-3 rounded-xl font-bold text-xs text-white backdrop-blur-md bg-white/20 border border-white/30"
                                >
                                  <span>{curSlide.ctaSecondaryText}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </section>
                      );
                    })()}

                    {/* 2. FEATURES BLOCK */}
                    {block.type === 'features' && (
                      <section
                        className={`px-6 sm:px-12 ${block.style?.paddingY || 'py-16'}`}
                        style={{ backgroundColor: block.style?.bgColor || '#ffffff' }}
                      >
                        <div className={`max-w-6xl mx-auto space-y-10 ${block.style?.textAlign || 'text-center'}`}>
                          <div>
                            <span
                              className="text-xs font-extrabold uppercase tracking-wider block mb-1"
                              style={{ color: globalTokens.primaryColor }}
                            >
                              {block.content.tagline}
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                              {block.content.title}
                            </h2>
                            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
                              {block.content.subtitle}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                            {(block.content.items || []).map((feat, fIdx) => (
                              <div
                                key={fIdx}
                                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-2.5"
                              >
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                                  style={{ backgroundColor: globalTokens.primaryColor }}
                                >
                                  {fIdx + 1}
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">{feat.title}</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {/* 3. FLEET / ARMADA MOBIL BLOCK */}
                    {block.type === 'fleet' && (
                      <section
                        className={`px-6 sm:px-12 ${block.style?.paddingY || 'py-16'}`}
                        style={{ backgroundColor: block.style?.bgColor || '#f8fafc' }}
                      >
                        <div className={`max-w-6xl mx-auto space-y-8 ${block.style?.textAlign || 'text-left'}`}>
                          <div>
                            <span
                              className="text-xs font-extrabold uppercase tracking-wider block mb-1"
                              style={{ color: globalTokens.primaryColor }}
                            >
                              {block.content.tagline}
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                              {block.content.title}
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">{block.content.subtitle}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {(block.content.vehicles || []).map((v, vIdx) => (
                              <div
                                key={v.id || vIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectBlock(block.id);
                                  setActiveCarIndex(vIdx);
                                }}
                                className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs space-y-3 p-4 hover:shadow-lg ${
                                  activeCarIndex === vIdx ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200'
                                }`}
                              >
                                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative">
                                  <img
                                    src={v.image || v.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'}
                                    alt={v.name}
                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                  />
                                  {v.badge && (
                                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold shadow-md">
                                      {v.badge}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {v.category}
                                  </span>
                                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{v.name}</h4>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                                    <div>
                                      <span className="text-[10px] text-slate-400 block">Lepas Kunci:</span>
                                      <p className="text-xs font-bold text-indigo-600">
                                        {v.priceLepasKunci || v.price || 'Hubungi CS'}
                                      </p>
                                    </div>
                                    {v.priceWithDriver && (
                                      <div className="text-right">
                                        <span className="text-[10px] text-slate-400 block">+ Supir:</span>
                                        <p className="text-xs font-bold text-emerald-600">
                                          {v.priceWithDriver}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {/* 4. FAQ BLOCK */}
                    {block.type === 'faq' && (
                      <section
                        className={`px-6 sm:px-12 ${block.style?.paddingY || 'py-16'}`}
                        style={{ backgroundColor: block.style?.bgColor || '#ffffff' }}
                      >
                        <div className={`max-w-3xl mx-auto space-y-6 ${block.style?.textAlign || 'text-left'}`}>
                          <div className="text-center space-y-1">
                            <span
                              className="text-xs font-extrabold uppercase tracking-wider block"
                              style={{ color: globalTokens.primaryColor }}
                            >
                              {block.content.tagline}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">{block.content.title}</h2>
                            <p className="text-xs text-slate-600">{block.content.subtitle}</p>
                          </div>
                          <div className="space-y-3">
                            {(block.content.faqs || []).map((faq, qIdx) => (
                              <div key={qIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 shadow-2xs">
                                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                                    Q
                                  </span>
                                  <span>{faq.q}</span>
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.a}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                );
              })}

              {/* Bottom Add Section Dropzone */}
              <div
                onClick={() => setPanelView('widgets')}
                className="my-8 mx-6 sm:mx-12 p-8 border-2 border-dashed border-indigo-400/50 hover:border-indigo-600 rounded-3xl bg-indigo-50/50 hover:bg-indigo-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-indigo-950 group-hover:text-indigo-600">
                  Tambah Section / Widget Baru
                </span>
                <span className="text-xs text-slate-500">Klik untuk membuka katalog widget Elementor Pro</span>
              </div>
            </div>
          </ThemePreviewCanvas>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. THEME PRESET LIBRARY MODAL                                             */}
      {/* ========================================================================= */}
      {themeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#181a20] border border-[#262933] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#262933] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Folder className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Katalog Tema Preset WordPress Resmi</h3>
                  <p className="text-xs text-slate-400">Pilih tema untuk menerapkan tata letak, warna, dan font ke kanvas Elementor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setThemeModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(WP_THEMES || []).map((t) => {
                const isCur = activeThemeId === t.id;
                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl border overflow-hidden transition-all bg-[#12141a] flex flex-col justify-between ${
                      isCur ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-[#262933] hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="aspect-[16/10] bg-slate-900 overflow-hidden relative">
                        <img src={t.screenshot} alt={t.name} className="w-full h-full object-cover" />
                        {isCur && (
                          <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Tema Aktif</span>
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h4 className="font-bold text-sm text-white">{t.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{t.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => handleApplyThemePreset(t)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          isCur
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isCur ? 'Sedang Digunakan' : 'Terapkan Tema Ini'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
