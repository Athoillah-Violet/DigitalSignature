'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QrCode, Search, FileCheck2, AlertCircle, ArrowLeft } from 'lucide-react';
import QrScanner from '@/components/QrScanner';

export default function VerifikasiPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [docIdInput, setDocIdInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleScanSuccess = (scannedId: string) => {
    if (scannedId) {
      router.push(`/verifikasi/${encodeURIComponent(scannedId)}`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = docIdInput.trim();
    if (!trimmed) {
      setInputError('ID dokumen tidak boleh kosong.');
      return;
    }
    router.push(`/verifikasi/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 sm:px-8">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Tombol Navigasi Kembali */}
        <div className="w-full mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#555555] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8" data-aos="fade-up">
          <span className="label-mono mb-2 inline-block">Verifikasi Dokumen</span>
          <h1 className="text-3xl sm:text-4xl font-serif-light text-[#111111]">
            Cek Keaslian Dokumen
          </h1>
          <p className="mt-2 text-sm text-[#555555] max-w-md">
            Pindai QR code fisik dari lembar dokumen atau masukkan 10 karakter ID dokumen untuk menguji keabsahan dan integritasnya.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="flex border border-[#D6D5CF] bg-[#E9E8E3] p-1 rounded-sm mb-8 w-full max-w-sm"
        >
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === 'scan'
                ? 'bg-[#111111] text-[#E9E8E3] shadow-sm'
                : 'text-[#555555] hover:text-[#111111]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> Scan Kamera
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-[#111111] text-[#E9E8E3] shadow-sm'
                : 'text-[#555555] hover:text-[#111111]'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Input ID Manual
          </button>
        </div>

        {/* Konten Tab */}
        <div data-aos="fade-up" data-aos-delay="200" className="w-full flex justify-center">
          {activeTab === 'scan' ? (
            <div className="w-full flex flex-col items-center">
              <QrScanner onScanSuccess={handleScanSuccess} />
              <p className="mt-4 text-[11px] font-mono text-[#555555] text-center max-w-xs">
                Arahkan lensa kamera tepat ke kotak QR Code di bagian bawah lembar dokumen.
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="w-full max-w-md bg-white border border-[#D6D5CF] p-6 rounded-sm shadow-sm">
              <label htmlFor="docId" className="block text-xs font-mono uppercase tracking-wider text-[#111111] mb-2">
                Masukkan ID Dokumen (10 Karakter)
              </label>
              <div className="flex gap-2">
                <input
                  id="docId"
                  type="text"
                  placeholder="Contoh: vK81mZ9pQx"
                  value={docIdInput}
                  onChange={(e) => {
                    setDocIdInput(e.target.value);
                    setInputError(null);
                  }}
                  className="flex-1 bg-transparent border border-[#D6D5CF] px-3 py-2 text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111] uppercase"
                />
                <button
                  type="submit"
                  className="btn-black text-xs font-mono tracking-widest uppercase px-5 py-2 flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" /> Periksa
                </button>
              </div>

              {inputError && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#A63D3D] font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{inputError}</span>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#D6D5CF] text-[11px] text-[#555555] flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 shrink-0 mt-0.5 text-[#111111]" />
                <span>
                  ID dokumen tercetak jelas tepat di bawah kotak QR code pada lembar dokumen bertanda tangan.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
