import { NextResponse } from "next/server";
import { accepted, api } from "@/lib/api/response";
import { createEvent, getEvents } from "@/lib/api/adapters/events";
import { writeAudit } from "@/lib/api/adapters/audit";
import { requireRole } from "@/lib/auth/session";
import { eventInput } from "@/lib/validators/admin";

// Admin event endpoint — backed by Supabase (events table).
export async function GET() {
  return api(await getEvents(), "cache");
}

export async function POST(request: Request) {
  const admin = await requireRole(["owner", "admin"]);
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = eventInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const event = await createEvent(parsed.data);
  if (!event) return NextResponse.json({ error: "Event storage is not configured." }, { status: 503 });

  await writeAudit({
    actor: admin.username,
    action: "event.create",
    target: event.id,
    details: { title: event.title, active: event.active }
  });

  return accepted(event);
}
