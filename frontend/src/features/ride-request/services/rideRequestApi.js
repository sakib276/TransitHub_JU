/**
 * API calls for the ride request form (backend: /api/ride-requests).
 * The logged-in passenger is identified by the login token.
 */

// Backend address. Can be changed with VITE_API_URL in frontend/.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Sends a request to the ride request API with the login token.
 *
 * @param {string} path - Path after /api/ride-requests, e.g. "/route-options".
 * @param {Object} [options] - fetch options (method, body).
 * @returns {Promise<*>} The "data" part of the response.
 * @throws {Error} With the backend's message if the request fails.
 */
async function callApi(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/ride-requests${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('th_auth_token')}`,
      },
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message);
  }

  return body.data;
}

/**
 * Gets every pickup → destination pair from the database, with fare and time.
 *
 * @returns {Promise<Array<{pickupStop: string, dropStop: string, routeName: string, fare: number, travelTime: number}>>}
 */
export function getRouteOptions() {
  return callApi('/route-options');
}

/**
 * Saves a ride request; the backend assigns a driver and vehicle.
 *
 * @param {{pickupStop: string, dropStop: string}} request - Chosen stops.
 * @returns {Promise<{requestId: number, tripId: number}>} Saved request.
 */
export function createRideRequest({ pickupStop, dropStop }) {
  return callApi('', {
    method: 'POST',
    body: JSON.stringify({ pickupStop, dropStop }),
  });
}
