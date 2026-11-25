import { NextResponse, type NextRequest } from "next/server";

// Protects /dashboard with a username and password stored in Replit Secrets.
// Temporary until proper sign-in (Milestone 3). If the secrets are missing, access is denied.
export function proxy(req: NextRequest) {
  const user = process.env.DASHBOARD_USER;
  const pass = process.env.DASHBOARD_PASSWORD;
  const header = req.headers.get("authorization") ?? "";
  if (user && pass && header.startsWith("Basic ")) {
    const [u, p] = atob(header.slice(6)).split(":");
    if (u === user && p === pass) return NextResponse.next();
  }
  return new NextResponse("Sign in required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Noisy Mega Hub"' },
  });
}

export const config = { matcher: ["/dashboard/:path*"] };
