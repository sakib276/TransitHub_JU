/**
 * Queue Administration page module.
 * @module AdminQueuePage
 */

import { useEffect, useMemo, useState } from "react";
import AdminQueueTable from "../components/AdminQueueTable";
import {
  approvePriorityRequest,
  assignPassenger,
  getPendingPriorityRequests,
  getQueue,
  locations,
  rejectPriorityRequest,
} from "../services/queueService";
import "../styles/adminQueue.css";

/**
 * Passenger queue record.
 *
 * @typedef {Object} QueuePassenger
 * @memberof module:AdminQueuePage
 * @property {number} id Unique passenger identifier.
 * @property {string} token Queue token number.
 * @property {string} name Passenger name.
 * @property {boolean} priority Indicates whether the passenger has priority.
 * @property {string} pickup Passenger pickup location.
 * @property {string} destination Passenger destination.
 * @property {number} seats Number of requested seats.
 * @property {string} gender Gender preference.
 */

/**
 * Admin Queue Page component.
 *
 * Enables administrators to monitor waiting passengers,
 * assign seats manually, and perform automatic seat
 * allocation based on queue order and priority.
 *
 * @memberof module:AdminQueuePage
 * @returns {JSX.Element} Queue administration page.
 */
export default function AdminQueuePage() {
  /** Selected pickup point. */
  const [pickup, setPickup] = useState(String(locations[0].id));

  /** Available seats in the incoming vehicle. */
  const [seats, setSeats] = useState(2);

  /** Current passenger queue. */
  const [queue, setQueue] = useState([]);

  /** Status message displayed after queue operations. */
  const [message, setMessage] = useState("");
  const [priorityRequests, setPriorityRequests] = useState([]);

  const loadQueue = async () => {
    try {
      const data = await getQueue(pickup);
      setQueue(Array.isArray(data) ? data : data.queue || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadQueue();
    getPendingPriorityRequests()
      .then(setPriorityRequests)
      .catch((error) => setMessage(error.message));
  }, [pickup]);

  const reviewPriority = async (request, action) => {
    try {
      const review = action === "approve"
        ? approvePriorityRequest(request.id)
        : rejectPriorityRequest(request.id);
      await review;
      setPriorityRequests((items) => items.filter((item) => item.id !== request.id));
      setMessage(`Priority request ${action}d.`);
      await loadQueue();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
    .replace(/\/api\/?$/, "");

  /**
   * Filtered passenger list for the selected pickup point.
   * Priority passengers are displayed before regular passengers.
   *
   * @type {QueuePassenger[]}
   */
  const passengers = useMemo(
    () =>
      queue
        .filter((item) => String(item.pickup_location_id) === pickup)
        .map((item) => ({
          ...item,
          name: item.passenger_name || `Passenger ${item.passenger_id}`,
          pickup:
            locations.find((location) => location.id === Number(item.pickup_location_id))?.name ||
            "Unknown",
          destination:
            locations.find((location) => location.id === Number(item.destination_location_id))?.name ||
            "Unknown",
          seats: item.seats_needed,
          gender: item.gender_preference || "Any",
        }))
        .sort((a, b) => Number(b.priority) - Number(a.priority)),
    [queue, pickup]
  );

  /**
   * Assigns seats to a selected passenger.
   *
   * Removes the passenger from the queue, updates the
   * remaining seat count, and refreshes queue positions.
   *
   * @param {number} id Passenger identifier.
   * @returns {void}
   */
  const assign = async (id) => {
    const passenger = queue.find((item) => item.id === id);

    if (!passenger || seats < passenger.seats_needed) {
      setMessage(
        "There are not enough available seats for this passenger's request."
      );
      return;
    }

    try {
      const result = await assignPassenger(id, {
        driver_id: 2,
        vehicle_id: 1,
        availableSeats: seats,
      });
      setSeats((value) => value - result.seatsUsed);
      setMessage(result.message);
      await loadQueue();
    } catch (error) {
      setMessage(error.message);
    }
  };

  /**
   * Automatically assigns seats based on queue order.
   *
   * Passengers are assigned only if their requested seats
   * fit within the remaining vehicle capacity.
   *
   * @returns {void}
   */
  const autoAssign = async () => {
    let remainingSeats = seats;
    let assignedSeats = 0;

    try {
      for (const passenger of passengers) {
        if (passenger.seats > remainingSeats) continue;
        const result = await assignPassenger(passenger.id, {
          driver_id: 2,
          vehicle_id: 1,
          availableSeats: remainingSeats,
        });
        remainingSeats -= result.seatsUsed;
        assignedSeats += result.seatsUsed;
      }

      if (!assignedSeats) {
        setMessage("No waiting passenger's seat request fits the available seats.");
        return;
      }

      setSeats(remainingSeats);
      setMessage(`${assignedSeats} seat${assignedSeats > 1 ? "s" : ""} assigned automatically.`);
      await loadQueue();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="queue-layout">
      <header className="header-placeholder">Header</header>

      <div className="queue-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="queue-content">
          <div className="queue-page-title">
            <h1>Queue Administration</h1>
            <p>
              Manage first-come, first-served queues and automatic seat
              assignment.
            </p>
          </div>

          <section className="queue-card admin-controls">
            <div className="queue-form-group">
              <label htmlFor="admin-pickup">Pickup point</label>
              <select
                id="admin-pickup"
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="queue-form-group">
              <label htmlFor="seat-count">Incoming vehicle seats</label>
              <input
                id="seat-count"
                type="number"
                min="0"
                value={seats}
                onChange={(event) => setSeats(Number(event.target.value))}
              />
            </div>

            <button
              className="queue-primary-btn"
              onClick={autoAssign}
            >
              Assign seats automatically
            </button>
          </section>

          {message && <div className="queue-message">{message}</div>}

          <section className="queue-card">
            <h2>Priority requests</h2>
            {priorityRequests.length === 0 ? (
              <p className="queue-empty-state">No pending priority requests.</p>
            ) : (
              priorityRequests.map((request) => (
                <article key={request.id} className="priority-review-row">
                  <div>
                    <strong>{request.reason}</strong>
                    <span>Passenger {request.passenger_id} · Queue entry {request.queue_entry_id}</span>
                  </div>
                  <div className="queue-card-actions">
                    <a href={`${apiOrigin}${request.proof_path}`} target="_blank" rel="noreferrer">
                      View proof
                    </a>
                    <button type="button" onClick={() => reviewPriority(request, "approve")}>Approve</button>
                    <button type="button" onClick={() => reviewPriority(request, "reject")}>Reject</button>
                  </div>
                </article>
              ))
            )}
          </section>

          <AdminQueueTable
            passengers={passengers}
            onAssign={assign}
          />
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}