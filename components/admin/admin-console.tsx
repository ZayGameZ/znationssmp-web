"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { Activity, Bell, CalendarClock, PlugZap, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Announcement, AuditLog, Event, IntegrationStatus, MarketItem, Profession, QueuedAction } from "@/types";

const tabs = ["Overview", "Content", "Market", "Professions", "Queue", "API Hooks", "Audit"] as const;

export function AdminConsole({
  announcements,
  events,
  items,
  professions,
  queuedActions,
  integrations,
  auditLogs,
  setupWarnings
}: {
  announcements: Announcement[];
  events: Event[];
  items: MarketItem[];
  professions: Profession[];
  queuedActions: QueuedAction[];
  integrations: IntegrationStatus[];
  auditLogs: AuditLog[];
  setupWarnings: string[];
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");

  return (
    <div className="grid gap-4 xl:grid-cols-[260px_1fr]">
      <Card>
        <CardContent className="space-y-2">
          {tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`w-full rounded px-3 py-2 text-left text-sm font-black uppercase ${tab === item ? "bg-zn-gold/18 text-zn-lightGold" : "text-zinc-400 hover:bg-white/5"}`}>{item}</button>)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{tab}</CardTitle>{setupWarnings.length ? <Badge>{setupWarnings.length} setup warnings</Badge> : <Badge>Release ready</Badge>}</CardHeader>
        <CardContent>{renderTab(tab, { announcements, events, items, professions, queuedActions, integrations, auditLogs, setupWarnings })}</CardContent>
      </Card>
    </div>
  );
}

function renderTab(tab: string, data: {
  announcements: Announcement[];
  events: Event[];
  items: MarketItem[];
  professions: Profession[];
  queuedActions: QueuedAction[];
  integrations: IntegrationStatus[];
  auditLogs: AuditLog[];
  setupWarnings: string[];
}) {
  if (tab === "Overview") return <Overview warnings={data.setupWarnings} announcements={data.announcements.length} events={data.events.length} queued={data.queuedActions.length} />;
  if (tab === "Content") return <Rows rows={[...data.announcements.map((item) => ["Announcement", item.title, item.pinned ? "Pinned" : "Published"]), ...data.events.map((item) => ["Event", item.title, item.active ? "Active" : "Scheduled"])]} />;
  if (tab === "Market") return <Rows rows={data.items.map((item) => [item.displayName, `$${item.buyPrice}`, `${item.stock} stock`])} />;
  if (tab === "Professions") return <Rows rows={data.professions.map((item) => [item.name, item.economyFocus, item.marketTags.join(", ")])} />;
  if (tab === "Queue") return <Rows rows={data.queuedActions.map((item) => [item.type, item.targetType, item.status])} />;
  if (tab === "API Hooks") return <ApiHooks integrations={data.integrations} warnings={data.setupWarnings} />;
  return <Rows rows={data.auditLogs.map((item) => [item.actor, item.action, item.status])} />;
}

function AdminMetric({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: number }) {
  return <div className="rounded border border-zn-line bg-black/35 p-4"><Icon className="mb-4 h-8 w-8 text-zn-gold" /><p className="text-xs uppercase text-zinc-500">{label}</p><p className="text-3xl font-black">{value}</p></div>;
}

function Overview({ warnings, announcements, events, queued }: { warnings: string[]; announcements: number; events: number; queued: number }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3"><AdminMetric icon={Bell} label="Announcements" value={announcements} /><AdminMetric icon={CalendarClock} label="Events" value={events} /><AdminMetric icon={Activity} label="Queued Actions" value={queued} /></div>
      <div className="rounded border border-zn-line bg-black/35 p-4">
        <p className="mb-3 flex items-center gap-2 font-black uppercase text-zn-lightGold"><TriangleAlert className="h-4 w-4" /> Setup Warnings</p>
        {warnings.length ? <ul className="space-y-2 text-sm text-zinc-300">{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p className="text-sm text-zinc-400">All required public release settings are configured.</p>}
      </div>
    </div>
  );
}

function ApiHooks({ integrations, warnings }: { integrations: IntegrationStatus[]; warnings: string[] }) {
  const endpoints = [
    "POST /api/ingest/server/status",
    "POST /api/ingest/server/players",
    "POST /api/ingest/player-stats",
    "POST /api/ingest/dynamicshop/items",
    "POST /api/ingest/dynamicshop/market",
    "POST /api/ingest/zprofessions/summary",
    "POST /api/ingest/bluemap",
    "POST /api/ingest/account-links/confirm",
    "GET /api/link/pending?minecraftName=<name>"
  ];
  return (
    <div className="space-y-4">
      <div className="rounded border border-zn-line bg-black/35 p-4">
        <p className="mb-3 flex items-center gap-2 font-black uppercase text-zn-lightGold"><PlugZap className="h-4 w-4" /> Server Push Endpoints</p>
        <div className="grid gap-2 md:grid-cols-2">{endpoints.map((endpoint) => <code key={endpoint} className="rounded border border-white/10 bg-black/40 p-2 text-xs text-zinc-300">{endpoint}</code>)}</div>
        {warnings.length ? <p className="mt-3 text-sm text-zn-lightGold">Fix setup warnings before connecting the Minecraft plugin.</p> : null}
      </div>
      <Rows rows={integrations.map((item) => [item.name, item.status, item.lastSync])} />
    </div>
  );
}

function Rows({ rows }: { rows: string[][] }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><tbody>{rows.map((row, index) => <tr key={index} className="border-t border-white/10">{row.map((cell) => <td key={cell} className="py-3 text-zinc-300">{cell}</td>)}</tr>)}</tbody></table></div>;
}
