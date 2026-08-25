import { useEffect, useState } from 'react';
import NotificationCard from '../components/NotificationCard';
import {
  getNotifications,
  markAllNotificationsAsRead,
} from '../notificationApi';
import './Notifications.css';

/**
 * Displays the user's notification page.
 *
 * Shows a list of notifications with filtering (all/unread), lets the
 * user select a notification to view its details, and supports marking
 * all notifications as read.
 *
 * @returns {JSX.Element} Notifications page.
 */
function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Loads notifications when the page opens.
   */
  useEffect(() => {
    async function loadNotifications() {
      try {
        setIsLoading(true);
        setError('');

        const data = await getNotifications();

        setNotifications(data);
      } catch (loadError) {
        setError('Failed to load notifications.');
        console.error('Error loading notifications:', loadError);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotifications();
  }, []);

  /**
   * Marks every notification as read.
   */
  async function handleMarkAllAsRead() {
    try {
      const updatedNotifications = await markAllNotificationsAsRead(
        notifications,
      );

      setNotifications(updatedNotifications);

      if (selectedNotification) {
        const updatedSelectedNotification = updatedNotifications.find(
          (notification) =>
            notification.notificationId ===
            selectedNotification.notificationId,
        );

        setSelectedNotification(updatedSelectedNotification ?? null);
      }
    } catch (markError) {
      console.error('Error marking notifications as read:', markError);
      setError('Failed to mark notifications as read.');
    }
  }

  /**
   * Selects a notification and marks it as read in the UI.
   *
   * @param {Object} notification - Selected notification.
   */
  function handleSelectNotification(notification) {
    const updatedNotification = {
      ...notification,
      isRead: true,
    };

    setSelectedNotification(updatedNotification);

    setNotifications((currentNotifications) =>
      currentNotifications.map((currentNotification) =>
        currentNotification.notificationId === notification.notificationId
          ? updatedNotification
          : currentNotification,
      ),
    );
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'unread') {
      return !notification.isRead;
    }

    return true;
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (isLoading) {
    return (
      <main className="notifications-page">
        <h1>Notifications</h1>
        <div className="notification-state">Loading notifications...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="notifications-page">
        <h1>Notifications</h1>
        <div className="notification-state error-state">{error}</div>
      </main>
    );
  }

  return (
    <main className="notifications-page">
      <section className="notifications-section">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your ride and queue activities.</p>
          </div>

          <button
            type="button"
            className="mark-all-button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </button>
        </div>

        <div className="notification-filters">
          <button
            type="button"
            className={
              activeFilter === 'all'
                ? 'filter-button active'
                : 'filter-button'
            }
            onClick={() => setActiveFilter('all')}
          >
            All ({notifications.length})
          </button>

          <button
            type="button"
            className={
              activeFilter === 'unread'
                ? 'filter-button active'
                : 'filter-button'
            }
            onClick={() => setActiveFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="notification-state">No notifications found.</div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.notificationId}
                notification={notification}
                onSelect={handleSelectNotification}
              />
            ))}
          </div>
        )}
      </section>

      <aside className="notification-details">
        <h2>Notification Details</h2>

        {selectedNotification ? (
          <div className="details-content">
            <div className="details-icon">🔔</div>
            <h3>{selectedNotification.title}</h3>
            <p>{selectedNotification.message}</p>

            <div className="details-row">
              <span>Date & Time</span>
              <strong>
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </strong>
            </div>

            <div className="details-row">
              <span>Status</span>
              <strong>
                {selectedNotification.isRead ? 'Read' : 'Unread'}
              </strong>
            </div>
          </div>
        ) : (
          <div className="details-empty">
            <p>Select a notification to view its details.</p>
          </div>
        )}
      </aside>
    </main>
  );
}

export default Notifications;