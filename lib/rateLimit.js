/**
 * Limiteur de débit simple, en mémoire, sans dépendance externe.
 * Suffisant pour une seule instance de serveur (cas d'un petit salon).
 * Pour un déploiement multi-instances à fort trafic, remplacer par un
 * store partagé (Redis/Upstash).
 */

const buckets = new Map();

export function rateLimit(key, { max = 8, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    allowed: bucket.count <= max,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
