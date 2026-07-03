"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BARBERS } from "@/lib/barbers";

const TIMES = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"];

const initial = { name: "", phone: "", email: "", service: "", barber: "", date: "", time: "", message: "", botcheck: "" };

export default function ReservationForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [booked, setBooked] = useState([]); // [{ time, barber }] pour la date choisie
  const [serviceGroups, setServiceGroups] = useState([]); // [{ group, items: [label] }]
  const today = new Date().toISOString().split("T")[0];

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Récupère les prestations (et leurs tarifs) gérées depuis l'admin.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success) return;
        const byCategory = new Map();
        for (const s of data.services) {
          const label = `${s.name} - ${s.price}`;
          if (!byCategory.has(s.category)) byCategory.set(s.category, []);
          byCategory.get(s.category).push(label);
        }
        setServiceGroups(Array.from(byCategory, ([group, items]) => ({ group, items })));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Récupère les créneaux déjà pris dès qu'une date est choisie.
  useEffect(() => {
    if (!form.date) {
      setBooked([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/availability?date=${encodeURIComponent(form.date)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) setBooked(data.booked || []);
      })
      .catch(() => {
        if (!cancelled) setBooked([]);
      });
    return () => {
      cancelled = true;
    };
  }, [form.date]);

  // Un créneau est complet si le barbier choisi y est déjà pris, ou si
  // tous les barbiers y sont déjà pris (cas "Indifférent").
  function isTimeTaken(time) {
    const atTime = booked.filter((b) => b.time === time);
    if (form.barber && atTime.some((b) => b.barber === form.barber)) return true;
    return atTime.length >= BARBERS.length;
  }

  const availableTimes = TIMES.filter((t) => !isTimeTaken(t));

  // Si le créneau sélectionné devient indisponible (changement de date/barbier), on le réinitialise.
  useEffect(() => {
    if (form.time && !availableTimes.includes(form.time)) {
      update("time", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, form.barber, booked]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});

    try {
      const res = await fetch("/api/reservations", {
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
          <strong>Demande envoyée !</strong>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>Nous confirmerons votre créneau par téléphone ou e-mail sous peu.</p>
        </div>
      </div>

      {status === "error" && Object.keys(errors).length === 0 && (
        <div className="form-error show">L&apos;envoi a échoué. Merci de réessayer ou de nous appeler au 01 42 96 10 10.</div>
      )}

      <h3 style={{ marginBottom: "1.6rem" }}>Informations de réservation</h3>

      <form onSubmit={handleSubmit} noValidate>
        {/* Piège à robots, invisible pour les humains */}
        <input type="checkbox" name="botcheck" checked={!!form.botcheck} onChange={() => {}} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        <div className="form-grid">
          <div className={`field${errors.name ? " invalid" : ""}`}>
            <label htmlFor="res-name">Nom complet <span className="req">*</span></label>
            <input id="res-name" type="text" placeholder="Votre nom et prénom" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            <div className="error-msg">{errors.name}</div>
          </div>
          <div className={`field${errors.phone ? " invalid" : ""}`}>
            <label htmlFor="res-phone">Téléphone <span className="req">*</span></label>
            <input id="res-phone" type="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            <div className="error-msg">{errors.phone}</div>
          </div>
          <div className={`field full${errors.email ? " invalid" : ""}`}>
            <label htmlFor="res-email">E-mail <span className="req">*</span></label>
            <input id="res-email" type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            <div className="error-msg">{errors.email}</div>
          </div>
          <div className={`field${errors.service ? " invalid" : ""}`}>
            <label htmlFor="res-service">Prestation <span className="req">*</span></label>
            <select id="res-service" value={form.service} onChange={(e) => update("service", e.target.value)} required>
              <option value="">Choisir une prestation</option>
              {serviceGroups.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.items.map((item) => <option key={item} value={item}>{item}</option>)}
                </optgroup>
              ))}
            </select>
            <div className="error-msg">{errors.service}</div>
          </div>
          <div className="field">
            <label htmlFor="res-barber">Barbier préféré</label>
            <select id="res-barber" value={form.barber} onChange={(e) => update("barber", e.target.value)}>
              <option value="">Indifférent</option>
              <option>Karim</option>
              <option>Yanis</option>
              <option>Sofiane</option>
              <option>Nadia</option>
            </select>
          </div>
          <div className={`field${errors.date ? " invalid" : ""}`}>
            <label htmlFor="res-date">Date <span className="req">*</span></label>
            <input id="res-date" type="date" min={today} value={form.date} onChange={(e) => update("date", e.target.value)} required />
            <div className="error-msg">{errors.date}</div>
          </div>
          <div className={`field${errors.time ? " invalid" : ""}`}>
            <label htmlFor="res-time">Heure <span className="req">*</span></label>
            <select id="res-time" value={form.time} onChange={(e) => update("time", e.target.value)} required>
              <option value="">Choisir un créneau</option>
              {availableTimes.map((t) => <option key={t}>{t}</option>)}
            </select>
            {form.date && availableTimes.length === 0 && (
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "0.4rem" }}>
                Plus aucun créneau disponible ce jour-là pour ce choix. Essayez une autre date ou un autre barbier.
              </p>
            )}
            <div className="error-msg">{errors.time}</div>
          </div>
          <div className="field full">
            <label htmlFor="res-message">Message (optionnel)</label>
            <textarea id="res-message" placeholder="Précisez une demande particulière..." value={form.message} onChange={(e) => update("message", e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={status === "sending"}>
          {status === "sending" ? "Envoi en cours..." : "Confirmer la réservation"}
        </button>
        <p className="form-note">
          Aucun acompte requis. En soumettant, vous acceptez d&apos;être recontacté(e) pour
          confirmer votre rendez-vous. Vos données sont traitées conformément à notre{" "}
          <Link href="/politique-confidentialite">politique de confidentialité</Link>.
        </p>
      </form>
    </div>
  );
}
