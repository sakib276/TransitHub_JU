import "../notifications.css";

/**
 * Maps activity types to their corresponding display icons.
 *
 * @constant
 * @type {Object<string, string>}
 */
const ICONS = {
  user: "👤",
  car: "🚗",
  users: "👥",
  clock: "🕐",
};

/**
 * Displays a list of recent user activities.
 *
 * Each activity includes an icon, title, time, and one or more
 * detail lines.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - List of recent activity items.
 * @returns {JSX.Element} The recent activity panel.
 */
export default function RecentActivity({ items }) {
  return (
    <div className="panel">
      <h2 className="panel-title">Recent Activity</h2>
      <hr className="panel-divider" />

      <div>
        {items.map((item) => (
          <div key={item.id} className="activity-item">
            <div className="notif-icon">
              {ICONS[item.icon] || "👤"}
            </div>

            <div className="notif-body">
              <div className="activity-header">
                <h4 className="activity-title">{item.title}</h4>
                <span className="activity-time">{item.time}</span>
              </div>

              {item.detail.split("\n").map((line, i) => (
                <p key={i} className="activity-detail">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}