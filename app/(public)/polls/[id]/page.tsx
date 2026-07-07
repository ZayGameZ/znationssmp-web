import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { PollCard } from "@/components/community/poll-card";
import { getPoll } from "@/lib/api/adapters/polls";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const poll = await getPoll(id, user?.id);
  if (!poll) notFound();

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-2xl px-4 py-12 md:px-8">
        <Link href="/polls" className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-zn-parchment/60 transition hover:text-zn-lightGold">
          <ArrowLeft className="h-4 w-4" /> All Polls
        </Link>
        <div className="mt-6">
          <PollCard poll={poll} isAuthenticated={Boolean(user)} />
        </div>
      </main>
    </div>
  );
}
