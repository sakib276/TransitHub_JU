/**
 * Passenger Queue API Service module.
 * @module queueService
 */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Available campus locations.
 *
 * @constant
 */
export const locations = [
  { id: 1, name: "JU Gate" },
  { id: 2, name: "Central Library" },
  { id: 3, name: "Business Studies" },
  { id: 4, name: "Transport" },
];

/**
 * Sends a request to the backend and handles the response.
 *
 * @param {string} endpoint API endpoint.
 * @param {Object} options Fetch options.
 * @returns {Promise<Object>} Parsed response.
 */
const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

/**
 * Joins the passenger waiting queue.
 *
 * @param {Object} data Queue request data.
 * @param {number} data.passenger_id Passenger ID.
 * @param {number} data.pickup_location_id Pickup location ID.
 * @param {number} data.destination_location_id Destination location ID.
 * @param {number} data.seats_needed Number of seats required.
 * @param {string} data.gender_preference Gender preference.
 * @param {boolean} data.priority Whether priority is requested.
 * @returns {Promise<Object>} Created queue entry.
 */
export const joinQueue = async (data) => {
  return request("/queue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

/**
 * Gets the waiting queue for a pickup location.
 *
 * @param {number} pickupLocationId Pickup location ID.
 * @returns {Promise<Array|Object>} Queue entries.
 */
export const getQueue = async (pickupLocationId) => {
  return request(`/queue/${pickupLocationId}`);
};

/**
 * Assigns a waiting passenger to a driver and vehicle.
 *
 * @param {number} id Queue entry ID.
 * @param {Object} data Assignment information.
 * @param {number} data.driver_id Driver ID.
 * @param {number} data.vehicle_id Vehicle ID.
 * @param {number} data.availableSeats Available seats.
 * @returns {Promise<Object>} Assignment result.
 */
export const assignPassenger = async (id, data) => {
  return request(`/queue/${id}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

/**
 * Marks a waiting passenger as a no-show.
 *
 * @param {number} id Queue entry ID.
 * @returns {Promise<Object>} No-show result.
 */
export const markNoShow = async (id) => {
  return request(`/queue/${id}/no-show`, {
    method: "PATCH",
  });
};

/**
 * Submits a priority request.
 *
 * This currently uses JSON for testing.
 * File upload support can be added later using Multer.
 *
 * @param {Object} data Priority request data.
 * @param {number} data.queue_entry_id Queue entry ID.
 * @param {number} data.passenger_id Passenger ID.
 * @param {string} data.reason Emergency reason.
 * @param {File|string} data.proof Supporting proof file or stored reference.
 * @returns {Promise<Object>} Priority request result.
 */
export const submitPriorityRequest = async (data = {}) => {
  const { queue_entry_id, passenger_id, reason, proof } = data;

  if (!queue_entry_id || !passenger_id || !reason || !proof) {
    throw new Error("Queue entry, passenger, reason, and proof are required.");
  }

  const formData = new FormData();
  formData.append("queue_entry_id", queue_entry_id);
  formData.append("passenger_id", passenger_id);
  formData.append("reason", reason);
  if (typeof File !== "undefined" && proof instanceof File) {
    formData.append("proof", proof);
  } else if (proof) {
    formData.append("proof_path", proof);
  }

  return request("/queue/priority", {
    method: "POST",
    body: formData,
  });
};

export const getPendingPriorityRequests = async () =>
  request("/priority-requests/pending");

export const approvePriorityRequest = async (id, review_reason = "") =>
  request(`/priority-requests/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review_reason }),
  });

export const rejectPriorityRequest = async (id, review_reason = "") =>
  request(`/priority-requests/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review_reason }),
  });