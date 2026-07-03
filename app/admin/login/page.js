"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Identifiants incorrects.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erreur réseau, réessayez.");
      setLoading(false);
    }
  }

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <h1>Connexion Admin</h1>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="form-card reveal in">
            {error && <div className="form-error show">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="username">Identifiant</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
              </div>
              <div className="field">
                <label htmlFor="password">Mot de passe</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
