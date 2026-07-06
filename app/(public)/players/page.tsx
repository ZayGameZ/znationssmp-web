import Image from "next/image";
import Link from "next/link";
import { Activity, Clock, Coins, Shield } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPlayerProfiles } from "@/lib/api/adapters/players";
import { siteData } from "@/lib/mock-data";
import { currency } from "@/lib/utils";
import type { PlayerProfile } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlayersPage() {
  const profiles = await getPlayerProfiles();
  const online = profiles.data.filter((profile) => profile.online);
  const recent = profiles.data.filter((profile) => !profile.online);

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] px-4 py-8 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-zn-gold">Public Player Profiles</p>
            <h1 className="text-4xl font-black uppercase md:text-6xl">Players</h1>
            <p className="mt-2 max-w-3xl text-zinc-400">Online players and cached recent profiles. Coordinates, worlds, IPs, staff notes, and private moderation data are never shown.</p>
          </div>
          <Badge>{profiles.source === "live" || profiles.source === "cache" ? profiles.source : "Waiting For Server Sync"}</Badge>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Summary icon={Activity} label="Online" value={online.length.toString()} />
          <Summary icon={Clock} label="Recent Profiles" value={profiles.data.length.toString()} />
          <Summary icon={Shield} label="Professions" value={siteData.professions.length.toString()} />
        </section>

        <PlayerGrid title="Online Now" profiles={online} />
        <PlayerGrid title="Recent Players" profiles={recent} />
      </main>
    </div>
  );
}

function Summary({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Icon className="h-9 w-9 text-zn-gold" />
        <div><p className="text-xs font-black uppercase text-zinc-500">{label}</p><p className="text-3xl font-black">{value}</p></div>
      </CardContent>
    </Card>
  );
}

function PlayerGrid({ title, profiles }: { title: string; profiles: PlayerProfile[] }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-black uppercase">{title}</h2>
      {profiles.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => {
            const profession = siteData.professions.find((item) => item.id === profile.professionId);
            const town = siteData.towns.find((item) => item.id === profile.townId);
            const nation = siteData.nations.find((item) => item.id === profile.nationId);
            return (
              <Link key={profile.username} href={`/players/${encodeURIComponent(profile.username)}`} className="block rounded-lg border border-zn-line bg-zn-surface/80 p-4 transition hover:border-zn-gold hover:shadow-gold">
                <div className="flex items-start gap-4">
                  <Image src={profile.avatarUrl} alt={profile.username} width={58} height={58} className="rounded border border-zn-line" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-lg font-black">{profile.username}</p>
                      <span className={profile.online ? "text-zn-emerald" : "text-zinc-500"}>{profile.online ? "Online" : "Offline"}</span>
                    </div>
                    <p className="text-sm text-zn-lightGold">{profession?.name ?? "No profession"}</p>
                    <p className="mt-1 truncate text-xs text-zinc-500">{town?.name ?? "No town"} / {nation?.name ?? "No nation"}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <span><Coins className="mb-1 h-4 w-4 text-zn-gold" />{currency(profile.balance)}</span>
                  <span>K/D<br />{profile.stats.kdRatio.toFixed(2)}</span>
                  <span>Listings<br />{profile.shopSummary.activeListings}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card><CardContent className="text-sm text-zinc-400">No synced players yet. Once the server posts player snapshots, they will appear here.</CardContent></Card>
      )}
    </section>
  );
}
