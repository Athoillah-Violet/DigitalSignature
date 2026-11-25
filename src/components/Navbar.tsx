'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowUpRight, User, LogOut, FileText } from 'lucide-react';
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
    { label: 'Buat Tanda Tangan', href: '/tanda-tangan' },
    { label: 'Cek Keaslian', href: '/verifikasi' },
    ...(user ? [{ label: 'Riwayat Dokumen', href: '/riwayat' }] : []),
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
    <header className="sticky top-0 z-50 w-full bg-[#E9E8E3]/90 backdrop-blur-md border-b border-[#D6D5CF] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Menu Kiri (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
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
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 py-2 px-3 border border-[#D6D5CF] bg-[#FAF9F5] hover:border-[#111111] transition-colors cursor-pointer text-xs font-mono uppercase"
              >
                {userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#111111] text-[#E9E8E3] flex items-center justify-center text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                )}
                <span className="max-w-[120px] truncate tracking-wider font-semibold">
                  {userName}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FAF9F5] border border-[#111111] shadow-lg py-2 z-50 flex flex-col font-mono text-xs">
                  <div className="px-4 py-2 border-b border-[#D6D5CF] text-[10px] text-[#666666] truncate">
                    {user.email}
                  </div>
                  <Link
                    href="/riwayat"
                    onClick={() => setUserMenuOpen(false)}
                    className="px-4 py-2.5 hover:bg-[#E9E8E3] flex items-center gap-2 tracking-wider uppercase text-[#111111]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Riwayat Dokumen
                  </Link>
                  <Link
                    href="/tanda-tangan"
                    onClick={() => setUserMenuOpen(false)}
                    className="px-4 py-2.5 hover:bg-[#E9E8E3] flex items-center gap-2 tracking-wider uppercase text-[#111111]"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Tanda Tangani PDF
                  </Link>
                  <div className="border-t border-[#D6D5CF] my-1" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#A63D3D]/10 text-[#A63D3D] flex items-center gap-2 tracking-wider uppercase cursor-pointer"
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
              className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-[0.2em] border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#E9E8E3] transition-colors"
            >
              MASUK
            </Link>
          )}

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
          {user && (
            <div className="pb-3 border-b border-[#D6D5CF] flex items-center gap-3">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#111111] text-[#E9E8E3] flex items-center justify-center text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[#111111]">{userName}</span>
                <span className="font-mono text-[10px] text-[#666666] truncate">{user.email}</span>
              </div>
            </div>
          )}

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

          <div className="pt-2 flex flex-col gap-2.5">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 text-xs font-mono uppercase tracking-[0.15em] border border-[#A63D3D] text-[#A63D3D] hover:bg-[#A63D3D] hover:text-[#FAF9F5] transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                KELUAR
              </button>
            ) : (
              <Link
                href="/masuk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-mono uppercase tracking-[0.15em] border border-[#111111] text-[#111111] text-center hover:bg-[#111111] hover:text-[#E9E8E3] transition-colors"
              >
                MASUK DENGAN GOOGLE
              </Link>
            )}

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
