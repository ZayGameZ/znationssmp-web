import type { DataSource } from "@/types";
import type { CloudflareEnv } from "@/lib/db/d1";

export async function withKV<T>(key: string, fallback: () => Promise<T>): Promise<{ data: T; source: DataSource }> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const context = await mod.getCloudflareContext({ async: true });
    const kv = (context.env as CloudflareEnv).ZNATIONS_CACHE;
    const cached = kv ? await kv.get<T>(key, "json") : null;
    if (cached) return { data: cached, source: "cache" };
  } catch {
    // Local dev without Cloudflare bindings falls through to mock-seed.
  }
  return { data: await fallback(), source: "mock-seed" };
}

export async function putKV<T>(key: string, data: T, expirationTtl?: number) {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const context = await mod.getCloudflareContext({ async: true });
    const kv = (context.env as CloudflareEnv).ZNATIONS_CACHE;
    if (!kv) return false;
    await kv.put(key, JSON.stringify(data), expirationTtl ? { expirationTtl } : undefined);
    return true;
  } catch {
    return false;
  }
}
