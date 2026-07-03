"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const emptyForm = { category: "", name: "", description: "", price: "", duration: "" };

export default function ServiceManager({ services, categories }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...emptyForm, category: categories[0] || "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.success) {
      setErrors(data.errors || { name: "Erreur, réessayez." });
      return;
    }
    setForm({ ...emptyForm, category: categories[0] || "" });
    router.refresh();
  }

  function startEdit(service) {
    setEditingId(service.id);
    setEditForm({
      category: service.category,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
  }

  async function saveEdit(id) {
    setBusy(true);
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setBusy(false);
    if (res.ok) {
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer définitivement cette prestation ?")) return;
    setBusy(true);
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  const grouped = categories.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  }));

  return (
    <div>
      <div className="form-card reveal" style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ marginBottom: "1.2rem" }}>Ajouter une prestation</h3>
        <form onSubmit={handleAdd}>
          <div className="form-grid">
            <div className={`field${errors.category ? " invalid" : ""}`}>
              <label>Catégorie</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="error-msg">{errors.category}</div>
            </div>
            <div className={`field${errors.name ? " invalid" : ""}`}>
              <label>Nom</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ex. Coupe classique" />
              <div className="error-msg">{errors.name}</div>
            </div>
            <div className={`field${errors.price ? " invalid" : ""}`}>
              <label>Tarif</label>
              <input type="text" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Ex. 25€" />
              <div className="error-msg">{errors.price}</div>
            </div>
            <div className="field">
              <label>Durée</label>
              <input type="text" value={form.duration} onChange={(e) => update("duration", e.target.value)} placeholder="Ex. 30 min" />
            </div>
            <div className="field full">
              <label>Description</label>
              <input type="text" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Description courte affichée sur le site" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "..." : "Ajouter"}
          </button>
        </form>
      </div>

      {grouped.map(({ category, items }) => (
        <div key={category} style={{ marginBottom: "2.2rem" }}>
          <h3 style={{ color: "var(--gold-light)", marginBottom: "1rem" }}>{category}</h3>
          {items.length === 0 && <p style={{ color: "var(--muted)" }}>Aucune prestation dans cette catégorie.</p>}
          {items.map((service) => (
            <div key={service.id} className="service-row" style={{ alignItems: "flex-start" }}>
              {editingId === service.id ? (
                <div style={{ width: "100%" }}>
                  <div className="form-grid" style={{ marginBottom: "0.8rem" }}>
                    <div className="field">
                      <label>Catégorie</label>
                      <select value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Nom</label>
                      <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label>Tarif</label>
                      <input type="text" value={editForm.price} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label>Durée</label>
                      <input type="text" value={editForm.duration} onChange={(e) => setEditForm((f) => ({ ...f, duration: e.target.value }))} />
                    </div>
                    <div className="field full">
                      <label>Description</label>
                      <input type="text" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem" }} disabled={busy} onClick={() => saveEdit(service.id)}>
                      Enregistrer
                    </button>
                    <button className="btn btn-outline" style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem" }} onClick={() => setEditingId(null)}>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="name">{service.name}</div>
                    <div className="desc">{service.description}</div>
                  </div>
                  <div className="meta" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div>
                      <div className="price">{service.price}</div>
                      <div className="duration">{service.duration}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }} onClick={() => startEdit(service)}>
                        Modifier
                      </button>
                      <button className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.78rem" }} disabled={busy} onClick={() => handleDelete(service.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
