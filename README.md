# VERITAS — Web Tanda Tangan Digital

> Aplikasi web untuk **membuat** tanda tangan digital pada dokumen PDF dan **memeriksa keaslian** dokumen tersebut lewat QR code.
> File ini adalah sumber kebenaran untuk **konsep**. Untuk urutan pengerjaan lihat `ALUR_PENGERJAAN.md`.

---

## 1. Ringkasan

| Item | Isi |
|---|---|
| Nama kerja | VERITAS (boleh diganti, simpan di `lib/config.ts`) |
| Platform | Web responsif (nyaman di HP, bisa dibungkus APK/PWA belakangan) |
| Fitur utama | 1) Buat Tanda Tangan, 2) Cek Keaslian |
| Format dokumen | PDF saja (maks 10 MB) |
| Bahasa antarmuka | Indonesia |
| Tujuan | Belajar / portofolio / internal. Belum berstatus tanda tangan tersertifikasi (lihat bagian 9) |

---

## 2. Tech Stack

| Kebutuhan | Pilihan |
|---|---|
| Framework | **Next.js** (App Router) + TypeScript |
| Styling | **Tailwind CSS** |
| Animasi scroll | **AOS** (https://michalsnik.github.io/aos/) |
| Font | **Cormorant Garamond** (light, serif Latin elegan), **Inter** / **Archivo** (sans tebal), **JetBrains Mono** (label kecil) |
| Ikon | `lucide-react` |
| Kriptografi | Modul bawaan Node `crypto` (SHA-256 + RSA-2048 atau ECDSA P-256) |
| PDF | `pdf-lib` |
| QR (buat) | `qrcode` |
| QR (scan kamera) | `html5-qrcode` |
| ID pendek | `nanoid` |
| Database | PostgreSQL gratis: **Supabase** atau **Neon** (pilih salah satu, catat di Log Progres) |
| Validasi | `zod` |
| Deploy | Vercel |

---

## 3. Konsep Tampilan

Referensi: gaya portofolio minimalis monokrom (teks raksasa di belakang objek, navbar bersih, label kecil huruf kapital berjarak lebar).

### Palet warna
- Latar: off-white `#E9E8E3`
- Teks / tombol: hitam `#111111`
- Teks sekunder: `#555555`
- Garis tipis: `#D6D5CF`
- Aksen status (titik berkedip): hijau `#2E7D5B`
- Status gagal: merah redup `#A63D3D`

### Tipografi
- **Judul raksasa**: sans tebal, huruf kapital, `clamp(6rem, 20vw, 20rem)`, warna hitam pekat.
- **Judul/kutipan elegan**: Cormorant Garamond **weight 300**, kadang italic.
- **Label kecil**: JetBrains Mono / sans, kapital, `letter-spacing: 0.25em`, ukuran 11–12px.

### Struktur layout
1. **Top bar hitam tipis** (paling atas): teks kecil kiri (nama/proyek), kanan: titik hijau berkedip + "SISTEM AKTIF".
2. **Navbar**: kiri = Beranda, Cara Kerja, Buat Tanda Tangan, Cek Keaslian. Tengah = logo "VERITAS". Kanan = tombol hitam persegi "CEK DOKUMEN ↗".
3. **Hero** (inti desain):
   - Kata besar di tengah, misalnya **VERITAS**, ukuran raksasa, di lapisan belakang (`z-0`).
   - **Gambar timbangan (SVG, latar transparan)** di tengah, menimpa sebagian huruf (`z-10`), melayang naik-turun pelan.
   - **Bayangan elips blur** di bawah timbangan, berdenyut selaras gerak melayang.
   - Kiri bawah: dua tombol, "BUAT TANDA TANGAN →" (hitam penuh) dan "CEK KEASLIAN" (outline).
   - Kanan bawah: label kecil "DOKUMEN TERVERIFIKASI" dan angka besar (contoh `SHA-256 / 2026`).
4. **Section Cara Kerja**: 4 langkah bernomor (Unggah → Hash → Tanda tangan → QR), kartu bergaris tipis.
5. **Section Teknologi / Keamanan**: penjelasan singkat dengan kutipan serif light.
6. **Footer**: hitam, teks kecil.

### Gambar timbangan
- Dibuat sebagai **SVG inline**, gaya line-art / siluet hitam-abu minimalis, **tanpa latar**.
- Disimpan di `public/assets/scale.svg` dan juga sebagai komponen `components/ScaleIllustration.tsx`.
- Tinggi sekitar 55–65% tinggi hero; huruf besar harus terlihat menembus di belakang tiang dan lengan timbangan.

### Animasi
| Animasi | Di mana | Cara |
|---|---|---|
| Berkedip | Titik status hijau, kursor `_` di teks, bayangan timbangan berdenyut | CSS keyframes `blink` / `pulse-soft` |
| Melayang | Timbangan | CSS keyframes `float` (naik-turun ±12px, 6 detik, infinite) |
| Scroll reveal | Semua section | AOS: `fade-up`, `fade-in`, `zoom-in`; durasi 800ms; `once: true` |
| Hover | Tombol & kartu | Transisi 200ms, tombol hitam ke outline (dan sebaliknya) |
| Hasil verifikasi | Kartu hasil | Fade + scale masuk, ikon centang/silang |

Hormati `prefers-reduced-motion`: matikan float dan blink bila pengguna memintanya.

---

## 4. Halaman & Rute

| Rute | Fungsi |
|---|---|
| `/` | Beranda (hero + cara kerja + keamanan) |
| `/tanda-tangan` | Form unggah PDF, isi nama penandatangan, unduh hasil ber-QR |
| `/verifikasi` | Pilih: scan QR dengan kamera, atau masukkan ID; lalu unggah PDF untuk dicek |
| `/verifikasi/[id]` | Tujuan link di dalam QR; menampilkan data penandatangan dan form unggah PDF |
| `/api/sign` | POST: proses penandatanganan |
| `/api/verify` | POST: proses verifikasi |
| `/api/document/[id]` | GET: info publik dokumen (tanpa file) |

---

## 5. Alur Kerja Sistem

### 5.1 Membuat tanda tangan
1. Pengguna mengunggah PDF dan mengisi nama penandatangan.
2. Server memvalidasi (tipe PDF asli, ukuran ≤ 10 MB).
3. Server membuat **ID unik pendek** (contoh `K7F9X2QA`).
4. Server membuat QR berisi `https://DOMAIN/verifikasi/<ID>` lalu **menempelkannya di bagian bawah halaman** PDF (bersama teks kecil: nama, tanggal, ID).
5. Server menghitung **SHA-256 dari PDF final** (yang sudah ada QR-nya).
6. Hash tersebut **ditandatangani dengan kunci privat** menjadi *signature*.
7. Database menyimpan: ID, hash, signature, nama, waktu, ID kunci, status.
8. Server mengembalikan PDF final untuk diunduh. **File tidak disimpan di server.**

> Kenapa hash dihitung setelah QR ditempel: menempelkan QR mengubah isi file. QR hanya berisi ID (sudah ditentukan di langkah 3), jadi urutannya aman dan hash final stabil.

### 5.2 Cek keaslian
1. Pengguna scan QR (atau memasukkan ID) lalu mengunggah PDF yang ingin dicek.
2. Server mengambil data dari database berdasarkan ID.
3. Server menghitung ulang SHA-256 dari PDF yang diunggah.
4. Dua pemeriksaan:
   - Hash baru **sama** dengan hash tersimpan?
   - Signature tersimpan **valid** terhadap hash tersebut memakai **kunci publik**?
5. Pemeriksaan status: belum dicabut (`revoked`).
6. Hasil ditampilkan:
   - **ASLI**: semua cocok. Tampilkan nama, waktu, ID.
   - **TIDAK ASLI / DIUBAH**: hash tidak cocok.
   - **TIDAK DITEMUKAN**: ID tidak ada.
   - **DICABUT**: status revoked.

### 5.3 Catatan batasan
- Verifikasi butuh **file PDF yang sama persis** dengan hasil unduhan. Menyimpan ulang / mengompres / mencetak lalu memindai akan mengubah hash. Tampilkan peringatan ini di UI.
- Tanpa unggah PDF, halaman `/verifikasi/[id]` hanya menampilkan bahwa ID itu terdaftar dan siapa penandatangannya, **bukan** bukti keaslian isi.

---

## 6. Skema Database

Tabel `documents`:

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | text, primary key | ID pendek (nanoid 10 karakter huruf besar+angka) |
| `doc_hash` | text, not null | SHA-256 hex dari PDF final |
| `signature` | text, not null | Signature base64 |
| `signer_name` | text, not null | Nama penandatangan |
| `file_name` | text | Nama file asli (opsional) |
| `key_id` | text, not null | Versi kunci yang dipakai (mis. `k1`) |
| `status` | text, default `valid` | `valid` atau `revoked` |
| `created_at` | timestamptz, default now() | Waktu penandatanganan |

Tabel `signing_keys` (opsional, untuk rotasi kunci):

| Kolom | Tipe | Keterangan |
|---|---|---|
| `key_id` | text, primary key | `k1`, `k2`, dst |
| `public_key_pem` | text | Kunci publik |
| `created_at` | timestamptz | |

Kunci privat **tidak pernah** masuk database.

---

## 7. Struktur Folder (target)

```
veritas/
├─ README.md
├─ ALUR_PENGERJAAN.md
├─ .env.local              (JANGAN di-commit)
├─ .env.example
├─ scripts/
│  └─ generate-keys.mjs
├─ public/assets/scale.svg
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ tanda-tangan/page.tsx
│  │  ├─ verifikasi/page.tsx
│  │  ├─ verifikasi/[id]/page.tsx
│  │  └─ api/{sign,verify}/route.ts
│  ├─ components/
│  │  ├─ TopBar.tsx  Navbar.tsx  Hero.tsx
│  │  ├─ ScaleIllustration.tsx
│  │  ├─ HowItWorks.tsx  Footer.tsx
│  │  ├─ UploadBox.tsx  QrScanner.tsx  ResultCard.tsx
│  │  └─ AosProvider.tsx
│  └─ lib/
│     ├─ config.ts  db.ts
│     ├─ crypto.ts      (hash, sign, verify)
│     ├─ pdf.ts         (tempel QR + teks)
│     └─ validate.ts
```

---

## 8. Environment Variables

```
DATABASE_URL=            # connection string PostgreSQL (Supabase/Neon)
SIGNING_PRIVATE_KEY=     # PEM kunci privat (baris baru diganti \n)
SIGNING_PUBLIC_KEY=      # PEM kunci publik
SIGNING_KEY_ID=k1
NEXT_PUBLIC_BASE_URL=    # contoh: http://localhost:3000 lalu domain asli
```

Aturan: kunci privat hanya di env server, tidak pernah di kode, log, atau repo.

---

## 9. Keamanan & Batasan

- Hanya terima `application/pdf`, cek magic bytes `%PDF-`, batasi 10 MB.
- Rate limiting sederhana pada `/api/sign` dan `/api/verify`.
- Validasi input dengan `zod`; escape nama penandatangan saat ditampilkan.
- Header keamanan dasar (CSP, X-Frame-Options, dll) di `next.config`.
- Perbandingan hash memakai `timingSafeEqual`.
- Siapa pun yang membuka `/tanda-tangan` bisa menandatangani. Untuk versi serius, tambahkan **login** agar identitas penandatangan terbukti. Untuk versi awal, ini dicatat sebagai keterbatasan.
- Ini **bukan** tanda tangan elektronik tersertifikasi (PSrE Komdigi). Cukup untuk belajar, portofolio, dan internal. Untuk kekuatan hukum, integrasikan penyedia tersertifikasi.

---

## 10. Di Luar Cakupan Versi 1
Login & akun, penyimpanan file, multi-penandatangan, tanda tangan gambar/coretan, cap waktu dari pihak ketiga (TSA), PAdES penuh, aplikasi APK native.

---

## 11. Definisi Selesai (Definition of Done)
- Pengguna bisa unggah PDF, lalu mengunduh PDF ber-QR.
- Scan QR membuka halaman verifikasi yang benar.
- PDF asli → **ASLI**; PDF yang diubah satu karakter pun → **TIDAK ASLI**.
- Tampilan sesuai bagian 3, animasi berjalan, responsif di HP.
- Tidak ada rahasia di repo; build produksi sukses; terdeploy.
