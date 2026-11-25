import { notFound } from "next/navigation";
import { requireUser, clientsFor, canEdit } from "@/lib/auth";
import { q, one } from "@/lib/db";
import Shell from "../../../components/Shell";
import Carousel from "../../../components/Carousel";
import TaskList from "../../../components/TaskList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Project — Noisy Studio", robots: { index: false } };

export default async function Project({ params }: { params: Promise<{ slug: string; project: string }> }) {
  const { slug, project } = await params;
  const u = await requireUser();
  const list = await clientsFor(u);
  const c = list.find((x) => x.slug === slug);
  if (!c) notFound();
  const p = await one<{ id: number; title: string; kind: string; brief: string; links: { label: string; url: string }[] }>(
    `select id, title, kind, brief, links from projects where client_id = $1 and slug = $2`, [c.id, project]);
  if (!p) notFound();
  const tasks = await q<{ id: number; group_title: string; title: string; detail: string; assignee: string; done: boolean }>(
    `select id, group_title, title, detail, assignee, done from tasks where project_id = $1 order by sort, id`, [p.id]);
  const imgs = await q<{ id: number; caption: string }>(`select id, caption from assets where project_id = $1 order by sort, id`, [p.id]);
  const links = (Array.isArray(p.links) ? p.links : []).filter((l) => /^https:\/\//.test(l.url));
  return (
    <Shell user={u} clients={list} current={c.slug}>
      <p className="crumb"><a href={`/clients/${c.slug}`}>← {c.name}</a></p>
      <h1 className="proj-title">{p.title}</h1>
      <p className="mut">{p.kind}{links.length ? " · " : ""}{links.map((l, i) => <span key={l.url}>{i ? " · " : ""}<a href={l.url} target="_blank" rel="noopener">{l.label} ↗</a></span>)}</p>
      {p.brief && <p className="brief">{p.brief}</p>}
      {imgs.length > 0 && <div className="proj-car"><Carousel images={imgs} href="#" title={p.title} /><p className="mut caps">{imgs.map((m) => m.caption).join(" · ")}</p></div>}
      <TaskList tasks={tasks} editable={canEdit(u)} />
      {!canEdit(u) && <p className="mut small">You’re viewing progress. Noisy Studio ticks changes off as they’re done.</p>}
    </Shell>
  );
}
