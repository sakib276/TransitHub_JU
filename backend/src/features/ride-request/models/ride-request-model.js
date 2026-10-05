import { randomBytes } from "node:crypto";
import { db } from "../../../config/database.js";

/**
 * @typedef {object} QueueEntry
 * @property {number} id - Queue entry ID.
 * @property {string} token - Public queue token.
 * @property {number} passengerId - Passenger user ID.
 * @property {number} pickupLocationId - Pickup location ID.
 * @property {number} destinationLocationId - Destination location ID.
 * @property {number} seats - Number of seats requested.
 * @property {"Any"|"Male"|"Female"} genderPreference - Passenger preference.
 * @property {boolean} priority - Whether priority review was requested.
 * @property {number} position - Position in the pickup queue.
 * @property {"Waiting"|"Assigned"|"Completed"|"No-show"|"Cancelled"} status - Queue state.
 */

/**
 * @typedef {object} QueueEntryInput
 * @property {number} passengerId - Active passenger user ID.
 * @property {number} pickupLocationId - Active pickup location ID.
 * @property {number} destinationLocationId - Active destination location ID.
 * @property {number} seatsNeeded - Requested seats.
 * @property {"Any"|"Male"|"Female"} genderPreference - Passenger preference.
 * @property {boolean} priority - Whether priority review was requested.
 * @property {"Medical emergency"|"Academic emergency"|"Other"} priorityReason - Reason for priority request.
 */

/**
 * @typedef {object} RideRequestFilters
 * @property {number} [passengerId] - Filter by passenger user ID.
 * @property {number} [driverId] - Omit entries declined by this driver.
 * @property {string} [status] - Filter by queue status.
 */

/**
 * Loads active campus locations.
 *
 * @returns {Promise<Array<object>>} Active locations ordered by name.
 */
export async function findActiveLocations() {
  const [locations] = await db.query(
    "SELECT id, name FROM locations WHERE status = 'active' ORDER BY name"
  );

  return locations;
}

/**
 * Lists queue entries with passenger and location details.
 *
 * @param {RideRequestFilters} filters - Optional passenger, driver, and status filters.
 * @returns {Promise<Array<QueueEntry>>} Matching queue entries.
 */
