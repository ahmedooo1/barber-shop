/**
 * Barber Shop - couche de stockage.
 *
 * Stockage en base MySQL (compatible avec tout hébergeur MySQL classique :
 * Aiven, TiDB Serverless, Clever Cloud, VPS auto-hébergé...). Les tables
 * sont créées automatiquement si elles n'existent pas encore (aucune
 * étape de migration manuelle nécessaire).
 *
 * Toutes les fonctions exportées ci-dessous gardent exactement la même
 * signature qu'avec l'ancien stockage JSON : aucun autre fichier du
 * projet n'a besoin de changer.
 */

import crypto from "crypto";
import { getReadyPool } from "./mysql";

// Prestations par défaut, insérées une seule fois si la table "services"
// est vide (première mise en route) - reprend le contenu qui était
// jusque-là codé en dur dans app/services/page.js, pour ne rien perdre
// lors du passage en gestion depuis l'admin.
const DEFAULT_SERVICES = [
  { category: "Coupes Homme", name: "Coupe classique", description: "Coupe aux ciseaux et/ou tondeuse, finitions soignées.", price: "25€", duration: "30 min" },
  { category: "Coupes Homme", name: "Coupe + dégradé (fade)", description: "Dégradé progressif, contours précis à la tondeuse.", price: "30€", duration: "40 min" },
  { category: "Coupes Homme", name: "Coupe + shampoing", description: "Coupe complète avec shampoing et coiffage.", price: "28€", duration: "35 min" },
  { category: "Coupes Homme", name: "Coupe enfant (-12 ans)", description: "Coupe adaptée, dans la douceur et la bonne humeur.", price: "18€", duration: "25 min" },
  { category: "Barbe & Rasage", name: "Taille de barbe", description: "Mise en forme et équilibrage selon votre visage.", price: "18€", duration: "20 min" },
  { category: "Barbe & Rasage", name: "Rasage traditionnel au coupe-chou", description: "Serviette chaude, mousse et rasage à l'ancienne.", price: "25€", duration: "30 min" },
  { category: "Barbe & Rasage", name: "Contour à la cire chaude", description: "Finitions nettes du contour de barbe.", price: "15€", duration: "15 min" },
  { category: "Barbe & Rasage", name: "Taille de moustache", description: "Précision au ciseau et à la tondeuse fine.", price: "10€", duration: "10 min" },
  { category: "Formules Combo", name: "Coupe + Barbe", description: "Notre formule la plus demandée.", price: "40€", duration: "55 min" },
  { category: "Formules Combo", name: "Formule Prestige", description: "Coupe + barbe + soin du visage complet.", price: "55€", duration: "75 min" },
  { category: "Formules Combo", name: "Formule Marié", description: "Coupe + barbe + soin + shampoing, pour le grand jour.", price: "65€", duration: "90 min" },
  { category: "Soins & Extras", name: "Soin du visage", description: "Nettoyage, gommage et hydratation.", price: "20€", duration: "20 min" },
  { category: "Soins & Extras", name: "Gommage du cuir chevelu", description: "Soin exfoliant pour un cuir chevelu sain.", price: "15€", duration: "15 min" },
  { category: "Soins & Extras", name: "Coloration barbe", description: "Uniformise et couvre les poils blancs.", price: "20€", duration: "25 min" },
  { category: "Soins & Extras", name: "Épilation nez / oreilles", description: "Finition rapide et discrète.", price: "8€", duration: "10 min" },
];

let schemaReady;

