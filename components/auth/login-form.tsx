"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    setLoading(false);
    if (!response.ok) {
      setError("Invalid credentials. Register a website account or use the owner bootstrap account.");
      return;
    }
    // /dashboard reads cookies() (via getCurrentUser in its layout + page), so
    // Next.js already renders it dynamically on navigation — router.refresh()
    // here just forced a second, redundant full-tree re-fetch of the route
    // we're leaving before the first one had even resolved.
    router.push("/dashboard");
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader><CardTitle>Website Login</CardTitle><ShieldCheck className="h-5 w-5 text-zn-gold" /></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="rounded border border-zn-danger/50 bg-zn-danger/10 p-3 text-sm text-red-200">{error}</div>}
          <label className="block text-sm font-bold text-zinc-300">Username<Input className="mt-2" value={username} onChange={(event) => setUsername(event.target.value)} /></label>
          <label className="block text-sm font-bold text-zinc-300">Password<Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <Button className="w-full" disabled={loading}><LogIn className="h-4 w-4" /> {loading ? "Signing in" : "Sign In"}</Button>
        </form>
        <p className="mt-4 text-sm text-zinc-400">Need an account? <Link className="font-bold text-zn-lightGold" href="/register">Register here</Link>.</p>
      </CardContent>
    </Card>
  );
}
