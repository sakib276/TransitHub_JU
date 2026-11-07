/**
 * Displays the driver's current vehicle status information.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.updatedAt - Last status update time.
 * @returns {JSX.Element} Vehicle status card.
 */
function VehicleStatusCard({ updatedAt }) {
  return (
    <div className="vehicle-status-card-header">
      <h2>Current status</h2>

      <span className="updated-time">
        ◷ Updated {updatedAt}
      </span>
    </div>
  );
}

export default VehicleStatusCard;