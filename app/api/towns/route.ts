import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { getTowns } from "@/lib/api/adapters/site";

// Diplomacy/Towns plugin integration point. Queue writes separately when live plugin is unavailable.
export async function GET() {
  const result = await withKV("cache:towns", getTowns);
  return api(result.data, result.source, result.source !== "live");
}
