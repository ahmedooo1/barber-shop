"use client";

import { useState } from "react";
import Link from "next/link";

const initial = { name: "", email: "", subject: "", message: "", botcheck: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors(data.errors || {});
        setStatus("error");
        return;
      }
      setForm(initial);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 8000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="form-card reveal">
      <div className={`form-success${status === "success" ? " show" : ""}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" /></svg>
        <div>
          <strong>Message envoyé !</strong>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      </div>

      {status === "error" && Object.keys(errors).length === 0 && (
        <div className="form-error show">L&apos;envoi a échoué. Merci de réessayer ou de nous écrire à contact@barbershop-paris.fr.</div>
      )}

      <h3 style={{ marginBottom: "1.6rem" }}>Envoyez-nous un message</h3>
      <form onSubmit={handleSubmit} noValidate>
        <input type="checkbox" name="botcheck" checked={!!form.botcheck} onChange={() => {}} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
        <div className="form-grid">
          <div className={`field${errors.name ? " invalid" : ""}`}>
            <label htmlFor="c-name">Nom complet <span className="req">*</span></label>
            <input id="c-name" type="text" placeholder="Votre nom" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            <div className="error-msg">{errors.name}</div>
          </div>
          <div className={`field${errors.email ? " invalid" : ""}`}>
            <label htmlFor="c-email">E-mail <span className="req">*</span></label>
            <input id="c-email" type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            <div className="error-msg">{errors.email}</div>
          </div>
          <div className="field full">
            <label htmlFor="c-subject">Sujet</label>
            <input id="c-subject" type="text" placeholder="Objet de votre message" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
          </div>
          <div className={`field full${errors.message ? " invalid" : ""}`}>
            <label htmlFor="c-message">Message <span className="req">*</span></label>
            <textarea id="c-message" placeholder="Votre message..." value={form.message} onChange={(e) => update("message", e.target.value)} required />
            <div className="error-msg">{errors.message}</div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={status === "sending"}>
          {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
        </button>
        <p className="form-note">
          Nous répondons généralement sous 24h ouvrées. Vos données sont traitées
          conformément à notre <Link href="/politique-confidentialite">politique de confidentialité</Link>.
        </p>
      </form>
    </div>
  );
}
