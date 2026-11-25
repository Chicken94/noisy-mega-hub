"use client";
import { useActionState, useState } from "react";
import { createUser, inviteAgain, type InviteState } from "@/lib/actions";

function LinkBox({ s }: { s: InviteState }) {
  const [copied, setCopied] = useState(false);
  if (s.error) return <p className="err" role="status">{s.error}</p>;
  if (!s.link) return null;
  return (
    <div className="linkbox" role="status">
      <p>Invite link for <b>{s.who}</b> (single use, valid 14 days). Send it by email or WhatsApp:</p>
      <code>{s.link}</code>
      <button type="button" className="btn small" onClick={() => navigator.clipboard?.writeText(s.link!).then(() => setCopied(true)).catch(() => {})}>{copied ? "Copied" : "Copy link"}</button>
    </div>
  );
}

export function NewUserForm({ clients }: { clients: { id: number; name: string }[] }) {
  const [s, act, pending] = useActionState(createUser, {});
  return (
    <form action={act} className="form">
      <label>Name<input name="name" required maxLength={120} /></label>
      <label>Email<input name="email" type="email" required maxLength={200} /></label>
      <label>Role
        <select name="role" defaultValue="client">
          <option value="client">Client — sees their brand, read only</option>
          <option value="team">Team — ticks tasks for assigned clients</option>
          <option value="admin">Admin — everything</option>
        </select>
      </label>
      <fieldset><legend>Clients they can see</legend>
        {clients.map((c) => <label key={c.id} className="chk"><input type="checkbox" name="clients" value={c.id} /> {c.name}</label>)}
      </fieldset>
      <button className="btn" disabled={pending}>{pending ? "Creating…" : "Create user + invite link"}</button>
      <LinkBox s={s} />
    </form>
  );
}

export function ReinviteButton({ id }: { id: number }) {
  const [s, act, pending] = useActionState(inviteAgain, {});
  return (
    <form action={act} className="inline">
      <input type="hidden" name="id" value={id} />
      <button className="linkbtn" disabled={pending}>New invite link</button>
      <LinkBox s={s} />
    </form>
  );
}
