// Import encrypted seed files (seed/*.enc) into the database. Safe to run again: it updates, it doesn't duplicate.
// Needs SEED_KEY (in Replit Secrets). Usage: node scripts/import.mjs
import { readFileSync, readdirSync } from "node:fs";
import { createDecipheriv } from "node:crypto";
import { connect } from "./_db.mjs";
const key = process.env.SEED_KEY;
if (!key) { console.error("SEED_KEY is not set."); process.exit(1); }
const dir = new URL("../seed/", import.meta.url);
const c = await connect();
for (const f of readdirSync(dir).filter((n) => n.endsWith(".enc"))) {
  const buf = readFileSync(new URL(f, dir));
  const d = createDecipheriv("aes-256-gcm", Buffer.from(key, "base64"), buf.subarray(0, 12));
  d.setAuthTag(buf.subarray(12, 28));
  const data = JSON.parse(Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString("utf8"));
  const cl = (await c.query(
    `insert into clients (slug, name, short, sort) values ($1, $2, $3, $4) on conflict (slug) do update set name = excluded.name, short = excluded.short returning id`,
    [data.client.slug, data.client.name, data.client.short, data.client.sort ?? 0])).rows[0].id;
  for (const [pi, p] of (data.projects || []).entries()) {
    const pid = (await c.query(
      `insert into projects (client_id, slug, title, kind, brief, links, sort) values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (client_id, slug) do update set title = excluded.title, kind = excluded.kind, brief = excluded.brief, links = excluded.links, sort = excluded.sort returning id`,
      [cl, p.slug, p.title, p.kind || "Revisions", p.brief || "", JSON.stringify(p.links || []), pi])).rows[0].id;
    for (const [ti, t] of (p.tasks || []).entries()) {
      await c.query(
        `insert into tasks (project_id, ext_key, group_title, title, detail, assignee, done, done_at, sort) values ($1,$2,$3,$4,$5,$6,$7, case when $7 then now() end, $8)
         on conflict (project_id, ext_key) do update set group_title = excluded.group_title, title = excluded.title, detail = excluded.detail, assignee = excluded.assignee, sort = excluded.sort`,
        [pid, t.key, t.group || "", t.title, t.detail || "", t.who || "", !!t.done, ti]);
    }
    if (p.images?.length) {
      await c.query(`delete from assets where project_id = $1`, [pid]);
      for (const [ii, im] of p.images.entries())
        await c.query(`insert into assets (project_id, caption, mime, data, sort) values ($1,$2,$3,$4,$5)`, [pid, im.caption, im.mime, Buffer.from(im.b64, "base64"), ii]);
    }
    console.log(`✓ ${data.client.name} · ${p.title}: ${p.tasks?.length ?? 0} tasks, ${p.images?.length ?? 0} images`);
  }
}
await c.end();
