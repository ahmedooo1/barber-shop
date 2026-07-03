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
