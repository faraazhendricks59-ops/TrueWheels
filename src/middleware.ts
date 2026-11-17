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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/admin/:path*", "/dealer/:path*"],
};
