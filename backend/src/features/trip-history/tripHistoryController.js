//const tripHistoryModel = require("./tripHistoryModel");
import * as tripHistoryModel from "./tripHistoryModel";
/**
 * Retrieves trip history for the authenticated passenger.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} HTTP response containing trip history.
 */
async function getTripHistory(req, res) {
  try {
    const passengerId = req.user.userId;

    const filters = {
      date: req.query.date,
      destination: req.query.destination,
    };

    const history = await tripHistoryModel.getTripHistory(
      passengerId,
      filters
    );

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve trip history.",
    });
  }
}

module.exports = {
  getTripHistory,
};