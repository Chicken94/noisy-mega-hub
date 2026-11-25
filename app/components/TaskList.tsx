"use client";
import { useState, useTransition } from "react";
import { toggleTask } from "@/lib/actions";

type T = { id: number; group_title: string; title: string; detail: string; assignee: string; done: boolean };

export default function TaskList({ tasks, editable }: { tasks: T[]; editable: boolean }) {
  const [state, setState] = useState<Record<number, boolean>>(() => Object.fromEntries(tasks.map((t) => [t.id, t.done])));
  const [err, setErr] = useState("");
  const [, start] = useTransition();
  const groups: { title: string; items: T[] }[] = [];
  for (const t of tasks) {
    let g = groups.find((x) => x.title === t.group_title);
    if (!g) groups.push((g = { title: t.group_title, items: [] }));
    g.items.push(t);
  }
  const done = Object.values(state).filter(Boolean).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const flip = (id: number) => {
    const v = !state[id];
    setState((s) => ({ ...s, [id]: v }));
    start(async () => {
      const r = await toggleTask(id, v).catch(() => ({ ok: false }));
      if (!r.ok) { setState((s) => ({ ...s, [id]: !v })); setErr("Couldn’t save that tick. Try again."); } else setErr("");
    });
  };
  return (
    <>
      <div className="big"><span className="bigpct">{pct}%</span><span className="mut">{done} of {tasks.length} changes done</span></div>
      <div className="prog"><div className="bar"><i style={{ width: `${pct}%` }} /></div></div>
      {err && <p className="err" role="status">{err}</p>}
      {groups.map((g) => (
        <section className="group" key={g.title || "_"}>
          {g.title && <h2>{g.title}</h2>}
          <ul className="tasks">
            {g.items.map((t) => (
              <li key={t.id} className={state[t.id] ? "done" : ""}>
                <label>
                  <input type="checkbox" checked={!!state[t.id]} disabled={!editable} onChange={() => flip(t.id)} />
                  <span>
                    <span className="tt">{t.title}{t.assignee && <em className="who">{t.assignee}</em>}</span>
                    {t.detail && <span className="td">{t.detail}</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
