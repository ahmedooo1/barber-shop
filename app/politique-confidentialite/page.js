import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site Barber Shop : données collectées, finalités, durée de conservation, droits RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Politique de confidentialité</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Politique de confidentialité</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: "2rem" }}>
              Cette politique explique quelles données personnelles sont collectées sur ce
              site, pourquoi, combien de temps elles sont conservées, et comment exercer
              vos droits, conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Responsable du traitement</h2>
            <p style={{ marginBottom: "2rem" }}>
              Barber Shop, 12 Rue de la Paix, 75002 Paris - <a href="mailto:contact@barbershop-paris.fr">contact@barbershop-paris.fr</a>.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Données collectées</h2>
            <p style={{ marginBottom: "0.6rem" }}>
              Deux formulaires collectent des données personnelles sur ce site :
            </p>
            <ul style={{ marginBottom: "2rem", paddingLeft: "1.2rem", listStyle: "disc" }}>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong style={{ color: "var(--cream)" }}>Formulaire de réservation</strong> : nom, téléphone,
                e-mail, prestation choisie, barbier préféré, date et heure souhaitées, message
                facultatif.
              </li>
              <li>
                <strong style={{ color: "var(--cream)" }}>Formulaire de contact</strong> : nom, e-mail, sujet
                et message.
              </li>
            </ul>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Finalités du traitement</h2>
            <p style={{ marginBottom: "2rem" }}>
              Ces données sont utilisées exclusivement pour traiter les demandes de
              rendez-vous, confirmer ou modifier une réservation, et répondre aux messages
              envoyés via le formulaire de contact. Elles ne sont ni vendues, ni cédées, ni
              utilisées à des fins commerciales ou publicitaires par un tiers.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Base légale</h2>
            <p style={{ marginBottom: "2rem" }}>
              Le traitement repose sur l&apos;exécution de mesures précontractuelles prises
              à la demande de la personne concernée (organisation du rendez-vous) et sur
              l&apos;intérêt légitime du salon à répondre aux demandes de contact.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Destinataires des données</h2>
            <p style={{ marginBottom: "2rem" }}>
              Seule l&apos;équipe du salon Barber Shop a accès à ces données, via un
              panneau d&apos;administration protégé par mot de passe. Les notifications de
              nouvelle réservation ou de nouveau message sont envoyées par e-mail à
              l&apos;adresse de gestion du salon.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Durée de conservation</h2>
            <p style={{ marginBottom: "2rem" }}>
              Les données de réservation et de contact sont conservées pendant une durée
              maximale de 3 ans à compter du dernier contact, sauf obligation légale de
              conservation plus longue. Elles peuvent être supprimées sur simple demande
              (voir « Vos droits » ci-dessous).
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Hébergement des données</h2>
            <p style={{ marginBottom: "2rem" }}>
              Les données sont stockées sur le serveur d&apos;hébergement du site
              (voir les <Link href="/mentions-legales">mentions légales</Link>) et ne sont
              transférées hors de l&apos;Union européenne que si l&apos;hébergeur choisi le
              prévoit dans ses propres conditions.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Cookies</h2>
            <p style={{ marginBottom: "2rem" }}>
              Ce site n&apos;utilise aucun cookie de mesure d&apos;audience ni de
              publicité. Un unique cookie technique, strictement nécessaire, est déposé
              lors de la connexion au panneau d&apos;administration afin de maintenir la
              session de l&apos;administrateur connecté ; il ne concerne pas les visiteurs
              du site.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Vos droits</h2>
            <p style={{ marginBottom: "2rem" }}>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
              rectification, d&apos;effacement et d&apos;opposition sur vos données
              personnelles. Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@barbershop-paris.fr">contact@barbershop-paris.fr</a>.
              Vous disposez également du droit d&apos;introduire une réclamation auprès de
              la CNIL (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.
            </p>

            <h2 style={{ color: "var(--cream)", marginBottom: "0.8rem" }}>Sécurité</h2>
            <p>
              Les échanges avec le site sont chiffrés (HTTPS) et l&apos;accès au panneau
              d&apos;administration est protégé par mot de passe et limité en tentatives de
              connexion pour prévenir les accès non autorisés.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
