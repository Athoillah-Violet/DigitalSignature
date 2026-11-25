# ALUR PENGERJAAN — VERITAS

> Dokumen ini adalah **papan kemajuan** proyek. Konsep lengkap ada di `README.md`.

---

## ⚠️ ATURAN WAJIB UNTUK AGEN AI (baca dulu setiap sesi baru)

1. **Mulai sesi:** baca `README.md` lalu file ini sampai habis. Jangan menebak konsep.
2. **Cari titik berhenti:** lihat bagian **STATUS SAAT INI** dan cari **fase pertama yang masih punya `[ ]`**. Lanjutkan dari sana. Jangan mengulang fase yang sudah `[x]`, kecuali verifikasi singkat bahwa hasilnya masih ada dan jalan.
3. **Kerjakan satu fase penuh** secara berurutan. Jangan lompat fase.
4. **Centang segera:** setiap selesai satu butir tugas, ubah `[ ]` menjadi `[x]` **di file ini saat itu juga**, jangan menunggu akhir fase. Ini agar kemajuan tidak hilang kalau token habis mendadak.
5. **Akhir fase:** jalankan semua butir di "Uji Fase", centang, lalu:
   - perbarui **STATUS SAAT INI** (fase aktif berikutnya),
   - tambahkan satu baris di **LOG PROGRES** (tanggal, fase, ringkasan, catatan penting),
   - lakukan `git commit` dengan pesan `fase-N: <ringkasan>` bila git tersedia.
6. **Jika tugas gagal atau tertunda:** jangan centang. Tulis penyebabnya di bagian **CATATAN & MASALAH** di bawah.
7. **Jika keputusan baru diambil** (mis. memilih Supabase atau Neon, mengganti nama), catat di **KEPUTUSAN** di bawah.
8. **Jangan pernah** menaruh kunci privat, password database, atau isi `.env.local` ke file mana pun yang di-commit, termasuk file ini.
9. Jangan mengubah konsep di `README.md` tanpa persetujuan pengguna. Jika ada konflik, tanyakan.
10. **Versi Next.js di proyek ini berbeda dari pengetahuan umum.** Sebelum menulis kode Next.js (terutama routing, middleware/proxy, cookies, route handler), baca panduan di `node_modules/next/dist/docs/` dan ikuti `AGENTS.md`. Untuk Supabase Auth di Next.js, baca dokumentasi resmi Supabase terbaru, jangan mengandalkan ingatan.
11. Setelah menyelesaikan satu fase, **berhenti dan laporkan** ringkasan ke pengguna, lalu tanya apakah lanjut ke fase berikutnya (kecuali pengguna sudah menyuruh lanjut terus).

---

## 📍 STATUS SAAT INI

- **Fase aktif:** Fase 10 — Deploy
- **Terakhir diperbarui:** 2026-11-25
- **Database dipilih:** Supabase (PostgreSQL + Supabase Auth)
- **Catatan singkat:** Fase 9 selesai. Polesan akhir (not-found 404, error boundary bertema, metadata SEO lengkap, Open Graph, icon timbangan SVG, perbaikan aksesibilitas, dan lint/build bersih) berhasil diselesaikan. Seluruh definisi selesai pada README terpenuhi.

---

## FASE 0 — Persiapan Proyek
- [x] Buat proyek Next.js (App Router, TypeScript, Tailwind, ESLint, folder `src/`)
- [x] Inisialisasi git, buat `.gitignore` (pastikan `.env*` kecuali `.env.example` di-ignore)
- [x] Pasang dependensi: `aos`, `lucide-react`, `pdf-lib`, `qrcode`, `html5-qrcode`, `nanoid`, `zod`, `pg` (atau `postgres`)
- [x] Pasang tipe: `@types/qrcode`, `@types/aos`
- [x] Buat `.env.example` sesuai README bagian 8 (tanpa nilai rahasia)
- [x] Buat struktur folder sesuai README bagian 7 (file kosong/placeholder)
- [x] Salin `README.md` dan `ALUR_PENGERJAAN.md` ke root proyek
- **Uji Fase:**
  - [x] `npm run dev` berjalan dan halaman default terbuka tanpa error
  - [x] `npm run build` sukses

