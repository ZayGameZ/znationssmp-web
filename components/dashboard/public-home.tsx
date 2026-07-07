import Image from "next/image";
import Link from "next/link";
import { Coins, Gamepad2, Landmark, Map, ScrollText, Shield, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const pillars = [
  [Landmark, "Towns & Nations", "Found a town, forge a nation, and claim your borders."],
  [Coins, "Player Economy", "A living market — shops, trade, and hard-earned coin."],
  [Swords, "Events & Wars", "Seasonal events, challenges, and contested territory."],
  [Shield, "Professions", "Specialize your craft with the ZProfessions system."],
  [Gamepad2, "Java + Bedrock", "True crossplay through Geyser and Floodgate."],
  [Map, "Living World", "Explore the realm on the live BlueMap."]
] as const;

export async function PublicHome() {
  const config = getPublicConfig();
  const bluemapResult = await withKV<BluemapSnapshot>("cache:bluemap", async () => ({
    mapUrl: process.env.NEXT_PUBLIC_BLUEMAP_URL ?? "",
    preview: "/backgrounds/map-preview.jpg",
    markers: siteData.markers
  }));
  const markers = bluemapResult.data.markers ?? siteData.markers;

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-[1680px] px-4 pb-10 md:px-8">
        {/* Hero */}
        <section className="hero-mask relative min-h-[580px] overflow-hidden border-x border-b border-zn-line">
          <Image src="/backgrounds/castle-hero.jpg" alt="The ZNations realm at golden hour" fill priority className="object-cover" />
          <div className="relative z-10 grid min-h-[580px] items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_420px] lg:px-10">
            <div className="max-w-3xl">
              <span className="banner-tab mb-6">Java + Bedrock Crossplay</span>
              <h1 className="font-display text-6xl leading-[0.95] tracking-[0.02em] md:text-8xl">
                <span className="gold-title">ZNations</span> <span className="silver-title">SMP</span>
              </h1>
              <p className="mt-5 font-display text-xl tracking-[0.14em] text-zn-lightGold md:text-2xl">A CIVILIZATION SMP</p>
              <p className="mt-5 max-w-xl text-lg leading-8 text-zn-parchment/80">
                Build your town, forge your nation, master a trade, and shape the world around you.
                A realm of towns, economy, and ambition — carved out block by block.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link href="/how-to-join"><Gamepad2 className="h-5 w-5" /> {config.javaAddress}</Link></Button>
                <Button asChild variant="outline" size="lg">
                  {configuredUrl(config.discordUrl) ? <a href={config.discordUrl}>Join the Discord</a> : <Link href="/discord">Join the Discord</Link>}
                </Button>
              </div>
            </div>
            <LiveServerStatusCard initialServer={siteData.server} initialSource="offline" />
          </div>
        </section>

        {/* Realm ledger strip */}
        <section className="grid border-x border-b border-zn-line text-sm sm:grid-cols-3">
          <LedgerCell label="Java Edition" value={config.javaAddress} />
          <LedgerCell label="Bedrock Edition" value={`${config.bedrockAddress} : ${config.bedrockPort}`} />
          <LedgerCell label="Crossplay" value="Geyser + Floodgate" last />
        </section>

        {/* Pillars of the realm */}
        <section className="mt-12">
          <SectionHeading tab="The Realm" title="Pillars of ZNations" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map(([Icon, title, text]) => (
              <div key={title} className="strategy-panel group rounded-lg p-5 transition hover:border-zn-gold/50">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-md border border-zn-line bg-zn-crimson/10 text-zn-gold transition group-hover:text-zn-lightGold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg tracking-wide text-zn-parchment">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-zn-parchment/60">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* News / Map / Nations */}
        <section className="mt-12">
          <SectionHeading tab="Dispatches" title="State of the Realm" />
          <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1.5fr_1fr]">
            <Card>
              <CardHeader><CardTitle>Recent News</CardTitle><Link href="/events" className="text-xs uppercase tracking-wide text-zn-gold">View All</Link></CardHeader>
              <CardContent className="space-y-4">
                {siteData.announcements.length ? siteData.announcements.map((item) => (
                  <article key={item.id} className="flex gap-3 border-b border-white/10 pb-3 last:border-0">
                    <Image src={item.image} alt="" width={92} height={56} className="rounded object-cover" />
                    <div><p className="font-display text-sm tracking-wide">{item.title}</p><p className="text-sm text-zn-parchment/60">{item.body}</p><p className="text-xs text-zn-parchment/40">{item.timeAgo}</p></div>
                  </article>
                )) : <EmptyState title="No dispatches yet" body="News appears here once an admin publishes an announcement." />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>The Living Map</CardTitle><Link href="/map" className="text-xs uppercase tracking-wide text-zn-gold">Open Map</Link></CardHeader>
              <CardContent>
                <div className="relative h-[320px] overflow-hidden rounded border border-zn-line">
                  <Image src="/backgrounds/map-preview.jpg" alt="ZNations territory map" fill className="object-cover" />
                  {markers.map((marker) => (
                    <span key={marker.id} className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-zn-gold/60 bg-black/80 text-[10px] font-bold text-zn-lightGold" style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>ZN</span>
                  ))}
                  {!markers.length ? <div className="absolute inset-x-4 bottom-4 rounded border border-zn-line bg-black/80 p-3 text-sm text-zn-parchment/70">Town and nation markers appear here as the realm grows.</div> : null}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Nations</CardTitle><Link href="/leaderboards" className="text-xs uppercase tracking-wide text-zn-gold">Rankings</Link></CardHeader>
              <CardContent className="space-y-3">
                {siteData.nations.length ? siteData.nations.map((nation, index) => (
                  <div key={nation.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                    <div><p className="font-display tracking-wide"><span className="mr-3 text-zn-gold">{index + 1}</span>{nation.name}</p><p className="text-xs text-zn-parchment/40">{nation.members} members</p></div>
                    <p className="font-medium text-zn-lightGold">{currency(nation.wealth)}</p>
                  </div>
                )) : <EmptyState title="No nations founded yet" body="The first nations of the realm will be honored here. Yours could be among them." />}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to arms */}
        <section className="mt-12 overflow-hidden rounded-lg border border-zn-line bg-[radial-gradient(circle_at_top,rgba(155,53,53,.16),transparent_46%),#141109] p-8 text-center md:p-12">
          <span className="banner-tab mx-auto">Your Legacy Awaits</span>
          <h2 className="mt-5 font-display text-3xl tracking-wide md:text-5xl">Claim your place in the realm</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zn-parchment/70">
            Create an account, link your Minecraft name, and step into a world that remembers what you build.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link href="/register">Create Account</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/how-to-join"><ScrollText className="h-5 w-5" /> How to Join</Link></Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ tab, title }: { tab: string; title: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="banner-tab">{tab}</span>
      <h2 className="mt-3 font-display text-3xl tracking-wide md:text-4xl">{title}</h2>
      <div className="crest-rule mt-4 w-40" />
    </div>
  );
}

function LedgerCell({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-5 py-4 ${last ? "" : "border-b border-zn-line sm:border-b-0 sm:border-r"}`}>
      <span className="text-xs uppercase tracking-[0.18em] text-zn-parchment/45">{label}</span>
      <span className="font-display text-sm tracking-wide text-zn-lightGold">{value}</span>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded border border-zn-line bg-black/30 p-4"><p className="font-display text-sm tracking-wide text-zn-lightGold">{title}</p><p className="mt-1 text-sm text-zn-parchment/55">{body}</p></div>;
}
