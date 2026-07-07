"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, ScrollText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APPLICATION_ROLES } from "@/lib/community/applications";
import type { ApplicationRole } from "@/types";

export function ApplyForm() {
  const [role, setRole] = useState<ApplicationRole>(APPLICATION_ROLES[0].role);
  const [discord, setDiscord] = useState("");
  const [minecraft, setMinecraft] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const config = useMemo(() => APPLICATION_ROLES.find((entry) => entry.role === role)!, [role]);

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    // Client-side completeness check mirrors the server's requirement.
    const missing = config.questions.some((question) => !answers[question.key]?.trim());
    if (missing) {
      setError("Please answer every question before submitting.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        discordUsername: discord.trim() || undefined,
        minecraftUsername: minecraft.trim() || undefined,
        // Only send answers for the selected role's questions.
        answers: Object.fromEntries(config.questions.map((question) => [question.key, answers[question.key] ?? ""]))
      })
    });
    const body = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(body.error ?? "Could not submit your application.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-zn-emerald" />
          <h2 className="mt-4 font-display text-2xl tracking-wide">Application Received</h2>
          <p className="mt-2 text-sm text-zn-parchment/65">
            Thank you for applying to be a {config.title}. The staff will review your submission and reach out via Discord.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Staff Application</CardTitle><ScrollText className="h-5 w-5 text-zn-gold" /></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-bold text-zn-parchment/80">Which role are you applying for?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {APPLICATION_ROLES.map((entry) => (
                <button
                  type="button"
                  key={entry.role}
                  onClick={() => { setRole(entry.role); setAnswers({}); setError(""); }}
                  className={`rounded border p-4 text-left transition ${
                    role === entry.role ? "border-zn-gold/60 bg-zn-gold/10" : "border-zn-line bg-black/30 hover:border-zn-gold/30"
                  }`}
                >
                  <p className="font-display tracking-wide">{entry.title}</p>
                  <p className="mt-1 text-xs text-zn-parchment/55">{entry.blurb}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded border border-zn-line bg-black/25 p-3 text-xs text-zn-parchment/55">
            <p className="mb-1 font-bold uppercase tracking-wide text-zn-lightGold">What we look for</p>
            <ul className="list-inside list-disc space-y-0.5">
              {config.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zn-parchment/80">
              Discord username
              <Input className="mt-2" value={discord} onChange={(event) => setDiscord(event.target.value)} placeholder="yourname" />
            </label>
            <label className="block text-sm font-bold text-zn-parchment/80">
              Minecraft username
              <Input className="mt-2" value={minecraft} onChange={(event) => setMinecraft(event.target.value)} placeholder="YourIGN" />
            </label>
          </div>

          {config.questions.map((question) => (
            <label key={question.key} className="block text-sm font-bold text-zn-parchment/80">
              {question.label}
              {question.multiline ? (
                <textarea
                  className="mt-2 w-full rounded border border-zn-line bg-black/40 px-3 py-2 text-sm font-normal text-zn-parchment outline-none transition focus:border-zn-gold/60"
                  rows={4}
                  value={answers[question.key] ?? ""}
                  onChange={(event) => setAnswer(question.key, event.target.value)}
                  placeholder={question.placeholder}
                />
              ) : (
                <Input
                  className="mt-2"
                  value={answers[question.key] ?? ""}
                  onChange={(event) => setAnswer(question.key, event.target.value)}
                  placeholder={question.placeholder}
                />
              )}
            </label>
          ))}

          {error ? <p className="text-sm text-zn-danger">{error}</p> : null}

          <Button className="w-full" disabled={loading}>
            <Send className="h-4 w-4" /> {loading ? "Submitting…" : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
