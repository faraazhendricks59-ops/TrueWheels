import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminSection } from "@/components/admin/AdminSection";

export const metadata: Metadata = { title: "User management | TrueWheels" };

export default function Page() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminSection variant="users" />
    </AuthGuard>
  );
}
