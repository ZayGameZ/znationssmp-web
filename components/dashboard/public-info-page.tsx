import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InfoCard = {
  title: string;
  body: string;
  href?: string;
  action?: string;
};

type PublicInfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  cards: InfoCard[];
};

export function PublicInfoPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  cards
}: PublicInfoPageProps) {
  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] px-4 py-8 md:px-8">
        <section className="relative overflow-hidden rounded-lg border border-zn-line bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),linear-gradient(135deg,#111,#050505)] p-6 md:p-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded border border-zn-gold/35 bg-zn-gold/10 px-3 py-1 text-xs font-black uppercase text-zn-lightGold">
              <Icon className="h-4 w-4" /> {eyebrow}
            </div>
            <h1 className="text-4xl font-black uppercase md:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">{description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={primaryHref}>{primaryLabel}<ArrowRight className="h-4 w-4" /></Link>
              </Button>
              {secondaryHref && secondaryLabel ? (
                <Button asChild variant="outline">
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>
        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="min-h-20 text-sm leading-6 text-zinc-400">{card.body}</p>
                {card.href && card.action ? (
                  <Button asChild variant="ghost" className="mt-5 w-full justify-between">
                    <Link href={card.href}>{card.action}<ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
