import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { q, one } from "./db";

export type Role = "admin" | "team" | "client";
export type User = { id: number; email: string; name: string; role: Role };
export type Client = { id: number; slug: string; name: string; short: string };

export const COOKIE = "nh_session";
const SESSION_DAYS = 90;
const INVITE_DAYS = 14;

export const hash = (t: string) => createHash("sha256").update(t).digest("hex");
const token = () => randomBytes(32).toString("base64url");

export async function currentUser(): Promise<User | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  return one<User>(
    `select u.id, u.email, u.name, u.role from sessions s join users u on u.id = s.user_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [hash(c)]
  );
}

export async function requireUser(): Promise<User> {
  const u = await currentUser();
  if (!u) redirect("/login");
  return u;
}

export async function requireAdmin(): Promise<User> {
  const u = await requireUser();
  if (u.role !== "admin") redirect("/clients");
  return u;
}

export async function clientsFor(u: User): Promise<Client[]> {
  if (u.role === "admin") return q<Client>(`select id, slug, name, short from clients order by sort, name`);
  return q<Client>(
    `select c.id, c.slug, c.name, c.short from clients c join memberships m on m.client_id = c.id
     where m.user_id = $1 order by c.sort, c.name`,
    [u.id]
  );
}

export async function clientFor(u: User, slug: string): Promise<Client | null> {
  const list = await clientsFor(u);
  return list.find((c) => c.slug === slug) ?? null;
}

export const canEdit = (u: User) => u.role === "admin" || u.role === "team";

export async function newInvite(userId: number): Promise<string> {
  const t = token();
  await q(`insert into invites (token_hash, user_id, expires_at) values ($1, $2, now() + interval '${INVITE_DAYS} days')`, [hash(t), userId]);
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "noisystudio.com.au";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/login/${t}`;
}

/** Uses an invite (single use) and starts a session. Returns false if the link is invalid. */
export async function acceptInvite(t: string): Promise<boolean> {
  const inv = await one<{ user_id: number }>(
    `update invites set used_at = now() where token_hash = $1 and used_at is null and expires_at > now() returning user_id`,
    [hash(t)]
  );
  if (!inv) return false;
  const s = token();
  await q(`insert into sessions (token_hash, user_id, expires_at) values ($1, $2, now() + interval '${SESSION_DAYS} days')`, [hash(s), inv.user_id]);
  (await cookies()).set(COOKIE, s, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return true;
}

export async function endSession() {
  const jar = await cookies();
  const c = jar.get(COOKIE)?.value;
  if (c) await q(`delete from sessions where token_hash = $1`, [hash(c)]);
  jar.delete(COOKIE);
}
