import {
  assignRideRequest,
  cancelRideRequest,
  findActiveLocations,
  findAvailableDrivers,
  findDriverVehicle,
  findRideRequests,
  insertRideRequest,
  rejectDriverOffer,
  updateDriverStatus,
} from "../models/ride-request-model.js";

/**
 * @typedef {object} RideRequestInput
 * @property {number|string} passengerId - Active passenger user ID.
 * @property {number|string} pickupLocationId - Active pickup location ID.
 * @property {number|string} destinationLocationId - Active destination location ID.
 * @property {number|string} seatsNeeded - Requested seats, from one through four.
 * @property {"Any"|"Male"|"Female"} [genderPreference="Any"] - Preferred passenger grouping.
 * @property {boolean} [priority=false] - Whether this request needs priority review.
 * @property {"Medical emergency"|"Academic emergency"|"Other"} [priorityReason="Other"] - Priority reason.
 */

/**
 * @typedef {object} RideRequestFilters
 * @property {number|string} [passengerId] - Filter by passenger user ID.
 * @property {number|string} [driverId] - Omit entries declined by this driver.
 * @property {string} [status] - Filter by queue status.
 */

const PRIORITY_REASONS = [
  "Medical emergency",
  "Academic emergency",
  "Other",
];

const REQUEST_STATUSES = [
  "Waiting",
  "Assigned",
  "Completed",
  "No-show",
  "Cancelled",
];

/**
 * Loads active locations from the database.
 *
 * @returns {Promise<Array<object>>} Active campus locations.
 */
export async function getLocations() {
  return findActiveLocations();
}

/**
 * Loads queue entries matching the supplied filters.
 *
 * @param {RideRequestFilters} filters - Optional request filters.
 * @returns {Promise<Array<object>>} Ride requests.
 */
export async function getRideRequests(filters) {
  if (filters.status && !REQUEST_STATUSES.includes(filters.status)) {
    throw createServiceError("INVALID_STATUS", "Ride request status is invalid.");
  }

  return findRideRequests({
    ...filters,
    passengerId: filters.passengerId
      ? parsePositiveInteger(filters.passengerId, "Passenger ID")
      : undefined,
    driverId: filters.driverId
      ? parsePositiveInteger(filters.driverId, "Driver ID")
      : undefined,
  });
}

/**
 * Loads available drivers with enough remaining vehicle seats.
 *
 * @param {number} seatsNeeded - Minimum available seat count.
 * @returns {Promise<Array<object>>} Available drivers.
 */
export async function getDrivers(seatsNeeded) {
  const parsedSeats = Number(seatsNeeded);

  if (!Number.isInteger(parsedSeats) || parsedSeats < 1 || parsedSeats > 4) {
    throw createServiceError(
      "INVALID_SEAT_COUNT",
      "Seat count must be an integer between 1 and 4."
    );
  }

  return findAvailableDrivers(parsedSeats);
}

/**
 * Loads the configured driver's active vehicle details.
 *
 * @param {string|number} driverId - Driver user ID.
 * @param {string|number} vehicleId - Vehicle ID.
 * @returns {Promise<object>} Driver vehicle details.
 */
export async function getDriverVehicle(driverId, vehicleId) {
  const parsedDriverId = parsePositiveInteger(driverId, "Driver ID");
  const parsedVehicleId = parsePositiveInteger(vehicleId, "Vehicle ID");
  const vehicle = await findDriverVehicle(parsedDriverId, parsedVehicleId);

  if (!vehicle) {
    throw createServiceError("VEHICLE_NOT_AVAILABLE", "Active driver vehicle not found.");
  }

  return vehicle;
}

/**
 * Updates the configured driver's operational status.
 *
 * @param {string|number} driverId - Driver user ID.
 * @param {string|number} vehicleId - Vehicle ID.
 * @param {string} status - New driver status.
 * @returns {Promise<object>} Updated driver status.
 */
