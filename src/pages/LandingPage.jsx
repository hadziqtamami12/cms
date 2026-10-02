import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import HeroSlideshow from '../components/common/HeroSlideshow';
import MobileBottomNav from '../components/common/MobileBottomNav';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import SeoHead from '../components/common/SeoHead';
import ThemeRegistry from '../components/themes/ThemeRegistry.jsx';
import TravelTripsSection from '../components/travel/TravelTripsSection';
import SpecialMomentsSection from '../components/travel/SpecialMomentsSection';
import FaqAccordion from '../components/common/FaqAccordion';
import LandingArticlesSection from '../components/articles/LandingArticlesSection';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const LandingPage = ({ config }) => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(false);
  const [footerArticles, setFooterArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles/public?limit=4')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setFooterArticles(json.data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  if (!config) return null;

  const {
    industry = 'automotive',
    themeId = 'fleet-grid',
    bottomNavStyle = 'dock',
    bottom_nav_variant,
    floating_whatsapp = {},
    whatsapp_settings = {},
    brandName = 'Royal Fleet',
    tagline = 'Solusi Sewa Mobil Mewah Terpercaya',
    phone = '+62 812-8899-0011',
    whatsapp = '6281288990011',
    email = 'info@enterprise.com',
    location = 'Jakarta & Bali',
    heroSlides = [],
    seo = {}
  } = config;

  const resolvedNavVariant = bottom_nav_variant || bottomNavStyle || 'floating_dock';
  const waSettings = whatsapp_settings || {};
  const resolvedWa = waSettings.phone || floating_whatsapp?.phone || whatsapp || '6281288990011';
  const resolvedBrandName = waSettings.brandName || brandName || 'Royal Fleet';
  const resolvedActionType = waSettings.actionType || 'popup';
  const resolvedWelcomeMessage = waSettings.welcomeMessage;
  const resolvedMessageTemplate = waSettings.messageTemplate || floating_whatsapp?.messageTemplate || `Halo ${resolvedBrandName}, saya ingin bertanya informasi lebih lanjut.`;
  const isWaEnabled = waSettings.enabled !== false && floating_whatsapp?.enabled !== false;

  return (
    <div className="min-h-screen flex flex-col bg-surface-warm text-slate-800">
      {/* Dynamic SEO, Meta Tags, JSON-LD Schema & Marketing Scripts */}
      <SeoHead
        title={seo.title || config.title || `${brandName} - ${tagline}`}
        description={seo.metaDescription || config.metaDescription}
        keywords={seo.targetKeywords}
        canonicalUrl={typeof window !== 'undefined' ? (window.location.origin + (window.location.pathname.replace(/\/$/, '') || '/')) : ''}
        ogImage={heroSlides[0]?.image}
        industry={industry}
        brandName={brandName}
        logoUrl={config.logoUrl || '/images/logo.png'}
        pwaIcon={config.pwa_icon || '/icons/icon-192.png'}
        pwaShortName={config.pwa_short_name}
        phone={phone}
        gscVerification={seo.gscVerificationTag}
        gaMeasurementId={seo.gaMeasurementId}
        gtmId={seo.gtmId}
        metaPixelId={seo.metaPixelId}
        googleAdsId={seo.googleAdsId}
        ahrefsVerification={seo.ahrefsVerification}
        faqs={config.faqs}
        items={config.items}
      />

      {/* Dynamic Scroll Navbar */}
      <Navbar
        brandName={brandName}
        tagline={tagline}
        logoUrl={config.logoUrl || '/api/brand/logo.svg'}
        phone={phone}
        whatsapp={whatsapp}
      />

      {/* Lightweight Pre-compressed Hero Slideshow */}
      <HeroSlideshow
        slides={heroSlides}
        whatsapp={whatsapp}
        phone={phone}
      />

      {/* Main Dynamic Multi-Industry & Multi-Theme Content */}
      <main className="flex-1 pb-20 md:pb-12 space-y-8">
        <ThemeRegistry
          industry={industry}
          themeId={themeId}
          config={config}
        />

        {/* Modul Eksklusif Tema / Kategori Rental Mobil & Travel */}
        {industry === 'automotive' && (
          <>
            {/* Special Moments & Private Trips Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
              <SpecialMomentsSection
                specialMoments={config.special_moments}
                whatsapp={whatsapp}
                brandName={brandName}
              />
            </div>

            {/* Travel Trips & Tour Packages Catalog */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
              <TravelTripsSection
                whatsapp={whatsapp}
                brandName={brandName}
              />
            </div>

            {/* Interactive FAQ Accordion */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
              <FaqAccordion
                faqs={config.faqs}
                whatsapp={whatsapp}
                brandName={brandName}
              />
            </div>
          </>
        )}

        {/* Articles Preview Section (Right Before Maps) */}
        <LandingArticlesSection brandName={brandName} />

        {/* Google Maps / Local Business Embed Section */}
        {(config.google_maps?.embed_url || seo.gmbEmbedMapUrl) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle p-7 sm:p-9 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <h3>Lokasi Kantor & Titik Penjemputan Utama</h3>
                </div>
              </div>
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100">
                <iframe
                  title="Google Maps"
                  src={config.google_maps?.embed_url || seo.gmbEmbedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modern, Synchronized & Informative Footer (Zero AI Footprint) */}
      {(() => {
        const footerCfg = config.footer || {};
        const footerAbout = footerCfg.about || `${tagline}. Layanan transportasi dan armada terpercaya dengan jaminan unit prima, pengemudi profesional, dan pelayanan 24 jam.`;
        const footerContactTitle = footerCfg.contact_title || 'Kontak Resmi';
        const footerShowPhone = footerCfg.show_phone !== false;
        const footerShowEmail = footerCfg.show_email !== false;
        const footerShowAddress = footerCfg.show_address !== false;
        const resolvedLogoUrl = config.logoUrl || '/api/brand/logo.svg';

        const footerCopyright = footerCfg.copyright
          ? (footerCfg.copyright.includes('{brand}') ? footerCfg.copyright.replace('{brand}', brandName).replace('{year}', new Date().getFullYear()) : (footerCfg.copyright.startsWith('©') ? footerCfg.copyright : `© ${new Date().getFullYear()} ${brandName}. ${footerCfg.copyright}`))
          : `© ${new Date().getFullYear()} ${brandName}. Hak Cipta Dilindungi.`;

        return (
          <footer id="footer" className="bg-slate-900 text-slate-400 py-16 sm:py-20 pb-32 md:pb-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-10">
              {/* Col 1: Brand Profile & Logo */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center">
                    <img
                      src={resolvedLogoUrl}
                      alt={brandName}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                      onError={(e) => { e.currentTarget.src = '/api/brand/logo.svg'; }}
                    />
                  </div>
                  <span className="font-extrabold text-xl text-white tracking-tight">{brandName}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {footerAbout}
                </p>
                <div className="pt-2">
                  <a
                    href="/artikel"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Baca Artikel & Panduan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Col 2: Navigasi Layanan */}
              <div className="space-y-3.5">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Layanan & Navigasi</h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li>
                    <a href="#fleet" className="hover:text-white transition-colors flex items-center gap-1.5">
                      <span className="text-blue-500 font-bold">›</span>
                      <span>Katalog & Unit Tersedia</span>
                    </a>
                  </li>
                  {industry === 'automotive' && (
                    <li>
                      <a href="#booking-bar" className="hover:text-white transition-colors flex items-center gap-1.5">
                        <span className="text-blue-500 font-bold">›</span>
                        <span>Paket Wisata & Tour</span>
                      </a>
                    </li>
                  )}
                  <li>
                    <a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5">
                      <span className="text-blue-500 font-bold">›</span>
                      <span>Keunggulan Layanan</span>
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-white transition-colors flex items-center gap-1.5">
                      <span className="text-blue-500 font-bold">›</span>
                      <span>Pertanyaan Umum (FAQ)</span>
                    </a>
                  </li>
                  <li>
                    <a href="/artikel" className="hover:text-white transition-colors flex items-center gap-1.5">
                      <span className="text-blue-500 font-bold">›</span>
                      <span>Pusat Edukasi & Artikel</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 3: Artikel & Panduan Terbaru */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider">Artikel Terbaru</h4>
                  <a href="/artikel" className="text-[11px] text-blue-400 hover:underline">Semua</a>
                </div>
                <div className="space-y-2.5">
                  {footerArticles.length > 0 ? (
                    footerArticles.slice(0, 4).map((art) => (
                      <a
                        key={art.id}
                        href={`/artikel/${art.slug}`}
                        className="group block text-xs hover:text-white transition-colors"
                      >
                        <p className="line-clamp-2 text-slate-300 group-hover:text-blue-400 font-medium leading-snug">
                          {art.title}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                          {art.created_at ? new Date(art.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Tips Perjalanan'}
                        </span>
                      </a>
                    ))
                  ) : (
                    <div className="space-y-2 text-xs text-slate-400">
                      <a href="/artikel" className="block hover:text-white">Panduan Lengkap Sewa Mobil Aman & Nyaman</a>
                      <a href="/artikel" className="block hover:text-white">Tips Memilih Armada Terbaik untuk Keluarga</a>
                      <a href="/artikel" className="block hover:text-white">Destinasi Wisata Favorit & Rute Perjalanan</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Col 4: Informasi Kontak Resmi */}
              <div className="space-y-3.5">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">{footerContactTitle}</h4>
                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  {footerShowPhone && phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{phone}</span>
                    </div>
                  )}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${String(whatsapp).replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">W</span>
                      <span>+62 {String(whatsapp).replace(/[^0-9]/g, '').slice(-10)} (WhatsApp)</span>
                    </a>
                  )}
                  {footerShowEmail && email && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  {footerShowAddress && (config.google_maps?.address || location) && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{config.google_maps?.address || location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>{footerCopyright}</span>
              <div className="flex items-center gap-4 text-[11px]">
                <a href="#fleet" className="hover:text-slate-400 transition-colors">Armada</a>
                <span>•</span>
                <a href="/artikel" className="hover:text-slate-400 transition-colors">Artikel</a>
                <span>•</span>
                <a href="#faq" className="hover:text-slate-400 transition-colors">Bantuan</a>
              </div>
            </div>
          </footer>
        );
      })()}

      {/* High-Conversion Floating WhatsApp Quick Contact Widget */}
      <FloatingWhatsApp
        whatsapp={resolvedWa}
        brandName={resolvedBrandName}
        messageTemplate={resolvedMessageTemplate}
        welcomeMessage={resolvedWelcomeMessage}
        bottomNavVisible={isBottomNavVisible}
        enabled={isWaEnabled}
        actionType={resolvedActionType}
      />

      {/* Dynamic Scroll Mobile Bottom Navigation (Pure Page Navigation) */}
      <MobileBottomNav
        styleVariant={resolvedNavVariant}
        industry={industry}
        phone={phone}
        onVisibilityChange={setIsBottomNavVisible}
      />
    </div>
  );
};

export default LandingPage;
