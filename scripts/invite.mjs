// Create (or update) a user and print a single-use sign-in link.
// Usage: node scripts/invite.mjs you@example.com "Your Name" [admin|team|client]
import { createHash, randomBytes } from "node:crypto";
import { connect } from "./_db.mjs";
const [email, name = "", role = "admin"] = process.argv.slice(2);
if (!email) { console.error('Usage: node scripts/invite.mjs email "Name" [admin|team|client]'); process.exit(1); }
const c = await connect();
const { rows } = await c.query(
  `insert into users (email, name, role) values ($1, $2, $3) on conflict (email) do update set name = coalesce(nullif(excluded.name, ''), users.name), role = excluded.role returning id`,
  [email.toLowerCase(), name, role]);
const t = randomBytes(32).toString("base64url");
await c.query(`insert into invites (token_hash, user_id, expires_at) values ($1, $2, now() + interval '14 days')`, [createHash("sha256").update(t).digest("hex"), rows[0].id]);
const base = process.env.BASE_URL || "https://noisystudio.com.au";
console.log(`\nSign-in link for ${email} (${role}, single use, 14 days):\n${base}/login/${t}\n`);
await c.end();
