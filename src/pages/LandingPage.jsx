import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import HeroSlideshow from '../components/common/HeroSlideshow';
import MobileBottomNav from '../components/common/MobileBottomNav';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import SeoHead from '../components/common/SeoHead';
import ThemeRegistry from '../components/themes/ThemeRegistry.jsx';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const LandingPage = ({ config }) => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(false);
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

  const resolvedNavVariant = bottom_nav_variant || bottomNavStyle || 'detached_floating_bubble';
  const waSettings = whatsapp_settings || {};
  const resolvedWa = waSettings.phone || floating_whatsapp.phone || whatsapp;
  const resolvedBrandName = waSettings.brandName || brandName;
  const resolvedDisplayMode = waSettings.displayMode || (floating_whatsapp.enabled === false ? 'bottom_nav' : 'bottom_nav');
  const resolvedNavPosition = waSettings.navPosition || 'center';
  const resolvedActionType = waSettings.actionType || 'popup';
  const resolvedWelcomeMessage = waSettings.welcomeMessage;
  const resolvedMessageTemplate = waSettings.messageTemplate || floating_whatsapp.messageTemplate || `Halo ${brandName}, saya ingin bertanya informasi lebih lanjut.`;

  return (
    <div className="min-h-screen flex flex-col bg-surface-warm text-slate-800">
      {/* Dynamic SEO, Meta Tags, JSON-LD Schema & Marketing Scripts */}
      <SeoHead
        title={seo.title || `${brandName} - ${tagline}`}
        description={seo.metaDescription}
        keywords={seo.targetKeywords}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : ''}
        ogImage={heroSlides[0]?.image}
        industry={industry}
        brandName={brandName}
        phone={phone}
        gscVerification={seo.gscVerificationTag}
        gaMeasurementId={seo.gaMeasurementId}
        gtmId={seo.gtmId}
        metaPixelId={seo.metaPixelId}
        googleAdsId={seo.googleAdsId}
        ahrefsVerification={seo.ahrefsVerification}
        faqs={config.faqs}
      />

      {/* Dynamic Scroll Navbar */}
      <Navbar
        brandName={brandName}
        tagline={tagline}
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
      <main className="flex-1 pb-20 md:pb-12">
        <ThemeRegistry
          industry={industry}
          themeId={themeId}
          config={config}
        />

        {/* Google Maps / Local Business Embed Section */}
        {seo.gmbEmbedMapUrl && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle p-7 sm:p-9 space-y-6">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <h3>Lokasi Kantor & Titik Penjemputan Resmi</h3>
              </div>
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100">
                <iframe
                  title="Google Maps"
                  src={seo.gmbEmbedMapUrl}
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

      {/* Clean Enterprise Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 sm:py-20 pb-32 md:pb-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12 lg:gap-16">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">{brandName}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {tagline}. Didukung oleh arsitektur Cloud Edge berkecepatan tinggi dengan skor Core Web Vitals 98+ dan enkripsi enterprise.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Kontak Resmi</h4>
            <div className="space-y-3 text-sm text-slate-300">
              {phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{email}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Legalitas & Proteksi</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hak Cipta dilindungi Undang-Undang. Terdaftar dan terverifikasi di Google Business & Cloudflare Enterprise.
            </p>
            <div className="pt-2">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status Sistem: Operasional Aktif</span>
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {brandName}. All rights reserved. Powered by Enterprise MultiCMS Engine.
        </div>
      </footer>

      {/* High-Conversion Floating WhatsApp Quick Contact Widget */}
      <FloatingWhatsApp
        whatsapp={resolvedWa}
        brandName={resolvedBrandName}
        messageTemplate={resolvedMessageTemplate}
        welcomeMessage={resolvedWelcomeMessage}
        bottomNavVisible={isBottomNavVisible}
        enabled={waSettings.enabled !== false && floating_whatsapp.enabled !== false}
        displayMode={resolvedDisplayMode}
        actionType={resolvedActionType}
      />

      {/* Dynamic Scroll Mobile Bottom Navigation with Integrated WhatsApp Action */}
      <MobileBottomNav
        styleVariant={resolvedNavVariant}
        whatsapp={resolvedWa}
        phone={phone}
        brandName={resolvedBrandName}
        welcomeMessage={resolvedWelcomeMessage}
        industry={industry}
        waPosition={resolvedNavPosition}
        waAction={resolvedActionType}
        onVisibilityChange={setIsBottomNavVisible}
      />
    </div>
  );
};

export default LandingPage;
