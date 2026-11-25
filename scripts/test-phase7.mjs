import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pg from 'pg';
import crypto from 'node:crypto';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function sha256Hex(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function formatPemKey(key, type) {
  if (!key) return '';
  let formatted = key.trim();
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1);
  }
  formatted = formatted.replace(/\\n/g, '\n');
  if (type) {
    const header = `-----BEGIN ${type} KEY-----`;
    const footer = `-----END ${type} KEY-----`;
    if (!formatted.includes(header)) {
      if (formatted.startsWith('n')) formatted = formatted.substring(1);
      formatted = `${header}\n${formatted}`;
    }
    if (!formatted.includes(footer)) {
      if (formatted.endsWith('n')) formatted = formatted.substring(0, formatted.length - 1);
      formatted = `${formatted}\n${footer}\n`;
    }
  }
  return formatted;
}

function signHash(hashHex) {
  const privateKeyPem = formatPemKey(process.env.SIGNING_PRIVATE_KEY, 'PRIVATE');
  const signer = crypto.createSign('SHA256');
  signer.update(hashHex);
  signer.end();
  return signer.sign(privateKeyPem, 'base64');
}

function verifySignature(hashHex, signatureBase64, publicKeyPem) {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(hashHex);
  verifier.end();
  return verifier.verify(publicKeyPem, signatureBase64, 'base64');
}

function safeEqual(a, b) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function insertDocument(doc) {
  const query = `
    INSERT INTO public.documents (
      id, doc_hash, signature, user_id, signer_name, signer_email, file_name, key_id, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'valid')
    RETURNING *;
  `;
  const values = [
    doc.id,
    doc.doc_hash,
    doc.signature,
    doc.user_id,
    doc.signer_name,
    doc.signer_email,
    doc.file_name || null,
    doc.key_id,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getDocumentById(id) {
  const query = `SELECT * FROM public.documents WHERE id = $1 LIMIT 1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function revokeDocument(id, userId) {
  const query = `
    UPDATE public.documents
    SET status = 'revoked'
    WHERE id = $1 AND user_id = $2
    RETURNING id;
  `;
  const { rowCount } = await pool.query(query, [id, userId]);
  return (rowCount ?? 0) > 0;
}

async function runTests() {
  console.log('--- MEMULAI PENGUJIAN FASE 7: VERIFIKASI DOKUMEN ---');

  // Siapkan dummy user di auth.users untuk testing
  const testUserId = crypto.randomUUID();
  console.log(`0. Membuat dummy user test di auth.users: ${testUserId}`);
  await pool.query(`
    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES ($1, 'test.verifier@veritas.internal', '{"full_name": "Penguji Resmi Veritas"}'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  `, [testUserId]);

  try {
    // 1. Buat dokumen PDF contoh
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText('DOKUMEN UJI RESMI VERITAS', { x: 50, y: 350, size: 18, font, color: rgb(0, 0, 0) });
    page.drawText('Isi rahasia integritas digital untuk pengujian verifikasi.', { x: 50, y: 300, size: 12, font });
    const originalPdfBytes = await pdfDoc.save();
    const originalBuffer = Buffer.from(originalPdfBytes);

    // 2. Hash & Sign
    const docHash = sha256Hex(originalBuffer);
    const signature = signHash(docHash);
    const testDocId = 'test_' + Date.now().toString(36);

    console.log(`1. Menyimpan dokumen uji dengan ID: ${testDocId}`);
    await insertDocument({
      id: testDocId,
      doc_hash: docHash,
      signature: signature,
      user_id: testUserId,
      signer_name: 'Penguji Resmi Veritas',
      signer_email: 'test.verifier@veritas.internal',
      file_name: 'test_doc.pdf',
      key_id: process.env.SIGNING_KEY_ID || 'veritas-primary-2026',
    });

    // 3. Test Kasus 1: Dokumen Asli (Identik)
    console.log('\n2. Menguji verifikasi dokumen asli...');
    const fetchedDoc = await getDocumentById(testDocId);
    if (!fetchedDoc) throw new Error('Dokumen tidak ditemukan di DB');

    const pubKey = formatPemKey(process.env.SIGNING_PUBLIC_KEY, 'PUBLIC');
    const testHash1 = sha256Hex(originalBuffer);
    const match1 = safeEqual(testHash1, fetchedDoc.doc_hash);
    const sigValid1 = verifySignature(fetchedDoc.doc_hash, fetchedDoc.signature, pubKey);
    console.log(`- Hash match: ${match1} (expected: true)`);
    console.log(`- Signature valid: ${sigValid1} (expected: true)`);
    console.log(`- Status: ${fetchedDoc.status} (expected: valid -> ASLI)`);
    if (!match1 || !sigValid1 || fetchedDoc.status !== 'valid') throw new Error('Uji ASLI gagal!');

    // 4. Test Kasus 2: Dokumen Diubah (Modifikasi walau 1 byte)
    console.log('\n3. Menguji verifikasi dokumen yang dimodifikasi...');
    const modifiedBuffer = Buffer.from(originalBuffer);
    modifiedBuffer[modifiedBuffer.length - 1] ^= 0xff;
    const testHash2 = sha256Hex(modifiedBuffer);
    const match2 = safeEqual(testHash2, fetchedDoc.doc_hash);
    console.log(`- Modified Hash match: ${match2} (expected: false)`);
    if (match2) throw new Error('Uji DIUBAH gagal: hash berbeda dianggap sama!');

    // 5. Test Kasus 3: ID Acak / Tidak Terdaftar
    console.log('\n4. Menguji verifikasi ID acak...');
    const randomDoc = await getDocumentById('nonexistent_id_999');
    console.log(`- Random ID lookup: ${randomDoc} (expected: null -> TIDAK_DITEMUKAN)`);
    if (randomDoc !== null) throw new Error('Uji TIDAK_DITEMUKAN gagal!');

    // 6. Test Kasus 4 & 5: Pencabutan (Revoke)
    console.log('\n5. Menguji kontrol akses pencabutan dokumen...');
    // Pengguna asing mencoba cabut -> harus gagal
    const alienUserId = crypto.randomUUID();
    const revokedByAlien = await revokeDocument(testDocId, alienUserId);
    console.log(`- Revoke oleh user asing: ${revokedByAlien} (expected: false)`);
    if (revokedByAlien) throw new Error('Security flaw: pengguna asing bisa mencabut dokumen!');

    // Pemilik asli mencabut dokumen -> harus sukses
    const revokedByOwner = await revokeDocument(testDocId, testUserId);
    console.log(`- Revoke oleh pemilik: ${revokedByOwner} (expected: true)`);
    if (!revokedByOwner) throw new Error('Pencabutan oleh pemilik gagal!');

    const docAfterRevoke = await getDocumentById(testDocId);
    console.log(`- Status dokumen setelah dicabut: ${docAfterRevoke?.status} (expected: revoked -> DICABUT)`);
    if (docAfterRevoke?.status !== 'revoked') throw new Error('Status tidak berubah menjadi revoked!');

    // Bersihkan data uji
    await pool.query('DELETE FROM public.documents WHERE id = $1', [testDocId]);
    await pool.query('DELETE FROM auth.users WHERE id = $1', [testUserId]);

    console.log('\n✅ SEMUA PENGUJIAN FASE 7 BERHASIL 100%!');
  } finally {
    await pool.end();
  }
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ GAGAL:', err);
  pool.end();
  process.exit(1);
});
