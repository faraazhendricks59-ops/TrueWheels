import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";
import type { UserRole } from "@/lib/auth/roles";

/**
 * Server-side gate for the tier-restricted areas.
 *
 * Deliberately scoped to /dealer and /admin. /dashboard is public in this
 * build: it renders placeholder data and gating it would redirect every
 * visitor to a login page they cannot satisfy, since Firebase is not yet
 * configured. Authentication is added to /dashboard in the phase that
 * introduces real sign-in.
 */
const ROLE_REQUIREMENTS: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/dealer", roles: ["dealer", "admin"] },
];

/** Minimal 404 body for the production gate on the dev-only harness. */
const DEV_NOT_FOUND_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  "<title>Not found | TrueWheels</title></head>" +
  '<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:6rem auto;padding:0 1.5rem">' +
  "<h1>Page not found</h1>" +
  '<p>This address does not exist. <a href="/marketplace">Browse the marketplace</a>.</p>' +
  "</body></html>";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * The accessibility/dev harness must not exist in a production deployment.
   *
   * The page also calls `notFound()`, but because it is statically prerendered at
   * build time that fires once during the build and the result is served with a 200
   * status — a "not found" body under a success code. Rewriting here means the
   * response is a genuine 404, and the route's client bundle is never the thing a
   * reader gets.
   */
  if (pathname === "/dev" || pathname.startsWith("/dev/")) {
    if (process.env.NODE_ENV === "production") {
      // Return a real 404 rather than rewriting: a rewrite to a route-less path is
      // served by the static pipeline with a 200 status, and the route's own
      // `notFound()` runs only once at build time (it is prerendered), so neither
      // would give a correct status code.
      return new NextResponse(DEV_NOT_FOUND_HTML, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return NextResponse.next();
  }

  const requirement = ROLE_REQUIREMENTS.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  );
  if (!requirement) return NextResponse.next();

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!requirement.roles.includes(session.role)) {
    const denied = new URL("/unauthorized", request.url);
    denied.searchParams.set("required", requirement.roles.join(","));
    denied.searchParams.set("from", pathname);
    return NextResponse.redirect(denied);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dealer/:path*", "/dev", "/dev/:path*"],
};
