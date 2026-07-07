import { withDb, type DbRow } from "@/lib/db/database";
import { siteData } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import type { Announcement } from "@/types";

type AnnouncementRow = DbRow & {
  id: string;
  title: string;
  body: string;
  category: string;
  pinned: number | boolean;
  published: number | boolean;
  created_at: string;
};

// The announcements table has no image column — the banner is derived from the
// category so admins never have to manage asset paths. Falls back to a neutral
// update image.
function imageForCategory(category: string): string {
  const key = category.toLowerCase();
  if (key.includes("season")) return "/backgrounds/news-season.jpg";
  if (key.includes("show") || key.includes("event") || key.includes("spotlight")) return "/backgrounds/news-showcase.jpg";
  return "/backgrounds/news-update.jpg";
}

function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    image: imageForCategory(row.category),
    timeAgo: timeAgo(row.created_at),
    pinned: Boolean(row.pinned)
  };
}

export async function getAnnouncements(limit = 50): Promise<Announcement[]> {
  return withDb(
    async (db) => {
      const rows = await db
        .prepare(
          "SELECT * FROM announcements WHERE published = 1 ORDER BY pinned DESC, created_at DESC LIMIT ?"
        )
        .bind(limit)
        .all<AnnouncementRow>();
      return rows.results.map(mapAnnouncement);
    },
    // No DB configured → seed data so the page still renders honestly in dev.
    async () => siteData.announcements.slice(0, limit)
  );
}

export async function getAnnouncement(id: string): Promise<Announcement | null> {
  return withDb(
    async (db) => {
      const row = await db
        .prepare("SELECT * FROM announcements WHERE id = ? AND published = 1")
        .bind(id)
        .first<AnnouncementRow>();
      return row ? mapAnnouncement(row) : null;
    },
    async () => siteData.announcements.find((item) => item.id === id) ?? null
  );
}

/**
 * Persist a new announcement. Returns the created record, or null when no
 * database is configured (so the API can surface an honest "not configured"
 * state instead of pretending the write succeeded).
 */
export async function createAnnouncement(input: {
  title: string;
  body: string;
  category: string;
  pinned: boolean;
}): Promise<Announcement | null> {
  return withDb(
    async (db) => {
      const id = `a-${crypto.randomUUID()}`;
      await db
        .prepare(
          `INSERT INTO announcements (id, title, body, category, pinned, published)
           VALUES (?, ?, ?, ?, ?, 1)`
        )
        .bind(id, input.title, input.body, input.category, input.pinned ? 1 : 0)
        .run();
      const row = await db.prepare("SELECT * FROM announcements WHERE id = ?").bind(id).first<AnnouncementRow>();
      return row ? mapAnnouncement(row) : null;
    },
    async () => null
  );
}
