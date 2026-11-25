# VERITAS — Web Tanda Tangan Digital

> Aplikasi web untuk **membuat** tanda tangan digital pada dokumen PDF dan **memeriksa keaslian** dokumen tersebut lewat QR code.
> File ini adalah sumber kebenaran untuk **konsep**. Untuk urutan pengerjaan lihat `ALUR_PENGERJAAN.md`.

---

## 1. Ringkasan

| Item | Isi |
|---|---|
| Nama kerja | VERITAS (boleh diganti, simpan di `lib/config.ts`) |
| Platform | Web responsif (nyaman di HP, bisa dibungkus APK/PWA belakangan) |
| Fitur utama | 1) Buat Tanda Tangan (wajib login), 2) Cek Keaslian (publik), 3) Login Google & Riwayat Dokumen |
| Format dokumen | PDF saja (maks 4 MB, disesuaikan dengan batas Serverless Vercel) |
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
| Database | PostgreSQL gratis: **Supabase** (sudah dipilih) |
| Autentikasi | **Supabase Auth** + Google OAuth, library `@supabase/supabase-js` dan `@supabase/ssr` |
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
2. **Navbar**: kiri = Beranda, Cara Kerja, Buat Tanda Tangan, Cek Keaslian. Tengah = logo "VERITAS". Kanan = tombol hitam persegi "CEK DOKUMEN ↗" dan tombol "MASUK" (setelah login berubah jadi foto/nama akun dengan menu Riwayat dan Keluar).
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
| `/masuk` | Halaman login, tombol "Masuk dengan Google" |
| `/auth/callback` | Menukar kode OAuth menjadi sesi login |
| `/riwayat` | Daftar dokumen milik pengguna + tombol cabut (wajib login) |
| `/api/document/[id]/revoke` | POST: mencabut dokumen milik sendiri (wajib login) |

---

## 5. Alur Kerja Sistem

### 5.1 Membuat tanda tangan
1. Pengguna **login dengan Google**, lalu mengunggah PDF. Nama penandatangan diambil otomatis dari akun, bukan diketik.
2. Server memvalidasi (tipe PDF asli, ukuran ≤ 10 MB).
3. Server membuat **ID unik pendek** (contoh `K7F9X2QA`).
4. Server membuat QR berisi `https://DOMAIN/verifikasi/<ID>` lalu **menempelkannya di bagian bawah halaman** PDF (bersama teks kecil: nama, tanggal, ID).
5. Server menghitung **SHA-256 dari PDF final** (yang sudah ada QR-nya).
6. Hash tersebut **ditandatangani dengan kunci privat** menjadi *signature*.
7. Database menyimpan: ID, `user_id`, hash, signature, nama, email, waktu, ID kunci, status.
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
| `user_id` | uuid, not null | Pemilik dokumen, referensi ke `auth.users(id)` (tabel pengguna bawaan Supabase) |
| `signer_name` | text, not null | Nama penandatangan, diambil dari akun Google |
| `signer_email` | text, not null | Email akun; **tidak** ditampilkan di halaman verifikasi publik |
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

Tabel pengguna tidak dibuat sendiri: Supabase Auth menyimpannya di `auth.users`. **Row Level Security (RLS) diaktifkan** pada `documents` dan `signing_keys` tanpa policy publik, sehingga tabel tidak bisa dibaca langsung lewat API klien memakai publishable key. Semua akses data lewat server.

---

## 6B. Autentikasi

