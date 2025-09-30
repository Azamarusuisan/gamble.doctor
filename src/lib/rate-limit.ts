type RateLimitConfig = {
  identifier: string;
  limit: number;
  windowMs: number;
};

type Counter = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, Counter>();

export function checkRateLimit({ identifier, limit, windowMs }: RateLimitConfig) {
  const now = Date.now();
  const existing = store.get(identifier);

  if (!existing || existing.expiresAt < now) {
    store.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetMs: existing.expiresAt - now };
  }

  existing.count += 1;
  store.set(identifier, existing);

  return { allowed: true, remaining: limit - existing.count, resetMs: existing.expiresAt - now };
}

export function resetRateLimit(identifier: string) {
  store.delete(identifier);
}
