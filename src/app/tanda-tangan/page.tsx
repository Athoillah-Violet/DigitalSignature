'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadBox from '@/components/UploadBox';
import {
  ShieldCheck,
  Download,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Loader2,
  FileCheck,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function TandaTanganPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [placement, setPlacement] = useState<'last' | 'all'>('last');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result states
  const [signedDoc, setSignedDoc] = useState<{
    id: string;
    hash: string;
    verifyUrl: string;
    blobUrl: string;
    fileName: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/masuk?next=/tanda-tangan');
      } else {
        setUser(data.user);
      }
      setLoadingUser(false);
    });
  }, [router]);

  const handleCopy = (text: string, type: 'id' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSignDocument = async () => {
    if (!file) {
      setErrorMessage('Silakan pilih berkas PDF terlebih dahulu.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('placement', placement);

      const res = await fetch('/api/sign', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Gagal menandatangani berkas (Status: ${res.status})`);
      }

      // Ambil headers metadata
      const docId = res.headers.get('x-veritas-doc-id') || '';
      const docHash = res.headers.get('x-veritas-doc-hash') || '';
      const verifyUrl = res.headers.get('x-veritas-verify-url') || '';

      // Buat Blob URL untuk pengunduhan berkas PDF
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const finalFileName = `${originalName}-signed-veritas.pdf`;

      // Otomatis picu download
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = finalFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setSignedDoc({
        id: docId,
        hash: docHash,
        verifyUrl,
        blobUrl,
        fileName: finalFileName,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi galat pada server saat memproses tanda tangan.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (signedDoc?.blobUrl) {
      URL.revokeObjectURL(signedDoc.blobUrl);
    }
    setFile(null);
    setSignedDoc(null);
    setErrorMessage(null);
  };

  const signerName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    '';

  const signerEmail = user?.email || '';

  if (loadingUser) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#E9E8E3] text-[#111111]">
        <TopBar />
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 font-mono text-xs text-[#555555]">
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
            MEMVERIFIKASI SESI PENGGUNA...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#E9E8E3] text-[#111111]">
      <TopBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-12 sm:py-16">
        {/* Header Halaman */}
        <div className="mb-10 text-center sm:text-left border-b border-[#D6D5CF] pb-6">
          <span className="label-mono text-[#555555]">MODUL // PEMBUATAN TANDA TANGAN</span>
          <h1 className="text-3xl sm:text-5xl font-serif-light text-[#111111] mt-2">
            Tanda Tangani Dokumen PDF
          </h1>
          <p className="font-mono text-xs text-[#666666] mt-3 max-w-2xl leading-relaxed">
            Sistem menyematkan stempel QR code verifikasi dinamis, menghitung sidik jari SHA-256, dan menyegel dokumen menggunakan kunci kriptografi server.
          </p>
        </div>

        {!signedDoc ? (
          /* FORM UNGGAH & PROSES */
          <div className="flex flex-col gap-8">
            {/* Informasi Penandatangan (Otomatis dari Akun Google) */}
            <div className="border border-[#D6D5CF] bg-[#FAF9F5]/70 p-6 sm:p-8">
              <span className="label-mono text-[#777777] text-[10px]">
                IDENTITAS PENANDATANGAN TERVERIFIKASI
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block label-mono text-[11px] text-[#555555] mb-1">
                    Nama Penandatangan (Resmi)
                  </label>
                  <div className="p-3 border border-[#D6D5CF] bg-[#E9E8E3]/60 font-mono text-sm font-bold text-[#111111]">
                    {signerName}
                  </div>
                </div>
                <div>
                  <label className="block label-mono text-[11px] text-[#555555] mb-1">
                    Email Akun Google (Tersimpan di DB)
                  </label>
                  <div className="p-3 border border-[#D6D5CF] bg-[#E9E8E3]/60 font-mono text-xs text-[#666666] truncate">
                    {signerEmail}
                  </div>
                </div>
              </div>
              <p className="font-mono text-[11px] text-[#777777] mt-3">
                * Nama ini akan otomatis tertera pada stempel QR code di dokumen dan halaman verifikasi publik.
              </p>
            </div>

            {/* Kotak Unggah Berkas */}
            <div>
              <label className="block label-mono text-[11px] text-[#555555] mb-2">
                Pilih Berkas PDF
              </label>
              <UploadBox
                onFileSelect={(f) => {
                  setFile(f);
                  setErrorMessage(null);
                }}
                selectedFile={file}
                error={errorMessage}
              />
            </div>

            {/* Opsi Posisi Stempel QR */}
            <div className="border border-[#D6D5CF] bg-[#FAF9F5]/40 p-6">
              <label className="block label-mono text-[11px] text-[#555555] mb-3">
                Penempatan Stempel QR Code
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 border flex items-start gap-3 cursor-pointer transition-all ${
                    placement === 'last'
                      ? 'border-[#111111] bg-[#111111]/5'
                      : 'border-[#D6D5CF] hover:border-[#111111]'
                  }`}
                >
                  <input
                    type="radio"
                    name="placement"
                    value="last"
                    checked={placement === 'last'}
                    onChange={() => setPlacement('last')}
                    className="mt-0.5 accent-[#111111]"
                  />
                  <div>
                    <span className="font-mono text-xs font-bold text-[#111111] uppercase block">
                      Halaman Terakhir (Disarankan)
                    </span>
                    <span className="text-xs text-[#666666] leading-relaxed block mt-1">
                      Stempel diletakkan di bagian bawah lembar penutup dokumen.
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 border flex items-start gap-3 cursor-pointer transition-all ${
                    placement === 'all'
                      ? 'border-[#111111] bg-[#111111]/5'
                      : 'border-[#D6D5CF] hover:border-[#111111]'
                  }`}
                >
                  <input
                    type="radio"
                    name="placement"
                    value="all"
                    checked={placement === 'all'}
                    onChange={() => setPlacement('all')}
                    className="mt-0.5 accent-[#111111]"
                  />
                  <div>
                    <span className="font-mono text-xs font-bold text-[#111111] uppercase block">
                      Semua Halaman
                    </span>
                    <span className="text-xs text-[#666666] leading-relaxed block mt-1">
                      Stempel diletakkan di bagian bawah setiap lembar berkas.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Tombol Eksekusi Tanda Tangan */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSignDocument}
                disabled={!file || isSubmitting}
                className="btn-black w-full py-4 text-xs tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    MEMPROSES & MENYEGEL DOKUMEN...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    SELESAIKAN & TANDATANGANI DOKUMEN →
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* TAMPILAN HASIL SUKSES */
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            {/* Banner Sukses */}
            <div className="border border-[#2E7D5B] bg-[#2E7D5B]/10 p-6 sm:p-8 flex items-start gap-4">
              <FileCheck className="w-8 h-8 text-[#2E7D5B] shrink-0 mt-0.5" />
              <div>
                <span className="label-mono text-[#2E7D5B] font-bold">STATUS: DOKUMEN BERHASIL DITANDATANGANI</span>
                <h2 className="text-2xl font-serif-light text-[#111111] mt-1 font-bold">
                  PDF Telah Disegel Kriptografis
                </h2>
                <p className="font-mono text-xs text-[#555555] mt-2">
                  Berkas PDF bertanda tangan digital Anda telah otomatis diunduh ke perangkat Anda ({signedDoc.fileName}).
                </p>
              </div>
            </div>

            {/* Rincian Verifikasi */}
            <div className="border border-[#111111] bg-[#FAF9F5] p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <label className="block label-mono text-[10px] text-[#777777] mb-1">
                  ID UNIK DOKUMEN (10 KARAKTER)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 border border-[#D6D5CF] bg-[#E9E8E3] font-mono text-lg sm:text-xl font-black text-[#111111] tracking-widest">
                    {signedDoc.id}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(signedDoc.id, 'id')}
                    className="p-3 border border-[#111111] bg-[#111111] text-[#E9E8E3] hover:bg-transparent hover:text-[#111111] transition-colors"
                    title="Salin ID Dokumen"
                  >
                    {copiedId ? <Check className="w-5 h-5 text-[#2E7D5B]" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block label-mono text-[10px] text-[#777777] mb-1">
                  SIDIK JARI SHA-256 (PDF FINAL)
                </label>
                <div className="p-3 border border-[#D6D5CF] bg-[#E9E8E3] font-mono text-xs text-[#333333] break-all select-all">
                  {signedDoc.hash}
                </div>
              </div>

              <div>
                <label className="block label-mono text-[10px] text-[#777777] mb-1">
                  TAUTAN VERIFIKASI DOKUMEN
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={signedDoc.verifyUrl}
                    className="flex-1 p-3 border border-[#D6D5CF] bg-[#E9E8E3] font-mono text-xs text-[#555555]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(signedDoc.verifyUrl, 'url')}
                    className="p-3 border border-[#D6D5CF] bg-[#FAF9F5] hover:border-[#111111] transition-colors"
                    title="Salin Tautan"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-[#2E7D5B]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <Link
                    href={`/verifikasi/${signedDoc.id}`}
                    target="_blank"
                    className="p-3 border border-[#D6D5CF] bg-[#FAF9F5] hover:border-[#111111] transition-colors"
                    title="Buka Halaman Verifikasi"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Peringatan Kritis Batasan Integritas */}
              <div className="p-4 border-l-4 border-[#A63D3D] bg-[#A63D3D]/5 mt-2">
                <div className="flex items-center gap-2 text-[#A63D3D] font-mono text-xs font-bold uppercase mb-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>PENTING: JANGAN MENGUBAH / MENYIMPAN ULANG FILE</span>
                </div>
                <p className="text-xs text-[#555555] font-mono leading-relaxed">
                  Verifikasi keaslian mensyaratkan berkas PDF yang identik 100% sampai tingkat bit. Jangan mengompres, mencetak ulang lalu memindai, atau melakukan &apos;Save As&apos; lewat pembaca PDF pihak ketiga karena akan mengubah nilai hash SHA-256 dan merusak pembuktian keaslian.
                </p>
              </div>

              {/* Aksi Unduh Manual & Tanda Tangan Ulang */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#D6D5CF]">
                <a
                  href={signedDoc.blobUrl}
                  download={signedDoc.fileName}
                  className="btn-black w-full sm:flex-1 py-3.5 text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  UNDUH ULANG FILE PDF
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-outline w-full sm:flex-1 py-3.5 text-xs flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  TANDATANGANI DOKUMEN LAIN
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
