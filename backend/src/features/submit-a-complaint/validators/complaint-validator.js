/**
 * @file Validator functions for passenger complaint submission and admin status updates.
 *
 * Provides pure validation routines for complaint data payloads without coupling
 * to Express HTTP requests, databases, or authentication mechanisms.
 */

import {
  COMPLAINT_CATEGORY,
  COMPLAINT_STATUS,
} from '../constants/complaint-constants.js';

const ALLOWED_CATEGORIES = Object.values(COMPLAINT_CATEGORY);
const ALLOWED_STATUSES = Object.values(COMPLAINT_STATUS);

/**
 * Validates a complaint creation payload submitted by a passenger.
 *
 * @param {Object} [payload] - Complaint creation payload.
 * @param {string} [payload.category] - Complaint category.
 * @param {string} [payload.description] - Detailed complaint description.
 * @param {string} [payload.relatedRideId] - Optional associated ride ID.
 * @param {string} [payload.relatedRide] - Optional alias for relatedRideId.
 * @returns {{isValid: boolean, errors: Record<string, string>, data: Object|null}} Validation result.
 */
export function validateCreateComplaint(payload) {
  const errors = {};

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: {
        category: 'Complaint category is required.',
        description: 'Complaint description is required.',
      },
      data: null,
    };
  }

  // 1. Category validation
  if (payload.category === undefined || payload.category === null || payload.category === '') {
    errors.category = 'Complaint category is required.';
  } else if (typeof payload.category !== 'string' || !ALLOWED_CATEGORIES.includes(payload.category)) {
    errors.category = 'Invalid complaint category. Must be DRIVER, SERVICE, or RIDE.';
  }

  // 2. Description validation
  if (payload.description === undefined || payload.description === null) {
    errors.description = 'Complaint description is required.';
  } else if (typeof payload.description !== 'string') {
    errors.description = 'Complaint description is required.';
  } else if (!payload.description.trim()) {
    errors.description = 'Complaint description is required.';
  }

  // 3. Related ride validation (optional, supports relatedRideId or relatedRide)
  const rawRideId = payload.relatedRideId !== undefined ? payload.relatedRideId : payload.relatedRide;
  let normalizedRideId = null;

  if (rawRideId !== undefined && rawRideId !== null && rawRideId !== '') {
    if (typeof rawRideId !== 'string') {
      errors.relatedRideId = 'Related ride ID must be a string.';
    } else {
      normalizedRideId = rawRideId.trim();
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    data: isValid
      ? {
          category: payload.category,
          relatedRideId: normalizedRideId,
          description: payload.description.trim(),
        }
      : null,
  };
}

/**
 * Validates an administrator complaint status update payload.
 *
 * @param {Object} [payload] - Complaint status update payload.
 * @param {string} [payload.status] - New lifecycle status for the complaint.
 * @param {string} [payload.adminNotes] - Optional notes from the admin.
 * @returns {{isValid: boolean, errors: Record<string, string>, data: Object|null}} Validation result.
 */
export function validateUpdateComplaintStatus(payload) {
  const errors = {};

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: {
        status: 'Complaint status is required.',
      },
      data: null,
    };
  }

  // 1. Status validation
  if (payload.status === undefined || payload.status === null || payload.status === '') {
    errors.status = 'Complaint status is required.';
  } else if (typeof payload.status !== 'string' || !ALLOWED_STATUSES.includes(payload.status)) {
    errors.status = 'Invalid complaint status. Must be UNDER_REVIEW, RESOLVED, or DISMISSED.';
  }

  // 2. Admin notes validation (optional)
  let normalizedAdminNotes = null;
  if (payload.adminNotes !== undefined && payload.adminNotes !== null) {
    if (typeof payload.adminNotes !== 'string') {
      errors.adminNotes = 'Admin notes must be a string.';
    } else {
      normalizedAdminNotes = payload.adminNotes.trim();
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    data: isValid
      ? {
          status: payload.status,
          adminNotes: normalizedAdminNotes,
        }
      : null,
  };
}

