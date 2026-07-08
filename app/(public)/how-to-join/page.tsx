import Link from "next/link";
import { Copy, Gamepad2, Map, MessageCircle, Monitor, Smartphone, Users } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { configuredUrl, getPublicConfig } from "@/lib/config/site";

const XBOX_FRIEND_GAMERTAG = "ZInfiniteSMP";

export default function HowToJoinPage() {
  const config = getPublicConfig();

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1320px] px-4 py-8 md:px-8">
        <section className="rounded-lg border border-zn-line bg-[linear-gradient(135deg,rgba(212,175,55,.16),transparent),#080808] p-6 md:p-10">
          <Badge><Gamepad2 className="mr-2 h-3.5 w-3.5" /> Java and Bedrock Crossplay</Badge>
          <h1 className="mt-5 text-4xl font-black uppercase md:text-6xl">How To Join ZNations SMP</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
            Join the civilization server, connect with Discord, read the rules, and keep the live map nearby while you build your legacy.
          </p>
        </section>

        {config.setupWarnings.length ? (
          <div className="mt-4 rounded border border-zn-gold/40 bg-zn-gold/10 p-4 text-sm text-zn-lightGold">
            Some launch settings are still missing: {config.setupWarnings.join(" ")}
          </div>
        ) : null}

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <JoinCard icon={Monitor} title="Java Edition" address={config.javaAddress} lines={["Minecraft Java Edition", "Multiplayer", "Add Server"]} />
          <Card>
            <CardHeader><CardTitle>Bedrock Edition</CardTitle><Smartphone className="h-5 w-5 text-zn-gold" /></CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded border border-zn-gold/40 bg-zn-gold/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-zn-gold" />
                  <p className="text-xs font-black uppercase text-zn-lightGold">Easiest Way</p>
                </div>
                <p className="text-sm leading-6 text-zinc-300">
                  Add the Xbox gamertag <span className="font-black text-zn-lightGold">{XBOX_FRIEND_GAMERTAG}</span> as an Xbox friend, then join from the game&apos;s <span className="font-bold">Friends</span> tab &mdash; no server address to type in.
                </p>
                <ol className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li><span className="mr-3 text-zn-gold">1.</span>Sign in with Xbox Live on your device (required for Bedrock crossplay).</li>
                  <li><span className="mr-3 text-zn-gold">2.</span>Add <span className="font-bold text-zn-lightGold">{XBOX_FRIEND_GAMERTAG}</span> as a friend (Xbox app or in-game Friends &gt; Add Friend).</li>
                  <li><span className="mr-3 text-zn-gold">3.</span>Once accepted, open Minecraft &gt; Friends tab &gt; find {XBOX_FRIEND_GAMERTAG} under Xbox Live Friends &gt; Join.</li>
                </ol>
              </div>
              <div>
                <p className="mb-3 text-xs font-black uppercase text-zinc-500">Or Add The Server Manually</p>
                <div className="rounded border border-zn-line bg-black/40 p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">Server Address</p>
                  <p className="mt-2 break-all text-2xl font-black text-zn-lightGold">{`${config.bedrockAddress}:${config.bedrockPort}`}</p>
                </div>
                <ol className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li><span className="mr-3 text-zn-gold">1.</span>Minecraft Bedrock</li>
                  <li><span className="mr-3 text-zn-gold">2.</span>Servers</li>
                  <li><span className="mr-3 text-zn-gold">3.</span>Add External Server</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Discord</CardTitle><MessageCircle className="h-5 w-5 text-zn-gold" /></CardHeader>
            <CardContent>
              <p className="mb-5 text-sm leading-6 text-zinc-400">Use Discord for announcements, support, event coordination, and quick server updates.</p>
              <Button asChild variant={configuredUrl(config.discordUrl) ? "primary" : "outline"} className="w-full">
                {configuredUrl(config.discordUrl) ? <a href={config.discordUrl}>Open Discord</a> : <Link href="/discord">Discord Setup Needed</Link>}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Bluemap</CardTitle><Map className="h-5 w-5 text-zn-gold" /></CardHeader>
            <CardContent>
              <p className="mb-5 text-sm leading-6 text-zinc-400">Open the live world map when configured. Cached previews still show public town/nation context.</p>
              <Button asChild variant="outline" className="w-full">
                {configuredUrl(config.bluemapUrl) ? <a href={config.bluemapUrl}>Open Bluemap</a> : <Link href="/map">View Map Preview</Link>}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Before You Play</CardTitle><Copy className="h-5 w-5 text-zn-gold" /></CardHeader>
            <CardContent>
              <p className="mb-5 text-sm leading-6 text-zinc-400">Read the rules, create a website account, and link your Minecraft player when you are ready.</p>
              <Button asChild variant="outline" className="w-full"><Link href="/rules">Read Rules</Link></Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function JoinCard({ icon: Icon, title, address, lines }: { icon: typeof Monitor; title: string; address: string; lines: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><Icon className="h-5 w-5 text-zn-gold" /></CardHeader>
      <CardContent>
        <div className="rounded border border-zn-line bg-black/40 p-4">
          <p className="text-xs font-black uppercase text-zinc-500">Server Address</p>
          <p className="mt-2 break-all text-2xl font-black text-zn-lightGold">{address}</p>
        </div>
        <ol className="mt-5 space-y-3 text-sm text-zinc-300">
          {lines.map((line, index) => <li key={line}><span className="mr-3 text-zn-gold">{index + 1}.</span>{line}</li>)}
        </ol>
      </CardContent>
    </Card>
  );
}
