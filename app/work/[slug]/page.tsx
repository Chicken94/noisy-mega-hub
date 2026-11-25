import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/site";
import Cover from "../../Cover";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <main className="wrap">
      <div className="project-hero">
        <h1>{p.title}</h1>
        <div className="facts">
          <div><b>Client</b>{p.client}</div>
          <div><b>Year</b>{p.year}</div>
          <div><b>Discipline</b>{p.category}</div>
        </div>
      </div>
      <div className="project-cover"><Cover p={p} label={false} /></div>
      <div className="prose">
        <p><strong>{p.summary}</strong></p>
        {p.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      <Link href="/#work" className="back">← All work</Link>
    </main>
  );
}
