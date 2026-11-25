'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  ShieldCheck,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface DocumentItem {
  id: string;
  file_name: string | null;
  signer_name: string;
  status: 'valid' | 'revoked';
  created_at: string;
  key_id: string;
  doc_hash: string;
}

export default function RiwayatPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk dialog konfirmasi pencabutan
  const [revokingDoc, setRevokingDoc] = useState<DocumentItem | null>(null);
  const [isSubmittingRevoke, setIsSubmittingRevoke] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/documents/my');
      if (!res.ok) {
        throw new Error('Gagal mengambil daftar dokumen');
      }
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleConfirmRevoke = async () => {
    if (!revokingDoc) return;

    try {
      setIsSubmittingRevoke(true);
      setRevokeError(null);

      const res = await fetch(`/api/document/${encodeURIComponent(revokingDoc.id)}/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mencabut dokumen.');
      }

      // Update state lokal
      setDocuments((prev) =>
        prev.map((d) => (d.id === revokingDoc.id ? { ...d, status: 'revoked' } : d))
      );
      setRevokingDoc(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses pencabutan.';
      setRevokeError(msg);
    } finally {
      setIsSubmittingRevoke(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#D6D5CF] gap-4" data-aos="fade-up">
          <div>
            <span className="label-mono mb-2 inline-block">Arsip Dokumen Anda</span>
            <h1 className="text-3xl sm:text-4xl font-serif-light text-[#111111]">
              Riwayat Tanda Tangan
            </h1>
            <p className="mt-1 text-xs text-[#555555]">
              Daftar seluruh dokumen PDF yang telah Anda terbitkan dan tanda tangani secara digital.
            </p>
          </div>
          <Link
            href="/tanda-tangan"
            className="btn-black text-xs font-mono tracking-widest uppercase px-5 py-2.5 inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Tanda Tangani PDF Baru
          </Link>
        </div>

        {/* Content */}
        <div className="mt-8">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#111111] mb-3" />
              <p className="font-mono text-xs text-[#555555] tracking-wider uppercase">
                Memuat riwayat dokumen...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 bg-[#A63D3D]/5 border border-[#A63D3D]/30 text-center rounded-sm">
              <p className="text-sm font-mono text-[#A63D3D]">{error}</p>
              <button
                onClick={fetchDocuments}
                className="mt-4 px-4 py-2 border border-[#A63D3D] text-xs font-mono uppercase tracking-widest text-[#A63D3D] hover:bg-[#A63D3D] hover:text-white transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[#D6D5CF] p-8 rounded-sm bg-white" data-aos="fade-up">
              <FileText className="w-12 h-12 stroke-1 text-[#555555]/50 mx-auto mb-3" />
              <h3 className="font-serif-light text-xl text-[#111111]">Belum Ada Dokumen</h3>
              <p className="text-xs text-[#555555] mt-1 max-w-sm mx-auto">
                Anda belum pernah menandatangani dokumen PDF apa pun menggunakan akun ini.
              </p>
              <Link
                href="/tanda-tangan"
                className="btn-black text-xs font-mono tracking-widest uppercase px-5 py-2.5 inline-flex items-center gap-2 mt-5"
              >
                Buat Tanda Tangan Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4" data-aos="fade-up">
              {documents.map((doc) => {
                const isValid = doc.status === 'valid';
                const formattedDate = new Date(doc.created_at).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                return (
                  <div
                    key={doc.id}
                    className="p-5 sm:p-6 bg-white border border-[#D6D5CF] rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#111111] transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-[#111111] tracking-wider">
                          {doc.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm font-semibold ${
                            isValid
                              ? 'bg-[#2E7D5B]/10 text-[#2E7D5B] border border-[#2E7D5B]/30'
                              : 'bg-[#A63D3D]/10 text-[#A63D3D] border border-[#A63D3D]/30'
                          }`}
                        >
                          {isValid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> SAH / AKTIF
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3" /> DICABUT
                            </>
                          )}
                        </span>
                      </div>

                      <p className="text-sm text-[#111111] font-medium truncate">
                        {doc.file_name || 'Dokumen PDF'}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-[#555555]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Kunci: {doc.key_id}
                        </span>
                      </div>
                    </div>

                    {/* Aksi */}
                    <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#D6D5CF]">
                      <Link
                        href={`/verifikasi/${encodeURIComponent(doc.id)}`}
                        target="_blank"
                        className="px-3.5 py-2 border border-[#D6D5CF] hover:border-[#111111] text-xs font-mono uppercase tracking-wider text-[#111111] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Halaman Cek
                      </Link>

                      {isValid && (
                        <button
                          type="button"
                          onClick={() => {
                            setRevokingDoc(doc);
                            setRevokeError(null);
                          }}
                          className="px-3.5 py-2 border border-[#A63D3D]/40 text-[#A63D3D] hover:bg-[#A63D3D] hover:text-white text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" /> Cabut
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog Konfirmasi Pencabutan */}
      {revokingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-white border-2 border-[#A63D3D] p-6 rounded-sm shadow-xl space-y-4"
            data-aos="zoom-in"
          >
            <div className="flex items-center gap-3 text-[#A63D3D]">
              <div className="p-2 bg-[#A63D3D]/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif-light text-2xl text-[#111111]">
                Cabut Keabsahan Dokumen?
              </h3>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Anda akan mencabut status dokumen <strong>{revokingDoc.id}</strong> (
              {revokingDoc.file_name || 'Dokumen PDF'}). Tindakan ini <strong>tidak dapat dibatalkan</strong>. Setelah dicabut, siapa pun yang memverifikasi dokumen ini akan menerima status <strong>DICABUT</strong> dan dokumen tidak lagi sah.
            </p>

            {revokeError && (
              <div className="p-2.5 bg-[#A63D3D]/10 border border-[#A63D3D] text-[11px] font-mono text-[#A63D3D]">
                {revokeError}
              </div>
            )}

            <div className="pt-3 border-t border-[#D6D5CF] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRevokingDoc(null)}
                disabled={isSubmittingRevoke}
                className="px-4 py-2 border border-[#D6D5CF] text-xs font-mono uppercase tracking-wider text-[#111111] hover:bg-[#E9E8E3] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={isSubmittingRevoke}
                className="px-4 py-2 bg-[#A63D3D] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#8B2E2E] transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmittingRevoke ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Mencabut...
                  </>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    Ya, Cabut Dokumen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
