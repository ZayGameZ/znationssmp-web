import { NextResponse } from "next/server";
import { accepted, api } from "@/lib/api/response";
import { createPoll, getPolls } from "@/lib/api/adapters/polls";
import { writeAudit } from "@/lib/api/adapters/audit";
import { getCurrentUser, requireRole } from "@/lib/auth/session";
import { pollInput } from "@/lib/validators/community";

export async function GET() {
  const user = await getCurrentUser();
  return api(await getPolls(user?.id), "cache");
}

export async function POST(request: Request) {
  const admin = await requireRole(["owner", "admin"]);
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = pollInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid poll.", issues: parsed.error.flatten() }, { status: 400 });
  }

  // Guard against duplicate option labels — they make results ambiguous.
  const trimmed = parsed.data.options.map((option) => option.trim()).filter(Boolean);
  const unique = Array.from(new Set(trimmed.map((option) => option.toLowerCase())));
  if (trimmed.length < 2 || unique.length !== trimmed.length) {
    return NextResponse.json({ error: "Provide at least two distinct options." }, { status: 400 });
  }

  const poll = await createPoll({
    question: parsed.data.question,
    description: parsed.data.description,
    category: parsed.data.category,
    options: trimmed,
    closesAt: parsed.data.closesAt,
    createdBy: admin.id
  });
  if (!poll) return NextResponse.json({ error: "Poll storage is not configured." }, { status: 503 });

  await writeAudit({ actor: admin.username, action: "poll.create", target: poll.id, details: { question: poll.question } });
  return accepted(poll);
}
