import { Hammer, Medal } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProfessionProfiles, type ProfessionProfile } from "@/lib/api/adapters/game-feeds";

export const dynamic = "force-dynamic";

export default async function ProfessionsPage() {
  const profiles = await getProfessionProfiles();

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1320px] px-4 py-8 md:px-8">
        <section className="rounded-lg border border-zn-line bg-[linear-gradient(135deg,rgba(212,175,55,.16),transparent),#080808] p-6 md:p-10">
          <Badge><Hammer className="mr-2 h-3.5 w-3.5" /> Season 1 &mdash; Live from the server</Badge>
          <h1 className="mt-5 text-4xl font-black uppercase md:text-6xl">Professions</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
            Nine callings &mdash; Miner, Farmer, Lumberjack, Fisher, Hunter, Blacksmith, Brewer,
            Enchanter, and Merchant. Every mastery point below was earned in the world.
          </p>
        </section>

        <section className="mt-5">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-black uppercase text-zn-lightGold">
            <Medal className="h-5 w-5" /> Mastery Leaderboard
          </h2>
          {profiles.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-zinc-400">
                No professions chosen yet. Join the server and pick your calling with /profession —
                your name belongs on this board.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zn-line text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Player</th>
                      <th className="px-5 py-3">Profession</th>
                      <th className="px-5 py-3">Tier</th>
                      <th className="px-5 py-3">Points</th>
                      <th className="px-5 py-3">Secondary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile, index) => (
                      <ProfileRow key={profile.uuid} profile={profile} place={index + 1} />
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}

function ProfileRow({ profile, place }: { profile: ProfessionProfile; place: number }) {
  return (
    <tr className="border-b border-zn-line/50 last:border-0">
      <td className={`px-5 py-3 font-black ${place <= 3 ? "text-zn-lightGold" : "text-zinc-500"}`}>
        {place}
      </td>
      <td className="px-5 py-3 font-bold text-zn-parchment">{profile.name ?? profile.uuid.slice(0, 8)}</td>
      <td className="px-5 py-3 text-zinc-300">{pretty(profile.primary)}</td>
      <td className="px-5 py-3 text-zinc-300">{pretty(profile.primaryTier)}</td>
      <td className="px-5 py-3 text-zn-gold">{profile.primaryPoints.toLocaleString()}</td>
      <td className="px-5 py-3 text-zinc-400">
        {profile.secondary
          ? `${pretty(profile.secondary)} (${pretty(profile.secondaryTier)})`
          : "—"}
      </td>
    </tr>
  );
}

function pretty(value: string | null): string {
  if (!value) return "—";
  const lower = value.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
