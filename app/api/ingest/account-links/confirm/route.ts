import { NextResponse } from "next/server";
import { readIngestEnvelope, requireIngestAuth, storeIngestSnapshot } from "@/lib/api/ingest";
import { withDb } from "@/lib/db/database";

type ConfirmPayload = {
  websiteUsername: string;
  minecraftName: string;
  minecraftUuid: string;
};

// Server plugin push after in-game confirmation: POST { sentAt, plugin, data: { websiteUsername, minecraftName, minecraftUuid } }
export async function POST(request: Request) {
  const auth = requireIngestAuth(request);
  if (auth) return auth;

  try {
    const envelope = await readIngestEnvelope<ConfirmPayload>(request);
    const { websiteUsername, minecraftName, minecraftUuid } = envelope.data;
    if (!websiteUsername || !minecraftName || !minecraftUuid) {
      return NextResponse.json({ error: "websiteUsername, minecraftName, and minecraftUuid are required." }, { status: 400 });
    }

    const confirmedAt = new Date().toISOString();
    const changed = await withDb(
      async (db) => {
        const result = await db
          .prepare(
            `UPDATE account_links
             SET status = 'confirmed', minecraft_uuid = ?, confirmed_at = ?
             WHERE lower(website_username) = lower(?) AND lower(minecraft_name) = lower(?) AND status = 'pending'`
          )
          .bind(minecraftUuid, confirmedAt, websiteUsername, minecraftName)
          .run();
        return Number((result.meta as { changes?: number }).changes ?? 0) > 0;
      },
      async () => false
    );

    if (!changed) return NextResponse.json({ error: "No pending link request matched this player." }, { status: 404 });
    const result = await storeIngestSnapshot("cache:account-links", { ...envelope, data: { ...envelope.data, confirmedAt } });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid link confirmation payload" }, { status: 400 });
  }
}
