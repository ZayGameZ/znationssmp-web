import { NextResponse } from "next/server";
import { accepted, api } from "@/lib/api/response";
import { createAnnouncement, getAnnouncements } from "@/lib/api/adapters/announcements";
import { writeAudit } from "@/lib/api/adapters/audit";
import { requireRole } from "@/lib/auth/session";
import { announcementInput } from "@/lib/validators/admin";

// Admin content endpoint — backed by Supabase (announcements table). Every
// successful publish also appends an audit row.
export async function GET() {
  return api(await getAnnouncements(), "cache");
}

export async function POST(request: Request) {
  const admin = await requireRole(["owner", "admin"]);
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = announcementInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid announcement.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const announcement = await createAnnouncement(parsed.data);
  if (!announcement) {
    return NextResponse.json({ error: "Announcement storage is not configured." }, { status: 503 });
  }

  await writeAudit({
    actor: admin.username,
    action: "announcement.publish",
    target: announcement.id,
    details: { title: announcement.title, pinned: announcement.pinned }
  });

  return accepted(announcement);
}
