import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { configuredUrl, getPublicConfig } from "@/lib/config/site";
import { siteData } from "@/lib/mock-data";

export default function MapPage() {
  const config = getPublicConfig();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">Bluemap Integration</p>
        <h1 className="text-4xl font-black uppercase">Live Map</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">Embeds Bluemap when configured and falls back to cached markers without exposing player coordinates.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{configuredUrl(config.bluemapUrl) ? "Live Bluemap" : "Territory Preview"}</CardTitle>
          {configuredUrl(config.bluemapUrl) ? <Button asChild variant="outline"><a href={config.bluemapUrl}>Open Bluemap</a></Button> : <Button asChild variant="outline"><Link href="/how-to-join">Map Setup Needed</Link></Button>}
        </CardHeader>
        <CardContent>
          {configuredUrl(config.bluemapUrl) ? (
            <iframe src={config.bluemapUrl} title="ZNations Bluemap" className="h-[68vh] min-h-[420px] w-full rounded border border-zn-line bg-black" />
          ) : (
            <div className="relative h-[68vh] min-h-[420px] overflow-hidden rounded border border-zn-line">
              <Image src="/backgrounds/map-preview.jpg" alt="ZNations map" fill className="object-cover" />
              {siteData.markers.map((marker) => (
                <div key={marker.id} className="absolute -translate-x-1/2 -translate-y-1/2 rounded border border-black bg-black/80 px-3 py-2 text-xs font-black uppercase text-zn-lightGold" style={{ left: `${marker.x}%`, top: `${marker.y}%`, boxShadow: `0 0 24px ${marker.color}` }}>
                  {marker.name}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
