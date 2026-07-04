import Link from "next/link";
import { InstagramIcon } from "@/components/Icons";

export const metadata = {
  title: "Notre Équipe",
  description: "Rencontrez l'équipe de barbiers du Barber Shop Elbeuf : Karim, Yanis, Sofiane et Nadia.",
};

const TEAM = [
  { name: "Karim", role: "Fondateur & Barbier Senior", bio: "15 ans d'expérience. Spécialiste des dégradés précis et du rasage traditionnel au coupe-chou.", photo: "photo-1651684215020-f7a5b6610f23" },
  { name: "Yanis", role: "Barbier Styliste", bio: "Expert des coupes modernes, du texturé et de la coloration barbe. Toujours à l'affût des dernières tendances.", photo: "photo-1758598305480-176fb2ee4d5c" },
  { name: "Sofiane", role: "Barbier", bio: "Spécialiste de la barbe et des soins du visage. Précision et douceur dans chaque geste.", photo: "photo-1674851993962-5ea73166e6dd" },
  { name: "Nadia", role: "Barbière", bio: "Coupes de précision et spécialiste des coupes enfants, dans la bonne humeur.", photo: "photo-1745434159123-5b99b94206ca" },
];

export default function EquipePage() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Des barbiers passionnés</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Équipe</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <p style={{ color: "var(--muted)" }}>Chaque membre de l&apos;équipe apporte sa touche et son expertise pour vous offrir le meilleur service, quel que soit le barbier choisi.</p>
          </div>

          <div className="grid grid-4">
            {TEAM.map((m) => (
              <div className="team-card reveal" key={m.name}>
                <div className="avatar">
                  <img
                    className="photo-fill"
                    src={`https://images.unsplash.com/${m.photo}?q=80&w=500&h=580&auto=format&fit=crop&crop=faces`}
                    alt={`Portrait de ${m.name}, ${m.role}`}
                    loading="lazy"
                  />
                </div>
                <h3>{m.name}</h3>
                <span className="role">{m.role}</span>
                <p>{m.bio}</p>
                <div className="social-row">
                  <a href="#" aria-label="Instagram"><InstagramIcon width="14" height="14" /></a>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-banner reveal" style={{ marginTop: "3.5rem" }}>
            <h2>Choisissez votre barbier</h2>
            <p>Lors de la réservation en ligne, sélectionnez le barbier de votre choix ou laissez-nous vous assigner le premier disponible.</p>
            <div className="cta-actions">
              <Link href="/reservation" className="btn btn-primary">Réserver maintenant</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
