import mysql from "mysql2/promise";

/**
 * Connexion MySQL partagée (pool). Fonctionne avec n'importe quel
 * hébergeur MySQL compatible (Aiven, TiDB Serverless, Clever Cloud,
 * un VPS auto-hébergé, etc.) : soit via une URL unique (MYSQL_URL),
 * soit via des variables séparées (MYSQL_HOST, MYSQL_PORT, ...).
 */

let pool;
let poolReady;

function isTransientConnectionError(error) {
  return ["ECONNREFUSED", "PROTOCOL_CONNECTION_LOST", "ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(error?.code);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPool() {
  const useSsl = process.env.MYSQL_SSL === "true";

  if (process.env.MYSQL_URL) {
    return mysql.createPool({
      uri: process.env.MYSQL_URL,
      waitForConnections: true,
      connectionLimit: 8,
      dateStrings: false,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      ssl: useSsl ? { rejectUnauthorized: true } : undefined,
    });
  }

  return mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 8,
    dateStrings: false,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: useSsl ? { rejectUnauthorized: true } : undefined,
  });
}

export function getPool() {
  if (pool) return pool;

  pool = createPool();

  return pool;
}

export async function getReadyPool() {
  if (poolReady) return poolReady;

  poolReady = (async () => {
    const maxAttempts = 8;
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const currentPool = getPool();

      try {
        await currentPool.query("SELECT 1");
        return currentPool;
      } catch (error) {
        lastError = error;

        if (!isTransientConnectionError(error) || attempt === maxAttempts) {
          throw error;
        }

        pool = undefined;
        currentPool.end().catch(() => {});
        await sleep(1000 * attempt);
      }
    }

    throw lastError;
  })();

  try {
    return await poolReady;
  } finally {
    poolReady = undefined;
  }
}
