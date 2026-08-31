/**
 * Mock trip history records used for initial TDD implementation.
 */
const tripHistoryData = [
  {
    id: 1,
    passengerId: 1,
    tripId: 101,
    routeName: "JU Campus Route",
    completedAt: "2026-08-30T10:30:00",
  },
  {
    id: 2,
    passengerId: 1,
    tripId: 102,
    routeName: "Savar Route",
    completedAt: "2026-08-29T15:00:00",
  },
  {
    id: 3,
    passengerId: 2,
    tripId: 103,
    routeName: "Dhaka Route",
    completedAt: "2026-08-28T09:00:00",
  },
];

/**
 * Retrieves trip history records belonging to a passenger.
 *
 * @param {number} passengerId - ID of the passenger.
 * @returns {Promise<Array>} Matching trip history records.
 */
async function getTripHistory(passengerId) {
  return tripHistoryData.filter(
    (trip) => trip.passengerId === passengerId
  );
}

module.exports = {
  getTripHistory,
};