import PropTypes from 'prop-types';

/**
 * Displays a single notification card.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.notification - Notification data.
 * @param {number} props.notification.notificationId - Notification ID.
 * @param {string} props.notification.title - Notification title.
 * @param {string} props.notification.message - Notification message.
 * @param {boolean} props.notification.isRead - Read status.
 * @param {string} props.notification.createdAt - Creation date and time.
 * @param {Function} props.onSelect - Handles notification selection.
 * @returns {JSX.Element} Notification card component.
 */
function NotificationCard({ notification, onSelect }) {
  const formattedDate = new Date(notification.createdAt).toLocaleString();

  return (
    <article
      className={`notification-card ${
        notification.isRead ? 'read' : 'unread'
      }`}
    >
      <div className="notification-card-header">
        <div className="notification-title-section">
          {!notification.isRead && (
            <span className="notification-dot" title="Unread notification" />
          )}

          <span className="notification-icon">🔔</span>

          <h3>{notification.title}</h3>
        </div>

        <time className="notification-time">{formattedDate}</time>
      </div>

      <p className="notification-message">{notification.message}</p>

      <div className="notification-card-footer">
        <span
          className={`notification-status ${
            notification.isRead ? 'status-read' : 'status-unread'
          }`}
        >
          {notification.isRead ? 'Read' : 'Unread'}
        </span>

        <button
          type="button"
          className="details-button"
          onClick={() => onSelect(notification)}
        >
          View Details
        </button>
      </div>
    </article>
  );
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    notificationId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default NotificationCard;