import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { PhoneIcon, MailIcon, MapPinIcon, InstagramIcon, FacebookIcon } from "@/components/Icons";

export const metadata = {
  title: "Contact",
  description: "Contactez le Barber Shop Paris : adresse, téléphone, e-mail, horaires et formulaire de contact.",
};

export default function ContactPage() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Parlons de votre style</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Contact</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1.4fr", gap: "2.4rem", alignItems: "flex-start" }}>
            <div>
              <div className="info-block reveal">
                <h4>Nos coordonnées</h4>
                <div className="info-row">
                  <span className="ic"><MapPinIcon width="18" height="18" /></span>
                  <div><p>12 Rue de la Paix<br />75002 Paris, France</p></div>
                </div>
                <div className="info-row">
                  <span className="ic"><PhoneIcon width="18" height="18" /></span>
                  <div><p><a href="tel:+33142961010">01 42 96 10 10</a></p></div>
                </div>
                <div className="info-row">
                  <span className="ic"><MailIcon width="18" height="18" /></span>
                  <div><p><a href="mailto:contact@barbershop-paris.fr">contact@barbershop-paris.fr</a></p></div>
                </div>
              </div>

              <div className="info-block reveal">
                <h4>Horaires d&apos;ouverture</h4>
                <table className="hours-table">
                  <tbody>
                    <tr><td>Lundi</td><td>Fermé</td></tr>
                    <tr className="today"><td>Mardi – Vendredi</td><td>9h00 – 19h00</td></tr>
                    <tr><td>Samedi</td><td>9h00 – 18h00</td></tr>
                    <tr><td>Dimanche</td><td>10h00 – 15h00</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="info-block reveal">
                <h4>Suivez-nous</h4>
                <div className="social-row" style={{ justifyContent: "flex-start" }}>
                  <a href="#" aria-label="Instagram"><InstagramIcon width="16" height="16" /></a>
                  <a href="#" aria-label="Facebook"><FacebookIcon width="16" height="16" /></a>
                </div>
              </div>

              <div className="map-box reveal">
                <MapPinIcon width="34" height="34" stroke="#c9a24b" />
                <div>
                  <strong>12 Rue de la Paix, 75002 Paris</strong>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>Carte interactive à intégrer (Google Maps) une fois l&apos;adresse définitive confirmée.</p>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
