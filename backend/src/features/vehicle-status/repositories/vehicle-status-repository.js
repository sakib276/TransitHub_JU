/**
 * Data access repository for vehicle and driver status operations.
 * 
 * @module vehicle-status-repository
 */

import pool from '../../../config/database.js';


/**
 * Vehicle status repository handling database queries.
 */
class VehicleStatusRepository {
/**
 * Retrieves vehicle and driver status details by driver ID.
 * 
 * @param {number} driverId - The ID Unique identifier of the driver.
 * @returns {Promise<Object|null>} - A promise that resolves to an object containing vehicle details and null if not found.
 */
 async findVehicleByDriverId(driverId) {
    const query = `
      SELECT 
        v.id AS vehicleId,
        v.driver_id AS driverId,
        v.plate_number AS plateNumber,
        v.vehicle_type AS vehicleType,
        v.capacity,
        v.available_seats AS availableSeats,
        v.status AS fleetStatus,
        v.driver_status AS driverStatus,
        v.current_location_id AS currentLocationId,
        v.destination_location_id AS destinationLocationId,
        v.status_updated_at AS statusUpdatedAt,
        current_loc.name AS currentLocationName,
        dest_loc.name AS destinationLocationName
      FROM vehicles v
      LEFT JOIN locations current_loc ON v.current_location_id = current_loc.id
      LEFT JOIN locations dest_loc ON v.destination_location_id = dest_loc.id
      WHERE v.driver_id = ?
      LIMIT 1;
    `;
    const [rows] = await pool.execute(query, [driverId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  /**
   * Updates driver operational status , location, and seat count.
   * @param {number} driverId - The ID of the driver.
   * @param {object} updateData - An object containing the fields/Data to update.
   * @param {string} updateData.driverStatus - The new driver operational status.
   * @param {number | null} updateData.currentLocationId - Stand location ID.
   * @param {number | null} updateData.destinationLocationId - Route Destination location ID.
   * @param {number} updateData.availableSeats - The new available seat count.
   * @returns {Promise<boolean>} - A promise that resolves to true if the update was successful, false otherwise.
   */

   async updateDriverStatus(driverId, updateData) {
    const {
      driverStatus,
      currentLocationId,
      destinationLocationId,
      availableSeats,
    } = updateData;
    const query = `
      UPDATE vehicles
      SET 
        driver_status = ?,
        current_location_id = ?,
        destination_location_id = ?,
        available_seats = ?
      WHERE driver_id = ?;
    `;
    const [result] = await pool.execute(query, [
      driverStatus,
      currentLocationId,
      destinationLocationId,
      availableSeats,
      driverId,
    ]);
    return result.affectedRows > 0;
  }

  /**
   * Retrives all active locations/stands
   * 
   * @returns{Promise<Array<Object>>} - A promise that resolves to an array of active location objects.}
   */
  async findAllLocations() {
    const query = `
      SELECT id, name, status 
      FROM locations 
      WHERE status = 'active'
      ORDER BY name ASC;
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }
}
export default new VehicleStatusRepository();