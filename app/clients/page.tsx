import { redirect } from "next/navigation";
import { requireUser, clientsFor } from "@/lib/auth";
import Shell from "../components/Shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients — Noisy Studio", robots: { index: false } };

export default async function Clients() {
  const u = await requireUser();
  const list = await clientsFor(u);
  if (list.length >= 1 && u.role !== "admin") redirect(`/clients/${list[0].slug}`);
  if (list.length >= 1) redirect(`/clients/${list[0].slug}`);
  return (
    <Shell user={u} clients={list}>
      <div className="empty"><strong>No clients yet</strong><p>{u.role === "admin" ? <a href="/admin">Add the first client in Admin.</a> : "Noisy Studio hasn’t shared a client with you yet."}</p></div>
    </Shell>
  );
}
