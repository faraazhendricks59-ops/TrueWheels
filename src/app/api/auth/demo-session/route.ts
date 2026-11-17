import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ASSIGNABLE_ROLES, isUserRole } from "@/lib/auth/roles";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, signSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const DEMO_NAMES: Record<string, string> = {
  buyer: "Thandi Mokoena",
  seller: "Pieter van Wyk",
  dealer: "Prestige Motors SA",
  admin: "Platform Admin",
};

/**
 * Issues a session without credentials so the role tiers can be exercised while
 * Firebase is unconfigured. Refused in production: a cookie-minting endpoint
 * that anyone can call is a privilege-escalation hole, and it must never be
 * reachable once real authentication is wired.
 */
export async function POST(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { role?: unknown };
  if (!isUserRole(body.role) || !ASSIGNABLE_ROLES.includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const value = await signSession({
    uid: `demo-${body.role}`,
    role: body.role,
    name: DEMO_NAMES[body.role] ?? "Member",
  });

  cookies().set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true, role: body.role });
}

export async function DELETE() {
  cookies().delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
