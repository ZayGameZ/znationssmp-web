import Link from "next/link";
import { redirect } from "next/navigation";
import { Link2, ShieldCheck, UserCircle } from "lucide-react";
import { getAccountLinksForUser } from "@/lib/api/adapters/account-links";
import { getPlayerProfile } from "@/lib/api/adapters/players";
import { getCurrentUser } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const links = await getAccountLinksForUser(user.id);
  const activeLink = links.find((link) => link.status === "confirmed") ?? links.find((link) => link.status === "pending");
  const linked = activeLink?.status === "confirmed";
  // See dashboard-view.tsx: the `users` row's balance/playtime never update after
  // signup — the live numbers live on the plugin-pushed player_profiles row.
  const liveProfile = linked && activeLink ? (await getPlayerProfile(activeLink.minecraftName)).data : null;
  const balance = liveProfile?.balance ?? user.balance;
  const playtimeMinutes = liveProfile?.playtimeMinutes ?? user.playtimeMinutes;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">Website Account</p>
        <h1 className="text-4xl font-black uppercase">Account</h1>
      </div>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{user.username}</CardTitle><UserCircle className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <Row label="Role" value={user.role} />
            <Row label="Balance Snapshot" value={`$${balance.toLocaleString()}`} />
            <Row label="Playtime Snapshot" value={`${Math.round(playtimeMinutes / 60)}h`} />
            <div className="flex flex-wrap gap-2">{user.badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Minecraft Link</CardTitle><ShieldCheck className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent className="space-y-4">
            {activeLink ? (
              <div className="rounded border border-zn-line bg-black/40 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">{activeLink.status === "confirmed" ? "Linked" : "Waiting For In-Game Confirmation"}</p>
                <p className="mt-2 text-2xl font-black text-zn-lightGold">{activeLink.minecraftName}</p>
                <p className="mt-2 text-sm text-zinc-400">{activeLink.status === "pending" ? `Run /web confirm ${user.username} in game.` : "Your website account is linked."}</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No Minecraft account is linked yet.</p>
            )}
            <Button asChild variant="outline"><Link href="/account/link"><Link2 className="h-4 w-4" /> Link Minecraft Account</Link></Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-0"><span className="text-zinc-500">{label}</span><span className="text-right font-bold text-zinc-100">{value}</span></div>;
}
