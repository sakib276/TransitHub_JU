
/**
 * Queue Join Form module.
 * @module QueueJoinForm
 */

import { locations } from "../services/queueService";

/**
 * Displays the passenger queue joining form.
 *
 * @param {Object} props Component properties.
 * @param {string} props.pickup Pickup location ID.
 * @param {Function} props.setPickup Updates pickup location.
 * @param {string} props.destination Destination location ID.
 * @param {Function} props.setDestination Updates destination location.
 * @param {number} props.seats Number of seats required.
 * @param {Function} props.setSeats Updates seat count.
 * @param {string} props.gender Gender preference.
 * @param {Function} props.setGender Updates gender preference.
 * @param {boolean} props.priority Priority request flag.
 * @param {Function} props.setPriority Updates priority flag.
 * @param {Function} props.onJoin Queue submission callback.
 * @param {boolean} props.disabled Disables the form.
 * @returns {JSX.Element} Queue joining form.
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
        No vehicles are available right now. Join to receive a fair place
        in line.
      </p>

      <div className="queue-form-group">
        <label htmlFor="queue-pickup">Pickup point</label>

        <select
          id="queue-pickup"
          value={pickup}
          onChange={(event) => setPickup(event.target.value)}
          disabled={disabled}
          required
        >
          <option value="">Choose your pickup point</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
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
          required
        >
          <option value="">Choose your destination point</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
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
            required
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
        type="button"
        className="queue-primary-btn"
        onClick={onJoin}
        disabled={disabled}
      >
        {disabled ? "Already in queue" : "Join queue"}
      </button>
    </section>
  );
}

