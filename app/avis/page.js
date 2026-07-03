import Link from "next/link";

export const metadata = {
  title: "Avis Clients",
  description: "Découvrez les avis de nos clients : 4.9/5 sur 238 avis. Merci pour votre confiance.",
};

const REVIEWS = [
  { initials: "JM", name: "Julien M.", meta: "Client depuis 2019", stars: 5, text: "Meilleur barbershop du quartier, toujours impeccable et une ambiance au top." },
  { initials: "KB", name: "Karim B.", meta: "Client fidèle", stars: 5, text: "Karim est un vrai artiste avec le rasoir. Le rasage traditionnel vaut à lui seul le détour." },
  { initials: "TL", name: "Thomas L.", meta: "Client depuis 2022", stars: 4, text: "Très bon accueil, un peu d'attente le samedi, mais le résultat vaut largement le coup." },
  { initials: "AD", name: "Alexandre D.", meta: "Client depuis 2023", stars: 5, text: "Je ne vais nulle part ailleurs depuis 3 ans. Une régularité impressionnante." },
  { initials: "RK", name: "Rachid K.", meta: "Client depuis 2021", stars: 5, text: "Service pro, conseils personnalisés, résultat parfait à chaque fois. Je recommande vivement." },
  { initials: "MS", name: "Mehdi S.", meta: "Client depuis 2020", stars: 5, text: "Le meilleur rasage traditionnel que j'ai eu de ma vie. Une vraie expérience." },
];

function stars(n) {
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}

export default function AvisPage() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Ce que disent nos clients</h1>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <span>Avis</span></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="rating-summary reveal">
            <div className="score">4.9<span style={{ fontSize: "1.2rem", color: "var(--muted)" }}>/5</span></div>
            <div>
              <div className="stars" style={{ fontSize: "1.3rem" }}>★★★★★</div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.3rem" }}>Basé sur 238 avis (Google & Facebook)</p>
            </div>
            <div className="rating-bars">
              {[["5★", 88], ["4★", 9], ["3★", 2], ["2★", 1], ["1★", 0]].map(([label, pct]) => (
                <div className="rating-bar" key={label}>
                  {label}<div className="track"><div className="fill" style={{ width: `${pct}%` }} /></div>{pct}%
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-3">
            {REVIEWS.map((r) => (
              <div className="card testi-card reveal" key={r.initials}>
                <span className="quote-mark">&ldquo;</span>
                <div className="stars">{stars(r.stars)}</div>
                <p className="body">{r.text}</p>
                <div className="testi-person">
                  <div className="testi-avatar">{r.initials}</div>
                  <div><strong>{r.name}</strong><span>{r.meta}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-banner reveal" style={{ marginTop: "3.5rem" }}>
            <h2>Envie de rejoindre nos clients satisfaits ?</h2>
            <p>Réservez votre premier rendez-vous et découvrez pourquoi on nous fait confiance.</p>
            <div className="cta-actions">
              <Link href="/reservation" className="btn btn-primary">Réserver maintenant</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
