import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

  // authentication relies on accessToken cookie set by server routes
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  let authenticated = !!accessToken;

  // if no accessToken but refreshToken exists, try to refresh session
  if (!authenticated && refreshToken) {
    try {
      const origin = req.nextUrl.origin;
      const sessionResp = await fetch(`${origin}/api/auth/session`, {
        method: "GET",
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      // if session endpoint set cookies and returned OK, propagate tokens
      if (sessionResp.ok) {
        authenticated = true;

        const setCookie = sessionResp.headers.get("set-cookie");
        if (setCookie) {
          // try to extract tokens from Set-Cookie header
          const accessMatch = setCookie.match(/accessToken=([^;]+)/);
          const refreshMatch = setCookie.match(/refreshToken=([^;]+)/);

          const res = NextResponse.next();
          if (accessMatch) {
            res.cookies.set("accessToken", accessMatch[1], { path: "/" });
          }
          if (refreshMatch) {
            res.cookies.set("refreshToken", refreshMatch[1], { path: "/" });
          }
          // return response with cookies set
          return res;
        }
      }
    } catch {
      // ignore refresh errors and fallthrough to redirect
    }
  }

  if (isPrivate && !authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isPublic && authenticated) {
    // logged‑in users shouldn't be able to visit the sign-in/sign-up pages
    // redirect them back to the **home page** rather than their profile
    const url = req.nextUrl.clone();
    url.pathname = "/"; // <- changed from /profile per feedback
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
