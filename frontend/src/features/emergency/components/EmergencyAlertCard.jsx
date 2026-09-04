/**
 * Shows one emergency alert for the administrator, with contact, location,
 * trip details, and a way to coordinate a response (FR-12.3).
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.alert - Emergency alert.
 * @param {number} props.alert.id - Alert id.
 * @param {'passenger'|'driver'} props.alert.role - Who reported the alert.
 * @param {string} props.alert.reporterName - Reporter's name.
 * @param {string} props.alert.contact - Reporter's contact number.
 * @param {string} props.alert.tripId - Active trip identifier.
 * @param {string|null} props.alert.vehiclePlate - Vehicle plate, if reported by a driver.
 * @param {string} props.alert.details - Optional extra details.
 * @param {string} props.alert.location - Reporter's last known location.
 * @param {string} props.alert.status - Alert status ('New' | 'Coordinating' | 'Resolved').
 * @param {string} props.alert.reportedAt - ISO timestamp the alert was reported.
 * @param {Function} props.onCoordinate - Called with the alert id and next status.
 * @returns {JSX.Element} Emergency alert card.
 */
function EmergencyAlertCard({ alert, onCoordinate }) {
  const isDetailsUnavailable = !alert.reporterName || !alert.contact || !alert.location;

  return (
    <div className="emergency-alert-card">
      <div className="alert-header">
        <span className={`alert-role-badge ${alert.role}`}>
          {alert.role === 'driver' ? 'Driver' : 'Passenger'}
        </span>
        <span className={`alert-status-badge ${alert.status.toLowerCase()}`}>
          {alert.status}
        </span>
      </div>

      {isDetailsUnavailable ? (
        <div className="empty-status error">
          <p>Some alert details are unavailable.</p>
        </div>
      ) : (
        <div className="alert-body">
          <p>
            <strong>{alert.reporterName}</strong> · {alert.contact}
          </p>
          <p>Trip: {alert.tripId}</p>
          {alert.vehiclePlate && <p>Vehicle: {alert.vehiclePlate}</p>}
          <p>Location: {alert.location}</p>
          {alert.details && <p className="alert-details">{alert.details}</p>}
          <p className="alert-timestamp">
            Reported at {new Date(alert.reportedAt).toLocaleTimeString()}
          </p>
        </div>
      )}

      <div className="alert-actions">
        <button
          type="button"
          className="outline-btn"
          disabled={alert.status !== 'New'}
          onClick={() => onCoordinate(alert.id, 'Coordinating')}
        >
          Coordinate Response
        </button>
        <button
          type="button"
          className="outline-btn"
          disabled={alert.status === 'Resolved'}
          onClick={() => onCoordinate(alert.id, 'Resolved')}
        >
          Mark Resolved
        </button>
      </div>
    </div>
  );
}

export default EmergencyAlertCard;
