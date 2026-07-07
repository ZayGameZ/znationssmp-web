import { NextResponse } from "next/server";
import { api } from "@/lib/api/response";
import { castVote } from "@/lib/api/adapters/polls";
import { getCurrentUser } from "@/lib/auth/session";
import { voteInput } from "@/lib/validators/community";

const REASON_STATUS: Record<string, { status: number; message: string }> = {
  "not-configured": { status: 503, message: "Voting is not configured yet." },
  "not-found": { status: 404, message: "That poll no longer exists." },
  closed: { status: 409, message: "This poll is closed." },
  "bad-option": { status: 400, message: "That option isn't part of this poll." },
  "already-voted": { status: 409, message: "You've already voted in this poll." }
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });

  const { id } = await params;
  const parsed = voteInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Choose an option to vote." }, { status: 400 });

  const result = await castVote(id, parsed.data.optionId, user.id);
  if (!result.ok) {
    const mapped = REASON_STATUS[result.reason];
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }

  return api(result.poll, "live");
}
