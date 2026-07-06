import { basicIngest } from "@/lib/api/ingest";
import type { PlayerProfile } from "@/types";

// Server plugin push: POST { sentAt, plugin, data: { online: PlayerProfile[], recent: PlayerProfile[] } }
export async function POST(request: Request) {
  return basicIngest<{ online: PlayerProfile[]; recent: PlayerProfile[] }>(request, "cache:server-players");
}
