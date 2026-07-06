import { basicIngest } from "@/lib/api/ingest";

// ZProfessions push: POST { sentAt, plugin, data: { professions, assignments, leaderboards, economy } }
export async function POST(request: Request) {
  return basicIngest<Record<string, unknown>>(request, "cache:zprofessions-summary");
}
