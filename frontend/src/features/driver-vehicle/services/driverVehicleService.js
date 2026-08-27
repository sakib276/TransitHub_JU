/**
 * Mock data + API for FR-11.1 (Passenger: View Assigned Driver).
 *
 * There is no backend yet, so this pretends to be the API call that would
 * normally join Drivers + Users + Vehicles once a ride request is accepted.
 */

const assignedDriverByRequest = {
  'REQ-1001': {
    driverName: 'Karim Mia',
    driverPhoto: 'https://i.pravatar.cc/150?img=12',
    vehicleType: 'Rickshaw',
    vehicleColor: 'Green',
    plateNumber: 'JU-RIK-101',
  },
};

// Requests where the ride is accepted, but driver/vehicle info is not
// ready yet (simulates the "Info Unavailable" case in FR-11.1).
const pendingRequestIds = new Set(['REQ-1002']);

// Requests that always fail, used to simulate the "Network Failure" case.
const failingRequestIds = new Set(['REQ-1003']);

/**
 * Waits for the given number of milliseconds.
 *
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>} Resolves after the delay.
 */
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Gets the driver and vehicle assigned to a ride request.
 *
 * @param {string} requestId - Ride request id.
 * @returns {Promise<Object|null>} Driver/vehicle info, or null if the ride
 * is accepted but the details are not ready yet.
 * @throws {Error} If the details fail to load (network failure).
 */
export async function getAssignedDriver(requestId) {
  await wait(600);

  if (failingRequestIds.has(requestId)) {
    throw new Error('Could not load driver details. Check your connection and try again.');
  }

  if (pendingRequestIds.has(requestId)) {
    return null;
  }

  const driver = assignedDriverByRequest[requestId];

  if (!driver) {
    throw new Error('No driver has been assigned to this ride yet.');
  }

  return driver;
}
