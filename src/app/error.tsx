'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#E9E8E3]">
      <div className="max-w-md w-full border-2 border-[#A63D3D] bg-white p-8 sm:p-10 rounded-sm shadow-sm">
        <div className="w-12 h-12 bg-[#A63D3D]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#A63D3D]">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <span className="label-mono text-[#A63D3D] mb-2 inline-block">Terjadi Kendala Sistem</span>
        <h1 className="font-serif-light text-3xl text-[#111111] mb-3">
          Kesalahan Tak Terduga
        </h1>

        <p className="text-xs text-[#555555] leading-relaxed mb-6 font-mono">
          Sistem mengalami kendala saat memproses permintaan Anda. Silakan coba muat ulang atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => reset()}
            className="btn-black text-xs font-mono tracking-widest uppercase px-5 py-2.5 inline-flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
          <Link
            href="/"
            className="btn-outline text-xs font-mono tracking-widest uppercase px-5 py-2.5 inline-flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
