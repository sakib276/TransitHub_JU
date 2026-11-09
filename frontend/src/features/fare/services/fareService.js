/**
 * @fileoverview Service layer handling HTTP communication with TransitHub JU Fare backend API.
 * @module features/fare/services/fareService
 * @author Nazmus Sakib
 * @version 1.0.0
 */

const API_BASE_URL = 'http://localhost:5000/api/fares';

/**
 * Predefined list of active pickup and drop-off points inside Jahangirnagar University campus.
 * @type {Array<string>}
 */
export const CAMPUS_LOCATIONS_LIST = [
  'Dairy Gate',
  'Bottola',
  'Prantic Gate',
  'CSE Department',
  'Central Library',
  'Tarabag',
  'Medical Center',
  'Mir Mosharraf Hossain Hall'
];

/**
 * Offline fallback fare matrix used when the backend server is unreachable.
 * @type {Array<Object>}
 */
const FALLBACK_FARES = [
  { id: 1, from: 'Dairy Gate', to: 'Bottola', rickshawFare: 20, autoFare: 15 },
  { id: 2, from: 'Dairy Gate', to: 'Prantic Gate', rickshawFare: 25, autoFare: 20 },
  { id: 3, from: 'Dairy Gate', to: 'CSE Department', rickshawFare: 30, autoFare: 20 },
  { id: 4, from: 'Dairy Gate', to: 'Central Library', rickshawFare: 25, autoFare: 15 },
  { id: 5, from: 'Prantic Gate', to: 'Bottola', rickshawFare: 20, autoFare: 15 },
  { id: 6, from: 'Prantic Gate', to: 'CSE Department', rickshawFare: 20, autoFare: 15 },
  { id: 7, from: 'Bottola', to: 'CSE Department', rickshawFare: 15, autoFare: 10 },
  { id: 8, from: 'Bottola', to: 'Tarabag', rickshawFare: 20, autoFare: 15 }
];

/**
 * Retrieves the complete predefined official fare chart from the backend.
 * @async
 * @returns {Promise<Array<Object>>} List of official fare routes.
 */
export const getPredefinedFares = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const result = await response.json();
    return result.data || FALLBACK_FARES;
  } catch (error) {
    console.warn('Backend API unavailable. Using fallback fare list:', error.message);
    return FALLBACK_FARES;
  }
};

/**
 * Requests the backend to calculate fare between two specific campus locations.
 * @async
 * @param {string} from - Pickup location name.
 * @param {string} to - Destination location name.
 * @returns {Promise<Object>} Route fare details matched for FareComparisonCard.
 */
export const calculateFare = async (from, to) => {
  if (!from || !to || from === to) return null;

  try {
    const queryParams = new URLSearchParams({ from, to });
    const response = await fetch(`${API_BASE_URL}/calculate?${queryParams.toString()}`);

    if (!response.ok) {
      return {
        hasMatchingRoute: false,
        userFeedbackMessage: 'No official route fare established between these locations.'
      };
    }

    const result = await response.json();
    const data = result.data;

    if (!data) {
      return {
        hasMatchingRoute: false,
        userFeedbackMessage: 'No route details returned from server.'
      };
    }

    // FareComparisonCard-এর প্রত্যাশিত ফিল্ডগুলো ম্যাপ করা হলো
    return {
      hasMatchingRoute: true,
      rickshawFare: data.rickshawFare,
      cartFare: data.autoFare || data.cartFare,
      autoFare: data.autoFare || data.cartFare,
      from: data.from,
      to: data.to,
      userFeedbackMessage: ''
    };
  } catch (error) {
    console.warn('Backend unavailable, evaluating locally:', error.message);
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    const matched = FALLBACK_FARES.find(
      (item) =>
        (item.from.toLowerCase() === fromLower && item.to.toLowerCase() === toLower) ||
        (item.from.toLowerCase() === toLower && item.to.toLowerCase() === fromLower)
    );

    if (!matched) {
      return {
        hasMatchingRoute: false,
        userFeedbackMessage: 'No official fare found for this route.'
      };
    }

    return {
      hasMatchingRoute: true,
      rickshawFare: matched.rickshawFare,
      cartFare: matched.autoFare,
      autoFare: matched.autoFare,
      from: matched.from,
      to: matched.to,
      userFeedbackMessage: ''
    };
  }
};
/**
 * Submits an overcharge complaint to the backend database.
 * @async
 * @param {Object} reportData - Complaint details payload.
 * @param {string} reportData.pickup - Pickup spot.
 * @param {string} reportData.destination - Drop-off spot.
 * @param {string} reportData.vehicleType - Type of vehicle (e.g. Rickshaw, Battery Auto).
 * @param {number} reportData.demandedFare - Fare demanded by driver.
 * @param {number} [reportData.officialFare] - Regulated official fare.
 * @param {string} [reportData.vehicleNumber] - Vehicle registration or identifier.
 * @param {string} [reportData.comment] - Additional details.
 * @returns {Promise<{success: boolean, message: string, data?: Object}>}
 */
export const reportOvercharge = async (reportData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/report-overcharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      throw new Error(`Report submission failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting overcharge report:', error.message);
    return {
      success: false,
      message: error.message || 'Network error occurred while submitting report.'
    };
  }
};

export default {
  CAMPUS_LOCATIONS_LIST,
  getPredefinedFares,
  calculateFare,
  reportOvercharge
};