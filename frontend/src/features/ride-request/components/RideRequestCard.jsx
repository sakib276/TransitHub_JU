export default function RideRequestCard({ rideData }) {
  return (
    <div className="card">
      <h2>Route Preview</h2>

      <div className="route-box">
        <div className="route-point">
          <span className="dot start"></span>
          <div>
            <p>Pickup</p>
            <strong>{rideData.pickup || "Not selected"}</strong>
          </div>
        </div>

        <div className="route-line"></div>

        <div className="route-point">
          <span className="dot end"></span>
          <div>
            <p>Destination</p>
            <strong>{rideData.destination || "Not selected"}</strong>
          </div>
        </div>
      </div>

      <div className="summary">
        <h3>Ride Summary</h3>

        <div className="summary-row">
          <span>Date</span>
          <strong>{rideData.date}</strong>
        </div>

        <div className="summary-row">
          <span>Time</span>
          <strong>{rideData.time}</strong>
        </div>

        <div className="summary-row">
          <span>Seats</span>
          <strong>{rideData.seats}</strong>
        </div>

        <div className="summary-row">
          <span>Ride Type</span>
          <strong>{rideData.rideType}</strong>
        </div>

        <div className="summary-row total">
          <span>Total Fare</span>
          <strong>৳ {rideData.fare}</strong>
        </div>
      </div>
    </div>
  );
}