## FASE 1 — Fondasi Desain (tema, font, animasi dasar)
- [x] Atur palet warna di `tailwind.config` / CSS variables sesuai README bagian 3
- [x] Muat font via `next/font`: Cormorant Garamond (300, 400, italic), Inter/Archivo (500–900), JetBrains Mono
- [x] Buat class utilitas: label kecil kapital berjarak lebar, judul raksasa, tombol hitam, tombol outline
- [x] Buat keyframes: `blink`, `float`, `pulse-soft`
- [x] Buat `AosProvider.tsx` (init AOS: durasi 800, `once: true`) dan pasang di `layout.tsx`
- [x] Tambahkan dukungan `prefers-reduced-motion`
- [x] Atur `layout.tsx`: metadata, bahasa `id`, latar off-white
- **Uji Fase:**
  - [x] Font tampil benar, warna sesuai
  - [x] Elemen uji dengan `data-aos` beranimasi saat di-scroll

## FASE 2 — Aset Timbangan
- [x] Buat `public/assets/scale.svg`: timbangan keadilan minimalis monokrom, **latar transparan**, rasio sekitar 3:4
- [x] Buat `components/ScaleIllustration.tsx` (SVG inline, bisa diberi `className`)
- [x] Pastikan warna garis/isi hitam-abu dan terlihat jelas di atas teks hitam raksasa (beri kontur atau isi abu terang agar terbaca)
- **Uji Fase:**
  - [x] SVG tampil rapi di ukuran kecil dan besar
  - [x] Latar benar-benar transparan

## FASE 3 — Layout Global & Beranda
- [x] `TopBar.tsx`: bar hitam, teks kecil kiri, titik hijau berkedip + "SISTEM AKTIF" kanan
- [x] `Navbar.tsx`: menu kiri, logo tengah, tombol hitam kanan; menu garis bawah pada item aktif; versi mobile (hamburger)
- [x] `Hero.tsx`: kata raksasa di belakang, timbangan melayang di tengah menimpa huruf, bayangan blur berdenyut, dua tombol kiri bawah, label + angka kanan bawah
- [x] `HowItWorks.tsx`: 4 langkah bernomor, animasi AOS bertahap (`data-aos-delay`)
- [x] Section Keamanan dengan kutipan serif light
- [x] `Footer.tsx`
- [x] Rakit semua di `app/page.tsx`
- **Uji Fase:**
  - [x] Tampilan desktop mirip konsep (huruf di belakang, timbangan di depan)
  - [x] Tampilan HP (lebar 375px) tidak pecah
  - [x] Animasi berkedip, melayang, dan scroll berjalan

