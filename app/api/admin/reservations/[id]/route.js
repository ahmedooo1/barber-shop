import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/session";
import { updateReservationStatus } from "@/lib/db";

const ALLOWED = ["en_attente", "confirmée", "annulée"];

export async function PATCH(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await request.json().catch(() => ({}));
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ success: false, message: "Statut invalide." }, { status: 400 });
  }
  const updated = await updateReservationStatus(id, status);
  if (!updated) return NextResponse.json({ success: false, message: "Introuvable." }, { status: 404 });
  return NextResponse.json({ success: true, reservation: updated });
}
