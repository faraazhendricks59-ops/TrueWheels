"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { ASSIGNABLE_ROLES, type UserRole } from "@/lib/auth/roles";

export interface AuthUser {
  uid: string;
  name: string;
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole;
  isLoading: boolean;
  /** Demo affordance: issues a signed session so roles can be exercised. */
  setRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  /** True once real Firebase credentials exist; the UI explains the demo mode. */
  isLiveAuth: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRoleState] = useState<UserRole>("guest");
  const [isLoading, setIsLoading] = useState(true);

  // The session is read from the server, which is the only party that can
  // verify the signature. The client never trusts a cookie it decoded itself.
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await response.json()) as { user: AuthUser | null; role: UserRole };
      setUser(data.user);
      setRoleState(data.role);
    } catch {
      setUser(null);
      setRoleState("guest");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Once Firebase credentials are supplied, this is where onAuthStateChanged
  // would subscribe and exchange the ID token for a session cookie. The
  // Firebase SDK is deliberately not imported here: it throws when
  // unconfigured, and the module is imported on every page.
  const setRole = useCallback(
    async (next: UserRole) => {
      if (next !== "guest" && !ASSIGNABLE_ROLES.includes(next)) return;
      await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
      await refresh();
    },
    [refresh]
  );

  const signOut = useCallback(async () => {
    await fetch("/api/auth/demo-session", { method: "DELETE" });
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ user, role, isLoading, setRole, signOut, isLiveAuth: isFirebaseConfigured }),
    [user, role, isLoading, setRole, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