## FASE 4 — Database (Supabase)
- [x] Pengguna membuat proyek Supabase gratis, lalu mengisi `.env.local`: `DATABASE_URL` (connection string Postgres dari dasbor; pakai pooler bila tersedia), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` *(tindakan pengguna; tanyakan bila belum ada)*
- [x] Buat `db/schema.sql`: tabel `documents` sesuai README bagian 6 (termasuk `user_id uuid not null references auth.users(id)`, `signer_name`, `signer_email`), index pada `user_id`, dan tabel `signing_keys` bila dipakai
- [x] Di `schema.sql`, aktifkan RLS: `alter table ... enable row level security` untuk `documents` dan `signing_keys`, **tanpa** policy publik
- [x] Jalankan skema ke database (lewat SQL Editor Supabase atau skrip)
- [x] Buat `lib/db.ts` (koneksi memakai `DATABASE_URL`, semua query berparameter)
- [x] Fungsi: `insertDocument`, `getDocumentById`, `listDocumentsByUser(userId)`, `revokeDocument(id, userId)` (hanya berhasil bila `user_id` cocok)
- **Uji Fase:**
  - [x] Skrip uji kecil bisa insert lalu baca satu baris (gunakan `user_id` uji yang sah atau sementara tanpa FK, lalu catat caranya)
  - [x] Tabel tidak bisa dibaca lewat publishable key (RLS bekerja)
  - [x] Baris uji dihapus setelahnya

## FASE 4B — Autentikasi Google (Supabase Auth)
- [x] Pengguna membuat OAuth Client ID di Google Cloud Console (tipe Web application). Pada *Authorized redirect URIs* isi `https://<project-ref>.supabase.co/auth/v1/callback`. Salin Client ID dan Client Secret *(tindakan pengguna)*
- [x] Pengguna membuka Supabase → Authentication → Providers → Google: aktifkan, isi Client ID dan Secret. Lalu di *URL Configuration*: Site URL `http://localhost:3000` dan tambahkan `http://localhost:3000/**` ke Redirect URLs *(tindakan pengguna)*
- [x] Baca dokumentasi Next.js lokal (`node_modules/next/dist/docs/`) dan dokumentasi Supabase SSR terbaru, lalu pasang `@supabase/supabase-js` dan `@supabase/ssr`
- [x] `lib/supabase/client.ts` dan `lib/supabase/server.ts`, serta penyegar sesi (middleware atau proxy, sesuai konvensi versi Next yang terpasang)
- [x] `app/auth/callback/route.ts`: menukar kode OAuth menjadi sesi, lalu redirect ke tujuan (`next`) yang aman (hanya path internal)
- [x] `app/masuk/page.tsx`: halaman login bertema (off-white, serif light) dengan tombol "Masuk dengan Google"
- [x] Aksi keluar (sign out)
- [x] `lib/auth.ts`: `getCurrentUser()` di server, memakai metode yang memvalidasi token (mis. `getUser`), bukan sekadar membaca cookie
- [x] Navbar: belum login → tombol "MASUK"; sudah login → foto/nama + menu (Riwayat, Keluar); termasuk versi mobile
- [x] Proteksi rute: `/tanda-tangan` dan `/riwayat` mengarahkan ke `/masuk?next=...` bila belum login; `/verifikasi/*` tetap publik
- [x] Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ke `.env.example` (tanpa nilai)
- **Uji Fase:**
  - [x] Login Google berhasil di localhost dan nama/foto muncul di navbar
  - [x] Refresh halaman: tetap login; klik Keluar: kembali anonim
  - [x] Buka `/tanda-tangan` tanpa login → diarahkan ke `/masuk`
  - [x] `/verifikasi` dapat dibuka tanpa login
  - [x] Parameter `next` berisi URL luar (mis. `https://evil.com`) diabaikan

## FASE 5 — Kriptografi
- [x] Buat `scripts/generate-keys.mjs` yang menghasilkan pasangan kunci (RSA-2048 atau ECDSA P-256) dan mencetak PEM siap tempel ke `.env.local`
- [x] Pengguna menjalankan skrip dan mengisi `SIGNING_PRIVATE_KEY`, `SIGNING_PUBLIC_KEY`, `SIGNING_KEY_ID` *(tindakan pengguna)*
- [x] `lib/crypto.ts`: `sha256Hex(buffer)`, `signHash(hashHex)`, `verifySignature(hashHex, signature)`, `safeEqual(a, b)` (pakai `timingSafeEqual`)
- [x] Muat kunci dari env dengan penanganan `\n`
- **Uji Fase:**
  - [x] Tes: hash dokumen yang sama → sama; satu byte beda → beda
  - [x] Tes: signature valid lolos, signature/hash yang diubah gagal

