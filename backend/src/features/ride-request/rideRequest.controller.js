import { createApprovedRideRequest, findRouteOptions } from './rideRequest.model.js';

/**
 * GET /api/ride-requests/route-options
 * Every pickup → drop pair the passenger can choose, with fare and travel time.
 *
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @returns {Promise<void>}
 */
export async function getRouteOptions(req, res) {
  try {
    const rows = await findRouteOptions();

    res.json({
      data: rows.map((row) => ({
        pickupStop: row.pickup_stop,
        dropStop: row.drop_stop,
        routeName: row.route_name,
        fare: Number(row.fare), // DECIMAL comes from MySQL as a string, e.g. "20.00"
        travelTime: row.estimated_time,
      })),
    });
  } catch (error) {
    console.error('Route options error:', error);
    res.status(500).json({ message: 'Could not load pickup and destination points.' });
  }
}

/**
 * POST /api/ride-requests
 * Body: { pickupStop: "Main Gate", dropStop: "Central Library" }
 *
 * Saves the logged-in passenger's request and assigns a trip (driver + vehicle).
 *
 * Responses:
 *   201 { data: { requestId, tripId } }  saved and assigned
 *   400 { message }                      pickup/drop missing or the same
 *   409 { message }                      no trip with a free seat for this route
 *   500 { message }                      database error
 *
 * @param {object} req - Express request (req.user was set by requireLogin).
 * @param {object} res - Express response.
 * @returns {Promise<void>}
 */
export async function createRideRequest(req, res) {
  const { pickupStop, dropStop } = req.body;

  if (typeof pickupStop !== 'string' || typeof dropStop !== 'string' || !pickupStop || !dropStop) {
    res.status(400).json({ message: 'Please select pickup and destination.' });
    return;
  }

  if (pickupStop === dropStop) {
    res.status(400).json({ message: 'Pickup and destination cannot be the same.' });
    return;
  }

  try {
    const result = await createApprovedRideRequest(req.user.userId, pickupStop, dropStop);

    if (!result) {
      res.status(409).json({ message: 'No vehicle with a free seat is available for this route right now.' });
      return;
    }

    res.status(201).json({ data: result });
  } catch (error) {
    console.error('Create ride request error:', error);
    res.status(500).json({ message: 'Could not send your ride request. Please try again.' });
  }
}
