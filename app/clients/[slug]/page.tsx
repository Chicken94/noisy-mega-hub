import { notFound } from "next/navigation";
import { requireUser, clientsFor } from "@/lib/auth";
import { q } from "@/lib/db";
import Shell from "../../components/Shell";
import Carousel from "../../components/Carousel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Client hub — Noisy Studio", robots: { index: false } };

type P = { id: number; slug: string; title: string; total: number; done: number };

export default async function Hub({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = await requireUser();
  const list = await clientsFor(u);
  const c = list.find((x) => x.slug === slug);
  if (!c) notFound();
  const projects = await q<P>(
    `select p.id, p.slug, p.title, count(t.id)::int as total, count(t.id) filter (where t.done)::int as done
     from projects p left join tasks t on t.project_id = p.id
     where p.client_id = $1 and not p.archived group by p.id order by p.sort, p.created_at desc`,
    [c.id]
  );
  const imgs = await q<{ id: number; project_id: number; caption: string }>(
    `select a.id, a.project_id, a.caption from assets a join projects p on p.id = a.project_id where p.client_id = $1 order by a.sort, a.id`,
    [c.id]
  );
  const [w, ...rest] = c.name.split(" ");
  return (
    <Shell user={u} clients={list} current={c.slug}>
      <h1 className="hub-title" aria-label={c.name}><span className="w">{w}</span>{rest.length ? <span className="n">{rest.join(" ")}</span> : <span className="n">Hub</span>}</h1>
      {projects.length ? (
        <div className="grid">
          {projects.map((p) => {
            const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
            const href = `/clients/${c.slug}/${p.slug}`;
            return (
              <article className="card" key={p.id}>
                <a className="name" href={href}>{p.title}</a>
                <Carousel images={imgs.filter((m) => m.project_id === p.id)} href={href} title={p.title} />
                <div className="prog" role="img" aria-label={`${pct}% complete`}><div className="bar"><i style={{ width: `${pct}%` }} /></div><span className="pct">{pct}%</span></div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty"><strong>No artifacts yet</strong><p>New work for {c.name} will appear here.</p></div>
      )}
    </Shell>
  );
}
