import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApplicationReview } from "@/components/admin/application-review";
import { getApplications } from "@/lib/api/adapters/applications";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminApplicationsPage() {
  const user = await getCurrentUser();
  if (!user || !["owner", "admin"].includes(user.role)) {
    redirect("/login?admin=login-required");
  }
  const applications = await getApplications();

  return (
    <div className="mx-auto max-w-[1100px] space-y-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-400 hover:text-zn-lightGold">
          <ArrowLeft className="h-4 w-4" /> Admin Console
        </Link>
        <div>
          <p className="text-sm font-black uppercase text-zn-gold">Community</p>
          <h1 className="text-4xl font-black uppercase">Staff Applications</h1>
          <p className="mt-2 text-zinc-400">Review submissions from the /apply page and set their status.</p>
        </div>
        <ApplicationReview initial={applications} />
    </div>
  );
}
