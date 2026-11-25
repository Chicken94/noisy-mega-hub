import { redirect } from "next/navigation";
import { acceptInvite } from "@/lib/auth";
import Logo from "../../components/Logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in — Noisy Studio", robots: { index: false } };

// The link shows a button instead of signing in on open, so message previews (WhatsApp, email scanners) can't use it up.
export default async function Accept({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  async function go() {
    "use server";
    const ok = await acceptInvite(token);
    redirect(ok ? "/clients" : "/login?e=invalid");
  }
  return (
    <main className="gate">
      <Logo size={56} />
      <h1 className="gate-title"><span className="w">Welcome</span></h1>
      <p>Tap below to open the Noisy Studio client hub on this device.</p>
      <form action={go}><button className="btn" type="submit">Enter the hub</button></form>
    </main>
  );
}
