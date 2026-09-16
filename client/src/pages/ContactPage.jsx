import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2,
  AlertCircle, ArrowLeft, ShieldCheck, Sparkles
} from 'lucide-react';
import DynamicTopbar from '../components/navigation/DynamicTopbar';
import Footer from '../components/navigation/Footer';
import SeoHead from '../components/seo/SeoHead';

export default function ContactPage({ header, footer, colorMode = 'light' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus({ state: 'error', message: 'Mohon lengkapi Nama, Nomor Telepon/WhatsApp, dan Pesan Anda.' });
      return;
    }

    setStatus({ state: 'submitting', message: 'Mengirim pesan...' });

    setTimeout(() => {
      const waNumber = header?.whatsappNumber || '6281234567890';
      const text = `Halo Admin,\n\nNama: ${formData.name}\nEmail: ${formData.email || '-'}\nNo Telp: ${formData.phone}\nSubjek: ${formData.subject || 'Pertanyaan Umum'}\n\nPesan:\n${formData.message}`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

      setStatus({
        state: 'success',
        message: 'Pesan Anda berhasil diverifikasi. Anda dapat langsung melanjutkan konsultasi melalui WhatsApp resmi kami.',
        waUrl,
      });
    }, 600);
  };

  const phoneDisplay = header?.phone || '+62 812-3456-7890';
  const whatsappNum = header?.whatsappNumber || '6281234567890';
  const emailDisplay = header?.email || 'kontak@perusahaan.com';

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 flex flex-col selection:bg-slate-900 selection:text-white">
      <SeoHead
        title="Hubungi Kami - Konsultasi & Layanan Resmi"
        seo={{
          metaTitle: "Hubungi Kami | Dukungan & Konsultasi Resmi",
          metaDescription: "Hubungi tim konsultan kami untuk pertanyaan, penawaran harga khusus, kerja sama bisnis, dan bantuan layanan 24/7.",
        }}
      />

      <DynamicTopbar
        header={header}
        siteName={header?.brandName || 'Portal Resmi'}
        colorMode={colorMode}
      />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Back Link & Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-4 transition-colors px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </a>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Hubungi Tim Kami
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Punya pertanyaan mengenai layanan kami, membutuhkan proposal penawaran, atau ingin konsultasi langsung? Tim spesialis kami siap merespons dengan cepat.
          </p>
        </div>

        {/* Contact Grid: Info Cards (Left) + Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Channels & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Saluran Komunikasi Cepat
              </h2>

              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo Admin, saya ingin konsultasi mengenai layanan Anda.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Chat WhatsApp Resmi
                  </span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    Respon Cepat 24 Jam
                  </span>
                  <span className="text-xs text-slate-600 block mt-1">
                    Langsung terhubung dengan konsultan resmi.
                  </span>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={`tel:${whatsappNum}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Telepon Langsung
                  </span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {phoneDisplay}
                  </span>
                  <span className="text-xs text-slate-600 block mt-1">
                    Senin – Minggu, 08:00 – 21:00 WIB
                  </span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${emailDisplay}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Email Korespondensi
                  </span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5 break-all">
                    {emailDisplay}
                  </span>
                  <span className="text-xs text-slate-600 block mt-1">
                    Untuk proposal kemitraan & faktur perusahaan.
                  </span>
                </div>
              </a>

              {/* Office & Hours */}
              <div className="pt-2 border-t border-slate-100 space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Alamat Kantor Pusat:</strong>
                    <span>Gedung Perkantoran Sentra Niaga, Lantai 5, Jakarta Selatan, DKI Jakarta 12930</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Jam Pelayanan Kantor:</strong>
                    <span>Senin – Sabtu: 08:00 – 18:00 WIB (Layanan digital buka 24 jam)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Assurance Badge */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Data dan pesan Anda dijamin kerahasiaannya dan hanya digunakan untuk keperluan layanan.
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Kirim Pesan atau Permintaan Penawaran
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Silakan isi formulir di bawah ini. Kami akan merespons ke email atau WhatsApp Anda selambat-lambatnya dalam 1x24 jam kerja.
              </p>

              {status.state === 'success' ? (
                <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/60 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    Terima Kasih! Pesan Anda Telah Diterima.
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    {status.message}
                  </p>
                  {status.waUrl && (
                    <div className="pt-2">
                      <a
                        href={status.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Lanjutkan via WhatsApp
                      </a>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setStatus({ state: 'idle', message: '' });
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto pt-2"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status.state === 'error' && (
                    <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{status.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nama Anda atau Perusahaan"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Alamat Email (Opsional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alamat@email.com"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Subjek atau Jenis Kebutuhan
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Contoh: Permintaan Penawaran"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pesan atau Detail Kebutuhan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Jelaskan kebutuhan, rincian layanan, atau pertanyaan yang ingin Anda diskusikan..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none transition-all shadow-xs resize-y"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <p className="text-[11px] text-slate-500">
                      Respons cepat via WhatsApp tersedia setiap hari.
                    </p>
                    <button
                      type="submit"
                      disabled={status.state === 'submitting'}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {status.state === 'submitting' ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer footer={footer} />
    </div>
  );
}
