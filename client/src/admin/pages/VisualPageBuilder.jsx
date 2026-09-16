import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Monitor, Tablet, Smartphone, Save, ArrowLeft, Eye, Undo2, Redo2,
  Sparkles, Layers, Sliders, Palette, Search, Check, ChevronDown,
  ChevronRight, Plus, Trash2, Image, Type, Car, CheckCircle2,
  AlertCircle, RefreshCw, ExternalLink, HelpCircle, Shield, Globe,
  MessageCircle, Copy, ArrowUp, ArrowDown, Move, Settings, CheckCheck,
  ShoppingBag, Star, DollarSign, Award, SlidersHorizontal, EyeOff,
  SearchCheck, AlignLeft, AlignCenter, AlignRight, Tag, Fuel,
  Users, Briefcase, Zap, Phone, CheckSquare
} from 'lucide-react';
import ThemePreviewCanvas from '../components/ThemePreviewCanvas';
import { saveAdminPage } from '../../utils/api';

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
        { title: 'Unit Bersih & Terawat', desc: 'Dibersihkan dan disterilkan secara menyeluruh sebelum keberangkatan.' },
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

const WIDGET_CATALOG = [
  { type: 'hero', label: 'Hero Section', desc: 'Banner slideshow visual dengan tombol CTA ganda', icon: Sparkles },
  { type: 'fleet', label: 'Katalog Armada', desc: 'Grid kartu mobil dengan filter kategori & harga', icon: Car },
  { type: 'features', label: 'Fitur Keunggulan', desc: 'Bento grid kartu standar layanan VIP', icon: Award },
  { type: 'pricing', label: 'Tabel Paket Harga', desc: 'Kalkulator sewa harian, bulanan & supir', icon: DollarSign },
  { type: 'testimonials', label: 'Testimonial Klien', desc: 'Review bintang lima dari pelanggan eksekutif', icon: Star },
  { type: 'faq', label: 'FAQ Accordion', desc: 'Tanya jawab interaktif syarat rental', icon: HelpCircle },
  { type: 'whatsapp', label: 'Sticky WhatsApp Bar', desc: 'Tombol kontak melayang 24 jam CS', icon: MessageCircle },
];

