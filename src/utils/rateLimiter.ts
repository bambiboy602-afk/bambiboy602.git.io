import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
}

const clientRecords = new Map<string, RateLimitRecord>();

// Periodic garbage collection for expired entries (runs every 60s)
let gcInterval: NodeJS.Timeout | null = null;

function ensureGc(windowMs: number) {
  if (gcInterval) return;
  gcInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of clientRecords.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        clientRecords.delete(key);
      }
    }
  }, Math.max(30000, windowMs));
  if (gcInterval.unref) {
    gcInterval.unref();
  }
}

/**
 * Checks in-memory sliding window rate limit for a client key.
 *
 * NOTE ON MULTI-INSTANCE DEPLOYMENTS:
 * This rate limiter maintains state in memory within the local process.
 * In a multi-instance container deployment (e.g. Cloud Run with minScale > 1 or multiple replicas),
 * each instance maintains its own rate limit budget. For globally synchronized multi-instance rate
 * limiting, an external coordinated store (e.g. Redis) or an edge reverse proxy (e.g. Cloud Armor)
 * is recommended.
 */
export function checkRateLimit(
  clientKey: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  total: number;
} {
  ensureGc(windowMs);
  const now = Date.now();
  let record = clientRecords.get(clientKey);

  if (!record) {
    record = { timestamps: [] };
    clientRecords.set(clientKey, record);
  }

  // Purge timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  const total = record.timestamps.length;
  const oldestTimestamp = record.timestamps[0] || now;
  const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

  if (total >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      total,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, maxRequests - record.timestamps.length);

  return {
    allowed: true,
    remaining,
    resetSeconds,
    total: record.timestamps.length,
  };
}

/**
 * Express middleware for endpoint-level rate limiting.
 */
export function createRateLimiterMiddleware(options: RateLimiterOptions) {
  const { windowMs, maxRequests } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined) ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const result = checkRateLimit(clientIp, maxRequests, windowMs);

    res.setHeader('RateLimit-Limit', maxRequests);
    res.setHeader('RateLimit-Remaining', result.remaining);
    res.setHeader('RateLimit-Reset', result.resetSeconds);

    if (!result.allowed) {
      res.setHeader('Retry-After', result.resetSeconds);
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment before sending another message.',
        retryAfter: result.resetSeconds,
      });
    }

    next();
  };
}

/**
 * Resets the rate limiter store (used for test isolation).
 */
export function resetRateLimiterStore(): void {
  clientRecords.clear();
}
