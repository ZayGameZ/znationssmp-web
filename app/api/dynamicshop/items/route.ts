import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { getMarketItems } from "@/lib/api/adapters/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const result = await withKV("cache:dynamicshop-items", getMarketItems);
  return api(result.data, result.source, result.source !== "live");
}
