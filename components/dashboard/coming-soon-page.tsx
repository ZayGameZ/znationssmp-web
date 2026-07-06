import Link from "next/link";
import { Construction, PlugZap } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <section className="rounded-lg border border-zn-line bg-[radial-gradient(circle_at_top,rgba(212,175,55,.16),transparent_36%),#080808] p-6 md:p-10">
          <Badge className="mb-5"><Construction className="mr-2 h-3.5 w-3.5" /> Coming Soon</Badge>
          <h1 className="text-4xl font-black uppercase md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">{description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild><Link href="/how-to-join">How To Join</Link></Button>
            <Button asChild variant="outline"><Link href="/shop">Open Shop</Link></Button>
          </div>
        </section>
        <Card className="mt-5">
          <CardHeader><CardTitle>Not Connected Yet</CardTitle><PlugZap className="h-5 w-5 text-zn-gold" /></CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-zinc-400">
              This page is intentionally parked until <span className="font-bold text-zn-lightGold">{integration}</span> is connected.
              It is not showing mock controls or fake player actions in the public release.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
