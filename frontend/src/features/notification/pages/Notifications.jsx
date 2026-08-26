import { useEffect, useMemo, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import NotificationDetails from "../components/NotificationDetails";
import RecentActivity from "../components/RecentActivity";
import "../notifications.css";
import {
  getNotifications,
  getRecentActivity,
  markAllAsRead,
  clearNotifications,
} from "../notificationApi";

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
 * Displays the notifications page.
 *
 * The component provides notification filtering, notification selection,
 * mark-all-as-read functionality, notification clearing, and recent activity.
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

  /**
   * Loads notifications and recent activity when the component is mounted.
   *
   * @returns {Promise<void>} Resolves after the notification data is loaded.
   */
  useEffect(() => {
    (async () => {
      const [notifs, acts] = await Promise.all([
        getNotifications(),
        getRecentActivity(),
      ]);

      setNotifications(notifs);
      setActivity(acts);
      setSelected(notifs[0] || null);
      setLoading(false);
    })();
  }, []);

  /**
   * Filters notifications based on the currently active tab.
   *
   * @returns {Array} The filtered notification list.
   */
  const filtered = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }

    if (activeTab === "unread") {
      return notifications.filter((n) => n.status === "unread");
    }

    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  /**
   * Selects a notification and marks it as read when necessary.
   *
   * @param {Object} notification - The notification selected by the user.
   * @returns {void}
   */
  const handleSelect = (notification) => {
    setSelected(notification);

    if (notification.status === "unread") {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, status: "read" } : n
        )
      );
    }
  };

  /**
   * Marks all notifications as read.
   *
   * @async
   * @returns {Promise<void>} Resolves after all notifications are marked as read.
   */
  const handleMarkAllRead = async () => {
    await markAllAsRead();

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: "read" }))
    );
  };

  /**
   * Clears all notifications from the notification list.
   *
   * @async
   * @returns {Promise<void>} Resolves after all notifications are cleared.
   */
  const handleClear = async () => {
    await clearNotifications();

    setNotifications([]);
    setSelected(null);
  };

  return (
    <div className="notif-page">
      {/* Left: notification list */}
      <div className="panel">
        <h1 className="notif-title">Notifications</h1>

        <div className="notif-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`notif-tab ${
                activeTab === tab.key ? "active" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="empty-state">Loading notifications…</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No notifications here.</p>
        ) : (
          <div>
            {filtered.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                isSelected={selected?.id === n.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        <div className="notif-footer">
          <button onClick={handleMarkAllRead} className="btn-outline">
            ✉️ Mark All as Read
          </button>

          <button onClick={handleClear} className="btn-outline">
            🗑️ Clear Notifications
          </button>
        </div>

        <p className="notif-footer-note">All times are in local time</p>
      </div>

      {/* Right: notification details and recent activity */}
      <div>
        <NotificationDetails notification={selected} />
        <RecentActivity items={activity} />
      </div>
    </div>
  );
}