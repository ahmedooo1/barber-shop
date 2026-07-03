/**
 * Gabarit d'e-mail HTML aux couleurs du Barber Shop (noir & or).
 *
 * Écrit en tables + styles inline (pas de <style> externe, pas de
 * Flexbox/Grid) pour un rendu fiable dans Gmail, Outlook, Apple Mail,
 * etc. - les clients mail ignorent souvent le CSS moderne.
 */

const GOLD = "#c9a24b";
const GOLD_LIGHT = "#e9cd83";
const BLACK = "#0a0a0b";
const CREAM = "#f4eee0";
const MUTED = "#8a8477";
const TEXT = "#232328";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label, value) {
  return `
    <tr>
      <td style="padding:12px 16px; border-bottom:1px solid #eee2c9; width:150px; font-family:Arial,Helvetica,sans-serif; font-size:12px; font-weight:bold; letter-spacing:0.5px; text-transform:uppercase; color:${GOLD.replace("#c9a24b", "#8a6d24")}; vertical-align:top; background:#fbf8f1;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 16px; border-bottom:1px solid #eee2c9; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${TEXT}; vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

/**
 * @param {Object} opts
 * @param {string} opts.eyebrow   petit libellé au-dessus du titre
 * @param {string} opts.heading   titre principal
 * @param {string} opts.intro     texte d'introduction
 * @param {Array<[string,string]>} opts.rows  paires [label, valeur déjà échappée/HTML]
 * @param {string} [opts.ctaLabel]
 * @param {string} [opts.ctaUrl]
 * @param {string} [opts.footerNote]
 */
export function renderEmail({ eyebrow, heading, intro, rows = [], ctaLabel, ctaUrl, footerNote }) {
  const rowsHtml = rows.map(([label, value]) => row(label, value)).join("");

  const ctaHtml = ctaUrl
    ? `
      <tr>
        <td align="center" style="padding:28px 32px 6px;">
          <a href="${ctaUrl}" style="display:inline-block; background:${GOLD}; color:${BLACK}; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; letter-spacing:0.3px; text-decoration:none; padding:14px 30px; border-radius:999px;">
            ${escapeHtml(ctaLabel || "Voir le détail")}
          </a>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0; padding:0; background:${CREAM}; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e7e0cf;">

          <!-- Header -->
          <tr>
            <td style="background:${BLACK}; padding:34px 32px 26px; text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif; font-size:15px; letter-spacing:3px; color:${GOLD_LIGHT}; margin-bottom:6px;">✂ &nbsp;BARBER&nbsp;SHOP</div>
              <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#7a7468;">Salon de coiffure &amp; barbier - Paris</div>
            </td>
          </tr>
          <tr>
            <td style="background:${GOLD}; height:4px; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Eyebrow + heading -->
          <tr>
            <td style="padding:32px 32px 4px;">
              <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase; color:${GOLD.replace("#c9a24b", "#a9832f")};">${escapeHtml(eyebrow || "")}</div>
              <div style="font-family:Georgia,'Times New Roman',serif; font-size:24px; font-weight:bold; color:${BLACK}; margin-top:6px;">${escapeHtml(heading)}</div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:8px 32px 22px; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:${MUTED};">
              ${intro}
            </td>
          </tr>

          <!-- Details card -->
          <tr>
            <td style="padding:0 32px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee2c9; border-radius:10px; overflow:hidden;">
                ${rowsHtml}
              </table>
            </td>
          </tr>

          ${ctaHtml}

          <!-- Divider -->
          <tr>
            <td style="padding:26px 32px 0;">
              <div style="border-top:1px solid #eee; font-size:0; line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${BLACK}; padding:22px 32px; text-align:center;">
              <div style="font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#c8c0ae; line-height:1.7;">
                <strong style="color:${GOLD_LIGHT};">Barber Shop</strong> - 12 Rue de la Paix, 75002 Paris - 01 42 96 10 10
              </div>
              ${footerNote ? `<div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#8a8477; margin-top:8px;">${footerNote}</div>` : ""}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { escapeHtml };
