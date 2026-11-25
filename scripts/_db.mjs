import pg from "pg";
import { readFileSync } from "node:fs";
export async function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("DATABASE_URL is not set. Add a Postgres database in Replit first."); process.exit(1); }
  const c = new pg.Client({ connectionString: url, ssl: /sslmode=require|neon|replit/.test(url) ? { rejectUnauthorized: false } : undefined });
  await c.connect();
  await c.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  return c;
}
