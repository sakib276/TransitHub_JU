/**
 * @fileoverview Service module for handling JU campus transport fare matrix,
 * calculations, local offline caching, and overcharge reporting.
 * @module features/fare/services/fareService
 * @author Nazmus Sakib
 * @version 1.0.0
 */

const FARE_CACHE_STORAGE_KEY = 'transithub_ju_fare_chart';
const OVERCHARGE_COMPLAINTS_STORAGE_KEY = 'ju_overcharge_reports';

export const CAMPUS_LOCATIONS_LIST = [
  'CSE',
  'Dairy Gate',
  'Bishmile',
  'Ladies Hall Road',
  'Prantic',
  'Bottola',
  'Central Library',
  'Tajuddin Hall',
  'Mir Mosharraf Hossain Hall'
];

export const PREDEFINED_FARE_MATRIX = [
  { id: 1, from: 'CSE', to: 'Dairy Gate', rickshawFare: 20, cartFare: 10 },
  { id: 2, from: 'CSE', to: 'Bishmile', rickshawFare: 25, cartFare: 15 },
  { id: 3, from: 'CSE', to: 'Ladies Hall Road', rickshawFare: 20, cartFare: 10 },
  { id: 4, from: 'CSE', to: 'Prantic', rickshawFare: 20, cartFare: 15 },
  { id: 5, from: 'CSE', to: 'Mir Mosharraf Hossain Hall', rickshawFare: 20, cartFare: 10 },
  { id: 6, from: 'CSE', to: 'Tajuddin Hall', rickshawFare: 20, cartFare: 10 },
  { id: 7, from: 'Dairy Gate', to: 'Bishmile', rickshawFare: 30, cartFare: 15 },
  { id: 8, from: 'Dairy Gate', to: 'Ladies Hall Road', rickshawFare: 10, cartFare: 5 },
  { id: 9, from: 'Bishmile', to: 'Prantic', rickshawFare: 20, cartFare: 10 },
  { id: 10, from: 'Ladies Hall Road', to: 'Prantic', rickshawFare: 15, cartFare: 10 },
  { id: 11, from: 'Bottola', to: 'CSE', rickshawFare: 10, cartFare: 5 },
  { id: 12, from: 'Dairy Gate', to: 'Bottola', rickshawFare: 20, cartFare: 10 }
];

