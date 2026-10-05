/**
 * Condroller handling HTTP requests requests for vehicle status operations.
 * 
 * @module vehicle-status-controller
 */
import vehicleStatusService from '../services/vehicle-status-service.js';

/**
 * controller class for managing vehicle status endpoints.
 */
class VehicleStatusController {
    /**
     * Retrieves the status of the logged-in driver's vehicle.
     * 
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} - A promise that resolves when the response is sent.
     */
     async getStatus(req, res, next) {
    try {
      const driverId = Number(req.query.driverId || 2);
      const vehicleStatus = await vehicleStatusService.getDriverStatus(driverId);
      res.status(200).json({
        success: true,
        data: vehicleStatus,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates the logged-in driver's operational status.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async updateStatus(req, res, next) {
    try {
      const driverId = Number(req.body.driverId || 2);
      const updatedVehicle = await vehicleStatusService.changeDriverStatus(
        driverId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Vehicle status updated successfully.',
        data: updatedVehicle,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Retrives the available stands/locations.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
 async getLocations(req, res, next) {
    try {
      const locations = await vehicleStatusService.getLocations();
      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new VehicleStatusController();
