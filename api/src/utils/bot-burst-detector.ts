export type BurstResult = {
  isBurst: boolean;
  count: number;
  threshold: number;
  windowMs: number;
  key: string;
};

type BurstEntry = {
  count: number;
  windowStart: number;
  lastSeen: number;
};

const BURST_WINDOW_MS = 30_000;
const BURST_THRESHOLD = 6;
const MAX_ENTRIES = 10_000;

const burstMap = new Map<string, BurstEntry>();

function buildBurstKey(
  ipAddress?: string | null,
  userAgent?: string | null,
): string | null {
  const ip = ipAddress?.trim();
  const ua = userAgent?.trim();
  if (!ip && !ua) return null;
  return `${ip ?? "noip"}|${ua ?? "noua"}`;
}

export function recordClickBurst(
  ipAddress?: string | null,
  userAgent?: string | null,
  now: number = Date.now(),
): BurstResult | null {
  const key = buildBurstKey(ipAddress, userAgent);
  if (!key) return null;

  const entry = burstMap.get(key);
  if (!entry || now - entry.windowStart > BURST_WINDOW_MS) {
    const fresh: BurstEntry = {
      count: 1,
      windowStart: now,
      lastSeen: now,
    };
    burstMap.delete(key);
    burstMap.set(key, fresh);
    return {
      isBurst: false,
      count: 1,
      threshold: BURST_THRESHOLD,
      windowMs: BURST_WINDOW_MS,
      key,
    };
  }

  entry.count += 1;
  entry.lastSeen = now;
  burstMap.delete(key);
  burstMap.set(key, entry);

  if (burstMap.size > MAX_ENTRIES) {
    const oldestKey = burstMap.keys().next().value as string | undefined;
    if (oldestKey) burstMap.delete(oldestKey);
  }

  return {
    isBurst: entry.count >= BURST_THRESHOLD,
    count: entry.count,
    threshold: BURST_THRESHOLD,
    windowMs: BURST_WINDOW_MS,
    key,
  };
}
