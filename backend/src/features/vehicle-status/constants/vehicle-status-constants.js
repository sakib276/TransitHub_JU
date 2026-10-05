/**
 * Vehicle and driver status constants 
 * 
 * @module vehicle-status-constants
 */

/**
 * Driver operational status enum.
 * 
 * @readonly
 * @enum {string}
 */

export const DriverStatus = {
    AVAILABLE: 'Available',
    BUSY: 'Busy',
    BUSY_AND_FULL: 'Busy & Full',
    OFFLINE: 'Offline',
};

/**
 * Administrative vehicle status enum.
 * 
 * @readonly
 * @enum {string}
 */

export const FleetStatus  = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    UNDER_MAINTENANCE: 'Under Maintenance',
};