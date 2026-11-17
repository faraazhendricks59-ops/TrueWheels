import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ user: null, role: "guest" });
  }
  return NextResponse.json({
    user: { uid: session.uid, name: session.name },
    role: session.role,
  });
}
