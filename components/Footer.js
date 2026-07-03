import Link from "next/link";
import { ScissorsIcon, InstagramIcon, FacebookIcon } from "./Icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">
              <ScissorsIcon width="26" height="26" stroke="#c9a24b" />
              BARBER<span>SHOP</span>
            </Link>
            <p style={{ marginTop: "1rem", maxWidth: "32ch" }}>
              L&apos;adresse incontournable pour une coupe nette, une barbe soignée et un moment de détente entre hommes.
            </p>
            <div className="social-row" style={{ justifyContent: "flex-start", marginTop: "1.4rem" }}>
              <a href="#" aria-label="Instagram" title="Instagram"><InstagramIcon width="16" height="16" /></a>
              <a href="#" aria-label="Facebook" title="Facebook"><FacebookIcon width="16" height="16" /></a>
            </div>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/services">Services &amp; Tarifs</Link></li>
              <li><Link href="/galerie">Savoir-faire</Link></li>
              <li><Link href="/equipe">Notre équipe</Link></li>
              <li><Link href="/avis">Avis clients</Link></li>
            </ul>
          </div>
          <div>
            <h4>Horaires</h4>
            <table className="hours-table">
              <tbody>
                <tr><td>Lundi</td><td>Fermé</td></tr>
                <tr><td>Mardi – Vendredi</td><td>9h00 – 19h00</td></tr>
                <tr><td>Samedi</td><td>9h00 – 18h00</td></tr>
                <tr><td>Dimanche</td><td>10h00 – 15h00</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li>12 Rue de la Paix, 75002 Paris</li>
              <li><a href="tel:+33142961010">01 42 96 10 10</a></li>
              <li><a href="mailto:contact@barbershop-paris.fr">contact@barbershop-paris.fr</a></li>
            </ul>
            <Link href="/reservation" className="btn btn-primary" style={{ marginTop: "1.2rem", color: "#000", textDecoration: "none" }}>
              Réserver un créneau
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} Barber Shop - Tous droits réservés.</p>
          <p><Link href="/mentions-legales">Mentions légales</Link> · <Link href="/politique-confidentialite">Politique de confidentialité</Link></p>
        </div>
      </div>
    </footer>
  );
}
