import Link from "next/link";
import { projects, services, site } from "@/content/site";
import Cover from "./Cover";

const bars = [18, 34, 52, 28, 70, 44, 90, 38, 60, 24, 82, 48, 30, 66, 40, 96, 54, 26, 74, 36, 58, 20, 86, 42, 64, 32, 78, 46, 22, 56];

export default function Home() {
  return (
    <main>
      <div className="wrap hero">
        <h1>Make some <em>noise</em></h1>
        <div className="lead">
          <p>{site.tagline}</p>
          <small>{site.location} · Available for new projects</small>
        </div>
        <div className="wave" aria-hidden="true">
          {bars.map((h, i) => <i key={i} style={{ height: `${h}%`, animationDelay: `${(i % 7) * 0.12}s` }} />)}
        </div>
      </div>

      <section id="work">
        <div className="wrap">
          <div className="head"><h2>Selected work</h2><p>{projects.length} projects</p></div>
          <div className="grid">
            {projects.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="card">
                <Cover p={p} />
                <div className="meta"><h3>{p.title}</h3><span>{p.client} · {p.year}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="wrap">
          <div className="head"><h2>What we do</h2><p>{site.intro}</p></div>
          <div className="services">
            {services.map((s) => <div key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="wrap">
          <h2>Let&apos;s talk</h2>
          <a className="big" href={`mailto:${site.email}`}>{site.email}</a>
          <p>Tell us about the project, the timing and the budget. We reply within two working days.</p>
        </div>
      </section>
    </main>
  );
}
