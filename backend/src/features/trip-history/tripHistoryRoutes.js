const express = require("express");

const {
  getTripHistory,
} = require("./tripHistoryController");

const router = express.Router();

/**
 * Retrieves trip history for the authenticated passenger.
 */
router.get("/", getTripHistory);

module.exports = router;