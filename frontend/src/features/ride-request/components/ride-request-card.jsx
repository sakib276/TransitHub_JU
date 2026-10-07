/**
 * Displays a preview or saved summary of a passenger queue entry.
 *
 * @param {object} props - Card props.
 * @param {object} props.rideData - Selected ride request details.
 * @returns {JSX.Element} The route preview card.
 */
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
        <h3>Queue Request</h3>
        <div className="summary-row">
          <span>Seats</span>
          <strong>{rideData.seatsNeeded}</strong>
        </div>
        <div className="summary-row">
          <span>Gender Preference</span>
          <strong>{rideData.genderPreference || "Any"}</strong>
        </div>
        {rideData.token && (
          <div className="summary-row">
            <span>Queue Token</span>
            <strong>{rideData.token}</strong>
          </div>
        )}
        {rideData.position && (
          <div className="summary-row">
            <span>Queue Position</span>
            <strong>{rideData.position}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
