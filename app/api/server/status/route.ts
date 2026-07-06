import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { getServerStatus } from "@/lib/api/adapters/site";

// Future live integration point: Paper plugin or proxy status endpoint should hydrate cache:server-status.
export async function GET() {
  const result = await withKV("cache:server-status", getServerStatus);
  return api(result.data, result.source, result.source !== "live");
}
