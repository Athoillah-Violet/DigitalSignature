import crypto from 'node:crypto';

/**
 * Normalisasi format kunci PEM dari environment variable (mengubah \n string menjadi karakter newline asli)
 */
export function formatPemKey(key: string | undefined): string {
  if (!key) return '';
  let formatted = key.trim();
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1);
  }
  return formatted.replace(/\\n/g, '\n');
}

/**
 * Mengambil kunci privat dari environment variable server
 */
export function getPrivateKey(): string {
  const raw = process.env.SIGNING_PRIVATE_KEY;
  if (!raw) {
    throw new Error('SIGNING_PRIVATE_KEY is not defined in environment variables');
  }
  return formatPemKey(raw);
}

/**
 * Mengambil kunci publik dari environment variable
 */
export function getPublicKey(): string {
  const raw = process.env.SIGNING_PUBLIC_KEY;
  if (!raw) {
    throw new Error('SIGNING_PUBLIC_KEY is not defined in environment variables');
  }
  return formatPemKey(raw);
}

/**
 * Mengambil ID versi kunci signing
 */
export function getSigningKeyId(): string {
  return process.env.SIGNING_KEY_ID || 'k1';
}

/**
 * Menghitung nilai SHA-256 dalam format heksadesimal lowercase
 */
export function sha256Hex(buffer: Buffer | Uint8Array | string): string {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

/**
 * Menandatangani hash dokumen menggunakan RSA-2048 / SHA-256 dengan kunci privat server.
 * Mengembalikan signature dalam format base64.
 */
export function signHash(hashHex: string, privateKeyPem?: string): string {
  const key = privateKeyPem || getPrivateKey();
  const signer = crypto.createSign('SHA256');
  signer.update(hashHex);
  signer.end();
  return signer.sign(key, 'base64');
}

/**
 * Memverifikasi signature terhadap hash dokumen menggunakan kunci publik server.
 * Mengembalikan true jika signature sah, false jika tidak sah atau korup.
 */
export function verifySignature(hashHex: string, signatureBase64: string, publicKeyPem?: string): boolean {
  try {
    const key = publicKeyPem || getPublicKey();
    const verifier = crypto.createVerify('SHA256');
    verifier.update(hashHex);
    verifier.end();
    return verifier.verify(key, signatureBase64, 'base64');
  } catch {
    return false;
  }
}

/**
 * Membandingkan dua string (mis. hash) secara aman terhadap serangan timing attack
 * Menggunakan crypto.timingSafeEqual
 */
export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
