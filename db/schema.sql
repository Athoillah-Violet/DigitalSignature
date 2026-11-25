-- Skema Database VERITAS (Supabase / PostgreSQL)

-- 1. Tabel documents
create table if not exists public.documents (
  id text primary key,
  doc_hash text not null,
  signature text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  signer_name text not null,
  signer_email text not null,
  file_name text,
  key_id text not null,
  status text not null default 'valid' check (status in ('valid', 'revoked')),
  created_at timestamptz not null default now()
);

-- Index pada user_id untuk mempercepat kueri riwayat dokumen milik pengguna
create index if not exists idx_documents_user_id on public.documents(user_id);
create index if not exists idx_documents_status on public.documents(status);

-- 2. Tabel signing_keys (opsional, untuk rotasi kunci verifikasi publik)
create table if not exists public.signing_keys (
  key_id text primary key,
  public_key_pem text not null,
  created_at timestamptz not null default now()
);

-- 3. Row Level Security (RLS)
-- Aktifkan RLS pada kedua tabel TANPA policy publik
-- Hal ini memastikan tabel tidak dapat dibaca/ditulis langsung dari klien menggunakan publishable/anon key.
-- Semua operasi data dijalankan melalui backend server menggunakan DATABASE_URL.
alter table public.documents enable row level security;
alter table public.signing_keys enable row level security;