function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const pool = await getReadyPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reservations (
          id CHAR(36) PRIMARY KEY,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'en_attente',
          name VARCHAR(100) NOT NULL,
          phone VARCHAR(30) NOT NULL,
          email VARCHAR(150) NOT NULL,
          service VARCHAR(150) NOT NULL,
          barber VARCHAR(60) NULL,
          res_date VARCHAR(20) NOT NULL,
          res_time VARCHAR(20) NOT NULL,
          message TEXT NULL,
          INDEX idx_date_time (res_date, res_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id CHAR(36) PRIMARY KEY,
          created_at DATETIME NOT NULL,
          is_read TINYINT(1) NOT NULL DEFAULT 0,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL,
          subject VARCHAR(200) NULL,
          message TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS services (
          id CHAR(36) PRIMARY KEY,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NULL,
          category VARCHAR(60) NOT NULL,
          name VARCHAR(150) NOT NULL,
          description VARCHAR(300) NULL,
          price VARCHAR(30) NOT NULL,
          duration VARCHAR(30) NULL,
          sort_order INT NOT NULL DEFAULT 0,
          INDEX idx_category (category, sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      const [[{ count }]] = await pool.query(`SELECT COUNT(*) AS count FROM services`);
      if (count === 0) {
        for (let i = 0; i < DEFAULT_SERVICES.length; i++) {
          const s = DEFAULT_SERVICES[i];
          await pool.query(
            `INSERT INTO services (id, created_at, category, name, description, price, duration, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), new Date(), s.category, s.name, s.description, s.price, s.duration, i]
          );
        }
      }
    })();
  }
  return schemaReady;
}

function makeId() {
  return crypto.randomUUID();
}

function toIso(value) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toReservation(row) {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    updatedAt: row.updated_at ? toIso(row.updated_at) : undefined,
    status: row.status,
    name: row.name,
    phone: row.phone,
    email: row.email,
    service: row.service,
    barber: row.barber || "",
    date: row.res_date,
    time: row.res_time,
    message: row.message || "",
  };
}

function toMessage(row) {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    read: !!row.is_read,
    name: row.name,
    email: row.email,
    subject: row.subject || "",
    message: row.message,
  };
}

function toService(row) {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    updatedAt: row.updated_at ? toIso(row.updated_at) : undefined,
    category: row.category,
    name: row.name,
    description: row.description || "",
    price: row.price,
    duration: row.duration || "",
    sortOrder: row.sort_order,
  };
}

/* ---------------- Reservations ---------------- */

export async function addReservation(entry) {
  await ensureSchema();
  const pool = await getReadyPool();
  const id = makeId();
  const createdAt = new Date();

  await pool.query(
    `INSERT INTO reservations (id, created_at, status, name, phone, email, service, barber, res_date, res_time, message)
     VALUES (?, ?, 'en_attente', ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      createdAt,
      entry.name,
      entry.phone,
      entry.email,
      entry.service,
      entry.barber || "",
      entry.date,
      entry.time,
      entry.message || "",
    ]
  );

  return {
    id,
    createdAt: createdAt.toISOString(),
    status: "en_attente",
    ...entry,
  };
}

export async function listReservations() {
  await ensureSchema();
  const pool = await getReadyPool();
  const [rows] = await pool.query(`SELECT * FROM reservations ORDER BY created_at DESC`);
  return rows.map(toReservation);
}

export async function updateReservationStatus(id, status) {
  await ensureSchema();
  const pool = await getReadyPool();
  const [result] = await pool.query(
    `UPDATE reservations SET status = ?, updated_at = ? WHERE id = ?`,
    [status, new Date(), id]
  );
  if (result.affectedRows === 0) return null;

  const [rows] = await pool.query(`SELECT * FROM reservations WHERE id = ?`, [id]);
  return rows[0] ? toReservation(rows[0]) : null;
}

/* ---------------- Contact messages ---------------- */

export async function addMessage(entry) {
  await ensureSchema();
  const pool = await getReadyPool();
  const id = makeId();
  const createdAt = new Date();

  await pool.query(
    `INSERT INTO messages (id, created_at, is_read, name, email, subject, message)
     VALUES (?, ?, 0, ?, ?, ?, ?)`,
    [id, createdAt, entry.name, entry.email, entry.subject || "", entry.message]
  );

  return {
    id,
    createdAt: createdAt.toISOString(),
    read: false,
    ...entry,
  };
}

export async function listMessages() {
  await ensureSchema();
  const pool = await getReadyPool();
  const [rows] = await pool.query(`SELECT * FROM messages ORDER BY created_at DESC`);
  return rows.map(toMessage);
}

export async function markMessageRead(id) {
  await ensureSchema();
  const pool = await getReadyPool();
  const [result] = await pool.query(`UPDATE messages SET is_read = 1 WHERE id = ?`, [id]);
  if (result.affectedRows === 0) return null;

  const [rows] = await pool.query(`SELECT * FROM messages WHERE id = ?`, [id]);
  return rows[0] ? toMessage(rows[0]) : null;
}

/* ---------------- Services & tarifs ---------------- */

export async function listServices() {
  await ensureSchema();
  const pool = await getReadyPool();
  const [rows] = await pool.query(`SELECT * FROM services ORDER BY category, sort_order, name`);
  return rows.map(toService);
}

export async function addService(entry) {
  await ensureSchema();
  const pool = await getReadyPool();
  const id = crypto.randomUUID();
  const createdAt = new Date();

  await pool.query(
    `INSERT INTO services (id, created_at, category, name, description, price, duration, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      createdAt,
      entry.category,
      entry.name,
      entry.description || "",
      entry.price,
      entry.duration || "",
      Number.isFinite(entry.sortOrder) ? entry.sortOrder : 0,
    ]
  );

  return { id, createdAt: createdAt.toISOString(), ...entry };
}

export async function updateService(id, entry) {
  await ensureSchema();
  const pool = await getReadyPool();
  const [result] = await pool.query(
    `UPDATE services SET category = ?, name = ?, description = ?, price = ?, duration = ?, sort_order = ?, updated_at = ? WHERE id = ?`,
    [
      entry.category,
      entry.name,
      entry.description || "",
      entry.price,
      entry.duration || "",
      Number.isFinite(entry.sortOrder) ? entry.sortOrder : 0,
      new Date(),
      id,
    ]
  );
  if (result.affectedRows === 0) return null;

  const [rows] = await pool.query(`SELECT * FROM services WHERE id = ?`, [id]);
  return rows[0] ? toService(rows[0]) : null;
}

export async function deleteService(id) {
  await ensureSchema();
  const pool = await getReadyPool();
  const [result] = await pool.query(`DELETE FROM services WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}
