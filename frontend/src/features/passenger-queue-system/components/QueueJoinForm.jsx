/**
 * Queue Join Form module.
 * @module QueueJoinForm
 */

import { locations } from "../services/queueService";

/**
 * Displays the passenger queue registration form.
 *
 * Allows passengers to select pickup and destination points,
 * specify seat requirements, choose a gender preference,
 * and request priority consideration before joining the queue.
 *
 * @memberof module:QueueJoinForm
 * @param {Object} props Component properties.
 * @param {string} props.pickup Selected pickup location.
 * @param {Function} props.setPickup Updates the pickup location.
 * @param {string} props.destination Selected destination.
 * @param {Function} props.setDestination Updates the destination.
 * @param {number} props.seats Number of requested seats.
 * @param {Function} props.setSeats Updates the seat count.
 * @param {string} props.gender Selected gender preference.
 * @param {Function} props.setGender Updates the gender preference.
 * @param {boolean} props.priority Whether priority is requested.
 * @param {Function} props.setPriority Updates the priority selection.
 * @param {Function} props.onJoin Callback for joining the queue.
 * @param {boolean} props.disabled Disables the form when already queued.
 * @returns {JSX.Element} Queue join form.
 */
export default function QueueJoinForm({
  pickup,
  setPickup,
  destination,
  setDestination,
  seats,
  setSeats,
  gender,
  setGender,
  priority,
  setPriority,
  onJoin,
  disabled,
}) {
  return (
    <section className="queue-card">
      <h2>Join the waiting queue</h2>
      <p className="card-copy">
        No vehicles are available right now. Join to receive a fair place in
        line.
      </p>

      <div className="queue-form-group">
        <label htmlFor="queue-pickup">Pickup point</label>
        <select
          id="queue-pickup"
          value={pickup}
          onChange={(event) => setPickup(event.target.value)}
          disabled={disabled}
        >
          <option value="">Choose your pickup point</option>
          {locations.map((location) => (
            <option key={location.id} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="queue-form-group">
        <label htmlFor="queue-destination">Destination point</label>
        <select
          id="queue-destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          disabled={disabled}
        >
          <option value="">Choose your destination point</option>
          {locations.map((location) => (
            <option key={location.id} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="queue-form-row">
        <div className="queue-form-group">
          <label htmlFor="queue-seats">Seats needed</label>
          <input
            id="queue-seats"
            type="number"
            min="1"
            max="4"
            value={seats}
            onChange={(event) => setSeats(Number(event.target.value))}
            disabled={disabled}
          />
        </div>

        <div className="queue-form-group">
          <label htmlFor="queue-gender">Gender preference</label>
          <select
            id="queue-gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            disabled={disabled}
          >
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <label className="queue-priority-option">
        <input
          type="checkbox"
          checked={priority}
          onChange={(event) => setPriority(event.target.checked)}
          disabled={disabled}
        />
        Request priority consideration
      </label>

      <button
        className="queue-primary-btn"
        onClick={onJoin}
        disabled={disabled}
      >
        {disabled ? "Already in queue" : "Join queue"}
      </button>
    </section>
  );
}