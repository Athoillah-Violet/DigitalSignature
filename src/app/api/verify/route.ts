import { NextRequest, NextResponse } from 'next/server';
import { getDocumentById } from '@/lib/db';
import { sha256Hex, safeEqual, verifySignature, getPublicKey } from '@/lib/crypto';
import { validatePdfBuffer } from '@/lib/validate';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export type VerificationStatus = 'ASLI' | 'DIUBAH' | 'TIDAK_DITEMUKAN' | 'DICABUT';

export interface VerificationResponse {
  status: VerificationStatus;
  message: string;
  document?: {
    id: string;
    signer_name: string;
    file_name: string | null;
    created_at: Date;
    key_id: string;
  };
  details?: {
    computed_hash: string;
    stored_hash?: string;
    signature_valid?: boolean;
    hash_match?: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 0. Rate Limiting Sederhana (Maks 30 permintaan verifikasi per menit per IP)
    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit(clientIp, 'verify', {
      windowMs: 60 * 1000,
      maxRequests: 30,
    });
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          status: 'TIDAK_DITEMUKAN',
          message: 'Terlalu banyak permintaan verifikasi. Silakan tunggu beberapa saat.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const formData = await request.formData();
    const idField = formData.get('id');
    const fileField = formData.get('file');

    if (!idField || typeof idField !== 'string') {
      return NextResponse.json(
        {
          status: 'TIDAK_DITEMUKAN',
          message: 'ID dokumen wajib diisi.',
        },
        { status: 400 }
      );
    }

    const docId = idField.trim();

    // 1. Cari dokumen di database
    const doc = await getDocumentById(docId);
    if (!doc) {
      return NextResponse.json({
        status: 'TIDAK_DITEMUKAN',
        message: `Dokumen dengan ID "${docId}" tidak terdaftar di sistem VERITAS.`,
      });
    }

    // Jika tidak ada file yang dilampirkan, hanya cek status registrasi ID
    if (!fileField || !(fileField instanceof Blob)) {
      if (doc.status === 'revoked') {
        return NextResponse.json({
          status: 'DICABUT',
          message: 'Dokumen ini telah dicabut oleh penerbitnya dan tidak lagi sah.',
          document: {
            id: doc.id,
            signer_name: doc.signer_name,
            file_name: doc.file_name,
            created_at: doc.created_at,
            key_id: doc.key_id,
          },
        });
      }

      return NextResponse.json({
        status: 'ASLI',
        message: 'ID Dokumen terdaftar dan valid di sistem. Silakan unggah file PDF untuk verifikasi fisik/digital lengkap.',
        document: {
          id: doc.id,
          signer_name: doc.signer_name,
          file_name: doc.file_name,
          created_at: doc.created_at,
          key_id: doc.key_id,
        },
      });
    }

    // 2. Validasi file PDF yang diunggah
    const arrayBuffer = await fileField.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validatePdfBuffer(buffer);
    if (!validation.valid) {
      return NextResponse.json(
        {
          status: 'DIUBAH',
          message: validation.error || 'File yang diunggah bukan PDF yang valid.',
        },
        { status: 400 }
      );
    }

    // 3. Hitung hash SHA-256 dokumen yang diunggah
    const computedHash = sha256Hex(buffer);

    // 4. Verifikasi kecocokan hash dengan yang ada di DB
    const hashMatch = safeEqual(computedHash, doc.doc_hash);

    // 5. Verifikasi tanda tangan digital RSA menggunakan public key
    let signatureValid = false;
    try {
      const publicKey = getPublicKey();
      signatureValid = verifySignature(doc.doc_hash, doc.signature, publicKey);
    } catch (cryptoErr) {
      console.error('Error verifying digital signature:', cryptoErr);
    }

    // PRIVASI: Jangan kirim signer_email!
    const publicDocInfo = {
      id: doc.id,
      signer_name: doc.signer_name,
      file_name: doc.file_name,
      created_at: doc.created_at,
      key_id: doc.key_id,
    };

    // 6. Cek status DICABUT
    if (doc.status === 'revoked') {
      return NextResponse.json({
        status: 'DICABUT',
        message: 'Tanda tangan digital valid, namun dokumen ini telah DICABUT oleh penerbitnya dan dinyatakan TIDAK BERLAKU.',
        document: publicDocInfo,
        details: {
          computed_hash: computedHash,
          stored_hash: doc.doc_hash,
          signature_valid: signatureValid,
          hash_match: hashMatch,
        },
      });
    }

    // 7. Jika hash tidak cocok atau signature tidak valid
    if (!hashMatch || !signatureValid) {
      return NextResponse.json({
        status: 'DIUBAH',
        message: 'Dokumen telah DIUBAH atau tidak identik dengan dokumen asli yang ditandatangani.',
        document: publicDocInfo,
        details: {
          computed_hash: computedHash,
          stored_hash: doc.doc_hash,
          signature_valid: signatureValid,
          hash_match: hashMatch,
        },
      });
    }

    // 8. Berhasil: ASLI
    return NextResponse.json({
      status: 'ASLI',
      message: 'Dokumen diverifikasi ASLI dan belum pernah dimodifikasi sejak ditandatangani.',
      document: publicDocInfo,
      details: {
        computed_hash: computedHash,
        stored_hash: doc.doc_hash,
        signature_valid: signatureValid,
        hash_match: hashMatch,
      },
    });
  } catch (err: unknown) {
    console.error('Error in /api/verify:', err);
    return NextResponse.json(
      {
        status: 'TIDAK_DITEMUKAN',
        message: 'Terjadi kesalahan saat memproses verifikasi.',
      },
      { status: 500 }
    );
  }
}
