/**
 * @file Provides complaint constants, validation, and API communication.
 */

/**
 * Available complaint categories for passengers.
 *
 * @constant
 */
export const COMPLAINT_CATEGORY = {
  DRIVER: 'DRIVER',
  SERVICE: 'SERVICE',
  RIDE: 'RIDE',
};

/**
 * Validates passenger complaint data before submission.
 *
 * A related ride is optional because the system supports
 * general complaints that are not connected to a specific ride.
 *
 * @param {Object} complaintData - Complaint information to validate.
 * @returns {{isValid: boolean, errors: Object}} Validation result.
 */
export function validateComplaint(complaintData = {}) {
  const errors = {};

  if (!complaintData.category) {
    errors.category = 'Complaint category is required.';
  }

  if (!complaintData.description?.trim()) {
    errors.description = 'Complaint description is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Submits a complaint to the TransitHub_JU backend API.
 *
 * @param {Object} complaintData - Complaint information.
 * @param {string} complaintData.category - Complaint category.
 * @param {string} complaintData.description - Complaint description.
 * @param {string} [complaintData.relatedRide] - Optional related ride ID.
 * @returns {Promise<Object>} Created complaint returned by the backend.
 * @throws {Error} If the API request fails.
 */
export async function submitComplaint(complaintData) {
  const response = await fetch(
    'http://localhost:3000/api/complaints',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: complaintData.category,
        description: complaintData.description,
        relatedRideId: complaintData.relatedRide || null,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to submit complaint.',
    );
  }

  return result.data;
}