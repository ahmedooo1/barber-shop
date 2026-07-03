import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/session";
import { listServices } from "@/lib/db";
import { SERVICE_CATEGORIES } from "@/lib/serviceCategories";
import ServiceManager from "@/components/ServiceManager";

export const metadata = { title: "Gérer les services", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const services = await listServices();

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1>Services & Tarifs</h1>
            <p className="breadcrumb"><Link href="/admin">Tableau de bord</Link> / <span>Services</span></p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ServiceManager services={services} categories={SERVICE_CATEGORIES} />
        </div>
      </section>
    </main>
  );
}
