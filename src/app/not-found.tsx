import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#E9E8E3]">
      <div className="max-w-md w-full border border-[#D6D5CF] bg-white p-8 sm:p-10 rounded-sm shadow-sm">
        <div className="w-12 h-12 bg-[#111111]/5 border border-[#D6D5CF] rounded-full flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-6 h-6 text-[#111111]" />
        </div>

        <span className="label-mono mb-2 inline-block">Galat 404</span>
        <h1 className="font-serif-light text-3xl sm:text-4xl text-[#111111] mb-3">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-xs text-[#555555] leading-relaxed mb-6 font-mono">
          Alamat berkas atau dokumen yang Anda cari tidak tersedia, telah dipindahkan, atau belum terdaftar di sistem VERITAS.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/"
            className="btn-black text-xs font-mono tracking-widest uppercase px-5 py-2.5 inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Beranda
          </Link>
          <Link
            href="/verifikasi"
            className="btn-outline text-xs font-mono tracking-widest uppercase px-5 py-2.5 inline-flex items-center justify-center"
          >
            Cek Dokumen
          </Link>
        </div>
      </div>
    </main>
  );
}