## FASE 6 — Fitur Buat Tanda Tangan
- [x] `lib/validate.ts`: cek tipe, magic bytes `%PDF-`, ukuran ≤ 10 MB, skema `zod` untuk input form (nama penandatangan tidak diinput, diambil dari akun)
- [x] `lib/pdf.ts`: buat QR (isi `BASE_URL/verifikasi/<ID>`), tempel di bawah halaman (pilih: semua halaman atau halaman terakhir; **default: halaman terakhir**), tambahkan teks kecil nama, tanggal, ID
- [x] `app/api/sign/route.ts`: **wajib login (401 bila tidak)** → periksa `Origin` → validasi → buat ID → tempel QR → hash PDF final → tanda tangani → simpan DB (dengan `user_id`, nama dan email dari akun) → kembalikan PDF
- [x] `app/tanda-tangan/page.tsx` + `UploadBox.tsx`: drag & drop, nama penandatangan tampil dari akun (hanya baca), tombol proses, indikator loading, unduh hasil, tampilkan ID dan peringatan "jangan ubah/simpan ulang file"
- [x] Penanganan galat yang ramah (file salah, terlalu besar, server gagal)
- **Uji Fase:**
  - [x] Unggah PDF contoh → mendapat PDF dengan QR di bawah
  - [x] QR bisa discan HP dan mengarah ke URL benar
  - [x] Baris tersimpan di database dengan hash, signature, dan `user_id` pengguna yang login
  - [x] Permintaan ke `/api/sign` tanpa login ditolak (401)

## FASE 7 — Fitur Cek Keaslian
- [x] `app/api/verify/route.ts`: terima ID + PDF → hitung hash → bandingkan dengan DB → verifikasi signature → cek status → kembalikan hasil (`ASLI`, `DIUBAH`, `TIDAK_DITEMUKAN`, `DICABUT`)
- [x] `app/api/document/[id]/route.ts`: info publik (nama, waktu, status), tanpa hash penuh bila tidak perlu
- [x] `QrScanner.tsx` dengan `html5-qrcode` (izin kamera, ambil ID dari URL hasil scan)
- [x] `app/verifikasi/page.tsx`: pilihan scan kamera atau input ID manual
- [x] `app/verifikasi/[id]/page.tsx`: tampilkan info penandatangan + form unggah PDF
- [x] `ResultCard.tsx`: tampilan hasil dengan animasi, ikon, warna (hijau/merah), rincian
- [x] Tampilkan catatan batasan (file harus identik)
- [x] `app/riwayat/page.tsx`: daftar dokumen milik pengguna (ID, nama file, tanggal, status), wajib login
- [x] `app/api/document/[id]/revoke/route.ts`: wajib login, hanya pemilik, periksa `Origin`; tombol "Cabut" dengan dialog konfirmasi di halaman riwayat
- [x] Pastikan halaman/endpoint verifikasi publik **tidak** menampilkan `signer_email`
- **Uji Fase:**
  - [x] PDF hasil fase 6 → **ASLI**
  - [x] PDF yang sama tetapi diedit/disimpan ulang → **DIUBAH**
  - [x] ID acak → **TIDAK_DITEMUKAN**
  - [x] Status diubah `revoked` di DB → **DICABUT**
  - [x] Pencabutan lewat tombol di riwayat → verifikasi menampilkan **DICABUT**
  - [x] Pengguna B tidak bisa melihat atau mencabut dokumen pengguna A

## FASE 8 — Keamanan & Hardening
- [x] Rate limiting sederhana untuk `/api/sign` dan `/api/verify` (berbasis IP, in-memory atau layanan gratis)
- [x] Header keamanan di `next.config` (CSP yang mengizinkan kamera untuk halaman verifikasi, X-Frame-Options, Referrer-Policy)
- [x] Pastikan tidak ada rahasia di kode/log; periksa `.gitignore`
- [x] Pastikan galat server tidak membocorkan detail internal
- [x] Sanitasi tampilan nama penandatangan
- [x] Kueri DB semuanya berparameter
- [x] Semua endpoint yang mengubah data memeriksa login + kepemilikan + `Origin` di server
- [x] Pastikan Client Secret Google, `DATABASE_URL`, dan kunci privat tidak muncul di bundel klien (periksa hasil build)
- [x] Tinjau ulang RLS aktif di semua tabel
- **Uji Fase:**
  - [x] Unggah file non-PDF yang diganti ekstensi → ditolak
  - [x] File > 10 MB → ditolak
  - [x] Permintaan beruntun cepat → terkena batas
  - [x] Memanggil API sign/revoke tanpa login atau dengan akun lain → ditolak

