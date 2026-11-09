import { apiRequest } from "../../shared/api";

/**
 * Base API endpoint for notification operations.
 *
 * @constant
 * @type {string}
 */
const NOTIFICATIONS_ENDPOINT = "/notifications";

/**
 * Formats an ISO date string into a readable local date and time.
 *
 * @param {string} dateString - ISO date string.
 * @returns {string} Formatted local date and time.
 */
function formatNotificationTime(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString();
}

/**
 * Determines the notification category from notification information.
 *
 * @param {Object} notification - Notification object.
 * @param {string} notification.title - Notification title.
 * @param {string} notification.message - Notification message.
 * @returns {string} Notification category.
 */
function getNotificationCategory(notification) {
  const title = String(notification.title || "").toLowerCase();
  const message = String(notification.message || "").toLowerCase();

  if (
    title.includes("queue") ||
    message.includes("queue") ||
    title.includes("pickup") ||
    message.includes("pickup")
  ) {
    return "queue";
  }

  if (
    title.includes("system") ||
    message.includes("maintenance") ||
    message.includes("announcement")
  ) {
    return "system";
  }

  return "ride";
}

/**
 * Maps a backend notification object into the frontend notification format.
 *
 * @param {Object} notification - Backend notification object.
 * @returns {Object} Frontend notification object.
 */
function mapNotification(notification) {
  const category = getNotificationCategory(notification);

  return {
    id: notification.notificationId,
    notificationId: notification.notificationId,
    userId: notification.userId,
    type:
      notification.type ||
      notification.notificationType ||
      category,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    status: notification.isRead ? "read" : "unread",
    createdAt: notification.createdAt,
    time: formatNotificationTime(notification.createdAt),
    category,
    details: {
      title: notification.title,
      message: notification.message,
      time: formatNotificationTime(notification.createdAt),
    },
  };
}

/**
 * Retrieves notifications for the authenticated user.
 *
 * @returns {Promise<Array>} List of mapped notifications.
 * @throws {Error} When the request fails.
 */
export async function getNotifications() {
  const response = await apiRequest(NOTIFICATIONS_ENDPOINT);

  return response.data.map(mapNotification);
}

/**
 * Maps a notification into recent activity format.
 *
 * @param {Object} notification - Notification object.
 * @returns {Object} Recent activity object.
 */
function mapRecentActivity(notification) {
  return {
    id: notification.notificationId,
    icon: "🔔",
    title: notification.title,
    detail: notification.message,
    time: formatNotificationTime(notification.createdAt),
  };
}

/**
 * Retrieves recent notification activity.
 *
 * @returns {Promise<Array>} List of recent activity items.
 * @throws {Error} When the request fails.
 */
export async function getRecentActivity() {
  const response = await apiRequest(NOTIFICATIONS_ENDPOINT);

  return response.data.map(mapRecentActivity);
}

/**
 * Marks a notification as read.
 *
 * @param {number|string} notificationId - Notification identifier.
 * @returns {Promise<void>} Resolves after the update request.
 * @throws {Error} When the request fails.
 */
export async function markAsRead(notificationId) {
  await apiRequest(
    `${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`,
    {
      method: "PATCH",
    }
  );
}

/**
 * Marks all notifications as read.
 *
 * @returns {Promise<void>} Resolves after the update request.
 * @throws {Error} When the request fails.
 */
export async function markAllAsRead() {
  await apiRequest(
    `${NOTIFICATIONS_ENDPOINT}/read-all`,
    {
      method: "PATCH",
    }
  );
}

/**
 * Clears all notifications belonging to the authenticated user.
 *
 * @returns {Promise<void>} Resolves after the delete request.
 * @throws {Error} When the request fails.
 */
export async function clearNotifications() {
  await apiRequest(
    NOTIFICATIONS_ENDPOINT,
    {
      method: "DELETE",
    }
  );
}