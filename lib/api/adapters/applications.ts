import { withDb } from "@/lib/db/database";
import type { ApplicationRole, ApplicationStatus, StaffApplication } from "@/types";

type ApplicationRow = {
  id: string;
  user_id: string | null;
  website_username: string | null;
  role: string;
  discord_username: string | null;
  minecraft_username: string | null;
  answers_json: string;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
};

function nowIso(): string {
  return new Date().toISOString().replace(/\.\d+Z$/, "Z");
}

function parseAnswers(raw: string): Record<string, string> {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, String(value)]));
  } catch {
    return {};
  }
}

function mapApplication(row: ApplicationRow): StaffApplication {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    websiteUsername: row.website_username ?? undefined,
    role: row.role as ApplicationRole,
    discordUsername: row.discord_username ?? undefined,
    minecraftUsername: row.minecraft_username ?? undefined,
    answers: parseAnswers(row.answers_json),
    status: row.status as ApplicationStatus,
    adminNotes: row.admin_notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function submitApplication(input: {
  role: ApplicationRole;
  discordUsername?: string;
  minecraftUsername?: string;
  answers: Record<string, string>;
  userId?: string;
  websiteUsername?: string;
}): Promise<StaffApplication | null> {
  return withDb(
    async (db) => {
      const id = `app-${crypto.randomUUID()}`;
      await db
        .prepare(
          `INSERT INTO staff_applications
             (id, user_id, website_username, role, discord_username, minecraft_username, answers_json, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`
        )
        .bind(
          id,
          input.userId ?? null,
          input.websiteUsername ?? null,
          input.role,
          input.discordUsername ?? null,
          input.minecraftUsername ?? null,
          JSON.stringify(input.answers)
        )
        .run();
      const row = await db.prepare("SELECT * FROM staff_applications WHERE id = ?").bind(id).first<ApplicationRow>();
      return row ? mapApplication(row) : null;
    },
    async () => null
  );
}

export async function getApplications(status?: ApplicationStatus): Promise<StaffApplication[]> {
  return withDb(
    async (db) => {
      const rows = status
        ? await db
            .prepare("SELECT * FROM staff_applications WHERE status = ? ORDER BY created_at DESC")
            .bind(status)
            .all<ApplicationRow>()
        : await db.prepare("SELECT * FROM staff_applications ORDER BY created_at DESC").all<ApplicationRow>();
      return rows.results.map(mapApplication);
    },
    async () => []
  );
}

export async function getApplication(id: string): Promise<StaffApplication | null> {
  return withDb(
    async (db) => {
      const row = await db.prepare("SELECT * FROM staff_applications WHERE id = ?").bind(id).first<ApplicationRow>();
      return row ? mapApplication(row) : null;
    },
    async () => null
  );
}

export async function updateApplication(
  id: string,
  input: { status: ApplicationStatus; adminNotes?: string }
): Promise<StaffApplication | null> {
  return withDb(
    async (db) => {
      const result = await db
        .prepare("UPDATE staff_applications SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?")
        .bind(input.status, input.adminNotes ?? "", nowIso(), id)
        .run();
      if (result.meta.changes === 0) return null;
      const row = await db.prepare("SELECT * FROM staff_applications WHERE id = ?").bind(id).first<ApplicationRow>();
      return row ? mapApplication(row) : null;
    },
    async () => null
  );
}
