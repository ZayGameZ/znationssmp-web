import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Coins, Crosshair, ScrollText, Shield, Store } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlayerProfile } from "@/lib/api/adapters/players";
import { siteData } from "@/lib/mock-data";
import { compactNumber, currency } from "@/lib/utils";

export default async function PlayerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await getPlayerProfile(decodeURIComponent(username));
  if (!result.data) notFound();
  const profile = result.data;
  const profession = siteData.professions.find((item) => item.id === profile.professionId);
  const town = siteData.towns.find((item) => item.id === profile.townId);
  const nation = siteData.nations.find((item) => item.id === profile.nationId);

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1320px] px-4 py-8 md:px-8">
        <section className="rounded-lg border border-zn-line bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,.18),transparent_35%),#080808] p-5 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <Image src={profile.avatarUrl} alt={profile.username} width={104} height={104} className="rounded-lg border border-zn-line" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="break-words text-4xl font-black uppercase md:text-6xl">{profile.username}</h1>
                <Badge>{profile.online ? "Online" : "Offline"}</Badge>
              </div>
              <p className="mt-2 text-zinc-400">Public gameplay profile. Private staff notes, punishments, IPs, coordinates, worlds, and locations are hidden.</p>
              <div className="mt-4 flex flex-wrap gap-2">{profile.badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div>
            </div>
            <Button asChild variant="outline"><Link href="/players">All Players</Link></Button>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Coins} label="Balance" value={currency(profile.balance)} />
          <Stat icon={Crosshair} label="K/D" value={profile.stats.kdRatio.toFixed(2)} />
          <Stat icon={Clock} label="Playtime" value={`${Math.round(profile.playtimeMinutes / 60)}h`} />
          <Stat icon={Store} label="Shop Value" value={currency(profile.shopSummary.shopValue)} />
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Identity</CardTitle><Shield className="h-5 w-5 text-zn-gold" /></CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <Row label="Profession" value={profession?.name ?? "No profession"} />
              <Row label="Town" value={town?.name ?? "No town"} />
              <Row label="Nation" value={nation?.name ?? "No nation"} />
              <Row label="Last Seen" value={profile.online ? "Online now" : new Date(profile.stats.lastSeenAt).toLocaleString()} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Stats</CardTitle><Crosshair className="h-5 w-5 text-zn-gold" /></CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <Row label="Kills" value={compactNumber(profile.stats.kills)} />
              <Row label="Deaths" value={compactNumber(profile.stats.deaths)} />
              <Row label="Blocks Broken" value={compactNumber(profile.stats.blocksBroken)} />
              <Row label="Mobs Killed" value={compactNumber(profile.stats.mobsKilled)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Progress</CardTitle><ScrollText className="h-5 w-5 text-zn-gold" /></CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <p>{profile.questSummary}</p>
              <p>{profile.professionSummary}</p>
              <p>{profile.shopSummary.activeListings} active listings, {profile.shopSummary.sold24h} sales in the last day.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Coins; label: string; value: string }) {
  return (
    <Card><CardContent className="flex items-center gap-4"><Icon className="h-8 w-8 text-zn-gold" /><div><p className="text-xs font-black uppercase text-zinc-500">{label}</p><p className="text-2xl font-black">{value}</p></div></CardContent></Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-0"><span className="text-zinc-500">{label}</span><span className="text-right font-bold text-zinc-100">{value}</span></div>;
}
