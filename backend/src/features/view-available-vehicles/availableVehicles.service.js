/**
 * @file availableVehicles.service.js
 * @description Data access layer for querying vehicles from MySQL.
 */

import pool from '../../config/database.js';

/**
 * @typedef {Object} Vehicle
 * @property {number} id - Unique vehicle identifier.
 * @property {string} name - Vehicle name or model.
 * @property {string} type - Vehicle category (e.g. Bus, Microbus).
 * @property {string} license_plate - Unique license plate.
 * @property {number} capacity - Passenger seating capacity.
 * @property {string} status - Vehicle status.
 */

/**
 * Queries the database for all vehicles with status 'available'.
 * @async
 * @function getAvailableVehiclesFromDB
 * @returns {Promise<Vehicle[]>} Array of available vehicle records.
 * @throws {Error} If query fails or database is unreachable.
 */
export async function getAvailableVehiclesFromDB() {
  const query = `
    SELECT id, name, type, license_plate, capacity, status, created_at
    FROM vehicles
    WHERE status = 'available'
    ORDER BY id ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
}