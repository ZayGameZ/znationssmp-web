"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const body = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(body.error ?? "Registration failed.");
      return;
    }
    router.push("/account/link");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader><CardTitle>Create Website Account</CardTitle><UserPlus className="h-5 w-5 text-zn-gold" /></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          {message ? <div className="rounded border border-zn-gold/40 bg-zn-gold/10 p-3 text-sm text-zn-lightGold">{message}</div> : null}
          <label className="block text-sm font-bold text-zinc-300">Username<Input className="mt-2" value={username} onChange={(event) => setUsername(event.target.value)} /></label>
          <label className="block text-sm font-bold text-zinc-300">Password<Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <Button className="w-full" disabled={loading}><UserPlus className="h-4 w-4" /> {loading ? "Creating" : "Create Account"}</Button>
        </form>
        <p className="mt-4 text-sm text-zinc-400">Already registered? <Link className="font-bold text-zn-lightGold" href="/login">Sign in</Link>.</p>
      </CardContent>
    </Card>
  );
}
