/**
 * Provides API functions for retrieving and managing notifications.
 *
 * The current implementation uses mock data for frontend development.
 * The API calls can be replaced with the actual backend endpoints when
 * the notification backend is connected.
 *
 * 
 */

/**
 * Base URL for notification-related API endpoints.
 *
 * @constant
 * @type {string}
 */

const _BASE_URL = "/api/notifications";

/**
 * Mock notification data used during frontend development.
 *
 * @constant
 * @type {Array<Object>}
 */



const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "driver_assigned",
    category: "ride",
    title: "Driver Assigned",
    message: "Your ride request #RID1234 has been assigned to a driver.",
    time: "Today, 10:30 AM",
    status: "unread",
    details: {
      description:
        "Good news! A driver has been assigned to your ride request. Please be ready at your pickup location at the estimated time.",
      dateTime: "Today, 10:30 AM",
      relatedRideId: "RID1234",
      rideStatus: "Driver Assigned",
    },
  },
  {
    id: "n2",
    type: "queue_update",
    category: "queue",
    title: "Queue Position Update",
    message: "You are now at position #3 in the queue.",
    time: "Today, 10:15 AM",
    status: "unread",
    details: {
      description: "Your position in the ride queue has been updated.",
      dateTime: "Today, 10:15 AM",
      relatedRideId: "RID1234",
      rideStatus: "In Queue",
    },
  },
  {
    id: "n3",
    type: "pickup_time",
    category: "ride",
    title: "Estimated Pickup Time",
    message: "Your estimated pickup time is 10:45 AM.",
    time: "Today, 10:10 AM",
    status: "unread",
    details: {
      description:
        "Your estimated pickup time has been calculated based on current traffic and driver location.",
      dateTime: "Today, 10:10 AM",
      relatedRideId: "RID1234",
      rideStatus: "Pending Pickup",
    },
  },
  {
    id: "n4",
    type: "system_maintenance",
    category: "system",
    title: "System Maintenance",
    message:
      "Scheduled maintenance on 27th May from 2:00 AM to 4:00 AM.",
    time: "Yesterday, 08:00 PM",
    status: "read",
    details: {
      description:
        "TransitHub JU will be undergoing scheduled maintenance. The app may be unavailable during this window.",
      dateTime: "27 May, 2:00 AM - 4:00 AM",
      relatedRideId: "-",
      rideStatus: "-",
    },
  },
  {
    id: "n5",
    type: "ride_completed",
    category: "ride",
    title: "Ride Completed",
    message: "Your ride #RID1220 has been completed. Thank you!",
    time: "Yesterday, 06:45 PM",
    status: "read",
    details: {
      description:
        "Your ride has been completed successfully. Thanks for riding with TransitHub JU.",
      dateTime: "Yesterday, 06:45 PM",
      relatedRideId: "RID1220",
      rideStatus: "Completed",
    },
  },
];

/**
 * Mock recent activity data used during frontend development.
 *
 * @constant
 * @type {Array<Object>}
 */
const MOCK_ACTIVITY = [
  {
    id: "a1",
    icon: "user",
    title: "Latest Notification",
    detail: "Driver Assigned for ride #RID1234",
    time: "Today, 10:30 AM",
  },
  {
    id: "a2",
    icon: "car",
    title: "Driver Assignment",
    detail:
      "Driver Name: John Doe\nVehicle: JU-1234 (Toyota Premio)",
    time: "Today, 10:30 AM",
  },
  {
    id: "a3",
    icon: "users",
    title: "Queue Position",
    detail: "You are at position #3",
    time: "Today, 10:15 AM",
  },
  {
    id: "a4",
    icon: "clock",
    title: "Estimated Pickup Time",
    detail: "10:45 AM",
    time: "Today, 10:10 AM",
  },
];

/**
 * Retrieves all notifications.
 *
 * The current implementation returns mock notification data.
 * Replace the mock implementation with the actual API request
 * when the backend is connected.
 *
 * @async
 * @returns {Promise<Array<Object>>} A promise containing the notification list.
 */
export async function getNotifications() {
  // return fetch(BASE_URL).then((res) => res.json());

  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_NOTIFICATIONS), 200)
  );
}

/**
 * Retrieves recent notification-related activity.
 *
 * The current implementation returns mock activity data.
 * Replace the mock implementation with the actual API request
 * when the backend is connected.
 *
 * @async
 * @returns {Promise<Array<Object>>} A promise containing recent activity items.
 */
export async function getRecentActivity() {
  // return fetch(`${BASE_URL}/activity`).then((res) => res.json());

  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_ACTIVITY), 200)
  );
}

/**
 * Marks all notifications as read.
 *
 * The current implementation simulates the API request using
 * a short delay.
 *
 * @async
 * @returns {Promise<void>} Resolves after the operation is completed.
 */
export async function markAllAsRead() {
  // return fetch(`${BASE_URL}/read-all`, { method: "PATCH" });

  return new Promise((resolve) => setTimeout(resolve, 150));
}

/**
 * Marks a specific notification as read.
 *
 * The current implementation simulates the API request using
 * a short delay.
 *
 * @async
 * @param {string} id - Unique identifier of the notification.
 * @returns {Promise<void>} Resolves after the operation is completed.
 */
export async function markAsRead(_id) {
  // return fetch(`${BASE_URL}/${id}/read`, { method: "PATCH" });

  return new Promise((resolve) => setTimeout(resolve, 150));
}

/**
 * Clears all notifications.
 *
 * The current implementation simulates the API request using
 * a short delay.
 *
 * @async
 * @returns {Promise<void>} Resolves after the operation is completed.
 */
export async function clearNotifications() {
  // return fetch(BASE_URL, { method: "DELETE" });

  return new Promise((resolve) => setTimeout(resolve, 150));
}