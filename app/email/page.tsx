import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Email — Noisy Studio", robots: { index: false, follow: false } };

// Admin only. Forwards to Daniel's private Claude page (it also needs his Claude sign-in).
// The address lives in the EMAIL_HUB_URL secret on Replit, never in this public repo.
export default async function Email() {
  await requireAdmin();
  const url = process.env.EMAIL_HUB_URL;
  if (!url || !url.startsWith("https://claude.ai/")) {
    return (
      <main style={{ padding: 40, fontFamily: "system-ui" }}>
        <h1>Email room not set up</h1>
        <p>Add the EMAIL_HUB_URL secret in Replit, then redeploy.</p>
      </main>
    );
  }
  redirect(url);
}
