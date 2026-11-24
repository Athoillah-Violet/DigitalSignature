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
10. Setelah menyelesaikan satu fase, **berhenti dan laporkan** ringkasan ke pengguna, lalu tanya apakah lanjut ke fase berikutnya (kecuali pengguna sudah menyuruh lanjut terus).

---

## 📍 STATUS SAAT INI

- **Fase aktif:** Fase 1 — Fondasi Desain
- **Terakhir diperbarui:** 2026-11-25
- **Database dipilih:** (belum dipilih: Supabase / Neon)
- **Catatan singkat:** Fase 0 selesai, proyek Next.js berhasil diinisialisasi dan diuji.

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
- [ ] Atur palet warna di `tailwind.config` / CSS variables sesuai README bagian 3
- [ ] Muat font via `next/font`: Cormorant Garamond (300, 400, italic), Inter/Archivo (500–900), JetBrains Mono
- [ ] Buat class utilitas: label kecil kapital berjarak lebar, judul raksasa, tombol hitam, tombol outline
- [ ] Buat keyframes: `blink`, `float`, `pulse-soft`
- [ ] Buat `AosProvider.tsx` (init AOS: durasi 800, `once: true`) dan pasang di `layout.tsx`
- [ ] Tambahkan dukungan `prefers-reduced-motion`
- [ ] Atur `layout.tsx`: metadata, bahasa `id`, latar off-white
- **Uji Fase:**
  - [ ] Font tampil benar, warna sesuai
  - [ ] Elemen uji dengan `data-aos` beranimasi saat di-scroll

## FASE 2 — Aset Timbangan
- [ ] Buat `public/assets/scale.svg`: timbangan keadilan minimalis monokrom, **latar transparan**, rasio sekitar 3:4
- [ ] Buat `components/ScaleIllustration.tsx` (SVG inline, bisa diberi `className`)
- [ ] Pastikan warna garis/isi hitam-abu dan terlihat jelas di atas teks hitam raksasa (beri kontur atau isi abu terang agar terbaca)
- **Uji Fase:**
  - [ ] SVG tampil rapi di ukuran kecil dan besar
  - [ ] Latar benar-benar transparan

## FASE 3 — Layout Global & Beranda
- [ ] `TopBar.tsx`: bar hitam, teks kecil kiri, titik hijau berkedip + "SISTEM AKTIF" kanan
- [ ] `Navbar.tsx`: menu kiri, logo tengah, tombol hitam kanan; menu garis bawah pada item aktif; versi mobile (hamburger)
- [ ] `Hero.tsx`: kata raksasa di belakang, timbangan melayang di tengah menimpa huruf, bayangan blur berdenyut, dua tombol kiri bawah, label + angka kanan bawah
- [ ] `HowItWorks.tsx`: 4 langkah bernomor, animasi AOS bertahap (`data-aos-delay`)
- [ ] Section Keamanan dengan kutipan serif light
- [ ] `Footer.tsx`
- [ ] Rakit semua di `app/page.tsx`
- **Uji Fase:**
  - [ ] Tampilan desktop mirip konsep (huruf di belakang, timbangan di depan)
  - [ ] Tampilan HP (lebar 375px) tidak pecah
  - [ ] Animasi berkedip, melayang, dan scroll berjalan

## FASE 4 — Database
- [ ] Pengguna menyiapkan database gratis (Supabase atau Neon) dan mengisi `DATABASE_URL` di `.env.local` *(butuh tindakan pengguna; tanyakan bila belum ada)*
- [ ] Buat file `db/schema.sql` berisi tabel `documents` (dan `signing_keys` bila dipakai) sesuai README bagian 6
- [ ] Jalankan skema ke database
- [ ] Buat `lib/db.ts` (koneksi, dengan query berparameter)
- [ ] Fungsi: `insertDocument`, `getDocumentById`, `revokeDocument`
- **Uji Fase:**
  - [ ] Skrip uji kecil bisa insert lalu baca satu baris
  - [ ] Baris uji dihapus setelahnya

## FASE 5 — Kriptografi
- [ ] Buat `scripts/generate-keys.mjs` yang menghasilkan pasangan kunci (RSA-2048 atau ECDSA P-256) dan mencetak PEM siap tempel ke `.env.local`
- [ ] Pengguna menjalankan skrip dan mengisi `SIGNING_PRIVATE_KEY`, `SIGNING_PUBLIC_KEY`, `SIGNING_KEY_ID` *(tindakan pengguna)*
- [ ] `lib/crypto.ts`: `sha256Hex(buffer)`, `signHash(hashHex)`, `verifySignature(hashHex, signature)`, `safeEqual(a, b)` (pakai `timingSafeEqual`)
- [ ] Muat kunci dari env dengan penanganan `\n`
- **Uji Fase:**
  - [ ] Tes: hash dokumen yang sama → sama; satu byte beda → beda
  - [ ] Tes: signature valid lolos, signature/hash yang diubah gagal