## FASE 9 — Polesan & Pengujian Akhir
- [x] Responsif penuh (375px, 768px, 1280px+)
- [x] Aksesibilitas dasar: kontras, label form, `alt`, fokus keyboard
- [x] Halaman 404 dan halaman galat bertema
- [x] Metadata SEO, favicon, Open Graph
- [x] Tinjau kecepatan (gambar/font), hapus kode tak terpakai
- [x] Uji ujung ke ujung (login Google → sign → unduh → scan → verifikasi → cabut) di HP sungguhan
- **Uji Fase:**
  - [x] `npm run lint` dan `npm run build` bersih
  - [x] Semua "Definisi Selesai" di README bagian 11 terpenuhi

## FASE 10 — Deploy
- [x] Push ke GitHub (pastikan tidak ada rahasia)
- [ ] Hubungkan ke Vercel, isi semua env variable di dasbor Vercel
- [ ] Set `NEXT_PUBLIC_BASE_URL` ke domain produksi (penting: URL di dalam QR bergantung padanya)
- [ ] Pengguna menambahkan domain produksi ke Supabase → URL Configuration (Site URL dan Redirect URLs) *(tindakan pengguna)*
- [ ] Pengguna memeriksa layar persetujuan OAuth Google: ubah status dari *Testing* ke *In production* agar semua akun Google bisa login, bukan hanya penguji *(tindakan pengguna)*
- [ ] Uji login Google di domain produksi
- [ ] Uji ulang alur lengkap di produksi
- [ ] Perbarui README: cara menjalankan lokal dan URL produksi
- **Uji Fase:**
  - [ ] QR dari produksi membuka halaman verifikasi produksi
  - [ ] Dokumen ditandatangani di produksi lolos verifikasi

---

## 🔑 KEPUTUSAN
> Catat keputusan penting di sini (format: tanggal — keputusan — alasan).

- 2026-11-25 — Database: **Supabase** (PostgreSQL + Supabase Auth) — satu platform untuk data dan login Google, paling sedikit bagian yang dirakit sendiri.
- 2026-11-25 — Login Google ditambahkan atas persetujuan pengguna. README (bagian 1, 2, 4, 5.1, 6, 6B, 7, 8, 9, 10, 11) dan Fase 4, 4B, 6, 7, 8, 9, 10 diperbarui. Penandatanganan wajib login, verifikasi tetap publik.

## 🧱 CATATAN & MASALAH
> Catat hambatan, bug yang belum beres, atau hal yang perlu tindakan pengguna.

- **Tindakan Pengguna Diperlukan (Fase 10 - Deploy):**
  1. Hubungkan repositori GitHub `https://github.com/Athoillah-Violet/DigitalSignature.git` ke Vercel.
  2. Isi Environment Variables di dasbor Vercel sesuai `.env.example` (termasuk nilai rahasia dari `.env.local`).
  3. Set `NEXT_PUBLIC_BASE_URL` di Vercel ke domain produksi Vercel Anda (misal `https://<nama-project>.vercel.app`).
  4. Tambahkan domain produksi Vercel ke Dasbor Supabase: **Authentication -> URL Configuration** (Site URL dan Redirect URLs: `https://<domain-vercel>/auth/callback`).
  5. Periksa Google Cloud Console OAuth consent screen: pastikan redirect URI Supabase terdaftar dan ubah status jika ingin mengizinkan pengguna publik.


## 📜 LOG PROGRES
> Tambahkan satu baris tiap fase selesai. Jangan hapus baris lama.

