"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Signs the user out (clears the session cookie) then returns them to the
 * public home. Shared by the public nav and the app shell so "log out" behaves
 * identically everywhere.
 */
export function LogoutButton({ className, label = "Log Out" }: { className?: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the network call fails, fall through to a refresh so the UI
      // re-renders against whatever session state actually remains.
    }
    // "/" reads cookies() via PublicNav, so it's already dynamically rendered
    // on navigation — see login-form.tsx for why refresh() is redundant here.
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.14em] text-zn-parchment/65 transition hover:text-zn-lightGold disabled:opacity-50",
        className
      )}
    >
      <LogOut className="h-4 w-4" /> {loading ? "…" : label}
    </button>
  );
}
