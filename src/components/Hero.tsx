import Link from 'next/link';
import ScaleIllustration from '@/components/ScaleIllustration';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* 1. LAYER BELAKANG: Teks Raksasa VERITAS (z-0) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none overflow-hidden">
        <h1 className="title-giant text-[#111111] opacity-80 sm:opacity-85 tracking-tighter">
          VERITAS
        </h1>
      </div>

      {/* 2. LAYER TENGAH: Timbangan Melayang & Bayangan Berdenyut (z-10) */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8 sm:py-12">
        {/* Kontainer Animasi Melayang (float) */}
        <div className="animate-float w-[260px] sm:w-[330px] md:w-[410px] lg:w-[460px] max-w-[85vw] drop-shadow-md select-none pointer-events-none">
          <ScaleIllustration className="w-full h-auto" />
        </div>

        {/* Bayangan Elips Blur Berdenyut (pulse-soft) */}
        <div
          aria-hidden="true"
          className="animate-pulse-soft w-[160px] sm:w-[220px] md:w-[280px] h-4 sm:h-5 rounded-[100%] bg-[#111111]/30 blur-md -mt-3 sm:-mt-5 pointer-events-none"
        />
      </div>

      {/* 3. LAYER DEPAN BAWAH: Kontrol Aksi & Info Verifikasi (z-20) */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-8 border-t border-[#D6D5CF]/80">
        {/* Kiri Bawah: Kutipan & Tombol Aksi */}
        <div className="flex flex-col gap-5" data-aos="fade-up" data-aos-delay="100">
          <p className="font-serif-light text-xl sm:text-2xl text-[#333333] italic max-w-lg leading-relaxed">
            Integritas dokumen PDF terjamin melalui tanda tangan kriptografis asimetris dan pembuktian keaslian via QR code instan.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tanda-tangan"
              className="btn-black"
            >
              BUAT TANDA TANGAN
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/verifikasi"
              className="btn-outline"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              CEK KEASLIAN
            </Link>
          </div>
        </div>

        {/* Kanan Bawah: Label Kecil & Angka Statistik Besar */}
        <div
          className="flex flex-col md:items-end text-left md:text-right"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className="label-mono text-[#555555] mb-1">
            DOKUMEN TERVERIFIKASI // PROTOKOL
          </span>
          <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
            SHA-256 / 2026
          </div>
          <span className="label-mono text-[#777777] text-[10px] mt-1.5">
            ZERO-FILE STORAGE // INTEGRITAS PENUH
          </span>
        </div>
      </div>
    </section>
  );
}
