"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Check, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Poll } from "@/types";

function formatCloseDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function PollCard({
  poll: initialPoll,
  isAuthenticated,
  href
}: {
  poll: Poll;
  isAuthenticated: boolean;
  href?: string;
}) {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [selected, setSelected] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const closed = poll.status === "closed";
  const hasVoted = Boolean(poll.votedOptionId);
  const showResults = closed || hasVoted || !isAuthenticated;

  async function submitVote() {
    if (!selected) {
      setError("Pick an option first.");
      return;
    }
    setLoading(true);
    setError("");
    const response = await fetch(`/api/polls/${poll.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: selected })
    });
    const body = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(body.error ?? "Could not record your vote.");
      return;
    }
    setPoll(body.data as Poll);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{href ? <Link href={href} className="transition hover:text-zn-lightGold">{poll.question}</Link> : poll.question}</CardTitle>
        {closed ? (
          <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-zn-parchment/50"><Lock className="h-3 w-3" /> Closed</span>
        ) : (
          <Badge>Open</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zn-parchment/45">
          <span className="uppercase tracking-wide text-zn-gold">{poll.category}</span>
          <span>{poll.totalVotes} vote{poll.totalVotes === 1 ? "" : "s"}</span>
          {poll.closesAt && !closed ? (
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> closes {formatCloseDate(poll.closesAt)}</span>
          ) : null}
        </div>

        {poll.description ? <p className="text-sm leading-6 text-zn-parchment/70">{poll.description}</p> : null}

        {showResults ? (
          <ResultBars poll={poll} />
        ) : (
          <div className="space-y-2">
            {poll.options.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded border px-3 py-3 text-sm transition ${
                  selected === option.id ? "border-zn-gold/60 bg-zn-gold/10" : "border-zn-line bg-black/30 hover:border-zn-gold/30"
                }`}
              >
                <input
                  type="radio"
                  name={`poll-${poll.id}`}
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => setSelected(option.id)}
                  className="accent-zn-gold"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {error ? <p className="text-sm text-zn-danger">{error}</p> : null}

        {!showResults ? (
          <Button onClick={submitVote} disabled={loading} className="w-full">
            <BarChart3 className="h-4 w-4" /> {loading ? "Casting…" : "Cast Vote"}
          </Button>
        ) : null}

        {!isAuthenticated && !closed ? (
          <p className="text-xs text-zn-parchment/50">
            <Link href="/login" className="font-medium text-zn-lightGold">Sign in</Link> to cast your vote.
          </p>
        ) : null}
        {hasVoted && !closed ? (
          <p className="inline-flex items-center gap-1 text-xs text-zn-emerald"><Check className="h-3 w-3" /> Your vote is counted.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ResultBars({ poll }: { poll: Poll }) {
  const total = poll.totalVotes || 0;
  return (
    <div className="space-y-2.5">
      {poll.options.map((option) => {
        const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
        const mine = poll.votedOptionId === option.id;
        return (
          <div key={option.id} className="rounded border border-zn-line bg-black/30 p-3">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className={mine ? "font-medium text-zn-lightGold" : "text-zn-parchment/80"}>
                {option.label} {mine ? <Check className="ml-1 inline h-3 w-3 text-zn-emerald" /> : null}
              </span>
              <span className="text-zn-parchment/60">{pct}% · {option.votes}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/50">
              <div className="h-full rounded-full bg-zn-gold/70" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
