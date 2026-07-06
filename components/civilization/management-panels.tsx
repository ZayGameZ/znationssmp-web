"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { Banknote, Castle, Landmark, ScrollText, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { queueClientAction } from "@/lib/queue/actions";
import { currency } from "@/lib/utils";
import type { Nation, Town, User } from "@/types";

export function ManagementPanels({ user, town, nation }: { user: User; town: Town; nation: Nation }) {
  const [townName, setTownName] = useState(town.name);
  const [tax, setTax] = useState(String(town.taxRate));
  const [nationName, setNationName] = useState(nation.name);
  const [message, setMessage] = useState<string | null>(null);

  async function queue(type: string, targetType: "town" | "nation", targetId: string, payload: Record<string, string | number | boolean>) {
    const action = await queueClientAction({ userId: user.id, type, targetType, targetId, payload });
    setMessage(`Queued ${type}: ${action.id.slice(0, 8)}`);
  }

  return (
    <div className="space-y-4">
      {message && <div className="rounded border border-zn-emerald/40 bg-zn-emerald/10 p-3 text-sm font-bold text-zn-emerald">{message}</div>}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Info icon={Castle} label="Town" value={town.name} subtext={`${town.members} members`} />
        <Info icon={Landmark} label="Nation" value={nation.name} subtext={`${nation.towns} towns`} />
        <Info icon={Banknote} label="Town Bank" value={currency(town.bank)} subtext={`${town.taxRate}% tax`} />
        <Info icon={Shield} label="Nation Power" value={String(nation.power)} subtext={nation.status} />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Town Management</CardTitle><Badge>Offline Queue Enabled</Badge></CardHeader>
          <CardContent className="space-y-4">
            <label className="block text-sm font-bold text-zinc-300">Town Name<Input className="mt-2" value={townName} onChange={(event) => setTownName(event.target.value)} /></label>
            <label className="block text-sm font-bold text-zinc-300">Town Tax Rate<Input className="mt-2" value={tax} onChange={(event) => setTax(event.target.value)} /></label>
            <Button onClick={() => queue("update-town-settings", "town", town.id, { name: townName, taxRate: Number(tax) })}>Queue Town Update</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Nation Management</CardTitle><Badge>Diplomacy Ready</Badge></CardHeader>
          <CardContent className="space-y-4">
            <label className="block text-sm font-bold text-zinc-300">Nation Name<Input className="mt-2" value={nationName} onChange={(event) => setNationName(event.target.value)} /></label>
            <label className="block text-sm font-bold text-zinc-300">Diplomacy Note<Input className="mt-2" placeholder="Treaty terms, rival note, or recruitment message" /></label>
            <Button onClick={() => queue("update-nation-settings", "nation", nation.id, { name: nationName })}>Queue Nation Update</Button>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Queued Civilization Actions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded border border-zn-line bg-black/35 p-3">
            <ScrollText className="mt-1 h-5 w-5 text-zn-gold" />
            <div><p className="font-black">Actions remain usable offline</p><p className="text-sm text-zinc-400">Town and nation writes are recorded locally and through `/api/queue`; a future plugin worker can sync them when the server is online.</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ icon: Icon, label, value, subtext }: { icon: ComponentType<{ className?: string }>; label: string; value: string; subtext: string }) {
  return <Card><CardContent className="flex items-center gap-4"><Icon className="h-9 w-9 text-zn-gold" /><div><p className="text-xs uppercase text-zinc-500">{label}</p><p className="text-2xl font-black">{value}</p><p className="text-sm text-zinc-400">{subtext}</p></div></CardContent></Card>;
}
