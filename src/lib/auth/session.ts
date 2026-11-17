import { isUserRole, type UserRole } from "./roles";

export const SESSION_COOKIE = "tw_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface Session {
  uid: string;
  role: UserRole;
  name: string;
}

/**
 * The cookie is signed, not merely encoded. The brief's format (`uid:role`) is
 * trivially forgeable — anyone can write `x:admin` in devtools — so the payload
 * carries an HMAC that the middleware verifies before trusting it.
 */
function getSecret(): string {
  const fromEnv = process.env.AUTH_SESSION_SECRET;
  if (fromEnv) return fromEnv;
  // Predictable only outside production; in production an empty secret makes
  // verification fail closed rather than accept forged cookies.
  return process.env.NODE_ENV !== "production" ? "truewheels-development-only-secret" : "";
}

function bytesToBase64Url(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function signSession(session: Session): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("AUTH_SESSION_SECRET is not configured");
  const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(session)) as Uint8Array<ArrayBuffer>);
  const signature = await crypto.subtle.sign("HMAC", await importKey(secret), new TextEncoder().encode(payload));
  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(value: string | undefined): Promise<Session | null> {
  const secret = getSecret();
  if (!value || !secret) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  let valid = false;
  try {
    // crypto.subtle.verify compares in constant time.
    valid = await crypto.subtle.verify(
      "HMAC",
      await importKey(secret),
      base64UrlToBytes(signature),
      new TextEncoder().encode(payload)
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as Partial<Session>;
    if (typeof decoded.uid !== "string" || !isUserRole(decoded.role)) return null;
    return {
      uid: decoded.uid,
      role: decoded.role,
      name: typeof decoded.name === "string" ? decoded.name : "Member",
    };
  } catch {
    return null;
  }
}
