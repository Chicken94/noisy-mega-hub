import { currentUser, clientsFor } from "@/lib/auth";
import { one } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const u = await currentUser();
  if (!u) return new Response("Not found", { status: 404 });
  const { id } = await params;
  const a = await one<{ mime: string; data: Buffer; client_id: number }>(
    `select a.mime, a.data, p.client_id from assets a join projects p on p.id = a.project_id where a.id = $1`,
    [Number(id) || 0]
  );
  if (!a) return new Response("Not found", { status: 404 });
  const allowed = (await clientsFor(u)).some((c) => c.id === a.client_id);
  if (!allowed) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(a.data), {
    headers: { "Content-Type": a.mime, "Cache-Control": "private, max-age=86400", "X-Content-Type-Options": "nosniff" },
  });
}
