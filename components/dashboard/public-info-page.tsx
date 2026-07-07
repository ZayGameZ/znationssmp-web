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
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] px-4 py-10 md:px-8">
        <section className="relative overflow-hidden rounded-lg border border-zn-line bg-[radial-gradient(circle_at_top_right,rgba(200,162,74,0.16),transparent_38%),linear-gradient(135deg,#17140d,#100f0c)] p-6 md:p-12">
          <div className="max-w-3xl">
            <span className="banner-tab"><Icon className="h-3.5 w-3.5" /> {eyebrow}</span>
            <h1 className="mt-5 font-display text-4xl tracking-wide md:text-6xl">{title}</h1>
            <div className="crest-rule mt-5 w-40" />
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zn-parchment/75">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
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
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="min-h-20 text-sm leading-6 text-zn-parchment/60">{card.body}</p>
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
