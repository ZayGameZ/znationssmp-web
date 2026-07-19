import Image from "next/image";
import Link from "next/link";
import { Gamepad2, LayoutDashboard, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/layout/brand";
import { LogoutButton } from "@/components/layout/logout-button";
import { getCurrentUser } from "@/lib/auth/session";

// Browse links shown to everyone. Auth-specific entries (Login vs Dashboard)
// are appended based on session state so the public pages never look logged-out
// to a signed-in user.
const browseNav = [
  ["Home", "/"],
  ["How to Join", "/how-to-join"],
  ["Shop", "/shop"],
  ["Players", "/players"],
  ["Map", "/map"],
  ["Civilization", "/civilization"],
  ["Professions", "/professions"],
  ["Leaderboards", "/leaderboards"],
  ["News", "/announcements"],
  ["Polls", "/polls"],
  ["Apply", "/apply"]
] as const;

export async function PublicNav() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "owner" || user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-zn-line bg-black/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Brand compact />
        <nav className="hidden items-center gap-6 lg:flex">
          {browseNav.map(([item, href]) => (
            <Link key={item} href={href} className="text-[13px] uppercase tracking-[0.14em] text-zn-parchment/65 transition hover:text-zn-lightGold">
              {item}
            </Link>
          ))}
          {user ? (
            <Link href="/dashboard" className="text-[13px] uppercase tracking-[0.14em] text-zn-lightGold transition hover:text-zn-gold">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-[13px] uppercase tracking-[0.14em] text-zn-lightGold transition hover:text-zn-gold">
              Login
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image src={user.avatarUrl} alt={user.username} width={34} height={34} className="rounded border border-zn-line" />
                <span className="font-display text-sm tracking-wide text-zn-parchment">{user.username}</span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
              <Link href="/login"><Gamepad2 className="h-4 w-4" /> Sign In</Link>
            </Button>
          )}
          <details className="group relative lg:hidden">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded border border-zn-line bg-black/40 text-zn-parchment">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-12 w-72 rounded border border-zn-line bg-black/95 p-3 shadow-panel">
              {user ? (
                <div className="mb-2 flex items-center gap-2 border-b border-white/10 px-3 pb-3">
                  <Image src={user.avatarUrl} alt={user.username} width={30} height={30} className="rounded border border-zn-line" />
                  <span className="font-display text-sm tracking-wide">{user.username}</span>
                </div>
              ) : null}
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 rounded px-3 py-3 text-sm uppercase tracking-[0.14em] text-zn-lightGold hover:bg-zn-gold/10">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              ) : null}
              {isAdmin ? (
                <Link href="/admin" className="flex items-center gap-2 rounded px-3 py-3 text-sm uppercase tracking-[0.14em] text-zn-lightGold hover:bg-zn-gold/10">
                  <Shield className="h-4 w-4" /> Admin
                </Link>
              ) : null}
              {browseNav.map(([item, href]) => (
                <Link key={item} href={href} className="block rounded px-3 py-3 text-sm uppercase tracking-[0.14em] text-zn-parchment/70 hover:bg-zn-gold/10 hover:text-zn-lightGold">
                  {item}
                </Link>
              ))}
              <div className="mt-1 border-t border-white/10 px-3 pt-3">
                {user ? <LogoutButton /> : (
                  <Link href="/login" className="text-[13px] uppercase tracking-[0.14em] text-zn-lightGold">Login</Link>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
