'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowUpRight, User, LogOut, FileText, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Ambil user saat ini
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Dengarkan perubahan status login
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Cara Kerja', href: '/#cara-kerja' },
    { label: 'Tanda Tangan', href: '/tanda-tangan' },
    { label: 'Cek Dokumen', href: '/verifikasi' },
    ...(user ? [{ label: 'Riwayat', href: '/riwayat' }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Akun';

  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#E9E8E3]/95 backdrop-blur-md border-b border-[#D6D5CF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-6">
        {/* Sisi Kiri: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity"
          >
            <span className="text-2xl font-black tracking-[0.22em] uppercase text-[#111111] font-sans group-hover:opacity-75 transition-opacity">
              VERITAS
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#111111]" />
          </Link>
        </div>

        {/* Menu Navigasi Tengah (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-6">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-xs font-mono uppercase tracking-[0.15em] transition-all rounded-sm ${
                  active
                    ? 'text-[#111111] font-bold bg-[#111111]/5'
                    : 'text-[#555555] hover:text-[#111111] hover:bg-[#111111]/5'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#111111]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sisi Kanan: Aksi Cepat & Profil Pengguna (Desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 py-1.5 px-3 border border-[#D6D5CF] bg-[#FAF9F5] hover:border-[#111111] transition-all rounded-sm cursor-pointer text-xs font-mono uppercase shadow-2xs"
              >
                {userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-5 h-5 rounded-full object-cover border border-[#D6D5CF]"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#111111] text-[#E9E8E3] flex items-center justify-center text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                )}
                <span className="max-w-[110px] truncate tracking-wider font-semibold text-[#111111]">
                  {userName}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#111111] shadow-xl py-1.5 z-50 flex flex-col font-mono text-xs rounded-sm animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-[#D6D5CF] text-[10px] text-[#666666] truncate bg-[#FAF9F5]">
                    {user.email}
                  </div>
                  <Link
                    href="/tanda-tangan"
                    onClick={() => setUserMenuOpen(false)}
                    className="px-4 py-2 hover:bg-[#E9E8E3] flex items-center gap-2.5 tracking-wider uppercase text-[#111111]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tanda Tangan Baru
                  </Link>
                  <Link
                    href="/riwayat"
                    onClick={() => setUserMenuOpen(false)}
                    className="px-4 py-2 hover:bg-[#E9E8E3] flex items-center gap-2.5 tracking-wider uppercase text-[#111111]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Riwayat Dokumen
                  </Link>
                  <div className="border-t border-[#D6D5CF] my-1" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 hover:bg-[#A63D3D]/10 text-[#A63D3D] flex items-center gap-2.5 tracking-wider uppercase cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/masuk"
              className="py-2 px-3.5 text-xs font-mono uppercase tracking-[0.16em] border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#E9E8E3] transition-colors rounded-sm"
            >
              Masuk
            </Link>
          )}

          <Link
            href="/tanda-tangan"
            className="btn-black py-2 px-4 text-xs font-mono tracking-[0.16em] flex items-center gap-1.5 uppercase rounded-sm shadow-2xs"
          >
            Mulai
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hamburger Tombol Mobile */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#E9E8E3] transition-colors rounded-sm cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#E9E8E3] border-b border-[#D6D5CF] px-6 py-5 flex flex-col gap-3.5 shadow-md animate-in fade-in duration-150">
          {user && (
            <div className="pb-3 border-b border-[#D6D5CF] flex items-center gap-3">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border border-[#D6D5CF]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#111111] text-[#E9E8E3] flex items-center justify-center text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-bold text-[#111111] truncate">{userName}</span>
                <span className="font-mono text-[10px] text-[#666666] truncate">{user.email}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-between border-b border-[#D6D5CF]/50 ${
                    active ? 'text-[#111111] font-bold pl-2 border-l-2 border-l-[#111111]' : 'text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 text-xs font-mono uppercase tracking-[0.15em] border border-[#A63D3D] text-[#A63D3D] hover:bg-[#A63D3D] hover:text-white transition-colors flex items-center justify-center gap-2 rounded-sm"
              >
                <LogOut className="w-4 h-4" />
                KELUAR
              </button>
            ) : (
              <Link
                href="/masuk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-mono uppercase tracking-[0.15em] border border-[#111111] text-[#111111] text-center hover:bg-[#111111] hover:text-[#E9E8E3] transition-colors rounded-sm"
              >
                MASUK DENGAN GOOGLE
              </Link>
            )}

            <Link
              href="/tanda-tangan"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-black w-full text-center flex items-center justify-center gap-2 py-2.5 text-xs rounded-sm"
            >
              BUAT TANDA TANGAN
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
