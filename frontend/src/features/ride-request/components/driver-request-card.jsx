/**
 * Shows a single passenger request to a driver.
 *
 * @param {object} props - Driver request props.
 * @param {object} props.request - Passenger ride request.
 * @param {Function} props.onAccept - Handles accepting the request.
 * @param {Function} props.onReject - Handles rejecting the request.
 * @returns {JSX.Element} The driver request card.
 */
export default function DriverRequestCard({
  request,
  onAccept,
  onReject,
  disabled = false,
}) {
  return (
    <div className="driver-card">
      <div className="card-top">
        <div className="passenger">
          <div className="avatar">
            {request.passenger?.charAt(0) || "P"}
          </div>

          <div>
            <h3>{request.passenger}</h3>
            <p>Queue token: {request.token || "—"}</p>
          </div>
        </div>

        <div className="time-badge">
          {request.joinedAt
            ? new Date(request.joinedAt).toLocaleTimeString()
            : "Waiting"}
        </div>
      </div>

      <div className="route-box">
        <div className="route-point">
          <div className="dot start"></div>
          <div>
            <p>Pickup</p>
            <strong>{request.pickup}</strong>
          </div>
        </div>

        <div className="route-line"></div>

        <div className="route-point">
          <div className="dot end"></div>
          <div>
            <p>Destination</p>
            <strong>{request.destination}</strong>
          </div>
        </div>
      </div>

      <div className="request-info">
        <div className="info-box">
          <span>Seats Needed</span>
          <strong>{request.seats}</strong>
        </div>

        <div className="info-box">
          <span>Status</span>
          <strong>{request.status || "Waiting"}</strong>
        </div>
      </div>

      <div className="action-row">
        <button className="accept-btn" onClick={onAccept} disabled={disabled}>
          Accept
        </button>

        <button className="reject-btn" onClick={onReject} disabled={disabled}>
          Reject
        </button>
      </div>
    </div>
  );
}