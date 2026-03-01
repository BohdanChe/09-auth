import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

  // authentication relies on accessToken cookie set by server routes
  const accessToken = req.cookies.get("accessToken")?.value;
  const authenticated = !!accessToken;

  if (isPrivate && !authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isPublic && authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
