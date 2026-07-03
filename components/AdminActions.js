"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StatusButtons({ id, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next) {
    setBusy(true);
    await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      <button
        disabled={busy || status === "confirmée"}
        onClick={() => setStatus("confirmée")}
        className="btn btn-outline"
        style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }}
      >
        Confirmer
      </button>
      <button
        disabled={busy || status === "annulée"}
        onClick={() => setStatus("annulée")}
        className="btn btn-outline"
        style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }}
      >
        Annuler
      </button>
    </div>
  );
}

export function MarkReadButton({ id, read }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function markRead() {
    setBusy(true);
    await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
    setBusy(false);
    router.refresh();
  }

  if (read) return <span className="badge">Lu</span>;
  return (
    <button disabled={busy} onClick={markRead} className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }}>
      Marquer comme lu
    </button>
  );
}

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="btn btn-outline" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}>
      Se déconnecter
    </button>
  );
}
