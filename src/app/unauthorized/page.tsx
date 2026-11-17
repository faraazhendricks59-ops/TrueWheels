import type { Metadata } from "next";
import { UnauthorizedPanel } from "@/components/auth/UnauthorizedPanel";

export const metadata: Metadata = { title: "Not authorized | TrueWheels" };

export default function UnauthorizedPage() {
  return <UnauthorizedPanel />;
}
