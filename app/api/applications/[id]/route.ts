import { NextResponse } from "next/server";
import { accepted } from "@/lib/api/response";
import { updateApplication } from "@/lib/api/adapters/applications";
import { writeAudit } from "@/lib/api/adapters/audit";
import { requireRole } from "@/lib/auth/session";
import { applicationReviewInput } from "@/lib/validators/community";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireRole(["owner", "admin"]);
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { id } = await params;
  const parsed = applicationReviewInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid review." }, { status: 400 });

  const application = await updateApplication(id, parsed.data);
  if (!application) return NextResponse.json({ error: "Application not found or storage unavailable." }, { status: 404 });

  await writeAudit({
    actor: admin.username,
    action: "application.review",
    target: application.id,
    details: { status: application.status }
  });

  return accepted(application);
}
