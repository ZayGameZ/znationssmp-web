import { withKV } from "@/lib/cache/kv";
import { withDb } from "@/lib/db/database";

// Shapes pushed by ZNationsBridge's CivilizationCollector (see /api/ingest/civilization).
export type CivTown = {
  id: number;
  name: string;
  tier: number;
  tierName: string;
  residents: number;
  mayor: string;
  world: string;
};

export type CivNation = {
  id: number;
  name: string;
  government: string;
  leaderTitle: string;
  level: number;
  capitalTownId: number;
  memberTownIds: number[];
  treasuryBalance: number;
};

export type CivWar = {
  id: number;
  type: "TOWN_WAR" | "NATION_WAR";
  attacker: string;
  defender: string;
  phase: "NOTICE" | "ACTIVE";
  objective: string;
  casusBelli: string;
  activeEndsAt: string;
};

export type Civilization = {
  towns: CivTown[];
  nations: CivNation[];
  wars: CivWar[];
};

const EMPTY: Civilization = { towns: [], nations: [], wars: [] };

type SnapshotRow = { payload_json: string };

/**
 * The latest civilization snapshot the bridge pushed. Reads the warm KV first, then falls back to
 * the durable plugin_snapshots row (cold serverless start), then to an empty world (no data yet).
 */
export async function getCivilization(): Promise<Civilization> {
  const result = await withKV<Civilization>("cache:civilization", async () =>
    withDb(
      async (db) => {
        const rows = await db
          .prepare("SELECT payload_json FROM plugin_snapshots WHERE cache_key = ?")
          .bind("cache:civilization")
          .all<SnapshotRow>();
        const raw = rows.results[0]?.payload_json;
        if (!raw) return EMPTY;
        try {
          const payload = JSON.parse(raw) as { data?: Partial<Civilization> };
          return {
            towns: payload.data?.towns ?? [],
            nations: payload.data?.nations ?? [],
            wars: payload.data?.wars ?? []
          };
        } catch {
          return EMPTY;
        }
      },
      async () => EMPTY
    )
  );
  return {
    towns: result.data.towns ?? [],
    nations: result.data.nations ?? [],
    wars: result.data.wars ?? []
  };
}
