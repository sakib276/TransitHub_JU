/**
 * Queue Status Card module.
 * @module QueueStatusCard
 */

import { locations } from "../services/queueService";

/**
 * Displays the current passenger queue status.
 *
 * Shows the queue token, current position, journey details,
 * priority status, and the time the passenger joined the queue.
 *
 * @memberof module:QueueStatusCard
 * @param {Object} props Component properties.
 * @param {Object|null} props.entry Current passenger queue entry.
 * @param {string|null} props.priorityStatus Current priority request status.
 * @returns {JSX.Element} Queue status card.
 */
export default function QueueStatusCard({ entry, priorityStatus }) {
  if (!entry) {
    return (
      <section className="queue-card queue-empty-state">
        Choose a pickup point to see your queue status here.
      </section>
    );
  }

  const pickupName =
    locations.find((location) => location.id === Number(entry.pickup_location_id))
      ?.name || "Unknown";

  const destinationName =
    locations.find(
      (location) => location.id === Number(entry.destination_location_id)
    )?.name || "Unknown";

  return (
    <section className="queue-card queue-status-card">
      <div className="queue-card-heading">
        <div>
          <p className="eyebrow">YOUR QUEUE TOKEN</p>
          <h2>{entry.token}</h2>
        </div>

        <span
          className={`queue-status-pill ${
            priorityStatus ? priorityStatus.toLowerCase() : "waiting"
          }`}
        >
          {priorityStatus || entry.status || "Waiting"}
        </span>
      </div>

      <div className="queue-position">
        <strong>{entry.position}</strong>
        <span>Current position</span>
      </div>

      <div className="queue-detail">
        <span>Pickup point</span>
        <strong>{pickupName}</strong>
      </div>

      <div className="queue-detail">
        <span>Destination point</span>
        <strong>{destinationName}</strong>
      </div>

      <div className="queue-detail">
        <span>Seats needed</span>
        <strong>{entry.seats_needed}</strong>
      </div>

      <div className="queue-detail">
        <span>Gender preference</span>
        <strong>{entry.gender_preference}</strong>
      </div>

      <div className="queue-detail">
        <span>Priority request</span>
        <strong>{entry.priority ? "Requested" : "Standard"}</strong>
      </div>

      <div className="queue-detail">
        <span>Joined</span>
        <strong>{new Date(entry.joined_at).toLocaleString()}</strong>
      </div>

      <p className="queue-helper">
        We will notify you when a vehicle and seat become available.
      </p>
    </section>
  );
}