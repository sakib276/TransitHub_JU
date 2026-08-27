/**
 * Mock data + API for FR-11.1 (Passenger: View Assigned Driver).
 *
 * There is no backend yet, so this pretends to be the API call that would
 * normally join Drivers + Users + Vehicles once a ride request is accepted.
 */

const ASSIGNED_DRIVER = {
  driverName: 'Karim Mia',
  driverPhoto: 'https://i.pravatar.cc/150?img=12',
  vehicleType: 'Rickshaw',
  vehicleColor: 'Green',
  plateNumber: 'JU-RIK-101',
};

// How long the mock request takes.
const LOAD_DELAY_MS = 2000;

// How often the mock request fails, to simulate a network issue.
const NETWORK_FAILURE_CHANCE = 0.3;

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
 * Gets the driver and vehicle assigned to the passenger's accepted ride.
 *
 * @returns {Promise<Object>} Driver/vehicle info.
 * @throws {Error} If the details fail to load (network failure).
 */
export async function getAssignedDriver() {
  await wait(LOAD_DELAY_MS);

  if (Math.random() < NETWORK_FAILURE_CHANCE) {
    throw new Error('Could not load driver details. Check your connection and try again.');
  }

  return ASSIGNED_DRIVER;
}
