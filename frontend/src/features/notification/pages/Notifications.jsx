import { useEffect, useMemo, useState } from "react";

import {
  clearNotifications,
  getNotifications,
  getRecentActivity,
  markAllAsRead,
  markAsRead,
} from "../notificationApi";

import NotificationCard from "../components/NotificationCard";
import NotificationDetails from "../components/NotificationDetails";
import RecentActivity from "../components/RecentActivity";

/**
 * Available notification filter tabs.
 *
 * @constant
 * @type {Array<Object>}
 */
const TABS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "unread",
    label: "Unread",
  },
  {
    id: "ride",
    label: "Ride Updates",
  },
  {
    id: "queue",
    label: "Queue Updates",
  },
  {
    id: "system",
    label: "System Announcements",
  },
];

/**
 * Receive Notification page.
 *
 * Displays notifications, supports filtering, marking notifications
 * as read, clearing notifications, and showing recent activity.
 *
 * @returns {JSX.Element} Notification page.
 */
function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Loads notifications and recent activity when the page is mounted.
   *
   * @returns {Promise<void>} Resolves after the data is loaded.
   */
  useEffect(() => {
    const loadNotificationData = async () => {
      try {
        setLoading(true);

        const [notificationData, activityData] = await Promise.all([
          getNotifications(),
          getRecentActivity(),
        ]);

        setNotifications(notificationData);
        setActivity(activityData);

        if (notificationData.length > 0) {
          setSelected(notificationData[0]);
        } else {
          setSelected(null);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);

        setNotifications([]);
        setActivity([]);
        setSelected(null);
      } finally {
        setLoading(false);
      }
    };

    loadNotificationData();
  }, []);

  /**
   * Filters notifications according to the active tab.
   *
   * @returns {Array<Object>} Filtered notifications.
   */
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }

    if (activeTab === "unread") {
      return notifications.filter(
        (notification) => notification.status === "unread"
      );
    }

    return notifications.filter(
      (notification) => notification.category === activeTab
    );
  }, [activeTab, notifications]);

  /**
   * Handles selecting a notification.
   *
   * @param {Object} notification - Selected notification.
   * @returns {Promise<void>} Resolves after the notification is processed.
   */
  const handleNotificationSelect = async (notification) => {
    setSelected(notification);

    if (notification.status !== "unread") {
      return;
    }

    try {
      await markAsRead(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) => {
          if (currentNotification.id !== notification.id) {
            return currentNotification;
          }

          return {
            ...currentNotification,
            isRead: true,
            status: "read",
          };
        })
      );

      setSelected((currentSelected) => {
        if (!currentSelected) {
          return currentSelected;
        }

        if (currentSelected.id !== notification.id) {
          return currentSelected;
        }

        return {
          ...currentSelected,
          isRead: true,
          status: "read",
        };
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  /**
   * Marks all notifications as read.
   *
   * @returns {Promise<void>} Resolves after all notifications are updated.
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
          status: "read",
        }))
      );

      setSelected((currentSelected) => {
        if (!currentSelected) {
          return currentSelected;
        }

        return {
          ...currentSelected,
          isRead: true,
          status: "read",
        };
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  /**
   * Clears all notifications for the authenticated user.
   *
   * @returns {Promise<void>} Resolves after notifications are cleared.
   */
  const handleClearNotifications = async () => {
    try {
      await clearNotifications();

      setNotifications([]);
      setSelected(null);
      setActivity([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  return (
    <div className="notif-page">
      <div className="panel">
        <h1 className="notif-title">Notifications</h1>

        <div className="notif-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`notif-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="empty-state">Loading notifications…</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="empty-state">No notifications here.</p>
        ) : (
          <div>
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isSelected={selected?.id === notification.id}
                onSelect={handleNotificationSelect}
              />
            ))}
          </div>
        )}

        <div className="notif-footer">
          <button
            className="btn-outline"
            type="button"
            onClick={handleMarkAllAsRead}
          >
            ✉️ Mark All as Read
          </button>

          <button
            className="btn-outline"
            type="button"
            onClick={handleClearNotifications}
          >
            Clear Notifications
          </button>
        </div>

        <p className="notif-footer-note">
          All times are in local time
        </p>
      </div>

      <div>
        <NotificationDetails notification={selected} />

        <RecentActivity items={activity} />
      </div>
    </div>
  );
}

export default Notifications;