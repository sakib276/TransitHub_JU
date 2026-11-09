import { useState } from 'react';

/**
 * Shows the driver photo, name, and vehicle details for an accepted ride.
 * Every field comes from the database (users, vehicles, trips, routes, stops).
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.driver - Assigned driver/vehicle info from the backend.
 * @param {string} props.driver.driverName - Driver's full name (users.full_name).
 * @param {string} props.driver.driverPhone - Driver's phone (users.phone).
 * @param {string|null} props.driver.driverPhoto - Photo path (users.profile_photo), may be null.
 * @param {string} props.driver.vehicleType - 'Bus' or 'Shuttle' (vehicles.vehicle_type).
 * @param {string} props.driver.vehicleNumber - Vehicle number (vehicles.vehicle_number).
 * @param {number} props.driver.totalSeats - Seats in the vehicle (vehicles.total_seats).
 * @param {string} props.driver.routeName - Route name (routes.route_name).
 * @param {string} props.driver.pickupStop - Pickup stop name.
 * @param {string} props.driver.dropStop - Drop stop name.
 * @param {string} props.driver.departureTime - Trip departure, e.g. "2026-10-05 08:00:00".
 * @param {string} props.driver.tripStatus - 'Scheduled' or 'Running' (trips.trip_status).
 * @returns {JSX.Element} Assigned driver card.
 */
function AssignedDriverCard({ driver }) {
  // If the photo is missing or fails to load, show the driver's initials instead.
  const [photoFailed, setPhotoFailed] = useState(false);
  const initials = driver.driverName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="assigned-driver-card">
      {driver.driverPhoto && !photoFailed ? (
        <img
          className="driver-avatar"
          src={driver.driverPhoto}
          alt={`Photo of ${driver.driverName}`}
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <div className="driver-avatar driver-initials" aria-label={`Photo of ${driver.driverName}`}>
          {initials}
        </div>
      )}

      <div className="driver-info">
        <strong>{driver.driverName}</strong>
        <p>Phone: {driver.driverPhone}</p>
        <p>
          {driver.vehicleType} · {driver.totalSeats} seats
        </p>
        <p className="plate-number">{driver.vehicleNumber}</p>
        <p className="your-trip">
          Your trip: {driver.pickupStop} → {driver.dropStop}
        </p>
        <p>Bus route: {driver.routeName}</p>
        <p>Departure: {driver.departureTime}</p>
      </div>

      <span className="available">
        {driver.tripStatus === 'Running' ? 'On the way' : 'Scheduled'}
      </span>
    </div>
  );
}

export default AssignedDriverCard;
