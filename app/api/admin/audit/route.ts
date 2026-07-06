import { api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";

// Audit endpoint. Every admin mutation should append a D1 audit row in production.
export async function GET() {
  return api(siteData.auditLogs);
}
