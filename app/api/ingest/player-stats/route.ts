import { NextResponse } from "next/server";
import { readIngestEnvelope, requireIngestAuth, storeIngestSnapshot } from "@/lib/api/ingest";
import { withDb } from "@/lib/db/database";
import type { PlayerProfile } from "@/types";

// Server plugin push: POST { sentAt, plugin, data: PlayerProfile | PlayerProfile[] | { profiles: PlayerProfile[] } }
export async function POST(request: Request) {
  const auth = requireIngestAuth(request);
  if (auth) return auth;

  try {
    const envelope = await readIngestEnvelope<PlayerProfile | PlayerProfile[] | { profiles: PlayerProfile[] }>(request);
    const profiles = normalizeProfiles(envelope.data);
    const result = await storeIngestSnapshot("cache:player-profiles", { ...envelope, data: profiles });
    const updatedAt = new Date().toISOString();

    await withDb(
      async (db) => {
        for (const profile of profiles) {
          await db
            .prepare(
              `INSERT INTO player_profiles (username, minecraft_uuid, user_id, online, data_json, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(username) DO UPDATE SET
                 minecraft_uuid = excluded.minecraft_uuid,
                 user_id = excluded.user_id,
                 online = excluded.online,
                 data_json = excluded.data_json,
                 updated_at = excluded.updated_at`
            )
            .bind(profile.username, profile.minecraftUuid, profile.userId ?? "", profile.online ? 1 : 0, JSON.stringify(profile), updatedAt)
            .run();
        }
        return true;
      },
      async () => false
    );

    return NextResponse.json({ ...result, profiles: profiles.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid player profile payload" }, { status: 400 });
  }
}

function normalizeProfiles(data: PlayerProfile | PlayerProfile[] | { profiles: PlayerProfile[] }) {
  if (Array.isArray(data)) return data;
  if ("profiles" in data) return data.profiles;
  return [data];
}