export async function setDriverStatus(driverId, vehicleId, status) {
  if (!["Available", "Offline"].includes(status)) {
    throw createServiceError(
      "INVALID_DRIVER_STATUS",
      "Driver status must be Available or Offline."
    );
  }

  const parsedDriverId = parsePositiveInteger(driverId, "Driver ID");
  const parsedVehicleId = parsePositiveInteger(vehicleId, "Vehicle ID");
  await updateDriverStatus(parsedDriverId, parsedVehicleId, status);

  return { driverId: parsedDriverId, vehicleId: parsedVehicleId, status };
}

/**
 * Validates and creates a passenger queue entry.
 *
 * @param {RideRequestInput} rideRequest - Incoming ride request data.
 * @returns {Promise<object>} Created queue entry.
 */
export async function createRideRequest(rideRequest) {
  const passengerId = parsePositiveInteger(rideRequest.passengerId, "Passenger ID");
  const pickupLocationId = parsePositiveInteger(
    rideRequest.pickupLocationId,
    "Pickup location"
  );
  const destinationLocationId = parsePositiveInteger(
    rideRequest.destinationLocationId,
    "Destination location"
  );
  const seatsNeeded = Number(rideRequest.seatsNeeded);
  const genderPreference = rideRequest.genderPreference || "Any";
  const priority = rideRequest.priority === true;
  const priorityReason = rideRequest.priorityReason || "Other";

  if (pickupLocationId === destinationLocationId) {
    throw createServiceError(
      "SAME_LOCATION",
      "Pickup and destination must be different."
    );
  }

  if (!Number.isInteger(seatsNeeded) || seatsNeeded < 1 || seatsNeeded > 4) {
    throw createServiceError(
      "INVALID_SEAT_COUNT",
      "Seat count must be an integer between 1 and 4."
    );
  }

  if (!["Any", "Male", "Female"].includes(genderPreference)) {
    throw createServiceError(
      "INVALID_GENDER_PREFERENCE",
      "Gender preference must be Any, Male, or Female."
    );
  }

  if (priority && !PRIORITY_REASONS.includes(priorityReason)) {
    throw createServiceError("INVALID_PRIORITY_REASON", "Priority reason is invalid.");
  }

  return insertRideRequest({
    passengerId,
    pickupLocationId,
    destinationLocationId,
    seatsNeeded,
    genderPreference,
    priority,
    priorityReason,
  });
}

/**
 * Validates and assigns a waiting queue entry to a driver and vehicle.
 *
 * @param {string|number} rideRequestId - Queue entry ID.
 * @param {{driverId: number|string, vehicleId: number|string, seatsAssigned: number|string}} assignment - Driver assignment values.
 * @returns {Promise<object>} Created assignment.
 */
export async function acceptRideRequest(rideRequestId, assignment) {
  return assignRideRequest({
    rideRequestId: parsePositiveInteger(rideRequestId, "Ride request ID"),
    driverId: parsePositiveInteger(assignment.driverId, "Driver ID"),
    vehicleId: parsePositiveInteger(assignment.vehicleId, "Vehicle ID"),
    seatsAssigned: parsePositiveInteger(assignment.seatsAssigned, "Seat count"),
  });
}

/**
 * Cancels a waiting queue entry.
 *
 * @param {string|number} rideRequestId - Queue entry ID.
 * @returns {Promise<void>} Resolves when cancelled.
 */
export async function rejectRideRequest(rideRequestId, driverId) {
  const parsedRideRequestId = parsePositiveInteger(rideRequestId, "Ride request ID");

  if (driverId !== undefined) {
    return rejectDriverOffer(
      parsedRideRequestId,
      parsePositiveInteger(driverId, "Driver ID")
    );
  }

  return cancelRideRequest(parsedRideRequestId);
}

function parsePositiveInteger(value, label) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw createServiceError("INVALID_ID", `${label} must be a positive integer.`);
  }

  return parsedValue;
}

function createServiceError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
