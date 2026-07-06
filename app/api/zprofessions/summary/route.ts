import { withKV } from "@/lib/cache/kv";
import { api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const result = await withKV("cache:zprofessions-summary", async () => ({
    professions: siteData.professions,
    leaderboards: siteData.leaderboards.professions,
    currentUserProfession: siteData.currentUser.professionId
  }));
  return api(result.data, result.source, result.source !== "live");
}
