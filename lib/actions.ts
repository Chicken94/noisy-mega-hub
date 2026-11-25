"use server";
import { revalidatePath } from "next/cache";
import { requireUser, requireAdmin, clientsFor, canEdit, newInvite } from "./auth";
import { q, one } from "./db";

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 60) || "item";
const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);

/* ---------- tasks (admin + team) ---------- */
export async function toggleTask(taskId: number, done: boolean): Promise<{ ok: boolean }> {
  const u = await requireUser();
  if (!canEdit(u)) return { ok: false };
  const t = await one<{ client_id: number }>(`select p.client_id from tasks t join projects p on p.id = t.project_id where t.id = $1`, [taskId]);
  if (!t || !(await clientsFor(u)).some((c) => c.id === t.client_id)) return { ok: false };
  await q(`update tasks set done = $2, done_at = case when $2 then now() else null end, done_by = case when $2 then $3::int else null end where id = $1`, [taskId, done, u.id]);
  return { ok: true };
}

/* ---------- admin ---------- */
export type InviteState = { link?: string; error?: string; who?: string };

export async function createUser(_: InviteState, f: FormData): Promise<InviteState> {
  await requireAdmin();
  const email = str(f, "email", 200).toLowerCase();
  const name = str(f, "name", 120);
  const role = str(f, "role", 10);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Enter a valid email." };
  if (!["admin", "team", "client"].includes(role)) return { error: "Choose a role." };
  const u = await one<{ id: number }>(
    `insert into users (email, name, role) values ($1, $2, $3)
     on conflict (email) do update set name = excluded.name, role = excluded.role returning id`,
    [email, name, role]
  );
  const ids = f.getAll("clients").map((v) => Number(v)).filter(Boolean);
  await q(`delete from memberships where user_id = $1`, [u!.id]);
  for (const cid of ids) await q(`insert into memberships (user_id, client_id) values ($1, $2) on conflict do nothing`, [u!.id, cid]);
  revalidatePath("/admin");
  return { link: await newInvite(u!.id), who: name || email };
}

export async function inviteAgain(_: InviteState, f: FormData): Promise<InviteState> {
  await requireAdmin();
  const id = Number(f.get("id"));
  const u = await one<{ id: number; name: string; email: string }>(`select id, name, email from users where id = $1`, [id]);
  if (!u) return { error: "User not found." };
  return { link: await newInvite(u.id), who: u.name || u.email };
}

export async function removeUser(f: FormData) {
  const me = await requireAdmin();
  const id = Number(f.get("id"));
  if (id && id !== me.id) await q(`delete from users where id = $1`, [id]);
  revalidatePath("/admin");
}

export async function createClient(f: FormData) {
  await requireAdmin();
  const name = str(f, "name", 80);
  if (!name) return;
  const short = str(f, "short", 12) || name;
  await q(`insert into clients (slug, name, short) values ($1, $2, $3) on conflict (slug) do update set name = excluded.name, short = excluded.short`, [slugify(str(f, "slug", 40) || name), name, short]);
  revalidatePath("/admin");
}

export async function createProject(f: FormData) {
  await requireAdmin();
  const cid = Number(f.get("client"));
  const title = str(f, "title", 120);
  if (!cid || !title) return;
  await q(`insert into projects (client_id, slug, title) values ($1, $2, $3) on conflict (client_id, slug) do nothing`, [cid, slugify(title), title]);
  revalidatePath("/admin");
}

export async function addTask(f: FormData) {
  await requireAdmin();
  const pid = Number(f.get("project"));
  const title = str(f, "title", 300);
  if (!pid || !title) return;
  await q(
    `insert into tasks (project_id, group_title, title, detail, assignee, sort)
     values ($1, $2, $3, $4, $5, coalesce((select max(sort) + 1 from tasks where project_id = $1), 0))`,
    [pid, str(f, "group", 120), title, str(f, "detail", 2000), str(f, "assignee", 60)]
  );
  revalidatePath("/clients", "layout");
}

export async function deleteTask(f: FormData) {
  await requireAdmin();
  await q(`delete from tasks where id = $1`, [Number(f.get("id"))]);
  revalidatePath("/clients", "layout");
}

export async function addImages(f: FormData) {
  await requireAdmin();
  const pid = Number(f.get("project"));
  if (!pid) return;
  const caption = str(f, "caption", 120);
  for (const v of f.getAll("files")) {
    if (!(v instanceof File) || !v.size || v.size > 6_000_000 || !/^image\/(jpeg|png|webp|gif)$/.test(v.type)) continue;
    const buf = Buffer.from(await v.arrayBuffer());
    await q(`insert into assets (project_id, caption, mime, data, sort) values ($1, $2, $3, $4, coalesce((select max(sort) + 1 from assets where project_id = $1), 0))`,
      [pid, caption || v.name.replace(/\.[^.]+$/, ""), v.type, buf]);
  }
  revalidatePath("/clients", "layout");
}
