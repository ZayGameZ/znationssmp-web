import { Vote } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Card, CardContent } from "@/components/ui/card";
import { PollCard } from "@/components/community/poll-card";
import { getPolls } from "@/lib/api/adapters/polls";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PollsPage() {
  const user = await getCurrentUser();
  const polls = await getPolls(user?.id);

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="banner-tab"><Vote className="h-3.5 w-3.5" /> The Council</span>
          <h1 className="mt-4 font-display text-4xl tracking-wide md:text-6xl">Community Polls</h1>
          <div className="crest-rule mx-auto mt-4 w-40" />
          <p className="mt-5 max-w-2xl text-zn-parchment/70">
            Your voice shapes the realm. Vote on server decisions, features, and events — one vote per citizen.
          </p>
        </div>

        {polls.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-12 text-center">
              <p className="font-display text-lg tracking-wide text-zn-lightGold">No polls open right now</p>
              <p className="mt-2 text-sm text-zn-parchment/55">
                When the staff put a decision to the community, it will appear here for your vote.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 space-y-4">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} isAuthenticated={Boolean(user)} href={`/polls/${poll.id}`} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
