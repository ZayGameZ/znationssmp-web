import { ManagementPanels } from "@/components/civilization/management-panels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteData } from "@/lib/mock-data";

export default function NationPage() {
  const user = siteData.currentUser;
  const town = siteData.towns.find((item) => item.id === user.townId) ?? siteData.towns[0];
  const nation = siteData.nations.find((item) => item.id === user.nationId) ?? siteData.nations[0];
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">Diplomacy Ready</p>
        <h1 className="text-4xl font-black uppercase">Nation Management</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">Nation overview, diplomacy context, and queued administration for the upcoming towns and nations plugin.</p>
      </div>
      <ManagementPanels user={user} town={town} nation={nation} />
      <Card>
        <CardHeader><CardTitle>Diplomacy Overview</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {siteData.diplomacy.map((relation) => (
            <div key={relation.id} className="rounded border border-zn-line bg-black/35 p-4">
              <p className="font-black">{relation.sourceNationId} to {relation.targetNationId}</p>
              <p className="text-zn-lightGold">{relation.type}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
