import Link from "next/link";
import { ScissorsIcon, RazorIcon, ComboIcon, DropIcon } from "@/components/Icons";

export const metadata = {
  title: "Services & Tarifs",
  description: "Découvrez toutes les prestations du Barber Shop : coupes homme, barbe & rasage, formules combo, soins et extras, avec tarifs et durées.",
};

const CATEGORIES = [
  {
    Icon: ScissorsIcon,
    title: "Coupes Homme",
    items: [
      { name: "Coupe classique", desc: "Coupe aux ciseaux et/ou tondeuse, finitions soignées.", price: "25€", duration: "30 min" },
      { name: "Coupe + dégradé (fade)", desc: "Dégradé progressif, contours précis à la tondeuse.", price: "30€", duration: "40 min" },
      { name: "Coupe + shampoing", desc: "Coupe complète avec shampoing et coiffage.", price: "28€", duration: "35 min" },
      { name: "Coupe enfant (-12 ans)", desc: "Coupe adaptée, dans la douceur et la bonne humeur.", price: "18€", duration: "25 min" },
    ],
  },
  {
    Icon: RazorIcon,
    title: "Barbe & Rasage",
    items: [
      { name: "Taille de barbe", desc: "Mise en forme et équilibrage selon votre visage.", price: "18€", duration: "20 min" },
      { name: "Rasage traditionnel au coupe-chou", desc: "Serviette chaude, mousse et rasage à l'ancienne.", price: "25€", duration: "30 min" },
      { name: "Contour à la cire chaude", desc: "Finitions nettes du contour de barbe.", price: "15€", duration: "15 min" },
      { name: "Taille de moustache", desc: "Précision au ciseau et à la tondeuse fine.", price: "10€", duration: "10 min" },
    ],
  },
  {
    Icon: ComboIcon,
    title: "Formules Combo",
    items: [
      { name: "Coupe + Barbe", desc: "Notre formule la plus demandée.", price: "40€", duration: "55 min" },
      { name: "Formule Prestige", desc: "Coupe + barbe + soin du visage complet.", price: "55€", duration: "75 min" },
      { name: "Formule Marié", desc: "Coupe + barbe + soin + shampoing, pour le grand jour.", price: "65€", duration: "90 min" },
    ],
  },
  {
    Icon: DropIcon,
    title: "Soins & Extras",
    items: [
      { name: "Soin du visage", desc: "Nettoyage, gommage et hydratation.", price: "20€", duration: "20 min" },
      { name: "Gommage du cuir chevelu", desc: "Soin exfoliant pour un cuir chevelu sain.", price: "15€", duration: "15 min" },
      { name: "Coloration barbe", desc: "Uniformise et couvre les poils blancs.", price: "20€", duration: "25 min" },
      { name: "Épilation nez / oreilles", desc: "Finition rapide et discrète.", price: "8€", duration: "10 min" },
    ],
  },
];

export default function ServicesPage() {
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
          {CATEGORIES.map(({ Icon, title, items }) => (
            <div className="service-cat reveal" key={title}>
              <h3><Icon width="22" height="22" stroke="#c9a24b" />{title}</h3>
              {items.map((item) => (
                <div className="service-row" key={item.name}>
                  <div>
                    <div className="name">{item.name}</div>
                    <div className="desc">{item.desc}</div>
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
