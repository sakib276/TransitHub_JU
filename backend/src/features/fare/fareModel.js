/**
 * @fileoverview Model and data access layer for TransitHub JU fare management and overcharge reporting.
 * @module features/fare/fareModel
 * @author Nazmus Sakib
 * @version 1.0.0
 */

let db = null;
try {
  const dbModule = await import('../../config/database.js').catch(() => null);
  db = dbModule?.default || dbModule;
} catch {
  db = null;
}

/**
 * Predefined official fare matrix for Jahangirnagar University campus routes.
 * @type {Array<Object>}
 */
export const OFFICIAL_CAMPUS_FARES = [
  { id: 1, from: 'Dairy Gate', to: 'Bottola', rickshawFare: 20, autoFare: 15 },
  { id: 2, from: 'Dairy Gate', to: 'Prantic Gate', rickshawFare: 25, autoFare: 20 },
  { id: 3, from: 'Dairy Gate', to: 'CSE Department', rickshawFare: 30, autoFare: 20 },
  { id: 4, from: 'Dairy Gate', to: 'Central Library', rickshawFare: 25, autoFare: 15 },
  { id: 5, from: 'Prantic Gate', to: 'Bottola', rickshawFare: 20, autoFare: 15 },
  { id: 6, from: 'Prantic Gate', to: 'CSE Department', rickshawFare: 20, autoFare: 15 },
  { id: 7, from: 'Bottola', to: 'CSE Department', rickshawFare: 15, autoFare: 10 },
  { id: 8, from: 'Bottola', to: 'Tarabag', rickshawFare: 20, autoFare: 15 }
];

/** In-memory store for reports if database is not active */
const inMemoryOverchargeReports = [];

/**
 * Fare model object containing data manipulation methods.
 */
export const fareModel = {
  /**
   * Retrieves all official campus fare lists.
   * @async
   * @returns {Promise<Array<Object>>} List of all fare routes.
   */
  getAllFares: async () => {
    return OFFICIAL_CAMPUS_FARES;
  },

  /**
   * Finds official fare rates between two specific locations (bidirectional).
   * @async
   * @param {string} from - Starting location.
   * @param {string} to - Destination location.
   * @returns {Promise<Object|null>} Fare route details or null if not found.
   */
  findFareByRoute: async (from, to) => {
    const fromLower = from.trim().toLowerCase();
    const toLower = to.trim().toLowerCase();

    const matchedRoute = OFFICIAL_CAMPUS_FARES.find(
      (item) =>
        (item.from.toLowerCase() === fromLower && item.to.toLowerCase() === toLower) ||
        (item.from.toLowerCase() === toLower && item.to.toLowerCase() === fromLower)
    );

    return matchedRoute || null;
  },

  /**
   * Records a passenger overcharge complaint.
   * @async
   * @param {Object} reportData - Complaint information payload.
   * @returns {Promise<Object>} The persisted complaint record.
   */
  createOverchargeReport: async (reportData) => {
    const newReport = {
      id: inMemoryOverchargeReports.length + 1,
      pickup: reportData.pickup,
      destination: reportData.destination,
      vehicleType: reportData.vehicleType,
      vehicleNumber: reportData.vehicleNumber || 'N/A',
      demandedFare: Number(reportData.demandedFare),
      officialFare: Number(reportData.officialFare || 0),
      comment: reportData.comment || '',
      createdAt: new Date().toISOString()
    };

    if (db && typeof db.query === 'function') {
      try {
        const queryText = `
          INSERT INTO overcharge_reports (pickup, destination, vehicle_type, vehicle_number, demanded_fare, official_fare, comment, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
        `;
        const values = [
          newReport.pickup,
          newReport.destination,
          newReport.vehicleType,
          newReport.vehicleNumber,
          newReport.demandedFare,
          newReport.officialFare,
          newReport.comment,
          newReport.createdAt
        ];
        const res = await db.query(queryText, values);
        return res.rows ? res.rows[0] : newReport;
      } catch (err) {
        console.warn('Database query fallback triggered:', err.message);
      }
    }

    inMemoryOverchargeReports.push(newReport);
    return newReport;
  }
};

export default fareModel;