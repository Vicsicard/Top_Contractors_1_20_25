import { NextRequest, NextResponse } from 'next/server';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const RATE_LIMIT_TOKENS = 60; // Maximum requests per minute
const REFILL_RATE = 1000; // Refill one token every 1 second
const BUCKET_SIZE = 60; // Maximum bucket size

const buckets = new Map<string, TokenBucket>();

export function getRateLimitHeaders(remaining: number): Headers {
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', RATE_LIMIT_TOKENS.toString());
  headers.set('X-RateLimit-Remaining', Math.max(0, remaining).toString());
  return headers;
}

export function rateLimiter(req: NextRequest) {
  const ip = req.ip || 'anonymous';
  const now = Date.now();

  // Get or create bucket for this IP
  let bucket = buckets.get(ip);
  if (!bucket) {
    bucket = { tokens: BUCKET_SIZE, lastRefill: now };
    buckets.set(ip, bucket);
  }

  // Refill tokens based on time elapsed
  const timeElapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(timeElapsed / REFILL_RATE);
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(BUCKET_SIZE, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  // Check if enough tokens are available
  if (bucket.tokens < 1) {
    const headers = getRateLimitHeaders(0);
    headers.set('Retry-After', '60');
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429, headers }
    );
  }

  // Consume a token
  bucket.tokens--;
  return null;
}
