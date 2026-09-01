/**
 * @file Constants and enums for the submit-a-complaint feature.
 *
 * Defines standardized enumerations for complaint categories,
 * lifecycle statuses, and user authorization roles.
 */

/**
 * Complaint categories available for passengers.
 *
 * @readonly
 * @enum {string}
 * @property {string} DRIVER - Complaints regarding driver conduct or behavior.
 * @property {string} SERVICE - Complaints regarding general service or transit operations.
 * @property {string} RIDE - Complaints regarding a specific ride or vehicle condition.
 */
export const COMPLAINT_CATEGORY = Object.freeze({
  DRIVER: 'DRIVER',
  SERVICE: 'SERVICE',
  RIDE: 'RIDE',
});

/**
 * Complaint lifecycle statuses.
 *
 * @readonly
 * @enum {string}
 * @property {string} UNDER_REVIEW - Initial state upon submission; pending admin review.
 * @property {string} RESOLVED - Complaint has been reviewed and resolved by an admin.
 * @property {string} DISMISSED - Complaint has been reviewed and dismissed by an admin.
 */
export const COMPLAINT_STATUS = Object.freeze({
  UNDER_REVIEW: 'UNDER_REVIEW',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED',
});

/**
 * User roles recognized for authorization in the complaint feature.
 *
 * @readonly
 * @enum {string}
 * @property {string} PASSENGER - Regular passenger user submitting and viewing their complaints.
 * @property {string} DRIVER - Transport vehicle driver.
 * @property {string} ADMIN - Administrator reviewing and resolving complaints.
 */
export const USER_ROLES = Object.freeze({
  PASSENGER: 'PASSENGER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
});

