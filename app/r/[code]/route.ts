import { NextResponse, type NextRequest } from "next/server";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_MAX_AGE, isValidReferralCode } from "@/lib/referrals/referral-data";

/**
 * Handles the shareable invite link, e.g. /r/marcusdrifts.
 *
 * The destination is built from a fixed path so a crafted code cannot turn this
 * into an open redirect. The code is validated before being trusted.
 */
export function GET(request: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code?.toLowerCase().trim();
  const destination = new URL("/", request.url);

  if (isValidReferralCode(code)) {
    destination.searchParams.set("ref", code);
    const response = NextResponse.redirect(destination);
    response.cookies.set({
      name: REFERRAL_COOKIE,
      value: code,
      path: "/",
      maxAge: REFERRAL_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  // Unknown or malformed code: still land the visitor on the site.
  return NextResponse.redirect(destination);
}
