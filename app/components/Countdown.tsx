"use client";
import { useEffect, useState } from "react";

const TARGET = new Date("2027-01-01T00:00:00+11:00").getTime();
const pad = (n: number) => String(n).padStart(2, "0");

function parts(now: number) {
  let s = Math.max(0, Math.floor((TARGET - now) / 1000));
  const days = Math.floor(s / 86400); s -= days * 86400;
  const hours = Math.floor(s / 3600); s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  return [
    { label: "Days", value: pad(days) },
    { label: "Hours", value: pad(hours) },
    { label: "Minutes", value: pad(minutes) },
    { label: "Seconds", value: pad(s - minutes * 60) },
  ];
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const units = now === null ? parts(TARGET).map((u) => ({ ...u, value: "--" })) : parts(now);
  return (
    <div className="count" role="timer" aria-label="Time until launch on 1 January 2027">
      {units.map((u) => (
        <div className="cell" key={u.label}>
          <span className="num">{u.value}</span>
          <span className="lbl">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
