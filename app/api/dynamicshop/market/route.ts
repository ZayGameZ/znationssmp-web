import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";

// DynamicShop market overview endpoint. Live backend should return price history, volume, listings, and trends.
export async function GET() {
  const result = await withKV("cache:market-overview", async () => ({
    priceSeries: siteData.priceSeries,
    highlights: siteData.items.slice(0, 5),
    transactions: siteData.transactions,
    topSellers: siteData.leaderboards.sellers
  }));
  return api(result.data, result.source, result.source !== "live");
}
