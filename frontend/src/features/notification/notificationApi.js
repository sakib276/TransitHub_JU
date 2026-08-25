/**
 * Notification API service.
 * Currently uses mock data.
 * Replace with real backend API calls later.
 */

/**
 * Simulated network delay for mock API calls.
 *
 * @param {number} ms - Delay duration in milliseconds.
 * @returns {Promise<void>} Resolves after the given delay.
 */
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Retrieves notifications for the current user.
 *
 * @returns {Promise<Array>} A promise containing notification data.
 */
export async function getNotifications() {
  await delay(500);

  return [
    {
      notificationId: 1,
      userId: 5,
      title: 'Driver Assigned',
      message: 'Good news! A driver has been assigned to your ride request.',
      isRead: false,
      createdAt: '2026-08-25T10:30:00',
    },
    {
      notificationId: 2,
      userId: 5,
      title: 'Queue Position Updated',
      message: 'Your queue position is now #3.',
      isRead: false,
      createdAt: '2026-08-25T10:15:00',
    },
    {
      notificationId: 3,
      userId: 5,
      title: 'Ride Request Accepted',
      message: 'Your ride request has been accepted.',
      isRead: true,
      createdAt: '2026-08-24T16:30:00',
    },
    {
      notificationId: 4,
      userId: 5,
      title: 'Shared Ride Update',
      message: 'A new passenger has joined your shared ride.',
      isRead: true,
      createdAt: '2026-08-24T14:20:00',
    },
  ];
}

/**
 * Marks all notifications as read.
 *
 * @param {Array} notifications - Current notification list.
 * @returns {Promise<Array>} Updated notification list.
 */
export async function markAllNotificationsAsRead(notifications) {
  await delay(300);

  return notifications.map((notification) => ({
    ...notification,
    isRead: true,
  }));
}