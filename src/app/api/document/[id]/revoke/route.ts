import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { revokeDocument, getDocumentById } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Wajib login
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Akses ditolak. Anda harus masuk terlebih dahulu.' },
        { status: 401 }
      );
    }

    // 2. Periksa Origin (CSRF Protection)
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { error: 'Permintaan tidak sah (Cross-Origin Request Blocked)' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Origin header tidak valid' },
          { status: 403 }
        );
      }
    }

    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID dokumen tidak valid' },
        { status: 400 }
      );
    }

    // 3. Pastikan dokumen ada dan dimiliki oleh user yang bersangkutan
    const existing = await getDocumentById(id.trim());
    if (!existing) {
      return NextResponse.json(
        { error: 'Dokumen tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Akses ditolak. Anda bukan pemilik dokumen ini.' },
        { status: 403 }
      );
    }

    // 4. Lakukan pencabutan
    const success = await revokeDocument(id.trim(), user.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Gagal mencabut dokumen atau dokumen telah dicabut sebelumnya' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dokumen berhasil dicabut. Status dokumen kini DICABUT.',
    });
  } catch (err: unknown) {
    console.error('Error in /api/document/[id]/revoke:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal pada server' },
      { status: 500 }
    );
  }
}
