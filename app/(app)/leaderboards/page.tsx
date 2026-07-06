import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteData } from "@/lib/mock-data";

export default function LeaderboardsPage() {
  return (
    <div className="space-y-4">
      <div><p className="text-sm font-black uppercase text-zn-gold">Civilization Rankings</p><h1 className="text-4xl font-black uppercase">Leaderboards</h1></div>
      <div className="grid gap-4 xl:grid-cols-3">
        {Object.entries(siteData.leaderboards).map(([key, rows]) => (
          <Card key={key}>
            <CardHeader><CardTitle>{key}</CardTitle></CardHeader>
            <CardContent className="space-y-3">{rows.map((row, index) => <div key={row.id} className="border-b border-white/10 pb-3 last:border-0"><p className="font-black"><span className="mr-3 text-zn-gold">{index + 1}</span>{row.name}</p><p className="text-zn-emerald">{row.value}</p><p className="text-xs text-zinc-500">{row.subtext}</p></div>)}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
