import { basicIngest } from "@/lib/api/ingest";

// ZNationsBridge market push: POST { sentAt, plugin, data: { index } }
// index: [{ material, sales, volume, unitMin, unitAvg, unitMax }] (7-day window, busiest first)
export async function POST(request: Request) {
  return basicIngest<Record<string, unknown>>(request, "cache:market-index");
}
