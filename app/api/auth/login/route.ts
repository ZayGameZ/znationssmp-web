import { NextResponse } from "next/server";
import { getBootstrapUsers } from "@/lib/auth/bootstrap";
import { createSignedSession, sessionCookieName, sessionMaxAgeSeconds } from "@/lib/auth/session";
import { findUserByCredentials } from "@/lib/auth/users";
import type { User } from "@/types";

// Website auth endpoint. D1 users are checked first; env bootstrap accounts remain for first setup.
export async function POST(request: Request) {
  const { username, password } = await request.json();
  const d1User = await findUserByCredentials(String(username ?? ""), String(password ?? ""));
  if (d1User) return signedResponse(request, d1User);

  const adminUser = process.env.ZN_ADMIN_USERNAME ?? "owner";
  const adminPassword = process.env.ZN_ADMIN_PASSWORD ?? "change-this-owner-password";
  const playerUser = process.env.ZN_PLAYER_USERNAME ?? "zayden";
  const playerPassword = process.env.ZN_PLAYER_PASSWORD ?? "change-this-player-password";

  const isAdmin = username === adminUser && password === adminPassword;
  const isPlayer = username === playerUser && password === playerPassword;
  if (!isAdmin && !isPlayer) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const bootstrapUsers = getBootstrapUsers();
  const user = isAdmin ? bootstrapUsers[0] : bootstrapUsers[1];
  return signedResponse(request, user);
}

async function signedResponse(request: Request, user: User) {
  const response = NextResponse.json({ user });
  response.cookies.set(sessionCookieName(), await createSignedSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: sessionMaxAgeSeconds()
  });
  return response;
}
