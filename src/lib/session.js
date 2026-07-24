import { SignJWT, jwtVerify } from "jose";

// Pure JWT helpers — NO next/headers or next/navigation imports, so this module
// is safe to use from proxy.js (request-proxy) as well as server components.

export const SESSION_COOKIE = "sfs_session";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-insecure-secret-change-me"
);

export async function signSession(payload, expiresIn = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
