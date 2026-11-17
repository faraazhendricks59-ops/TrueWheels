export type UserRole = "guest" | "buyer" | "seller" | "dealer" | "admin";

export const USER_ROLES: UserRole[] = ["guest", "buyer", "seller", "dealer", "admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  guest: "Guest",
  buyer: "Buyer",
  seller: "Private seller",
  dealer: "Verified dealer",
  admin: "Platform admin",
};

/** Roles that can be granted a session. Guests are never issued one. */
export const ASSIGNABLE_ROLES: UserRole[] = ["buyer", "seller", "dealer", "admin"];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as string[]).includes(value);
}
