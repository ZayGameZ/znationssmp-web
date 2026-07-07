import { ComingSoonPage } from "@/components/dashboard/coming-soon-page";

export default function LeaderboardsPage() {
  return (
    <ComingSoonPage
      embedded
      title="Leaderboards"
      description="Kills, riches, playtime, top towns, and cosmetic titles — the realm's rankings will live here once real player statistics sync from the server."
      integration="the ZNationsBridge player-stats feed (leaderboard snapshots)"
    />
  );
}
