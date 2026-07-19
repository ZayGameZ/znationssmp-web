import { basicIngest } from "@/lib/api/ingest";

// ZNationsBridge civilization push: POST { sentAt, plugin, data: { towns, nations, wars } }
// towns:   [{ id, name, tier, tierName, residents, mayor, world }]
// nations: [{ id, name, government, leaderTitle, level, capitalTownId, memberTownIds, treasuryBalance }]
// wars:    [{ id, type, attacker, defender, phase, objective, casusBelli, activeEndsAt }]
export async function POST(request: Request) {
  return basicIngest<Record<string, unknown>>(request, "cache:civilization");
}
