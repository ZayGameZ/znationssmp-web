import type { DataSource } from "@/types";

type CacheHit<T> = { hit: true; data: T } | { hit: false };

type MemoryEntry = {
  value: string;
  expiresAt: number;
};

type RedisPipelineResponse = Array<{
  result?: unknown;
  error?: string;
}>;

const DEFAULT_MEMORY_TTL_MS = 1000 * 60 * 60 * 12;
const globalCache = globalThis as typeof globalThis & {
  __znationsLiveCache?: Map<string, MemoryEntry>;
};

function fallbackSource(): DataSource {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === "true" || process.env.ZN_ENABLE_DEMO_DATA === "true" ? "mock-seed" : "offline";
}

function memoryStore() {
  if (!globalCache.__znationsLiveCache) {
    globalCache.__znationsLiveCache = new Map<string, MemoryEntry>();
  }
  return globalCache.__znationsLiveCache;
}

function getMemory<T>(key: string): CacheHit<T> {
  const entry = memoryStore().get(key);
  if (!entry) return { hit: false };
  if (Date.now() > entry.expiresAt) {
    memoryStore().delete(key);
    return { hit: false };
  }

  try {
    return { hit: true, data: JSON.parse(entry.value) as T };
  } catch {
    memoryStore().delete(key);
    return { hit: false };
  }
}

function putMemory<T>(key: string, data: T, expirationTtl?: number) {
  memoryStore().set(key, {
    value: JSON.stringify(data),
    expiresAt: Date.now() + (expirationTtl ? expirationTtl * 1000 : DEFAULT_MEMORY_TTL_MS)
  });
}

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  return {
    url: url.replace(/\/$/, ""),
    token
  };
}

async function redisCommand(command: unknown[]) {
  const config = redisConfig();
  if (!config) return null;

  // Bound the REST call so a slow/unreachable Redis endpoint degrades to the
  // in-memory + fallback path (getRedisKV catches this) instead of hanging the
  // request — the same "no timeout on an external call" hazard the DB layer had.
  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([command]),
    cache: "no-store",
    signal: AbortSignal.timeout(3000)
  });

  if (!response.ok) {
    throw new Error(`Redis REST request failed with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as RedisPipelineResponse;
  const first = Array.isArray(payload) ? payload[0] : null;
  if (first?.error) throw new Error(first.error);
  return first?.result ?? null;
}

async function getRedisKV<T>(key: string): Promise<CacheHit<T>> {
  try {
    const result = await redisCommand(["GET", key]);
    if (typeof result !== "string" || !result) return { hit: false };
    return { hit: true, data: JSON.parse(result) as T };
  } catch {
    return { hit: false };
  }
}

async function putRedisKV<T>(key: string, data: T, expirationTtl?: number) {
  try {
    const value = JSON.stringify(data);
    const command = expirationTtl ? ["SET", key, value, "EX", expirationTtl] : ["SET", key, value];
    await redisCommand(command);
    return redisConfig() !== null;
  } catch {
    return false;
  }
}

export function hasDurableLiveStore() {
  return redisConfig() !== null;
}

export async function withKV<T>(key: string, fallback: () => Promise<T>): Promise<{ data: T; source: DataSource }> {
  const redis = await getRedisKV<T>(key);
  if (redis.hit) return { data: redis.data, source: "live" };

  const memory = getMemory<T>(key);
  if (memory.hit) return { data: memory.data, source: "live" };

  return { data: await fallback(), source: fallbackSource() };
}

export async function putKV<T>(key: string, data: T, expirationTtl?: number) {
  const redisStored = await putRedisKV(key, data, expirationTtl);

  // Memory makes local dev and Vercel warm functions work immediately.
  // For dependable production sync across Vercel invocations, set the Vercel KV /
  // Upstash Redis env vars (KV_REST_API_URL / KV_REST_API_TOKEN) so cached
  // snapshots survive across serverless invocations.
  putMemory(key, data, expirationTtl);

  return redisStored || true;
}
