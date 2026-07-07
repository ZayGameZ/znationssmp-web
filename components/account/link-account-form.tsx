"use client";

import { useState, type FormEvent } from "react";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LinkAccountForm({ websiteUsername }: { websiteUsername: string }) {
  const [minecraftName, setMinecraftName] = useState("");
  const [message, setMessage] = useState("");
  const [pendingCommand, setPendingCommand] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setPendingCommand("");
    const response = await fetch("/api/account/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minecraftName })
    });
    const body = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(body.error ?? "Could not create link request.");
      return;
    }
    setMessage("Link request created — one step left.");
    setPendingCommand(`/web confirm ${websiteUsername}`);
  }

  return (
    <Card>
      <CardHeader><CardTitle>Link Minecraft Account</CardTitle><Link2 className="h-5 w-5 text-zn-gold" /></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          {message ? <div className="rounded border border-zn-gold/40 bg-zn-gold/10 p-3 text-sm text-zn-lightGold">{message}</div> : null}
          <label className="block text-sm font-bold text-zinc-300">
            Minecraft Username
            <Input className="mt-2" placeholder="Minecraft username" value={minecraftName} onChange={(event) => setMinecraftName(event.target.value)} />
          </label>
          <Button disabled={loading}>{loading ? "Creating Request" : "Create Link Request"}</Button>
        </form>
        {pendingCommand ? (
          <div className="mt-5 rounded border border-zn-line bg-black/40 p-4">
            <p className="text-xs font-black uppercase text-zinc-500">Next Step — In Game</p>
            <p className="mt-2 break-all text-xl font-black text-zn-lightGold">{pendingCommand}</p>
            <p className="mt-2 text-sm text-zinc-400">Join the server as {minecraftName || "your Minecraft account"} and run this command. Your link is verified against your real player identity — it expires after 24 hours if unused.</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
