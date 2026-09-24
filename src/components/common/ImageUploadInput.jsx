import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Check, ExternalLink } from 'lucide-react';

/**
 * Universal Image & Icon Upload Component
 * Allows users to either:
 * 1. Upload an image file from device (PNG, JPG, WebP, SVG, ICO)
 * 2. Type or paste an image URL directly
 */
export const ImageUploadInput = ({
  label = 'Gambar / Ikon',
  value = '',
  onChange,
  placeholder = 'https://images.unsplash.com/... atau /uploads/...',
  helperText = 'Mendukung format PNG, JPG, WebP, SVG (Maks. 10MB)',
  showPreview = true,
  badge = '',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileProcess = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg') && !file.name.endsWith('.ico')) {
      setUploadError('Pilih file gambar valid (PNG, JPG, WebP, SVG, ICO).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 10MB.');
      return;
    }

    setUploadError('');
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64Data,
            filename: file.name
          })
        });

        const json = await res.json();
        if (res.ok && json.success && json.url) {
          onChange(json.url);
        } else {
          setUploadError(json.error || 'Gagal mengunggah file.');
        }
      } catch (err) {
        setUploadError('Gagal koneksi ke server upload: ' + err.message);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Gagal membaca file lokal.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
    // Reset input so same file can be re-uploaded if cleared
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label & Header */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span>{label}</span>
          {badge && (
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px] font-mono font-medium">
              {badge}
            </span>
          )}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Hapus Gambar</span>
          </button>
        )}
      </div>

      {/* Input Group: URL Input + Upload Button */}
      <div
        className={`flex items-center gap-2 rounded-2xl border p-1 transition-all ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-3 pr-2 py-2 text-xs font-mono text-slate-900 bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,image/x-icon"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Trigger Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          title="Upload file dari komputer / HP"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Mengunggah...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>

      {/* Helper text or Error */}
      {uploadError ? (
        <p className="text-[11px] text-rose-600 font-medium">{uploadError}</p>
      ) : helperText ? (
        <p className="text-[10px] text-slate-400">{helperText}</p>
      ) : null}

      {/* Interactive Thumbnail Preview */}
      {showPreview && value && (
        <div className="pt-1.5 flex items-center gap-3">
          <div className="relative w-16 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-2xs shrink-0 group">
            <img
              src={value}
              alt="Pratinjau Aset"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              title="Buka gambar di tab baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-700 block truncate font-mono">
              {value.startsWith('/uploads/') ? value.replace('/uploads/', '') : value}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Aset gambar siap digunakan</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadInput;
