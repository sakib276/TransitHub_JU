/**
 * @file Constants and enums for the complaint feature.
 */

/**
 * Supported complaint categories.
 * @enum {string}
 */
export const COMPLAINT_CATEGORY = Object.freeze({
  DRIVER: 'DRIVER',
  SERVICE: 'SERVICE',
  RIDE: 'RIDE',
});

/**
 * Supported complaint lifecycle statuses.
 * @enum {string}
 */
export const COMPLAINT_STATUS = Object.freeze({
  UNDER_REVIEW: 'UNDER_REVIEW',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED',
});

/**
 * User roles relevant to complaints authorization.
 * @enum {string}
 */
export const USER_ROLES = Object.freeze({
  PASSENGER: 'PASSENGER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
});

