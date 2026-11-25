'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const error = searchParams.get('error');
  const [loading, setLoading] = useState(false);

  // Sanitasi tujuan redirect
  const safeNext = next.startsWith('/') && !next.startsWith('//') && !next.includes('://') ? next : '/';

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
      
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (signInError) {
        console.error('Login error:', signInError);
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 border border-[#D6D5CF] bg-[#FAF9F5]/70 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center mb-8">
        <span className="label-mono text-[#555555] mb-2">AUTENTIKASI // PROTOKOL</span>
        <h1 className="text-3xl sm:text-4xl font-serif-light text-[#111111] italic">
          Masuk ke VERITAS
        </h1>
        <p className="font-mono text-xs text-[#666666] mt-3 leading-relaxed">
          Tanda tangan digital terikat secara sah ke akun Google Anda untuk membuktikan identitas penandatangan.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-[#A63D3D] bg-[#A63D3D]/10 text-[#A63D3D] text-xs font-mono">
          Autentikasi gagal atau dibatalkan. Silakan coba kembali.
        </div>
      )}

      {safeNext !== '/' && (
        <div className="mb-6 p-3 border border-[#D6D5CF] bg-[#E9E8E3] text-[#555555] text-xs font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
          <span>Halaman ini memerlukan login terlebih dahulu.</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full btn-black py-4 flex items-center justify-center gap-3 text-xs tracking-[0.15em] cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            MENGHUBUNGKAN GOOGLE...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            MASUK DENGAN GOOGLE
          </>
        )}
      </button>

      <div className="mt-8 pt-6 border-t border-[#D6D5CF] text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 label-mono text-[#777777] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          KEMBALI KE BERANDA
        </Link>
      </div>
    </div>
  );
}

export default function MasukPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#E9E8E3] text-[#111111]">
      <TopBar />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense
          fallback={
            <div className="p-8 font-mono text-xs text-[#555555]">
              MEMUAT HALAMAN AUTENTIKASI...
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
