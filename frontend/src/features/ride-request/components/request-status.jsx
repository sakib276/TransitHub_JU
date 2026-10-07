/**
 * Displays a saved queue entry and matching available drivers.
 *
 * @param {object} props - Status props.
 * @param {object|null} props.submittedRequest - Saved queue entry or null.
 * @param {Array<object>} [props.drivers=[]] - Available drivers from the API.
 * @param {boolean} [props.isLoadingDrivers=false] - Whether drivers are loading.
 * @returns {JSX.Element} Queue status and available driver card.
 */
export default function RequestStatus({
  submittedRequest,
  drivers = [],
  isLoadingDrivers = false,
}) {
  if (!submittedRequest) {
    return (
      <div className="card">
        <div className="status-header">
          <h2>Request Status</h2>
          <span className="status-badge">Not Submitted</span>
        </div>
        <div className="empty-status">
          <p>Your ride request will appear here after you join the queue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="status-header">
        <h2>Queue Status</h2>
        <span className="status-badge">{submittedRequest.status}</span>
      </div>

      <div className="submitted-request">
        <h3>Your Ride Request</h3>
        <div className="request-detail">
          <span>From</span>
          <strong>{submittedRequest.pickup}</strong>
        </div>
        <div className="request-detail">
          <span>To</span>
          <strong>{submittedRequest.destination}</strong>
        </div>
        <div className="request-detail">
          <span>Seats</span>
          <strong>{submittedRequest.seats}</strong>
        </div>
        <div className="request-detail">
          <span>Queue Position</span>
          <strong>{submittedRequest.position}</strong>
        </div>
        <div className="request-detail">
          <span>Token</span>
          <strong>{submittedRequest.token}</strong>
        </div>
      </div>

      {submittedRequest.status === "Waiting" && (
        <div className="drivers-section">
          <h3>Available Drivers</h3>
          {isLoadingDrivers ? (
            <p>Checking driver availability...</p>
          ) : drivers.length === 0 ? (
            <p>No available drivers have enough seats right now.</p>
          ) : (
            drivers.map((driver) => (
              <div className="driver-item" key={driver.driverId}>
                <div className="avatar">
                  {driver.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="driver-info">
                  <strong>{driver.name}</strong>
                  <p>
                    {driver.vehicle} · {driver.availableSeats} seats available
                  </p>
                </div>
                <span className="available">Available</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
