const drivers = [
  {
    id: 1,
    name: "Arif Rahman",
    initials: "AR",
    vehicle: "Cart",
    seats: 8,
    status: "Available",
  },
  {
    id: 2,
    name: "Shanto Nafi",
    initials: "SN",
    vehicle: "Auto Rickshaw",
    seats: 3,
    status: "Available",
  },
  {
    id: 3,
    name: "Rahim Uddin",
    initials: "RU",
    vehicle: "Manual Rickshaw",
    seats: 2,
    status: "Available",
  },
];

export default function RequestStatus({ submittedRequest }) {
  if (!submittedRequest) {
    return (
      <div className="card">
        <div className="status-header">
          <h2>Request Status</h2>

          <span className="status-badge">
            Not Submitted
          </span>
        </div>

        <div className="empty-status">
          <p>
            Your ride request will appear here after you
            submit it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">

      {/* Header */}
      <div className="status-header">
        <h2>Matching Drivers</h2>

        <span className="status-badge">
          Searching
        </span>
      </div>


      {/* Submitted Request */}
      <div className="submitted-request">

        <h3>Your Ride Request</h3>

        <div className="request-detail">
          <span>From</span>
          <strong>
            {submittedRequest.pickup}
          </strong>
        </div>

        <div className="request-detail">
          <span>To</span>
          <strong>
            {submittedRequest.destination}
          </strong>
        </div>

        <div className="request-detail">
          <span>Date</span>
          <strong>
            {submittedRequest.date}
          </strong>
        </div>

        <div className="request-detail">
          <span>Time</span>
          <strong>
            {submittedRequest.time}
          </strong>
        </div>

        <div className="request-detail">
          <span>Seats</span>
          <strong>
            {submittedRequest.seats}
          </strong>
        </div>

        <div className="request-detail">
          <span>Ride Type</span>
          <strong>
            {submittedRequest.rideType === "shared"
              ? "Shared"
              : "Private"}
          </strong>
        </div>

        <div className="request-detail">
          <span>Estimated Fare</span>
          <strong>
            ৳ {submittedRequest.fare}
          </strong>
        </div>

        <div className="request-detail">
          <span>Travel Time</span>
          <strong>
            {submittedRequest.travelTime} min
          </strong>
        </div>

      </div>


      {/* Matching Drivers */}
      <div className="drivers-section">

        <h3>Available Drivers</h3>

        {drivers.map((driver) => (
          <div
            className="driver-item"
            key={driver.id}
          >

            <div className="avatar">
              {driver.initials}
            </div>

            <div className="driver-info">

              <strong>
                {driver.name}
              </strong>

              <p>
                {driver.vehicle} • {driver.seats} seats
              </p>

            </div>

            <span className="available">
              {driver.status}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}