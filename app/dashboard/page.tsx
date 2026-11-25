import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const panels = [
  { title: "Work items", text: "One list for everything: Asana tasks, emails and jobs you add yourself.", status: "Milestone 3" },
  { title: "Asana", text: "Tasks assigned to you, synced every 15 minutes, with a link back to Asana.", status: "Milestone 4" },
  { title: "Google Drive", text: "Project folders and large files linked to each job.", status: "Milestone 5" },
  { title: "Suggested from email", text: "Emails read by Claude and suggested as work. You approve each one.", status: "Milestone 6" },
];

export default function Dashboard() {
  return (
    <main className="wrap dash">
      <h1>Mega Hub</h1>
      <p style={{ color: "var(--mut)" }}>Private dashboard. Only visible after signing in.</p>
      <div className="cols">
        {panels.map((p) => (
          <div className="panel" key={p.title}>
            <h2>{p.title}</h2>
            <p>{p.text}</p>
            <span className="pill">Coming in {p.status}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
