import { withDb, type DbRow } from "@/lib/db/database";
import { siteData } from "@/lib/mock-data";
import type { ActionStatus, QueuedAction } from "@/types";

type QueuedActionRow = DbRow & {
  id: string;
  user_id: string;
  type: string;
  target_type: QueuedAction["targetType"];
  target_id?: string | null;
  status: ActionStatus;
  payload_json: string;
  created_at: string;
};

function mapQueuedAction(row: QueuedActionRow): QueuedAction {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    targetType: row.target_type,
    targetId: row.target_id ?? undefined,
    status: row.status,
    payload: JSON.parse(row.payload_json),
    createdAt: row.created_at
  };
}

export async function getQueuedActions(): Promise<QueuedAction[]> {
  return withDb(
    async (db) => {
      const rows = await db
        .prepare("SELECT * FROM queued_actions ORDER BY created_at DESC LIMIT 200")
        .all<QueuedActionRow>();
      return rows.results.map(mapQueuedAction);
    },
    async () => siteData.queuedActions
  );
}

export async function enqueueAction(input: {
  userId: string;
  type: string;
  targetType: QueuedAction["targetType"];
  targetId?: string;
  payload: Record<string, string | number | boolean>;
}): Promise<QueuedAction | null> {
  return withDb(
    async (db) => {
      const id = `q-${crypto.randomUUID()}`;
      await db
        .prepare(
          `INSERT INTO queued_actions (id, user_id, type, target_type, target_id, status, payload_json)
           VALUES (?, ?, ?, ?, ?, 'queued', ?)`
        )
        .bind(id, input.userId, input.type, input.targetType, input.targetId ?? null, JSON.stringify(input.payload))
        .run();
      const row = await db.prepare("SELECT * FROM queued_actions WHERE id = ?").bind(id).first<QueuedActionRow>();
      return row ? mapQueuedAction(row) : null;
    },
    async () => null
  );
}
