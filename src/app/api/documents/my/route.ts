import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { listDocumentsByUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Akses ditolak. Anda belum masuk.' },
        { status: 401 }
      );
    }

    const documents = await listDocumentsByUser(user.id);

    // Filter data agar aman
    const formatted = documents.map((doc) => ({
      id: doc.id,
      file_name: doc.file_name,
      signer_name: doc.signer_name,
      status: doc.status,
      created_at: doc.created_at,
      key_id: doc.key_id,
      doc_hash: doc.doc_hash,
    }));

    return NextResponse.json({ documents: formatted });
  } catch (err: unknown) {
    console.error('Error in /api/documents/my:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal pada server' },
      { status: 500 }
    );
  }
}
