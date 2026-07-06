import { basicIngest } from "@/lib/api/ingest";
import type { ServerSnapshot } from "@/types";

// Server plugin push: POST { sentAt, plugin, data: ServerSnapshot }
export async function POST(request: Request) {
  return basicIngest<ServerSnapshot>(request, "cache:server-status");
}
