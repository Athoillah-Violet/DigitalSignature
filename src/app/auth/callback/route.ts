import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Sanitasi parameter next: cegah serangan Open Redirect
  let safeNext = '/';
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.includes('://')) {
    safeNext = next;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Arahkan kembali ke /masuk jika penukaran kode gagal
  return NextResponse.redirect(`${origin}/masuk?error=auth_failed`);
}
