import { NextResponse, type NextRequest } from "next/server";

// Private areas need a session cookie. The page itself then checks the session in the database.
export function proxy(req: NextRequest) {
  if (!req.cookies.get("nh_session")?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/clients/:path*", "/admin/:path*", "/dashboard/:path*", "/api/asset/:path*"] };
