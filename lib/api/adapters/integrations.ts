import { withDb } from "@/lib/db/database";
import { timeAgo } from "@/lib/utils";
import type { IntegrationStatus } from "@/types";

type SnapshotRow = {
  cache_key: string;
  synced_at: string;
};

// One row per real ingest push target — matches the cache keys basicIngest()
// actually writes to (see app/api/ingest/*/route.ts). Previously the admin
// console showed a fixed 3-row list that didn't even cover the bridge's core
// server-status/players pushes.
const INTEGRATIONS: { id: string; name: string; cacheKey: string; endpoint: string }[] = [
  { id: "server-status", name: "Server Status", cacheKey: "cache:server-status", endpoint: "/api/ingest/server/status" },
  { id: "server-players", name: "Server Players", cacheKey: "cache:server-players", endpoint: "/api/ingest/server/players" },
  { id: "dynamicshop-items", name: "DynamicShop (Items)", cacheKey: "cache:dynamicshop-items", endpoint: "/api/ingest/dynamicshop/items" },
  { id: "dynamicshop-market", name: "DynamicShop (Market)", cacheKey: "cache:market-overview", endpoint: "/api/ingest/dynamicshop/market" },
  { id: "zprofessions", name: "ZProfessions", cacheKey: "cache:zprofessions-summary", endpoint: "/api/ingest/zprofessions/summary" },
  { id: "civilization", name: "Civilization (Towns/Nations/Wars)", cacheKey: "cache:civilization", endpoint: "/api/ingest/civilization" },
  { id: "bluemap", name: "Bluemap", cacheKey: "cache:bluemap", endpoint: "/api/ingest/bluemap" }
];

// A push older than this is "Cached" (was live, may be stale) rather than "Live".
const LIVE_WINDOW_MS = 5 * 60 * 1000;

export async function getIntegrationStatuses(): Promise<IntegrationStatus[]> {
  return withDb(
    async (db) => {
      const rows = await db.prepare("SELECT cache_key, synced_at FROM plugin_snapshots").all<SnapshotRow>();
      const byCacheKey = new Map(rows.results.map((row) => [row.cache_key, row.synced_at]));

      return INTEGRATIONS.map((integration) => {
        const syncedAt = byCacheKey.get(integration.cacheKey);
        if (!syncedAt) {
          return { id: integration.id, name: integration.name, status: "Not configured" as const, endpoint: integration.endpoint, lastSync: "Waiting for server push" };
        }
        const age = Date.now() - Date.parse(syncedAt);
        const status = Number.isNaN(age) || age > LIVE_WINDOW_MS ? ("Cached" as const) : ("Live" as const);
        return { id: integration.id, name: integration.name, status, endpoint: integration.endpoint, lastSync: timeAgo(syncedAt) };
      });
    },
    async () => INTEGRATIONS.map((integration) => ({
      id: integration.id,
      name: integration.name,
      status: "Not configured" as const,
      endpoint: integration.endpoint,
      lastSync: "Waiting for server push"
    }))
  );
}
