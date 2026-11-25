import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-[#E9E8E3] border-t border-[#222222] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#222222]">
          {/* Kolom 1: Brand */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-2xl font-black tracking-[0.2em] font-sans">
              VERITAS
            </span>
            <p className="text-xs text-[#888888] max-w-sm leading-relaxed font-mono">
              Infrastruktur tanda tangan digital mandiri yang menggabungkan stempel QR code dinamis dengan validasi kriptografi asimetris SHA-256.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
              <span className="label-mono text-[10px] text-[#AAAAAA]">
                STATUS PROTOKOL: AKTIF & TERVERIFIKASI
              </span>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="flex flex-col gap-3">
            <span className="label-mono text-[#666666] text-[10px] mb-2">NAVIGASI</span>
            <Link href="/" className="text-xs font-mono uppercase tracking-wider text-[#AAAAAA] hover:text-[#E9E8E3] transition-colors">
              Beranda
            </Link>
            <Link href="/#cara-kerja" className="text-xs font-mono uppercase tracking-wider text-[#AAAAAA] hover:text-[#E9E8E3] transition-colors">
              Cara Kerja
            </Link>
            <Link href="/tanda-tangan" className="text-xs font-mono uppercase tracking-wider text-[#AAAAAA] hover:text-[#E9E8E3] transition-colors">
              Buat Tanda Tangan
            </Link>
            <Link href="/verifikasi" className="text-xs font-mono uppercase tracking-wider text-[#AAAAAA] hover:text-[#E9E8E3] transition-colors">
              Cek Keaslian Dokumen
            </Link>
          </div>

          {/* Kolom 3: Spesifikasi Teknis */}
          <div className="flex flex-col gap-3">
            <span className="label-mono text-[#666666] text-[10px] mb-2">SPESIFIKASI</span>
            <span className="text-xs font-mono text-[#888888]">ALGORITMA: SHA-256</span>
            <span className="text-xs font-mono text-[#888888]">ENKRIPSI: RSA-2048 / ECDSA</span>
            <span className="text-xs font-mono text-[#888888]">FORMAT: PDF (MAX 10 MB)</span>
            <span className="text-xs font-mono text-[#888888]">PENYIMPANAN: ZERO-FILE PERSISTENCE</span>
          </div>
        </div>

        {/* Baris Bawah: Catatan Hukum / Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] font-mono text-[#666666]">
          <p className="max-w-2xl leading-relaxed">
            * Batasan: VERITAS menguji integritas berkas secara matematis murni. Bukan tanda tangan elektronik tersertifikasi PSrE Komdigi. File harus identik tanpa simpan ulang atau kompresi pihak ketiga.
          </p>
          <span className="whitespace-nowrap">
            &copy; 2026 VERITAS. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}
