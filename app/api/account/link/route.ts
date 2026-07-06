import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { withD1 } from "@/lib/db/d1";

const minecraftNamePattern = /^[A-Za-z0-9_]{3,16}$/;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });
  const body = await request.json();
  const minecraftName = String(body.minecraftName ?? "").trim();
  if (!minecraftNamePattern.test(minecraftName)) {
    return NextResponse.json({ error: "Enter a valid Minecraft username." }, { status: 400 });
  }

  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const link = {
    id: `link-${crypto.randomUUID()}`,
    userId: user.id,
    websiteUsername: user.username,
    minecraftName,
    status: "pending" as const,
    requestedAt: now.toISOString(),
    expiresAt: expires.toISOString()
  };

  const stored = await withD1(
    async (db) => {
      await db
        .prepare(
          `INSERT INTO account_links (id, user_id, website_username, minecraft_name, status, requested_at, expires_at)
           VALUES (?, ?, ?, ?, 'pending', ?, ?)`
        )
        .bind(link.id, link.userId, link.websiteUsername, link.minecraftName, link.requestedAt, link.expiresAt)
        .run();
      return true;
    },
    async () => false
  );

  if (!stored) return NextResponse.json({ error: "Account linking storage is not configured yet." }, { status: 503 });
  return NextResponse.json({ data: link, message: `Join the server as ${minecraftName} and run /web confirm ${user.username}.` }, { status: 202 });
}
