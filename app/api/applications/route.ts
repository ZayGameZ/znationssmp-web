import { NextResponse } from "next/server";
import { accepted, api } from "@/lib/api/response";
import { getApplications, submitApplication } from "@/lib/api/adapters/applications";
import { writeAudit } from "@/lib/api/adapters/audit";
import { getCurrentUser, requireRole } from "@/lib/auth/session";
import { getApplicationRole } from "@/lib/community/applications";
import { applicationInput } from "@/lib/validators/community";
import type { ApplicationStatus } from "@/types";

// Admin-only listing (optionally filtered by ?status=).
export async function GET(request: Request) {
  const admin = await requireRole(["owner", "admin"]);
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const status = new URL(request.url).searchParams.get("status") as ApplicationStatus | null;
  const valid: ApplicationStatus[] = ["pending", "reviewing", "accepted", "rejected"];
  return api(await getApplications(status && valid.includes(status) ? status : undefined), "cache");
}

// Public submission — an account is optional but captured when present.
export async function POST(request: Request) {
  const parsed = applicationInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete every field.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const roleConfig = getApplicationRole(parsed.data.role);
  if (!roleConfig) return NextResponse.json({ error: "Unknown role." }, { status: 400 });

  // Every question for the chosen role must be answered.
  const missing = roleConfig.questions.filter((question) => !parsed.data.answers[question.key]?.trim());
  if (missing.length > 0) {
    return NextResponse.json({ error: "Please answer every question before submitting." }, { status: 400 });
  }

  const user = await getCurrentUser();
  const application = await submitApplication({
    role: parsed.data.role,
    discordUsername: parsed.data.discordUsername,
    minecraftUsername: parsed.data.minecraftUsername,
    answers: parsed.data.answers,
    userId: user?.id,
    websiteUsername: user?.username
  });
  if (!application) return NextResponse.json({ error: "Applications are not configured yet." }, { status: 503 });

  await writeAudit({
    actor: user?.username ?? "guest",
    action: "application.submit",
    target: application.id,
    details: { role: application.role }
  });

  return accepted(application);
}
