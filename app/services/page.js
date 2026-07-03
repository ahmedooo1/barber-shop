import Link from "next/link";
import { ScissorsIcon, RazorIcon, ComboIcon, DropIcon } from "@/components/Icons";
import { listServices } from "@/lib/db";
import { SERVICE_CATEGORIES } from "@/lib/serviceCategories";

export const metadata = {
  title: "Services & Tarifs",
  description: "Découvrez toutes les prestations du Barber Shop : coupes homme, barbe & rasage, formules combo, soins et extras, avec tarifs et durées.",
};

const ICONS = {
  "Coupes Homme": ScissorsIcon,
  "Barbe & Rasage": RazorIcon,
  "Formules Combo": ComboIcon,
  "Soins & Extras": DropIcon,
};

export default async function ServicesPage() {
  const services = await listServices();
  const categories = SERVICE_CATEGORIES.map((title) => ({
    title,
    Icon: ICONS[title] || ScissorsIcon,
    items: services.filter((s) => s.category === title),
  })).filter((c) => c.items.length > 0);

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Services & Tarifs</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Services</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {categories.map(({ Icon, title, items }) => (
            <div className="service-cat reveal" key={title}>
              <h3><Icon width="22" height="22" stroke="#c9a24b" />{title}</h3>
              {items.map((item) => (
                <div className="service-row" key={item.id}>
                  <div>
                    <div className="name">{item.name}</div>
                    <div className="desc">{item.description}</div>
                  </div>
                  <div className="meta">
                    <div className="price">{item.price}</div>
                    <div className="duration">{item.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="cta-banner reveal" style={{ marginTop: "1rem" }}>
            <h2>Une question sur nos prestations ?</h2>
            <p>Nos barbiers vous conseillent selon votre visage, votre type de cheveux et vos envies.</p>
            <div className="cta-actions">
              <Link href="/reservation" className="btn btn-primary">Réserver maintenant</Link>
              <Link href="/contact" className="btn btn-outline">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
