import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  Home,
  Landmark,
  ListChecks,
  Map,
  Megaphone,
  Menu,
  ShieldCheck,
  UserCircle,
  Settings,
  Shield,
  Store,
  Trophy,
  Users,
  Vote
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import { getCurrentUser } from "@/lib/auth/session";
import { getGuestUser } from "@/lib/auth/bootstrap";
import { withKV } from "@/lib/cache/kv";
import { siteData } from "@/lib/mock-data";
import { currency } from "@/lib/utils";
import type { ServerSnapshot } from "@/types";

type NavLink = readonly [string, string, ComponentType<{ className?: string }>];

const realmNav: readonly NavLink[] = [
  ["Dashboard", "/dashboard", Home],
  ["Account", "/account", UserCircle],
  ["Live Map", "/map", Map]
];

const marketNav: readonly NavLink[] = [
  ["Shop", "/shop", Store],
  ["Transactions", "/transactions", ListChecks]
];

const peopleNav: readonly NavLink[] = [
  ["Players", "/players", Users],
  ["Professions", "/professions", Shield],
  ["Leaderboards", "/leaderboards", Trophy],
  ["Town & Nation", "/town", Landmark]
];

const communityNav: readonly NavLink[] = [
  ["Announcements", "/announcements", Megaphone],
  ["Polls", "/polls", Vote],
  ["Apply for Staff", "/apply", ShieldCheck]
];

export async function AppShell({ children }: { children: ReactNode }) {
  // Real signed-in user (falls back to a guest identity when not logged in).
  const user = (await getCurrentUser()) ?? getGuestUser();
  const isAdmin = user.role === "owner" || user.role === "admin";
  const server = await withKV<ServerSnapshot>("cache:server-status", async () => siteData.server);

  const adminNav: readonly NavLink[] = isAdmin ? [["Admin", "/admin", Settings]] : [];
  const allNav = [...realmNav, ...marketNav, ...peopleNav, ...communityNav, ...adminNav];

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-zn-line bg-black/85 p-4 backdrop-blur-xl xl:block">
        <Brand compact />
        <div className="mt-7 space-y-7">
          <NavGroup label="The Realm" links={realmNav} />
          <NavGroup label="Market" links={marketNav} />
          <NavGroup label="People" links={peopleNav} />
          <NavGroup label="Community" links={communityNav} />
          {isAdmin ? <NavGroup label="Crown" links={adminNav} /> : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="strategy-panel rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm tracking-wide">Server Status</p>
              <StatusPill online={server.data.online} />
            </div>
            <p className="text-xs uppercase tracking-wide text-zn-parchment/40">Players Online</p>
            <p className="font-display text-lg text-zn-lightGold">{server.data.playersOnline} / {server.data.maxPlayers}</p>
          </div>
          <p className="text-center text-[10px] uppercase tracking-[0.22em] text-zn-parchment/30">ZNations SMP</p>
        </div>
      </aside>
      <main className="xl:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zn-line bg-black/85 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3 xl:hidden">
            <details className="group relative">
              <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded border border-zn-line bg-black/40 text-zn-parchment">
                <Menu className="h-5 w-5" />
              </summary>
              <div className="absolute left-0 top-12 w-72 rounded border border-zn-line bg-black/95 p-3 shadow-panel">
                {allNav.map(([name, href, Icon]) => (
                  <Link key={`${name}-${href}`} href={href} className="flex items-center gap-3 rounded px-3 py-3 text-sm font-medium text-zn-parchment/75 hover:bg-zn-gold/10 hover:text-zn-lightGold">
                    <Icon className="h-4 w-4" />
                    {name}
                  </Link>
                ))}
              </div>
            </details>
            <Brand compact />
          </div>
          <div className="hidden text-xs uppercase tracking-[0.22em] text-zn-parchment/40 xl:block">The Realm Hub — ZNations SMP</div>
          <div className="flex items-center gap-3">
            <Badge>{user.role === "player" ? "Citizen" : user.role}</Badge>
            <div className="hidden text-right sm:block">
              <p className="font-display text-sm tracking-wide">{user.username}</p>
              <p className="text-xs text-zn-emerald">{currency(user.balance)}</p>
            </div>
            <Image src={user.avatarUrl} alt={user.username} width={42} height={42} className="rounded border border-zn-line" />
          </div>
        </header>
        <div className="mx-auto max-w-[1720px] px-4 py-6 md:px-8">{children}</div>
      </main>
    </div>
  );
}

function NavGroup({ label, links }: { label: string; links: readonly NavLink[] }) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.22em] text-zn-parchment/35">{label}</p>
      <div className="space-y-1">
        {links.map(([name, href, Icon]) => (
          <Link key={name} href={href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zn-parchment/75 transition hover:bg-zn-gold/10 hover:text-zn-lightGold">
            <Icon className="h-4 w-4" />
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
