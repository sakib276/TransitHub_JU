import { db } from '../../config/database.js';

/**
 * MODEL = the only file in this feature that talks to MySQL.
 *
 * Finds the driver and vehicle for a passenger's accepted ride.
 *
 * How the tables connect (see transithub_ju.sql):
 *
 *   ride_requests.passenger_id ──► users.user_id        (the passenger)
 *   ride_requests.trip_id      ──► trips.trip_id
 *   trips.driver_id            ──► drivers.driver_id
 *   drivers.user_id            ──► users.user_id        (driver's name/phone/photo)
 *   trips.vehicle_id           ──► vehicles.vehicle_id
 *   trips.route_id             ──► routes.route_id
 *   ride_requests.pickup_stop_id / drop_stop_id ──► stops.stop_id
 *
 * Rules:
 *   - "Accepted ride" = ride_requests.status is 'Approved'.
 *   - Only trips that are still active: trip_status 'Scheduled' or 'Running'
 *     (a 'Completed' or 'Cancelled' trip has no driver coming anymore).
 *   - If the passenger has more than one, return the one leaving soonest.
 *
 * @param {number} passengerId - users.user_id of the logged-in passenger.
 * @returns {Promise<Object|null>} One row, or null if there is no accepted ride.
 */
export async function findAssignedDriverByPassenger(passengerId) {
  const sql = `
    SELECT
      rr.request_id,
      t.trip_id,
      t.trip_status,
      t.departure_time,
      r.route_name,
      pickup.stop_name  AS pickup_stop,
      dropoff.stop_name AS drop_stop,
      driverUser.full_name     AS driver_name,
      driverUser.phone         AS driver_phone,
      driverUser.profile_photo AS driver_photo,
      v.vehicle_number,
      v.vehicle_type,
      v.total_seats
    FROM ride_requests rr
    JOIN trips    t          ON t.trip_id         = rr.trip_id
    JOIN drivers  d          ON d.driver_id       = t.driver_id
    JOIN users    driverUser ON driverUser.user_id = d.user_id
    JOIN vehicles v          ON v.vehicle_id      = t.vehicle_id
    JOIN routes   r          ON r.route_id        = t.route_id
    JOIN stops    pickup     ON pickup.stop_id    = rr.pickup_stop_id
    JOIN stops    dropoff    ON dropoff.stop_id   = rr.drop_stop_id
    WHERE rr.passenger_id = ?
      AND rr.status = 'Approved'
      AND t.trip_status IN ('Scheduled', 'Running')
    ORDER BY t.departure_time ASC
    LIMIT 1
  `;

  // The "?" is filled with passengerId safely (this prevents SQL injection).
  const [rows] = await db.query(sql, [passengerId]);

  return rows[0] || null;
}
