import crypto from 'node:crypto';

console.log('====================================================');
console.log('      VERITAS — GENERATOR PASANGAN KUNCI RSA-2048   ');
console.log('====================================================\n');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// Format baris baru menjadi literal \n agar aman ditempel dalam 1 baris di .env.local
const privateKeyEscaped = privateKey.replace(/\r?\n/g, '\\n');
const publicKeyEscaped = publicKey.replace(/\r?\n/g, '\\n');

console.log('Salin 3 baris konfigurasi di bawah ini dan tempelkan ke file .env.local Anda:\n');
console.log('----------------- SALIN MULAI DARI SINI -----------------');
console.log('SIGNING_KEY_ID=k1');
console.log(`SIGNING_PRIVATE_KEY="${privateKeyEscaped}"`);
console.log(`SIGNING_PUBLIC_KEY="${publicKeyEscaped}"`);
console.log('----------------- SALIN SAMPAI DI SINI ------------------\n');
console.log('⚠️  PERINGATAN: Kunci privat bersifat rahasia. Jangan pernah membagikan atau menaruhnya di git!');
