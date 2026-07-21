import { withKV } from "@/lib/cache/kv";
import { withDb } from "@/lib/db/database";

// Shapes pushed by ZNationsBridge's FeedsCollector (see /api/ingest/events|market|professions).

export type GameEvent = {
  id: number;
  type: string;
  category: string;
  name: string;
  phase: "SCHEDULED" | "ANNOUNCED" | "ACTIVE" | "RESOLVED" | "CANCELLED" | "ARCHIVED";
  startsAt: string;
  endsAt: string;
  budget: number;
  summary: string | null;
};

export type MarketIndexRow = {
  material: string;
  sales: number;
  volume: number;
  unitMin: number;
  unitAvg: number;
  unitMax: number;
};

export type ProfessionProfile = {
  uuid: string;
  name?: string;
  primary: string | null;
  primaryTier: string | null;
  primaryPoints: number;
  secondary: string | null;
  secondaryTier: string | null;
  secondaryPoints: number;
};

type SnapshotRow = { payload_json: string };

/**
 * Warm KV first (holds the raw pushed data object), durable plugin_snapshots row on cold starts,
 * honest-empty otherwise. Both paths normalize through pick() at the end.
 */
async function readFeed<T>(cacheKey: string, pick: (data: Record<string, unknown>) => T, empty: T): Promise<T> {
  const result = await withKV<unknown>(cacheKey, async () =>
    withDb<unknown>(
      async (db) => {
        const rows = await db
          .prepare("SELECT payload_json FROM plugin_snapshots WHERE cache_key = ?")
          .bind(cacheKey)
          .all<SnapshotRow>();
        const raw = rows.results[0]?.payload_json;
        if (!raw) return {};
        try {
          const payload = JSON.parse(raw) as { data?: Record<string, unknown> };
          return payload.data ?? {};
        } catch {
          return {};
        }
      },
      async () => ({})
    )
  );
  const data = result.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return pick(data as Record<string, unknown>);
  }
  return empty;
}

export async function getGameEvents(): Promise<GameEvent[]> {
  return readFeed("cache:events", (data) => (data.events as GameEvent[]) ?? [], []);
}

export async function getMarketIndex(): Promise<MarketIndexRow[]> {
  return readFeed("cache:market-index", (data) => (data.index as MarketIndexRow[]) ?? [], []);
}

export async function getProfessionProfiles(): Promise<ProfessionProfile[]> {
  return readFeed("cache:professions", (data) => (data.profiles as ProfessionProfile[]) ?? [], []);
}
