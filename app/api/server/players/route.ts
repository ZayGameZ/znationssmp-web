import { api } from "@/lib/api/response";
import { getPlayerProfiles } from "@/lib/api/adapters/players";

// Public player snapshot endpoint. Server pushes durable player stats through /api/ingest/player-stats.
export async function GET() {
  const result = await getPlayerProfiles();
  return api(result.data, result.source, result.source !== "live");
}
