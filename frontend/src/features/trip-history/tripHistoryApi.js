import api from "../../shared/api";

/**
 * Retrieves trip history using optional filters.
 *
 * @param {Object} filters - Trip history filter values.
 * @param {string} [filters.date] - Completion date filter.
 * @param {string} [filters.destination] - Destination filter.
 * @returns {Promise<Array>} Matching trip history records.
 */
export async function getTripHistory(filters = {}) {
  const params = new URLSearchParams();

  if (filters.date) {
    params.append("date", filters.date);
  }

  if (filters.destination) {
    params.append("destination", filters.destination);
  }

  const queryString = params.toString();

  const endpoint = queryString
    ? `/trip-history?${queryString}`
    : "/trip-history";

  const response = await api.get(endpoint);

  return response.data.data;
}