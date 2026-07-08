import { api } from "@/lib/api/response";
import { getAuditLogs } from "@/lib/api/adapters/audit";

// Audit endpoint — backed by Supabase (audit_logs table), populated by writeAudit()
// calls from every admin mutation (announcements, events, polls, applications).
export async function GET() {
  return api(await getAuditLogs(), "cache");
}
