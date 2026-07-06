export interface CloudflareEnv {
  ZNATIONS_DB?: D1Database;
  ZNATIONS_CACHE?: KVNamespace;
}

export type D1Row = Record<string, string | number | null>;

export async function withD1<T>(operation: (db: D1Database) => Promise<T>, fallback: () => Promise<T>) {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const context = await mod.getCloudflareContext({ async: true });
    const db = (context.env as CloudflareEnv).ZNATIONS_DB;
    if (!db) return fallback();
    return await operation(db);
  } catch {
    return fallback();
  }
}
