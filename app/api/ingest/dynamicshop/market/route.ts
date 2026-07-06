import { basicIngest } from "@/lib/api/ingest";

// DynamicShop market push: POST { sentAt, plugin, data: { stats, featured, transactions, priceSeries } }
export async function POST(request: Request) {
  return basicIngest<Record<string, unknown>>(request, "cache:market-overview");
}
