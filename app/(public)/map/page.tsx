import Image from "next/image";
import Link from "next/link";
import { Map } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { configuredUrl, getPublicConfig } from "@/lib/config/site";
import { siteData } from "@/lib/mock-data";

export default function MapPage() {
  const config = getPublicConfig();
  const hasLiveMap = configuredUrl(config.bluemapUrl);

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] px-4 py-10 md:px-8">
        <div className="mb-6">
          <span className="banner-tab"><Map className="h-3.5 w-3.5" /> Cartographer&apos;s Table</span>
          <h1 className="mt-4 font-display text-4xl tracking-wide md:text-6xl">The World Map</h1>
          <p className="mt-3 max-w-3xl text-zn-parchment/60">
            Explore the realm from above. Player positions and private locations are never exposed.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{hasLiveMap ? "Live Map" : "Territory Preview"}</CardTitle>
            {hasLiveMap ? <Button asChild variant="outline"><a href={config.bluemapUrl}>Open Full Map</a></Button> : null}
          </CardHeader>
          <CardContent>
            {hasLiveMap ? (
              <iframe src={config.bluemapUrl} title="ZNations live map" className="h-[68vh] min-h-[420px] w-full rounded border border-zn-line bg-black" />
            ) : (
              <div className="relative h-[68vh] min-h-[420px] overflow-hidden rounded border border-zn-line">
                <Image src="/backgrounds/map-preview.jpg" alt="ZNations map" fill className="object-cover" />
                {siteData.markers.map((marker) => (
                  <div key={marker.id} className="absolute -translate-x-1/2 -translate-y-1/2 rounded border border-black bg-black/80 px-3 py-2 text-xs font-medium text-zn-lightGold" style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
                    {marker.name}
                  </div>
                ))}
                <div className="absolute inset-x-4 bottom-4 rounded border border-zn-line bg-black/85 p-4 text-sm text-zn-parchment/75">
                  The live interactive map opens here soon. Until then, join the server and explore in person —{" "}
                  <Link href="/how-to-join" className="text-zn-lightGold">here&apos;s how</Link>.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
