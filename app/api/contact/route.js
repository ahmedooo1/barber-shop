import { NextResponse } from "next/server";
import { addMessage } from "@/lib/db";
import { sendContactEmail } from "@/lib/mailer";
import { isValidEmail, required, clean } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`contact:${ip}`, { max: 10, windowMs: 15 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Trop de demandes. Merci de réessayer plus tard." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Requête invalide." }, { status: 400 });
  }

  if (body.botcheck) {
    return NextResponse.json({ success: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const subject = clean(body.subject, 150);
  const message = clean(body.message, 2000);

  const errors = {};
  if (!required(name, 2)) errors.name = "Merci d'indiquer votre nom.";
  if (!isValidEmail(email)) errors.email = "Adresse e-mail invalide.";
  if (!required(message, 10)) errors.message = "Votre message est un peu court.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  const record = await addMessage({ name, email, subject, message });
  sendContactEmail(record).catch((err) => console.error("[mailer] échec envoi contact:", err.message));

  return NextResponse.json({ success: true, id: record.id });
}
