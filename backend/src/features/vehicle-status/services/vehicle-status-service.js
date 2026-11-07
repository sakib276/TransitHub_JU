/**
 * Business logic service for managing vehicle status data.
 * 
 * @module
 */

import vehicleStatusRepository from '../repositories/vehicle-status-repository.js';
import { DriverStatus, FleetStatus } from '../constants/vehicle-status-constants.js';


/**
 * Service class handling driver status operations and validations rules.
 */

class VehicleStatusService {
    /**
     * Gets the current operational status for a driver.
     * 
     * @param {number} driverId - The ID of the driver.
     * @returns {Promise<Object|null>} - A promise that resolves to an object containing vehicle details and null if not found.
     */
    async getDriverStatus(driverId) {
    const vehicle = await vehicleStatusRepository.findVehicleByDriverId(driverId);
    if (!vehicle) {
      const notFoundError = new Error('No vehicle assigned to this driver.');
      notFoundError.status = 404;
      throw notFoundError;
    }
    return vehicle;
  }
/**
   * Validates and updates the driver's operational status.
   *
   * @param {number} driverId - Driver user identifier.
   * @param {Object} statusPayload - Status update payload.
   * @param {string} statusPayload.driverStatus - Target status ('Available', 'Busy', 'Offline').
   * @param {number} [statusPayload.currentLocationId] - Selected stand ID (mandatory for Available).
   * @param {number} [statusPayload.destinationLocationId] - Route destination ID (mandatory for Busy).
   * @param {number} [statusPayload.availableSeats] - Number of available seats.
   * @returns {Promise<Object>} Updated vehicle record.
   */
  async changeDriverStatus(driverId, statusPayload) {
    const vehicle = await vehicleStatusRepository.findVehicleByDriverId(driverId);
    if (!vehicle) {
      const notFoundError = new Error('No vehicle assigned to this driver.');
      notFoundError.status = 404;
      throw notFoundError;
    }
 // Block driver status changes if vehicle is Under Maintenance or Inactive

 const isVehicleOperational = vehicle.fleetStatus === FleetStatus.ACTIVE;
    if (!isVehicleOperational) {
      const maintenanceError = new Error(
        `Cannot update status. Vehicle is currently ${vehicle.fleetStatus}.`
      );
      maintenanceError.status = 400;
      throw maintenanceError;
    }
    let targetDriverStatus = statusPayload.driverStatus;
    let targetCurrentLocationId = null;
    let targetDestinationLocationId = null;
    let targetAvailableSeats = vehicle.capacity;
    if (targetDriverStatus === DriverStatus.AVAILABLE) {
      const hasSelectedStand = Boolean(statusPayload.currentLocationId);
      if (!hasSelectedStand) {
        const validationError = new Error('Please select your current stand.');
        validationError.status = 400;
        throw validationError;
      }
      targetCurrentLocationId = Number(statusPayload.currentLocationId);
      targetDestinationLocationId = null;
      targetAvailableSeats = vehicle.capacity;
    } else if (targetDriverStatus === DriverStatus.BUSY) {
      const hasSelectedDestination = Boolean(statusPayload.destinationLocationId);
      if (!hasSelectedDestination) {
        const validationError = new Error('Please select your route destination.');
        validationError.status = 400;
        throw validationError;
      }
      targetCurrentLocationId = statusPayload.currentLocationId
        ? Number(statusPayload.currentLocationId)
        : vehicle.currentLocationId;
      targetDestinationLocationId = Number(statusPayload.destinationLocationId);
      const requestedSeats = statusPayload.availableSeats !== undefined
        ? Number(statusPayload.availableSeats)
        : 0;
      targetAvailableSeats = Math.max(0, Math.min(requestedSeats, vehicle.capacity));
      // Mark as Busy & Full when remaining seats are 0
      if (targetAvailableSeats === 0) {
        targetDriverStatus = DriverStatus.BUSY_AND_FULL;
      }
    } else if (targetDriverStatus === DriverStatus.OFFLINE) {
      targetCurrentLocationId = null;
      targetDestinationLocationId = null;
      targetAvailableSeats = 0;
    } else {
      const invalidStatusError = new Error('Invalid vehicle status specified.');
      invalidStatusError.status = 400;
      throw invalidStatusError;
    }
    await vehicleStatusRepository.updateDriverStatus(driverId, {
      driverStatus: targetDriverStatus,
      currentLocationId: targetCurrentLocationId,
      destinationLocationId: targetDestinationLocationId,
      availableSeats: targetAvailableSeats,
    });
    return await vehicleStatusRepository.findVehicleByDriverId(driverId);
  }
  /**
   * Retrieves all available stands in the campus.
   *
   * @returns {Promise<Array<Object>>} Location records.
   */
  async getLocations() {
    return await vehicleStatusRepository.findAllLocations();
  }
}
export default new VehicleStatusService();