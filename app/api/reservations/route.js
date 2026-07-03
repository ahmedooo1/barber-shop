import { NextResponse } from "next/server";
import { addReservation } from "@/lib/db";
import { sendReservationEmail } from "@/lib/mailer";
import { isValidEmail, isValidPhone, required, clean } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`res:${ip}`, { max: 8, windowMs: 15 * 60 * 1000 });
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

  // Piège à robots : ce champ doit rester vide (masqué en CSS côté client)
  if (body.botcheck) {
    return NextResponse.json({ success: true }); // on répond "ok" sans rien faire
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 150);
  const service = clean(body.service, 150);
  const barber = clean(body.barber, 60);
  const date = clean(body.date, 20);
  const time = clean(body.time, 20);
  const message = clean(body.message, 800);

  const errors = {};
  if (!required(name, 2)) errors.name = "Merci d'indiquer votre nom.";
  if (!isValidPhone(phone)) errors.phone = "Numéro de téléphone invalide.";
  if (!isValidEmail(email)) errors.email = "Adresse e-mail invalide.";
  if (!required(service)) errors.service = "Choisissez une prestation.";
  if (!required(date)) errors.date = "Choisissez une date.";
  if (!required(time)) errors.time = "Choisissez un créneau.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  const record = await addReservation({ name, phone, email, service, barber, date, time, message });
  sendReservationEmail(record).catch((err) => console.error("[mailer] échec envoi réservation:", err.message));

  return NextResponse.json({ success: true, id: record.id });
}
