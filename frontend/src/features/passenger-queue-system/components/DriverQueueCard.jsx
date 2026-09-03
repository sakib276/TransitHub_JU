
/**
 * Driver Queue Card module.
 * @module DriverQueueCard
 */

/**
 * Displays an individual passenger waiting in the driver queue.
 *
 * Shows the passenger's queue information and provides actions
 * for assigning the passenger or marking the passenger as a no-show.
 *
 * @memberof module:DriverQueueCard
 * @param {Object} props Component properties.
 * @param {Object} props.passenger Passenger queue information.
 * @param {number} props.passenger.id Queue entry identifier.
 * @param {string} props.passenger.name Passenger name.
 * @param {string} props.passenger.token Queue token.
 * @param {string} props.passenger.destination Destination point.
 * @param {number} props.passenger.seats Number of requested seats.
 * @param {string} props.passenger.gender Gender preference.
 * @param {boolean} props.passenger.priority Priority status.
 * @param {Function} props.onAssign Callback executed when assigning the passenger.
 * @param {Function} props.onNoShow Callback executed when marking the passenger as a no-show.
 * @param {boolean} props.disabled Disables assignment when available seats are insufficient.
 * @returns {JSX.Element} Driver queue card.
 */
export default function DriverQueueCard({
  passenger,
  onAssign,
  onNoShow,
  disabled = false,
}) {
  const passengerName = passenger.name || "Unknown passenger";
  const initial = passengerName.charAt(0).toUpperCase();

  return (
    <article className="driver-queue-card">
      <div className="queue-passenger">
        <div className="queue-avatar">{initial}</div>

        <div>
          <h3>{passengerName}</h3>

          <p>
            {passenger.priority
              ? "Verified priority"
              : "Standard queue"}
          </p>
        </div>
      </div>

      <div className="queue-token-box">
        <span>Token</span>
        <strong>{passenger.token}</strong>
      </div>

      <div className="queue-token-box">
        <span>Destination</span>
        <strong>{passenger.destination || "Unknown"}</strong>
      </div>

      <div className="queue-token-box">
        <span>Seats needed</span>
        <strong>{passenger.seats}</strong>
      </div>

      <div className="queue-token-box">
        <span>Gender preference</span>
        <strong>{passenger.gender || "Any"}</strong>
      </div>

      <div className="queue-token-box">
        <span>Priority</span>
        <strong>
          {passenger.priority ? "Verified" : "Standard"}
        </strong>
      </div>

      <div className="queue-card-actions">
        <button
          type="button"
          className="queue-assign-btn"
          onClick={onAssign}
          disabled={disabled}
        >
          {disabled ? "Not enough seats" : "Assign passenger"}
        </button>

        <button
          type="button"
          className="queue-no-show-btn"
          onClick={onNoShow}
        >
          No-show
        </button>
      </div>
    </article>
  );
}

