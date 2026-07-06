import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";

// ZProfessions integration point: live endpoint should expose assignments, profession metadata, and economy tags.
export async function GET() {
  const result = await withKV("cache:zprofessions-summary", async () => ({
    professions: siteData.professions,
    leaderboards: siteData.leaderboards.professions,
    currentUserProfession: siteData.currentUser.professionId
  }));
  return api(result.data, result.source, result.source !== "live");
}
