// Runs before the site starts. Never blocks startup: any error is logged and the site still starts.
// 1) creates tables  2) imports seed data the first time  3) prints a sign-in link for ADMIN_EMAIL until that admin has signed in once.
import { createHash, randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { connect } from "./_db.mjs";
try {
  if (!process.env.DATABASE_URL) { console.log("[bootstrap] No DATABASE_URL yet, skipping."); process.exit(0); }
  const c = await connect();
  const n = (await c.query("select count(*)::int as n from clients")).rows[0].n;
  if (n === 0 && process.env.SEED_KEY) {
    console.log("[bootstrap] Importing seed data…");
    execFileSync(process.execPath, [new URL("./import.mjs", import.meta.url).pathname], { stdio: "inherit" });
  }
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  if (email) {
    const u = (await c.query(
      `insert into users (email, name, role) values ($1, $2, 'admin') on conflict (email) do update set role = 'admin' returning id`,
      [email, process.env.ADMIN_NAME || ""])).rows[0];
    const s = (await c.query("select count(*)::int as n from sessions where user_id = $1", [u.id])).rows[0].n;
    if (s === 0) {
      const t = randomBytes(32).toString("base64url");
      await c.query(`insert into invites (token_hash, user_id, expires_at) values ($1, $2, now() + interval '2 days')`, [createHash("sha256").update(t).digest("hex"), u.id]);
      console.log(`[bootstrap] Admin sign-in link for ${email}: ${process.env.BASE_URL || "https://noisystudio.com.au"}/login/${t}`);
    }
  }
  await c.end();
} catch (e) {
  console.error("[bootstrap] failed:", e?.message || e);
}
