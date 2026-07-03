import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/session";
import { listReservations, listMessages } from "@/lib/db";
import { StatusButtons, MarkReadButton, LogoutButton } from "@/components/AdminActions";

export const metadata = { title: "Panneau Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  en_attente: "En attente",
  "confirmée": "Confirmée",
  "annulée": "Annulée",
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const reservations = await listReservations();
  const messages = await listMessages();
  const pending = reservations.filter((r) => r.status === "en_attente").length;
  const unread = messages.filter((m) => !m.read).length;

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1>Tableau de bord</h1>
          </div>
          <LogoutButton />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: "2.5rem" }}>
            <div className="card"><h3>{reservations.length}</h3><p>Réservations au total</p></div>
            <div className="card"><h3>{pending}</h3><p>En attente de confirmation</p></div>
            <div className="card"><h3>{unread}</h3><p>Messages non lus</p></div>
          </div>

          <h2 style={{ marginBottom: "1.4rem" }}>Réservations</h2>
          <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
            <table className="hours-table" style={{ width: "100%", minWidth: 720 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--gold-light)" }}>
                  <th style={{ padding: "0.6rem 0" }}>Client</th>
                  <th>Contact</th>
                  <th>Prestation</th>
                  <th>Date / Heure</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "1rem 0", color: "var(--muted)" }}>Aucune réservation pour l&apos;instant.</td></tr>
                )}
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td style={{ padding: "0.7rem 0" }}>{r.name}<br /><span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{r.barber || "Indifférent"}</span></td>
                    <td>{r.phone}<br /><span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{r.email}</span></td>
                    <td>{r.service}</td>
                    <td>{r.date} · {r.time}</td>
                    <td><span className="badge">{STATUS_LABEL[r.status] || r.status}</span></td>
                    <td><StatusButtons id={r.id} status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginBottom: "1.4rem" }}>Messages de contact</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="hours-table" style={{ width: "100%", minWidth: 680 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--gold-light)" }}>
                  <th style={{ padding: "0.6rem 0" }}>Nom</th>
                  <th>E-mail</th>
                  <th>Message</th>
                  <th>Reçu le</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "1rem 0", color: "var(--muted)" }}>Aucun message pour l&apos;instant.</td></tr>
                )}
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td style={{ padding: "0.7rem 0" }}>{m.name}</td>
                    <td>{m.email}</td>
                    <td style={{ maxWidth: 320 }}>{m.subject && <strong>{m.subject}<br /></strong>}{m.message}</td>
                    <td>{new Date(m.createdAt).toLocaleString("fr-FR")}</td>
                    <td><MarkReadButton id={m.id} read={m.read} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
