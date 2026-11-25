import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { validatePdfBuffer, SignFormSchema } from '@/lib/validate';
import { stampPdfWithQr, generateDocumentId } from '@/lib/pdf';
import { sha256Hex, signHash, getSigningKeyId } from '@/lib/crypto';
import { insertDocument } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting Sederhana (Maks 15 permintaan tanda tangan per menit per IP)
    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit(clientIp, 'sign', {
      windowMs: 60 * 1000,
      maxRequests: 15,
    });
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Terlalu banyak permintaan tanda tangan. Silakan tunggu beberapa saat sebelum mencoba lagi.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // 1. Verifikasi Autentikasi Pengguna (Wajib Login)
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Akses ditolak. Anda harus masuk dengan akun Google terlebih dahulu.' },
        { status: 401 }
      );
    }

    // 2. Pemeriksaan Header Origin (CSRF Protection)
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { error: 'Permintaan lintas situs (Cross-Origin) tidak diizinkan.' },
          { status: 403 }
        );
      }
    }

    // 3. Baca multipart form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'Berkas PDF wajib diunggah.' },
        { status: 400 }
      );
    }

    const rawPlacement = formData.get('placement') || 'last';
    const parsedParams = SignFormSchema.safeParse({
      placement: rawPlacement,
      fileName: file instanceof File ? file.name : undefined,
    });

    if (!parsedParams.success) {
      return NextResponse.json(
        { error: 'Parameter form tidak valid.', details: parsedParams.error.flatten() },
        { status: 400 }
      );
    }

    // 4. Validasi format berkas & magic bytes '%PDF-'
    const arrayBuffer = await file.arrayBuffer();
    const originalPdfBuffer = Buffer.from(arrayBuffer);

    const validation = validatePdfBuffer(originalPdfBuffer);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 5. Generate ID Dokumen unik pendek
    const docId = generateDocumentId();
    const signedAt = new Date();

    // 6. Tempelkan QR Code & teks metadata ke PDF (default: halaman terakhir)
    const { stampedPdfBuffer, verificationUrl } = await stampPdfWithQr({
      pdfBuffer: originalPdfBuffer,
      docId,
      signerName: user.name,
      signedAt,
      placement: parsedParams.data.placement,
    });

    // 7. Hitung nilai SHA-256 dari PDF final (yang sudah ada QR code)
    const docHash = sha256Hex(stampedPdfBuffer);

    // 8. Tanda tangani hash PDF final dengan kunci privat server
    const keyId = getSigningKeyId();
    const signature = signHash(docHash);

    // 9. Simpan rekaman verifikasi ke database PostgreSQL
    const fileName = file instanceof File ? file.name : 'dokumen.pdf';
    await insertDocument({
      id: docId,
      doc_hash: docHash,
      signature,
      user_id: user.id,
      signer_name: user.name,
      signer_email: user.email,
      file_name: fileName,
      key_id: keyId,
    });

    // 10. Kembalikan berkas PDF final untuk diunduh langsung
    // Nama file hasil: [nama-asli]-signed-veritas.pdf
    const safeBaseName = fileName.replace(/\.[^/.]+$/, '');
    const outputFileName = `${safeBaseName}-signed-veritas.pdf`;

    return new Response(new Uint8Array(stampedPdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(outputFileName)}"`,
        'x-veritas-doc-id': docId,
        'x-veritas-doc-hash': docHash,
        'x-veritas-verify-url': verificationUrl,
      },
    });
  } catch (error) {
    console.error('Error saat proses penandatanganan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses tanda tangan dokumen.' },
      { status: 500 }
    );
  }
}
