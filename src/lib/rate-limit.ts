/**
 * In-memory sliding window rate limiter sederhana.
 * Menggunakan Map dan otomatis membersihkan entri usang untuk mencegah memory leak.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipStore = new Map<string, RateLimitRecord>();

// Bersihkan entri yang sudah expired setiap 5 menit
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
      // Buang timestamp yang lebih tua dari 15 menit
      const validTimestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (validTimestamps.length === 0) {
        ipStore.delete(ip);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Mendapatkan IP klien dari request headers
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export interface RateLimitOptions {
  windowMs: number; // Durasi jendela waktu dalam milidetik (misal 60.000 untuk 1 menit)
  maxRequests: number; // Maksimum request yang diizinkan dalam jendela waktu tersebut
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Timestamp kapan reset
}

/**
 * Memeriksa apakah IP klien telah melampaui batas permintaan.
 */
export function checkRateLimit(
  ip: string,
  keyPrefix: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = `${keyPrefix}:${ip}`;

  let record = ipStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    ipStore.set(key, record);
  }

  // Filter hanya timestamp dalam window
  const windowStart = now - options.windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.maxRequests) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + options.windowMs;
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetTime,
    };
  }

  // Catat permintaan saat ini
  record.timestamps.push(now);

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - record.timestamps.length,
    resetTime: now + options.windowMs,
  };
}
