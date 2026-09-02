const tripHistoryModel = require("./tripHistoryModel");

/**
 * Retrieves trip history for the authenticated passenger.
 *
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Sends trip history response.
 */
const getTripHistory = async (request, response) => {
  try {
    const userId = request.user.userId;

    const filters = {
      date: request.query.date,
      destination: request.query.destination,
    };

    const history = await tripHistoryModel.getTripHistory(userId, filters);

    return response.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to retrieve trip history.",
    });
  }
};

module.exports = {
  getTripHistory,
};