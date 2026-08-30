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