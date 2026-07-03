/**
 * Barber Shop - envoi d'e-mails de notification.
 *
 * Utilise Nodemailer avec un compte SMTP (Gmail par défaut : gratuit,
 * pas de plafond artificiel de type "250 envois/mois", uniquement les
 * limites d'envoi normales de Gmail, largement suffisantes pour un
 * salon). Voir .env.example pour la configuration.
 */

import nodemailer from "nodemailer";
import { renderEmail, escapeHtml } from "./emailTemplate";

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null; // pas configuré : on log au lieu d'envoyer (voir plus bas)
  }

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: Number(SMTP_PORT || 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransporter;
}

async function send({ subject, html, replyTo }) {
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  const transporter = getTransporter();

  if (!transporter || !to) {
    console.warn(
      "[mailer] SMTP non configuré (.env) - e-mail non envoyé. Contenu :",
      subject
    );
    return { sent: false, reason: "smtp_not_configured" };
  }

  await transporter.sendMail({
    from: `"Barber Shop - Notifications" <${process.env.SMTP_USER}>`,
    to,
    replyTo,
    subject,
    html,
  });
  return { sent: true };
}

export function sendReservationEmail(r) {
  const siteUrl = process.env.SITE_URL || "";
  const receivedAt = new Date(r.createdAt).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const html = renderEmail({
    eyebrow: "Nouvelle demande",
    heading: "Nouvelle réservation",
    intro: `<strong style="color:${"#232328"};">${escapeHtml(r.name)}</strong> souhaite prendre rendez-vous. Voici le détail de la demande, reçue le ${escapeHtml(receivedAt)}.`,
    rows: [
      ["Nom", escapeHtml(r.name)],
      ["Téléphone", `<a href="tel:${escapeHtml(r.phone)}" style="color:#8a6d24; text-decoration:none;">${escapeHtml(r.phone)}</a>`],
      ["E-mail", `<a href="mailto:${escapeHtml(r.email)}" style="color:#8a6d24; text-decoration:none;">${escapeHtml(r.email)}</a>`],
      ["Prestation", escapeHtml(r.service)],
      ["Barbier", escapeHtml(r.barber || "Indifférent")],
      ["Date", escapeHtml(r.date)],
      ["Heure", escapeHtml(r.time)],
      ["Message", r.message ? escapeHtml(r.message) : "<span style=\"color:#a79f92;\">-</span>"],
    ],
    ctaLabel: "Confirmer dans le tableau de bord",
    ctaUrl: siteUrl ? `${siteUrl}/admin` : undefined,
    footerNote: "Répondez directement à cet e-mail pour écrire au client, ou appelez-le au numéro ci-dessus.",
  });

  return send({ subject: `Nouvelle réservation - ${r.name}`, html, replyTo: r.email });
}

export function sendContactEmail(m) {
  const siteUrl = process.env.SITE_URL || "";
  const receivedAt = new Date(m.createdAt).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const html = renderEmail({
    eyebrow: "Nouveau message",
    heading: "Message de contact",
    intro: `<strong style="color:${"#232328"};">${escapeHtml(m.name)}</strong> vous a écrit depuis le site, le ${escapeHtml(receivedAt)}.`,
    rows: [
      ["Nom", escapeHtml(m.name)],
      ["E-mail", `<a href="mailto:${escapeHtml(m.email)}" style="color:#8a6d24; text-decoration:none;">${escapeHtml(m.email)}</a>`],
      ["Sujet", m.subject ? escapeHtml(m.subject) : "<span style=\"color:#a79f92;\">-</span>"],
      ["Message", escapeHtml(m.message).replace(/\n/g, "<br />")],
    ],
    ctaLabel: "Voir dans le tableau de bord",
    ctaUrl: siteUrl ? `${siteUrl}/admin` : undefined,
    footerNote: "Répondez directement à cet e-mail pour contacter la personne.",
  });

  return send({ subject: `Nouveau message - ${m.name}`, html, replyTo: m.email });
}
