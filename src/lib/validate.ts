import { z } from 'zod';

// Batas ukuran fungsi Serverless Vercel adalah 4.5 MB untuk request payload.
// Kita batasi maksimum 4 MB agar aman dari batas 4.5 MB Vercel Serverless Function.
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

export const SignFormSchema = z.object({
  placement: z.enum(['last', 'all']).default('last'),
  fileName: z.string().max(255).optional(),
});

/**
 * Validasi buffer PDF:
 * 1. Tidak kosong
 * 2. Ukuran <= 10 MB
 * 3. Mengandung magic bytes '%PDF-'
 */
export function validatePdfBuffer(buffer: Buffer): { valid: boolean; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'File dokumen kosong atau tidak terbaca.' };
  }

  if (buffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Ukuran file melebihi batas maksimal 4 MB (batas serverless hosting).',
    };
  }

  // Cek magic bytes '%PDF-' pada header berkas
  const header = buffer.subarray(0, 1024);
  const pdfIndex = header.indexOf('%PDF-');
  if (pdfIndex === -1) {
    return {
      valid: false,
      error: 'Berkas bukan merupakan dokumen PDF valid (header %PDF- tidak ditemukan).',
    };
  }

  return { valid: true };
}
