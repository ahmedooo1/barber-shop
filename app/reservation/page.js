import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";
import Accordion from "@/components/Accordion";
import { PhoneIcon, MailIcon, MapPinIcon } from "@/components/Icons";

export const metadata = {
  title: "Réserver un créneau",
  description: "Réservez votre rendez-vous en ligne au Barber Shop Paris : choisissez la prestation, le barbier, la date et l'heure. Gratuit et sans engagement.",
};

const FAQ = [
  { q: "Dois-je payer un acompte pour réserver ?", a: "Non, la réservation en ligne est gratuite et sans engagement." },
  { q: "Puis-je annuler ou modifier mon rendez-vous ?", a: "Oui, jusqu'à 24h avant votre créneau, par téléphone ou par e-mail." },
  { q: "Faut-il venir en avance ?", a: "Nous recommandons d'arriver 5 minutes avant votre créneau pour respecter le planning de tous." },
  { q: "Acceptez-vous les paiements par carte ?", a: "Oui, carte bancaire, espèces et paiement sans contact sont acceptés." },
];

export default function ReservationPage() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Réservez votre créneau</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Réservation</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr", gap: "2.4rem", alignItems: "flex-start" }}>
            <ReservationForm />

            <div>
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
                <h4>Contact rapide</h4>
                <div className="info-row">
                  <span className="ic"><PhoneIcon width="18" height="18" /></span>
                  <div><p><a href="tel:+33142961010">01 42 96 10 10</a></p></div>
                </div>
                <div className="info-row">
                  <span className="ic"><MailIcon width="18" height="18" /></span>
                  <div><p><a href="mailto:contact@barbershop-paris.fr">contact@barbershop-paris.fr</a></p></div>
                </div>
                <div className="info-row">
                  <span className="ic"><MapPinIcon width="18" height="18" /></span>
                  <div><p>12 Rue de la Paix, 75002 Paris</p></div>
                </div>
              </div>
              <div className="info-block reveal">
                <h4>Bon à savoir</h4>
                <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Merci d&apos;arriver 5 minutes avant votre créneau. Annulation possible jusqu&apos;à 24h avant, par téléphone ou e-mail.</p>
              </div>
            </div>
          </div>

          <div className="section-head center" style={{ marginTop: "4.5rem" }}>
            <h2>Tout savoir sur la réservation</h2>
          </div>
          <Accordion items={FAQ} />
        </div>
      </section>
    </main>
  );
}
