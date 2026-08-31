/**
 * Mock trip history records used for TDD.
 */
const tripHistoryData = [
  {
    id: 1,
    passengerId: 1,
    tripId: 101,
    routeName: "JU Campus Route",
    destination: "Central Library",
    completedAt: "2026-08-30T10:30:00",
  },
  {
    id: 2,
    passengerId: 1,
    tripId: 102,
    routeName: "Rokeya Hall",
    destination: "Bottola",
    completedAt: "2026-08-29T15:00:00",
  },
  {
    id: 3,
    passengerId: 2,
    tripId: 103,
    routeName: "CSE dept",
    destination: "Chourongi",
    completedAt: "2026-08-28T09:00:00",
  },
];

/**
 * Retrieves passenger trip history using optional filters.
 *
 * @param {number} passengerId - ID of the passenger.
 * @param {Object} filters - Optional filter values.
 * @param {string} [filters.date] - Completion date.
 * @param {string} [filters.destination] - Trip destination.
 * @returns {Promise<Array>} Matching trip history records.
 */
async function getTripHistory(passengerId, filters = {}) {
  let history = tripHistoryData.filter(
    (trip) => trip.passengerId === passengerId
  );

  if (filters.date) {
    history = history.filter((trip) =>
      trip.completedAt.startsWith(filters.date)
    );
  }

  if (filters.destination) {
    history = history.filter(
      (trip) => trip.destination === filters.destination
    );
  }

  return history;
}

module.exports = {
  getTripHistory,
};