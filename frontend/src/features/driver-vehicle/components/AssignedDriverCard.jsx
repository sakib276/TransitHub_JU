/**
 * Shows the driver photo, name, and vehicle details for an accepted ride.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.driver - Assigned driver/vehicle info.
 * @param {string} props.driver.driverName - Driver's full name.
 * @param {string} props.driver.driverPhoto - Driver's photo URL.
 * @param {string} props.driver.vehicleType - Vehicle type (Rickshaw or Cart).
 * @param {string} props.driver.vehicleColor - Vehicle color.
 * @param {string} props.driver.plateNumber - Vehicle plate/number.
 * @returns {JSX.Element} Assigned driver card.
 */
function AssignedDriverCard({ driver }) {
  return (
    <div className="assigned-driver-card">
      <img
        className="driver-avatar"
        src={driver.driverPhoto}
        alt={`Photo of ${driver.driverName}`}
      />

      <div className="driver-info">
        <strong>{driver.driverName}</strong>
        <p>
          {driver.vehicleColor} {driver.vehicleType}
        </p>
        <p className="plate-number">{driver.plateNumber}</p>
      </div>

      <span className="available">On the way</span>
    </div>
  );
}

export default AssignedDriverCard;
