import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  BarChart3,
  Boxes,
  Gem,
  Home,
  ListChecks,
  Map,
  Menu,
  UserCircle,
  Settings,
  Shield,
  Store,
  Trophy,
  Users
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import { siteData } from "@/lib/mock-data";
import { currency } from "@/lib/utils";

const nav = [
  ["Dashboard", "/dashboard", Home],
  ["Shop", "/shop", Store],
  ["Players", "/players", Users],
  ["Professions", "/professions", Shield],
  ["Live Map", "/map", Map],
  ["Transactions", "/transactions", ListChecks],
  ["Leaderboards", "/leaderboards", Trophy],
  ["Account", "/account", UserCircle],
  ["Admin", "/admin", Settings]
] as const;

const market = [
  ["Items", "/shop", Boxes],
  ["Categories", "/shop#categories", Gem],
  ["Economy", "/transactions", BarChart3],
  ["Player Shops", "/shop#players", Users]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const user = siteData.currentUser;
  const profession = siteData.professions.find((item) => item.id === user.professionId);

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-zn-line bg-black/90 p-4 backdrop-blur-xl xl:block">
        <Brand compact />
        <div className="mt-7 space-y-7">
          <NavGroup label="Overview" links={nav.slice(0, 1)} />
          <NavGroup label="Market" links={market} />
          <NavGroup label="Players" links={nav.slice(2, 5)} />
          <NavGroup label="Control" links={nav.slice(5)} />
        </div>
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="strategy-panel rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black">Server Status</p>
              <StatusPill online={siteData.server.online} />
            </div>
            <p className="text-xs text-zinc-400">Players Online</p>
            <p className="text-lg font-black">{siteData.server.playersOnline} / {siteData.server.maxPlayers}</p>
          </div>
          <p className="text-xs uppercase text-zinc-500">ZNations SMP Marketplace</p>
        </div>
      </aside>
      <main className="xl:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zn-line bg-black/86 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3 xl:hidden">
            <details className="group relative">
              <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded border border-zn-line bg-black/40 text-zinc-100">
                <Menu className="h-5 w-5" />
              </summary>
              <div className="absolute left-0 top-12 w-72 rounded border border-zn-line bg-black/95 p-3 shadow-panel">
                {[...nav, ...market].map(([name, href, Icon]) => (
                  <Link key={`${name}-${href}`} href={href} className="flex items-center gap-3 rounded px-3 py-3 text-sm font-bold text-zinc-300 hover:bg-zn-gold/10 hover:text-zn-lightGold">
                    <Icon className="h-4 w-4" />
                    {name}
                  </Link>
                ))}
              </div>
            </details>
            <Brand compact />
          </div>
          <div className="hidden text-sm text-zinc-400 xl:block">ZNATIONS SHOP - OFFICIAL MARKETPLACE OF ZNATIONS SMP</div>
          <div className="flex items-center gap-3">
            <Badge>{profession?.name ?? "Player"}</Badge>
            <div className="hidden text-right sm:block">
              <p className="font-black">{user.username}</p>
              <p className="text-xs text-zn-emerald">{currency(user.balance)}</p>
            </div>
            <Image src={user.avatarUrl} alt={user.username} width={42} height={42} className="rounded border border-zn-line" />
          </div>
        </header>
        <div className="mx-auto max-w-[1720px] px-4 py-5 md:px-8">{children}</div>
      </main>
    </div>
  );
}

function NavGroup({ label, links }: { label: string; links: readonly (readonly [string, string, ComponentType<{ className?: string }>])[] }) {
  return (
    <div>
      <p className="mb-2 px-3 text-xs font-black uppercase text-zinc-500">{label}</p>
      <div className="space-y-1">
        {links.map(([name, href, Icon]) => (
          <Link key={name} href={href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-zn-gold/10 hover:text-zn-lightGold">
            <Icon className="h-4 w-4" />
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
