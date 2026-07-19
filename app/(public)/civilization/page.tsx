import { Crown, Landmark, Swords, Users } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCivilization, type CivNation, type CivTown } from "@/lib/api/adapters/civilization";

export const dynamic = "force-dynamic";

export default async function CivilizationPage() {
  const civ = await getCivilization();
  const townById = new Map(civ.towns.map((town) => [town.id, town]));
  const nationByTownId = new Map<number, CivNation>();
  for (const nation of civ.nations) {
    for (const townId of nation.memberTownIds) {
      nationByTownId.set(townId, nation);
    }
  }
  const sortedTowns = [...civ.towns].sort((a, b) => b.tier - a.tier || b.residents - a.residents);

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1320px] px-4 py-8 md:px-8">
        <section className="rounded-lg border border-zn-line bg-[linear-gradient(135deg,rgba(212,175,55,.16),transparent),#080808] p-6 md:p-10">
          <Badge><Landmark className="mr-2 h-3.5 w-3.5" /> Season 1 &mdash; Live from the server</Badge>
          <h1 className="mt-5 text-4xl font-black uppercase md:text-6xl">The Civilization</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
            Every town, nation, and war on ZNations SMP &mdash; synced straight from the world.
            Found a town, forge a nation, and write yourself into this page.
          </p>
        </section>

        {civ.wars.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-black uppercase text-red-400">
              <Swords className="h-5 w-5" /> Active Wars
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {civ.wars.map((war) => (
                <Card key={`${war.type}-${war.id}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black uppercase text-red-300">
                        {war.attacker} <span className="text-zinc-500">vs</span> {war.defender}
                      </p>
                      <Badge>{war.phase === "NOTICE" ? "War declared" : "Fighting"}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">
                      {war.type === "TOWN_WAR" ? "Town war" : "Nation war"} &middot; objective: {war.objective}
                    </p>
                    <p className="mt-1 text-sm italic text-zinc-500">&ldquo;{war.casusBelli}&rdquo;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="mt-5">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-black uppercase text-zn-lightGold">
            <Crown className="h-5 w-5" /> Nations
          </h2>
          {civ.nations.length === 0 ? (
            <EmptyState message="No nations yet. A Tier-5 town's mayor can found the first with /nation create." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {civ.nations.map((nation) => (
                <NationCard key={nation.id} nation={nation} townById={townById} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-5">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-black uppercase text-zn-lightGold">
            <Users className="h-5 w-5" /> Towns
          </h2>
          {sortedTowns.length === 0 ? (
            <EmptyState message="No towns yet. Place a bell and ring in the first with /town create." />
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zn-line text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                      <th className="px-5 py-3">Town</th>
                      <th className="px-5 py-3">Tier</th>
                      <th className="px-5 py-3">Residents</th>
                      <th className="px-5 py-3">Mayor</th>
                      <th className="px-5 py-3">Nation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTowns.map((town) => (
                      <TownRow key={town.id} town={town} nation={nationByTownId.get(town.id)} />
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

function NationCard({ nation, townById }: { nation: CivNation; townById: Map<number, CivTown> }) {
  const capital = townById.get(nation.capitalTownId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{nation.name}</CardTitle>
        <Badge>Level {nation.level}</Badge>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-zinc-300">
        <p>
          {nation.government} &middot; led by the {nation.leaderTitle}
          {capital ? ` of ${capital.name}` : ""}
        </p>
        <p>
          <span className="text-zn-lightGold">★ Capital:</span> {capital ? capital.name : "?"} &middot;{" "}
          {nation.memberTownIds.length} member town{nation.memberTownIds.length === 1 ? "" : "s"}
        </p>
        <p className="text-zn-gold">{nation.treasuryBalance.toLocaleString()} ZMarks in the treasury</p>
      </CardContent>
    </Card>
  );
}

function TownRow({ town, nation }: { town: CivTown; nation?: CivNation }) {
  return (
    <tr className="border-b border-zn-line/50 last:border-0">
      <td className="px-5 py-3 font-bold text-zn-parchment">{town.name}</td>
      <td className="px-5 py-3 text-zinc-300">
        {town.tier} &mdash; {town.tierName}
      </td>
      <td className="px-5 py-3 text-zinc-300">{town.residents}</td>
      <td className="px-5 py-3 text-zinc-300">{town.mayor}</td>
      <td className="px-5 py-3 text-zinc-300">
        {nation ? (
          <span className={nation.capitalTownId === town.id ? "text-zn-lightGold" : undefined}>
            {nation.capitalTownId === town.id ? "★ " : ""}
            {nation.name}
          </span>
        ) : (
          <span className="text-zinc-600">Independent</span>
        )}
      </td>
    </tr>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-zinc-400">{message}</CardContent>
    </Card>
  );
}
