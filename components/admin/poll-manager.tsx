"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Plus, Trash2, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Poll } from "@/types";

export function PollManager({ initial }: { initial: Poll[] }) {
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>(initial);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setOption(index: number, value: string) {
    setOptions((prev) => prev.map((option, i) => (i === index ? value : option)));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const cleaned = options.map((option) => option.trim()).filter(Boolean);
    if (cleaned.length < 2) {
      setError("Add at least two options.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, category, description, options: cleaned })
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Could not create the poll.");
      return;
    }
    setPolls((prev) => [payload.data as Poll, ...prev]);
    setQuestion("");
    setDescription("");
    setOptions(["", ""]);
    router.refresh();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader><CardTitle>Create Poll</CardTitle><Vote className="h-5 w-5 text-zn-gold" /></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {error ? <p className="rounded border border-zn-danger/40 bg-zn-danger/10 p-3 text-sm text-zn-danger">{error}</p> : null}
            <label className="block text-sm font-bold text-zinc-300">Question
              <Input className="mt-2" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Which event should we run next?" />
            </label>
            <label className="block text-sm font-bold text-zinc-300">Category
              <Input className="mt-2" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="general / events / economy" />
            </label>
            <label className="block text-sm font-bold text-zinc-300">Description (optional)
              <textarea
                className="mt-2 w-full rounded border border-zn-line bg-black/40 px-3 py-2 text-sm font-normal text-zn-parchment outline-none transition focus:border-zn-gold/60"
                rows={2}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <div>
              <p className="mb-2 text-sm font-bold text-zinc-300">Options</p>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={option} onChange={(event) => setOption(index, event.target.value)} placeholder={`Option ${index + 1}`} />
                    {options.length > 2 ? (
                      <button type="button" onClick={() => setOptions((prev) => prev.filter((_, i) => i !== index))} className="grid w-10 shrink-0 place-items-center rounded border border-zn-line text-zn-parchment/50 hover:text-zn-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              {options.length < 8 ? (
                <button type="button" onClick={() => setOptions((prev) => [...prev, ""])} className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-wide text-zn-gold">
                  <Plus className="h-3 w-3" /> Add option
                </button>
              ) : null}
            </div>
            <Button className="w-full" disabled={loading}><Plus className="h-4 w-4" /> {loading ? "Creating…" : "Create Poll"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Polls ({polls.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {polls.length === 0 ? (
            <p className="text-sm text-zn-parchment/55">No polls yet.</p>
          ) : (
            polls.map((poll) => (
              <div key={poll.id} className="border-b border-white/10 pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  {poll.status === "closed" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-zn-parchment/50"><Lock className="h-3 w-3" /> Closed</span>
                  ) : (
                    <Badge>Open</Badge>
                  )}
                  <span className="text-xs text-zn-parchment/40">{poll.totalVotes} votes</span>
                </div>
                <p className="mt-1 font-display tracking-wide">{poll.question}</p>
                <p className="text-xs text-zn-parchment/50">{poll.options.map((option) => `${option.label} (${option.votes})`).join(" · ")}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
