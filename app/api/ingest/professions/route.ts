import { basicIngest } from "@/lib/api/ingest";

// ZNationsBridge professions push: POST { sentAt, plugin, data: { profiles } }
// profiles: [{ uuid, name, primary, primaryTier, primaryPoints, secondary, secondaryTier, secondaryPoints }]
export async function POST(request: Request) {
  return basicIngest<Record<string, unknown>>(request, "cache:professions");
}
