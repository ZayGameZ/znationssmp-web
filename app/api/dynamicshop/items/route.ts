import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { getMarketItems } from "@/lib/api/adapters/site";

// DynamicShop integration point: replace fallback with REST/WebSocket sync from the server plugin.
export async function GET() {
  const result = await withKV("cache:dynamicshop-items", getMarketItems);
  return api(result.data, result.source, result.source !== "live");
}
