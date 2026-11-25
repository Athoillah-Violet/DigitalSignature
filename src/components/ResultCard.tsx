'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Ban, Calendar, User, FileText, Hash, ShieldCheck } from 'lucide-react';
import { VerificationStatus } from '@/app/api/verify/route';

interface ResultCardProps {
  status: VerificationStatus;
  message: string;
  document?: {
    id: string;
    signer_name: string;
    file_name: string | null;
    created_at: Date | string;
    key_id: string;
  };
  details?: {
    computed_hash?: string;
    stored_hash?: string;
    signature_valid?: boolean;
    hash_match?: boolean;
  };
}

export default function ResultCard({ status, message, document, details }: ResultCardProps) {
  // Pengaturan tema status
  const config = {
    ASLI: {
      title: 'DOKUMEN ASLI',
      subtitle: 'Tanda tangan digital valid dan dokumen belum pernah dimodifikasi.',
      icon: CheckCircle2,
      border: 'border-[#2E7D5B]',
      bg: 'bg-[#2E7D5B]/5',
      text: 'text-[#2E7D5B]',
      badge: 'bg-[#2E7D5B] text-white',
    },
    DIUBAH: {
      title: 'DOKUMEN DIUBAH / TIDAK COCOK',
      subtitle: 'Hash file berbeda dengan catatan asli. Dokumen telah diedit, rusak, atau palsu.',
      icon: AlertTriangle,
      border: 'border-[#A63D3D]',
      bg: 'bg-[#A63D3D]/5',
      text: 'text-[#A63D3D]',
      badge: 'bg-[#A63D3D] text-white',
    },
    DICABUT: {
      title: 'DOKUMEN TELAH DICABUT',
      subtitle: 'Tanda tangan digital valid, namun penerbit telah mencabut keabsahan dokumen ini.',
      icon: Ban,
      border: 'border-[#A63D3D]',
      bg: 'bg-[#A63D3D]/5',
      text: 'text-[#A63D3D]',
      badge: 'bg-[#A63D3D] text-white',
    },
    TIDAK_DITEMUKAN: {
      title: 'TIDAK DITEMUKAN',
      subtitle: 'ID dokumen tidak terdaftar di sistem VERITAS.',
      icon: XCircle,
      border: 'border-[#555555]',
      bg: 'bg-[#555555]/5',
      text: 'text-[#555555]',
      badge: 'bg-[#555555] text-white',
    },
  }[status];

  const Icon = config.icon;
  const formattedDate = document?.created_at
    ? new Date(document.created_at).toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'medium',
      })
    : null;

  return (
    <div
      data-aos="fade-up"
      className={`w-full max-w-2xl border-2 ${config.border} ${config.bg} p-6 sm:p-8 rounded-sm shadow-sm transition-all duration-300`}
    >
      {/* Header Status */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#D6D5CF]">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-white shadow-sm ${config.text}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-mono tracking-widest uppercase font-bold rounded-sm ${config.badge} mb-1`}>
              {status}
            </span>
            <h3 className="font-serif-light text-2xl sm:text-3xl text-[#111111] leading-tight">
              {config.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Deskripsi Status */}
      <p className="mt-4 text-sm text-[#555555] leading-relaxed">
        {message || config.subtitle}
      </p>

      {/* Rincian Dokumen */}
      {document && (
        <div className="mt-6 pt-6 border-t border-[#D6D5CF] space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-[#D6D5CF]/50 gap-1">
            <span className="text-[#555555] flex items-center gap-2">
              <Hash className="w-3.5 h-3.5" /> ID Dokumen
            </span>
            <span className="font-bold text-[#111111] tracking-wider">{document.id}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-[#D6D5CF]/50 gap-1">
            <span className="text-[#555555] flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Penandatangan
            </span>
            <span className="font-semibold text-[#111111]">{document.signer_name}</span>
          </div>

          {document.file_name && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-[#D6D5CF]/50 gap-1">
              <span className="text-[#555555] flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Nama File Asli
              </span>
              <span className="text-[#111111] truncate max-w-xs">{document.file_name}</span>
            </div>
          )}

          {formattedDate && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-[#D6D5CF]/50 gap-1">
              <span className="text-[#555555] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Waktu Penandatanganan
              </span>
              <span className="text-[#111111]">{formattedDate}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 gap-1">
            <span className="text-[#555555] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> ID Kunci Kriptografi
            </span>
            <span className="text-[#111111]">{document.key_id}</span>
          </div>
        </div>
      )}

      {/* Rincian Hash Teknis (Jika Ada) */}
      {details && (details.computed_hash || details.stored_hash) && (
        <details className="mt-6 pt-4 border-t border-[#D6D5CF] text-xs font-mono text-[#555555]">
          <summary className="cursor-pointer hover:text-[#111111] uppercase tracking-wider text-[11px] select-none py-1">
            Lihat Informasi Kriptografi Detail
          </summary>
          <div className="mt-3 p-3 bg-white border border-[#D6D5CF] rounded-sm space-y-2 overflow-x-auto">
            {details.computed_hash && (
              <div>
                <p className="text-[10px] text-[#555555] uppercase">Hash SHA-256 Dokumen Uji:</p>
                <code className="text-[11px] text-[#111111] break-all">{details.computed_hash}</code>
              </div>
            )}
            {details.stored_hash && (
              <div>
                <p className="text-[10px] text-[#555555] uppercase">Hash SHA-256 Dokumen Terdaftar:</p>
                <code className="text-[11px] text-[#111111] break-all">{details.stored_hash}</code>
              </div>
            )}
            <div className="pt-2 border-t border-[#D6D5CF] flex gap-4 text-[11px]">
              <span>
                Kecocokan Hash:{' '}
                <strong className={details.hash_match ? 'text-[#2E7D5B]' : 'text-[#A63D3D]'}>
                  {details.hash_match ? 'COCOK' : 'BERBEDA'}
                </strong>
              </span>
              <span>
                Validitas Tanda Tangan RSA:{' '}
                <strong className={details.signature_valid ? 'text-[#2E7D5B]' : 'text-[#A63D3D]'}>
                  {details.signature_valid ? 'VALID' : 'TIDAK VALID'}
                </strong>
              </span>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
