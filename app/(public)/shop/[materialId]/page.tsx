import Image from "next/image";
import { notFound } from "next/navigation";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketChart } from "@/components/dashboard/market-chart";
import { withKV } from "@/lib/cache/kv";
import { getMarketItems } from "@/lib/api/adapters/site";
import { siteData } from "@/lib/mock-data";
import { currency, percent, trendClass } from "@/lib/utils";
import type { PricePoint } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MarketOverview = { priceSeries: PricePoint[] };

export default async function ItemDetailPage({ params }: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await params;
  const items = await withKV("cache:dynamicshop-items", getMarketItems);
  const item = items.data.find((candidate) => candidate.materialId === materialId);
  if (!item) notFound();

  // Same cache key /api/dynamicshop/market reads — was previously importing
  // the static mock series directly, so it never reflected real plugin data.
  const market = await withKV<MarketOverview>("cache:market-overview", async () => ({
    priceSeries: siteData.priceSeries
  }));

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] space-y-4 px-4 py-10 md:px-8">
        <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <Card>
            <CardContent className="text-center">
              <Image src={item.iconPath} alt={item.displayName} width={180} height={180} className="mx-auto" />
              <h1 className="mt-4 font-display text-4xl tracking-wide">{item.displayName}</h1>
              <p className="text-sm uppercase text-zn-parchment/40">{item.materialId}</p>
              <div className="mt-4 flex justify-center gap-2"><Badge>{item.rarity}</Badge>{item.bestFor.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Price History</CardTitle><p className={`text-sm font-medium ${trendClass(item.trend)}`}>{percent(item.trend)} 24h</p></CardHeader>
            <CardContent><MarketChart data={market.data.priceSeries} /></CardContent>
          </Card>
        </div>
        <section className="grid gap-4 md:grid-cols-4">
          <Info label="Buy Price" value={currency(item.buyPrice)} />
          <Info label="Sell Price" value={currency(item.sellPrice)} />
          <Info label="Stock" value={item.stock.toLocaleString()} />
          <Info label="Volume 24h" value={item.volume24h.toLocaleString()} />
        </section>
        <Card>
          <CardHeader><CardTitle>Trader&apos;s Notes</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><p className="mb-2 font-display text-sm tracking-wide text-zn-lightGold">Restrictions</p>{item.restrictions.map((text) => <p key={text} className="text-sm text-zn-parchment/70">{text}</p>)}</div>
            <div><p className="mb-2 font-display text-sm tracking-wide text-zn-lightGold">Recommendations</p>{item.recommendations.map((text) => <p key={text} className="text-sm text-zn-parchment/70">{text}</p>)}</div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <Card><CardContent><p className="text-xs uppercase text-zn-parchment/40">{label}</p><p className="font-display text-2xl">{value}</p></CardContent></Card>;
}
