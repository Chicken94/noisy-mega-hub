import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import Logo from "../components/Logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in — Noisy Studio", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await currentUser()) redirect("/clients");
  const { e } = await searchParams;
  return (
    <main className="gate">
      <Logo size={56} />
      <h1 className="gate-title"><span className="w">Client</span> <span className="n">hub</span></h1>
      {e === "invalid" ? (
        <p>That invite link has expired or was already used. Ask Noisy Studio for a new one.</p>
      ) : (
        <p>This area is private. Open the invite link Noisy Studio sent you to sign in.</p>
      )}
      <p className="mut"><a href="mailto:Hello@noisystudio.com.au">Hello@noisystudio.com.au</a></p>
    </main>
  );
}
