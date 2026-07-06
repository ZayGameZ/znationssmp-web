import { withKV } from "@/lib/cache/kv";
import { withD1, type D1Row } from "@/lib/db/d1";
import { siteData } from "@/lib/mock-data";
import type { PlayerProfile } from "@/types";

type PlayerProfileRow = D1Row & {
  data_json: string;
};

export async function getPlayerProfiles() {
  return withKV<PlayerProfile[]>("cache:player-profiles", async () =>
    withD1(
      async (db) => {
        const rows = await db.prepare("SELECT data_json FROM player_profiles ORDER BY online DESC, updated_at DESC LIMIT 200").all<PlayerProfileRow>();
        return rows.results.map((row) => JSON.parse(row.data_json) as PlayerProfile);
      },
      async () => siteData.playerProfiles
    )
  );
}

export async function getPlayerProfile(username: string) {
  const profiles = await getPlayerProfiles();
  return {
    ...profiles,
    data: profiles.data.find((profile) => profile.username.toLowerCase() === username.toLowerCase()) ?? null
  };
}
