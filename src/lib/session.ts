import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "gd_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h

function getSecret() {
  return process.env.SESSION_SECRET || "change_me";
}

function sign(value: string) {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(value);
  return hmac.digest("hex");
}

function buildToken(email: string) {
  const issuedAt = Date.now();
  const payload = `${email}:${issuedAt}`;
  const signature = sign(payload);
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");
  return { token, issuedAt };
}

function parseToken(token: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [email, issuedAt, signature] = decoded.split(":");
    if (!email || !issuedAt || !signature) {
      return null;
    }
    const payload = `${email}:${issuedAt}`;
    const expected = sign(payload);
    const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!valid) {
      return null;
    }
    return { email, issuedAt: Number(issuedAt) };
  } catch (error) {
    return null;
  }
}

export function createAdminSession(email: string) {
  const { token, issuedAt } = buildToken(email);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000)
  });
  return { email, issuedAt };
}

export function getAdminSession() {
  const value = cookies().get(SESSION_COOKIE)?.value;
  if (!value) {
    return null;
  }
  const payload = parseToken(value);
  if (!payload) {
    return null;
  }
  if (Date.now() - payload.issuedAt > SESSION_TTL_MS) {
    clearAdminSession();
    return null;
  }
  return payload;
}

export function clearAdminSession() {
  cookies().delete(SESSION_COOKIE);
}

export function requireAdminSession() {
  const session = getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
