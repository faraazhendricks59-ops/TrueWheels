import type { Metadata } from "next";
import { CommunityFeed } from "@/components/social/CommunityFeed";

/**
 * The community route.
 *
 * This did not exist. The header and the mobile menu both linked to
 * `/#community`, which is an anchor on the home page that was never built, so
 * the Community link did nothing when clicked. The link now points here.
 *
 * It is a server component so the metadata is real. The feed itself is a client
 * component because the composer keeps a draft in the browser.
 *
 * It does not render AppShell: the root layout already provides it, and the
 * comment there says pages must not nest another one. Nesting it here rendered a
 * second copy of the fixed mobile navigation and the floating button.
 */
export const metadata: Metadata = {
  title: "Community | TrueWheels",
  description:
    "The TrueWheels community feed. The feed is not live yet: no one can publish a post, and the posts shown are labelled examples.",
};

export default function CommunityPage() {
  return <CommunityFeed />;
}