export async function findRideRequests({ passengerId, status, driverId } = {}) {
  const conditions = [];
  const values = [];

  if (passengerId) {
    conditions.push("q.passenger_id = ?");
    values.push(passengerId);
  }

  if (status) {
    conditions.push("q.status = ?");
    values.push(status);
  }

  if (driverId) {
    conditions.push(`
      (
        q.status <> 'Waiting'
        OR NOT EXISTS (
          SELECT 1
          FROM queue_rejections rejection
          WHERE rejection.queue_entry_id = q.id
            AND rejection.driver_id = ?
        )
      )
    `);
    values.push(driverId);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const [requests] = await db.query(
    `
      SELECT q.id,
             q.token,
             q.passenger_id AS passengerId,
             passenger.name AS passenger,
             q.pickup_location_id AS pickupLocationId,
             pickup.name AS pickup,
             q.destination_location_id AS destinationLocationId,
             destination.name AS destination,
             q.seats_needed AS seats,
             q.gender_preference AS genderPreference,
             q.priority,
             q.position,
             q.status,
             q.joined_at AS joinedAt,
             assignment.driver_id AS driverId,
             driver.name AS driver,
             assignment.vehicle_id AS vehicleId
      FROM queue_entries q
      JOIN users passenger ON passenger.id = q.passenger_id
      JOIN locations pickup ON pickup.id = q.pickup_location_id
      JOIN locations destination ON destination.id = q.destination_location_id
      LEFT JOIN queue_assignments assignment ON assignment.queue_entry_id = q.id
      LEFT JOIN users driver ON driver.id = assignment.driver_id
      ${whereClause}
      ORDER BY q.priority DESC, q.position ASC, q.joined_at DESC
    `,
    values
  );

  return requests;
}

/**
 * Finds active drivers and vehicles that can serve a given number of seats.
 *
 * @param {number} seatsNeeded - Minimum available seats required.
 * @returns {Promise<Array<object>>} Matching drivers and their vehicles.
 */
export async function findAvailableDrivers(seatsNeeded) {
  const [drivers] = await db.query(
    `
      SELECT u.id AS driverId,
             u.name,
             v.id AS vehicleId,
             v.vehicle_type AS vehicle,
             v.available_seats AS availableSeats
      FROM vehicles v
      JOIN users u ON u.id = v.driver_id
      WHERE u.role = 'driver'
        AND u.status = 'active'
        AND v.status = 'Active'
        AND v.driver_status = 'Available'
        AND v.available_seats >= ?
      ORDER BY v.available_seats ASC, u.name ASC
    `,
    [seatsNeeded]
  );

  return drivers;
}

/**
 * Loads a driver's assigned active vehicle.
 *
 * @param {number} driverId - Driver user ID.
 * @param {number} vehicleId - Vehicle ID.
 * @returns {Promise<object|null>} Driver and vehicle details.
 */
export async function findDriverVehicle(driverId, vehicleId) {
  const [vehicles] = await db.query(
    `
      SELECT u.id AS driverId,
             u.name,
             v.id AS vehicleId,
             v.vehicle_type AS vehicle,
             v.available_seats AS availableSeats,
             v.driver_status AS driverStatus
      FROM vehicles v
      JOIN users u ON u.id = v.driver_id
      WHERE v.driver_id = ?
        AND v.id = ?
        AND u.role = 'driver'
        AND u.status = 'active'
        AND v.status = 'Active'
      LIMIT 1
    `,
    [driverId, vehicleId]
  );

  return vehicles[0] || null;
}

/**
 * Updates the operational status for a driver's active vehicle.
 *
 * @param {number} driverId - Driver user ID.
 * @param {number} vehicleId - Vehicle ID.
 * @param {string} driverStatus - New operational status.
 * @returns {Promise<void>} Resolves after updating the vehicle.
 */
export async function updateDriverStatus(driverId, vehicleId, driverStatus) {
  const connection = await db.getConnection();
  let isTransactionStarted = false;

  try {
    await connection.beginTransaction();
    isTransactionStarted = true;

    const [vehicles] = await connection.query(
      `
        SELECT v.driver_status AS currentStatus,
               v.available_seats AS availableSeats
        FROM vehicles v
        JOIN users u ON u.id = v.driver_id
        WHERE v.driver_id = ?
          AND v.id = ?
          AND u.role = 'driver'
          AND u.status = 'active'
          AND v.status = 'Active'
        FOR UPDATE
      `,
      [driverId, vehicleId]
    );

    if (vehicles.length === 0) {
      throw createModelError("VEHICLE_NOT_AVAILABLE", "Active driver vehicle not found.");
    }

    if (
      driverStatus === "Available" &&
      (vehicles[0].availableSeats < 1 ||
        !["Offline", "Available"].includes(vehicles[0].currentStatus))
    ) {
      throw createModelError(
        "DRIVER_NOT_AVAILABLE",
        "A busy or full driver cannot be marked available."
      );
    }

    await connection.query(
      "UPDATE vehicles SET driver_status = ? WHERE id = ?",
      [driverStatus, vehicleId]
    );
    await connection.commit();
    isTransactionStarted = false;
  } catch (error) {
    if (isTransactionStarted) {
      await connection.rollback();
    }
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Creates a queue entry and, when requested, a priority request atomically.
 *
 * @param {QueueEntryInput} rideRequest - Validated queue entry fields.
 * @returns {Promise<QueueEntry>} The newly-created queue entry.
 */
export async function insertRideRequest(rideRequest) {
  const connection = await db.getConnection();
  let isTransactionStarted = false;

  try {
    await connection.beginTransaction();
    isTransactionStarted = true;

    const [passengers] = await connection.query(
      `
        SELECT id
        FROM users
        WHERE id = ? AND role = 'passenger' AND status = 'active'
        FOR UPDATE
      `,
      [rideRequest.passengerId]
    );

    if (passengers.length === 0) {
      throw createModelError("PASSENGER_NOT_FOUND", "Active passenger not found.");
    }

    const [activeRequests] = await connection.query(
      `
        SELECT id
        FROM queue_entries
        WHERE passenger_id = ? AND status IN ('Waiting', 'Assigned')
        LIMIT 1
        FOR UPDATE
      `,
      [rideRequest.passengerId]
    );

    if (activeRequests.length > 0) {
      throw createModelError(
        "ACTIVE_REQUEST_EXISTS",
        "Passenger already has an active ride request."
      );
    }

    const [locations] = await connection.query(
      `
        SELECT id
        FROM locations
        WHERE status = 'active' AND id IN (?, ?)
      `,
      [rideRequest.pickupLocationId, rideRequest.destinationLocationId]
    );

    if (locations.length !== 2) {
      throw createModelError("LOCATION_NOT_FOUND", "Pickup or destination is not active.");
    }

    await connection.query(
      "SELECT id FROM locations WHERE id = ? FOR UPDATE",
      [rideRequest.pickupLocationId]
    );
    const [positionRows] = await connection.query(
      `
        SELECT position
        FROM queue_entries
        WHERE pickup_location_id = ? AND status = 'Waiting'
        ORDER BY position DESC
        LIMIT 1
        FOR UPDATE
      `,
      [rideRequest.pickupLocationId]
    );

    const nextPosition = (positionRows[0]?.position || 0) + 1;
    const token = `RQ-${randomBytes(8).toString("hex")}`;
    const [insertResult] = await connection.query(
      `
        INSERT INTO queue_entries (
          passenger_id,
          token,
          pickup_location_id,
          destination_location_id,
          seats_needed,
          gender_preference,
          priority,
          position,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Waiting')
      `,
      [
        rideRequest.passengerId,
        token,
        rideRequest.pickupLocationId,
        rideRequest.destinationLocationId,
        rideRequest.seatsNeeded,
        rideRequest.genderPreference,
        rideRequest.priority,
        nextPosition,
      ]
    );

    if (rideRequest.priority) {
      await connection.query(
        `
          INSERT INTO priority_requests (queue_entry_id, passenger_id, reason)
          VALUES (?, ?, ?)
        `,
        [insertResult.insertId, rideRequest.passengerId, rideRequest.priorityReason]
      );
    }

    const [requests] = await connection.query(
      `
        SELECT q.id,
               q.token,
               q.passenger_id AS passengerId,
               passenger.name AS passenger,
               q.pickup_location_id AS pickupLocationId,
               pickup.name AS pickup,
               q.destination_location_id AS destinationLocationId,
               destination.name AS destination,
               q.seats_needed AS seats,
               q.gender_preference AS genderPreference,
               q.priority,
               q.position,
               q.status,
               q.joined_at AS joinedAt
        FROM queue_entries q
        JOIN users passenger ON passenger.id = q.passenger_id
        JOIN locations pickup ON pickup.id = q.pickup_location_id
        JOIN locations destination ON destination.id = q.destination_location_id
        WHERE q.id = ?
      `,
      [insertResult.insertId]
    );

    await connection.commit();
    isTransactionStarted = false;
    return requests[0];
  } catch (error) {
    if (isTransactionStarted) {
      await connection.rollback();
    }
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Assigns a waiting queue entry and decrements the associated vehicle seats.
 *
 * @param {{rideRequestId: number, driverId: number, vehicleId: number, seatsAssigned: number}} assignment - Queue entry and assignment fields.
 * @returns {Promise<{id: number, rideRequestId: number, driverId: number, vehicleId: number, seatsAssigned: number}>} The created assignment.
 */
export async function assignRideRequest(assignment) {
  const connection = await db.getConnection();
  let isTransactionStarted = false;

  try {
    await connection.beginTransaction();
    isTransactionStarted = true;

    const [entries] = await connection.query(
      `
        SELECT id,
               seats_needed AS seatsNeeded,
               pickup_location_id AS pickupLocationId,
               destination_location_id AS destinationLocationId,
               status
        FROM queue_entries
        WHERE id = ?
        FOR UPDATE
      `,
      [assignment.rideRequestId]
    );

    if (entries.length === 0) {
      throw createModelError("REQUEST_NOT_FOUND", "Ride request not found.");
    }

    const entry = entries[0];

    if (entry.status !== "Waiting") {
      throw createModelError("REQUEST_NOT_WAITING", "Ride request is no longer waiting.");
    }

    if (assignment.seatsAssigned !== entry.seatsNeeded) {
      throw createModelError(
        "SEAT_COUNT_MISMATCH",
        "Assigned seats must match the passenger's requested seats."
      );
    }

    const [vehicles] = await connection.query(
      `
        SELECT v.id,
               v.available_seats AS availableSeats,
               v.status,
               v.driver_status AS driverStatus
        FROM vehicles v
        JOIN users driver ON driver.id = v.driver_id
        WHERE v.id = ?
          AND v.driver_id = ?
          AND driver.role = 'driver'
          AND driver.status = 'active'
        FOR UPDATE
      `,
      [assignment.vehicleId, assignment.driverId]
    );

    if (vehicles.length === 0 || vehicles[0].status !== "Active") {
      throw createModelError("VEHICLE_NOT_AVAILABLE", "Active driver vehicle not found.");
    }

    const vehicle = vehicles[0];

    if (vehicle.driverStatus !== "Available") {
      throw createModelError("DRIVER_NOT_AVAILABLE", "Driver is not available.");
    }

    if (vehicle.availableSeats < assignment.seatsAssigned) {
      throw createModelError("NOT_ENOUGH_SEATS", "Vehicle does not have enough available seats.");
    }

    const [assignmentResult] = await connection.query(
      `
        INSERT INTO queue_assignments (
          queue_entry_id,
          driver_id,
          vehicle_id,
          seats_assigned
        ) VALUES (?, ?, ?, ?)
      `,
      [
        assignment.rideRequestId,
        assignment.driverId,
        assignment.vehicleId,
        assignment.seatsAssigned,
      ]
    );

    await connection.query(
      "UPDATE queue_entries SET status = 'Assigned' WHERE id = ?",
      [assignment.rideRequestId]
    );

    await connection.query(
      `
        UPDATE vehicles
        SET driver_status = IF(available_seats = ?, 'Busy & Full', 'Busy'),
            available_seats = available_seats - ?,
            current_location_id = ?,
            destination_location_id = ?
        WHERE id = ?
      `,
      [
        assignment.seatsAssigned,
        assignment.seatsAssigned,
        entry.pickupLocationId,
        entry.destinationLocationId,
        assignment.vehicleId,
      ]
    );

    await connection.commit();
    isTransactionStarted = false;

    return {
      id: assignmentResult.insertId,
      rideRequestId: assignment.rideRequestId,
      driverId: assignment.driverId,
      vehicleId: assignment.vehicleId,
      seatsAssigned: assignment.seatsAssigned,
    };
  } catch (error) {
    if (isTransactionStarted) {
      await connection.rollback();
    }
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Cancels a waiting queue entry.
 *
 * @param {number} rideRequestId - Queue entry ID to cancel.
 * @returns {Promise<void>} Resolves after the cancellation.
 */
export async function cancelRideRequest(rideRequestId) {
  const [result] = await db.query(
    "UPDATE queue_entries SET status = 'Cancelled' WHERE id = ? AND status = 'Waiting'",
    [rideRequestId]
  );

  if (result.affectedRows === 0) {
    const [entries] = await db.query("SELECT status FROM queue_entries WHERE id = ?", [
      rideRequestId,
    ]);

    if (entries.length === 0) {
      throw createModelError("REQUEST_NOT_FOUND", "Ride request not found.");
    }

    throw createModelError("REQUEST_NOT_WAITING", "Only waiting requests can be cancelled.");
  }
}

/**
 * Records a driver's decision not to accept a waiting entry without cancelling
 * the passenger's queue request for other drivers.
 *
 * @param {number} rideRequestId - Queue entry ID.
 * @param {number} driverId - Driver user ID.
 * @returns {Promise<void>} Resolves after the offer is declined.
 */
export async function rejectDriverOffer(rideRequestId, driverId) {
  const [result] = await db.query(
    `
      INSERT IGNORE INTO queue_rejections (queue_entry_id, driver_id)
      SELECT q.id, u.id
      FROM queue_entries q
      JOIN users u ON u.id = ?
      WHERE q.id = ?
        AND q.status = 'Waiting'
        AND u.role = 'driver'
        AND u.status = 'active'
    `,
    [driverId, rideRequestId]
  );

  if (result.affectedRows === 0) {
    const [entries] = await db.query(
      "SELECT id, status FROM queue_entries WHERE id = ?",
      [rideRequestId]
    );

    if (entries.length === 0) {
      throw createModelError("REQUEST_NOT_FOUND", "Ride request not found.");
    }

    if (entries[0].status !== "Waiting") {
      throw createModelError("REQUEST_NOT_WAITING", "Ride request is no longer waiting.");
    }

    const [previousRejections] = await db.query(
      "SELECT queue_entry_id FROM queue_rejections WHERE queue_entry_id = ? AND driver_id = ?",
      [rideRequestId, driverId]
    );

    if (previousRejections.length > 0) {
      throw createModelError(
        "DRIVER_ALREADY_REJECTED",
        "This driver has already rejected the ride request."
      );
    }

    throw createModelError("DRIVER_NOT_AVAILABLE", "Active driver not found.");
  }
}

function createModelError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
