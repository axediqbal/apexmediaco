/**
 * Minimal in-memory sliding-window rate limiter for API routes.
 *
 * Note: on serverless/edge runtimes each instance keeps its own counters,
 * so this is a best-effort abuse brake, not a distributed guarantee.
 * For strict global limits, use a shared store (Redis/Upstash).
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Max requests per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export function isRateLimited(key: string, { limit, windowMs }: RateLimitOptions): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  // Drop timestamps outside the window.
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    return true;
  }

  bucket.timestamps.push(now);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.timestamps.length === 0 || now - b.timestamps[b.timestamps.length - 1] > windowMs) {
        buckets.delete(k);
      }
    }
  }

  return false;
}

/** Best-effort client IP for rate-limit keying. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}
