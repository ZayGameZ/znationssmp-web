import { api } from "@/lib/api/response";
import { getPlayerProfiles } from "@/lib/api/adapters/players";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const result = await getPlayerProfiles();
  return api(result.data, result.source, result.source !== "live");
}
