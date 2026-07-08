import { withKV } from "@/lib/cache/kv";
import { siteData } from "@/lib/mock-data";
import type {
  MarketItem,
  Nation,
  Profession,
  ServerSnapshot,
  SiteData,
  Town
} from "@/types";

export async function getSiteData(): Promise<SiteData> {
  return siteData;
}

export async function getServerStatus(): Promise<ServerSnapshot> {
  return siteData.server;
}

export async function getMarketItems(): Promise<MarketItem[]> {
  return siteData.items;
}

// Same cache key + fallback shape as /api/zprofessions/summary, so this reflects
// whatever the ZProfessions plugin last pushed instead of the static catalog.
export async function getProfessions(): Promise<Profession[]> {
  const result = await withKV("cache:zprofessions-summary", async () => ({
    professions: siteData.professions,
    leaderboards: siteData.leaderboards.professions,
    currentUserProfession: siteData.currentUser.professionId
  }));
  return result.data.professions;
}

export async function getTowns(): Promise<Town[]> {
  return siteData.towns;
}

export async function getNations(): Promise<Nation[]> {
  return siteData.nations;
}
