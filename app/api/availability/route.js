import { NextResponse } from "next/server";
import { listReservations } from "@/lib/db";
import { clean } from "@/lib/validators";

/**
 * Renvoie les créneaux déjà pris pour une date donnée, afin que le
 * formulaire de réservation puisse masquer les heures indisponibles.
 * Ne renvoie que l'heure et le barbier concerné (aucune donnée
 * personnelle du client) : cette route n'est pas protégée par
 * l'authentification admin.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = clean(searchParams.get("date") || "", 20);

  if (!date) {
    return NextResponse.json({ success: false, message: "Date manquante." }, { status: 400 });
  }

  const all = await listReservations();
  // Seules les réservations confirmées par le barbier bloquent le créneau.
  // Une demande "en attente" ne réserve pas encore l'heure : le client
  // n'a pas de retour de confirmation, donc le créneau reste proposé
  // aux autres tant que le salon n'a pas validé.
  const booked = all
    .filter((r) => r.date === date && r.status === "confirmée")
    .map((r) => ({ time: r.time, barber: r.barber || "" }));

  return NextResponse.json({ success: true, booked });
}
