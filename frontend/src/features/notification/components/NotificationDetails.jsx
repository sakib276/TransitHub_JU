import "../notifications.css";

/**
 * Maps notification types to their corresponding display icons.
 *
 * @constant
 * @type {Object<string, string>}
 */
const ICONS = {
  driver_assigned: "🚗",
  queue_update: "👥",
  pickup_time: "🕐",
  system_maintenance: "📢",
  ride_completed: "✅",
};

/**
 * Displays detailed information about a selected notification.
 *
 * If no notification is selected, an empty-state message is displayed.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object|null} props.notification - Notification data to display.
 * @returns {JSX.Element} The notification details panel.
 */
export default function NotificationDetails({ notification }) {
  if (!notification) {
    return (
      <div className="panel">
        <p className="empty-state">
          Select a notification to see its details.
        </p>
      </div>
    );
  }

  const icon = ICONS[notification.type] || "🔔";
  const {
    description,
    dateTime,
    relatedRideId,
    rideStatus,
  } = notification.details;

  return (
    <div className="panel">
      <h2 className="panel-title">Notification Details</h2>
      <hr className="panel-divider" />

      <div className="details-header">
        <div className="notif-icon lg">{icon}</div>

        <div>
          <h3 className="notif-card-title">{notification.title}</h3>
          <p className="details-desc">{description}</p>
        </div>
      </div>

      <dl className="details-list">
        <div className="details-row">
          <span>📅</span>
          <dt className="details-label">Date &amp; Time</dt>
          <span>:</span>
          <dd className="details-value">{dateTime}</dd>
        </div>

        <div className="details-row">
          <span>🏷️</span>
          <dt className="details-label">Related Ride ID</dt>
          <span>:</span>
          <dd className="details-value">{relatedRideId}</dd>
        </div>

        <div className="details-row">
          <span>🚚</span>
          <dt className="details-label">Ride Status</dt>
          <span>:</span>
          <dd className="details-value">{rideStatus}</dd>
        </div>
      </dl>
    </div>
  );
}