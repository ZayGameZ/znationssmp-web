import { basicIngest } from "@/lib/api/ingest";

// ZNationsBridge events push: POST { sentAt, plugin, data: { events } }
// events: [{ id, type, category, name, phase, startsAt, endsAt, budget, summary }]
export async function POST(request: Request) {
  return basicIngest<Record<string, unknown>>(request, "cache:events");
}
