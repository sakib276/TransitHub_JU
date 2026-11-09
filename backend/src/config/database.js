import mysql from 'mysql2/promise';

/**
 * One shared MySQL connection pool for the whole backend.
 *
 * A "pool" keeps a few connections open and reuses them, so we don't have to
 * connect to MySQL again for every request. Values come from the .env file.
 *
 * dateStrings: true makes DATETIME columns come back exactly as stored
 * (e.g. "2026-10-05 08:00:00") instead of being converted to another timezone.
 */
export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'transithub_ju',
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
});
