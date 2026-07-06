import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Map, ScrollText, Shield, Store, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { PublicNav } from "@/components/layout/public-nav";
import { LiveServerStatusCard } from "@/components/dashboard/live-server-status-card";
import { configuredUrl, getPublicConfig } from "@/lib/config/site";
import { withKV } from "@/lib/cache/kv";
import { siteData } from "@/lib/mock-data";
import { currency } from "@/lib/utils";
import type { MapMarker } from "@/types";

type BluemapSnapshot = {
  mapUrl?: string;
  preview?: string;
  markers?: MapMarker[];
};

export async function PublicHome() {
  const config = getPublicConfig();
  const bluemapResult = await withKV<BluemapSnapshot>("cache:bluemap", async () => ({
    mapUrl: process.env.NEXT_PUBLIC_BLUEMAP_URL ?? "",
    preview: "/backgrounds/map-preview.jpg",
    markers: siteData.markers
  }));
  const markers = bluemapResult.data.markers ?? siteData.markers;

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1840px] px-4 pb-8 md:px-8">
        <section className="hero-mask relative min-h-[560px] overflow-hidden border-x border-b border-zn-line">
          <Image src="/backgrounds/castle-hero.jpg" alt="ZNations kingdom at golden hour" fill priority className="object-cover" />
          <div className="relative z-10 grid min-h-[560px] items-center gap-8 px-4 py-16 lg:grid-cols-[1fr_430px] lg:px-7">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black uppercase leading-none md:text-7xl lg:text-8xl">
                <span className="gold-title">ZNations</span> <span className="silver-title">SMP</span>
              </h1>
              <p className="mt-4 text-2xl font-black uppercase">A civilization-based SMP experience</p>
              <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-200">
                Build your town, form your nation, trade, wage war, and shape the world around you. Bedrock and Java crossplay.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link href="/how-to-join"><Gamepad2 className="h-5 w-5" /> {config.javaAddress}</Link></Button>
                <Button asChild variant="outline" size="lg">
                  {configuredUrl(config.discordUrl) ? <a href={config.discordUrl}>Discord Server</a> : <Link href="/discord">Discord Server</Link>}
                </Button>
              </div>
            </div>
            <LiveServerStatusCard initialServer={siteData.server} initialSource="offline" />
          </div>
        </section>
        <section className="grid border-x border-b border-zn-line md:grid-cols-3 xl:grid-cols-6">
          {[
            [Gamepad2, "Crossplay", "Play on Java or Bedrock anytime."],
            [Store, "Marketplace", "Browse synced shop data when the bridge is online."],
            [Users, "Players", "View public online profiles after server sync."],
            [Shield, "Professions", "Profession data appears after ZProfessions sync."],
            [Map, "Bluemap", "Open the live map when configured."],
            [ScrollText, "Rules", "Read the basics before joining."]
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="flex gap-4 border-r border-zn-line p-5 last:border-r-0">
              <Icon className="h-9 w-9 shrink-0 text-zn-gold" />
              <div><p className="font-black uppercase text-zn-lightGold">{String(title)}</p><p className="mt-1 text-sm text-zinc-400">{String(text)}</p></div>
            </div>
          ))}
        </section>
        <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.6fr_1fr]">
          <Card>
            <CardHeader><CardTitle>Recent News</CardTitle><Link href="/events" className="text-xs font-black uppercase text-zn-gold">View All</Link></CardHeader>
            <CardContent className="space-y-4">
              {siteData.announcements.length ? siteData.announcements.map((item) => (
                <article key={item.id} className="flex gap-3 border-b border-white/10 pb-3 last:border-0">
                  <Image src={item.image} alt="" width={96} height={58} className="rounded object-cover" />
                  <div><p className="font-black">{item.title}</p><p className="text-sm text-zinc-400">{item.body}</p><p className="text-xs text-zinc-500">{item.timeAgo}</p></div>
                </article>
              )) : <EmptyState title="No announcements synced" body="Announcements will appear here after the website admin panel or server bridge publishes them." />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Live Map</CardTitle><Link href="/map" className="text-xs font-black uppercase text-zn-gold">View Full Map</Link></CardHeader>
            <CardContent>
              <div className="relative h-[310px] overflow-hidden rounded border border-zn-line">
                <Image src="/backgrounds/map-preview.jpg" alt="ZNations territory map" fill className="object-cover" />
                {markers.map((marker) => (
                  <span key={marker.id} className="absolute grid h-9 w-9 place-items-center rounded border border-black/60 bg-black/75 text-xs font-black text-zn-lightGold" style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>ZN</span>
                ))}
                {!markers.length ? <div className="absolute inset-x-4 bottom-4 rounded border border-zn-line bg-black/75 p-3 text-sm text-zinc-300">Waiting for Bluemap marker sync.</div> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top Nations</CardTitle><Link href="/leaderboards" className="text-xs font-black uppercase text-zn-gold">View All</Link></CardHeader>
            <CardContent className="space-y-3">
              {siteData.nations.length ? siteData.nations.map((nation, index) => (
                <div key={nation.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                  <div><p className="font-black"><span className="mr-3 text-zn-gold">{index + 1}</span>{nation.name}</p><p className="text-xs text-zinc-500">{nation.members} members</p></div>
                  <p className="font-black">{currency(nation.wealth)}</p>
                </div>
              )) : <EmptyState title="No nations synced" body="Nation rankings are hidden until the future towns/nations plugin sends real data." />}
            </CardContent>
          </Card>
        </section>
        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Store} label="Shop" value="Marketplace" subtext="Browse the public economy" />
          <MetricCard icon={Trophy} label="Leaderboards" value="Rankings" subtext="Track top players and nations" />
          <MetricCard icon={Map} label="Map" value="Bluemap" subtext="Open the live world map" />
          <MetricCard icon={Users} label="Players" value="Profiles" subtext="Online players and public stats" />
        </section>
      </main>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded border border-zn-line bg-black/35 p-4"><p className="font-black text-zn-lightGold">{title}</p><p className="mt-1 text-sm text-zinc-400">{body}</p></div>;
}
