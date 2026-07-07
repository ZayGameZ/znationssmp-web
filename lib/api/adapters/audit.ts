import { withDb } from "@/lib/db/database";
import { siteData } from "@/lib/mock-data";
import type { AuditLog } from "@/types";

type AuditRow = {
  id: string;
  actor_id: string;
  action: string;
  target: string;
  status: string;
  details_json: string;
  created_at: string;
};

/**
 * Append an audit row for an admin mutation. Best-effort: if no database is
 * configured the write is a no-op (returns false) rather than throwing, so a
 * missing audit table never blocks the actual admin action.
 */
export async function writeAudit(entry: {
  actor: string;
  action: string;
  target: string;
  status?: "success" | "failed";
  details?: Record<string, unknown>;
}): Promise<boolean> {
  return withDb(
    async (db) => {
      await db
        .prepare(
          `INSERT INTO audit_logs (id, actor_id, action, target, status, details_json)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          `al-${crypto.randomUUID()}`,
          entry.actor,
          entry.action,
          entry.target,
          entry.status ?? "success",
          JSON.stringify(entry.details ?? {})
        )
        .run();
      return true;
    },
    async () => false
  );
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return withDb(
    async (db) => {
      const rows = await db
        .prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100")
        .all<AuditRow>();
      return rows.results.map((row) => ({
        id: row.id,
        actor: row.actor_id,
        action: row.action,
        target: row.target,
        status: row.status === "failed" ? "failed" : "success",
        createdAt: row.created_at
      }));
    },
    async () => siteData.auditLogs
  );
}
