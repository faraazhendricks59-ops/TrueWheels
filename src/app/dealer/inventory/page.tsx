import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DealerSection } from "@/components/dealer/DealerSection";

export const metadata: Metadata = { title: "Inventory | TrueWheels" };

export default function Page() {
  return (
    <AuthGuard allowedRoles={["dealer", "admin"]}>
      <DealerSection variant="inventory" />
    </AuthGuard>
  );
}
