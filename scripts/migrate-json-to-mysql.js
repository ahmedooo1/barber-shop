/**
 * Migration ponctuelle : importe les anciennes données JSON
 * (data/reservations.json, data/messages.json - utilisées avant le passage
 * à MySQL) vers la base MySQL configurée dans .env.
 *
 * À exécuter une seule fois, après avoir renseigné les variables MYSQL_*
 * dans .env : npm run migrate-json
 */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

async function main() {
  const resPath = path.join(process.cwd(), "data", "reservations.json");
  const msgPath = path.join(process.cwd(), "data", "messages.json");
  const reservations = fs.existsSync(resPath) ? JSON.parse(fs.readFileSync(resPath, "utf8") || "[]") : [];
  const messages = fs.existsSync(msgPath) ? JSON.parse(fs.readFileSync(msgPath, "utf8") || "[]") : [];

  if (reservations.length === 0 && messages.length === 0) {
    console.log("Aucune donnée JSON à migrer (fichiers absents ou vides).");
    return;
  }

  const pool = process.env.MYSQL_URL
    ? mysql.createPool(process.env.MYSQL_URL)
    : mysql.createPool({
        host: process.env.MYSQL_HOST || "127.0.0.1",
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: true } : undefined,
      });

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

  let importedRes = 0;
  for (const r of reservations) {
    try {
      await pool.query(
        `INSERT IGNORE INTO reservations (id, created_at, updated_at, status, name, phone, email, service, barber, res_date, res_time, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id,
          new Date(r.createdAt),
          r.updatedAt ? new Date(r.updatedAt) : null,
          r.status || "en_attente",
          r.name,
          r.phone,
          r.email,
          r.service,
          r.barber || "",
          r.date,
          r.time,
          r.message || "",
        ]
      );
      importedRes++;
    } catch (err) {
      console.error(`Réservation ${r.id} ignorée :`, err.message);
    }
  }

  let importedMsg = 0;
  for (const m of messages) {
    try {
      await pool.query(
        `INSERT IGNORE INTO messages (id, created_at, is_read, name, email, subject, message)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [m.id, new Date(m.createdAt), m.read ? 1 : 0, m.name, m.email, m.subject || "", m.message]
      );
      importedMsg++;
    } catch (err) {
      console.error(`Message ${m.id} ignoré :`, err.message);
    }
  }

  console.log(
    `Terminé : ${importedRes}/${reservations.length} réservations et ${importedMsg}/${messages.length} messages importés.`
  );
  await pool.end();
}

main().catch((err) => {
  console.error("Échec de la migration :", err.message);
  process.exit(1);
});
