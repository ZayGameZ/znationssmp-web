import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketChart } from "@/components/dashboard/market-chart";
import { siteData } from "@/lib/mock-data";
import { currency, percent, trendClass } from "@/lib/utils";

export default async function ItemDetailPage({ params }: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await params;
  const item = siteData.items.find((candidate) => candidate.materialId === materialId);
  if (!item) notFound();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardContent className="text-center">
            <Image src={item.iconPath} alt={item.displayName} width={180} height={180} className="mx-auto" />
            <h1 className="mt-4 text-4xl font-black">{item.displayName}</h1>
            <p className="text-sm uppercase text-zinc-500">{item.materialId}</p>
            <div className="mt-4 flex justify-center gap-2"><Badge>{item.rarity}</Badge>{item.bestFor.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Price History</CardTitle><p className={`text-sm font-black ${trendClass(item.trend)}`}>{percent(item.trend)} 24h</p></CardHeader>
          <CardContent><MarketChart data={siteData.priceSeries} /></CardContent>
        </Card>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <Info label="Buy Price" value={currency(item.buyPrice)} />
        <Info label="Sell Price" value={currency(item.sellPrice)} />
        <Info label="Stock" value={item.stock.toLocaleString()} />
        <Info label="Volume 24h" value={item.volume24h.toLocaleString()} />
      </section>
      <Card>
        <CardHeader><CardTitle>Profession Intelligence</CardTitle><Button variant="outline">Add To Watchlist</Button></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div><p className="mb-2 font-black uppercase text-zn-lightGold">Restrictions</p>{item.restrictions.map((text) => <p key={text} className="text-sm text-zinc-300">{text}</p>)}</div>
          <div><p className="mb-2 font-black uppercase text-zn-lightGold">Recommendations</p>{item.recommendations.map((text) => <p key={text} className="text-sm text-zinc-300">{text}</p>)}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <Card><CardContent><p className="text-xs uppercase text-zinc-500">{label}</p><p className="text-2xl font-black">{value}</p></CardContent></Card>;
}
