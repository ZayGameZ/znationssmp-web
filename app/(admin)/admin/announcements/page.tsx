import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnnouncementManager } from "@/components/admin/announcement-manager";
import { getAnnouncements } from "@/lib/api/adapters/announcements";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAnnouncementsPage() {
  const user = await getCurrentUser();
  if (!user || !["owner", "admin"].includes(user.role)) {
    redirect("/login?admin=login-required");
  }
  const announcements = await getAnnouncements();

  return (
    <div className="min-h-screen bg-zn-black p-4 text-white md:p-8">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-400 hover:text-zn-lightGold">
          <ArrowLeft className="h-4 w-4" /> Admin Console
        </Link>
        <div>
          <p className="text-sm font-black uppercase text-zn-gold">Content</p>
          <h1 className="text-4xl font-black uppercase">Announcements</h1>
          <p className="mt-2 text-zinc-400">Publish news to the landing page, dashboards, and the public announcements feed.</p>
        </div>
        <AnnouncementManager initial={announcements} />
      </div>
    </div>
  );
}
