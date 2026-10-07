import { apiRequest } from "../../shared/api";

const NOTIFICATIONS_ENDPOINT = "/notifications";

/**
 * Converts a notification creation timestamp into a
 * user-friendly local date and time.
 *
 * @param {string|Date} createdAt - Notification creation timestamp.
 * @returns {string} Formatted local date and time.
 */
function formatNotificationTime(createdAt) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString();
}

/**
 * Determines a UI category from the notification title and message.
 *
 * The category is derived for the existing frontend filter UI.
 * It is not stored in the Notifications database table.
 *
 * @param {string} title - Notification title.
 * @param {string} message - Notification message.
 * @returns {string} Derived notification category.
 */
function getNotificationCategory(title, message) {
  const notificationText =
    `${title} ${message}`.toLowerCase();

  if (notificationText.includes("queue")) {
    return "queue";
  }

  if (
    notificationText.includes("maintenance") ||
    notificationText.includes("announcement")
  ) {
    return "system";
  }

  return "ride";
}

/**
 * Converts a backend notification into the frontend
 * notification structure currently used by the UI.
 *
 * @param {Object} notification - Backend notification.
 * @returns {Object} Frontend notification object.
 */
function mapNotification(notification) {
  const notificationId =
    notification.notificationId ??
    notification.notification_id;

  const userId =
    notification.userId ??
    notification.user_id;

  const title = notification.title;
  const message = notification.message;

  const isRead = Boolean(
    notification.isRead ??
    notification.is_read
  );

  const createdAt =
    notification.createdAt ??
    notification.created_at;

  return {
    id: notificationId,
    notificationId,
    userId,
    title,
    message,
    isRead,
    status: isRead ? "read" : "unread",
    createdAt,
    time: formatNotificationTime(createdAt),
    category: getNotificationCategory(
      title,
      message
    ),
    details: {
      message,
      createdAt,
      status: isRead ? "read" : "unread",
    },
  };
}

/**
 * Retrieves notifications belonging to the authenticated user.
 *
 * @returns {Promise<Array>} Notification list.
 * @throws {Error} When the notification request fails.
 */
export async function getNotifications() {
  const response = await apiRequest(
    NOTIFICATIONS_ENDPOINT
  );

  return response.data.map(mapNotification);
}

/**
 * Converts notifications into recent activity items
 * for the existing notification page.
 *
 * @param {Array} notifications - Notification records.
 * @returns {Array} Recent activity items.
 */
function mapRecentActivity(notifications) {
  return notifications.slice(0, 5).map((notification) => ({
    id: `activity-${notification.id}`,
    icon: "🔔",
    title: notification.title,
    detail: notification.message,
    time: notification.time,
  }));
}

/**
 * Retrieves recent notification activity.
 *
 * @param {Array|null} notifications - Existing notification list.
 * @returns {Promise<Array>} Recent activity items.
 */
export async function getRecentActivity(
  notifications = null
) {
  if (notifications) {
    return mapRecentActivity(notifications);
  }

  const notificationList = await getNotifications();

  return mapRecentActivity(notificationList);
}

/**
 * Marks one notification as read.
 *
 * @param {number} notificationId - Notification identifier.
 * @returns {Promise<void>} Resolves after the update.
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
 * Marks all notifications belonging to the authenticated
 * user as read.
 *
 * @returns {Promise<void>} Resolves after the update.
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