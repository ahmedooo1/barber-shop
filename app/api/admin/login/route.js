import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`login:${ip}`, { max: 6, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ success: false, message: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  }

  const { username, password } = await request.json().catch(() => ({}));

  // On retire les espaces accidentels en début/fin (copier-coller, saisie clavier)
  // pour éviter les échecs de connexion causés par un simple espace parasite.
  const cleanUsername = (username || "").trim();
  const cleanPassword = (password || "").trim();

  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  let passwordOk = false;
  if (hash) {
    passwordOk = cleanPassword ? bcrypt.compareSync(cleanPassword, hash) : false;
  } else if (plain) {
    passwordOk = cleanPassword === plain.trim(); // fallback simple, ADMIN_PASSWORD_HASH recommandé
  }

  if (cleanUsername !== validUsername || !passwordOk) {
    return NextResponse.json({ success: false, message: "Identifiants incorrects." }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
