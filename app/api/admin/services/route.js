import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/session";
import { addService } from "@/lib/db";
import { required, clean } from "@/lib/validators";
import { SERVICE_CATEGORIES } from "@/lib/serviceCategories";

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const category = clean(body.category, 60);
  const name = clean(body.name, 150);
  const description = clean(body.description, 300);
  const price = clean(body.price, 30);
  const duration = clean(body.duration, 30);
  const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0;

  const errors = {};
  if (!SERVICE_CATEGORIES.includes(category)) errors.category = "Catégorie invalide.";
  if (!required(name, 2)) errors.name = "Le nom est requis.";
  if (!required(price, 1)) errors.price = "Le tarif est requis.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  const service = await addService({ category, name, description, price, duration, sortOrder });
  return NextResponse.json({ success: true, service });
}
