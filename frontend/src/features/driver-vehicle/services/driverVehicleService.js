/**
 * API calls for FR-11.1 (Passenger: View Assigned Driver).
 *
 * Calls the backend: GET /api/driver-vehicle/assigned-driver
 * The backend finds the logged-in passenger from their login token.
 */

// Backend address. Can be changed with VITE_API_URL in frontend/.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Where the login page (feature/registration-login) saves the token after login.
const TOKEN_STORAGE_KEY = 'th_auth_token';

/**
 * Gets the driver and vehicle assigned to the passenger's accepted ride.
 *
 * @returns {Promise<Object>} Driver/vehicle info from the backend.
 * @throws {Error} If not logged in, there is no accepted ride, or the request fails.
 */
export async function getAssignedDriver() {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    throw new Error('Please log in as a passenger to see your driver.');
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/driver-vehicle/assigned-driver`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // fetch only throws when the server can't be reached at all.
    throw new Error('Could not load driver details. Check your connection and try again.');
  }

  const body = await response.json();

  if (!response.ok) {
    // The backend sends a readable message, e.g. "You have no accepted ride yet."
    throw new Error(body.message);
  }

  return body.data;
}
