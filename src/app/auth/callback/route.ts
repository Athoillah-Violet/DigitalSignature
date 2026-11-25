import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Dapatkan host sebenarnya dari header forwarded jika di belakang proxy (Vercel)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const effectiveOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : origin;

  // Sanitasi parameter next: cegah serangan Open Redirect
  let safeNext = '/';
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.includes('://')) {
    safeNext = next;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${effectiveOrigin}${safeNext}`);
    }
  }

  // Arahkan kembali ke /masuk jika penukaran kode gagal
  return NextResponse.redirect(`${effectiveOrigin}/masuk?error=auth_failed`);
}

