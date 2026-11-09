import { db } from '../../config/database.js';

/**
 * MODEL = the only file in this feature that talks to MySQL.
 *
 * Tables used (see transithub_ju.sql):
 *   routes, stops, fare   → which trips are possible and what they cost
 *   trips                 → the actual journeys (driver + vehicle + time + seats)
 *   ride_requests         → one row per passenger request
 */

/**
 * Lists every pickup → drop pair a passenger can travel, with fare and time.
 *
 * A pair is possible when both stops are on the SAME route and the pickup
 * comes before the drop (stop_order is smaller).
 * Example (route 1): Main Gate (1) → Registrar Building (2) → Central Library (3)
 *
 * @returns {Promise<Array<Object>>} Rows: pickup_stop, drop_stop, route_name, fare, estimated_time.
 */
export async function findRouteOptions() {
  const sql = `
    SELECT
      pickup.stop_name  AS pickup_stop,
      dropoff.stop_name AS drop_stop,
      r.route_name,
      f.amount          AS fare,
      r.estimated_time
    FROM stops pickup
    JOIN stops  dropoff ON dropoff.route_id = pickup.route_id
                       AND dropoff.stop_order > pickup.stop_order
    JOIN routes r       ON r.route_id = pickup.route_id
    JOIN fare   f       ON f.route_id = pickup.route_id
    ORDER BY f.amount ASC, r.route_id ASC
  `;

  const [rows] = await db.query(sql);
  return rows;
}

/**
 * Creates a ride request and assigns it to a trip straight away.
 *
 * Steps (all inside one TRANSACTION, so either everything is saved or nothing is):
 *   1. Find a trip that goes from the pickup stop to the drop stop,
 *      is 'Scheduled' or 'Running', and still has a free seat.
 *      If several match: cheapest route first, then the one leaving first.
 *   2. Save the request in ride_requests with status 'Approved'.
 *   3. Take one seat: trips.available_seats - 1.
 *
 * @param {number} passengerId - users.user_id of the logged-in passenger.
 * @param {string} pickupStop - stops.stop_name, e.g. "Main Gate".
 * @param {string} dropStop - stops.stop_name, e.g. "Central Library".
 * @returns {Promise<Object|null>} { requestId, tripId }, or null if no trip matches.
 */
export async function createApprovedRideRequest(passengerId, pickupStop, dropStop) {
  // A transaction needs one connection for all its queries.
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Find a matching trip. "FOR UPDATE" locks it so two passengers
    //    can't take the last seat at the same time.
    const [trips] = await connection.query(
      `
      SELECT t.trip_id, pickup.stop_id AS pickup_stop_id, dropoff.stop_id AS drop_stop_id
      FROM trips t
      JOIN stops pickup  ON pickup.route_id  = t.route_id AND pickup.stop_name  = ?
      JOIN stops dropoff ON dropoff.route_id = t.route_id AND dropoff.stop_name = ?
                        AND dropoff.stop_order > pickup.stop_order
      JOIN fare f        ON f.route_id = t.route_id
      WHERE t.trip_status IN ('Scheduled', 'Running')
        AND t.available_seats > 0
      ORDER BY f.amount ASC, t.departure_time ASC
      LIMIT 1
      FOR UPDATE
      `,
      [pickupStop, dropStop],
    );

    const trip = trips[0];

    if (!trip) {
      await connection.rollback();
      return null;
    }

    // 2. Save the request as already accepted (driver assigned).
    const [result] = await connection.query(
      `INSERT INTO ride_requests (passenger_id, trip_id, pickup_stop_id, drop_stop_id, status)
       VALUES (?, ?, ?, ?, 'Approved')`,
      [passengerId, trip.trip_id, trip.pickup_stop_id, trip.drop_stop_id],
    );

    // 3. One seat is now taken.
    await connection.query(
      'UPDATE trips SET available_seats = available_seats - 1 WHERE trip_id = ?',
      [trip.trip_id],
    );

    await connection.commit();
    return { requestId: result.insertId, tripId: trip.trip_id };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    // Give the connection back to the pool.
    connection.release();
  }
}
