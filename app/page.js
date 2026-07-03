import Link from "next/link";
import { ScissorsIcon, RazorIcon, ComboIcon, DropIcon, CheckIcon, ClockIcon, HeartIcon, CalendarIcon, BuildingIcon } from "@/components/Icons";

export default function HomePage() {
  return (
    <main id="main">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>La coupe nette,<br /><em>la tradition</em> du rasage.</h1>
            <p className="hero-lede">Un salon pensé pour l&apos;homme moderne : coupes précises, rasage traditionnel au coupe-chou et conseils personnalisés, dans une ambiance chaleureuse et authentique.</p>
            <div className="hero-actions">
              <Link href="/reservation" className="btn btn-primary">
                <CalendarIcon width="18" height="18" />
                Réserver un créneau
              </Link>
              <Link href="/services" className="btn btn-outline">Voir les tarifs</Link>
            </div>
            <div className="hero-stats reveal">
              <div><strong>15+</strong><span>ans d&apos;expérience</span></div>
              <div><strong>5 200+</strong><span>clients satisfaits</span></div>
              <div><strong>4.9/5</strong><span>note moyenne (238 avis)</span></div>
            </div>
          </div>
          <div className="hero-visual reveal">
            <img
              className="photo-fill"
              src="https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=1200&auto=format&fit=crop"
              alt="Barbier réalisant une coupe de cheveux au sécateur dans un salon"
              loading="eager"
            />
            <div className="badge-float">
              <div className="icon-tile" style={{ width: 44, height: 44 }}>
                <ClockIcon width="20" height="20" />
              </div>
              <div>
                <strong>Ouvert aujourd&apos;hui</strong>
                <span>9h00 – 19h00 · Sans rendez-vous ou en ligne</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="stripe-divider" />

      {/* SERVICES TEASER */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head center">
            <h2>Un savoir-faire pour chaque style</h2>
            <p>Des coupes classiques aux dégradés les plus précis, en passant par le rasage traditionnel : chaque prestation est réalisée avec précision et passion.</p>
          </div>
          <div className="grid grid-4">
            {[
              { Icon: ScissorsIcon, title: "Coupes Homme", text: "Classique, dégradé, tondeuse ou ciseaux - coupée selon votre style et la forme de votre visage." },
              { Icon: RazorIcon, title: "Barbe & Rasage", text: "Taille précise, contours à la cire chaude et rasage traditionnel au coupe-chou pour une peau nette." },
              { Icon: ComboIcon, title: "Formules Combo", text: "Coupe + barbe + soin visage dans une formule complète pour un résultat impeccable de la tête aux épaules." },
              { Icon: DropIcon, title: "Soins & Extras", text: "Soin du visage, gommage du cuir chevelu, coloration barbe : le petit plus qui fait la différence." },
            ].map(({ Icon, title, text }) => (
              <div className="card reveal" key={title}>
                <div className="icon-tile"><Icon width="26" height="26" /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link href="/services" className="learn">Voir les tarifs →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section section-alt">
        <div className="container hero-grid">
          <div className="hero-visual reveal" style={{ order: -1 }}>
            <img
              className="photo-fill"
              src="https://images.unsplash.com/photo-1593702288056-7927b442d0fa?q=80&w=1200&auto=format&fit=crop"
              alt="Barbier coupant les cheveux d'un client en chemise blanche"
              loading="lazy"
            />
            <div className="badge-float">
              <div className="icon-tile" style={{ width: 44, height: 44 }}>
                <HeartIcon width="20" height="20" />
              </div>
              <div>
                <strong>Depuis 2011</strong>
                <span>Une adresse fondée par des passionnés</span>
              </div>
            </div>
          </div>
          <div className="reveal">
            <h2 style={{ margin: "0 0 1.3rem" }}>Une passion transmise, un métier respecté</h2>
            <p style={{ color: "var(--muted)", marginBottom: "1.4rem" }}>Fondé en 2011 par Karim, Barber Shop est né d&apos;une conviction simple : un bon salon se juge à la précision du geste et à la qualité de l&apos;accueil. Depuis, notre équipe de barbiers perfectionne son art chaque jour pour offrir à chaque client une expérience sur-mesure.</p>
            <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>Produits de qualité, outils affûtés avec soin, ambiance conviviale : ici, chaque rendez-vous est un moment pour soi.</p>
            <div className="grid grid-2" style={{ gap: "1rem" }}>
              {[
                "Barbiers experts - Formés aux techniques classiques et modernes.",
                "Produits premium - Une sélection soignée pour cheveux et barbe.",
                "Ambiance unique - Un cadre chaleureux, entre tradition et modernité.",
                "Réservation facile - En ligne, en 2 minutes, sans acompte.",
              ].map((line) => {
                const [title, text] = line.split(" - ");
                return (
                  <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div className="icon-tile" style={{ width: 44, height: 44 }}>
                      <CheckIcon width="18" height="18" />
                    </div>
                    <div>
                      <strong>{title}</strong>
                      <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <h2>Précision, style et finition</h2>
            <p>Un aperçu des coupes et prestations qui font notre réputation.</p>
          </div>
          <div className="grid grid-4">
            {[
              { Icon: ScissorsIcon, cat: "Coupes", label: "Dégradé texturé", photo: "photo-1634302104565-cc698ee83144" },
              { Icon: RazorIcon, cat: "Barbe", label: "Rasage traditionnel", photo: "photo-1533245270348-821d4d5c7514" },
              { Icon: BuildingIcon, cat: "Salon", label: "Ambiance & cadre", photo: "photo-1759134248487-e8baaf31e33e" },
              { Icon: ScissorsIcon, cat: "Coupes", label: "Coupe ciseaux classique", photo: "photo-1503951914875-452162b0f3f1" },
            ].map(({ Icon, cat, label, photo }, i) => (
              <div className="tile reveal" key={i}>
                <img className="photo-fill" src={`https://images.unsplash.com/${photo}?q=80&w=600&auto=format&fit=crop`} alt={label} loading="lazy" />
                <span className="tile-icon"><Icon width="20" height="20" /></span>
                <div><span className="tile-cat">{cat}</span><span className="tile-label">{label}</span></div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "2.4rem" }}>
            <Link href="/galerie" className="btn btn-outline">Découvrir toutes nos réalisations</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS TEASER */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head center">
            <h2>Ce que disent nos clients</h2>
          </div>
          <div className="grid grid-3">
            {[
              { initials: "JM", name: "Julien M.", meta: "Client depuis 2019", text: "Meilleur barbershop du quartier, toujours impeccable et une ambiance au top." },
              { initials: "KB", name: "Karim B.", meta: "Client fidèle", text: "Karim est un vrai artiste avec le rasoir. Le rasage traditionnel vaut à lui seul le détour." },
              { initials: "RK", name: "Rachid K.", meta: "Client depuis 2021", text: "Service pro, conseils personnalisés, résultat parfait à chaque fois. Je recommande vivement." },
            ].map((t) => (
              <div className="card testi-card reveal" key={t.initials}>
                <span className="quote-mark">&ldquo;</span>
                <div className="stars">★★★★★</div>
                <p className="body">{t.text}</p>
                <div className="testi-person">
                  <div className="testi-avatar">{t.initials}</div>
                  <div><strong>{t.name}</strong><span>{t.meta}</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "2.4rem" }}>
            <Link href="/avis" className="btn btn-outline">Lire tous les avis</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>Réservez votre créneau en 2 minutes</h2>
            <p>Choisissez votre prestation, votre barbier et votre horaire préféré. Confirmation immédiate, sans acompte.</p>
            <div className="cta-actions">
              <Link href="/reservation" className="btn btn-primary">Réserver maintenant</Link>
              <a href="tel:+33142961010" className="btn btn-outline">Appeler le salon</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
