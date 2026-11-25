import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { customAlphabet } from 'nanoid';

// Generator ID unik pendek 10 karakter huruf besar dan angka (contoh: K7F9X2QA8M)
const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

export function generateDocumentId(): string {
  return generateId();
}

export interface StampPdfParams {
  pdfBuffer: Buffer;
  docId: string;
  signerName: string;
  signedAt: Date;
  placement?: 'last' | 'all';
}

export interface StampPdfResult {
  stampedPdfBuffer: Buffer;
  docId: string;
  verificationUrl: string;
}

/**
 * Menempelkan stempel QR Code dan metadata penandatangan pada halaman PDF
 * Mengembalikan buffer PDF final sebelum perhitungan SHA-256
 */
export async function stampPdfWithQr({
  pdfBuffer,
  docId,
  signerName,
  signedAt,
  placement = 'last',
}: StampPdfParams): Promise<StampPdfResult> {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const verificationUrl = `${baseUrl}/verifikasi/${docId}`;

  // 1. Buat QR Code PNG Buffer
  const qrPngBuffer = await QRCode.toBuffer(verificationUrl, {
    type: 'png',
    margin: 1,
    width: 200,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#111111',
      light: '#FFFFFF',
    },
  });

  // 2. Muat dokumen PDF dengan pdf-lib
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const qrImage = await pdfDoc.embedPng(qrPngBuffer);
  const fontMono = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const totalPages = pdfDoc.getPageCount();
  const pagesToStamp = placement === 'all'
    ? pdfDoc.getPages()
    : [pdfDoc.getPage(totalPages - 1)];

  // Format tanggal penandatanganan (WIB / GMT+7)
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Jakarta',
  }).format(signedAt);

  const qrSize = 54;
  const paddingBottom = 22;
  const paddingLeft = 32;

  for (const page of pagesToStamp) {
    const { width } = page.getSize();
    const yPos = paddingBottom;
    const xPos = width - paddingLeft - 220; // Posisikan di kanan bawah

    // Garis pembatas tipis di atas stempel
    page.drawLine({
      start: { x: paddingLeft, y: yPos + qrSize + 10 },
      end: { x: width - paddingLeft, y: yPos + qrSize + 10 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Tempelkan gambar QR Code
    page.drawImage(qrImage, {
      x: xPos,
      y: yPos,
      width: qrSize,
      height: qrSize,
    });

    // Tulis teks metadata di sebelah kanan QR Code
    const textX = xPos + qrSize + 8;
    const textYTop = yPos + qrSize - 8;

    // Header stempel
    page.drawText('VERITAS DIGITAL SIGNATURE', {
      x: textX,
      y: textYTop,
      size: 6.5,
      font: fontMono,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Penandatangan
    page.drawText(`Penandatangan: ${signerName.slice(0, 30)}`, {
      x: textX,
      y: textYTop - 11,
      size: 6.5,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Tanggal
    page.drawText(`Waktu: ${formattedDate} WIB`, {
      x: textX,
      y: textYTop - 22,
      size: 6,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });

    // ID Dokumen
    page.drawText(`ID: ${docId}`, {
      x: textX,
      y: textYTop - 33,
      size: 6.5,
      font: fontMono,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Teks kecil verifikasi
    page.drawText('Scan QR / veritas untuk cek keaslian', {
      x: textX,
      y: textYTop - 44,
      size: 5.5,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // 3. Simpan perubahan ke buffer PDF baru
  const stampedBytes = await pdfDoc.save();
  const stampedPdfBuffer = Buffer.from(stampedBytes);

  return {
    stampedPdfBuffer,
    docId,
    verificationUrl,
  };
}
