'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Cara Kerja', href: '/#cara-kerja' },
    { label: 'Buat Tanda Tangan', href: '/tanda-tangan' },
    { label: 'Cek Keaslian', href: '/verifikasi' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#E9E8E3]/90 backdrop-blur-md border-b border-[#D6D5CF] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Menu Kiri (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-2 text-xs font-mono uppercase tracking-[0.18em] text-[#111111] hover:text-[#555555] transition-colors"
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logo Tengah */}
        <div className="flex-1 lg:flex-none text-left lg:text-center">
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase text-[#111111] hover:opacity-80 transition-opacity font-sans"
          >
            VERITAS
          </Link>
        </div>

        {/* Tombol Kanan (Desktop) */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/verifikasi"
            className="btn-black py-2.5 px-5 text-[11px] tracking-[0.2em] flex items-center gap-2"
          >
            CEK DOKUMEN
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hamburger Tombol Mobile */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#E9E8E3] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#E9E8E3] border-b border-[#D6D5CF] px-6 py-6 flex flex-col gap-4 animate-in fade-in duration-200">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-sm font-mono uppercase tracking-[0.2em] flex items-center justify-between border-b border-[#D6D5CF]/50 ${
                  active ? 'text-[#111111] font-bold' : 'text-[#555555]'
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="w-2 h-2 rounded-full bg-[#111111]" />}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/verifikasi"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-black w-full text-center flex items-center justify-center gap-2 py-3"
            >
              CEK DOKUMEN
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
