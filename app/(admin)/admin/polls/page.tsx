import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PollManager } from "@/components/admin/poll-manager";
import { getPolls } from "@/lib/api/adapters/polls";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPollsPage() {
  const user = await getCurrentUser();
  if (!user || !["owner", "admin"].includes(user.role)) {
    redirect("/login?admin=login-required");
  }
  const polls = await getPolls(user.id);

  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-400 hover:text-zn-lightGold">
          <ArrowLeft className="h-4 w-4" /> Admin Console
        </Link>
        <div>
          <p className="text-sm font-black uppercase text-zn-gold">Community</p>
          <h1 className="text-4xl font-black uppercase">Polls</h1>
          <p className="mt-2 text-zinc-400">Put a question to the community. One vote per signed-in citizen.</p>
        </div>
        <PollManager initial={polls} />
    </div>
  );
}
