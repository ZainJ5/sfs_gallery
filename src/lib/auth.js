import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, signSession, verifySessionToken } from "@/lib/session";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(user) {
  const token = await signSession({
    sub: String(user._id || user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Only mark Secure when actually served over HTTPS. Set COOKIE_SECURE=true
    // once behind TLS; leave false for plain-HTTP (e.g. IP-only) deployments,
    // otherwise the browser drops the session cookie and login silently fails.
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the decoded session payload, or null. */
export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Server-side guard for admin routes/actions. Redirects to login if absent. */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
