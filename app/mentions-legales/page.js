import Link from "next/link";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Barber Shop : éditeur, hébergement, propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Mentions légales</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Mentions légales</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: "2rem" }}>
              Conformément aux articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004
              pour la confiance dans l&apos;économie numérique (LCEN), il est précisé aux
              utilisateurs du site Barber Shop l&apos;identité des différents intervenants
              dans le cadre de sa réalisation et de son suivi.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Éditeur du site</h2>
            <p style={{ marginBottom: "2rem" }}>
              [À compléter : raison sociale / nom du salon]<br />
              [À compléter : forme juridique - entreprise individuelle, SARL, etc.]<br />
              Siège social : [Adresse à compléter], Elbeuf, France<br />
              Numéro SIRET : [À compléter]<br />
              Téléphone : [À compléter]<br />
              E-mail : <a href="mailto:contact@barbershop-elbeuf.fr">contact@barbershop-elbeuf.fr</a><br />
              Directeur de la publication : [À compléter : nom du gérant]
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Hébergement</h2>
            <p style={{ marginBottom: "2rem" }}>
              Le site est hébergé par [À compléter : nom de l&apos;hébergeur, ex. Vercel Inc.
              ou Render Services Inc.], dont les coordonnées complètes sont disponibles sur
              le site de l&apos;hébergeur concerné.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Propriété intellectuelle</h2>
            <p style={{ marginBottom: "2rem" }}>
              L&apos;ensemble des textes, éléments graphiques, logos et mises en forme
              présents sur ce site sont, sauf mention contraire, la propriété de Barber
              Shop et sont protégés par le droit d&apos;auteur. Toute reproduction, même
              partielle, est soumise à autorisation préalable.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Crédits photographiques</h2>
            <p style={{ marginBottom: "2rem" }}>
              Certaines photographies utilisées sur le site proviennent de la plateforme
              Unsplash et sont diffusées sous licence Unsplash (utilisation libre, y
              compris à des fins commerciales, sans attribution obligatoire).
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Limitation de responsabilité</h2>
            <p style={{ marginBottom: "2rem" }}>
              Barber Shop s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour
              des informations diffusées sur ce site, mais ne peut garantir l&apos;absence
              d&apos;erreur ou d&apos;interruption du service. L&apos;utilisation des
              informations et contenus disponibles sur ce site se fait sous
              l&apos;entière responsabilité de l&apos;utilisateur.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Données personnelles</h2>
            <p>
              Le traitement des données personnelles collectées via ce site (formulaires
              de réservation et de contact) est détaillé dans notre{" "}
              <Link href="/politique-confidentialite">politique de confidentialité</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
