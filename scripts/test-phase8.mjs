const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function validatePdfBuffer(buffer) {
  if (buffer.length === 0) {
    return { valid: false, error: 'Berkas kosong.' };
  }
  if (buffer.length > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Ukuran berkas melebihi batas maksimum 10 MB.',
    };
  }
  const magicBytes = buffer.subarray(0, 5).toString('ascii');
  if (magicBytes !== '%PDF-') {
    return {
      valid: false,
      error: 'Format berkas tidak valid. Berkas harus berupa dokumen PDF asli (magic bytes %PDF-).',
    };
  }
  return { valid: true };
}

const ipStore = new Map();

function checkRateLimit(ip, keyPrefix, options) {
  const now = Date.now();
  const key = `${keyPrefix}:${ip}`;

  let record = ipStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    ipStore.set(key, record);
  }

  const windowStart = now - options.windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.maxRequests) {
    return { success: false, remaining: 0 };
  }

  record.timestamps.push(now);
  return { success: true, remaining: options.maxRequests - record.timestamps.length };
}

console.log('--- MEMULAI PENGUJIAN FASE 8: KEAMANAN & HARDENING ---');

// 1. Pengujian Validasi File Bukan PDF
console.log('\n1. Menguji unggahan file non-PDF (misal file teks diubah ekstensi jadi .pdf)...');
const fakePdfBuffer = Buffer.from('INI_BUKAN_FILE_PDF_TETAPI_FILE_TEKS_BIASA');
const fakeResult = validatePdfBuffer(fakePdfBuffer);
console.log(`- Validasi file non-PDF: valid=${fakeResult.valid}, error="${fakeResult.error}"`);
if (fakeResult.valid) {
  throw new Error('Keamanan bobol: file non-PDF diizinkan!');
}

// 2. Pengujian Validasi Ukuran Melebihi Batas (10 MB)
console.log('\n2. Menguji unggahan file melebihi batas 10 MB...');
const largeBuffer = Buffer.alloc(11 * 1024 * 1024, '%PDF-1.4 dummy large file content');
const largeResult = validatePdfBuffer(largeBuffer);
console.log(`- Validasi file 11MB: valid=${largeResult.valid}, error="${largeResult.error}"`);
if (largeResult.valid) {
  throw new Error('Keamanan bobol: file > 10 MB diizinkan!');
}

// 3. Pengujian Rate Limiting Beruntun Cepat
console.log('\n3. Menguji batas laju (Rate Limiting) permintaan beruntun...');
const testIp = '192.168.1.100';
const limitOptions = { windowMs: 1000, maxRequests: 5 };

let blocked = false;
for (let i = 1; i <= 7; i++) {
  const res = checkRateLimit(testIp, 'test_rate', limitOptions);
  console.log(`- Request #${i}: success=${res.success}, remaining=${res.remaining}`);
  if (!res.success) {
    blocked = true;
    break;
  }
}
if (!blocked) {
  throw new Error('Keamanan bobol: permintaan beruntun cepat tidak dibatasi!');
}

console.log('\n✅ SEMUA PENGUJIAN KEAMANAN FASE 8 BERHASIL 100%!');
