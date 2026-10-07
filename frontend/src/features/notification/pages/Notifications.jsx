import { useEffect, useMemo, useState } from "react";

import NotificationCard from "../components/NotificationCard";
import NotificationDetails from "../components/NotificationDetails";
import RecentActivity from "../components/RecentActivity";
import {
  getNotifications,
  getRecentActivity,
  markAllAsRead,
  markAsRead,
} from "../notificationApi";

import "../notifications.css";

/**
 * Defines the available notification filtering tabs.
 *
 * @constant
 * @type {Array<{key: string, label: string}>}
 */
const TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "ride", label: "Ride Updates" },
  { key: "queue", label: "Queue Updates" },
  { key: "system", label: "System Announcements" },
];

/**
 * Displays notifications belonging to the authenticated user.
 *
 * @component
 * @returns {JSX.Element} The notifications page.
 */
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Loads notifications from the backend.
   *
   * @returns {Promise<void>} Resolves after notification data is loaded.
   */
  useEffect(() => {
    async function loadNotificationData() {
      try {
        setLoading(true);
        setErrorMessage("");

        const notificationData = await getNotifications();

        const activityData =
          await getRecentActivity(notificationData);

        setNotifications(notificationData);
        setActivity(activityData);
        setSelected(notificationData[0] ?? null);
      } catch (error) {
        setErrorMessage(
          "Unable to load notifications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotificationData();
  }, []);

  /**
   * Filters notifications according to the active tab.
   *
   * @returns {Array} Filtered notification list.
   */
  const filtered = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }

    if (activeTab === "unread") {
      return notifications.filter(
        (notification) =>
          notification.status === "unread"
      );
    }

    return notifications.filter(
      (notification) =>
        notification.category === activeTab
    );
  }, [notifications, activeTab]);

  /**
   * Selects a notification and marks it as read.
   *
   * The backend is updated before the local state is changed.
   *
   * @param {Object} notification - Selected notification.
   * @returns {Promise<void>} Resolves after selection is processed.
   */
  const handleSelect = async (notification) => {
    setSelected(notification);

    if (notification.status !== "unread") {
      return;
    }

    try {
      await markAsRead(notification.notificationId);

      setNotifications((previousNotifications) =>
        previousNotifications.map(
          (currentNotification) =>
            currentNotification.notificationId ===
            notification.notificationId
              ? {
                  ...currentNotification,
                  isRead: true,
                  status: "read",
                }
              : currentNotification
        )
      );

      setSelected((previousNotification) => {
        if (
          !previousNotification ||
          previousNotification.notificationId !==
            notification.notificationId
        ) {
          return previousNotification;
        }

        return {
          ...previousNotification,
          isRead: true,
          status: "read",
        };
      });
    } catch (error) {
      setErrorMessage(
        "Unable to mark notification as read. Please try again."
      );
    }
  };

  /**
   * Marks every notification as read through the backend.
   *
   * @returns {Promise<void>} Resolves after all notifications are updated.
   */
  const handleMarkAllRead = async () => {
    try {
      setErrorMessage("");

      await markAllAsRead();

      setNotifications((previousNotifications) =>
        previousNotifications.map(
          (notification) => ({
            ...notification,
            isRead: true,
            status: "read",
          })
        )
      );

      setSelected((previousNotification) =>
        previousNotification
          ? {
              ...previousNotification,
              isRead: true,
              status: "read",
            }
          : null
      );
    } catch (error) {
      setErrorMessage(
        "Unable to mark notifications as read. Please try again."
      );
    }
  };

  return (
    <div className="notif-page">
      <div className="panel">
        <h1 className="notif-title">
          Notifications
        </h1>

        <div className="notif-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`notif-tab ${
                activeTab === tab.key
                  ? "active"
                  : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <p className="empty-state">
            {errorMessage}
          </p>
        )}

        {loading ? (
          <p className="empty-state">
            Loading notifications...
          </p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">
            No notifications here.
          </p>
        ) : (
          <div>
            {filtered.map((notification) => (
              <NotificationCard
                key={notification.notificationId}
                notification={notification}
                isSelected={
                  selected?.notificationId ===
                  notification.notificationId
                }
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        <div className="notif-footer">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn-outline"
          >
            ✉️ Mark All as Read
          </button>
        </div>

        <p className="notif-footer-note">
          All times are in local time
        </p>
      </div>

      <div>
        <NotificationDetails
          notification={selected}
        />
        <RecentActivity items={activity} />
      </div>
    </div>
  );
}