import React from 'react';
import { Car, Phone, Mail, MapPin, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ footer = {} }) {
  const brandName = footer.brandName || 'Ultra CMS Platform';
  const description = footer.description || 'Pusat layanan digital dan manajemen konten modern berkinerja tinggi dengan visual page builder dan optimasi SEO terpadu.';
  const address = footer.address || 'Jl. Sudirman No. 88, Kawasan Bisnis Sentral, Jakarta';
  const phone = footer.phone || '0812-3456-7890';
  const email = footer.email || 'info@ultracms.com';
  const whatsappNumber = footer.whatsappNumber || '6281234567890';
  const copyright = footer.copyright || `© ${new Date().getFullYear()} ${brandName}. Hak cipta dilindungi.`;

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-14 pb-24 md:pb-14 px-4 sm:px-6 lg:px-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-xs">
              <span className="text-sm font-bold">W</span>
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                {brandName}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Official Web Service
              </span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed max-w-md">
            {description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Halo%20Admin%20${encodeURIComponent(brandName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white text-white" />
              <span>Customer Care 24 Jam</span>
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="font-bold text-xs text-slate-900 mb-3 uppercase tracking-wider">
            Menu Navigasi
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#features" className="hover:text-slate-900 transition-colors">Keunggulan Layanan</a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-slate-900 transition-colors">Paket Layanan</a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-slate-900 transition-colors">Ulasan Pelanggan</a>
            </li>
            <li>
              <a href="#faq" className="hover:text-slate-900 transition-colors">Tanya Jawab (FAQ)</a>
            </li>
            <li>
              <a href="/?contact=true" className="hover:text-slate-900 transition-colors font-medium text-slate-900">Hubungi Kami</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact Details */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Kontak Resmi
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <a href={`tel:${phone}`} className="hover:underline text-slate-900 font-semibold">{phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
        <div>{copyright}</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sistem Terverifikasi &amp; Aman</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
