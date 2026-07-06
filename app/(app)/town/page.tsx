import { ManagementPanels } from "@/components/civilization/management-panels";
import { siteData } from "@/lib/mock-data";

export default function TownPage() {
  const user = siteData.currentUser;
  const town = siteData.towns.find((item) => item.id === user.townId) ?? siteData.towns[0];
  const nation = siteData.nations.find((item) => item.id === user.nationId) ?? siteData.nations[0];
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">Offline-Capable Civilization Tools</p>
        <h1 className="text-4xl font-black uppercase">Town Management</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">Edit town identity, taxes, and operational settings. Actions queue safely when the Minecraft server is offline.</p>
      </div>
      <ManagementPanels user={user} town={town} nation={nation} />
    </div>
  );
}
