import { findAssignedDriverByPassenger } from './driverVehicle.model.js';

/**
 * CONTROLLER = receives the HTTP request and sends the HTTP response.
 *
 * GET /api/driver-vehicle/assigned-driver
 * FR-11.1: a logged-in passenger sees the driver and vehicle of their accepted ride.
 *
 * Responses:
 *   200 { data: {...} }   driver + vehicle found
 *   404 { message }       passenger has no accepted (Approved) active ride
 *   500 { message }       something went wrong (e.g. database is down)
 *
 * @param {object} req - Express request (req.user was set by requireLogin).
 * @param {object} res - Express response.
 * @returns {Promise<void>}
 */
export async function getAssignedDriver(req, res) {
  try {
    const row = await findAssignedDriverByPassenger(req.user.userId);

    if (!row) {
      res.status(404).json({ message: 'You have no accepted ride yet.' });
      return;
    }

    // Turn database column names (snake_case) into the names the frontend uses (camelCase).
    res.json({
      data: {
        requestId: row.request_id,
        tripId: row.trip_id,
        tripStatus: row.trip_status,
        departureTime: row.departure_time,
        routeName: row.route_name,
        pickupStop: row.pickup_stop,
        dropStop: row.drop_stop,
        driverName: row.driver_name,
        driverPhone: row.driver_phone,
        driverPhoto: row.driver_photo,
        vehicleNumber: row.vehicle_number,
        vehicleType: row.vehicle_type,
        totalSeats: row.total_seats,
      },
    });
  } catch (error) {
    console.error('Assigned driver error:', error);
    res.status(500).json({ message: 'Could not load driver details. Please try again.' });
  }
}
