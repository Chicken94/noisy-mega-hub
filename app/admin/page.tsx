import { requireAdmin, clientsFor } from "@/lib/auth";
import { q } from "@/lib/db";
import { createClient, createProject, addTask, addImages, removeUser } from "@/lib/actions";
import Shell from "../components/Shell";
import { NewUserForm, ReinviteButton } from "../components/InviteForms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Noisy Studio", robots: { index: false } };

export default async function Admin() {
  const me = await requireAdmin();
  const clients = await clientsFor(me);
  const users = await q<{ id: number; name: string; email: string; role: string; clients: string | null; last: string | null }>(
    `select u.id, u.name, u.email, u.role, string_agg(c.short, ', ' order by c.sort, c.name) as clients,
       (select max(created_at)::text from sessions s where s.user_id = u.id) as last
     from users u left join memberships m on m.user_id = u.id left join clients c on c.id = m.client_id
     group by u.id order by u.role, u.name`);
  const projects = await q<{ id: number; title: string; client: string }>(
    `select p.id, p.title, c.short as client from projects p join clients c on c.id = p.client_id order by c.sort, c.name, p.sort, p.title`);
  return (
    <Shell user={me} clients={clients} current="__admin">
      <h1 className="hub-title"><span className="w">Admin</span></h1>

      <section className="adm">
        <h2>People</h2>
        <table className="tbl">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Clients</th><th>Last sign-in</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.role === "admin" ? "All" : u.clients ?? "—"}</td>
                <td>{u.last ? new Date(u.last).toLocaleDateString("en-AU") : "Not yet"}</td>
                <td className="acts"><ReinviteButton id={u.id} />
                  {u.id !== me.id && <form action={removeUser} className="inline"><input type="hidden" name="id" value={u.id} /><button className="linkbtn danger">Remove</button></form>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Add a person</h3>
        <NewUserForm clients={clients} />
      </section>

      <section className="adm">
        <h2>Clients</h2>
        <p className="mut">{clients.map((c) => c.name).join(" · ") || "None yet"}</p>
        <form action={createClient} className="form row">
          <label>Name<input name="name" required maxLength={80} placeholder="Soul Origin" /></label>
          <label>Tab label<input name="short" maxLength={12} placeholder="SO" /></label>
          <button className="btn">Add client</button>
        </form>
      </section>

      <section className="adm">
        <h2>Projects</h2>
        <form action={createProject} className="form row">
          <label>Client<select name="client">{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label>Title<input name="title" required maxLength={120} /></label>
          <button className="btn">Add project</button>
        </form>
        <h3>Add a task</h3>
        <form action={addTask} className="form">
          <label>Project<select name="project">{projects.map((p) => <option key={p.id} value={p.id}>{p.client} · {p.title}</option>)}</select></label>
          <label>Section (optional)<input name="group" maxLength={120} placeholder="Poster 1" /></label>
          <label>Task<input name="title" required maxLength={300} /></label>
          <label>Details (optional)<textarea name="detail" maxLength={2000} rows={3} /></label>
          <label>Who<input name="assignee" maxLength={60} placeholder="Ari" /></label>
          <button className="btn">Add task</button>
        </form>
        <h3>Add images</h3>
        <form action={addImages} className="form">
          <label>Project<select name="project">{projects.map((p) => <option key={p.id} value={p.id}>{p.client} · {p.title}</option>)}</select></label>
          <label>Caption (optional)<input name="caption" maxLength={120} /></label>
          <label>Images (JPG, PNG or WebP, up to 6 MB each)<input name="files" type="file" accept="image/jpeg,image/png,image/webp" multiple required /></label>
          <button className="btn">Upload</button>
        </form>
      </section>
    </Shell>
  );
}
