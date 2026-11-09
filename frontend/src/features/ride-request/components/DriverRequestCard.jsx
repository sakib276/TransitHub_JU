export default function DriverRequestCard({
  request,
  onAccept,
  onReject,
}) {
  return (
    <div className="driver-card">
      <div className="card-top">
        <div className="passenger">
          <div className="avatar">
            {request.passenger.charAt(0)}
          </div>

          <div>
            <h3>{request.passenger}</h3>
            <p>Passenger Request</p>
          </div>
        </div>

        <div className="time-badge">{request.time}</div>
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
          <strong>Pending</strong>
        </div>
      </div>

      <div className="action-row">
        <button className="accept-btn" onClick={onAccept}>
          Accept
        </button>

        <button className="reject-btn" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
}