- **Penyedia:** Google OAuth lewat Supabase Auth. Alur: tombol Masuk → Google → callback Supabase → `/auth/callback` → sesi tersimpan di cookie.
- **Akses publik (tanpa login):** `/`, `/verifikasi`, `/verifikasi/[id]`, `/api/verify`, `/api/document/[id]`. Penerima dokumen harus bisa mengecek tanpa akun.
- **Wajib login:** `/tanda-tangan`, `/riwayat`, `/api/sign`, aksi cabut dokumen.
- **Pengecekan login selalu di server** (validasi token pengguna), tidak cukup hanya menyembunyikan tombol di UI.
- **Kepemilikan:** pengguna hanya bisa melihat dan mencabut dokumen miliknya sendiri.
- **Privasi:** halaman verifikasi publik menampilkan nama penandatangan, tidak menampilkan email.
- Akses database dari server memakai `DATABASE_URL`; kunci `secret` (`sb_secret_...`) dan `service_role` Supabase tidak dipakai di versi 1.

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
│  │  ├─ masuk/page.tsx
│  │  ├─ riwayat/page.tsx
│  │  ├─ auth/callback/route.ts
│  │  └─ api/{sign,verify}/route.ts + document/[id]/revoke/route.ts
│  ├─ components/
│  │  ├─ TopBar.tsx  Navbar.tsx  Hero.tsx
│  │  ├─ ScaleIllustration.tsx
│  │  ├─ HowItWorks.tsx  Footer.tsx
│  │  ├─ UploadBox.tsx  QrScanner.tsx  ResultCard.tsx
│  │  └─ AosProvider.tsx
│  └─ lib/
│     ├─ supabase/{client,server}.ts   (+ penyegar sesi sesuai versi Next)
│     ├─ auth.ts        (getCurrentUser di server)
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
NEXT_PUBLIC_SUPABASE_URL=       # URL proyek Supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # publishable key (sb_publishable_...), aman di klien karena dilindungi RLS
```

Aturan: kunci privat hanya di env server, tidak pernah di kode, log, atau repo.

---

## 9. Keamanan & Batasan

- Hanya terima `application/pdf`, cek magic bytes `%PDF-`, batasi 4 MB (batas aman Vercel Serverless Function).
- Rate limiting sederhana pada `/api/sign` dan `/api/verify`.
- Validasi input dengan `zod`; escape nama penandatangan saat ditampilkan.
- Header keamanan dasar (CSP, X-Frame-Options, dll) di `next.config`.
- Perbandingan hash memakai `timingSafeEqual`.
- Penandatanganan wajib login Google, sehingga identitas penandatangan terikat ke akun. Ini **bukan** verifikasi identitas hukum (KTP/KYC): yang dibuktikan hanya bahwa pemilik akun Google tersebut yang menandatangani.
- Endpoint yang mengubah data (sign, revoke) memeriksa login dan kepemilikan di server, serta memeriksa header `Origin` untuk mencegah permintaan lintas situs.
- Jangan pernah mengekspos `DATABASE_URL`, kunci privat, atau Client Secret Google ke kode klien.
- Ini **bukan** tanda tangan elektronik tersertifikasi (PSrE Komdigi). Cukup untuk belajar, portofolio, dan internal. Untuk kekuatan hukum, integrasikan penyedia tersertifikasi.

---

## 10. Di Luar Cakupan Versi 1
Login selain Google (email/password, GitHub), peran admin, penyimpanan file, multi-penandatangan, tanda tangan gambar/coretan, cap waktu dari pihak ketiga (TSA), PAdES penuh, aplikasi APK native.

---

## 12. Cara Menjalankan & Deployment

### Menjalankan Secara Lokal
1. Salin berkas env:
   ```bash
   cp .env.example .env.local
   ```
2. Isi nilai kredensial di `.env.local` (Supabase URL, Key, Database URL, dan pasangan kunci RSA dari `node scripts/generate-keys.mjs`).
3. Jalankan aplikasi pengembangan:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

### Panduan Deployment (Vercel)
1. Push kode ke repositori GitHub:
   ```bash
   git push origin main
   ```
2. Hubungkan repositori di dasbor [Vercel](https://vercel.com) dengan Framework Preset **Next.js**.
3. Di pengaturan Vercel (Environment Variables), masukkan semua variabel lingkungan dari `.env.example`.
4. Di dasbor Supabase (**Authentication -> URL Configuration**):
   - Masukkan domain Vercel ke **Site URL** (misal `https://digitalsignature-alma6.vercel.app`).
   - Tambahkan `https://digitalsignature-alma6.vercel.app/auth/callback` ke **Redirect URLs**.
5. Repositori resmi: [https://github.com/Athoillah-Violet/DigitalSignature](https://github.com/Athoillah-Violet/DigitalSignature).

