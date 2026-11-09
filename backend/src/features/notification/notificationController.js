const notificationModel = require("./notificationModel");

/**
 * Handles HTTP requests for the notification feature.
 *
 * @module notificationController
 */

const MAX_TITLE_LENGTH = 100;
const FOREIGN_KEY_ERROR = "SequelizeForeignKeyConstraintError";

/**
 * Checks whether a value is a usable database ID.
 *
 * @param {*} value - Value to check.
 * @returns {boolean} True when the value is a positive integer.
 */
function isValidId(value) {
  return Number.isInteger(value) && value > 0;
}

/**
 * Checks whether a value is a string containing visible text.
 *
 * @param {*} value - Value to check.
 * @returns {boolean} True when the value is a non-blank string.
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Retrieves notifications for the authenticated user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends notification data.
 */
async function getNotifications(req, res) {
  try {
    const userId = req.user.userId;

    const notifications =
      await notificationModel.getNotificationsByUserId(userId);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("getNotifications failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve notifications. Please try again.",
    });
  }
}

/**
 * Marks one notification as read.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends the update result.
 */
async function markAsRead(req, res) {
  try {
    const userId = req.user.userId;
    const notificationId = Number(req.params.notificationId);

    if (!isValidId(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await notificationModel.getNotificationById(
      notificationId,
      userId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    await notificationModel.markNotificationAsRead(notificationId, userId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("markAsRead failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update notification. Please try again.",
    });
  }
}

/**
 * Marks all notifications belonging to the authenticated user as read.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends the update result.
 */
async function markAllAsRead(req, res) {
  try {
    const userId = req.user.userId;

    await notificationModel.markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("markAllAsRead failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update notifications. Please try again.",
    });
  }
}

/**
 * Creates a notification for a user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends the created notification.
 */
async function createUserNotification(req, res) {
  try {
    const { userId, title, message } = req.body || {};

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "User ID, title, and message are required.",
      });
    }

    if (
      !isValidId(userId) ||
      !isNonEmptyString(title) ||
      !isNonEmptyString(message)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User ID must be a positive number. Title and message must be text.",
      });
    }

    if (title.trim().length > MAX_TITLE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
      });
    }

    const notification = await notificationModel.createNotification(
      userId,
      title.trim(),
      message.trim()
    );

    return res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    if (error.name === FOREIGN_KEY_ERROR) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    console.error("createUserNotification failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create notification. Please try again.",
    });
  }
}

/**
 * Deletes all notifications belonging to the authenticated user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends the delete result.
 */
async function clearNotifications(req, res) {
  try {
    const userId = req.user.userId;

    await notificationModel.deleteNotificationsByUserId(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications cleared.",
    });
  } catch (error) {
    console.error("clearNotifications failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to clear notifications. Please try again.",
    });
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createUserNotification,
  clearNotifications,
};