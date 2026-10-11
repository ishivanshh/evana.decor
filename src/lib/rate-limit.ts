type Entry = { count: number; resetAt: number };
const requests = new Map<string, Entry>();

export function rateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  for (const [entryKey, entry] of requests) if (entry.resetAt <= now) requests.delete(entryKey);
  const entry = requests.get(key);
  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { allowed: false, remaining: 0 };
  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

export function requestIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
