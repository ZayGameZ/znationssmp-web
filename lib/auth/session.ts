import { cookies } from "next/headers";
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

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const session = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const d1User = await findUserById(session.userId);
  if (d1User && d1User.role === session.role) return d1User;
  return siteData.users.find((user) => user.id === session.userId && user.role === session.role) ?? null;
}

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

async function hmac(value: string) {
  const secret = process.env.ZN_SESSION_SECRET ?? process.env.SESSION_SECRET ?? "change-this-session-secret";
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
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
