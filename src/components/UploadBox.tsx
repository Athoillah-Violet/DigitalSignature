'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadBoxProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string | null;
  onClear?: () => void;
}

export default function UploadBox({ onFileSelect, selectedFile, error, onClear }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        onFileSelect(file);
      } else {
        alert('Hanya berkas format PDF yang didukung.');
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-[#111111] bg-[#111111]/5 scale-[0.99]'
            : selectedFile
            ? 'border-[#2E7D5B] bg-[#2E7D5B]/5'
            : 'border-[#D6D5CF] hover:border-[#111111] bg-[#FAF9F5]/50 hover:bg-[#FAF9F5]'
        }`}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-[#111111] max-w-sm truncate">
                {selectedFile.name}
              </p>
              <p className="font-mono text-xs text-[#555555] mt-1">
                {formatFileSize(selectedFile.size)} // SIAP DITANDATANGANI
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="mt-2 text-[11px] font-mono uppercase tracking-wider text-[#A63D3D] hover:underline"
            >
              [GANTI DOKUMEN]
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border border-[#D6D5CF] bg-[#E9E8E3] text-[#111111] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase font-bold tracking-[0.15em] text-[#111111]">
                Tarik & Lepas File PDF ke Sini
              </p>
              <p className="text-xs text-[#666666] mt-1 font-mono">
                atau klik untuk memilih berkas dari komputer (Maksimal 10 MB)
              </p>
            </div>
            <span className="label-mono text-[10px] text-[#888888] mt-2">
              FORMAT RESMI: APPLICATION/PDF
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 border border-[#A63D3D] bg-[#A63D3D]/10 text-[#A63D3D] text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