export const fareService = {
  /**
   * Fetches official fare matrix with automatic localStorage offline fallback.
   * @async
   * @returns {Promise<{isSuccessful: boolean, fareChartData: Array<Object>, isOfflineMode: boolean}>}
   */
  async getFareChart() {
    try {
      const persistedFareData = localStorage.getItem(FARE_CACHE_STORAGE_KEY);
      const activeFareChart = persistedFareData ? JSON.parse(persistedFareData) : PREDEFINED_FARE_MATRIX;
      localStorage.setItem(FARE_CACHE_STORAGE_KEY, JSON.stringify(activeFareChart));

      return {
        isSuccessful: true,
        fareChartData: activeFareChart,
        isOfflineMode: false
      };
    } catch (fetchError) {
      const cachedFareData = localStorage.getItem(FARE_CACHE_STORAGE_KEY);

      return {
        isSuccessful: true,
        fareChartData: cachedFareData ? JSON.parse(cachedFareData) : PREDEFINED_FARE_MATRIX,
        isOfflineMode: true
      };
    }
  },

  /**
   * Calculates rickshaw and cart fare between two points bidirectionally.
   * @param {string} startLocation - Selected departure point.
   * @param {string} destinationLocation - Selected arrival point.
   * @param {Array<Object>} [activeFareList=PREDEFINED_FARE_MATRIX] - Current fare reference table.
   * @returns {Object|null} Calculation outcome.
   */
  calculateFare(startLocation, destinationLocation, activeFareList = PREDEFINED_FARE_MATRIX) {
    if (!startLocation || !destinationLocation) {
      return null;
    }

    if (startLocation === destinationLocation) {
      return {
        hasMatchingRoute: false,
        isSameLocationSelected: true,
        userFeedbackMessage: 'Start point and destination cannot be identical.'
      };
    }

    const matchedRoute = activeFareList.find((routeItem) => {
      const isDirectMatch =
        routeItem.from.toLowerCase() === startLocation.toLowerCase() &&
        routeItem.to.toLowerCase() === destinationLocation.toLowerCase();

      const isReverseMatch =
        routeItem.from.toLowerCase() === destinationLocation.toLowerCase() &&
        routeItem.to.toLowerCase() === startLocation.toLowerCase();

      return isDirectMatch || isReverseMatch;
    });

    if (matchedRoute) {
      return {
        hasMatchingRoute: true,
        pickupLocation: startLocation,
        destinationLocation,
        rickshawFare: matchedRoute.rickshawFare,
        cartFare: matchedRoute.cartFare,
        estimatedSavingsAmount: matchedRoute.rickshawFare - matchedRoute.cartFare
      };
    }

    return {
      hasMatchingRoute: false,
      pickupLocation: startLocation,
      destinationLocation,
      userFeedbackMessage: `No official fare is set by the authority between "${startLocation}" and "${destinationLocation}".`
    };
  },

  /**
   * Submits passenger overcharge complaints into localStorage repository.
   * @async
   * @param {Object} reportPayload - Incident submission details.
   * @returns {Promise<{isSuccessful: boolean, responseMessage: string}>}
   */
  async reportOvercharge(reportPayload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedComplaints = JSON.parse(localStorage.getItem(OVERCHARGE_COMPLAINTS_STORAGE_KEY) || '[]');
        const updatedComplaintsList = [
          ...storedComplaints,
          {
            ...reportPayload,
            reportId: Date.now(),
            reportedAtTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];

        localStorage.setItem(OVERCHARGE_COMPLAINTS_STORAGE_KEY, JSON.stringify(updatedComplaintsList));
        resolve({
          isSuccessful: true,
          responseMessage: 'Overcharge complaint submitted successfully to administration.'
        });
      }, 300);
    });
  },

  /**
   * Admin: Retrieves all reported overcharge complaints.
   * @async
   * @returns {Promise<Array<Object>>}
   */
  async getComplaints() {
    const storedComplaints = JSON.parse(localStorage.getItem(OVERCHARGE_COMPLAINTS_STORAGE_KEY) || '[]');
    return storedComplaints;
  },

  /**
   * Admin: Adds a new official route to the fare chart.
   * @async
   * @param {Object} newRoutePayload - New route details.
   * @returns {Promise<{isSuccessful: boolean, updatedData?: Array<Object>, errorMessage?: string}>}
   */
  async addRoute(newRoutePayload) {
    const storedChart = JSON.parse(localStorage.getItem(FARE_CACHE_STORAGE_KEY) || JSON.stringify(PREDEFINED_FARE_MATRIX));
    const isDuplicateRoute = storedChart.some(
      (item) =>
        (item.from.toLowerCase() === newRoutePayload.from.toLowerCase() &&
          item.to.toLowerCase() === newRoutePayload.to.toLowerCase()) ||
        (item.from.toLowerCase() === newRoutePayload.to.toLowerCase() &&
          item.to.toLowerCase() === newRoutePayload.from.toLowerCase())
    );

    if (isDuplicateRoute) {
      return {
        isSuccessful: false,
        errorMessage: 'This route already exists in the campus fare chart.'
      };
    }

    const updatedFareChart = [...storedChart, { ...newRoutePayload, id: Date.now() }];
    localStorage.setItem(FARE_CACHE_STORAGE_KEY, JSON.stringify(updatedFareChart));

    return {
      isSuccessful: true,
      updatedData: updatedFareChart
    };
  },

  /**
   * Admin: Deletes an existing route from the fare chart.
   * @async
   * @param {number} routeIdentifier - Unique ID of route to delete.
   * @returns {Promise<{isSuccessful: boolean, updatedData: Array<Object>}>}
   */
  async deleteRoute(routeIdentifier) {
    const storedChart = JSON.parse(localStorage.getItem(FARE_CACHE_STORAGE_KEY) || JSON.stringify(PREDEFINED_FARE_MATRIX));
    const updatedFareChart = storedChart.filter((item) => item.id !== routeIdentifier);
    localStorage.setItem(FARE_CACHE_STORAGE_KEY, JSON.stringify(updatedFareChart));

    return {
      isSuccessful: true,
      updatedData: updatedFareChart
    };
  }
};