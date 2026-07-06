import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { getNations } from "@/lib/api/adapters/site";

// Nations plugin integration point for future Towny-style diplomacy backend.
export async function GET() {
  const result = await withKV("cache:nations", getNations);
  return api(result.data, result.source, result.source !== "live");
}
