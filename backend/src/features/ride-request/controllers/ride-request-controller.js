import {
  acceptRideRequest as assignRideRequest,
  createRideRequest as enqueueRideRequest,
  getDrivers,
  getDriverVehicle,
  getLocations,
  getRideRequests,
  rejectRideRequest as cancelRideRequest,
  setDriverStatus,
} from "../services/ride-request-service.js";

const CLIENT_ERROR_CODES = new Set([
  "ACTIVE_REQUEST_EXISTS",
  "DRIVER_NOT_AVAILABLE",
  "DRIVER_ALREADY_REJECTED",
  "INVALID_GENDER_PREFERENCE",
  "INVALID_DRIVER_STATUS",
  "INVALID_ID",
  "INVALID_PRIORITY_REASON",
  "INVALID_SEAT_COUNT",
  "INVALID_STATUS",
  "LOCATION_NOT_FOUND",
  "NOT_ENOUGH_SEATS",
  "PASSENGER_NOT_FOUND",
  "REQUEST_NOT_FOUND",
  "REQUEST_NOT_WAITING",
  "SAME_LOCATION",
  "SEAT_COUNT_MISMATCH",
  "VEHICLE_NOT_AVAILABLE",
]);

/**
 * Returns active locations.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} JSON response.
 */
export async function listLocations(req, res) {
  try {
    const locations = await getLocations();
    return res.json({ data: locations });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * Returns one driver's active vehicle details.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} JSON response.
 */
export async function getDriverVehicleDetails(req, res) {
  try {
    const vehicle = await getDriverVehicle(req.params.driverId, req.query.vehicleId);
    return res.json({ data: vehicle });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * Updates an operational driver status.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} Updated status response.
 */
export async function updateDriverStatus(req, res) {
  try {
    const driverStatus = await setDriverStatus(
      req.params.driverId,
      req.body.vehicleId,
      req.body.status
    );

    return res.json({ data: driverStatus });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * Returns queue entries with optional passenger/status filters.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} JSON response.
 */
export async function listRideRequests(req, res) {
  try {
    const passengerId = req.query.passengerId
      ? parsePositiveInteger(req.query.passengerId)
      : undefined;
    const requests = await getRideRequests({
      passengerId,
      driverId: req.query.driverId
        ? parsePositiveInteger(req.query.driverId)
        : undefined,
      status: req.query.status || undefined,
    });

    return res.json({ data: requests });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * Returns available drivers matching the requested seat count.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} JSON response.
 */
export async function listAvailableDrivers(req, res) {
  try {
    const drivers = await getDrivers(req.query.seatsNeeded);
    return res.json({ data: drivers });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * Creates a ride request in the passenger queue.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} Created queue entry response.
 */
export async function createRideRequest(req, res) {
  try {
    const rideRequest = await enqueueRideRequest(req.body);
    return res.status(201).json({ data: rideRequest });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * Assigns a queue entry to a driver and vehicle.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} Created assignment response.
 */
export async function acceptRideRequest(req, res) {
  try {
    const assignment = await assignRideRequest(req.params.id, req.body);
    return res.status(201).json({ data: assignment });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * Cancels a waiting queue entry.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<object>} Success response.
 */
export async function rejectRideRequest(req, res) {
  try {
    if (req.body.driverId) {
      await cancelRideRequest(req.params.id, req.body.driverId);
      return res.json({ message: "Ride offer declined for this driver." });
    }

    await cancelRideRequest(req.params.id);
    return res.json({ message: "Ride request cancelled." });
  } catch (error) {
    return sendError(res, error);
  }
}

function parsePositiveInteger(value) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    const error = new Error("Passenger ID must be a positive integer.");
    error.code = "INVALID_ID";
    throw error;
  }

  return parsedValue;
}

function sendError(res, error) {
  if (CLIENT_ERROR_CODES.has(error.code)) {
    const statusCode = error.code === "REQUEST_NOT_FOUND" ||
      error.code === "PASSENGER_NOT_FOUND" ||
      error.code === "LOCATION_NOT_FOUND"
      ? 404
      : 400;

    return res.status(statusCode).json({ message: error.message, code: error.code });
  }

  console.error("Ride request API error:", error);
  return res.status(500).json({ message: "Ride request operation failed." });
}
