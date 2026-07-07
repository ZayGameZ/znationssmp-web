import Image from "next/image";
import Link from "next/link";
import { Activity, Clock, Coins, Users } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Card, CardContent } from "@/components/ui/card";
import { getPlayerProfiles } from "@/lib/api/adapters/players";
import { currency, timeAgo } from "@/lib/utils";
import type { PlayerProfile } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlayersPage() {
  const profiles = await getPlayerProfiles();
  const online = profiles.data.filter((profile) => profile.online);
  const offline = profiles.data.filter((profile) => !profile.online);

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] px-4 py-10 md:px-8">
        <div>
          <span className="banner-tab"><Users className="h-3.5 w-3.5" /> Citizens of the Realm</span>
          <h1 className="mt-4 font-display text-4xl tracking-wide md:text-6xl">Players</h1>
          <p className="mt-3 max-w-3xl text-zn-parchment/60">
            Every player the realm has seen. Locations, coordinates, and private data are never shown.
          </p>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Summary icon={Activity} label="Online Now" value={online.length.toString()} />
          <Summary icon={Clock} label="Offline" value={offline.length.toString()} />
          <Summary icon={Users} label="Known Citizens" value={profiles.data.length.toString()} />
        </section>

        <PlayerGrid
          title="Online"
          accent
          profiles={online}
          emptyText="No one is in the realm right now. The gates are open — be the first."
        />
        <PlayerGrid
          title="Offline"
          profiles={offline}
          emptyText="No departed citizens on record yet."
        />
      </main>
    </div>
  );
}

function Summary({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Icon className="h-8 w-8 text-zn-gold" />
        <div><p className="text-xs uppercase tracking-wide text-zn-parchment/45">{label}</p><p className="font-display text-3xl">{value}</p></div>
      </CardContent>
    </Card>
  );
}

function PlayerGrid({ title, profiles, emptyText, accent = false }: { title: string; profiles: PlayerProfile[]; emptyText: string; accent?: boolean }) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="font-display text-xl tracking-wide">{title}</h2>
        <span className={`rounded-full border border-zn-line px-2.5 py-0.5 text-xs ${accent ? "text-zn-emerald" : "text-zn-parchment/50"}`}>{profiles.length}</span>
        <div className="crest-rule flex-1" />
      </div>
      {profiles.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => (
            <Link key={profile.username} href={`/players/${encodeURIComponent(profile.username)}`} className="block rounded-lg border border-zn-line bg-zn-surface/80 p-4 transition hover:border-zn-gold/60">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Image src={profile.avatarUrl} alt={profile.username} width={56} height={56} className="rounded border border-zn-line" />
                  <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-zn-surface ${profile.online ? "bg-zn-emerald" : "bg-zn-parchment/30"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-lg tracking-wide">{profile.username}</p>
                    {profile.online
                      ? <span className="text-xs font-medium text-zn-emerald">Online</span>
                      : <span className="text-xs text-zn-parchment/45">Last seen {timeAgo(profile.stats?.lastSeenAt)}</span>}
                  </div>
                  {profile.professionId && profile.professionId !== "unassigned" ? (
                    <p className="text-sm text-zn-lightGold">{profile.professionId}</p>
                  ) : (
                    <p className="text-sm text-zn-parchment/40">No profession</p>
                  )}
                  {profile.townId ? <p className="mt-1 truncate text-xs text-zn-parchment/45">{profile.townId}{profile.nationId ? ` · ${profile.nationId}` : ""}</p> : null}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-sm">
                <span className="text-zn-parchment/70"><Coins className="mb-1 h-4 w-4 text-zn-gold" />{currency(profile.balance)}</span>
                <span className="text-zn-parchment/70">K/D<br />{profile.stats.kdRatio.toFixed(2)}</span>
                <span className="text-zn-parchment/70">Playtime<br />{Math.round(profile.playtimeMinutes / 60)}h</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card><CardContent className="text-sm text-zn-parchment/55">{emptyText}</CardContent></Card>
      )}
    </section>
  );
}
