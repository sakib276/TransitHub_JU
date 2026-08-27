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
        className="driver-photo"
        src={driver.driverPhoto}
        alt={`Photo of ${driver.driverName}`}
      />

      <div className="driver-details">
        <h2>{driver.driverName}</h2>
        <p className="vehicle-line">
          {driver.vehicleColor} {driver.vehicleType}
        </p>
        <p className="plate-number">{driver.plateNumber}</p>
      </div>
    </div>
  );
}

export default AssignedDriverCard;
