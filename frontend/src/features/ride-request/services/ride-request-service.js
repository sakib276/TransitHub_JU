/**
 * Validates a rider's trip request before it is submitted.
 *
 * @param {object} data - Ride request data including pickup, destination, and seats.
 * @param {boolean} [hasActiveRequest=false] - Whether the rider already has an active request.
 * @param {Array<string>} [activeLocations=[]] - Location names loaded from the API.
 * @returns {string} A validation result for the request.
 */
export function validateRequest(data, hasActiveRequest = false, activeLocations = []) {
  if (hasActiveRequest) {
    return "Active request already exists";
  }

  if (!data.pickup || !data.destination) {
    return "Pickup and destination are required";
  }

  if (data.pickup === data.destination) {
    return "Pickup and destination cannot be the same";
  }

  if (!Number.isInteger(data.seats) || data.seats < 1 || data.seats > 4) {
    return "Seat count must be between 1 and 4";
  }

  if (activeLocations.length > 0 &&
    (!activeLocations.includes(data.pickup) ||
      !activeLocations.includes(data.destination))) {
    return "Outside service area";
  }

  return "Valid";
}