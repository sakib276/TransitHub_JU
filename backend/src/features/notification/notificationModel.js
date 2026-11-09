const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Represents a notification stored for a system user.
 * Maps to the "notifications" table of the transithub_ju database.
 *
 * @module notificationModel
 */
const Notification = sequelize.define(
  "Notification",
  {
    notificationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "notification_id",
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_read",
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "notifications",
    timestamps: false,
  }
);

/**
 * Retrieves notifications belonging to a user, newest first.
 *
 * @param {number} userId - ID of the notification owner.
 * @returns {Promise<Array<Object>>} User notifications.
 */
async function getNotificationsByUserId(userId) {
  return Notification.findAll({
    where: {
      userId,
    },
    order: [
      ["createdAt", "DESC"],
      ["notificationId", "DESC"],
    ],
  });
}

/**
 * Finds one notification belonging to a user.
 *
 * @param {number} notificationId - ID of the notification.
 * @param {number} userId - ID of the notification owner.
 * @returns {Promise<Object|null>} The notification, or null if not found.
 */
async function getNotificationById(notificationId, userId) {
  return Notification.findOne({
    where: {
      notificationId,
      userId,
    },
  });
}

/**
 * Marks one notification as read for its owner.
 *
 * @param {number} notificationId - ID of the notification.
 * @param {number} userId - ID of the notification owner.
 * @returns {Promise<number>} Number of updated notifications.
 */
async function markNotificationAsRead(notificationId, userId) {
  const [updatedCount] = await Notification.update(
    {
      isRead: true,
    },
    {
      where: {
        notificationId,
        userId,
      },
    }
  );

  return updatedCount;
}

/**
 * Marks all notifications for a user as read.
 *
 * @param {number} userId - ID of the notification owner.
 * @returns {Promise<number>} Number of updated notifications.
 */
async function markAllNotificationsAsRead(userId) {
  const [updatedCount] = await Notification.update(
    {
      isRead: true,
    },
    {
      where: {
        userId,
        isRead: false,
      },
    }
  );

  return updatedCount;
}

/**
 * Creates a notification for a user.
 *
 * @param {number} userId - ID of the notification recipient.
 * @param {string} title - Notification title.
 * @param {string} message - Notification message.
 * @returns {Promise<Object>} Created notification.
 */
async function createNotification(userId, title, message) {
  return Notification.create({
    userId,
    title,
    message,
    isRead: false,
    createdAt: new Date(),
  });
}

/**
 * Deletes all notifications belonging to a user.
 *
 * @param {number} userId - ID of the notification owner.
 * @returns {Promise<number>} Number of deleted notifications.
 */
async function deleteNotificationsByUserId(userId) {
  return Notification.destroy({
    where: {
      userId,
    },
  });
}

module.exports = {
  Notification,
  getNotificationsByUserId,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  deleteNotificationsByUserId,
};