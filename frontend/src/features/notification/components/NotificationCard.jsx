import '../notifications.css';

/**
 * Maps notification types to their corresponding display icons.
 *
 * @constant
 * @type {Object<string, string>}
 */
const ICONS = {
  driver_assigned: '🚗',
  queue_update: '👥',
  pickup_time: '🕐',
  system_maintenance: '📢',
  ride_completed: '✅',
};

/**
 * Displays an individual notification card.
 *
 * The card shows the notification icon, title, message, time,
 * read/unread status, and a button for viewing notification details.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.notification - Notification data to display.
 * @param {boolean} props.isSelected - Indicates whether the notification is selected.
 * @param {Function} props.onSelect - Callback invoked when the notification is selected.
 * @returns {JSX.Element} The notification card.
 * @author Nourin Dina
 */
export default function NotificationCard({
  notification,
  isSelected,
  onSelect,
}) {
  const icon = ICONS[notification.type] || '🔔';
  const isUnread = notification.status === 'unread';

  return (
    <div
      onClick={() => onSelect(notification)}
      className={`notif-card ${isSelected ? 'selected' : ''}`}
    >
      <span
        className={`notif-dot ${isUnread ? 'unread' : 'read'}`}
        aria-hidden="true"
      />

      <div className="notif-icon">{icon}</div>

      <div className="notif-body">
        <h3 className="notif-card-title">{notification.title}</h3>
        <p className="notif-card-message">{notification.message}</p>
      </div>

      <div className="notif-side">
        <span className="notif-time">{notification.time}</span>

        <span
          className={`notif-badge ${isUnread ? 'unread' : 'read'}`}
        >
          {isUnread ? 'Unread' : 'Read'}
        </span>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onSelect(notification);
          }}
          className="btn-outline"
        >
          View Details
        </button>
      </div>
    </div>
  );
}