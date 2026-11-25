import { NextRequest, NextResponse } from 'next/server';
import { getDocumentById } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID dokumen tidak valid' },
        { status: 400 }
      );
    }

    const doc = await getDocumentById(id.trim());
    if (!doc) {
      return NextResponse.json(
        { error: 'Dokumen tidak ditemukan' },
        { status: 404 }
      );
    }

    // PRIVASI: Sesuai README bagian 6B & ALUR_PENGERJAAN FASE 7,
    // jangan pernah menampilkan signer_email pada data publik.
    return NextResponse.json({
      id: doc.id,
      signer_name: doc.signer_name,
      file_name: doc.file_name,
      status: doc.status,
      created_at: doc.created_at,
      key_id: doc.key_id,
      doc_hash: doc.doc_hash,
    });
  } catch (err: unknown) {
    console.error('Error in /api/document/[id]:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal pada server' },
      { status: 500 }
    );
  }
}
