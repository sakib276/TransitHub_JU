/**
 * Displays a single trip history record.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.trip - Trip history information.
 * @returns {JSX.Element} Trip history card.
 */
function TripHistoryCard({ trip }) {
  return (
    <article className="trip-history-card">
      <h2>Trip #{trip.tripId}</h2>

      <p>
        <strong>Pickup:</strong> {trip.pickup}
      </p>

      <p>
        <strong>Destination:</strong> {trip.destination}
      </p>

      <p>
        <strong>Driver:</strong> {trip.driverName}
      </p>

      <p>
        <strong>Fare:</strong> ৳{trip.farePaid}
      </p>

      <p>
        <strong>Ride Type:</strong> {trip.rideType}
      </p>

      <p>
        <strong>Status:</strong> {trip.status}
      </p>

      <p>
        <strong>Completed:</strong> {trip.completedAt}
      </p>
    </article>
  );
}

export default TripHistoryCard;