"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import type { ApiResponse, DataSource, ServerSnapshot } from "@/types";

type LiveServerStatusCardProps = {
  initialServer: ServerSnapshot;
  initialSource?: DataSource;
};

function normalizeServer(data: ServerSnapshot): ServerSnapshot {
  return {
    online: Boolean(data.online),
    playersOnline: Number(data.playersOnline ?? 0),
    maxPlayers: Number(data.maxPlayers ?? 0),
    tps: Number(data.tps ?? 0),
    pingMs: Number(data.pingMs ?? 0),
    uptime: data.uptime || "Waiting for sync",
    lastSyncedAt: data.lastSyncedAt || "",
    stale: Boolean(data.stale)
  };
}

export function LiveServerStatusCard({ initialServer, initialSource = "offline" }: LiveServerStatusCardProps) {
  const [server, setServer] = useState<ServerSnapshot>(() => normalizeServer(initialServer));
  const [source, setSource] = useState<DataSource>(initialSource);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch(`/api/server/status?clientTs=${Date.now()}`, {
          cache: "no-store",
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as ApiResponse<ServerSnapshot>;
        if (cancelled) return;

        setServer(normalizeServer(payload.data));
        setSource(payload.source);
        setError("");
      } catch (fetchError) {
        if (cancelled) return;
        setError(fetchError instanceof Error ? fetchError.message : "Status unavailable");
      }
    }

    loadStatus();
    const interval = window.setInterval(loadStatus, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const tpsText = useMemo(() => {
    if (!Number.isFinite(server.tps)) return "0";
    return server.tps % 1 === 0 ? server.tps.toFixed(0) : server.tps.toFixed(2);
  }, [server.tps]);

  return (
    <Card className="bg-black/72">
      <CardHeader>
        <CardTitle>Server Status</CardTitle>
        <StatusPill online={server.online} />
      </CardHeader>
      <CardContent>
        <p className="text-sm uppercase text-zinc-400">Players Online</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-5xl font-black">
            {server.playersOnline}
            <span className="text-zinc-500"> / {server.maxPlayers}</span>
          </p>
          <div className="grid h-12 w-12 place-items-center rounded border border-zn-line bg-black/60 text-xs font-black text-zn-lightGold">ZN</div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-y border-zn-line py-4">
          <div>
            <p className="text-xs uppercase text-zinc-500">TPS</p>
            <p className="text-2xl font-black text-zn-emerald">{tpsText}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-zinc-500">Ping</p>
            <p className="text-2xl font-black text-zn-emerald">{server.pingMs}ms</p>
          </div>
        </div>
        <p className="mt-4 text-xs uppercase text-zinc-500">Uptime</p>
        <p className="text-2xl font-black">{server.uptime}</p>
        <p className="mt-2 text-xs uppercase text-zinc-500">Source: {source}</p>
        {error ? <p className="mt-2 text-xs text-red-300">Live refresh failed: {error}</p> : null}
        <Button asChild className="mt-5 w-full"><Link href="/how-to-join">Join The Adventure</Link></Button>
      </CardContent>
    </Card>
  );
}
