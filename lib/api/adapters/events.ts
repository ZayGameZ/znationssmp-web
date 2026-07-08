import { withDb, type DbRow } from "@/lib/db/database";
import { siteData } from "@/lib/mock-data";
import type { Event } from "@/types";

type EventRow = DbRow & {
  id: string;
  title: string;
  description: string;
  type: string;
  starts_at: string;
  ends_at?: string | null;
  active: number | boolean;
  reward?: string | null;
};

function mapEvent(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    active: Boolean(row.active),
    reward: row.reward ?? ""
  };
}

export async function getEvents(): Promise<Event[]> {
  return withDb(
    async (db) => {
      const rows = await db
        .prepare("SELECT * FROM events ORDER BY active DESC, starts_at DESC")
        .all<EventRow>();
      return rows.results.map(mapEvent);
    },
    async () => siteData.events
  );
}

export async function createEvent(input: {
  title: string;
  description: string;
  type: string;
  startsAt: string;
  endsAt?: string;
  active: boolean;
  reward?: string;
}): Promise<Event | null> {
  return withDb(
    async (db) => {
      const id = `e-${crypto.randomUUID()}`;
      await db
        .prepare(
          `INSERT INTO events (id, title, description, type, starts_at, ends_at, active, reward)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          id,
          input.title,
          input.description,
          input.type,
          input.startsAt,
          input.endsAt ?? null,
          input.active ? 1 : 0,
          input.reward ?? ""
        )
        .run();
      const row = await db.prepare("SELECT * FROM events WHERE id = ?").bind(id).first<EventRow>();
      return row ? mapEvent(row) : null;
    },
    async () => null
  );
}
