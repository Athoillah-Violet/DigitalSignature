import { createClient } from '@/lib/supabase/server';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

/**
 * Mengambil data pengguna aktif di server dengan validasi token JWT ke Supabase Auth.
 * Aman dan tidak rentan spoofing cookie lokal.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Pengguna';

    return {
      id: user.id,
      email: user.email || '',
      name,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    };
  } catch {
    return null;
  }
}
