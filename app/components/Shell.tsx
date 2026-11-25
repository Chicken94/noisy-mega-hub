import Logo from "./Logo";
import type { Client, User } from "@/lib/auth";

export default function Shell({ user, clients, current, children }: { user: User; clients: Client[]; current?: string; children: React.ReactNode }) {
  return (
    <div className="hub">
      <header className="hub-top">
        <div>
          <nav className="tabs" aria-label="Clients">
            {clients.map((c) => (
              <a key={c.slug} href={`/clients/${c.slug}`} aria-current={c.slug === current ? "page" : undefined}>{c.short || c.name}</a>
            ))}
            {user.role === "admin" && <a href="/admin" aria-current={current === "__admin" ? "page" : undefined}>Admin</a>}
          </nav>
          <div className="kick">Noisy Studio · Client hub · {user.name || user.email}
            <form action="/logout" method="post" className="inline"><button className="linkbtn" type="submit">Sign out</button></form>
          </div>
        </div>
        <a href="/" aria-label="Noisy Studio home"><Logo size={52} /></a>
      </header>
      {children}
    </div>
  );
}
