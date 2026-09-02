/**
 * Displays one trip history record.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.trip - Trip history record.
 * @param {Function} props.onSelect - Selects the trip.
 * @returns {JSX.Element} Trip history card.
 */
function TripHistoryCard({ trip, onSelect }) {
  return (
    <article className="trip-history-card">
      <div className="trip-route">
        <div className="trip-route-item">
          <span className="route-icon">●</span>
          <span>
            {trip.pickup || "Main Gate"}
          </span>
        </div>

        <div className="trip-route-item">
          <span className="route-icon">●</span>
          <span>
            {trip.destination || "Central Library"}
          </span>
        </div>
      </div>

      <div className="trip-info trip-divider">
        <div className="trip-info-item">
          📅
          <span>
            {trip.completedAt
              ? new Date(
                  trip.completedAt
                ).toLocaleDateString()
              : "25 Jul 2026"}
          </span>
        </div>

        <div className="trip-info-item">
          ◷
          <span>09:30 AM</span>
        </div>
      </div>

      <div className="trip-info trip-divider">
        <div className="trip-info-item">
          ♙
          <span>
            {trip.driverName || "Driver Name"}
          </span>
        </div>

        <div className="trip-info-item">
          🚗
          <span>
            {trip.vehicleNumber || "Vehicle (A 1234)"}
          </span>
        </div>
      </div>

      <div className="trip-actions trip-divider">
        <span className="status-badge">
          {trip.status || "Completed"}
        </span>

        <button
          type="button"
          className="details-button"
          onClick={onSelect}
        >
          View Details
        </button>
      </div>
    </article>
  );
}

export default TripHistoryCard;