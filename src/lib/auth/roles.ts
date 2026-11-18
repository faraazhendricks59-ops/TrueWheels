export type UserRole = "guest" | "buyer" | "seller" | "dealer" | "admin";

export const USER_ROLES: UserRole[] = ["guest", "buyer", "seller", "dealer", "admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  guest: "Guest",
  buyer: "Buyer",
  seller: "Private seller",
  // "Verified dealer" asserted a check that has never been performed. This label
  // is shown in the role switcher, the login panel and the unauthorized panel, so
  // the claim reached users from three places. A role is a permission level, not a
  // verification.
  dealer: "Dealer account",
  admin: "Platform admin",
};

/** Roles that can be granted a session. Guests are never issued one. */
export const ASSIGNABLE_ROLES: UserRole[] = ["buyer", "seller", "dealer", "admin"];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as string[]).includes(value);
}
