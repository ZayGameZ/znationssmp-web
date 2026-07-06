import { basicIngest } from "@/lib/api/ingest";
import type { MarketItem } from "@/types";

// DynamicShop push: POST { sentAt, plugin, data: MarketItem[] }
export async function POST(request: Request) {
  return basicIngest<MarketItem[]>(request, "cache:dynamicshop-items");
}