## FASE 6 — Fitur Buat Tanda Tangan
- [ ] `lib/validate.ts`: cek tipe, magic bytes `%PDF-`, ukuran ≤ 10 MB, skema `zod` untuk nama
- [ ] `lib/pdf.ts`: buat QR (isi `BASE_URL/verifikasi/<ID>`), tempel di bawah halaman (pilih: semua halaman atau halaman terakhir; **default: halaman terakhir**), tambahkan teks kecil nama, tanggal, ID
- [ ] `app/api/sign/route.ts`: validasi → buat ID → tempel QR → hash PDF final → tanda tangani → simpan DB → kembalikan PDF
- [ ] `app/tanda-tangan/page.tsx` + `UploadBox.tsx`: drag & drop, input nama, tombol proses, indikator loading, unduh hasil, tampilkan ID dan peringatan "jangan ubah/simpan ulang file"
- [ ] Penanganan galat yang ramah (file salah, terlalu besar, server gagal)
- **Uji Fase:**
  - [ ] Unggah PDF contoh → mendapat PDF dengan QR di bawah
  - [ ] QR bisa discan HP dan mengarah ke URL benar
  - [ ] Baris tersimpan di database dengan hash dan signature

## FASE 7 — Fitur Cek Keaslian
- [ ] `app/api/verify/route.ts`: terima ID + PDF → hitung hash → bandingkan dengan DB → verifikasi signature → cek status → kembalikan hasil (`ASLI`, `DIUBAH`, `TIDAK_DITEMUKAN`, `DICABUT`)
- [ ] `app/api/document/[id]/route.ts`: info publik (nama, waktu, status), tanpa hash penuh bila tidak perlu
- [ ] `QrScanner.tsx` dengan `html5-qrcode` (izin kamera, ambil ID dari URL hasil scan)
- [ ] `app/verifikasi/page.tsx`: pilihan scan kamera atau input ID manual
- [ ] `app/verifikasi/[id]/page.tsx`: tampilkan info penandatangan + form unggah PDF
- [ ] `ResultCard.tsx`: tampilan hasil dengan animasi, ikon, warna (hijau/merah), rincian
- [ ] Tampilkan catatan batasan (file harus identik)
- **Uji Fase:**
  - [ ] PDF hasil fase 6 → **ASLI**
  - [ ] PDF yang sama tetapi diedit/disimpan ulang → **DIUBAH**
  - [ ] ID acak → **TIDAK_DITEMUKAN**
  - [ ] Status diubah `revoked` di DB → **DICABUT**

## FASE 8 — Keamanan & Hardening
- [ ] Rate limiting sederhana untuk `/api/sign` dan `/api/verify` (berbasis IP, in-memory atau layanan gratis)
- [ ] Header keamanan di `next.config` (CSP yang mengizinkan kamera untuk halaman verifikasi, X-Frame-Options, Referrer-Policy)
- [ ] Pastikan tidak ada rahasia di kode/log; periksa `.gitignore`
- [ ] Pastikan galat server tidak membocorkan detail internal
- [ ] Sanitasi tampilan nama penandatangan
- [ ] Kueri DB semuanya berparameter
- **Uji Fase:**
  - [ ] Unggah file non-PDF yang diganti ekstensi → ditolak
  - [ ] File > 10 MB → ditolak
  - [ ] Permintaan beruntun cepat → terkena batas

## FASE 9 — Polesan & Pengujian Akhir
- [ ] Responsif penuh (375px, 768px, 1280px+)
- [ ] Aksesibilitas dasar: kontras, label form, `alt`, fokus keyboard
- [ ] Halaman 404 dan halaman galat bertema
- [ ] Metadata SEO, favicon, Open Graph
- [ ] Tinjau kecepatan (gambar/font), hapus kode tak terpakai
- [ ] Uji ujung ke ujung (sign → unduh → scan → verifikasi) di HP sungguhan
- **Uji Fase:**
  - [ ] `npm run lint` dan `npm run build` bersih
  - [ ] Semua "Definisi Selesai" di README bagian 11 terpenuhi

## FASE 10 — Deploy
- [ ] Push ke GitHub (pastikan tidak ada rahasia)
- [ ] Hubungkan ke Vercel, isi semua env variable di dasbor Vercel
- [ ] Set `NEXT_PUBLIC_BASE_URL` ke domain produksi (penting: URL di dalam QR bergantung padanya)
- [ ] Uji ulang alur lengkap di produksi
- [ ] Perbarui README: cara menjalankan lokal dan URL produksi
- **Uji Fase:**
  - [ ] QR dari produksi membuka halaman verifikasi produksi
  - [ ] Dokumen ditandatangani di produksi lolos verifikasi

---

## 🔑 KEPUTUSAN
> Catat keputusan penting di sini (format: tanggal — keputusan — alasan).

- (kosong)

## 🧱 CATATAN & MASALAH
> Catat hambatan, bug yang belum beres, atau hal yang perlu tindakan pengguna.

- (kosong)

## 📜 LOG PROGRES
> Tambahkan satu baris tiap fase selesai. Jangan hapus baris lama.

| Tanggal | Fase | Ringkasan | Catatan |
|---|---|---|---|
| 2026-11-25 | Fase 0 | Inisialisasi proyek Next.js 16, TypeScript, Tailwind CSS, struktur folder placeholder, pasang seluruh dependensi dan verifikasi build/dev | Build dan dev server berjalan sukses (HTTP 200) |

---

## 🔁 PROMPT UNTUK MELANJUTKAN (salin ke agen di akun/sesi baru)

```
Baca README.md dan ALUR_PENGERJAAN.md di root proyek. Ikuti "ATURAN WAJIB UNTUK AGEN AI".
Cari fase pertama yang masih punya [ ], lanjutkan dari butir pertama yang belum dicentang.
Centang tiap butir segera setelah selesai, perbarui STATUS SAAT INI dan LOG PROGRES di akhir fase,
lalu laporkan singkat apa yang sudah dan belum dikerjakan.
```
