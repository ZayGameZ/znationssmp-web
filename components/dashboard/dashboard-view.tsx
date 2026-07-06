import Image from "next/image";
import type { ReactNode } from "react";
import { BadgeDollarSign, Boxes, CircleDollarSign, ListChecks, TrendingUp, Users } from "lucide-react";
import { MarketChart } from "@/components/dashboard/market-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { siteData } from "@/lib/mock-data";
import { currency, percent, trendClass } from "@/lib/utils";

export function DashboardView() {
  const user = siteData.currentUser;
  const profession = siteData.professions.find((item) => item.id === user.professionId);
  const town = siteData.towns.find((item) => item.id === user.townId);
  const nation = siteData.nations.find((item) => item.id === user.nationId);

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-lg border border-zn-line">
        <Image src="/backgrounds/market-hero.jpg" alt="ZNations market" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-black/80" />
        <div className="relative grid gap-6 p-7 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-lg font-black uppercase tracking-normal">Welcome to the</p>
            <h1 className="mt-1 text-5xl font-black uppercase md:text-6xl"><span className="gold-title">ZNations</span> <span className="silver-title">Market</span></h1>
            <p className="mt-5 max-w-xl text-zinc-200">Trade, invest, prosper. Your {profession?.name} market recommendations are tuned for {town?.name} and {nation?.name}.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Button>Start Trading</Button><Button variant="outline">Queue Town Action</Button></div>
          </div>
          <Card className="bg-black/75">
            <CardContent className="space-y-5">
              <HeroStat label="Players Online" value={`${siteData.server.playersOnline} / ${siteData.server.maxPlayers}`} icon={<Users className="h-5 w-5" />} />
              <HeroStat label="Market Volume (24h)" value={currency(1245789)} icon={<BadgeDollarSign className="h-5 w-5" />} />
              <HeroStat label="Active Listings" value="2,847" icon={<ListChecks className="h-5 w-5" />} />
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Players Online" value={`${siteData.server.playersOnline}/${siteData.server.maxPlayers}`} subtext="Live or cached server snapshot" tone="emerald" />
        <MetricCard icon={TrendingUp} label="Market Volume" value={currency(1245789)} subtext="+15.68% from yesterday" />
        <MetricCard icon={Boxes} label="Active Listings" value="2,847" subtext="Player and server shop stock" />
        <MetricCard icon={CircleDollarSign} label="Wallet" value={currency(user.balance)} subtext={`${profession?.name} economy profile`} tone="emerald" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <div className="text-right"><p className="text-xs text-zinc-400">Total Market Volume (24h)</p><p className="font-black">{currency(1245789)} <span className="text-xs text-zn-emerald">+15.68%</span></p></div>
          </CardHeader>
          <CardContent><MarketChart data={siteData.priceSeries} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Market Highlights</CardTitle><div className="flex gap-2 text-xs font-black"><Badge>24H</Badge><span className="text-zinc-500">7D</span><span className="text-zinc-500">30D</span></div></CardHeader>
          <CardContent className="space-y-3">
            {siteData.items.slice(0, 5).map((item) => (
              <div key={item.materialId} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-white/10 pb-3 last:border-0">
                <Image src={item.iconPath} alt="" width={44} height={44} />
                <div><p className="font-black">{item.displayName}</p><p className="text-xs text-zinc-500">{item.bestFor.join(", ")}</p></div>
                <div className="text-right"><p className="font-black">{currency(item.buyPrice)}</p><p className={`text-xs font-black ${trendClass(item.trend)}`}>{percent(item.trend)}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><CardTitle>Featured Items</CardTitle><Button variant="ghost" size="sm">View All Items</Button></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {siteData.items.map((item) => (
              <article key={item.materialId} className="rounded-md border border-zn-line bg-black/30 p-3 text-center">
                <Image src={item.iconPath} alt={item.displayName} width={92} height={92} className="mx-auto" />
                <p className="font-black">{item.displayName}</p>
                <p className="text-lg font-black">{currency(item.buyPrice)}</p>
                <p className={`text-xs font-black ${trendClass(item.trend)}`}>{percent(item.trend)}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">View</Button>
              </article>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>System Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Info label="Sales Tax" value="5.0%" />
            <Info label="Listing Duration" value="7 Days" />
            <Info label="Market Fee" value="1.5%" />
            <Info label="Source" value="Cache ready" />
            <Button variant="outline" className="w-full">View Full Guide</Button>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto thin-scrollbar">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-xs uppercase text-zinc-500"><tr><th className="py-2">Item</th><th>Seller</th><th>Buyer</th><th>Price</th><th>Time</th></tr></thead>
              <tbody>
                {siteData.transactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-white/10">
                    <td className="py-2">{tx.itemName} x{tx.quantity}</td>
                    <td>{tx.seller}</td>
                    <td>{tx.buyer}</td>
                    <td className={tx.type === "SELL" ? "text-zn-danger" : "text-zn-emerald"}>{currency(tx.price)}</td>
                    <td className="text-zinc-500">{tx.timeAgo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HeroStat({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"><div className="text-zn-gold">{icon}</div><div><p className="text-xs uppercase text-zinc-500">{label}</p><p className="text-2xl font-black">{value}</p></div></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm"><span className="text-zinc-400">{label}</span><span className="font-black">{value}</span></div>;
}
