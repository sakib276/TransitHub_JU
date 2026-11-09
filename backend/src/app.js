const express = require("express");
const cors = require("cors");

const authRoutes = require("./features/auth/authRoutes");
const notificationRoutes = require("./features/notification/notificationRoutes");

/**
 * Configures the Express application for TransitHub_JU.
 *
 * The app is exported without calling listen() so that it can be
 * started by server.js and reused by automated tests.
 *
 * @module app
 */

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Authentication routes.
 */
app.use("/api/auth", authRoutes);

/**
 * Notification routes.
 */
app.use("/api/notifications", notificationRoutes);

/**
 * Handles requests to routes that do not exist.
 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

/**
 * Handles errors raised before a controller runs, such as a
 * malformed JSON request body.
 */
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = error.type === "entity.parse.failed" ? 400 : 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 400
        ? "Request body is not valid JSON."
        : "Something went wrong. Please try again.",
  });
});

module.exports = app;