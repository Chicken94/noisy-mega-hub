import type { Project } from "@/content/site";

export default function Cover({ p, label = true }: { p: Project; label?: boolean }) {
  const [a, b] = p.colors;
  return (
    <div className="cover" style={{ background: `linear-gradient(135deg, ${a} 0%, ${a} 48%, ${b} 48%, ${b} 100%)` }}>
      {p.image ? <img src={p.image} alt={`${p.title} for ${p.client}`} /> : label ? <b>{p.category}</b> : null}
    </div>
  );
}
