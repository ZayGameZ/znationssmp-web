import { Store, TrendingUp } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { ShopClient } from "@/components/shop/shop-client";
import { Card, CardContent } from "@/components/ui/card";
import { withKV } from "@/lib/cache/kv";
import { getMarketItems } from "@/lib/api/adapters/site";
import { getMarketIndex, type MarketIndexRow } from "@/lib/api/adapters/game-feeds";
import { siteData } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  // Live items pushed by the shop plugin; falls back to the (empty) seed list
  // with honest empty states when nothing has been synced yet.
  const items = await withKV("cache:dynamicshop-items", getMarketItems);
  // The ZMarket price index (7-day completed-sales stats) pushed by ZNationsBridge.
  const index = await getMarketIndex();

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] px-4 py-10 md:px-8">
        <div className="mb-6">
          <span className="banner-tab"><Store className="h-3.5 w-3.5" /> The Grand Bazaar</span>
          <h1 className="mt-4 font-display text-4xl tracking-wide md:text-6xl">Market</h1>
          <p className="mt-3 max-w-3xl text-zn-parchment/60">
            The realm&apos;s marketplace — browse items, prices, and trends drawn from the living economy.
          </p>
        </div>
        {index.length > 0 && <MarketIndexSection index={index} />}
        <ShopClient items={items.data} categories={siteData.categories} professions={siteData.professions} />
      </main>
    </div>
  );
}

function MarketIndexSection({ index }: { index: MarketIndexRow[] }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-black uppercase text-zn-lightGold">
        <TrendingUp className="h-5 w-5" /> Price Index — last 7 days
      </h2>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zn-line text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Sales</th>
                <th className="px-5 py-3">Volume</th>
                <th className="px-5 py-3">Low</th>
                <th className="px-5 py-3">Average</th>
                <th className="px-5 py-3">High</th>
              </tr>
            </thead>
            <tbody>
              {index.map((row) => (
                <tr key={row.material} className="border-b border-zn-line/50 last:border-0">
                  <td className="px-5 py-3 font-bold text-zn-parchment">{prettyMaterial(row.material)}</td>
                  <td className="px-5 py-3 text-zinc-300">{row.sales.toLocaleString()}</td>
                  <td className="px-5 py-3 text-zinc-300">{row.volume.toLocaleString()}</td>
                  <td className="px-5 py-3 text-zinc-400">{row.unitMin.toLocaleString()}</td>
                  <td className="px-5 py-3 text-zn-gold">{row.unitAvg.toLocaleString()}</td>
                  <td className="px-5 py-3 text-zinc-400">{row.unitMax.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <p className="mt-2 text-xs text-zn-parchment/40">
        Per-item ZMark prices across every completed player sale — listings, buy orders, and chest shops.
      </p>
    </section>
  );
}

function prettyMaterial(material: string): string {
  const lower = material.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
