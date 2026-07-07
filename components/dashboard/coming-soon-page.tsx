import Link from "next/link";
import { Hammer, PlugZap } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ComingSoonPage({
  title,
  description,
  integration
}: {
  title: string;
  description: string;
  integration: string;
}) {
  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <section className="overflow-hidden rounded-lg border border-zn-line bg-[radial-gradient(circle_at_top,rgba(200,162,74,.14),transparent_44%),#141109] p-8 text-center md:p-14">
          <span className="banner-tab mx-auto"><Hammer className="h-3.5 w-3.5" /> Under Construction</span>
          <h1 className="mt-6 font-display text-4xl tracking-wide md:text-6xl">{title}</h1>
          <div className="crest-rule mx-auto mt-5 w-40" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zn-parchment/75">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><Link href="/how-to-join">How to Join</Link></Button>
            <Button asChild variant="outline"><Link href="/">Back to Home</Link></Button>
          </div>
        </section>
        <Card className="mt-5">
          <CardHeader><CardTitle>Not Connected Yet</CardTitle><PlugZap className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-zn-parchment/60">
              This page is intentionally parked until <span className="font-medium text-zn-lightGold">{integration}</span> is connected.
              It shows no mock controls or fake actions — when the data source is live, the real feature takes its place here.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
