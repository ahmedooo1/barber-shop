import { NextResponse } from "next/server";
import { listServices } from "@/lib/db";

/**
 * Liste publique des prestations (utilisée par la page Services & Tarifs
 * et par le formulaire de réservation) - pas de données sensibles, pas
 * d'authentification nécessaire.
 */
export async function GET() {
  const services = await listServices();
  return NextResponse.json({ success: true, services });
}
