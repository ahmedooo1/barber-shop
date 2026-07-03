import Link from "next/link";
import GalleryFilter from "@/components/GalleryFilter";

export const metadata = {
  title: "Savoir-faire & Galerie",
  description: "Un aperçu du savoir-faire du Barber Shop : coupes, dégradés, rasage traditionnel et ambiance du salon.",
};

const TILES = [
  { cat: "coupes", catLabel: "Coupes", label: "Dégradé texturé", photo: "photo-1634302104565-cc698ee83144" },
  { cat: "coupes", catLabel: "Coupes", label: "Coupe ciseaux classique", photo: "photo-1503951914875-452162b0f3f1" },
  { cat: "barbe", catLabel: "Barbe", label: "Rasage traditionnel", photo: "photo-1533245270348-821d4d5c7514" },
  { cat: "salon", catLabel: "Salon", label: "Ambiance & cadre", photo: "photo-1759134248487-e8baaf31e33e" },
  { cat: "barbe", catLabel: "Barbe", label: "Contour à la cire", photo: "photo-1596362601603-b74f6ef166e4" },
  { cat: "coupes", catLabel: "Coupes", label: "Coupe enfant", photo: "photo-1704072650662-76df3af134a7" },
  { cat: "salon", catLabel: "Salon", label: "Poste de travail", photo: "photo-1675599193990-33d71150902b" },
  { cat: "barbe", catLabel: "Soins", label: "Soin du visage", photo: "photo-1764712784236-7019d1565cb7" },
];

export default function GaleriePage() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Galerie & réalisations</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Savoir-faire</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p style={{ color: "var(--muted)" }}>
              Un aperçu de nos coupes, du soin apporté à la barbe et de l&apos;ambiance de notre salon.
            </p>
          </div>

          <GalleryFilter tiles={TILES} />

          <div className="cta-banner reveal" style={{ marginTop: "3.5rem" }}>
            <h2>Vous aimez ce que vous voyez ?</h2>
            <p>Réservez votre créneau et laissez nos barbiers sublimer votre style.</p>
            <div className="cta-actions">
              <Link href="/reservation" className="btn btn-primary">Réserver maintenant</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