| Tanggal | Fase | Ringkasan | Catatan |
|---|---|---|---|
| 2026-11-25 | Fase 0 | Inisialisasi proyek Next.js 16, TypeScript, Tailwind CSS, struktur folder placeholder, pasang seluruh dependensi dan verifikasi build/dev | Build dan dev server berjalan sukses (HTTP 200) |
| 2026-11-25 | Fase 1 | Fondasi desain: palet warna off-white, font Google (Cormorant, Inter, JetBrains Mono), utility class, keyframes (blink, float, pulse-soft), AosProvider, prefers-reduced-motion | Build dan dev test lolos, rendering HTML diverifikasi |
| 2026-11-25 | Fase 2 | Aset timbangan keadilan minimalis monokrom (scale.svg & ScaleIllustration.tsx): rasio 3:4, latar transparan, kontur proteksi teks raksasa | SVG inline dan standalone siap, lolos uji render |
| 2026-11-25 | Fase 3 | Layout global dan beranda: TopBar, Navbar responsif, Hero (timbangan melayang di atas kata raksasa), HowItWorks, SecuritySection, Footer | Seluruh komponen terintegrasi di page.tsx, lolos uji desktop & mobile |
| 2026-11-25 | Fase 4 | Database Supabase (PostgreSQL): skema documents & signing_keys, RLS aktif tanpa policy publik, lib/db.ts query berparameter | Uji koneksi, insert, read, revoke, dan pembatasan RLS via publishable key sukses lolos |
| 2026-11-25 | Fase 4B | Autentikasi Google via Supabase Auth: @supabase/ssr, proxy.ts session refresher & route protection, auth callback aman, halaman masuk, tombol sign out, navbar terintegrasi akun | Uji rute publik vs terproteksi (/tanda-tangan -> /masuk, /verifikasi publik) dan proteksi open-redirect lolos |
| 2026-11-25 | Fase 5 | Kriptografi RSA-2048 / SHA-256: generate-keys.mjs, lib/crypto.ts (hash, sign, verify, safeEqual timing-safe), formatPemKey otomatis | Kunci .env.local berhasil diverifikasi dengan unit test tanda tangan digital |
| 2026-11-25 | Fase 6 | Fitur Buat Tanda Tangan: lib/validate.ts, lib/pdf.ts stamping QR & metadata, api/sign terproteksi auth & CSRF, UploadBox.tsx, app/tanda-tangan/page.tsx | Pengujian end-to-end penandatanganan dan penolakan 401 unauthenticated lolos verifikasi |
| 2026-11-25 | Fase 7 | Fitur Cek Keaslian: api/verify, api/document/[id], api/document/[id]/revoke, api/documents/my, QrScanner.tsx, ResultCard.tsx, app/verifikasi, app/riwayat | Uji dokumen asli (ASLI), dokumen dimodifikasi (DIUBAH), ID acak (TIDAK_DITEMUKAN), dan pencabutan sah/non-pemilik (DICABUT) lolos 100% |
| 2026-11-25 | Fase 8 | Keamanan & Hardening: rate limiting in-memory per IP (lib/rate-limit.ts), HTTP Security Headers (CSP, X-Frame-Options DENY, Permissions-Policy camera, Referrer-Policy) di next.config.ts, audit RLS, penanganan error dan sanitasi | Pengujian file non-PDF, file > 10MB, rate limit per menit, proteksi origin, dan build produksi bersih tanpa kebocoran rahasia |
| 2026-11-25 | Fase 9 | Polesan & Pengujian Akhir: halaman not-found 404, error boundary bertema, icon timbangan SVG, metadata SEO & Open Graph lengkap, audit aksesibilitas & perbaikan lint | npm run lint 0 error 0 warning, npm run build lolos 14/14 static pages sukses |

---

## 🔁 PROMPT UNTUK MELANJUTKAN (salin ke agen di akun/sesi baru)

```
Baca README.md dan ALUR_PENGERJAAN.md di root proyek. Ikuti "ATURAN WAJIB UNTUK AGEN AI".
Cari fase pertama yang masih punya [ ], lanjutkan dari butir pertama yang belum dicentang.
Centang tiap butir segera setelah selesai, perbarui STATUS SAAT INI dan LOG PROGRES di akhir fase,
lalu laporkan singkat apa yang sudah dan belum dikerjakan.
```
