import { Pool, type QueryResultRow } from "pg";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const g = globalThis as unknown as { __pool?: Pool; __schema?: Promise<void> };

function pool(): Pool {
  if (!g.__pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    g.__pool = new Pool({ connectionString: url, max: 5, ssl: /sslmode=require|neon|replit/.test(url) ? { rejectUnauthorized: false } : undefined });
  }
  return g.__pool;
}

function ensureSchema(): Promise<void> {
  if (!g.__schema) {
    const sql = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");
    g.__schema = pool().query(sql).then(() => undefined).catch((e) => { g.__schema = undefined; throw e; });
  }
  return g.__schema;
}

export async function q<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  const r = await pool().query<T>(text, params);
  return r.rows;
}

export async function one<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await q<T>(text, params);
  return rows[0] ?? null;
}
