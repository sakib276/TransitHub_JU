/**
 * Driver Queue Card module.
 * @module DriverQueueCard
 */

/**
 * Displays an individual passenger waiting in the driver queue.
 *
 * Shows the passenger's queue information and provides actions
 * for assigning a seat or marking the passenger as a no-show.
 *
 * @memberof module:DriverQueueCard
 * @param {Object} props Component properties.
 * @param {Object} props.passenger Passenger queue information.
 * @param {number} props.passenger.id Unique passenger identifier.
 * @param {string} props.passenger.name Passenger name.
 * @param {string} props.passenger.token Queue token number.
 * @param {string} props.passenger.destination Destination point.
 * @param {number} props.passenger.seats Number of requested seats.
 * @param {string} props.passenger.gender Gender preference.
 * @param {boolean} props.passenger.priority Priority status.
 * @param {Function} props.onAssign Callback for assigning a seat.
 * @param {Function} props.onNoShow Callback for marking a no-show.
 * @param {boolean} props.disabled Disables seat assignment when capacity is insufficient.
 * @returns {JSX.Element} Driver queue card.
 */
export default function DriverQueueCard({
  passenger,
  onAssign,
  onNoShow,
  disabled,
}) {
  return (
    <article className="driver-queue-card">
      <div className="queue-passenger">
        <div className="queue-avatar">{passenger.name.charAt(0)}</div>

        <div>
          <h3>{passenger.name}</h3>
          <p>
            {passenger.priority ? "Verified priority" : "Standard queue"}
          </p>
        </div>
      </div>

      <div className="queue-token-box">
        <span>Token</span>
        <strong>{passenger.token}</strong>
      </div>

      <div className="queue-token-box">
        <span>Destination</span>
        <strong>{passenger.destination}</strong>
      </div>

      <div className="queue-token-box">
        <span>Seats needed</span>
        <strong>{passenger.seats}</strong>
      </div>

      <div className="queue-token-box">
        <span>Gender preference</span>
        <strong>{passenger.gender}</strong>
      </div>

      <div className="queue-token-box">
        <span>Priority</span>
        <strong>{passenger.priority ? "Verified" : "Standard"}</strong>
      </div>

      <div className="queue-card-actions">
        <button
          className="queue-assign-btn"
          onClick={onAssign}
          disabled={disabled}
        >
          Assign seat
        </button>

        <button
          className="queue-no-show-btn"
          onClick={onNoShow}
        >
          No-show
        </button>
      </div>
    </article>
  );
}