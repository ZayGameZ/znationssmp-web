import { NextResponse } from "next/server";
import { createSignedSession, sessionCookieName, sessionMaxAgeSeconds } from "@/lib/auth/session";
import { createWebsiteUser } from "@/lib/auth/users";

const usernamePattern = /^[A-Za-z0-9_]{3,24}$/;

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  if (!usernamePattern.test(username)) {
    return NextResponse.json({ error: "Use 3-24 letters, numbers, or underscores for your username." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const user = await createWebsiteUser(username, password);
    if (!user) return NextResponse.json({ error: "Website account storage is not configured yet." }, { status: 503 });
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(sessionCookieName(), await createSignedSession(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: sessionMaxAgeSeconds()
    });
    return response;
  } catch {
    return NextResponse.json({ error: "That username is already registered." }, { status: 409 });
  }
}
