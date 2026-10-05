const express = require("express");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createUserNotification,
  clearNotifications,
} = require("./notificationController");

const authMiddleware = require("../../shared/middleware/authMiddleware");

/**
 * Defines the notification endpoints, mounted at /api/notifications.
 *
 * @module notificationRoutes
 */
const router = express.Router();

router.use(authMiddleware);

/**
 * GET /api/notifications
 * Retrieves notifications for the authenticated user.
 */
//router.get("/", getNotifications);
const notificationController = require("./notificationController");

router.get("/", notificationController.getNotifications);

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications as read.
 */
router.patch("/read-all", markAllAsRead);

/**
 * PATCH /api/notifications/:notificationId/read
 * Marks one notification as read.
 */
router.patch("/:notificationId/read", markAsRead);

/**
 * POST /api/notifications
 * Creates a notification.
 */
router.post("/", createUserNotification);

/**
 * DELETE /api/notifications
 * Clears all notifications of the authenticated user.
 */
router.delete("/", clearNotifications);

module.exports = router;