import { NextResponse } from "next/server";
import { hasDurableLiveStore, putKV } from "@/lib/cache/kv";
import { withDb } from "@/lib/db/database";
import type { IngestEnvelope, IngestResult } from "@/types";

export function requireIngestAuth(request: Request) {
  const secret = process.env.ZN_INGEST_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized ingest request" }, { status: 401 });
  }
  return null;
}

export async function readIngestEnvelope<T>(request: Request): Promise<IngestEnvelope<T>> {
  const body = (await request.json()) as Partial<IngestEnvelope<T>>;
  if (!body.sentAt || !body.plugin || body.data === undefined) {
    throw new Error("Ingest body must include sentAt, plugin, and data.");
  }
  return {
    sentAt: String(body.sentAt),
    plugin: String(body.plugin),
    data: body.data as T
  };
}

export async function storeIngestSnapshot<T>(cacheKey: string, envelope: IngestEnvelope<T>): Promise<IngestResult> {
  const syncedAt = new Date().toISOString();
  const payload = {
    ...envelope,
    syncedAt,
    source: "live" as const
  };

  const cacheStored = await putKV(cacheKey, envelope.data);
  const databaseStored = await withDb(
    async (db) => {
      await db
        .prepare(
          `INSERT INTO plugin_snapshots (cache_key, plugin, payload_json, synced_at)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(cache_key) DO UPDATE SET plugin = excluded.plugin, payload_json = excluded.payload_json, synced_at = excluded.synced_at`
        )
        .bind(cacheKey, envelope.plugin, JSON.stringify(payload), syncedAt)
        .run();
      return true;
    },
    async () => false
  );

  return {
    ok: cacheStored || databaseStored,
    source: "live",
    cachedKey: cacheKey,
    syncedAt,
    storage: {
      cache: cacheStored,
      database: databaseStored,
      durable: databaseStored || hasDurableLiveStore()
    }
  };
}

export async function basicIngest<T>(request: Request, cacheKey: string) {
  const auth = requireIngestAuth(request);
  if (auth) return auth;
  try {
    const envelope = await readIngestEnvelope<T>(request);
    const result = await storeIngestSnapshot(cacheKey, envelope);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid ingest payload" }, { status: 400 });
  }
}
