/**
 * Mock data + API for FR-12 (Report Emergency).
 *
 * There is no backend yet, so this pretends to be the API that would send an
 * emergency alert to the administrator and let the administrator list/manage
 * alerts. Reported alerts are kept in an in-memory list so the admin page can
 * "receive" what passengers/drivers send during the same session.
 */

// How long the mock request takes.
const SEND_DELAY_MS = 1500;
const LOAD_DELAY_MS = 1200;

// How often the mock request fails, to simulate a network issue.
const NETWORK_FAILURE_CHANCE = 0.3;

// Mock "last known stand" location, used since there is no real GPS/geolocation.
const LAST_KNOWN_STAND = 'JU Gate Stand';

let nextAlertId = 1;
const alerts = [];

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
 * Sends an emergency alert to the administrator.
 *
 * @param {Object} report - Emergency report details.
 * @param {'passenger'|'driver'} report.role - Who is reporting.
 * @param {string} report.reporterName - Name of the passenger/driver reporting.
 * @param {string} report.contact - Reporter's contact number.
 * @param {string} report.tripId - Active trip identifier.
 * @param {string} [report.vehiclePlate] - Vehicle plate, if reported by a driver.
 * @param {string} [report.details] - Optional extra details (e.g. type of emergency).
 * @returns {Promise<Object>} The saved alert, including its id and timestamp.
 * @throws {Error} If the alert fails to send (network failure).
 */
export async function reportEmergency(report) {
  await wait(SEND_DELAY_MS);

  if (Math.random() < NETWORK_FAILURE_CHANCE) {
    throw new Error('Could not send emergency alert. Check your connection and try again.');
  }

  const alert = {
    id: nextAlertId++,
    role: report.role,
    reporterName: report.reporterName,
    contact: report.contact,
    tripId: report.tripId,
    vehiclePlate: report.vehiclePlate ?? null,
    details: report.details ?? '',
    location: LAST_KNOWN_STAND,
    status: 'New',
    reportedAt: new Date().toISOString(),
  };

  alerts.unshift(alert);

  return alert;
}

/**
 * Gets all emergency alerts for the administrator dashboard.
 *
 * @returns {Promise<Object[]>} Current emergency alerts, most recent first.
 * @throws {Error} If the alerts fail to load (network/connection failure).
 */
export async function getEmergencyAlerts() {
  await wait(LOAD_DELAY_MS);

  if (Math.random() < NETWORK_FAILURE_CHANCE) {
    throw new Error('Lost connection to the alert feed. Reconnecting...');
  }

  return [...alerts];
}

/**
 * Marks an emergency alert as being coordinated/resolved by the administrator.
 *
 * @param {number} alertId - Id of the alert to update.
 * @param {'Coordinating'|'Resolved'} nextStatus - New status for the alert.
 * @returns {Promise<Object>} The updated alert.
 * @throws {Error} If the alert can't be found or the update fails.
 */
export async function coordinateResponse(alertId, nextStatus) {
  await wait(SEND_DELAY_MS);

  if (Math.random() < NETWORK_FAILURE_CHANCE) {
    throw new Error('Could not update the alert. Try again.');
  }

  const alert = alerts.find((item) => item.id === alertId);

  if (!alert) {
    throw new Error('Alert details unavailable.');
  }

  alert.status = nextStatus;

  return alert;
}
