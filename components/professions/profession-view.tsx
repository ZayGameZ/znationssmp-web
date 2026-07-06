import { BadgeDollarSign, ChartBar, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { siteData } from "@/lib/mock-data";
import { currency } from "@/lib/utils";

export function ProfessionView() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Shield} label="Active Professions" value={String(siteData.professions.length)} subtext="Economy profiles tracked" />
        <MetricCard icon={BadgeDollarSign} label="Profession Volume" value={currency(412450)} subtext="Tagged item volume" tone="emerald" />
        <MetricCard icon={TrendingUp} label="Top Synergy" value="Miner + Smith" subtext="Ores into premium gear" />
        <MetricCard icon={ChartBar} label="Your Path" value="Blacksmith" subtext="Gear and repair economy" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4 md:grid-cols-2">
          {siteData.professions.map((profession) => (
            <Card key={profession.id}>
              <CardHeader><CardTitle>{profession.name}</CardTitle><Badge style={{ borderColor: profession.color, color: profession.color }}>{profession.icon}</Badge></CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300">{profession.description}</p>
                <div className="mt-4 grid gap-3">
                  <List title="Perks" values={profession.perks} />
                  <List title="Market Tags" values={profession.marketTags} />
                  <List title="Restrictions" values={profession.restrictions} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle>Profession Leaderboard</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {siteData.leaderboards.professions.map((entry, index) => (
              <div key={entry.id} className="border-b border-white/10 pb-3 last:border-0">
                <p className="font-black"><span className="mr-3 text-zn-gold">{index + 1}</span>{entry.name}</p>
                <p className="text-sm text-zn-emerald">{entry.value}</p>
                <p className="text-xs text-zinc-500">{entry.subtext}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function List({ title, values }: { title: string; values: string[] }) {
  return <div><p className="mb-2 text-xs font-black uppercase text-zn-lightGold">{title}</p><div className="flex flex-wrap gap-2">{values.map((item) => <Badge key={item}>{item}</Badge>)}</div></div>;
}
