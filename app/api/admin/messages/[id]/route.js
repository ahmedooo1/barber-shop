import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/session";
import { markMessageRead } from "@/lib/db";

export async function PATCH(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const updated = await markMessageRead(id);
  if (!updated) return NextResponse.json({ success: false, message: "Introuvable." }, { status: 404 });
  return NextResponse.json({ success: true, message: updated });
}
