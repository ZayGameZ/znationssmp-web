import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";

// Bluemap integration point. Live implementation should proxy marker context, not player coordinates.
export async function GET() {
  const result = await withKV("cache:bluemap", async () => ({
    mapUrl: process.env.NEXT_PUBLIC_BLUEMAP_URL ?? "",
    preview: "/backgrounds/map-preview.jpg",
    markers: siteData.markers
  }));
  return api(result.data, result.source, result.source !== "live");
}
