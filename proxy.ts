import { NextResponse, type NextRequest } from "next/server";

// Private areas need a session cookie. The page itself then checks the session in the database.
export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  // /Email, /EMAIL etc. all go to /email (admin only).
  if (url.pathname.toLowerCase() === "/email" && url.pathname !== "/email") {
    url.pathname = "/email";
    return NextResponse.redirect(url);
  }
  if (!req.cookies.get("nh_session")?.value) {
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/clients/:path*", "/admin/:path*", "/dashboard/:path*", "/api/asset/:path*", "/email", "/Email", "/EMAIL"],
};
