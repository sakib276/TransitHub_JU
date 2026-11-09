const express = require("express");

const { login } = require("./authController");

/**
 * Defines authentication routes for TransitHub_JU.
 *
 * @module authRoutes
 */

const router = express.Router();

/**
 * Logs in a user and returns a JWT token.
 */
router.post("/login", login);

module.exports = router;