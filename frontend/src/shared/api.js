/**
 * Provides a shared HTTP client for communicating with the TransitHub_JU
 * backend API.
 *
 * The client automatically attaches the JWT access token stored
 * by the authentication feature to authenticated requests.
 *
 * @module api
 */

/**
 * Base URL for the TransitHub_JU backend API.
 *
 * @constant
 * @type {string}
 */
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Sends an HTTP request to the backend API.
 *
 * @async
 * @param {string} endpoint - API endpoint path.
 * @param {Object} options - Fetch request options.
 * @returns {Promise<Object>} Parsed API response.
 * @throws {Error} Throws an error when the request fails.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "API request failed."
    );
  }

  return data;
}