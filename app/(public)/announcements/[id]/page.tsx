import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pin } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { AnnouncementBanner } from "@/components/community/announcement-banner";
import { Badge } from "@/components/ui/badge";
import { getAnnouncement } from "@/lib/api/adapters/announcements";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await getAnnouncement(id);
  if (!announcement) notFound();

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        <Link href="/announcements" className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-zn-parchment/60 transition hover:text-zn-lightGold">
          <ArrowLeft className="h-4 w-4" /> All Announcements
        </Link>

        <article className="mt-6">
          <AnnouncementBanner category={announcement.category} variant="hero" className="h-56 w-full md:h-72" />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge>{announcement.category}</Badge>
            {announcement.pinned ? (
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-zn-gold">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            ) : null}
            <span className="text-xs text-zn-parchment/40">{announcement.timeAgo}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl tracking-wide md:text-5xl">{announcement.title}</h1>
          <div className="crest-rule mt-5 w-32" />
          <div className="mt-6 whitespace-pre-line text-lg leading-8 text-zn-parchment/80">{announcement.body}</div>
        </article>
      </main>
    </div>
  );
}
