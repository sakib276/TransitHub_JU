/**
 * @file MySQL database connection configuration.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates a MySQL connection pool.
 *
 * A connection pool allows the application to reuse
 * database connections instead of creating a new
 * connection for every request.
 *
 * @returns {import('mysql2/promise').Pool} MySQL connection pool.
 */
const createDatabase = () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
};

export { createDatabase };