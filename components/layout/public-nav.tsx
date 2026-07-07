import Link from "next/link";
import { Gamepad2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/layout/brand";

const nav = [
  ["Home", "/"],
  ["How to Join", "/how-to-join"],
  ["Shop", "/shop"],
  ["Players", "/players"],
  ["Map", "/map"],
  ["Professions", "/professions"],
  ["Leaderboards", "/leaderboards"],
  ["Rules", "/rules"],
  ["Login", "/login"]
] as const;

export function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zn-line bg-black/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Brand compact />
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([item, href]) => (
            <Link key={item} href={href} className="text-[13px] uppercase tracking-[0.14em] text-zn-parchment/65 transition hover:text-zn-lightGold">
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link href="/how-to-join">
              <Gamepad2 className="h-4 w-4" /> Play Now
            </Link>
          </Button>
          <details className="group relative lg:hidden">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded border border-zn-line bg-black/40 text-zn-parchment">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-12 w-72 rounded border border-zn-line bg-black/95 p-3 shadow-panel">
              {nav.map(([item, href]) => (
                <Link key={item} href={href} className="block rounded px-3 py-3 text-sm uppercase tracking-[0.14em] text-zn-parchment/70 hover:bg-zn-gold/10 hover:text-zn-lightGold">
                  {item}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
