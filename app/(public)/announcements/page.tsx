import Link from "next/link";
import { Megaphone, Pin } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { AnnouncementBanner } from "@/components/community/announcement-banner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAnnouncements } from "@/lib/api/adapters/announcements";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="banner-tab"><Megaphone className="h-3.5 w-3.5" /> Dispatches</span>
          <h1 className="mt-4 font-display text-4xl tracking-wide md:text-6xl">Realm Announcements</h1>
          <div className="crest-rule mx-auto mt-4 w-40" />
          <p className="mt-5 max-w-2xl text-zn-parchment/70">
            News from the crown — season launches, plugin updates, and events. Straight from the ZNations staff.
          </p>
        </div>

        {announcements.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-12 text-center">
              <p className="font-display text-lg tracking-wide text-zn-lightGold">No dispatches yet</p>
              <p className="mt-2 text-sm text-zn-parchment/55">
                The first announcement will appear here once a staff member publishes one.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 space-y-4">
            {announcements.map((item) => (
              <Link key={item.id} href={`/announcements/${item.id}`} className="block">
                <Card className="transition hover:border-zn-gold/50">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <AnnouncementBanner category={item.category} className="h-32 w-full sm:h-24 sm:w-44 sm:shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{item.category}</Badge>
                        {item.pinned ? (
                          <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-zn-gold">
                            <Pin className="h-3 w-3" /> Pinned
                          </span>
                        ) : null}
                        <span className="text-xs text-zn-parchment/40">{item.timeAgo}</span>
                      </div>
                      <h2 className="mt-2 font-display text-xl tracking-wide">{item.title}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-zn-parchment/65">{item.body}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
