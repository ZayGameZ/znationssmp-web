import { accepted, api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";
import { queuedActionInput } from "@/lib/validators/admin";

// Queue endpoint for town/nation/shop actions while the Minecraft server or plugin API is offline.
export async function GET() {
  return api(siteData.queuedActions);
}

export async function POST(request: Request) {
  const parsed = queuedActionInput.parse(await request.json());
  return accepted({
    id: crypto.randomUUID(),
    userId: siteData.currentUser.id,
    status: "queued",
    createdAt: new Date().toISOString(),
    ...parsed
  });
}
