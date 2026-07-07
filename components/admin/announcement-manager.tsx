"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Bell, Pin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Announcement } from "@/types";

export function AnnouncementManager({ initial }: { initial: Announcement[] }) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initial);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Update");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, body, pinned })
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Could not publish the announcement.");
      return;
    }
    setAnnouncements((prev) => [payload.data as Announcement, ...prev]);
    setTitle("");
    setBody("");
    setPinned(false);
    router.refresh();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader><CardTitle>Publish Announcement</CardTitle><Bell className="h-5 w-5 text-zn-gold" /></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {error ? <p className="rounded border border-zn-danger/40 bg-zn-danger/10 p-3 text-sm text-zn-danger">{error}</p> : null}
            <label className="block text-sm font-bold text-zinc-300">Title
              <Input className="mt-2" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Season 2 Launches Friday" />
            </label>
            <label className="block text-sm font-bold text-zinc-300">Category
              <Input className="mt-2" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Season / Update / Patch / Event" />
            </label>
            <label className="block text-sm font-bold text-zinc-300">Body
              <textarea
                className="mt-2 w-full rounded border border-zn-line bg-black/40 px-3 py-2 text-sm font-normal text-zn-parchment outline-none transition focus:border-zn-gold/60"
                rows={5}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="What's happening in the realm…"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-zinc-300">
              <input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} className="accent-zn-gold" />
              Pin to top
            </label>
            <Button className="w-full" disabled={loading}><Plus className="h-4 w-4" /> {loading ? "Publishing…" : "Publish"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Published ({announcements.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {announcements.length === 0 ? (
            <p className="text-sm text-zn-parchment/55">No announcements yet.</p>
          ) : (
            announcements.map((item) => (
              <div key={item.id} className="border-b border-white/10 pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  <Badge>{item.category}</Badge>
                  {item.pinned ? <span className="inline-flex items-center gap-1 text-xs text-zn-gold"><Pin className="h-3 w-3" /> Pinned</span> : null}
                  <span className="text-xs text-zn-parchment/40">{item.timeAgo}</span>
                </div>
                <p className="mt-1 font-display tracking-wide">{item.title}</p>
                <p className="text-sm text-zn-parchment/60">{item.body}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
