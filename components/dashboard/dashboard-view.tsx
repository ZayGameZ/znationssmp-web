import Image from "next/image";
import Link from "next/link";
import { Coins, Crown, Link2, Map, MessageCircle, ScrollText, Store, Trophy, Users } from "lucide-react";
import { LiveServerStatusCard } from "@/components/dashboard/live-server-status-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccountLinksForUser } from "@/lib/api/adapters/account-links";
import { configuredUrl, getPublicConfig } from "@/lib/config/site";
import { siteData } from "@/lib/mock-data";
import { currency } from "@/lib/utils";
import type { User } from "@/types";

const quickActions = [
  ["Link Minecraft", "/account/link", Link2],
  ["Open Shop", "/shop", Store],
  ["Live Map", "/map", Map],
  ["Leaderboards", "/leaderboards", Trophy],
  ["Players", "/players", Users],
  ["Rules", "/rules", ScrollText]
] as const;

export async function DashboardView({ user }: { user: User }) {
  const config = getPublicConfig();
  const links = await getAccountLinksForUser(user.id);
  const activeLink = links.find((link) => link.status === "confirmed") ?? links.find((link) => link.status === "pending");
  const linked = activeLink?.status === "confirmed";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-lg border border-zn-line">
        <Image src="/backgrounds/castle-hero.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/60 to-black/85" />
        <div className="relative grid gap-6 p-7 lg:grid-cols-[1fr_340px] lg:p-9">
          <div>
            <span className="banner-tab"><Crown className="h-3.5 w-3.5" /> {user.role === "player" ? "Citizen of the Realm" : user.role}</span>
            <h1 className="mt-4 font-display text-4xl tracking-wide md:text-5xl">
              Welcome, <span className="gold-title">{user.username}</span>
            </h1>
            <p className="mt-3 max-w-xl text-zn-parchment/75">
              {linked
                ? `Your account is bound to ${activeLink?.minecraftName}. The realm remembers your deeds.`
                : "Bind your Minecraft account to unlock your full place in the realm — stats, standing, and what comes next."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {!linked ? <Button asChild><Link href="/account/link"><Link2 className="h-4 w-4" /> Link Minecraft Account</Link></Button> : null}
              <Button asChild variant={linked ? "primary" : "outline"}>
                {configuredUrl(config.discordUrl) ? <a href={config.discordUrl}><MessageCircle className="h-4 w-4" /> Discord</a> : <Link href="/discord"><MessageCircle className="h-4 w-4" /> Discord</Link>}
              </Button>
            </div>
          </div>
          <LiveServerStatusCard initialServer={siteData.server} initialSource="offline" />
        </div>
      </section>

      {/* Standing */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Minecraft Link</CardTitle><Link2 className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent>
            {activeLink ? (
              <>
                <p className="font-display text-2xl text-zn-lightGold">{activeLink.minecraftName}</p>
                <p className="mt-2 text-sm text-zn-parchment/60">
                  {linked ? "Confirmed and bound to this account." : `Pending — join the server and run /web confirm ${user.username}`}
                </p>
                <Badge className="mt-3">{linked ? "Linked" : "Awaiting Confirmation"}</Badge>
              </>
            ) : (
              <>
                <p className="text-sm text-zn-parchment/60">No Minecraft account linked yet.</p>
                <Button asChild variant="outline" size="sm" className="mt-4"><Link href="/account/link">Start Linking</Link></Button>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Coin Purse</CardTitle><Coins className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent>
            <p className="font-display text-2xl text-zn-lightGold">{currency(user.balance)}</p>
            <p className="mt-2 text-sm text-zn-parchment/60">
              {linked ? "Balance syncs from the server as you play." : "Balance appears after your account is linked and the server syncs."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Time in the Realm</CardTitle><Trophy className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent>
            <p className="font-display text-2xl text-zn-lightGold">{Math.round(user.playtimeMinutes / 60)}h</p>
            <p className="mt-2 text-sm text-zn-parchment/60">
              {linked ? "Playtime recorded from server sessions." : "Playtime appears once your account is linked."}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-4 flex items-center gap-4">
          <h2 className="font-display text-xl tracking-wide">Quick Actions</h2>
          <div className="crest-rule flex-1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {quickActions.map(([label, href, Icon]) => (
            <Link key={label} href={href} className="strategy-panel group rounded-lg p-4 text-center transition hover:border-zn-gold/50">
              <Icon className="mx-auto h-6 w-6 text-zn-gold transition group-hover:text-zn-lightGold" />
              <p className="mt-2 text-sm font-medium text-zn-parchment/80 group-hover:text-zn-parchment">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dispatches + economy */}
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Realm Dispatches</CardTitle><ScrollText className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent>
            {siteData.announcements.length ? (
              <div className="space-y-3">
                {siteData.announcements.map((item) => (
                  <article key={item.id} className="border-b border-white/10 pb-3 last:border-0">
                    <p className="font-display tracking-wide">{item.title}</p>
                    <p className="text-sm text-zn-parchment/60">{item.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="No dispatches yet" body="Announcements from the crown will appear here once published." />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>The Market</CardTitle><Store className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent>
            <EmptyState title="Market ledger awaits" body="Live prices, trends, and trade history appear once the shop plugin syncs real market data." />
            <Button asChild variant="outline" size="sm" className="mt-4"><Link href="/shop">Browse the Shop</Link></Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded border border-zn-line bg-black/30 p-4"><p className="font-display text-sm tracking-wide text-zn-lightGold">{title}</p><p className="mt-1 text-sm text-zn-parchment/55">{body}</p></div>;
}
