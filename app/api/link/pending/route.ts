import { NextResponse } from "next/server";
import { requireIngestAuth } from "@/lib/api/ingest";
import { withDb, type DbRow } from "@/lib/db/database";
import { siteData } from "@/lib/mock-data";

type LinkRow = DbRow & {
  id: string;
  user_id: string;
  website_username: string;
  minecraft_name: string;
  minecraft_uuid?: string | null;
  status: "pending" | "confirmed" | "expired";
  requested_at: string;
  confirmed_at?: string | null;
  expires_at: string;
};

// Server plugin helper: GET /api/link/pending?minecraftName=Name using Authorization: Bearer <ZN_INGEST_SECRET>.
export async function GET(request: Request) {
  const auth = requireIngestAuth(request);
  if (auth) return auth;
  const minecraftName = new URL(request.url).searchParams.get("minecraftName")?.trim();
  if (!minecraftName) return NextResponse.json({ error: "minecraftName is required." }, { status: 400 });

  const link = await withDb(
    async (db) => {
      const row = await db
        .prepare(
          `SELECT * FROM account_links
           WHERE lower(minecraft_name) = lower(?) AND status = 'pending' AND expires_at::timestamptz > now()
           ORDER BY requested_at DESC LIMIT 1`
        )
        .bind(minecraftName)
        .first<LinkRow>();
      return row ? mapLink(row) : null;
    },
    async () => siteData.accountLinks.find((item) => item.minecraftName.toLowerCase() === minecraftName.toLowerCase() && item.status === "pending") ?? null
  );

  return NextResponse.json({ source: link ? "live" : "cache", data: link });
}

function mapLink(row: LinkRow) {
  return {
    id: row.id,
    userId: row.user_id,
    websiteUsername: row.website_username,
    minecraftName: row.minecraft_name,
    minecraftUuid: row.minecraft_uuid ?? undefined,
    status: row.status,
    requestedAt: row.requested_at,
    confirmedAt: row.confirmed_at ?? undefined,
    expiresAt: row.expires_at
  };
}
