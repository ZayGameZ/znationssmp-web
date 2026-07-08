import { NextResponse } from "next/server";
import { accepted, api } from "@/lib/api/response";
import { enqueueAction, getQueuedActions } from "@/lib/api/adapters/queue";
import { getCurrentUser } from "@/lib/auth/session";
import { queuedActionInput } from "@/lib/validators/admin";

// Queue endpoint for town/nation/shop actions while the Minecraft server or plugin API is offline.
export async function GET() {
  return api(await getQueuedActions(), "cache");
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const parsed = queuedActionInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid queued action.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const action = await enqueueAction({ userId: user.id, ...parsed.data });
  if (!action) return NextResponse.json({ error: "Queue storage is not configured." }, { status: 503 });

  return accepted(action);
}
