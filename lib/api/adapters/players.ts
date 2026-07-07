import { withKV } from "@/lib/cache/kv";
import { withDb, type DbRow } from "@/lib/db/database";
import { siteData } from "@/lib/mock-data";
import type { PlayerProfile } from "@/types";

type PlayerProfileRow = DbRow & {
  data_json: string;
};

// If a profile claims to be online but hasn't been refreshed within this window,
// treat it as offline. This is the failsafe for the cases the plugin can't
// report: server crash, plugin removed, or network loss mid-session — without
// it, players would appear "online" forever.
const ONLINE_STALE_MS = 5 * 60 * 1000;

function withStaleCheck(profile: PlayerProfile): PlayerProfile {
  if (!profile.online) return profile;
  const lastSeen = Date.parse(profile.stats?.lastSeenAt ?? "");
  if (Number.isNaN(lastSeen) || Date.now() - lastSeen > ONLINE_STALE_MS) {
    return { ...profile, online: false };
  }
  return profile;
}

export async function getPlayerProfiles() {
  const result = await withKV<PlayerProfile[]>("cache:player-profiles", async () =>
    withDb(
      async (db) => {
        const rows = await db.prepare("SELECT data_json FROM player_profiles ORDER BY online DESC, updated_at DESC LIMIT 200").all<PlayerProfileRow>();
        return rows.results.map((row) => JSON.parse(row.data_json) as PlayerProfile);
      },
      async () => siteData.playerProfiles
    )
  );
  return { ...result, data: result.data.map(withStaleCheck) };
}

export async function getPlayerProfile(username: string) {
  const profiles = await getPlayerProfiles();
  return {
    ...profiles,
    data: profiles.data.find((profile) => profile.username.toLowerCase() === username.toLowerCase()) ?? null
  };
}
