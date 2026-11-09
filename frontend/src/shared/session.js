/**
 * Helpers for the logged-in user's session.
 *
 * After login, the auth feature saves (see features/auth/models/authApi.js):
 *   sessionStorage 'th_auth_token'   → the login token (JWT)
 *   sessionStorage 'th_session_user' → { id, fullName, email, role }
 */

const TOKEN_KEY = 'th_auth_token';

/**
 * Reads the expiry time stored inside a JWT token.
 * A JWT looks like "header.payload.signature"; the payload is base64 JSON.
 *
 * @param {string} token - JWT token.
 * @returns {number|null} Expiry as Unix seconds, or null if it can't be read.
 */
function getTokenExpiry(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).exp ?? null;
  } catch {
    return null;
  }
}

/**
 * Checks whether someone is logged in with a token that hasn't expired.
 * (The backend still checks the token properly; this only decides
 * whether to show the login page.)
 *
 * @returns {boolean} True if logged in.
 */
export function isLoggedIn() {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (!token) {
    return false;
  }

  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry * 1000 > Date.now();
}
