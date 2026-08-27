/**
 * Available vehicle stands used by the vehicle status feature.
 *
 * @type {Array<{id: string, name: string}>}
 */
export const VEHICLE_STANDS = [
  {
    id: 'cse',
    name: 'CSE',
  },
  {
    id: 'dairy-gate',
    name: 'Dairy Gate',
  },
  {
    id: 'prantik',
    name: 'Prantik',
  },
  {
    id: 'main-gate',
    name: 'Main Gate',
  },
];

/**
 * Supported vehicle statuses.
 *
 * @type {Object<string, string>}
 */
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
};

/**
 * Mock current vehicle status.
 *
 * @type {{status: string, standId: string, updatedAt: string}}
 */
const currentStatus = {
  status: VEHICLE_STATUS.AVAILABLE,
  standId: '',
  updatedAt: '2m ago',
};

/**
 * Returns the current vehicle status.
 *
 * @returns {Promise<Object>} Current vehicle status.
 */
export async function getVehicleStatus() {
  return { ...currentStatus };
}

/**
 * Validates the data required to update vehicle status.
 *
 * @param {string} status - Vehicle status.
 * @param {string} standId - Selected stand identifier.
 * @returns {{valid: boolean, message: string}} Validation result.
 */
export function validateVehicleStatus(status, standId) {
  if (!status) {
    return {
      valid: false,
      message: 'Please select a vehicle status.',
    };
  }

  if (status === VEHICLE_STATUS.AVAILABLE && !standId) {
    return {
      valid: false,
      message: 'Please select your current stand.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}

/**
 * Updates the vehicle status in the mock service.
 *
 * @param {string} status - New vehicle status.
 * @param {string} standId - Selected stand identifier.
 * @returns {Promise<Object>} Updated vehicle status.
 */
export async function updateVehicleStatus(status, standId) {
  const validation = validateVehicleStatus(status, standId);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  currentStatus.status = status;
  currentStatus.standId = standId;
  currentStatus.updatedAt = 'just now';

  return { ...currentStatus };
}