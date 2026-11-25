'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, ShieldAlert, UploadCloud, Info } from 'lucide-react';
import UploadBox from '@/components/UploadBox';
import ResultCard from '@/components/ResultCard';
import { VerificationResponse } from '@/app/api/verify/route';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetailVerifikasiPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const docId = resolvedParams.id;

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isVerifyingFile, setIsVerifyingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Periksa status ID dokumen pertama kali saat halaman dibuka
  useEffect(() => {
    let isMounted = true;
    async function checkDocId() {
      try {
        setIsLoadingInitial(true);
        const res = await fetch(`/api/document/${encodeURIComponent(docId)}`);
        const data = await res.json();

        if (!isMounted) return;

        if (!res.ok) {
          setVerificationResult({
            status: 'TIDAK_DITEMUKAN',
            message: data.error || 'Dokumen tidak ditemukan di dalam sistem.',
          });
        } else {
          // Dokumen terdaftar
          if (data.status === 'revoked') {
            setVerificationResult({
              status: 'DICABUT',
              message: 'Tanda tangan digital valid, namun dokumen ini telah DICABUT oleh penerbitnya dan dinyatakan TIDAK BERLAKU.',
              document: data,
            });
          } else {
            setVerificationResult({
              status: 'ASLI',
              message: 'ID Dokumen terdaftar di sistem. Unggah file PDF Anda di bawah untuk menguji keaslian fisik & digital byte-per-byte.',
              document: data,
            });
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setVerificationResult({
          status: 'TIDAK_DITEMUKAN',
          message: 'Gagal menghubungi server untuk memvalidasi ID dokumen.',
        });
      } finally {
        if (isMounted) setIsLoadingInitial(false);
      }
    }

    checkDocId();
    return () => {
      isMounted = false;
    };
  }, [docId]);

  // Handle Verifikasi File PDF
  const handleVerifyFile = async () => {
    if (!selectedFile) return;

    try {
      setIsVerifyingFile(true);
      setFileError(null);

      const formData = new FormData();
      formData.append('id', docId);
      formData.append('file', selectedFile);

      const res = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });

      const data: VerificationResponse = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error('Error verifying document file:', err);
      setFileError('Gagal memproses verifikasi file ke server.');
    } finally {
      setIsVerifyingFile(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 sm:px-8">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Tombol Kembali */}
        <div className="w-full mb-6">
          <Link
            href="/verifikasi"
            className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-[#555555] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Verifikasi
          </Link>
        </div>

        {/* Loading Spinner Awal */}
        {isLoadingInitial ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#111111] mb-3" />
            <p className="font-mono text-xs text-[#555555] tracking-wider uppercase">
              Memeriksa Dokumen ID: {docId}...
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-8">
            {/* Kartu Status Hasil */}
            {verificationResult && (
              <ResultCard
                status={verificationResult.status}
                message={verificationResult.message}
                document={verificationResult.document}
                details={verificationResult.details}
              />
            )}

            {/* Peringatan Kritis Integritas PDF */}
            <div
              data-aos="fade-up"
              className="w-full bg-[#E9E8E3] border border-[#D6D5CF] p-4 rounded-sm flex items-start gap-3 text-xs font-mono text-[#555555]"
            >
              <Info className="w-4 h-4 shrink-0 text-[#111111] mt-0.5" />
              <div>
                <strong className="text-[#111111] uppercase block mb-1">
                  Catatan Batasan Kriptografi:
                </strong>
                Verifikasi digital menggunakan perbandingan cryptographic hash SHA-256 byte-per-byte. 
                Dokumen PDF yang diunggah harus identik 100% dengan file hasil unduhan asli. Menyimpan ulang (Re-save), mengompres, atau mengedit teks akan menyebabkan dokumen berstatus <strong>DIUBAH</strong>.
              </div>
            </div>

            {/* Form Unggah File PDF untuk Verifikasi Penuh (hanya jika dokumen terdaftar) */}
            {verificationResult && verificationResult.status !== 'TIDAK_DITEMUKAN' && (
              <div
                data-aos="fade-up"
                className="w-full bg-white border border-[#D6D5CF] p-6 sm:p-8 rounded-sm shadow-sm"
              >
                <div className="mb-6">
                  <h2 className="font-serif-light text-2xl text-[#111111]">
                    Uji Integritas File PDF
                  </h2>
                  <p className="text-xs text-[#555555] mt-1">
                    Unggah file PDF dokumen ini untuk membuktikan tanda tangan digital dan memastikan berkas belum pernah diubah sekecil apa pun.
                  </p>
                </div>

                <UploadBox
                  onFileSelect={(file) => {
                    setSelectedFile(file);
                    setFileError(null);
                  }}
                  selectedFile={selectedFile}
                  onClear={() => setSelectedFile(null)}
                />

                {fileError && (
                  <p className="mt-3 text-xs font-mono text-[#A63D3D]">{fileError}</p>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleVerifyFile}
                    disabled={!selectedFile || isVerifyingFile}
                    className="btn-black text-xs font-mono tracking-widest uppercase px-6 py-2.5 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isVerifyingFile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        Verifikasi File Sekarang
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
