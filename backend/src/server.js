/**
 * @file Starts the TransitHub_JU backend server.
 */

import dotenv from 'dotenv';

import { createApp } from './app.js';
import { createDatabase } from './config/database.js';

dotenv.config();

/**
 * Create the real MySQL database connection pool.
 */
const db = createDatabase();

/**
 * Create the Express application with the real database.
 */
const application = createApp({
  db,
});

/**
 * Server port.
 */
const PORT = Number(process.env.PORT) || 3000;

/**
 * Start the Express server and verify the database connection.
 */
const startServer = async () => {
  try {
    await db.execute('SELECT 1');

    console.log('Database connected successfully.');

    application.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);

    process.exit(1);
  }
};

startServer();