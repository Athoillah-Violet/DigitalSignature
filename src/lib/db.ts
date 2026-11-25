import { Pool } from 'pg';

// Supabase direct connection or transaction pooler requires SSL in cloud environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : undefined,
});

export interface DocumentRecord {
  id: string;
  doc_hash: string;
  signature: string;
  user_id: string;
  signer_name: string;
  signer_email: string;
  file_name: string | null;
  key_id: string;
  status: 'valid' | 'revoked';
  created_at: Date;
}

export interface InsertDocumentParams {
  id: string;
  doc_hash: string;
  signature: string;
  user_id: string;
  signer_name: string;
  signer_email: string;
  file_name?: string | null;
  key_id: string;
}

/**
 * Menyimpan data dokumen baru ke tabel documents
 */
export async function insertDocument(doc: InsertDocumentParams): Promise<DocumentRecord> {
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

/**
 * Mengambil data dokumen berdasarkan ID publik
 */
export async function getDocumentById(id: string): Promise<DocumentRecord | null> {
  const query = `
    SELECT * FROM public.documents
    WHERE id = $1
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

/**
 * Mengambil daftar riwayat dokumen milik user tertentu
 */
export async function listDocumentsByUser(userId: string): Promise<DocumentRecord[]> {
  const query = `
    SELECT * FROM public.documents
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
}

/**
 * Mencabut keabsahan dokumen (status: revoked)
 * Hanya berhasil apabila ID dan user_id cocok
 */
export async function revokeDocument(id: string, userId: string): Promise<boolean> {
  const query = `
    UPDATE public.documents
    SET status = 'revoked'
    WHERE id = $1 AND user_id = $2
    RETURNING id;
  `;
  const { rowCount } = await pool.query(query, [id, userId]);
  return (rowCount ?? 0) > 0;
}

export default pool;
