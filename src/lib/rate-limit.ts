const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  max: number;
  windowMs: number;
}

const DEFAULTS: Record<string, RateLimitOptions> = {
  perUser: { max: 3, windowMs: 15 * 60 * 1000 }, // 3 por 15 min
  global: { max: 100, windowMs: 24 * 60 * 60 * 1000 }, // 100 por dia
};

export function checkRateLimit(
  key: string,
  preset: keyof typeof DEFAULTS = "perUser",
): boolean {
  const { max, windowMs } = DEFAULTS[preset];
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count++;
  return true;
}
