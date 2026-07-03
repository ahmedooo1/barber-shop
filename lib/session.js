/**
 * Barber Shop - session admin minimaliste et sécurisée.
 *
 * Jeton signé (HMAC-SHA256) stocké dans un cookie httpOnly. Pas de
 * bibliothèque tierce : uniquement le module "crypto" natif de Node,
 * pour limiter la surface de dépendances.
 */

import crypto from "crypto";

export const SESSION_COOKIE = "barbershop_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 heures

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court dans .env (générez une longue chaîne aléatoire)."
    );
  }
  return secret;
}

export function createSessionToken() {
  const payload = `admin.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifySessionToken(token) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [role, expiry, signature] = decoded.split(".");
    if (role !== "admin" || !expiry || !signature) return false;
    const payload = `${role}.${expiry}`;
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");
    const validSignature = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
    if (!validSignature) return false;
    return Date.now() < Number(expiry);
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

// Nécessite un contexte serveur Next.js (Route Handler / Server Component)
export async function isAdminAuthenticated() {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