export default function VisualPageBuilder({
  page = null,
  onBack = () => {},
  onSaved = () => {},
}) {
  // Normalize initial blocks from page or defaults
  const initialBlocks = useMemo(() => {
    if (page?.blocks && page.blocks.length > 0) {
      return page.blocks.map((b) => ({
        ...b,
        content: b.content || b.props || {},
        style: b.style || b.styles || {},
      }));
    }
    return DEFAULT_BLOCKS;
  }, [page]);

  // --- Core Page State ---
  const [blocks, setBlocks] = useState(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState(initialBlocks[0]?.id || null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('inspector'); // 'widgets' | 'inspector' | 'settings' | 'style' | 'seo'
  const [inspectorSubTab, setInspectorSubTab] = useState('content'); // 'content' | 'style'

  // Sub-item active tabs (e.g. active slide index, active vehicle index)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);

  // --- Global Styling & Design Tokens ---
  const [globalTokens, setGlobalTokens] = useState({
    primaryColor: page?.styling?.primaryColor || '#4f46e5',
    accentColor: page?.styling?.accentColor || '#f59e0b',
    fontFamily: page?.styling?.fontFamily || 'Inter, system-ui, sans-serif',
    cardRadius: page?.styling?.cardRadius || 'rounded-2xl',
  });

  // --- Page Metadata ---
  const [pageMeta, setPageMeta] = useState({
    title: page?.title || 'Samudera VIP Transport - Rental Mobil Mewah',
    slug: page?.slug || 'home',
    status: page?.status || 'published',
  });

  // --- SEO Data ---
  const [seoData, setSeoData] = useState({
    title: page?.seo?.title || page?.metaTitle || 'Rental Mobil Mewah Jakarta 24 Jam',
    description: page?.seo?.description || page?.metaDescription || 'Sewa Alphard, Innova Zenix, dan Hiace Premio terbaik.',
    focusKeyword: page?.seo?.focusKeyword || page?.seo?.keywords?.split(',')[0]?.trim() || 'Rental Mobil Mewah',
  });

  // --- Canvas Device State ---
  const [canvasDevice, setCanvasDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  // --- History Stack (Undo / Redo) ---
  const [history, setHistory] = useState([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // --- Save State ---
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotification, setSaveNotification] = useState('');

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

  // --- Block Selection & Manipulation ---
  const handleSelectBlock = (id) => {
    setSelectedBlockId(id);
    setActiveInspectorTab('inspector');
  };

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
              badge: 'Armada Siap Jalan',
              title: 'Kemewahan Perjalanan Tanpa Kompromi',
              subtitle: 'Kabin bersih, unit terawat, supir ramah berpengalaman.',
              imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600&auto=format&fit=crop',
              ctaPrimaryText: 'Pilih Armada',
              ctaPrimaryLink: '#fleet',
              ctaSecondaryText: 'WhatsApp',
              ctaSecondaryLink: 'https://wa.me/6281234567890',
            },
          ],
        },
        style: { paddingY: 'py-20', bgColor: '#090d16', textColor: '#ffffff', textAlign: 'text-left' },
      };
    } else if (type === 'fleet') {
      newBlock = {
        id: newId,
        type: 'fleet',
        label: 'Katalog Armada',
        icon: Car,
        content: {
          tagline: 'Katalog Armada',
          title: 'Pilihan Unit Rental Terbaik',
          subtitle: 'Kondisi prima dengan tarif harian terjangkau.',
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
              description: 'Nyaman untuk perjalanan keluarga dan kunjungan dinas.',
            },
          ],
        },
        style: { paddingY: 'py-16', bgColor: '#f8fafc', textColor: '#0f172a', textAlign: 'text-left' },
      };
    } else if (type === 'features') {
      newBlock = {
        id: newId,
        type: 'features',
        label: 'Keunggulan Layanan',
        icon: Award,
        content: {
          tagline: 'Keunggulan Kami',
          title: 'Standar Pelayanan Bintang Lima',
          subtitle: 'Kenyamanan perjalanan Anda adalah prioritas utama kami.',
          items: [
            { title: 'Armada Terbaru & Bersih', desc: 'Seluruh unit terawat prima dan steril.' },
            { title: 'Supir Berpengalaman', desc: 'Driver profesional menguasai rute.' },
          ],
        },
        style: { paddingY: 'py-16', bgColor: '#ffffff', textColor: '#0f172a', textAlign: 'text-center' },
      };
    } else if (type === 'faq') {
      newBlock = {
        id: newId,
        type: 'faq',
        label: 'FAQ Accordion',
        icon: HelpCircle,
        content: {
          tagline: 'FAQ Rental',
          title: 'Pertanyaan yang Sering Diajukan',
          subtitle: 'Jawaban atas pertanyaan seputar sewa mobil kami.',
          faqs: [
            { q: 'Bagaimana cara booking unit mobil?', a: 'Cukup klik tombol WhatsApp atau pilih unit di halaman ini.' },
          ],
        },
        style: { paddingY: 'py-16', bgColor: '#ffffff', textColor: '#0f172a', textAlign: 'text-left' },
      };
    } else if (type === 'pricing') {
      newBlock = {
        id: newId,
        type: 'pricing',
        label: 'Paket Harga Rental',
        icon: DollarSign,
        content: {
          title: 'Tarif Sewa Bersahabat',
          subtitle: 'Pilihan paket sewa 12 jam, 24 jam, atau bulanan dengan harga transparan.',
          plans: [
            { name: 'Paket Harian (12 Jam)', price: 'Rp 650.000', desc: 'Cocok untuk kunjungan dinas & city tour Jakarta.' },
            { name: 'Paket Full Day (24 Jam)', price: 'Rp 950.000', desc: 'Bebas keliling seharian penuh tanpa buru-buru.' },
          ],
        },
        style: { paddingY: 'py-16', bgColor: '#f8fafc', textColor: '#0f172a', textAlign: 'text-center' },
      };
    } else {
      newBlock = {
        id: newId,
        type,
        label: `Section ${type.toUpperCase()}`,
        icon: Layers,
        content: { title: `Judul Section ${type}`, subtitle: 'Deskripsi section dapat diatur di inspector kiri.' },
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

  // Selected active block
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

  // --- SUB-ITEM EDITORS (Vehicles, Slides, Features, FAQs) ---
  // 1. Vehicle Fleet Items
  const handleAddVehicle = () => {
    if (!selectedBlock || selectedBlock.type !== 'fleet') return;
    const currentVehicles = selectedBlock.content.vehicles || [];
    const newCar = {
      id: `v-${Date.now()}`,
      name: 'Toyota All New Avanza 2024',
      category: 'MPV Keluarga',
      priceLepasKunci: 'Rp 450.000 / hari',
      priceWithDriver: 'Rp 650.000 / hari',
      transmission: 'Matic CVT',
      capacity: '7 Kursi',
      fuel: 'Bensin Irit',
      badge: 'Unit Baru',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      description: 'Pilihan hemat dan nyaman untuk keliling kota bersama keluarga.',
    };
    const updatedVehicles = [...currentVehicles, newCar];
    handleUpdateSelectedContent('vehicles', updatedVehicles);
    setActiveVehicleIndex(updatedVehicles.length - 1);
  };

  const handleUpdateVehicle = (idx, field, value) => {
    if (!selectedBlock || selectedBlock.type !== 'fleet') return;
    const currentVehicles = [...(selectedBlock.content.vehicles || [])];
    if (currentVehicles[idx]) {
      currentVehicles[idx] = { ...currentVehicles[idx], [field]: value };
      handleUpdateSelectedContent('vehicles', currentVehicles);
    }
  };

  const handleDeleteVehicle = (idx, e) => {
    e?.stopPropagation();
    if (!selectedBlock || selectedBlock.type !== 'fleet') return;
    const currentVehicles = selectedBlock.content.vehicles || [];
    if (currentVehicles.length <= 1) {
      alert('Minimal harus ada 1 kendaraan di katalog.');
      return;
    }
    const updatedVehicles = currentVehicles.filter((_, i) => i !== idx);
    handleUpdateSelectedContent('vehicles', updatedVehicles);
    if (activeVehicleIndex >= updatedVehicles.length) {
      setActiveVehicleIndex(updatedVehicles.length - 1);
    }
  };

  // 2. Hero Slides
  const handleAddSlide = () => {
    if (!selectedBlock || selectedBlock.type !== 'hero') return;
    const currentSlides = selectedBlock.content.slides || [];
    const newSlide = {
      id: `s-${Date.now()}`,
      badge: 'Armada Baru 2025 • Siap Melayani',
      title: 'Perjalanan Nyaman Tanpa Kompromi',
      subtitle: 'Siap melayani sewa harian, mingguan, atau bulanan dengan harga terbaik.',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop',
      ctaPrimaryText: 'Pilih Armada Mobil',
      ctaPrimaryLink: '#fleet',
      ctaSecondaryText: 'Chat WhatsApp 24 Jam',
      ctaSecondaryLink: 'https://wa.me/6281234567890',
    };
    const updatedSlides = [...currentSlides, newSlide];
    handleUpdateSelectedContent('slides', updatedSlides);
    setActiveSlideIndex(updatedSlides.length - 1);
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
    const updatedSlides = currentSlides.filter((_, i) => i !== idx);
    handleUpdateSelectedContent('slides', updatedSlides);
    if (activeSlideIndex >= updatedSlides.length) {
      setActiveSlideIndex(updatedSlides.length - 1);
    }
  };

  // 3. Feature Items
  const handleAddFeatureItem = () => {
    if (!selectedBlock || selectedBlock.type !== 'features') return;
    const currentItems = selectedBlock.content.items || [];
    const newItem = {
      title: 'Pelayanan Prima 24 Jam',
      desc: 'Customer service kami siap membantu pemesanan kapan saja.',
    };
    handleUpdateSelectedContent('items', [...currentItems, newItem]);
  };

  const handleUpdateFeatureItem = (idx, field, value) => {
    if (!selectedBlock || selectedBlock.type !== 'features') return;
    const currentItems = [...(selectedBlock.content.items || [])];
    if (currentItems[idx]) {
      currentItems[idx] = { ...currentItems[idx], [field]: value };
      handleUpdateSelectedContent('items', currentItems);
    }
  };

  const handleDeleteFeatureItem = (idx, e) => {
    e?.stopPropagation();
    if (!selectedBlock || selectedBlock.type !== 'features') return;
    const currentItems = selectedBlock.content.items || [];
    if (currentItems.length <= 1) {
      alert('Minimal harus ada 1 keunggulan.');
      return;
    }
    handleUpdateSelectedContent('items', currentItems.filter((_, i) => i !== idx));
  };

  // 4. FAQ Items
  const handleAddFaqItem = () => {
    if (!selectedBlock || selectedBlock.type !== 'faq') return;
    const currentFaqs = selectedBlock.content.faqs || [];
    const newFaq = {
      q: 'Apakah harga sudah termasuk BBM dan supir?',
      a: 'Tersedia pilihan lepas kunci (tanpa supir) atau all-in (dengan supir & BBM). Hubungi kami untuk detail paket.',
    };
    handleUpdateSelectedContent('faqs', [...currentFaqs, newFaq]);
  };

  const handleUpdateFaqItem = (idx, field, value) => {
    if (!selectedBlock || selectedBlock.type !== 'faq') return;
    const currentFaqs = [...(selectedBlock.content.faqs || [])];
    if (currentFaqs[idx]) {
      currentFaqs[idx] = { ...currentFaqs[idx], [field]: value };
      handleUpdateSelectedContent('faqs', currentFaqs);
    }
  };

  const handleDeleteFaqItem = (idx, e) => {
    e?.stopPropagation();
    if (!selectedBlock || selectedBlock.type !== 'faq') return;
    const currentFaqs = selectedBlock.content.faqs || [];
    if (currentFaqs.length <= 1) {
      alert('Minimal harus ada 1 FAQ.');
      return;
    }
    handleUpdateSelectedContent('faqs', currentFaqs.filter((_, i) => i !== idx));
  };

  // --- SAVE / PUBLISH HANDLER ---
  const handlePublish = async () => {
    setIsSaving(true);
    setSaveNotification('');
    try {
      // Find hero and fleet blocks to sync top-level landing schema
      const heroB = blocks.find((b) => b.type === 'hero' || b.type === 'hero-slider');
      const fleetB = blocks.find((b) => b.type === 'fleet' || b.type === 'fleet-catalog');

      const payload = {
        ...page,
        id: page?.id || `page_${Date.now()}`,
        title: pageMeta.title,
        slug: pageMeta.slug,
        status: pageMeta.status,
        blocks: blocks.map((b) => ({
          ...b,
          props: b.content,
          styles: b.style,
        })),
        styling: globalTokens,
        seo: seoData,
        hero: heroB ? {
          mode: heroB.content.mode || 'slideshow',
          autoplayInterval: heroB.content.autoplayInterval || 5,
          overlayOpacity: heroB.content.overlayOpacity || 50,
          slides: heroB.content.slides || [
            {
              id: 's1',
              badge: heroB.content.badge || 'Layanan VIP 24 Jam',
              title: heroB.content.title || 'Perjalanan Mewah',
              subtitle: heroB.content.subtitle || '',
              imageUrl: heroB.content.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600',
              ctaPrimaryText: heroB.content.ctaPrimaryText || 'Pilih Armada',
              ctaPrimaryLink: heroB.content.ctaPrimaryLink || '#fleet',
              ctaSecondaryText: heroB.content.ctaSecondaryText || 'WhatsApp',
              ctaSecondaryLink: heroB.content.ctaSecondaryLink || 'https://wa.me/6281234567890',
            }
          ],
        } : page?.hero,
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
        } : page?.fleet,
      };

      const saved = await saveAdminPage(payload);
      if (onSaved) onSaved(saved);
      setSaveNotification('Perubahan halaman & armada berhasil disimpan!');
      setTimeout(() => setSaveNotification(''), 4000);
    } catch (err) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col font-sans antialiased select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP DOCKED HEADER BAR (Elementor Pro Studio Header)                     */}
      {/* ========================================================================= */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30 shadow-md">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Kembali ke Daftar Halaman"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/30">
              E
            </span>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block leading-tight">
                {pageMeta.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block">/{pageMeta.slug}</span>
            </div>
          </div>
        </div>

        {/* Center: Undo/Redo & Responsive Device Switcher */}
        <div className="flex items-center gap-4">
          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none"
              title="Undo (Kembalikan)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none"
              title="Redo (Ulangi)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
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

        {/* Right: Status & Publish Button */}
        <div className="flex items-center gap-3">
          {saveNotification && (
            <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{saveNotification}</span>
            </span>
          )}

          <a
            href={pageMeta.slug === 'home' ? '/' : `/?page=${pageMeta.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <span>Buka Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            disabled={isSaving}
            onClick={handlePublish}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Menyimpan...' : 'Publish Perubahan'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 3-PANEL BODY (Left Docked Inspector + Center Live Canvas)         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* --------------------------------------------------------------------- */}
        {/* LEFT DOCKED PANEL (w-88 / 350px) - Elementor Pro Deep Inspector       */}
        {/* --------------------------------------------------------------------- */}
        <aside className="w-88 sm:w-96 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-20 overflow-hidden shadow-2xl">
          {/* Main Inspector Nav Bar */}
          <div className="grid grid-cols-5 bg-slate-950 p-1 border-b border-slate-800 text-[11px] font-bold text-slate-400">
            {[
              { id: 'inspector', label: 'Konten', icon: Sliders },
              { id: 'widgets', label: 'Elemen', icon: Layers },
              { id: 'style', label: 'Tema', icon: Palette },
              { id: 'settings', label: 'Halaman', icon: Settings },
              { id: 'seo', label: 'SEO', icon: SearchCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeInspectorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveInspectorTab(tab.id)}
                  className={`py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
                    isActive ? 'bg-slate-800 text-indigo-400 font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Panel Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ----------------------------------------------------------------- */}
            {/* TAB 1: INSPECTOR (DEEP CONTENT & CAR MANAGER)                     */}
            {/* ----------------------------------------------------------------- */}
            {activeInspectorTab === 'inspector' && (
              <div className="space-y-4">
                {selectedBlock ? (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                          <Sliders className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-indigo-400 block tracking-wider">
                            Edit Blok Aktif:
                          </span>
                          <h3 className="text-xs font-bold text-white truncate max-w-[190px]">
                            {selectedBlock.label}
                          </h3>
                        </div>
                      </div>

                      {/* Sub-tab switcher: Konten vs Gaya */}
                      <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setInspectorSubTab('content')}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            inspectorSubTab === 'content' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Konten
                        </button>
                        <button
                          type="button"
                          onClick={() => setInspectorSubTab('style')}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            inspectorSubTab === 'style' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Gaya
                        </button>
                      </div>
                    </div>

                    {/* --- KONTEN SUB-TAB --- */}
                    {inspectorSubTab === 'content' && (
                      <div className="space-y-4 text-xs">
                        {/* 1. HERO BLOCK INSPECTOR */}
                        {selectedBlock.type === 'hero' && (
                          <div className="space-y-4">
                            {/* Slide Manager */}
                            <div className="space-y-2">
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

                              <div className="flex gap-1.5 overflow-x-auto pb-1">
                                {(selectedBlock.content.slides || []).map((s, sIdx) => (
                                  <button
                                    key={s.id || sIdx}
                                    type="button"
                                    onClick={() => setActiveSlideIndex(sIdx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border transition-all ${
                                      activeSlideIndex === sIdx
                                        ? 'bg-indigo-600 text-white border-indigo-500'
                                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                    }`}
                                  >
                                    Slide #{sIdx + 1}
                                  </button>
                                ))}
                              </div>

                              {/* Active Slide Form */}
                              {selectedBlock.content.slides?.[activeSlideIndex] && (
                                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
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
                                      <span>Hapus Slide</span>
                                    </button>
                                  </div>

                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Badge Teks</label>
                                    <input
                                      type="text"
                                      value={selectedBlock.content.slides[activeSlideIndex].badge || ''}
                                      onChange={(e) => handleUpdateSlide(activeSlideIndex, 'badge', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                                      placeholder="Layanan VIP Rental 24 Jam"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Judul Headline (H1)</label>
                                    <textarea
                                      rows={2}
                                      value={selectedBlock.content.slides[activeSlideIndex].title || ''}
                                      onChange={(e) => handleUpdateSlide(activeSlideIndex, 'title', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold leading-snug"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Subjudul / Deskripsi</label>
                                    <textarea
                                      rows={2}
                                      value={selectedBlock.content.slides[activeSlideIndex].subtitle || ''}
                                      onChange={(e) => handleUpdateSlide(activeSlideIndex, 'subtitle', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 leading-relaxed"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Foto Latar (URL)</label>
                                    <input
                                      type="text"
                                      value={selectedBlock.content.slides[activeSlideIndex].imageUrl || ''}
                                      onChange={(e) => handleUpdateSlide(activeSlideIndex, 'imageUrl', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Tombol Utama</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.slides[activeSlideIndex].ctaPrimaryText || ''}
                                        onChange={(e) => handleUpdateSlide(activeSlideIndex, 'ctaPrimaryText', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Link URL</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.slides[activeSlideIndex].ctaPrimaryLink || ''}
                                        onChange={(e) => handleUpdateSlide(activeSlideIndex, 'ctaPrimaryLink', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 2. FLEET / ARMADA MOBIL INSPECTOR (DEEP CAR EDITOR) */}
                        {selectedBlock.type === 'fleet' && (
                          <div className="space-y-4">
                            {/* Section Header */}
                            <div className="space-y-2 pb-3 border-b border-slate-800">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Tagline Section</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.tagline || ''}
                                  onChange={(e) => handleUpdateSelectedContent('tagline', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Judul Katalog</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.title || ''}
                                  onChange={(e) => handleUpdateSelectedContent('title', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Deskripsi Singkat</label>
                                <textarea
                                  rows={2}
                                  value={selectedBlock.content.subtitle || ''}
                                  onChange={(e) => handleUpdateSelectedContent('subtitle', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed"
                                />
                              </div>
                            </div>

                            {/* Vehicles List Manager */}
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
                                    onClick={() => setActiveVehicleIndex(vIdx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border transition-all ${
                                      activeVehicleIndex === vIdx
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                    }`}
                                  >
                                    {v.name?.split(' ')[1] || `Mobil #${vIdx + 1}`}
                                  </button>
                                ))}
                              </div>

                              {/* Active Vehicle Deep Inspector Form */}
                              {selectedBlock.content.vehicles?.[activeVehicleIndex] && (
                                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                                      Unit #{activeVehicleIndex + 1}: {selectedBlock.content.vehicles[activeVehicleIndex].name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteVehicle(activeVehicleIndex, e)}
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
                                      value={selectedBlock.content.vehicles[activeVehicleIndex].name || ''}
                                      onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'name', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                                      placeholder="Toyota Alphard Transformer VIP"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Kategori</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeVehicleIndex].category || ''}
                                        onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'category', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                                        placeholder="VIP Luxury"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Badge Highlight</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeVehicleIndex].badge || ''}
                                        onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'badge', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                                        placeholder="Paling Populer"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Harga Lepas Kunci</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeVehicleIndex].priceLepasKunci || selectedBlock.content.vehicles[activeVehicleIndex].price || ''}
                                        onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'priceLepasKunci', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-bold"
                                        placeholder="Rp 750.000 / hari"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Harga + Supir</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeVehicleIndex].priceWithDriver || ''}
                                        onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'priceWithDriver', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-indigo-400 font-bold"
                                        placeholder="Rp 950.000 / hari"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Transmisi</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeVehicleIndex].transmission || ''}
                                        onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'transmission', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]"
                                        placeholder="Matic"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Kapasitas</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeVehicleIndex].capacity || ''}
                                        onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'capacity', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]"
                                        placeholder="7 Kursi"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-300 font-semibold block mb-1">Bahan Bakar</label>
                                      <input
                                        type="text"
                                        value={selectedBlock.content.vehicles[activeVehicleIndex].fuel || ''}
                                        onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'fuel', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]"
                                        placeholder="Bensin"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-slate-300 font-semibold block mb-1">Foto Mobil (URL Gambar)</label>
                                    <input
                                      type="text"
                                      value={selectedBlock.content.vehicles[activeVehicleIndex].image || selectedBlock.content.vehicles[activeVehicleIndex].imageUrl || ''}
                                      onChange={(e) => handleUpdateVehicle(activeVehicleIndex, 'image', e.target.value)}
                                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                                    />
                                    {selectedBlock.content.vehicles[activeVehicleIndex].image && (
                                      <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                                        <img
                                          src={selectedBlock.content.vehicles[activeVehicleIndex].image}
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

                        {/* 3. FEATURES / KEUNGGULAN INSPECTOR */}
                        {selectedBlock.type === 'features' && (
                          <div className="space-y-4">
                            <div className="space-y-2 pb-3 border-b border-slate-800">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Tagline</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.tagline || ''}
                                  onChange={(e) => handleUpdateSelectedContent('tagline', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Judul Keunggulan</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.title || ''}
                                  onChange={(e) => handleUpdateSelectedContent('title', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Subjudul</label>
                                <textarea
                                  rows={2}
                                  value={selectedBlock.content.subtitle || ''}
                                  onChange={(e) => handleUpdateSelectedContent('subtitle', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">
                                  Daftar Poin Keunggulan ({selectedBlock.content.items?.length || 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={handleAddFeatureItem}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Tambah Poin</span>
                                </button>
                              </div>

                              {(selectedBlock.content.items || []).map((feat, fIdx) => (
                                <div key={fIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-indigo-400 text-xs">Poin #{fIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteFeatureItem(fIdx, e)}
                                      className="text-rose-400 hover:text-rose-300 text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={feat.title || ''}
                                    onChange={(e) => handleUpdateFeatureItem(fIdx, 'title', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold"
                                    placeholder="Judul Poin"
                                  />
                                  <textarea
                                    rows={2}
                                    value={feat.desc || ''}
                                    onChange={(e) => handleUpdateFeatureItem(fIdx, 'desc', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs"
                                    placeholder="Deskripsi keunggulan..."
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. FAQ ACCORDION INSPECTOR */}
                        {selectedBlock.type === 'faq' && (
                          <div className="space-y-4">
                            <div className="space-y-2 pb-3 border-b border-slate-800">
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Tagline FAQ</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.tagline || ''}
                                  onChange={(e) => handleUpdateSelectedContent('tagline', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Judul FAQ</label>
                                <input
                                  type="text"
                                  value={selectedBlock.content.title || ''}
                                  onChange={(e) => handleUpdateSelectedContent('title', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-slate-300 font-semibold block mb-1">Subjudul</label>
                                <textarea
                                  rows={2}
                                  value={selectedBlock.content.subtitle || ''}
                                  onChange={(e) => handleUpdateSelectedContent('subtitle', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed"
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
                                  onClick={handleAddFaqItem}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Tambah FAQ</span>
                                </button>
                              </div>

                              {(selectedBlock.content.faqs || []).map((faq, qIdx) => (
                                <div key={qIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-indigo-400 text-xs">Pertanyaan #{qIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteFaqItem(qIdx, e)}
                                      className="text-rose-400 hover:text-rose-300 text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={faq.q || ''}
                                    onChange={(e) => handleUpdateFaqItem(qIdx, 'q', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold"
                                    placeholder="Pertanyaan..."
                                  />
                                  <textarea
                                    rows={2}
                                    value={faq.a || ''}
                                    onChange={(e) => handleUpdateFaqItem(qIdx, 'a', e.target.value)}
                                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs"
                                    placeholder="Jawaban lengkap..."
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5. GENERIC FALLBACK CONTENT FIELDS */}
                        {!['hero', 'fleet', 'features', 'faq'].includes(selectedBlock.type) && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Judul Section</label>
                              <input
                                type="text"
                                value={selectedBlock.content.title || ''}
                                onChange={(e) => handleUpdateSelectedContent('title', e.target.value)}
                                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-slate-300 font-semibold block mb-1">Deskripsi</label>
                              <textarea
                                rows={3}
                                value={selectedBlock.content.subtitle || ''}
                                onChange={(e) => handleUpdateSelectedContent('subtitle', e.target.value)}
                                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* --- STYLE SUB-TAB (Elementor Pro Styling & Layout) --- */}
                    {inspectorSubTab === 'style' && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-slate-300 font-semibold block mb-1.5">Penjajaran Teks (Alignment)</label>
                          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
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
                            className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
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
                              className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                            />
                          </div>

                          {/* Quick Swatches */}
                          <div className="flex items-center gap-1.5 mt-2">
                            {['#ffffff', '#f8fafc', '#090d16', '#0f172a', '#1e1b4b'].map((hex) => (
                              <button
                                key={hex}
                                type="button"
                                onClick={() => handleUpdateSelectedStyle('bgColor', hex)}
                                className="w-5 h-5 rounded-md border border-slate-700 shadow-xs transition-transform hover:scale-110"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-16 text-center space-y-2">
                    <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-300">Belum Ada Section Dipilih</h4>
                    <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                      Klik salah satu section di kanvas tengah untuk langsung mengedit teks, harga, dan fotonya.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 2: WIDGET DRAWER                                              */}
            {/* ----------------------------------------------------------------- */}
            {activeInspectorTab === 'widgets' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Katalog Widget Elementor Pro</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Klik widget di bawah untuk menambahkannya ke kanvas desain.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {WIDGET_CATALOG.map((widget) => {
                    const Icon = widget.icon;
                    return (
                      <div
                        key={widget.type}
                        onClick={() => handleAddWidget(widget.type)}
                        className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 group-hover:text-white">{widget.label}</h4>
                            <p className="text-[10px] text-slate-400">{widget.desc}</p>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 3: GLOBAL DESIGN TOKENS (STYLE)                               */}
            {/* ----------------------------------------------------------------- */}
            {activeInspectorTab === 'style' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">Desain Global & Brand Tokens</h3>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Warna Utama Brand (Primary Accent)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={globalTokens.primaryColor}
                      onChange={(e) => setGlobalTokens({ ...globalTokens, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-slate-300">{globalTokens.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Font Utama Typography</label>
                  <select
                    value={globalTokens.fontFamily}
                    onChange={(e) => setGlobalTokens({ ...globalTokens, fontFamily: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Inter, system-ui, sans-serif">Inter (Modern Clean Enterprise)</option>
                    <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Trendy Tech)</option>
                    <option value="'Outfit', sans-serif">Outfit (Bold Geometric)</option>
                    <option value="'Playfair Display', serif">Playfair Display (VIP Luxury Serif)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 4: PAGE SETTINGS                                              */}
            {/* ----------------------------------------------------------------- */}
            {activeInspectorTab === 'settings' && (
              <div className="space-y-3.5 text-xs">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">Pengaturan Halaman</h3>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Judul Halaman</label>
                  <input
                    type="text"
                    value={pageMeta.title}
                    onChange={(e) => setPageMeta({ ...pageMeta, title: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={pageMeta.slug}
                    onChange={(e) => setPageMeta({ ...pageMeta, slug: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 5: YOAST SEO PANEL                                            */}
            {/* ----------------------------------------------------------------- */}
            {activeInspectorTab === 'seo' && (
              <div className="space-y-3.5 text-xs">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">Audit Yoast SEO & Google Snippet</h3>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Focus Keyword</label>
                  <input
                    type="text"
                    value={seoData.focusKeyword}
                    onChange={(e) => setSeoData({ ...seoData, focusKeyword: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Google Meta Title</label>
                  <input
                    type="text"
                    value={seoData.title}
                    onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Google Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoData.description}
                    onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* --------------------------------------------------------------------- */}
        {/* CENTER LIVE INTERACTIVE CANVAS (Anti-Macet Viewport Wrapper)         */}
        {/* --------------------------------------------------------------------- */}
        <main className="flex-1 bg-slate-950 p-4 lg:p-6 overflow-hidden flex flex-col justify-between">
          <ThemePreviewCanvas
            defaultDevice={canvasDevice}
            onDeviceChange={setCanvasDevice}
            title="Elementor Canvas Studio"
            customHeight="h-[calc(100vh-140px)] max-h-[88vh]"
          >
            {/* Dynamic Page Blocks Renderer with Live Click-To-Edit */}
            <div
              style={{ fontFamily: globalTokens.fontFamily }}
              className="w-full bg-white text-slate-900"
            >
              {blocks.map((block, idx) => {
                const isSelected = selectedBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    onClick={() => handleSelectBlock(block.id)}
                    className={`relative group cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-4 ring-indigo-500/90 ring-inset shadow-xl'
                        : 'hover:ring-2 hover:ring-indigo-400/50 hover:ring-inset'
                    }`}
                  >
                    {/* Floating Quick Action Toolbar on Hover */}
                    <div className="absolute top-2 right-4 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-1 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs">
                      <span className="px-2 font-bold text-[10px] text-indigo-400">{block.label}</span>
                      <button
                        type="button"
                        onClick={(e) => handleMoveBlock(idx, 'up', e)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                        title="Geser ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleMoveBlock(idx, 'down', e)}
                        disabled={idx === blocks.length - 1}
                        className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                        title="Geser ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDuplicateBlock(idx, e)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                        title="Duplikat Section"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteBlock(idx, e)}
                        className="p-1 rounded hover:bg-rose-900/60 text-rose-400 hover:text-rose-200"
                        title="Hapus Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* SECTION 1: HERO BLOCK */}
                    {block.type === 'hero' && (() => {
                      const curSlide = block.content.slides?.[activeSlideIndex] || block.content.slides?.[0] || {
                        badge: block.content.badge,
                        title: block.content.title,
                        subtitle: block.content.subtitle,
                        imageUrl: block.content.imageUrl,
                        ctaPrimaryText: block.content.ctaPrimaryText,
                        ctaSecondaryText: block.content.ctaSecondaryText,
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
                                className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
                                style={{ backgroundColor: globalTokens.primaryColor }}
                              >
                                <span>{curSlide.ctaPrimaryText || 'Pilih Armada Mobil'}</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              {curSlide.ctaSecondaryText && (
                                <button
                                  type="button"
                                  className="px-6 py-3 rounded-xl font-bold text-xs text-white backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30"
                                >
                                  <span>{curSlide.ctaSecondaryText}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </section>
                      );
                    })()}

                    {/* SECTION 2: FEATURES BLOCK */}
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
                                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-2.5 hover:shadow-md transition-shadow"
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

                    {/* SECTION 3: FLEET / PRODUCTS BLOCK (LIVE CAR GRID) */}
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
                                  setActiveVehicleIndex(vIdx);
                                }}
                                className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs space-y-3 p-4 hover:shadow-lg ${
                                  activeVehicleIndex === vIdx ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200'
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

                    {/* SECTION 4: FAQ BLOCK */}
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

                    {/* SECTION 5: FALLBACK FOR OTHER BLOCKS */}
                    {!['hero', 'fleet', 'features', 'faq'].includes(block.type) && (
                      <section
                        className={`px-6 sm:px-12 ${block.style?.paddingY || 'py-16'}`}
                        style={{ backgroundColor: block.style?.bgColor || '#ffffff' }}
                      >
                        <div className="max-w-4xl mx-auto text-center space-y-3">
                          <h3 className="text-xl font-bold text-slate-900">{block.content.title}</h3>
                          <p className="text-xs text-slate-600">{block.content.subtitle}</p>
                          <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-slate-500 text-xs">
                            Komponen {block.label} aktif. Klik untuk mengatur di panel kiri.
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                );
              })}
            </div>
          </ThemePreviewCanvas>
        </main>
      </div>
    </div>
  );
}
