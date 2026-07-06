import { basicIngest } from "@/lib/api/ingest";
import type { MapMarker } from "@/types";

// Bluemap/territory push: POST { sentAt, plugin, data: { mapUrl, markers, towns, nations } }
export async function POST(request: Request) {
  return basicIngest<{ mapUrl?: string; markers: MapMarker[] }>(request, "cache:bluemap");
}
