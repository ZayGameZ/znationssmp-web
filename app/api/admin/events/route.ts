import { accepted, api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";

// Admin event endpoint. Future plugin sync should push approved events into ZNationsEvents/Diplomacy APIs.
export async function GET() {
  return api(siteData.events);
}

export async function POST(request: Request) {
  const payload = await request.json();
  return accepted({ id: crypto.randomUUID(), active: false, ...payload });
}
