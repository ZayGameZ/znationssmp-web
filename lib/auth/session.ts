import { cache } from "react";
import { cookies } from "next/headers";
import { getBootstrapUsers } from "@/lib/auth/bootstrap";
import { findUserById } from "@/lib/auth/users";
import { siteData } from "@/lib/mock-data";
import type { Role, User } from "@/types";

const SESSION_COOKIE = "zn_session";
const encoder = new TextEncoder();
const maxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  role: Role;
  expiresAt: number;
};

// React.cache() de-dupes this per server request/render pass — every layout,
// page, and nested component on a route calls getCurrentUser() independently
// (that's the whole point: no prop-drilling the user around), but without this
// wrapper each of those calls re-parsed the cookie, re-verified the HMAC, and
// re-queried Postgres for the SAME user on the SAME request. A page like
// /account or /admin — which reads it once directly and once again via the
// shared layout — was paying for that chain twice before this existed.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const jar = await cookies();
  const session = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const d1User = await findUserById(session.userId);
  if (d1User && d1User.role === session.role) return d1User;
  const bootstrapUser = getBootstrapUsers().find((user) => user.id === session.userId && user.role === session.role);
  if (bootstrapUser) return bootstrapUser;
  return siteData.users.find((user) => user.id === session.userId && user.role === session.role) ?? null;
});

export async function requireRole(roles: Role[]) {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role)) return null;
  return user;
}

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export function sessionMaxAgeSeconds() {
  return maxAgeSeconds;
}

export async function createSignedSession(user: User) {
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + maxAgeSeconds * 1000
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmac(body);
  return `${body}.${signature}`;
}

async function readSession(value?: string): Promise<SessionPayload | null> {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;
  if ((await hmac(body)) !== signature) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    if (!parsed.userId || !parsed.role || parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

// The signing secret is a static env var for the life of the process, so the
// derived CryptoKey is safe to import once and reuse — every readSession()
// call (i.e. every getCurrentUser() call across every request this instance
// serves) was previously re-running importKey from scratch.
let hmacKeyPromise: Promise<CryptoKey> | null = null;
function getHmacKey(): Promise<CryptoKey> {
  if (!hmacKeyPromise) {
    const secret = process.env.ZN_SESSION_SECRET ?? process.env.SESSION_SECRET ?? "change-this-session-secret";
    hmacKeyPromise = crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  }
  return hmacKeyPromise;
}

async function hmac(value: string) {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return base64UrlEncode(Buffer.from(signature).toString("base64"));
}

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}
